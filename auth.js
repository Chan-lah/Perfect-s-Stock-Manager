// ============================================================
// auth.js — PSM Authentication & Permissions (V3)
// 100% Supabase Auth — no local passwords
// ============================================================

var _supabaseUser = null;   // Supabase auth user object
var _userProfile  = null;   // Profile from profiles table

// ── Supabase Auth ──────────────────────────────────────────

async function _checkSupabaseSession() {
  if (!_supabase) return null;
  try {
    var r = await _supabase.auth.getSession();
    if (r.data && r.data.session) {
      _supabaseUser = r.data.session.user;
      return r.data.session;
    }
  } catch(e) { console.warn('[PSM] session check:', e); }
  return null;
}

async function _supabaseSignIn(email, password) {
  if (!_supabase) throw new Error('Supabase non disponible');
  var r = await _supabase.auth.signInWithPassword({ email: email, password: password });
  if (r.error) throw r.error;
  _supabaseUser = r.data.user;
  return r.data;
}

async function _supabaseSignOut() {
  if (_supabase) await _supabase.auth.signOut();
  _supabaseUser = null;
  _userProfile = null;
}

// ── Profile loading ────────────────────────────────────────

async function _loadUserProfile() {
  if (!_supabase || !_supabaseUser) return null;
  try {
    var r = await _supabase.from('profiles').select('*')
      .eq('email', _supabaseUser.email).single();
    if (r.data) {
      _userProfile = r.data;
      _syncProfileToLocal(_userProfile);
      return _userProfile;
    }
  } catch(e) { console.warn('[PSM] profile load:', e); }
  return null;
}

function _syncProfileToLocal(profile) {
  if (!profile || typeof APP === 'undefined') return;
  if (!APP.users) APP.users = [];
  var existing = APP.users.find(function(u) { return u.email === profile.email; });
  if (existing) {
    existing.name = profile.display_name || existing.name;
    existing.role = profile.role || existing.role;
    if (profile.permissions) existing.permissions = profile.permissions;
  } else {
    // Create local entry from cloud profile
    APP.users.push({
      id: 'u_' + Date.now(),
      name: profile.display_name || profile.email.split('@')[0],
      email: profile.email,
      password: null,
      role: profile.role || 'viewer',
      photo: null,
      signature: null,
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
      email: (_supabaseUser && _supabaseUser.email) || (_currentUser() && _currentUser().email) || 'unknown',
      user: (_currentUser() && _currentUser().name) || 'unknown',
      action: action,
      details: details || ''
    });
    if (APP._activityLog.length > 500) APP._activityLog = APP._activityLog.slice(0, 500);
  }
  if (_supabase && _supabaseUser) {
    try {
      await _supabase.from('activity_log').insert({
        user_email: _supabaseUser.email,
        action: action,
        details: details || ''
      });
    } catch(e) { /* silent */ }
  }
}

// ── Login Screen (email + password → Supabase Auth) ────────

