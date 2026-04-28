// ============================================================
// auth.js — PSM Authentication & Permissions (Firebase V1)
// 100% Firebase Auth — no local passwords
// ============================================================

var _cloudUser = null;    // Firebase auth user object
var _userProfile = null;  // Profile from Realtime Database
var _profileListenerRef = null;  // DatabaseReference attached after login (C3)
var _initialRole = null;          // role captured at login, detects changes (C3)

// ── Firebase Auth ──────────────────────────────────────────

async function _checkSession() {
  if (!_firebaseAuth) return null;
  return new Promise(function(resolve) {
    var unsub = _firebaseAuth.onAuthStateChanged(function(user) {
      unsub();
      if (user) {
        _cloudUser = user;
        resolve({ user: user });
      } else {
        resolve(null);
      }
    });
    // Timeout after 5s
    setTimeout(function() { unsub(); resolve(null); }, 5000);
  });
}

async function _signIn(email, password) {
  if (!_firebaseAuth) throw new Error('Firebase non disponible');
  var result = await _firebaseAuth.signInWithEmailAndPassword(email, password);
  _cloudUser = result.user;
  return result;
}

async function _signOut() {
  if (_firebaseAuth) await _firebaseAuth.signOut();
  _cloudUser = null;
  _userProfile = null;
}

// Supabase backward compat removed (migration terminée 2026-04-15)

// ── Profile loading (Firebase Realtime Database) ──────────

async function _loadUserProfile() {
  if (!_firebaseDB || !_cloudUser) return null;
  try {
    var snap = await _firebaseDB.ref('profiles/' + _cloudUser.uid).once('value');
    if (snap.exists()) {
      _userProfile = snap.val();
      _syncProfileToLocal(_userProfile);
      return _userProfile;
    }
    // If no profile exists yet, check by email (admin bootstrap)
    var allSnap = await _firebaseDB.ref('profiles').orderByChild('email').equalTo(_cloudUser.email).once('value');
    if (allSnap.exists()) {
      var data = allSnap.val();
      var key = Object.keys(data)[0];
      var foundProfile = data[key];
      // Soft-delete check : ne PAS migrer un profil désactivé (is_active:false).
      // Sans ça, un user "supprimé" pourrait se reconnecter et le bootstrap
      // recréerait son profil à profiles/{uid} -> login réussi malgré soft-delete.
      if (foundProfile && foundProfile.is_active === false) {
        console.log('[PSM] Bootstrap skipped : profile found but is_active:false');
        return null;
      }
      _userProfile = foundProfile;
      // Migrate: save under uid
      await _firebaseDB.ref('profiles/' + _cloudUser.uid).set(_userProfile);
      _syncProfileToLocal(_userProfile);
      return _userProfile;
    }
  } catch(e) { console.warn('[PSM] profile load:', e); }
  return null;
}

// ── Profile listener: revoke access in real time (C3) ─────

function _startProfileListener() {
  if (!_firebaseDB || !_cloudUser || _profileListenerRef) return;
  _initialRole = _userProfile ? _userProfile.role : null;
  _profileListenerRef = _firebaseDB.ref('profiles/' + _cloudUser.uid);
  _profileListenerRef.on('value', function(snap) {
    try {
      if (!snap.exists()) { _forceLogout('Votre compte a \u00e9t\u00e9 supprim\u00e9.'); return; }
      var p = snap.val();
      if (p.is_active === false) { _forceLogout('Votre compte a \u00e9t\u00e9 d\u00e9sactiv\u00e9 par un administrateur.'); return; }
      if (_initialRole && p.role !== _initialRole) { _forceLogout('Votre r\u00f4le a chang\u00e9. Reconnectez-vous pour appliquer les nouveaux droits.'); return; }
      _userProfile = p;
      if (typeof _syncProfileToLocal === 'function') _syncProfileToLocal(p);
      if (typeof updateUserBadge === 'function') updateUserBadge();
    } catch(e) { console.warn('[PSM] profile listener:', e); }
  });
}

function _stopProfileListener() {
  if (_profileListenerRef) { try { _profileListenerRef.off(); } catch(e) {} _profileListenerRef = null; }
  _initialRole = null;
}

// ── Auto-logout apres inactivite (10 min) ─────────────────

var _IDLE_TIMEOUT_MS = 10 * 60 * 1000;  // 10 minutes
var _IDLE_WARN_MS    = 30 * 1000;        // warning 30s avant logout
var _idleTimer = null;
var _idleWarnTimer = null;
var _idleEvents = ['click', 'keydown', 'scroll', 'touchstart', 'mousemove'];
var _idleListenerAttached = false;

