// ============================================================
// auth.js — PSM Authentication & Permissions
// Supabase Auth (email+password) + local role-based permissions.
// ============================================================

// ── Supabase Auth helpers ─────────────────────────────────────────

var _supabaseUser = null; // Supabase auth.users record

async function _checkSupabaseSession() {
  if (!_supabase) return null;
  try {
    var result = await _supabase.auth.getSession();
    if (result.data && result.data.session) {
      _supabaseUser = result.data.session.user;
      return result.data.session;
    }
  } catch(e) { console.warn('[PSM] session check:', e); }
  return null;
}

async function _supabaseSignUp(email, password) {
  if (!_supabase) throw new Error('Supabase non disponible');
  var result = await _supabase.auth.signUp({ email: email, password: password });
  if (result.error) throw result.error;
  return result.data;
}

async function _supabaseSignIn(email, password) {
  if (!_supabase) throw new Error('Supabase non disponible');
  var result = await _supabase.auth.signInWithPassword({ email: email, password: password });
  if (result.error) throw result.error;
  _supabaseUser = result.data.user;
  return result.data;
}

async function _supabaseSignOut() {
  if (!_supabase) return;
  await _supabase.auth.signOut();
  _supabaseUser = null;
}

// ── Supabase Login / Signup Screen ──────────────────────────

