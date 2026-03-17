// ============================================================
// auth.js — PSM Authentication & Permissions (V2)
// Admin-managed accounts with Supabase Auth + profiles table.
// ============================================================

var _supabaseUser = null;   // Supabase auth user object
var _userProfile  = null;   // Profile from profiles table {email, display_name, role, permissions}

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
      // Sync with local APP.users
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
  }
}

// ── Activity Log ───────────────────────────────────────────

async function logActivity(action, details) {
  // Local log
  if (typeof APP !== 'undefined') {
    if (!APP._activityLog) APP._activityLog = [];
    var entry = {
      ts: Date.now(),
      email: (_supabaseUser && _supabaseUser.email) || (_currentUser() && _currentUser().email) || 'unknown',
      user: (_currentUser() && _currentUser().name) || 'unknown',
      action: action,
      details: details || ''
    };
    APP._activityLog.unshift(entry);
    if (APP._activityLog.length > 500) APP._activityLog = APP._activityLog.slice(0, 500);
  }
  // Cloud log
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

// ── Supabase Login Screen ──────────────────────────────────

function showSupabaseLogin() {
  var old = document.getElementById('supabase-login-overlay');
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
    + '<input id="supa-password" type="password" required minlength="6" autocomplete="current-password" placeholder="Votre mot de passe" '
    + 'style="width:100%;padding:12px 14px;background:#1a1d35;border:1.5px solid #2a2d45;border-radius:10px;color:#f0f2f8;font-size:14px;outline:none;box-sizing:border-box" '
    + 'onfocus="this.style.borderColor=\'#6366f1\'" onblur="this.style.borderColor=\'#2a2d45\'">'
    + '</div>'
    + '<button id="supa-submit" type="submit" style="padding:13px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s">'
    + 'Se connecter</button>'
    + '</form>'
    + '<div style="text-align:center;margin-top:20px;border-top:1px solid #2a2d45;padding-top:16px">'
    + '<a href="#" onclick="_skipLogin(event)" style="color:#555;font-size:12px;text-decoration:none">Mode hors ligne (sans compte) \u2192</a>'
    + '</div>'
    + '<p style="color:#444;font-size:11px;text-align:center;margin:14px 0 0">Demandez vos identifiants \u00e0 l\u2019administrateur</p>'
    + '</div>';

  document.body.appendChild(overlay);
  setTimeout(function() {
    var el = document.getElementById('supa-email');
    if (el) el.focus();
  }, 100);
}

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
    await _supabaseSignIn(email, password);
    _onlineMode = true;

    // Load profile
    await _loadUserProfile();

    // Load cloud data
    try { await _loadFromCloud(); } catch(ex) { console.warn('[PSM] cloud load:', ex); }

    // Log activity
    logActivity('login', 'Connexion depuis ' + navigator.userAgent.split(' ').pop());

    // Remove overlay
    var overlay = document.getElementById('supabase-login-overlay');
    if (overlay) overlay.remove();

    // Sync local user session
    if (_userProfile) {
      var localUser = (APP.users || []).find(function(u) { return u.email === email; });
      if (localUser) sessionStorage.setItem('psm_user', localUser.id);
    }

    // Re-render
    if (typeof renderSidebar === 'function') renderSidebar();
    if (typeof showPage === 'function') showPage((APP.settings && APP.settings.lastPage) || 'dashboard');
    if (typeof updateUserBadge === 'function') updateUserBadge();
    if (typeof notify === 'function') notify('\uD83D\uDC4B Connect\u00e9 !', 'success');

  } catch(err) {
    var msg = err.message || String(err);
    if (msg.includes('Invalid login')) msg = 'Email ou mot de passe incorrect';
    else if (msg.includes('Email not confirmed')) msg = 'Email non confirm\u00e9. V\u00e9rifiez votre bo\u00eete mail.';
    errEl.textContent = msg;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Se connecter';
  }
  return false;
}

function _skipLogin(e) {
  e.preventDefault();
  var overlay = document.getElementById('supabase-login-overlay');
  if (overlay) overlay.remove();
  _onlineMode = false;
  if (typeof notify === 'function') notify('Mode hors ligne actif', 'info');
}

// ── Admin: Create Supabase account for a user ──────────────

async function _adminCreateSupabaseUser(email, password, displayName, role, permissions) {
  if (!_supabase) throw new Error('Supabase non disponible');

  // 1. Create auth account via Supabase signup
  //    (In production, use Edge Function with service_role key)
  //    For now: create via signUp then immediately sign back in as admin
  var adminSession = await _supabase.auth.getSession();

  var signUpResult = await _supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { display_name: displayName, role: role }
    }
  });
  if (signUpResult.error) throw signUpResult.error;

  // 2. Insert profile
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

  // 3. Restore admin session (signUp may have changed session)
  if (adminSession.data && adminSession.data.session) {
    // Re-authenticate as admin
    await _supabase.auth.setSession({
      access_token: adminSession.data.session.access_token,
      refresh_token: adminSession.data.session.refresh_token
    });
    _supabaseUser = adminSession.data.session.user;
  }

  // 4. Log activity
  logActivity('admin_create_user', 'Cr\u00e9ation du compte: ' + email + ' (r\u00f4le: ' + role + ')');

  return signUpResult.data;
}