function _resetIdleTimer() {
  if (_idleTimer) clearTimeout(_idleTimer);
  if (_idleWarnTimer) clearTimeout(_idleWarnTimer);
  // Retire le warning s'il est affich\u00e9
  var warn = document.getElementById('psm-idle-warning');
  if (warn) warn.remove();
  // Warning 30s avant timeout
  _idleWarnTimer = setTimeout(_showIdleWarning, _IDLE_TIMEOUT_MS - _IDLE_WARN_MS);
  // Logout effectif
  _idleTimer = setTimeout(_handleIdleLogout, _IDLE_TIMEOUT_MS);
}

function _showIdleWarning() {
  if (document.getElementById('psm-idle-warning')) return;
  var el = document.createElement('div');
  el.id = 'psm-idle-warning';
  el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99998;background:#1a1a2e;border:2px solid #f5a623;border-radius:12px;padding:16px 20px;box-shadow:0 8px 32px rgba(0,0,0,.5);max-width:360px;font-family:inherit';
  el.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">'
    + '<span style="font-size:22px">\u23f3</span>'
    + '<div><div style="font-weight:700;font-size:14px;color:#fff">D\u00e9connexion imminente</div>'
    + '<div style="font-size:12px;color:#aaa">Inactif depuis 9m30s. D\u00e9connexion dans <span id="psm-idle-count">30</span>s.</div></div>'
    + '</div>'
    + '<button onclick="_resetIdleTimer()" style="width:100%;padding:10px;background:#f5a623;color:#000;border:none;border-radius:8px;font-weight:700;cursor:pointer">Rester connect\u00e9</button>';
  document.body.appendChild(el);
  // Countdown visuel
  var secs = 30;
  var cd = setInterval(function() {
    secs--;
    var cel = document.getElementById('psm-idle-count');
    if (cel) cel.textContent = secs;
    if (secs <= 0 || !document.getElementById('psm-idle-warning')) clearInterval(cd);
  }, 1000);
}

function _handleIdleLogout() {
  if (window._psmForcingLogout) return;
  console.log('[PSM] Auto-logout : 10 min d\u2019inactivit\u00e9');
  if (typeof notify === 'function') notify('\ud83d\udd12 D\u00e9connexion automatique (inactivit\u00e9)', 'warning');
  try { logoutUser(); } catch(e) {}
}

function _startIdleTimer() {
  if (_idleListenerAttached) return;
  _idleEvents.forEach(function(evt) { document.addEventListener(evt, _resetIdleTimer, { passive: true }); });
  _idleListenerAttached = true;
  _resetIdleTimer();
}

function _stopIdleTimer() {
  if (_idleTimer) { clearTimeout(_idleTimer); _idleTimer = null; }
  if (_idleWarnTimer) { clearTimeout(_idleWarnTimer); _idleWarnTimer = null; }
  if (_idleListenerAttached) {
    _idleEvents.forEach(function(evt) { document.removeEventListener(evt, _resetIdleTimer); });
    _idleListenerAttached = false;
  }
  var warn = document.getElementById('psm-idle-warning');
  if (warn) warn.remove();
}

function _forceLogout(reason) {
  if (window._psmForcingLogout) return;
  window._psmForcingLogout = true;
  try { if (typeof notify === 'function') notify(reason, 'error', 8000); else alert(reason); } catch(e) {}
  setTimeout(function() { try { logoutUser(); } catch(e) {} window._psmForcingLogout = false; }, 400);
}

function _syncProfileToLocal(profile) {
  if (!profile || typeof APP === 'undefined') return;
  if (!APP.users) APP.users = [];
  var email = profile.email || (_cloudUser && _cloudUser.email);
  if (!email) return;
  var existing = APP.users.find(function(u) { return u.email && u.email.toLowerCase() === email.toLowerCase(); });
  if (existing) {
    existing.name = profile.display_name || existing.name;
    existing.role = profile.role || existing.role || 'viewer';  // Firebase role wins, keep existing if missing
    existing.permissions = profile.permissions || existing.permissions;
    // Restore photo/signature/matricule from Firebase profile if available
    if (profile.photo) existing.photo = profile.photo;
    if (profile.signature) existing.signature = profile.signature;
    if (profile.matricule) existing.matricule = profile.matricule;
    if (profile.signatureKey) existing.signatureKey = profile.signatureKey;
  } else {
    APP.users.push({
      id: 'u_' + Date.now(),
      name: profile.display_name || email.split('@')[0],
      email: email,
      password: null,
      role: profile.role || 'viewer',
      photo: profile.photo || null,
      signature: profile.signature || null,
      matricule: profile.matricule || null,
      signatureKey: profile.signatureKey || null,
      permissions: profile.permissions || null,
      createdAt: Date.now(),
      _version: 1
    });
  }
}

