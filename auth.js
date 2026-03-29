// ============================================================
// auth.js — PSM Authentication & Permissions (Firebase V1)
// 100% Firebase Auth — no local passwords
// ============================================================

var _cloudUser = null;    // Firebase auth user object
var _userProfile = null;  // Profile from Realtime Database

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

// Backward compat aliases
var _supabaseUser = null;
function _checkSupabaseSession() { return _checkSession(); }

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
      _userProfile = data[key];
      // Migrate: save under uid
      await _firebaseDB.ref('profiles/' + _cloudUser.uid).set(_userProfile);
      _syncProfileToLocal(_userProfile);
      return _userProfile;
    }
  } catch(e) { console.warn('[PSM] profile load:', e); }
  return null;
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
    // Restore photo/signature from Firebase profile if available
    if (profile.photo) existing.photo = profile.photo;
    if (profile.signature) existing.signature = profile.signature;
  } else {
    APP.users.push({
      id: 'u_' + Date.now(),
      name: profile.display_name || email.split('@')[0],
      email: email,
      password: null,
      role: profile.role || 'viewer',
      photo: profile.photo || null,
      signature: profile.signature || null,
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

function showSupabaseLogin() { showLoginScreen(); }

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
    _supabaseUser = _cloudUser; // backward compat

    // 2. Load profile (role, permissions)
    await _loadUserProfile();

    // 2b. Check if user is active
    if (_userProfile && _userProfile.is_active === false) {
      await _signOut();
      throw new Error('Compte d\u00e9sactiv\u00e9. Contactez l\u2019administrateur.');
    }

    // 2c. Start real-time sync
    if (typeof startRealtimeSync === 'function') startRealtimeSync();

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
    var _savedTheme = localStorage.getItem('psm_theme') || (APP.settings && APP.settings.theme) || 'dark';
    var _savedUsers = APP.users ? APP.users.slice() : [];
    var _localTs = APP._ts || 0;

    // Load cloud data into a temp variable (don't overwrite APP yet)
    var _cloudTs = 0;
    var _cloudData = null;
    try {
      if (typeof _firebaseDB !== 'undefined' && _firebaseDB) {
        var snap = await _firebaseDB.ref('app_data').once('value');
        if (snap.exists()) {
          var entry = snap.val();
          _cloudData = entry.data || null;
          _cloudTs = (_cloudData && _cloudData._ts) || 0;
        }
      }
    } catch(ex) { console.warn('[PSM] cloud load:', ex); }

    console.log('[PSM] Timestamps — local: ' + _localTs + ', cloud: ' + _cloudTs);

    // Pick the newest version
    if (_cloudData && _cloudTs > _localTs) {
      // Cloud is newer → use cloud data
      console.log('[PSM] Using CLOUD data (newer)');
      // Fix Firebase arrays-as-objects before merging
      if (typeof _fixFirebaseArrays === 'function') _cloudData = _fixFirebaseArrays(_cloudData);
      var _usersBackup = APP.users ? APP.users.slice() : [];
      Object.assign(APP, _cloudData);
      APP.users = _usersBackup; // preserve users
      // Restore images from localStorage cache (not from cloud)
      try {
        var cachedImgs = localStorage.getItem('psm_images_cache');
        if (cachedImgs && typeof _restoreImages === 'function') {
          _restoreImages(APP, JSON.parse(cachedImgs));
        }
      } catch(e) {}
    } else if (_localTs > 0) {
      // Local is newer or equal → keep localStorage (already loaded in initApp)
      console.log('[PSM] Using LOCAL data (newer or equal)');
      // Push local data to cloud so it's up to date
      if (typeof _doSaveToCloud === 'function') {
        try { await _doSaveToCloud(); } catch(ex) {}
      }
    }

    // Restore local-only settings
    APP.users = _savedUsers;
    if (!APP.settings) APP.settings = {};
    APP.settings.theme = _savedTheme;

    // 5b. Re-sync profile after cloud load (cloud may have overwritten APP.users)
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

    // 5c. Start real-time sync
    if (typeof startRealtimeSync === 'function') startRealtimeSync();

    // 6. Log activity
    logActivity('login', 'Connexion: ' + (localUser ? localUser.name : email) + ' (' + (localUser ? localUser.role : 'unknown') + ')');

    // 7. Remove overlay
    var overlay = document.getElementById('login-overlay');
    if (overlay) overlay.remove();

    // 7b. Load user-specific preferences (theme, background)
    try {
      var _prefs = await _loadUserPrefs();
      if (_prefs) {
        if (_prefs.theme) { APP.settings.theme = _prefs.theme; if(typeof applyTheme==='function') applyTheme(_prefs.theme); }
        if (_prefs._dynamicBg !== undefined) APP.settings._dynamicBg = _prefs._dynamicBg;
        if (_prefs._dynamicBgIntensity !== undefined) APP.settings._dynamicBgIntensity = _prefs._dynamicBgIntensity;
        if (_prefs._hiddenPages !== undefined) APP.settings._hiddenPages = _prefs._hiddenPages;
      }
    } catch(ex) { console.warn('[PSM] load prefs:', ex); }

    // 8. Re-render full UI
    if (typeof _finishAppInit === 'function') await _finishAppInit();
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

async function _adminUpdateProfile(email, displayName, role, permissions, isActive, photo, signature) {
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
  if (typeof stopRealtimeSync === 'function') stopRealtimeSync();
  logActivity('logout', 'D\u00e9connexion');
  sessionStorage.removeItem('psm_user');
  _cloudUser = null;
  _supabaseUser = null;
  _userProfile = null;
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
  sessionStorage.setItem('psm_user', userId);
  if (typeof renderSidebar === 'function') renderSidebar();
  if (typeof showPage === 'function') showPage('dashboard');
  if (typeof updateUserBadge === 'function') updateUserBadge();
}
