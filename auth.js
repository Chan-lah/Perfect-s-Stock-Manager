// ============================================================
// auth.js — PSM Authentication & Permissions
// Handles user sessions (sessionStorage), login/logout,
// role-based permissions.  Ready for Supabase Auth replacement.
// ============================================================

// ── Session helpers ─────────────────────────────────────
// These use sessionStorage for now.
// To switch to Supabase Auth, replace getSessionUserId / setSessionUserId.

function getSessionUserId() {
  return sessionStorage.getItem('psm_user');
}

function setSessionUserId(userId) {
  if (userId) sessionStorage.setItem('psm_user', userId);
  else sessionStorage.removeItem('psm_user');
}

function _currentUser() {
  const id = sessionStorage.getItem('psm_user');
  if(!id) return (APP.users||[])[0] || { id:'admin', name:'PERFECT', role:'admin', permissions:null };
  return (APP.users||[]).find(u => u.id === id) || (APP.users||[])[0];
}

function hasPermission(pageId, action) {
  const u = _currentUser();
  if(!u) return true;
  if(u.role === 'admin') return true;
  if(!u.permissions) return false;
  const p = u.permissions[pageId];
  if(!p) return false;
  return p[action] === true;
}
function canView(pageId) { return hasPermission(pageId, 'view'); }
function canEdit(pageId) { return hasPermission(pageId, 'edit'); }

// ── Login / User-switch ───────────────────────────────────────────────────
function showLoginScreen() {
  const users = APP.users || [];
  const overlay = document.createElement('div');
  overlay.id = 'login-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:var(--bg-0);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:24px';
  const logo = APP.settings?.companyLogo ? `<img src="${APP.settings.companyLogo}" style="max-height:80px;object-fit:contain;margin-bottom:8px">` : '';
  overlay.innerHTML = `
    <div style="text-align:center;max-width:480px;width:100%;padding:0 16px">
      ${logo}
      <div style="font-size:22px;font-weight:800;color:var(--text-0);margin-bottom:6px">${APP.settings?.companyName||'PSM'}</div>
      <div style="font-size:13px;color:var(--text-2);margin-bottom:28px">S\u00e9lectionnez votre compte pour continuer</div>
      <div style="display:grid;gap:10px;margin-bottom:20px">
        ${users.map(u => `
        <button onclick="loginAs('${u.id}')" style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg-1);border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;transition:border-color .15s,background .15s" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="width:42px;height:42px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--accent);flex-shrink:0;overflow:hidden">
            ${u.photo ? `<img src="${u.photo}" style="width:42px;height:42px;object-fit:cover;border-radius:50%">` : u.name.charAt(0).toUpperCase()}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:14px;font-weight:700;color:var(--text-0)">${u.name}</div>
            <div style="font-size:11px;color:var(--text-2)">${u.email||''}</div>
          </div>
          <div style="font-size:10px;background:${u.role==='admin'?'var(--accent)':'var(--bg-2)'};color:${u.role==='admin'?'#fff':'var(--text-2)'};padding:2px 8px;border-radius:99px">${u.role==='admin'?'Admin':'Utilisateur'}</div>
        </button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function loginAs(userId) {
  sessionStorage.setItem('psm_user', userId);
  const overlay = document.getElementById('login-overlay');
  if(overlay) overlay.remove();
  const u = _currentUser();
  notify('\uD83D\uDC4B Bonjour ' + (u?.name||'') + ' !', 'success');
  renderSidebar();
  showPage(APP.settings?.lastPage || 'dashboard');
  updateUserBadge();
}

function logoutUser() {
  sessionStorage.removeItem('psm_user');
  showLoginScreen();
}

function updateUserBadge() {
  const el = document.getElementById('topbar-user');
  if(!el) return;
  const u = _currentUser();
  if(!u) return;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="showUserSwitchMenu(this)" title="Changer d'utilisateur">
      <div style="width:28px;height:28px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--accent);overflow:hidden">
        ${u.photo ? `<img src="${u.photo}" style="width:28px;height:28px;object-fit:cover;border-radius:50%">` : u.name.charAt(0).toUpperCase()}
      </div>
      <span style="font-size:12px;color:var(--text-1);font-weight:600">${u.name}</span>
      <span style="font-size:10px;color:var(--text-3)">\u25be</span>
    </div>`;
}

function showUserSwitchMenu(el) {
  const existing = document.getElementById('user-switch-menu');
  if(existing) { existing.remove(); return; }
  const rect = el.getBoundingClientRect();
  const menu = document.createElement('div');
  menu.id = 'user-switch-menu';
  menu.style.cssText = `position:fixed;top:${rect.bottom+4}px;right:${window.innerWidth-rect.right}px;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 24px rgba(0,0,0,.3);z-index:999;min-width:180px;padding:6px`;
  const u = _currentUser();
  menu.innerHTML = `
    ${(APP.users||[]).filter(uu=>uu.id!==u?.id).map(uu=>`
    <button onclick="loginAs('${uu.id}');document.getElementById('user-switch-menu').remove()" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--text-0);font-size:13px" onmouseover="this.style.background='var(--bg-2)'" onmouseout="this.style.background='none'">
      <span style="font-size:15px">${uu.name.charAt(0).toUpperCase()}</span>${uu.name}
    </button>`).join('')}
    <div style="border-top:1px solid var(--border);margin:4px 0"></div>
    <button onclick="logoutUser();document.getElementById('user-switch-menu')?.remove()" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--danger);font-size:13px" onmouseover="this.style.background='var(--bg-2)'" onmouseout="this.style.background='none'">
      \uD83D\uDEAA Se d\u00e9connecter
    </button>`;
  document.body.appendChild(menu);
  setTimeout(()=>document.addEventListener('click',function h(e){if(!menu.contains(e.target)&&!el.contains(e.target)){menu.remove();document.removeEventListener('click',h);}},true),10);
}