// ── Activity Log ───────────────────────────────────────────

async function logActivity(action, details) {
  if (typeof APP !== 'undefined') {
    if (!APP._activityLog) APP._activityLog = [];
    APP._activityLog.unshift({
      ts: Date.now(),
      email: (_cloudUser && _cloudUser.email) || (_currentUser() && _currentUser().email) || 'unknown',
      user: (_currentUser() && _currentUser().name) || 'unknown',
      action: action,
      details: details || ''
    });
    if (APP._activityLog.length > 500) APP._activityLog = APP._activityLog.slice(0, 500);
  }
  if (_firebaseDB && _cloudUser) {
    try {
      await _firebaseDB.ref('activity_log').push({
        user_email: _cloudUser.email,
        action: action,
        details: details || '',
        created_at: new Date().toISOString()
      });
    } catch(e) { /* silent */ }
  }
}

// ── Login Screen ───────────────────────────────────────────

function showLoginScreen() {
  var old = document.getElementById('login-overlay');
  if (old) old.remove();
  old = document.getElementById('supabase-login-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'login-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,12,25,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:inherit';

  overlay.innerHTML = ''
    + '<div style="background:#141627;border:1px solid #2a2d45;border-radius:16px;padding:40px 36px;max-width:420px;width:92%;box-shadow:0 24px 64px rgba(0,0,0,.7)">'
    + '<div style="text-align:center;margin-bottom:28px">'
    + '<div style="font-size:36px;margin-bottom:8px">\uD83D\uDD10</div>'
    + '<h2 style="margin:0 0 6px;font-size:22px;color:#f0f2f8;font-weight:800">Perfect\u2019s Stock Manager</h2>'
    + '<p style="color:#8888aa;font-size:13px;margin:0">Connectez-vous avec votre compte</p>'
    + '</div>'
    + '<div id="login-error" style="display:none;background:#3d1525;border:1px solid #ff4466;border-radius:8px;padding:10px 14px;margin-bottom:16px;color:#ff8899;font-size:13px"></div>'
    + '<form id="login-form" onsubmit="return _handleLogin(event)" style="display:flex;flex-direction:column;gap:14px">'
    + '<div>'
    + '<label style="font-size:12px;color:#8888aa;display:block;margin-bottom:4px">Email</label>'
    + '<input id="login-email" type="email" required autocomplete="email" placeholder="votre@email.com" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<div>'
    + '<label style="font-size:12px;color:#8888aa;display:block;margin-bottom:4px">Mot de passe</label>'
    + '<input id="login-password" type="password" required autocomplete="current-password" placeholder="Votre mot de passe" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<button id="login-submit" type="submit" style="padding:13px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s">'
    + 'Se connecter</button>'
    + '</form>'
    + '<p style="color:#444;font-size:11px;text-align:center;margin:14px 0 0">Demandez vos identifiants \u00e0 l\u2019administrateur</p>'
    + '</div>';

  document.body.appendChild(overlay);
  setTimeout(function() {
    var el = document.getElementById('login-email');
    if (el) el.focus();
  }, 100);
}


// ── Handle Login ───────────────────────────────────────────

async function _handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('login-email').value.trim();
  var password = document.getElementById('login-password').value;
  var errEl = document.getElementById('login-error');
  var btn = document.getElementById('login-submit');

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.textContent = 'Connexion...';

  try {
    // 1. Authenticate via Firebase
    if (!_firebaseAuth) {
      throw new Error('Service de connexion indisponible. V\u00e9rifiez votre connexion internet.');
    }
    await _signIn(email, password);
    _onlineMode = true;

    // F8: Set online presence
    if (typeof _firebaseDB !== 'undefined' && _firebaseDB && _cloudUser) {
      var _presenceRef = _firebaseDB.ref('profiles/' + _cloudUser.uid + '/online');
      var _lastSeenRef = _firebaseDB.ref('profiles/' + _cloudUser.uid + '/lastSeen');
      _presenceRef.onDisconnect().set(false);
      _lastSeenRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      _presenceRef.set(true);
    }

    // F9: Create login session record
    var _psmSessionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    window._psmSessionId = _psmSessionId;
    window._psmLoginAt = Date.now();
    if (typeof _firebaseDB !== 'undefined' && _firebaseDB && _cloudUser) {
      try {
        var _sessionRef = _firebaseDB.ref('sessions/' + _cloudUser.uid + '/' + _psmSessionId);
        _sessionRef.onDisconnect().update({
          logoutAt: firebase.database.ServerValue.TIMESTAMP,
          status: 'disconnected'
        });
        _sessionRef.set({
          email: _cloudUser.email || '',
          userName: (_userProfile && _userProfile.display_name) || _cloudUser.email || '',
          loginAt: Date.now(),
          logoutAt: null,
          status: 'active',
          userAgent: navigator.userAgent.slice(0, 100)
        }).catch(function() {});
      } catch(e) {}
    }

    // 2a. Kick off cloud ts read in parallel with profile load (saves ~150-300ms)
    var _tsPromise = null;
    if (typeof _firebaseDB !== 'undefined' && _firebaseDB) {
      _tsPromise = _firebaseDB.ref('app_data/data/_ts').once('value').catch(function(ex) {
        console.warn('[PSM] cloud ts read (parallel):', ex.message || ex); return null;
      });
    }

    // 2. Load profile (role, permissions)
    await _loadUserProfile();

    // 2b. Check if user is active
    if (_userProfile && _userProfile.is_active === false) {
      await _signOut();
      throw new Error('Compte d\u00e9sactiv\u00e9. Contactez l\u2019administrateur.');
    }

    // 3. Sync local user
    if (!APP.users) APP.users = [];
    var localUser = APP.users.find(function(u) { return u.email && u.email.toLowerCase() === email.toLowerCase(); });
    if (!localUser) {
      // If no profile in Firebase, user was not created by admin
      if (!_userProfile) {
        await _signOut();
        throw new Error('Compte non autoris\u00e9. Demandez \u00e0 l\u2019administrateur de cr\u00e9er votre acc\u00e8s.');
      }
      localUser = {
        id: 'u_' + Date.now(),
        name: (_userProfile && _userProfile.display_name) || email.split('@')[0],
        email: email,
        password: null,
        role: (_userProfile && _userProfile.role) || 'viewer',
        photo: null,
        signature: null,
        permissions: (_userProfile && _userProfile.permissions) || null,
        createdAt: Date.now(),
        _version: 1
      };
      APP.users.push(localUser);
    } else {
      if (_userProfile) {
        localUser.role = _userProfile.role || localUser.role;
        if (_userProfile.display_name) localUser.name = _userProfile.display_name;
        if (_userProfile.permissions) localUser.permissions = _userProfile.permissions;
      }
    }

    // 4. Set session (don't saveDB yet — load cloud first)
    sessionStorage.setItem('psm_user', localUser.id);

    // 5. Load cloud data, compare with localStorage, pick the newest
    // GA6: thème vient de Firebase user prefs (chargé plus bas) ou du défaut APP.settings
    var _savedTheme = (APP.settings && APP.settings.theme) || 'dark';
    var _savedUsers = APP.users ? APP.users.slice() : [];
    var _localTs = APP._ts || 0;

    // ═══════════════════════════════════════════════════════════════════════
    // ARCHITECTURE CLOUD-FIRST : Login = FETCH uniquement. Jamais de PUSH.
    // Le cloud est la source de vérité absolue.
    // Seuls saveDB() (action utilisateur) et la restauration admin peuvent
    // écrire vers le cloud. Le login ne pousse jamais — peu importe les timestamps.
    // ═══════════════════════════════════════════════════════════════════════
    var _cloudData = null;

    // Toujours lire les données complètes depuis le cloud (8s timeout)
    try {
      var _snapP = _firebaseDB.ref('app_data/data').once('value');
      var _toP = new Promise(function(_, rej) {
        setTimeout(function() { rej(new Error('timeout')); }, 8000);
      });
      var _fullSnap = await Promise.race([_snapP, _toP]);
      if (_fullSnap && _fullSnap.exists()) _cloudData = _fullSnap.val();
    } catch(ex) {
      console.warn('[PSM] cloud fetch:', ex.message || ex);
    }

    // Déterminer si le cloud a des données réelles
    var _cloudHasData = _cloudData && (
      (_cloudData.bons||[]).length > 0 ||
      (_cloudData.mouvements||[]).length > 0 ||
      (_cloudData.articles||[]).some(function(a){ return a.stock > 0; })
    );

    if (_cloudHasData) {
      // ── Cas normal : cloud a des données → les charger ──────────────────
      if (typeof _fixFirebaseArrays === 'function') _cloudData = _fixFirebaseArrays(_cloudData);
      var _usersBackup = APP.users ? APP.users.slice() : [];
      Object.assign(APP, _cloudData);
      if (!('users' in _cloudData)) APP.users = _usersBackup;
      _savedDataLoaded = true;
      try {
        var cachedImgs = localStorage.getItem('psm_images_cache');
        if (cachedImgs && typeof _restoreImages === 'function') {
          _restoreImages(APP, JSON.parse(cachedImgs));
        }
      } catch(e) {}
      console.log('[PSM] Cloud data loaded:', (APP.bons||[]).length, 'bons,', (APP.mouvements||[]).length, 'mvts');
    } else {
      // ── Cas récupération : cloud vide/corrompu → PSm Saves (admin) ──────
      console.warn('[PSM] Cloud vide ou corrompu. Tentative PSm Saves...');
      if (typeof _dirHandle !== 'undefined' && _dirHandle && typeof _loadFromDir === 'function') {
        try {
          await _loadFromDir();
          var _fileHasData = (APP.bons||[]).length > 0 || (APP.mouvements||[]).length > 0;
          if (_fileHasData) {
            console.log('[PSM] Restauré depuis PSm Saves:', (APP.bons||[]).length, 'bons');
            if (typeof notify === 'function') notify(
              '🔄 Données restaurées depuis PSm Saves — synchronisation en cours...', 'success'
            );
            // Pousser le fichier vers le cloud pour rétablir la source de vérité
            APP._ts = Date.now();
            setTimeout(function() {
              if (typeof _doSaveToCloud === 'function') {
                _doSaveToCloud().then(function() {
                  console.log('[PSM] PSm Saves -> cloud sync terminé');
                }).catch(function(e) { console.warn('[PSM] Sync PSm Saves -> cloud:', e); });
              }
            }, 1500);
          } else {
            console.warn('[PSM] PSm Saves aussi vide. Aucune donnée disponible.');
          }
        } catch(e) {
          console.warn('[PSM] PSm Saves récupération:', e);
        }
      } else {
        console.warn('[PSM] Cloud vide + PSm Saves non configuré. Admin: configurez PSm Saves dans Paramètres.');
      }
    }
    // ── Fin du bloc login : aucun push automatique ───────────────────────

    // Restore local-only settings (users are now cloud-authoritative — see cloud merge above)
    if (!APP.settings) APP.settings = {};
    APP.settings.theme = _savedTheme;

    // 5b. Re-sync profile after cloud load (ensures current user is present in APP.users)
    if (_userProfile) _syncProfileToLocal(_userProfile);
    // Deduplicate users (cloud + local may have created duplicates)
    if (typeof _deduplicateUsers === 'function') _deduplicateUsers();
    localUser = APP.users.find(function(u) { return u.email && u.email.toLowerCase() === email.toLowerCase(); });
    if (localUser) {
      sessionStorage.setItem('psm_user', localUser.id);
      console.log('[PSM] Session set for: ' + localUser.name + ' (' + localUser.email + ') role=' + localUser.role + ' id=' + localUser.id);
    } else {
      console.error('[PSM] No local user found for email: ' + email);
      console.log('[PSM] APP.users:', APP.users.map(function(u) { return u.email + '/' + u.name; }));
    }

    // 5c. Always start real-time sync after login for instant cross-device updates
    if (typeof startRealtimeSync === 'function') startRealtimeSync();

    // 5c-bis. Profile listener — force-logout on profile delete/disable/role change (C3)
    _startProfileListener();

    // 5c-ter. Auto-logout apres 10 min d'inactivite
    _startIdleTimer();

    // 5c-quater. Archivage automatique si dernier run > 30 jours
    // Déclenché au login pour ne pas dépendre qu'un admin visite la page Archives.
    if (typeof maybeAutoArchive === 'function') {
      setTimeout(function() { maybeAutoArchive().catch(function(){}); }, 3000);
    }

    // 5d. Purge old cloud snapshots (keep 7 days)
    if (typeof _purgeOldCloudSnapshots === 'function') {
      try { _purgeOldCloudSnapshots(); } catch(e) {}
    }

    // 6. Log activity
    logActivity('login', 'Connexion: ' + (localUser ? localUser.name : email) + ' (' + (localUser ? localUser.role : 'unknown') + ')');

    // GA7: purger l'éventuel cache psm_pro_db encore présent (migration vers cloud-only)
    try { localStorage.removeItem('psm_pro_db'); localStorage.removeItem('psm_theme'); } catch(e) {}

    // 7b. Apply user-specific preferences (theme, background) — already loaded in _userProfile
    try {
      var _prefs = (_userProfile && _userProfile.prefs) || null;
      if (_prefs) {
        console.log('[PSM] User prefs loaded:', _prefs);
        if (_prefs.theme) { APP.settings.theme = _prefs.theme; if(typeof applyTheme==='function') applyTheme(_prefs.theme); }
        if (_prefs._dynamicBg !== undefined) APP.settings._dynamicBg = _prefs._dynamicBg;
        if (_prefs._dynamicBgIntensity !== undefined) APP.settings._dynamicBgIntensity = _prefs._dynamicBgIntensity;
        if (_prefs._hiddenPages !== undefined) APP.settings._hiddenPages = _prefs._hiddenPages;
      }
    } catch(ex) { console.warn('[PSM] apply prefs:', ex); }

    // 8. Re-render full UI, then remove overlay (avoids flash of empty page)
    try {
      if (typeof _finishAppInit === 'function') await _finishAppInit();
    } finally {
      var overlay = document.getElementById('login-overlay');
      if (overlay) overlay.remove();
    }
    // Force badge update (in case _finishAppInit missed it)
    if (typeof updateUserBadge === 'function') updateUserBadge();
    if (typeof notify === 'function') notify('\uD83D\uDC4B Bienvenue ' + (localUser ? localUser.name : email) + ' !', 'success');

  } catch(err) {
    var msg = err.message || String(err);
    if (msg.includes('wrong-password') || msg.includes('user-not-found') || msg.includes('invalid-credential') || msg.includes('INVALID_LOGIN_CREDENTIALS')) {
      msg = 'Email ou mot de passe incorrect';
    } else if (msg.includes('too-many-requests')) {
      msg = 'Trop de tentatives. R\u00e9essayez dans quelques minutes.';
    } else if (msg.includes('network')) {
      msg = 'Impossible de contacter le serveur. V\u00e9rifiez votre connexion internet.';
    }
    errEl.textContent = msg;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Se connecter';
  }
  return false;
}