async function _adminUpdateProfile(email, displayName, role, permissions, isActive) {
  if (!_supabase) return;
  var result = await _supabase.from('profiles').update({
    display_name: displayName,
    role: role,
    permissions: permissions,
    is_active: isActive
  }).eq('email', email);
  if (result.error) throw result.error;
  logActivity('admin_update_user', 'Modification: ' + email + ' -> r\u00f4le: ' + role);
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

function getSessionUserId() {
  return sessionStorage.getItem('psm_user');
}
function setSessionUserId(userId) {
  if (userId) sessionStorage.setItem('psm_user', userId);
  else sessionStorage.removeItem('psm_user');
}

// ── Local user & permissions ───────────────────────────────

function _currentUser() {
  var id = sessionStorage.getItem('psm_user');
  if (!id) return (APP.users || [])[0] || { id: 'admin', name: 'PERFECT', role: 'admin', permissions: null };
  return (APP.users || []).find(function(u) { return u.id === id; }) || (APP.users || [])[0];
}

function hasPermission(pageId, action) {
  // If we have a Supabase profile, use its permissions
  if (_userProfile && _userProfile.role !== 'admin') {
    var p = _userProfile.permissions;
    if (p && p[pageId]) return p[pageId][action] === true;
    return false;
  }
  // Admin bypass
  var u = _currentUser();
  if (!u) return true;
  if (u.role === 'admin') return true;
  if (!u.permissions) return false;
  var perm = u.permissions[pageId];
  if (!perm) return false;
  return perm[action] === true;
}
function canView(pageId) { return hasPermission(pageId, 'view'); }
function canEdit(pageId) { return hasPermission(pageId, 'edit'); }

// ── Local Login / User-switch ──────────────────────────────

function showLoginScreen() {
  var users = APP.users || [];
  var overlay = document.createElement('div');
  overlay.id = 'login-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:var(--bg-0);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:24px';
  var logo = (APP.settings && APP.settings.companyLogo) ? '<img src="' + APP.settings.companyLogo + '" style="max-height:80px;object-fit:contain;margin-bottom:8px">' : '';
  var html = '<div style="text-align:center;max-width:480px;width:100%;padding:0 16px">'
    + logo
    + '<div style="font-size:22px;font-weight:800;color:var(--text-0);margin-bottom:6px">' + ((APP.settings && APP.settings.companyName) || 'PSM') + '</div>'
    + '<div style="font-size:13px;color:var(--text-2);margin-bottom:28px">S\u00e9lectionnez votre compte pour continuer</div>'
    + '<div style="display:grid;gap:10px;margin-bottom:20px">';
  users.forEach(function(u) {
    html += '<button onclick="loginAs(\'' + u.id + '\')" style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg-1);border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;transition:border-color .15s,background .15s" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
      + '<div style="width:42px;height:42px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--accent);flex-shrink:0;overflow:hidden">'
      + (u.photo ? '<img src="' + u.photo + '" style="width:42px;height:42px;object-fit:cover;border-radius:50%">' : u.name.charAt(0).toUpperCase())
      + '</div><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;color:var(--text-0)">' + u.name + '</div>'
      + '<div style="font-size:11px;color:var(--text-2)">' + (u.email || '') + '</div></div>'
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
  logActivity('local_switch', 'Connexion locale: ' + (u ? u.name : userId));
  if (typeof renderSidebar === 'function') renderSidebar();
  if (typeof showPage === 'function') showPage((APP.settings && APP.settings.lastPage) || 'dashboard');
  if (typeof updateUserBadge === 'function') updateUserBadge();
}

function logoutUser() {
  sessionStorage.removeItem('psm_user');
  if (_supabase && _supabaseUser) {
    logActivity('logout', 'D\u00e9connexion');
    _supabaseSignOut().then(function() { window.location.reload(); });
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
  var onlineIcon = _supabaseUser ? '<span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;margin-left:4px" title="En ligne"></span>' : '';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="showUserSwitchMenu(this)" title="Changer d\u2019utilisateur">'
    + '<div style="width:28px;height:28px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--accent);overflow:hidden">' + photoHtml + '</div>'
    + '<span style="font-size:12px;color:var(--text-1);font-weight:600">' + u.name + onlineIcon + '</span>'
    + '<span style="font-size:10px;color:var(--text-3)">\u25be</span>'
    + '</div>';
}

function showUserSwitchMenu(el) {
  var existing = document.getElementById('user-switch-menu');
  if (existing) { existing.remove(); return; }
  var rect = el.getBoundingClientRect();
  var menu = document.createElement('div');
  menu.id = 'user-switch-menu';
  menu.style.cssText = 'position:fixed;top:' + (rect.bottom + 4) + 'px;right:' + (window.innerWidth - rect.right) + 'px;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 24px rgba(0,0,0,.3);z-index:999;min-width:200px;padding:6px';
  var u = _currentUser();
  var html = '';

  // Show connection status
  if (_supabaseUser) {
    html += '<div style="padding:8px 10px;font-size:11px;color:var(--text-3);border-bottom:1px solid var(--border);margin-bottom:4px">'
      + '<span style="color:#22c55e">\u25cf</span> ' + _supabaseUser.email + '</div>';
  }

  (APP.users || []).forEach(function(uu) {
    if (uu.id === (u && u.id)) return;
    html += '<button onclick="loginAs(\'' + uu.id + '\');document.getElementById(\'user-switch-menu\').remove()" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--text-0);font-size:13px" onmouseover="this.style.background=\'var(--bg-2)\'" onmouseout="this.style.background=\'none\'">'
      + '<span style="font-size:15px">' + uu.name.charAt(0).toUpperCase() + '</span>' + uu.name + '</button>';
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