function showSupabaseLogin() {
  // Remove splash if visible
  var splash = document.getElementById('splash');
  if (splash) splash.style.display = 'none';

  // Remove existing overlay
  var old = document.getElementById('supabase-login-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'supabase-login-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#0d0f1a;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:inherit';

  overlay.innerHTML = '<div style="background:#141627;border:1px solid #2a2d45;border-radius:16px;padding:40px 36px;max-width:420px;width:92%;box-shadow:0 24px 64px rgba(0,0,0,.7)">'
    + '<div style="text-align:center;margin-bottom:28px">'
    + '<div style="font-size:36px;margin-bottom:8px">\uD83D\uDD10</div>'
    + '<h2 style="margin:0 0 6px;font-size:22px;color:#f0f2f8;font-weight:800">Perfect\u2019s Stock Manager</h2>'
    + '<p id="supa-subtitle" style="color:#8888aa;font-size:13px;margin:0">Connectez-vous pour acc\u00e9der \u00e0 vos donn\u00e9es</p>'
    + '</div>'
    + '<div id="supa-error" style="display:none;background:#3d1525;border:1px solid #ff4466;border-radius:8px;padding:10px 14px;margin-bottom:16px;color:#ff8899;font-size:13px"></div>'
    + '<div id="supa-success" style="display:none;background:#153d25;border:1px solid #44ff66;border-radius:8px;padding:10px 14px;margin-bottom:16px;color:#88ff99;font-size:13px"></div>'
    + '<form id="supa-form" onsubmit="return _handleSupabaseForm(event)" style="display:flex;flex-direction:column;gap:14px">'
    + '<div>'
    + '<label style="font-size:12px;color:#8888aa;display:block;margin-bottom:4px">Email</label>'
    + '<input id="supa-email" type="email" required autocomplete="email" placeholder="votre@email.com" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<div>'
    + '<label style="font-size:12px;color:#8888aa;display:block;margin-bottom:4px">Mot de passe</label>'
    + '<input id="supa-password" type="password" required minlength="6" autocomplete="current-password" placeholder="6 caract\u00e8res minimum" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<button id="supa-submit" type="submit" style="padding:13px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s">'
    + 'Se connecter</button>'
    + '</form>'
    + '<div style="text-align:center;margin-top:16px">'
    + '<span style="color:#8888aa;font-size:13px">Pas encore de compte ? </span>'
    + '<a href="#" onclick="_toggleSupabaseMode(event)" id="supa-toggle" style="color:#6366f1;font-size:13px;text-decoration:none;font-weight:600">Cr\u00e9er un compte</a>'
    + '</div>'
    + '<div style="text-align:center;margin-top:20px;border-top:1px solid #2a2d45;padding-top:16px">'
    + '<a href="#" onclick="_skipSupabaseLogin(event)" style="color:#555;font-size:12px;text-decoration:none">Mode hors ligne (sans compte) \u2192</a>'
    + '</div>'
    + '</div>';

  document.body.appendChild(overlay);
  document.getElementById('supa-email').focus();
}

var _supabaseIsSignUp = false;

function _toggleSupabaseMode(e) {
  e.preventDefault();
  _supabaseIsSignUp = !_supabaseIsSignUp;
  var toggle = document.getElementById('supa-toggle');
  var btn = document.getElementById('supa-submit');
  var subtitle = document.getElementById('supa-subtitle');
  if (_supabaseIsSignUp) {
    toggle.textContent = 'D\u00e9j\u00e0 un compte ? Se connecter';
    btn.textContent = 'Cr\u00e9er mon compte';
    subtitle.textContent = 'Cr\u00e9ez un compte pour sauvegarder vos donn\u00e9es en ligne';
  } else {
    toggle.textContent = 'Cr\u00e9er un compte';
    btn.textContent = 'Se connecter';
    subtitle.textContent = 'Connectez-vous pour acc\u00e9der \u00e0 vos donn\u00e9es';
  }
  document.getElementById('supa-error').style.display = 'none';
  document.getElementById('supa-success').style.display = 'none';
}

async function _handleSupabaseForm(e) {
  e.preventDefault();
  var email = document.getElementById('supa-email').value.trim();
  var password = document.getElementById('supa-password').value;
  var errEl = document.getElementById('supa-error');
  var successEl = document.getElementById('supa-success');
  var btn = document.getElementById('supa-submit');

  errEl.style.display = 'none';
  successEl.style.display = 'none';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.textContent = 'Chargement...';

  try {
    if (_supabaseIsSignUp) {
      var data = await _supabaseSignUp(email, password);
      // Supabase may require email confirmation
      if (data.user && !data.session) {
        successEl.textContent = 'Compte cr\u00e9\u00e9 ! V\u00e9rifiez votre email pour confirmer, puis connectez-vous.';
        successEl.style.display = 'block';
        _supabaseIsSignUp = false;
        btn.textContent = 'Se connecter';
        document.getElementById('supa-toggle').textContent = 'Cr\u00e9er un compte';
        document.getElementById('supa-subtitle').textContent = 'Connectez-vous pour acc\u00e9der \u00e0 vos donn\u00e9es';
        btn.disabled = false;
        btn.style.opacity = '1';
        return false;
      }
      // If auto-confirmed (dev mode), proceed
      _supabaseUser = data.user;
    } else {
      await _supabaseSignIn(email, password);
    }
    // Auth success — continue app init
    await _onSupabaseAuthSuccess();
  } catch(err) {
    var msg = err.message || String(err);
    if (msg.includes('Invalid login')) msg = 'Email ou mot de passe incorrect';
    else if (msg.includes('already registered')) msg = 'Cet email est d\u00e9j\u00e0 utilis\u00e9. Connectez-vous.';
    else if (msg.includes('valid email')) msg = 'Adresse email invalide';
    else if (msg.includes('at least')) msg = 'Le mot de passe doit contenir au moins 6 caract\u00e8res';
    errEl.textContent = msg;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = _supabaseIsSignUp ? 'Cr\u00e9er mon compte' : 'Se connecter';
  }
  return false;
}

async function _onSupabaseAuthSuccess() {
  // Remove login overlay
  var overlay = document.getElementById('supabase-login-overlay');
  if (overlay) overlay.remove();

  // Show splash while loading data
  var splash = document.getElementById('splash');
  if (splash) { splash.style.display = ''; }

  // Enable online mode
  _onlineMode = true;

  // Load cloud data
  try {
    await _loadFromCloud();
  } catch(e) {
    console.warn('[PSM] Cloud load failed, using local data:', e);
  }

  // Continue normal init
  await initFileStorage();
  await _finishAppInit();
}

function _skipSupabaseLogin(e) {
  e.preventDefault();
  var overlay = document.getElementById('supabase-login-overlay');
  if (overlay) overlay.remove();
  var splash = document.getElementById('splash');
  if (splash) { splash.style.display = ''; }
  // Offline mode: proceed with local storage only
  _onlineMode = false;
  initFileStorage().then(function() {
    return _finishAppInit();
  }).catch(function(err) {
    console.error('[PSM] offline init failed:', err);
  });
}

// ── Local session helpers ──────────────────────────────────────

function getSessionUserId() {
  return sessionStorage.getItem('psm_user');
}
function setSessionUserId(userId) {
  if (userId) sessionStorage.setItem('psm_user', userId);
  else sessionStorage.removeItem('psm_user');
}

// ── Local user & permissions ──────────────────────────────────

function _currentUser() {
  var id = sessionStorage.getItem('psm_user');
  if (!id) return (APP.users||[])[0] || { id:'admin', name:'PERFECT', role:'admin', permissions:null };
  return (APP.users||[]).find(function(u){ return u.id === id; }) || (APP.users||[])[0];
}

function hasPermission(pageId, action) {
  var u = _currentUser();
  if (!u) return true;
  if (u.role === 'admin') return true;
  if (!u.permissions) return false;
  var p = u.permissions[pageId];
  if (!p) return false;
  return p[action] === true;
}
function canView(pageId) { return hasPermission(pageId, 'view'); }
function canEdit(pageId) { return hasPermission(pageId, 'edit'); }

// ── Local Login / User-switch (unchanged) ────────────────────

function showLoginScreen() {
  var users = APP.users || [];
  var overlay = document.createElement('div');
  overlay.id = 'login-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:var(--bg-0);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:24px';
  var logo = APP.settings && APP.settings.companyLogo ? '<img src="' + APP.settings.companyLogo + '" style="max-height:80px;object-fit:contain;margin-bottom:8px">' : '';
  var html = '<div style="text-align:center;max-width:480px;width:100%;padding:0 16px">'
    + logo
    + '<div style="font-size:22px;font-weight:800;color:var(--text-0);margin-bottom:6px">' + ((APP.settings && APP.settings.companyName) || 'PSM') + '</div>'
    + '<div style="font-size:13px;color:var(--text-2);margin-bottom:28px">S\u00e9lectionnez votre compte pour continuer</div>'
    + '<div style="display:grid;gap:10px;margin-bottom:20px">';
  users.forEach(function(u) {
    html += '<button onclick="loginAs(\'' + u.id + '\')" style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg-1);border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;transition:border-color .15s,background .15s" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
      + '<div style="width:42px;height:42px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--accent);flex-shrink:0;overflow:hidden">'
      + (u.photo ? '<img src="' + u.photo + '" style="width:42px;height:42px;object-fit:cover;border-radius:50%">' : u.name.charAt(0).toUpperCase())
      + '</div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="font-size:14px;font-weight:700;color:var(--text-0)">' + u.name + '</div>'
      + '<div style="font-size:11px;color:var(--text-2)">' + (u.email || '') + '</div>'
      + '</div>'
      + '<div style="font-size:10px;background:' + (u.role === 'admin' ? 'var(--accent)' : 'var(--bg-2)') + ';color:' + (u.role === 'admin' ? '#fff' : 'var(--text-2)') + ';padding:2px 8px;border-radius:99px">' + (u.role === 'admin' ? 'Admin' : 'Utilisateur') + '</div>'
      + '</button>';
  });
  html += '</div></div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function loginAs(userId) {
  sessionStorage.setItem('psm_user', userId);
  var overlay = document.getElementById('login-overlay');
  if (overlay) overlay.remove();
  var u = _currentUser();
  if (typeof notify === 'function') notify('\uD83D\uDC4B Bonjour ' + (u ? u.name : '') + ' !', 'success');
  if (typeof renderSidebar === 'function') renderSidebar();
  if (typeof showPage === 'function') showPage((APP.settings && APP.settings.lastPage) || 'dashboard');
  if (typeof updateUserBadge === 'function') updateUserBadge();
}

function logoutUser() {
  sessionStorage.removeItem('psm_user');
  // Also sign out of Supabase if connected
  if (_supabase && _supabaseUser) {
    _supabaseSignOut().then(function() {
      window.location.reload();
    });
    return;
  }
  showLoginScreen();
}

function updateUserBadge() {
  var el = document.getElementById('topbar-user');
  if (!el) return;
  var u = _currentUser();
  if (!u) return;
  var photoHtml = u.photo
    ? '<img src="' + u.photo + '" style="width:28px;height:28px;object-fit:cover;border-radius:50%">'
    : u.name.charAt(0).toUpperCase();
  el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="showUserSwitchMenu(this)" title="Changer d\u2019utilisateur">'
    + '<div style="width:28px;height:28px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--accent);overflow:hidden">' + photoHtml + '</div>'
    + '<span style="font-size:12px;color:var(--text-1);font-weight:600">' + u.name + '</span>'
    + '<span style="font-size:10px;color:var(--text-3)">\u25be</span>'
    + '</div>';
}

function showUserSwitchMenu(el) {
  var existing = document.getElementById('user-switch-menu');
  if (existing) { existing.remove(); return; }
  var rect = el.getBoundingClientRect();
  var menu = document.createElement('div');
  menu.id = 'user-switch-menu';
  menu.style.cssText = 'position:fixed;top:' + (rect.bottom+4) + 'px;right:' + (window.innerWidth-rect.right) + 'px;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 24px rgba(0,0,0,.3);z-index:999;min-width:180px;padding:6px';
  var u = _currentUser();
  var html = '';
  (APP.users||[]).forEach(function(uu) {
    if (uu.id === (u && u.id)) return;
    html += '<button onclick="loginAs(\'' + uu.id + '\');document.getElementById(\'user-switch-menu\').remove()" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--text-0);font-size:13px" onmouseover="this.style.background=\'var(--bg-2)\'" onmouseout="this.style.background=\'none\'">'
      + '<span style="font-size:15px">' + uu.name.charAt(0).toUpperCase() + '</span>' + uu.name
      + '</button>';
  });
  html += '<div style="border-top:1px solid var(--border);margin:4px 0"></div>';
  html += '<button onclick="logoutUser();var m=document.getElementById(\'user-switch-menu\');if(m)m.remove()" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--danger);font-size:13px" onmouseover="this.style.background=\'var(--bg-2)\'" onmouseout="this.style.background=\'none\'">'
    + '\uD83D\uDEAA Se d\u00e9connecter</button>';
  menu.innerHTML = html;
  document.body.appendChild(menu);
  setTimeout(function() {
    document.addEventListener('click', function h(e) {
      if (!menu.contains(e.target) && !el.contains(e.target)) { menu.remove(); document.removeEventListener('click', h); }
    }, true);
  }, 10);
}