// ── Admin: Create user via Firebase REST API ───────────────
// Uses REST API to avoid changing the admin's session

async function _adminCreateSupabaseUser(email, password, displayName, role, permissions) {
  if (!_firebaseAuth || !_cloudUser) throw new Error('Firebase non disponible');

  // 1. Create auth account via REST API (doesn't affect current session)
  var response = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + firebaseConfig.apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: false
      })
    }
  );
  var data = await response.json();
  if (data.error) {
    var errMsg = data.error.message || 'Erreur inconnue';
    if (errMsg.includes('EMAIL_EXISTS')) errMsg = 'Cet email a d\u00e9j\u00e0 un compte';
    if (errMsg.includes('WEAK_PASSWORD')) errMsg = 'Mot de passe trop faible (min. 6 caract\u00e8res)';
    if (errMsg.includes('INVALID_EMAIL')) errMsg = 'Email invalide';
    throw new Error(errMsg);
  }

  var newUid = data.localId;

  // 2. Save profile to Realtime Database
  var profileData = {
    email: email,
    display_name: displayName,
    role: role,
    permissions: permissions || {},
    created_by: _cloudUser.email,
    created_at: new Date().toISOString(),
    is_active: true
  };

  await _firebaseDB.ref('profiles/' + newUid).set(profileData);

  logActivity('admin_create_user', 'Cr\u00e9ation: ' + email + ' (r\u00f4le: ' + role + ')');
  return { user: { uid: newUid, email: email } };
}