function showLoginScreen() {
  // Remove any existing overlay
  var old = document.getElementById('supabase-login-overlay');
  if (old) old.remove();
  old = document.getElementById('login-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'supabase-login-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,12,25,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:inherit';

  overlay.innerHTML = ''
    + '<div style="background:#141627;border:1px solid #2a2d45;border-radius:16px;padding:40px 36px;max-width:420px;width:92%;box-shadow:0 24px 64px rgba(0,0,0,.7)">'
    + '<div style="text-align:center;margin-bottom:28px">'
    + '<div style="font-size:36px;margin-bottom:8px">\uD83D\uDD10</div>'
    + '<h2 style="margin:0 0 6px;font-size:22px;color:#f0f2f8;font-weight:800">Perfect\u2019s Stock Manager</h2>'
    + '<p style="color:#8888aa;font-size:13px;margin:0">Connectez-vous avec votre compte</p>'
    + '</div>'
    + '<div id="supa-error" style="display:none;background:#3d1525;border:1px solid #ff4466;border-radius:8px;padding:10px 14px;margin-bottom:16px;color:#ff8899;font-size:13px"></div>'
    + '<form id="supa-form" onsubmit="return _handleLogin(event)" style="display:flex;flex-direction:column;gap:14px">'
    + '<div>'
    + '<label style="font-size:12px;color:#8888aa;display:block;margin-bottom:4px">Email</label>'
    + '<input id="supa-email" type="email" required autocomplete="email" placeholder="votre@email.com" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<div>'
    + '<label style="font-size:12px;color:#8888aa;display:block;margin-bottom:4px">Mot de passe</label>'
    + '<input id="supa-password" type="password" required autocomplete="current-password" placeholder="Votre mot de passe" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<button id="supa-submit" type="submit" style="padding:13px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s">'
    + 'Se connecter</button>'
    + '</form>'
    + '<p style="color:#444;font-size:11px;text-align:center;margin:14px 0 0">Demandez vos identifiants \u00e0 l\u2019administrateur</p>'
    + '</div>';

  document.body.appendChild(overlay);
  setTimeout(function() {
    var el = document.getElementById('supa-email');
    if (el) el.focus();
  }, 100);
}

// Alias for backwards compat
function showSupabaseLogin() { showLoginScreen(); }

async function _handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('supa-email').value.trim();
  var password = document.getElementById('supa-password').value;
  var errEl = document.getElementById('supa-error');
  var btn = document.getElementById('supa-submit');

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.textContent = 'Connexion...';

  try {
    // 1. Authenticate via Supabase
    if (typeof _supabase === 'undefined' || !_supabase) {
      throw new Error('Service de connexion indisponible. V\u00e9rifiez votre connexion internet.');
    }

    await _supabaseSignIn(email, password);
    _onlineMode = true;

    // 2. Load profile from profiles table (role, permissions)
    await _loadUserProfile();

    // 3. Sync local user (create if needed)
    if (!APP.users) APP.users = [];
    var localUser = APP.users.find(function(u) { return u.email && u.email.toLowerCase() === email.toLowerCase(); });
    if (!localUser) {
      localUser = {
        id: 'u_' + Date.now(),
        name: (_userProfile && _userProfile.display_name) || email.split('@')[0],
        email: email,
        password: null,
        role: (_userProfile && _userProfile.role) || 'admin',
        photo: null,
        signature: null,
        permissions: (_userProfile && _userProfile.permissions) || null,
        createdAt: Date.now(),
        _version: 1
      };
      APP.users.push(localUser);
    } else {
      // Update from profile
      if (_userProfile) {
        localUser.role = _userProfile.role || localUser.role;
        if (_userProfile.display_name) localUser.name = _userProfile.display_name;
        if (_userProfile.permissions) localUser.permissions = _userProfile.permissions;
      }
    }

    // 4. Set session
    sessionStorage.setItem('psm_user', localUser.id);
    if (typeof saveDB === 'function') saveDB();

    // 5. Load cloud data
    try { if (typeof _loadFromCloud === 'function') await _loadFromCloud(); } catch(ex) {}

    // 6. Log activity
    logActivity('login', 'Connexion: ' + localUser.name + ' (' + localUser.role + ')');

    // 7. Remove overlay
    var overlay = document.getElementById('supabase-login-overlay');
    if (overlay) overlay.remove();

    // 8. Re-render
    if (typeof renderSidebar === 'function') renderSidebar();
    if (typeof showPage === 'function') showPage((APP.settings && APP.settings.lastPage) || 'dashboard');
    if (typeof updateUserBadge === 'function') updateUserBadge();
    if (typeof notify === 'function') notify('\uD83D\uDC4B Bienvenue ' + localUser.name + ' !', 'success');

  } catch(err) {
    var msg = err.message || String(err);
    if (msg.includes('Invalid login')) msg = 'Email ou mot de passe incorrect';
    else if (msg.includes('Email not confirmed')) msg = 'Email non confirm\u00e9. Contactez l\u2019administrateur.';
    else if (msg.includes('Failed to fetch')) msg = 'Impossible de contacter le serveur. V\u00e9rifiez votre connexion internet.';
    errEl.textContent = msg;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Se connecter';
  }
  return false;
}

// ── Admin: Create Supabase account ─────────────────────────

async function _adminCreateSupabaseUser(email, password, displayName, role, permissions) {
  if (!_supabase) throw new Error('Supabase non disponible');

  var adminSession = await _supabase.auth.getSession();

  var signUpResult = await _supabase.auth.signUp({
    email: email,
    password: password,
    options: { data: { display_name: displayName, role: role } }
  });
  if (signUpResult.error) throw signUpResult.error;

  var profileResult = await _supabase.from('profiles').upsert({
    email: email,
    display_name: displayName,
    role: role,
    permissions: permissions || {},
    user_id: signUpResult.data.user ? signUpResult.data.user.id : null,
    created_by: _supabaseUser ? _supabaseUser.email : 'admin',
    is_active: true
  }, { onConflict: 'email' });
  if (profileResult.error) throw profileResult.error;

  // Restore admin session
  if (adminSession.data && adminSession.data.session) {
    await _supabase.auth.setSession({
      access_token: adminSession.data.session.access_token,
      refresh_token: adminSession.data.session.refresh_token
    });
    _supabaseUser = adminSession.data.session.user;
  }

  logActivity('admin_create_user', 'Cr\u00e9ation: ' + email + ' (r\u00f4le: ' + role + ')');
  return signUpResult.data;
}