async function _adminUpdateProfile(email, displayName, role, permissions, isActive, photo, signature, matricule, signatureKey) {
  if (!_firebaseDB) return;
  // Find profile by email
  var snap = await _firebaseDB.ref('profiles').orderByChild('email').equalTo(email).once('value');
  if (!snap.exists()) return;
  var uid = Object.keys(snap.val())[0];
  var updates = {};
  if (displayName !== undefined) updates.display_name = displayName;
  if (role !== undefined) updates.role = role;
  if (permissions !== undefined) updates.permissions = permissions;
  if (isActive !== undefined) updates.is_active = isActive;
  if (photo) updates.photo = photo;
  if (signature) updates.signature = signature;
  if (matricule !== undefined) updates.matricule = matricule;
  if (signatureKey !== undefined) updates.signatureKey = signatureKey;
  await _firebaseDB.ref('profiles/' + uid).update(updates);
  logActivity('admin_update_user', 'Modification: ' + email + ' -> ' + role);
}

async function _adminDeactivateUser(email) {
  await _adminUpdateProfile(email, undefined, undefined, undefined, false);
  logActivity('admin_deactivate_user', 'D\u00e9sactivation: ' + email);
}

async function _adminGetAllProfiles() {
  if (!_firebaseDB) return [];
  try {
    var snap = await _firebaseDB.ref('profiles').once('value');
    if (!snap.exists()) return [];
    var data = snap.val();
    return Object.keys(data).map(function(uid) {
      var p = data[uid];
      p._uid = uid;
      return p;
    });
  } catch(e) { console.warn('[PSM] profiles fetch:', e); return []; }
}

async function _adminGetActivityLog(limit) {
  if (!_firebaseDB) return [];
  try {
    var q = _firebaseDB.ref('activity_log').orderByChild('created_at').limitToLast(limit || 50);
    var snap = await q.once('value');
    if (!snap.exists()) return [];
    var arr = [];
    snap.forEach(function(child) { arr.push(child.val()); });
    return arr.reverse();
  } catch(e) { return []; }
}

// ── Local session helpers ──────────────────────────────────


// ── Per-user preferences (theme, background, etc.) ──
async function _saveUserPrefs(prefs) {
  if (!_firebaseDB || !_cloudUser) return;
  try {
    await _firebaseDB.ref('profiles/' + _cloudUser.uid + '/prefs').set(prefs);
    console.log('[PSM] User prefs saved');
  } catch(e) { console.warn('[PSM] _saveUserPrefs:', e); }
}

async function _loadUserPrefs() {
  if (!_firebaseDB || !_cloudUser) return null;
  try {
    var snap = await _firebaseDB.ref('profiles/' + _cloudUser.uid + '/prefs').once('value');
    if (snap.exists()) {
      var prefs = snap.val();
      console.log('[PSM] User prefs loaded:', prefs);
      return prefs;
    }
  } catch(e) { console.warn('[PSM] _loadUserPrefs:', e); }
  return null;
}