async function _adminUpdateProfile(email, displayName, role, permissions, isActive) {
  if (!_supabase) return;
  var result = await _supabase.from('profiles').update({
    display_name: displayName, role: role, permissions: permissions, is_active: isActive
  }).eq('email', email);
  if (result.error) throw result.error;
  logActivity('admin_update_user', 'Modification: ' + email + ' -> ' + role);
}

async function _adminDeactivateUser(email) {
  if (!_supabase) return;
  var result = await _supabase.from('profiles').update({ is_active: false }).eq('email', email);
  if (result.error) throw result.error;
  logActivity('admin_deactivate_user', 'D\u00e9sactivation: ' + email);
}

async function _adminGetAllProfiles() {
  if (!_supabase) return [];
  var result = await _supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (result.error) { console.warn('[PSM] profiles fetch:', result.error); return []; }
  return result.data || [];
}

async function _adminGetActivityLog(limit) {
  if (!_supabase) return [];
  var q = _supabase.from('activity_log').select('*').order('created_at', { ascending: false });
  if (limit) q = q.limit(limit);
  var result = await q;
  if (result.error) return [];
  return result.data || [];
}

// ── Local session helpers ──────────────────────────────────

function _currentUser() {
  var id = sessionStorage.getItem('psm_user');
  if (!id) return null;
  return (APP.users || []).find(function(u) { return u.id === id; }) || null;
}

function hasPermission(pageId, action) {
  var u = _currentUser();
  if (!u) return false;
  if (u.role === 'admin') return true;
  // Check Supabase profile first
  if (_userProfile && _userProfile.permissions) {
    var pp = _userProfile.permissions[pageId];
    if (pp) return pp[action] === true;
  }
  // Fallback to local permissions
  if (!u.permissions) return false;
  var perm = u.permissions[pageId];
  if (!perm) return false;
  return perm[action] === true;
}

function canView(pageId) { return hasPermission(pageId, 'view'); }
function canEdit(pageId) { return hasPermission(pageId, 'edit'); }

// ── Logout ─────────────────────────────────────────────────

function logoutUser() {
  logActivity('logout', 'D\u00e9connexion');
  sessionStorage.removeItem('psm_user');
  _supabaseUser = null;
  _userProfile = null;
  if (typeof _supabase !== 'undefined' && _supabase) {
    _supabase.auth.signOut().catch(function(){});
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
  var onlineIcon = _supabaseUser ? '<span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;margin-left:4px" title="En ligne"></span>' : '';
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

  // User info
  if (u) {
    var roleMeta = (typeof ROLE_TEMPLATES !== 'undefined' && ROLE_TEMPLATES[u.role]) ? ROLE_TEMPLATES[u.role] : null;
    html += '<div style="padding:10px 10px 8px;border-bottom:1px solid var(--border);margin-bottom:4px">'
      + '<div style="font-weight:700;font-size:13px;color:var(--text-0)">' + u.name + '</div>'
      + '<div style="font-size:11px;color:var(--text-3)">' + (u.email || '') + '</div>'
      + (roleMeta ? '<div style="margin-top:4px"><span style="font-size:10px;background:' + roleMeta.color + '22;color:' + roleMeta.color + ';padding:2px 8px;border-radius:99px">' + roleMeta.label + '</span></div>' : '')
      + '</div>';
  }

  // Connection status
  if (_supabaseUser) {
    html += '<div style="padding:6px 10px;font-size:11px;color:var(--text-3)">'
      + '<span style="color:#22c55e">\u25cf</span> Connect\u00e9 au cloud</div>';
  }

  // Logout button
  html += '<button onclick="logoutUser();var m=document.getElementById(\'user-switch-menu\');if(m)m.remove()" '
    + 'style="display:flex;align-items:center;gap:8px;width:100%;padding:10px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--danger);font-size:13px;font-weight:600" '
    + 'onmouseover="this.style.background=\'var(--bg-2)\'" onmouseout="this.style.background=\'none\'">'
    + '\uD83D\uDEAA Se d\u00e9connecter</button>';

  menu.innerHTML = html;
  document.body.appendChild(menu);
  setTimeout(function() {
    document.addEventListener('click', function h(e) {
      if (!menu.contains(e.target) && !el.contains(e.target)) { menu.remove(); document.removeEventListener('click', h); }
    }, true);
  }, 10);
}