function _currentUser() {
  // Primary source: Firebase profile (stable, not affected by cloud sync)
  if (_userProfile && _userProfile.email) {
    return {
      id: _cloudUser ? _cloudUser.uid : sessionStorage.getItem('psm_user'),
      name: _userProfile.display_name || _userProfile.email.split('@')[0],
      email: _userProfile.email,
      role: _userProfile.role || 'viewer',
      permissions: _userProfile.permissions || null,
      photo: _userProfile.photo || null,
      signature: _userProfile.signature || null
    };
  }
  // Fallback: local APP.users (offline mode)
  var id = sessionStorage.getItem('psm_user');
  if (!id) return null;
  return (APP.users || []).find(function(u) { return u.id === id; }) || null;
}

function hasPermission(pageId, action) {
  var u = _currentUser();
  if (!u) return false;
  // Firebase profile is the source of truth for role/permissions
  var role = (_userProfile && _userProfile.role) || u.role;
  if (role === 'admin') return true;
  // Check Firebase profile permissions first
  var perms = (_userProfile && _userProfile.permissions) || u.permissions;
  if (!perms) return false;
  var perm = perms[pageId];
  if (!perm) return false;
  return perm[action] === true;
}

function canView(pageId) { return hasPermission(pageId, 'view'); }
function canEdit(pageId) { return hasPermission(pageId, 'edit'); }

// ── Logout ─────────────────────────────────────────────────

function logoutUser() {
  _stopProfileListener();
  _stopIdleTimer();
  if (typeof stopRealtimeSync === 'function') stopRealtimeSync();
  logActivity('logout', 'D\u00e9connexion');
  sessionStorage.removeItem('psm_user');
  // Sauvegarder uid AVANT de nullifier _cloudUser (nécessaire pour F8/F9)
  var _logoutUid = _cloudUser ? _cloudUser.uid : null;
  _cloudUser = null;
  _userProfile = null;
  // F8: Clear presence on logout
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && _logoutUid) {
    try {
      _firebaseDB.ref('profiles/' + _logoutUid + '/online').set(false);
      _firebaseDB.ref('profiles/' + _logoutUid + '/lastSeen').set(firebase.database.ServerValue.TIMESTAMP);
    } catch(e) {}
  }
  // F9: Record logout in session journal
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && _logoutUid && window._psmSessionId) {
    try {
      var _dur = window._psmLoginAt ? Date.now() - window._psmLoginAt : 0;
      _firebaseDB.ref('sessions/' + _logoutUid + '/' + window._psmSessionId).update({
        logoutAt: firebase.database.ServerValue.TIMESTAMP,
        duration: _dur,
        status: 'clean'
      }).catch(function() {});
      window._psmSessionId = null;
      window._psmLoginAt = null;
    } catch(e) {}
  }
  if (_firebaseAuth) {
    _firebaseAuth.signOut().catch(function(){});
  }
  showLoginScreen();
}

// ── User badge (topbar) ────────────────────────────────────

function updateUserBadge() {
  var el = document.getElementById('topbar-user');
  if (!el) return;
  var u = _currentUser();
  if (!u) return;
  var photoHtml = u.photo
    ? '<img src="' + u.photo + '" style="width:28px;height:28px;object-fit:cover;border-radius:50%">'
    : u.name.charAt(0).toUpperCase();
  var onlineIcon = _cloudUser ? '<span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;margin-left:4px" title="En ligne"></span>' : '';
  var roleMeta = (typeof ROLE_TEMPLATES !== 'undefined' && ROLE_TEMPLATES[u.role]) ? ROLE_TEMPLATES[u.role] : null;
  var roleTag = roleMeta ? '<span style="font-size:9px;background:' + roleMeta.color + '22;color:' + roleMeta.color + ';padding:1px 6px;border-radius:99px;margin-left:4px">' + roleMeta.label + '</span>' : '';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="showUserSwitchMenu(this)">'
    + '<div style="width:28px;height:28px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--accent);overflow:hidden">' + photoHtml + '</div>'
    + '<span style="font-size:12px;color:var(--text-1);font-weight:600">' + u.name + onlineIcon + '</span>'
    + roleTag
    + '<span style="font-size:10px;color:var(--text-3)">\u25be</span>'
    + '</div>';
}

function showUserSwitchMenu(el) {
  var existing = document.getElementById('user-switch-menu');
  if (existing) { existing.remove(); return; }
  var rect = el.getBoundingClientRect();
  var menu = document.createElement('div');
  menu.id = 'user-switch-menu';
  menu.style.cssText = 'position:fixed;top:' + (rect.bottom + 4) + 'px;right:' + (window.innerWidth - rect.right) + 'px;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 24px rgba(0,0,0,.3);z-index:999;min-width:220px;padding:6px';
  var u = _currentUser();
  var html = '';
  if (u) {
    var roleMeta = (typeof ROLE_TEMPLATES !== 'undefined' && ROLE_TEMPLATES[u.role]) ? ROLE_TEMPLATES[u.role] : null;
    html += '<div style="padding:10px 10px 8px;border-bottom:1px solid var(--border);margin-bottom:4px">'
      + '<div style="font-weight:700;font-size:13px;color:var(--text-0)">' + u.name + '</div>'
      + '<div style="font-size:11px;color:var(--text-3)">' + (u.email || '') + '</div>'
      + (roleMeta ? '<span style="font-size:9px;background:' + roleMeta.color + '22;color:' + roleMeta.color + ';padding:1px 6px;border-radius:99px;display:inline-block;margin-top:4px">' + roleMeta.label + '</span>' : '')
      + '</div>';
  }
  html += '<div style="padding:6px 10px;cursor:pointer;border-radius:6px;font-size:13px;color:var(--danger)" '
    + 'onmouseover="this.style.background=\'rgba(255,50,50,0.1)\'" onmouseout="this.style.background=\'none\'" '
    + 'onclick="document.getElementById(\'user-switch-menu\').remove();logoutUser()">'
    + '\uD83D\uDEAA D\u00e9connexion</div>';
  menu.innerHTML = html;
  document.body.appendChild(menu);
  setTimeout(function() {
    function closeMenu(ev) { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', closeMenu); } }
    document.addEventListener('click', closeMenu);
  }, 10);
}

// ── Login function for app.js compat ───────────────────────

function loginAs(userId) {
  // Garde : loginAs() nécessite une session Firebase active pour éviter l'usurpation via console
  if (!_cloudUser) {
    console.warn('[PSM] loginAs() bloqué : aucune session Firebase active');
    if (typeof notify === 'function') notify('Connexion Firebase requise pour changer de compte', 'warning');
    return;
  }
  sessionStorage.setItem('psm_user', userId);
  if (typeof renderSidebar === 'function') renderSidebar();
  if (typeof showPage === 'function') showPage('dashboard');
  if (typeof updateUserBadge === 'function') updateUserBadge();
}
