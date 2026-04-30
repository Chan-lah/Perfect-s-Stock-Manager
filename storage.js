// ============================================================
// storage.js — PSM Storage Layer
// Handles all data persistence: File System API, localStorage,
// IndexedDB, backups, image separation, and online/offline mode.
// ============================================================

// ── Online / Offline Mode ──────────────────────────────────
let _isConnected = navigator.onLine;

// Firebase Realtime DB converts arrays to objects {0:..., 1:..., 2:...}
// This function recursively restores them back to arrays
function _fixFirebaseArrays(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) obj[i] = _fixFirebaseArrays(obj[i]);
    return obj;
  }
  var keys = Object.keys(obj);
  // Check if all keys are consecutive integers starting from 0
  var isArray = keys.length > 0 && keys.every(function(k, i) { return String(i) === k; });
  if (isArray) {
    var arr = [];
    for (var j = 0; j < keys.length; j++) arr.push(_fixFirebaseArrays(obj[j]));
    return arr;
  }
  // Recurse into object properties
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) obj[k] = _fixFirebaseArrays(obj[k]);
  }
  return obj;
}

window.addEventListener('online',  function() { _isConnected = true;  _onOnlineStatusChange(); });
window.addEventListener('offline', function() { _isConnected = false; _onOnlineStatusChange(); });

function _onOnlineStatusChange() {
  var el = document.getElementById('online-status-dot');
  if (el) {
    el.style.background = _isConnected ? 'var(--success, #0f0)' : 'var(--danger, #f00)';
    el.title = _isConnected ? 'En ligne' : 'Hors ligne';
  }
  if (!_isConnected) {
    _updateSyncStatus('offline');
    if (typeof notify === 'function') notify('Connexion perdue \u2014 sauvegarde locale active', 'warning');
  } else {
    // Retour en ligne : relancer le save cloud si un \u00e9chec pr\u00e9c\u00e9dent
    _updateSyncStatus('syncing');
    if (typeof _doSaveToCloud === 'function' && typeof _cloudUser !== 'undefined' && _cloudUser) {
      setTimeout(function() {
        _doSaveToCloud()
          .then(function() { _updateSyncStatus('synced'); })
          .catch(function() { _updateSyncStatus('error'); });
      }, 1000);
    } else {
      _updateSyncStatus('synced');
    }
  }
}

// ── Cloud sync status indicator ──────────────────────────
var _syncStatusEl = null;
function _updateSyncStatus(state) {
  // state: 'syncing' | 'synced' | 'error' | 'offline'
  if (!_syncStatusEl) {
    _syncStatusEl = document.getElementById('cloud-sync-status');
  }
  if (!_syncStatusEl) {
    // Create indicator in top bar if not exists
    var topBar = document.querySelector('.top-bar') || document.querySelector('.sidebar-footer');
    if (topBar) {
      _syncStatusEl = document.createElement('div');
      _syncStatusEl.id = 'cloud-sync-status';
      _syncStatusEl.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 8px;border-radius:12px;margin-left:8px;transition:all .3s;cursor:default';
      topBar.appendChild(_syncStatusEl);
    }
  }
  if (!_syncStatusEl) return;
  if (state === 'syncing') {
    _syncStatusEl.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;border:2px solid var(--accent);border-top-color:transparent;animation:spin .8s linear infinite"></span> Sync...';
    _syncStatusEl.style.color = 'var(--accent)';
    _syncStatusEl.style.background = 'var(--accent)11';
    _syncStatusEl.title = 'Synchronisation en cours...';
  } else if (state === 'synced') {
    _syncStatusEl.innerHTML = '\u2601 Sync\u00e9';
    _syncStatusEl.style.color = 'var(--success)';
    _syncStatusEl.style.background = 'var(--success)11';
    _syncStatusEl.title = 'Donn\u00e9es synchronis\u00e9es avec le cloud';
    // Fade after 4s
    clearTimeout(_syncStatusEl._fadeTimer);
    _syncStatusEl._fadeTimer = setTimeout(function() {
      if (_syncStatusEl) _syncStatusEl.style.opacity = '0.5';
    }, 4000);
    _syncStatusEl.style.opacity = '1';
  } else if (state === 'error') {
    _syncStatusEl.innerHTML = '\u26a0 Sync \u00e9chou\u00e9';
    _syncStatusEl.style.color = 'var(--danger)';
    _syncStatusEl.style.background = 'var(--danger)11';
    _syncStatusEl.title = 'La synchronisation a \u00e9chou\u00e9 — nouvelle tentative automatique';
    _syncStatusEl.style.opacity = '1';
  } else if (state === 'offline') {
    _syncStatusEl.innerHTML = '\u26ab Hors ligne';
    _syncStatusEl.style.color = 'var(--text-3)';
    _syncStatusEl.style.background = 'var(--text-3)11';
    _syncStatusEl.title = 'Mode hors ligne — les donn\u00e9es seront synchronis\u00e9es au retour en ligne';
    _syncStatusEl.style.opacity = '1';
  }
}

// ── Cloud sync (Firebase Realtime Database) ─────────────
// Note: cloud sync is now driven exclusively by saveDB() which debounces _doSaveToCloud directly.

var _cloudSaving = false;
var _cloudSaveQueue = null; // pending save promise

// ── Cleanup obsolete localStorage keys ───────────────────────────────────
try {
  localStorage.removeItem('psm_section_hashes');
  localStorage.removeItem('psm_full_hash');
} catch(e) {}

// ── Data Integrity : Sig + Block + Version ─────────────────────────────

// Calcule la signature des données (snapshot des compteurs clés)
function _computeSig() {
  return {
    bons:       (APP.bons||[]).length,
    mouvements: (APP.mouvements||[]).length,
    articles:   (APP.articles||[]).length,
    ts:         APP._ts || 0
  };
}

// Vérifie qu'une signature est cohérente avec un objet de données
// Retourne true si OK, false si corruption détectée
function _sigConsistent(sig, data) {
  if (!sig) return true; // pas de sig = première installation
  var bons = (data.bons||[]).length;
  var mvts = (data.mouvements||[]).length;
  // Si sig dit N > 0 mais données = 0 → corruption
  if (sig.bons > 0 && bons === 0) {
    console.error('[PSM] Sig incohérente: sig.bons=' + sig.bons + ' mais APP.bons=' + bons);
    return false;
  }
  if (sig.mouvements > 5 && mvts === 0) {
    console.error('[PSM] Sig incohérente: sig.mouvements=' + sig.mouvements + ' mais APP.mouvements=' + mvts);
    return false;
  }
  return true;
}

// Garde avant push : bloque si état local est manifestement corrompu
function _pushAllowed() {
  if (!APP._sig) return true; // première save, pas de sig encore
  if (!_sigConsistent(APP._sig, APP)) {
    console.error('[PSM] PUSH BLOQUÉ — incohérence sig détectée avant upload');
    if (typeof notify === 'function') notify(
      '⛔ Sauvegarde bloquée : données incohérentes détectées. Rechargez la page.',
      'error'
    );
    return false;
  }
  return true;
}

async function _doSaveToCloud() {
  if (!_firebaseDB || !_cloudUser) return;
  // Guard : bloquer si données locales incohérentes
  if (!_pushAllowed()) return;
  _cloudSaving = true;
  _updateSyncStatus('syncing');
  // Pause real-time listener during save to prevent echo/race
  if (_realtimeListenerActive) {
    try { _firebaseDB.ref('app_data/data').off('value'); } catch(e) {}
    _realtimeListenerActive = false;
  }
  try {
    // Track local save timestamp to prevent realtime echo
    _lastLocalSaveTs = APP._ts || Date.now();

    // Strip images for compact JSON (Firebase RTDB has 16MB/node limit)
    var refs = (typeof _stripImages === 'function') ? _stripImages(APP) : null;
    // Exclude local-only keys from cloud payload (backups = ~6MB, stays local)
    var _backupsSaved = APP.backups;
    var _actLogSaved = APP._activityLog;
    delete APP.backups;
    delete APP._activityLog;
    var dataStr = JSON.stringify(APP);
    APP.backups = _backupsSaved;
    APP._activityLog = _actLogSaved;
    if (refs) _restoreImages(APP, refs);

    var dataObj = JSON.parse(dataStr);

    // Remove session-local settings from cloud data (per-user prefs)
    if (dataObj.settings) {
      delete dataObj.settings.theme;
      delete dataObj.settings._sidebarCollapsed;
      delete dataObj.settings.lastPage;
      delete dataObj.settings._hiddenPages;
      delete dataObj.settings._dynamicBg;
      delete dataObj.settings._dynamicBgIntensity;
    }
    // Garder les champs essentiels des users dans le cloud (rôle, matricule, prenom/nom)
    // Le rôle vient de Firebase profiles — pas secret. Le matricule est nécessaire pour les bons.
    if (dataObj.users) {
      dataObj.users = dataObj.users.map(function(u) {
        return {
          id: u.id, email: u.email, name: u.name,
          prenom: u.prenom || '', nom: u.nom || '',
          role: u.role || 'viewer',
          matricule: u.matricule || '',
          photo: u.photo, signature: u.signature
        };
      });
    }

    // Save images to localStorage cache for local restore
    try {
      var imgs = (typeof _extractImages === 'function') ? _extractImages(APP) : {};
      if (Object.keys(imgs).length > 0) {
        localStorage.setItem('psm_images_cache', JSON.stringify(imgs));
      }
    } catch(e) { console.warn('[PSM] images cache:', e); }

    // Incrémenter le compteur de version pour détecter les overwrites non voulus
    dataObj._dataVersion = (APP._dataVersion || 0) + 1;
    APP._dataVersion = dataObj._dataVersion;
    // Sig dans le payload cloud (permet de valider l'intégrité au prochain fetch)
    dataObj._sig = _computeSig();

    // ── Full upload ──
    await _firebaseDB.ref('app_data').set({
      data: dataObj,
      updated_at: new Date().toISOString()
    });
    console.log('[PSM] Cloud save FULL v' + dataObj._dataVersion + ' (_ts=' + _lastLocalSaveTs + ')');

  } catch(e) {
    console.warn('[PSM] _doSaveToCloud:', e);
    _updateSyncStatus('error');
  } finally {
    _cloudSaving = false;
    // Re-enable real-time listener after a short delay to skip our own echo
    setTimeout(function() {
      if (typeof startRealtimeSync === 'function' && !_realtimeListenerActive) {
        startRealtimeSync();
      }
    }, 500);
  }
}

async function _loadFromCloud() {
  if (!_firebaseDB || !_cloudUser) return null;
  try {
    var snap = await _firebaseDB.ref('app_data').once('value');
    if (!snap.exists()) {
      console.log('[PSM] No cloud data yet, will create on first save');
      return null;
    }

    var cloudEntry = snap.val();
    var cloudData = cloudEntry.data || null;

    if (cloudData) {
      // Fix Firebase arrays-as-objects (symmetric with realtime sync)
      if (typeof _fixFirebaseArrays === 'function') cloudData = _fixFirebaseArrays(cloudData);
      // Fallback users if cloud has never persisted a users array
      var _savedUsers = APP.users ? APP.users.slice() : [];
      // Save companyLogo before cloud overwrite
      var _savedLogo = APP.settings ? APP.settings.companyLogo : undefined;
      Object.assign(APP, cloudData);
      // Cloud wins for users (propagates admin deletions). Fallback only if cloud has no users array.
      if (!('users' in cloudData)) APP.users = _savedUsers;
      // Restore companyLogo if cloud version is empty/stripped
      if (_savedLogo && _savedLogo.indexOf('__img:') !== 0 && _savedLogo.length > 100) {
        if (!APP.settings) APP.settings = {};
        if (!APP.settings.companyLogo || APP.settings.companyLogo.length < 100) APP.settings.companyLogo = _savedLogo;
      }
      // Restore images from localStorage cache (not from cloud)
      try {
        var cachedImgs = localStorage.getItem('psm_images_cache');
        if (cachedImgs && typeof _restoreImages === 'function') {
          _restoreImages(APP, JSON.parse(cachedImgs));
        }
      } catch(e) {}
      console.log('[PSM] Cloud data loaded (_ts=' + (cloudData._ts||'none') + ')');
    }
    return cloudData;
  } catch(e) {
    console.warn('[PSM] _loadFromCloud:', e);
    return null;
  }
}

// ── Real-time sync listener ──────────────────────────────
var _realtimeListenerActive = false;
var _lastLocalSaveTs = 0;
// _firstSnapshot module-level : permet de ne pas sauter la première vraie MAJ
// après une reconnexion (vs une variable locale qui se réinitialise à chaque
// appel de startRealtimeSync, faisant rater les updates à la reconnexion).
var _realtimefirstSkipDone = false;

function startRealtimeSync() {
  if (!_firebaseDB || _realtimeListenerActive) return;
  _realtimeListenerActive = true;
  var _firstSnapshot = !_realtimefirstSkipDone;

  _firebaseDB.ref('app_data/data').on('value', function(snap) {
    // Skip the initial snapshot (we already loaded data)
    if (_firstSnapshot) { _firstSnapshot = false; _realtimefirstSkipDone = true; return; }
    if (!snap.exists()) return;
    // Skip if we're currently saving (prevents race conditions)
    if (_cloudSaving) return;
    var cloudData = snap.val();
    if (!cloudData || !cloudData._ts) return;

    // Skip if this is our own save echoing back (within 500ms)
    if (Math.abs(cloudData._ts - _lastLocalSaveTs) < 500) return;

    // Only update if cloud data is strictly newer
    if (cloudData._ts > (APP._ts || 0)) {
      console.log('[PSM] Real-time update received from another user');

      // Fix Firebase arrays-as-objects
      if (typeof _fixFirebaseArrays === 'function') cloudData = _fixFirebaseArrays(cloudData);

      // Preserve current user session & local settings before overwrite
      var _savedUsers = APP.users ? APP.users.slice() : [];
      var _savedTheme = APP.settings ? APP.settings.theme : 'dark';
      var _savedSidebar = APP.settings ? APP.settings._sidebarCollapsed : false;
      var _savedLastPage = APP.settings ? APP.settings.lastPage : 'dashboard';
      var _savedHiddenPages = APP.settings ? APP.settings._hiddenPages : undefined;
      var _savedDynBg = APP.settings ? APP.settings._dynamicBg : undefined;
      var _savedDynBgInt = APP.settings ? APP.settings._dynamicBgIntensity : undefined;
      var _savedCompanyLogo = APP.settings ? APP.settings.companyLogo : undefined;

      Object.assign(APP, cloudData);

      // Cloud wins for users (propagates admin deletions). Fallback only if cloud has no users array.
      if (!('users' in cloudData)) APP.users = _savedUsers;
      if (!APP.settings) APP.settings = {};
      APP.settings.theme = _savedTheme;
      APP.settings._sidebarCollapsed = _savedSidebar;
      APP.settings.lastPage = _savedLastPage;
      if (_savedHiddenPages !== undefined) APP.settings._hiddenPages = _savedHiddenPages;
      if (_savedDynBg !== undefined) APP.settings._dynamicBg = _savedDynBg;
      if (_savedDynBgInt !== undefined) APP.settings._dynamicBgIntensity = _savedDynBgInt;
      if (_savedCompanyLogo && _savedCompanyLogo.indexOf('__img:') !== 0 && _savedCompanyLogo.length > 100) APP.settings.companyLogo = _savedCompanyLogo;

      // Restore images from localStorage cache (not from cloud)
      try {
        var cachedImgs = localStorage.getItem('psm_images_cache');
        if (cachedImgs && typeof _restoreImages === 'function') {
          _restoreImages(APP, JSON.parse(cachedImgs));
        }
      } catch(e) {}
      // Re-render current page UNLESS user has a modal open (would lose form data)
      var _modalOpen = !!document.getElementById('active-modal');
      if (!_modalOpen && typeof showPage === 'function' && typeof currentPage !== 'undefined') {
        showPage(currentPage);
      }
      if (typeof updateUserBadge === 'function') updateUserBadge();
      if (typeof notify === 'function') notify(_modalOpen ? '\u2601 Donn\u00e9es mises \u00e0 jour (modal ouvert \u2014 fermez pour rafra\u00eechir)' : '\u2601 Donn\u00e9es mises \u00e0 jour', 'info');
    }
  });

  console.log('[PSM] Real-time sync active');
}

function stopRealtimeSync() {
  if (!_firebaseDB || !_realtimeListenerActive) return;
  _firebaseDB.ref('app_data/data').off('value');
  _realtimeListenerActive = false;
  console.log('[PSM] Real-time sync stopped');
}


// ── Data Validation / Standardization ───────────────────
function validateAppStructure() {
  if (typeof APP === 'undefined') return;
  // Ensure all required arrays exist
  var arrays = ['articles','bons','mouvements','commerciaux','fournisseurs',
                'commandesFourn','zones','secteurs','pdv','audit','backups','users'];
  arrays.forEach(function(k) { if (!Array.isArray(APP[k])) APP[k] = []; });

  // Ensure settings is an object
  if (!APP.settings || typeof APP.settings !== 'object') APP.settings = {};

  // Ensure dispatch structure
  if (!APP.dispatch || typeof APP.dispatch !== 'object') APP.dispatch = {};
  if (!APP.dispatch.besoins) APP.dispatch.besoins = {};
  if (!Array.isArray(APP.dispatch.entities)) APP.dispatch.entities = [];
  if (!APP.dispatch.weights) APP.dispatch.weights = {pdv:50,zone:20,history:30};
  if (!Array.isArray(APP.dispatch.history)) APP.dispatch.history = [];
  if (!APP.dispatch.rules) APP.dispatch.rules = {respectMin:true,respectMax:true};

  // Remove any function values (not JSON-safe)
  function cleanObj(obj, depth) {
    if (depth > 10) return;
    if (Array.isArray(obj)) {
      for (var i = obj.length - 1; i >= 0; i--) {
        if (typeof obj[i] === 'function') obj.splice(i, 1);
        else if (obj[i] && typeof obj[i] === 'object') cleanObj(obj[i], depth + 1);
      }
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(function(k) {
        if (typeof obj[k] === 'function') delete obj[k];
        else if (obj[k] && typeof obj[k] === 'object') cleanObj(obj[k], depth + 1);
      });
    }
  }
  cleanObj(APP, 0);

  // Ensure _ts exists
  if (!APP._ts) APP._ts = Date.now();
}

// ============================================================
// PAGE CACHE (for instant navigation)
// ============================================================
const _pageCache = {};
const _noCachePages = new Set(['dashboard','articles','mouvements','analytics','dispatch','audit','calendar','fourn-dashboard']);
function _invalidatePageCache(pageId) { if(pageId) delete _pageCache[pageId]; else Object.keys(_pageCache).forEach(k => delete _pageCache[k]); }

// ============================================================
// PERSISTENCE
// ============================================================
var _cloudSavePending = null; // track pending cloud save promise
var _cloudSaveDebounceTimer = null; // debounce timer for cloud saves

function saveDB() {
  APP._ts = Date.now();
  // Mettre à jour la signature AVANT l'invalidation (reflète l'état actuel)
  APP._sig = _computeSig();
  _invalidatePageCache();
  // ALWAYS save to localStorage (instant, reliable)
  // Sécu 4 : strip backup data → économise ~2.5MB dans localStorage
  // Les données complètes restent en mémoire (APP.backups) et dans PSm Saves.
  try {
    var _bkOrig = APP.backups;
    if (APP.backups) APP.backups = APP.backups.map(function(b){ return {id:b.id,ts:b.ts,size:b.size,hash:b.hash,label:b.label}; });
    localStorage.setItem('psm_pro_db', JSON.stringify(APP));
    APP.backups = _bkOrig;
  } catch(e) { try { APP.backups = _bkOrig; } catch(_){} }
  // Also save to file if available
  if (_dirHandle) { try { saveToFile(); } catch(e) {} }
  // Cloud sync: debounced 250ms (groups rapid successive changes into one upload)
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser) {
    clearTimeout(_cloudSaveDebounceTimer);
    _updateSyncStatus('syncing');
    _cloudSaveDebounceTimer = setTimeout(function() {
      _cloudSaveDebounceTimer = null;
      _cloudSavePending = _doSaveToCloud().then(function() {
        _cloudSavePending = null;
        _updateSyncStatus('synced');
      }).catch(function(e) {
        console.warn('[PSM] Cloud save failed:', e);
        _cloudSavePending = null;
        _updateSyncStatus('error');
        // Retry once after 5s
        setTimeout(function() {
          if (typeof _doSaveToCloud === 'function') {
            _updateSyncStatus('syncing');
            _doSaveToCloud().then(function() { _updateSyncStatus('synced'); })
              .catch(function() { _updateSyncStatus('error'); });
          }
        }, 5000);
      });
    }, 250);
  }
}

// saveDBNow — flush immediately, no debounce. Use for atomic user actions
// (button clicks, modal submits, status changes) where perceived instant feedback matters.
function saveDBNow() {
  APP._ts = Date.now();
  _invalidatePageCache();
  try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
  if (_dirHandle) { try { saveToFile(); } catch(e) {} }
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser) {
    // Cancel any pending debounce — we save immediately
    clearTimeout(_cloudSaveDebounceTimer);
    _cloudSaveDebounceTimer = null;
    _updateSyncStatus('syncing');
    _cloudSavePending = _doSaveToCloud().then(function() {
      _cloudSavePending = null;
      _updateSyncStatus('synced');
    }).catch(function(e) {
      console.warn('[PSM] Cloud save failed:', e);
      _cloudSavePending = null;
      _updateSyncStatus('error');
      setTimeout(function() {
        if (typeof _doSaveToCloud === 'function') {
          _updateSyncStatus('syncing');
          _doSaveToCloud().then(function() { _updateSyncStatus('synced'); })
            .catch(function() { _updateSyncStatus('error'); });
        }
      }, 5000);
    });
  }
}

// Flush pending cloud save when tab becomes hidden (user switches tab/closes)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden' && _cloudSaveDebounceTimer) {
    clearTimeout(_cloudSaveDebounceTimer);
    _cloudSaveDebounceTimer = null;
    if (typeof _doSaveToCloud === 'function' && typeof _firebaseDB !== 'undefined' && _firebaseDB) {
      _doSaveToCloud().catch(function() {});
    }
  }
});

// Block page unload if cloud save is pending or debounce still running
window.addEventListener('beforeunload', function(e) {
  if (_cloudSavePending || _cloudSaveDebounceTimer) {
    e.preventDefault();
    e.returnValue = 'Sauvegarde en cours...';
  }
});
function loadDB() {
  /* Migration legacy : appelée uniquement si le navigateur ne supporte pas showDirectoryPicker.
     Les données viennent désormais du fichier PSm Saves (Do Not Delete)/psm_data.json */
  try {
    const d = localStorage.getItem('psm_pro_db');
    if(d) {
      const p = JSON.parse(d);
      // Toute sauvegarde valide écrase l'état courant, même si les tableaux sont vides
      if(p && typeof p === 'object' && ('articles' in p || 'commerciaux' in p || 'settings' in p || 'bons' in p)) {
        Object.assign(APP, p);
        _savedDataLoaded = true;
      }
    }
  } catch(e) {}
}


// ── Audit log (thin wrapper — stays close to saveDB) ────
// auditLog remains in app.js; it calls saveDB() which is now here.

// ============================================================
// BACKUP SCHEDULER
// ============================================================
let _backupTimer = null;
let _savedDataLoaded = false; // true si des données ont été chargées depuis une sauvegarde
var _psmIsMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
var _lastBackupTs = 0; // timestamp of last successful backup (local or cloud)

async function _computeHash(str) {
  try {
    var enc = new TextEncoder().encode(str);
    var buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  } catch(e) { return null; }
}

function _updateBackupIndicator() {
  var el = document.getElementById('backup-indicator');
  if (!el) return;
  // Seed from existing backups if session has no recent backup yet
  if (!_lastBackupTs && typeof APP !== 'undefined' && APP && APP.backups && APP.backups.length) {
    var newest = APP.backups.reduce(function(m, b){ return (b && b.ts > m) ? b.ts : m; }, 0);
    if (newest) _lastBackupTs = newest;
  }
  if (!_lastBackupTs) { el.textContent = 'Aucun backup'; return; }
  var ago = Math.round((Date.now() - _lastBackupTs) / 60000);
  if (ago < 1) el.textContent = 'Backup : il y a < 1 min';
  else if (ago < 60) el.textContent = 'Backup : il y a ' + ago + ' min';
  else if (ago < 1440) el.textContent = 'Backup : il y a ' + Math.round(ago / 60) + 'h';
  else el.textContent = 'Backup : il y a ' + Math.round(ago / 1440) + 'j';
}
// Refresh indicator started after login (see startBackupScheduler)

function startBackupScheduler() {
  if(_backupTimer) clearInterval(_backupTimer);
  const min = parseInt(APP.settings.backupInterval)||180;
  if(min > 0) _backupTimer = setInterval(() => autoBackup(true), min * 60000);
  // Démarrer les indicateurs UI ici (après login) plutôt qu'au chargement du module
  setInterval(_updateBackupIndicator, 30000);
  setInterval(_updateSaveTimeAgo, 30000);
}
async function autoBackup(silent) {
  if(!APP.backups) APP.backups = [];
  // Backup leger : on ne stocke pas les images dans le backup
  var bkData;
  try {
    var refs = typeof _stripImages === 'function' ? _stripImages(APP) : null;
    bkData = JSON.stringify(APP);
    if(refs) _restoreImages(APP, refs);
  } catch(e) { bkData = null; } // backup impossible — trop volumineux
  if (!bkData) {
    console.warn('[PSM] autoBackup: données trop volumineuses pour le backup');
    if(!silent) notify('⚠ Backup impossible — données trop volumineuses', 'error');
    return;
  }
  var hash = await _computeHash(bkData);

  // Mobile: skip local retention (localStorage quota), only cloud snapshot
  if (_psmIsMobile) {
    _lastBackupTs = Date.now();
    _updateBackupIndicator();
    _saveCloudSnapshot(bkData, hash);
    if(!silent) notify('Snapshot cloud cr\u00e9\u00e9 \u2713','success');
    return;
  }

  var bk = { id:generateId(), ts:Date.now(), data:bkData, size:bkData.length, hash:hash };
  APP.backups.unshift(bk);
  // Garder les 5 dernières versions
  if(APP.backups.length > 5) APP.backups = APP.backups.slice(0, 5);
  _lastBackupTs = bk.ts;
  _updateBackupIndicator();
  saveDB();
  // PSm Saves : backup versionné + mise à jour psm_data.json
  if(_dirHandle) { _saveBackupToFile(bk); saveToFile(); }
  // Cloud snapshot (Niveau 2) — await pour détecter les échecs silencieux
  try {
    await _saveCloudSnapshot(bkData, hash);
    if(!silent) notify('Backup créé (' + APP.backups.length + '/5) \u2713','success');
  } catch(e) {
    console.error('[PSM] Cloud snapshot échoué:', e);
    notify('\u26a0 Backup local créé mais snapshot cloud échoué \u2014 réessayez', 'warning');
  }
}

async function _saveBackupToFile(bk) {
  try {
    var bkFolder;
    try { bkFolder = await _dirHandle.getDirectoryHandle('backups', {create:true}); }
    catch(e) { return; }
    var fname = 'backup_' + new Date(bk.ts).toISOString().slice(0,19).replace(/:/g,'-') + '.json';
    var fh = await bkFolder.getFileHandle(fname, {create:true});
    var w = await fh.createWritable();
    await w.write(bk.data);
    await w.close();
    // Nettoyer les anciens fichiers (garder 5)
    var files = [];
    for await (var entry of bkFolder.values()) {
      if(entry.kind === 'file' && entry.name.startsWith('backup_')) files.push(entry.name);
    }
    files.sort();
    while(files.length > 5) {
      await bkFolder.removeEntry(files.shift());
    }
  } catch(e) { console.warn('[PSM] backup file:', e); }
}

// ============================================================
// CLOUD SNAPSHOTS (Niveau 2) — horodatés, rotation 7 jours
// ============================================================
async function _saveCloudSnapshot(dataStr, hash) {
  if (!_firebaseDB || !_cloudUser) return;
  try {
    var now = new Date();
    var dayKey = now.toISOString().slice(0, 10).replace(/-/g, ''); // 20260416
    var uid = _cloudUser.uid;
    var ref = _firebaseDB.ref('backups/' + uid + '/' + dayKey);
    // On écrase le snapshot du jour (garder le plus récent de la journée)
    await ref.set({
      data: dataStr,
      meta: {
        version: (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '1.0.0',
        user: _cloudUser.email || '',
        hash: hash || null,
        size: dataStr.length,
        createdAt: now.toISOString(),
        ts: Date.now()
      }
    });
    console.log('[PSM] Cloud snapshot saved: ' + dayKey);
  } catch(e) {
    console.warn('[PSM] Cloud snapshot failed:', e);
  }
}

async function _purgeOldCloudSnapshots() {
  if (!_firebaseDB || !_cloudUser) return;
  try {
    var uid = _cloudUser.uid;
    var snap = await _firebaseDB.ref('backups/' + uid).once('value');
    var val = snap.val();
    if (!val) return;
    var keys = Object.keys(val).sort();
    // Garder les 7 derniers jours
    if (keys.length <= 7) return;
    var toDelete = keys.slice(0, keys.length - 7);
    var updates = {};
    toDelete.forEach(function(k) { updates[k] = null; });
    await _firebaseDB.ref('backups/' + uid).update(updates);
    console.log('[PSM] Purged ' + toDelete.length + ' old cloud snapshot(s)');
  } catch(e) {
    console.warn('[PSM] Snapshot purge failed:', e);
  }
}

async function _listCloudSnapshots() {
  if (!_firebaseDB || !_cloudUser) return [];
  try {
    var uid = _cloudUser.uid;
    var snap = await _firebaseDB.ref('backups/' + uid).once('value');
    var val = snap.val();
    if (!val) return [];
    return Object.keys(val).sort().reverse().map(function(dayKey) {
      var s = val[dayKey];
      var meta = s.meta || {};
      return {
        dayKey: dayKey,
        date: dayKey.slice(0,4) + '-' + dayKey.slice(4,6) + '-' + dayKey.slice(6,8),
        size: meta.size || 0,
        hash: meta.hash || null,
        createdAt: meta.createdAt || '',
        version: meta.version || ''
      };
    });
  } catch(e) {
    console.warn('[PSM] List snapshots failed:', e);
    return [];
  }
}

async function _restoreCloudSnapshot(dayKey) {
  if (!_firebaseDB || !_cloudUser) { notify('Firebase non disponible', 'error'); return false; }
  try {
    var uid = _cloudUser.uid;
    var snap = await _firebaseDB.ref('backups/' + uid + '/' + dayKey + '/data').once('value');
    var dataStr = snap.val();
    if (!dataStr) { notify('Snapshot introuvable', 'error'); return false; }
    var parsed = JSON.parse(dataStr);
    if (!parsed || typeof parsed !== 'object') { notify('Snapshot corrompu', 'error'); return false; }
    // Verify hash if available
    var metaSnap = await _firebaseDB.ref('backups/' + uid + '/' + dayKey + '/meta/hash').once('value');
    var expectedHash = metaSnap.val();
    if (expectedHash) {
      var actualHash = await _computeHash(dataStr);
      if (actualHash && actualHash !== expectedHash) {
        notify('Attention : hash du snapshot ne correspond pas. Restauration annulee.', 'error');
        return false;
      }
    }
    // Préserver les backups locaux et activity log actuels
    parsed.backups = APP.backups;
    parsed._activityLog = APP._activityLog;
    var _prevTs = APP._ts || 0;
    Object.assign(APP, parsed);
    APP._ts = Date.now();
    // Sécu 5 : tracer la restauration dans l'audit
    if (typeof auditLog === 'function') auditLog('RESTORE_SNAPSHOT', 'system', dayKey, {ts: _prevTs}, {dayKey: dayKey, restoredBy: (_cloudUser && _cloudUser.email) || 'admin'});
    // Fix bug regression Sprint G : même problème que restoreSpecificBackup
    APP._ts = Date.now();
    await _doSaveToCloud(); // forcer le save cloud AVANT de relancer l'app
    notify('Snapshot ' + dayKey + ' restaure avec succes', 'success');
    setTimeout(function() { if (typeof initApp === 'function') initApp(); }, 300);
    return true;
  } catch(e) {
    console.warn('[PSM] Restore snapshot failed:', e);
    notify('Erreur de restauration : ' + (e.message || e), 'error');
    return false;
  }
}

// ============================================================
// FILE SYSTEM PERSISTENCE — Dossier local "PSm Saves (Do Not Delete)"
// Les donnees sont sauvegardees dans un vrai fichier JSON sur le PC.
// Aucune donnee stockee dans le navigateur — persistance reelle.
// ============================================================
const _SAVE_FOLDER = 'PSm Saves (Do Not Delete)';
const _SAVE_FILE   = 'psm_data.json';
const _IMG_FILE    = 'psm_images.json';
let _imagesDirty = false;
let _imagesCache = {}; // {key: base64} — loaded once, written only when dirty

function _extractImages(appObj) {
  // Extract all base64 images from APP into _imagesCache, replace with refs
  // Collect image keys
  var imgs = {};
  (appObj.articles||[]).forEach(function(a, i) {
    if(a.image && a.image.length > 200) { imgs['art_'+a.id+'_img'] = a.image; }
    if(a._extraImages) a._extraImages.forEach(function(ex, j) {
      if(ex && ex.length > 200) imgs['art_'+a.id+'_ex'+j] = ex;
    });
  });
  var s = appObj.settings || {};
  if(s.companyLogo && s.companyLogo.length > 200) imgs.companyLogo = s.companyLogo;
  if(s.gmaLogo && s.gmaLogo.length > 200) imgs.gmaLogo = s.gmaLogo;
  if(s.bgImage && s.bgImage.length > 200) imgs.bgImage = s.bgImage;
  (appObj.users||[]).forEach(function(u) {
    var ukey = u.email ? u.email.replace(/[^a-zA-Z0-9]/g,'_') : u.id;
    if(u.signature && u.signature.length > 200) imgs['sig_'+ukey] = u.signature;
    if(u.photo && u.photo.length > 200) imgs['photo_'+ukey] = u.photo;
  });
  return imgs;
}

function _stripImages(appObj) {
  // Temporarily replace base64 with __img:key refs for compact JSON
  var refs = {};
  (appObj.articles||[]).forEach(function(a) {
    if(a.image && a.image.length > 200) { refs['art_'+a.id+'_img'] = a.image; a.image = '__img:art_'+a.id+'_img'; }
    if(a._extraImages) a._extraImages = a._extraImages.map(function(ex, j) {
      if(ex && ex.length > 200) { refs['art_'+a.id+'_ex'+j] = ex; return '__img:art_'+a.id+'_ex'+j; }
      return ex;
    });
  });
  var s = appObj.settings || {};
  if(s.companyLogo && s.companyLogo.length > 200) { refs.companyLogo = s.companyLogo; s.companyLogo = '__img:companyLogo'; }
  if(s.gmaLogo && s.gmaLogo.length > 200) { refs.gmaLogo = s.gmaLogo; s.gmaLogo = '__img:gmaLogo'; }
  if(s.bgImage && s.bgImage.length > 200) { refs.bgImage = s.bgImage; s.bgImage = '__img:bgImage'; }
  (appObj.users||[]).forEach(function(u) {
    var ukey = u.email ? u.email.replace(/[^a-zA-Z0-9]/g,'_') : u.id;
    if(u.signature && u.signature.length > 200) { refs['sig_'+ukey] = u.signature; u.signature = '__img:sig_'+ukey; }
    if(u.photo && u.photo.length > 200) { refs['photo_'+ukey] = u.photo; u.photo = '__img:photo_'+ukey; }
  });
  return refs;
}

function _restoreImages(appObj, refs) {
  // Put base64 back into APP from refs map
  (appObj.articles||[]).forEach(function(a) {
    if(a.image && a.image.indexOf('__img:')===0) { var k = a.image.slice(6); a.image = refs[k] || _imagesCache[k] || ''; }
    if(a._extraImages) a._extraImages = a._extraImages.map(function(ex) {
      if(ex && ex.indexOf('__img:')===0) { var k = ex.slice(6); return refs[k] || _imagesCache[k] || ''; }
      return ex;
    });
  });
  var s = appObj.settings || {};
  if(s.companyLogo && s.companyLogo.indexOf('__img:')===0) s.companyLogo = refs[s.companyLogo.slice(6)] || _imagesCache[s.companyLogo.slice(6)] || (typeof GMA_DEFAULT_LOGO !== 'undefined' ? GMA_DEFAULT_LOGO : '');
  if(s.gmaLogo && s.gmaLogo.indexOf('__img:')===0) s.gmaLogo = refs[s.gmaLogo.slice(6)] || _imagesCache[s.gmaLogo.slice(6)] || '';
  if(s.bgImage && s.bgImage.indexOf('__img:')===0) s.bgImage = refs[s.bgImage.slice(6)] || _imagesCache[s.bgImage.slice(6)] || '';
  (appObj.users||[]).forEach(function(u) {
    if(u.signature && u.signature.indexOf('__img:')===0) {
      var sk = u.signature.slice(6);
      u.signature = refs[sk] || _imagesCache[sk] || '';
    }
    if(u.photo && u.photo.indexOf('__img:')===0) {
      var pk = u.photo.slice(6);
      u.photo = refs[pk] || _imagesCache[pk] || '';
    }
  });
}

let _dirHandle = null;

// Sur Android, la File System Access API n'est pas disponible (ou tres limitee).
// On desactive completement les prompts "Sauvegarde persistante" pour ne pas polluer l'UX mobile.
const _IS_ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');

function _openIDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('psm_dir_storage', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('kv');
    req.onsuccess = e => res(e.target.result);
    req.onerror = () => rej(req.error);
    req.onblocked = () => rej(new Error('IDB blocked'));
    setTimeout(() => rej(new Error('IDB open timeout')), 3000);
  });
}
function _idbGet(db, key) {
  return new Promise((res, rej) => {
    const req = db.transaction('kv','readonly').objectStore('kv').get(key);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
function _idbSet(db, key, val) {
  return new Promise((res, rej) => {
    const tx = db.transaction('kv','readwrite');
    tx.objectStore('kv').put(val, key);
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
}



async function _loadFromDir() {
  if(!_dirHandle) return;
  try {
    // Load images cache first
    try {
      var ifh = await _dirHandle.getFileHandle(_IMG_FILE);
      var ifile = await ifh.getFile();
      var itext = await ifile.text();
      _imagesCache = JSON.parse(itext) || {};
    } catch(e) { _imagesCache = {}; }
    // Load data file
    var fh = await _dirHandle.getFileHandle(_SAVE_FILE);
    var file = await fh.getFile();
    var text = await file.text();
    var data = JSON.parse(text);
    if(data && typeof data === 'object' && ('articles' in data || 'commerciaux' in data || 'settings' in data || 'bons' in data)) {
      if(!APP._ts || (data._ts && data._ts >= APP._ts)) {
        Object.assign(APP, data);
        // Restore images from cache
        _restoreImages(APP, _imagesCache);
        _savedDataLoaded = true;
      }
    }
  } catch(e) {
    if(e.name !== 'NotFoundError') console.warn('[PSM] _loadFromDir:', e);
    // Premier usage : migration depuis localStorage
    try {
      var ls = localStorage.getItem('psm_pro_db');
      if(ls) {
        var lsData = JSON.parse(ls);
        if(lsData && typeof lsData === 'object' && ('articles' in lsData || 'commerciaux' in lsData || 'settings' in lsData)) {
          var legacyLogo = localStorage.getItem('gma_logo_b64');
          if(legacyLogo) { lsData.settings = lsData.settings || {}; lsData.settings.gmaLogo = legacyLogo; }
          Object.assign(APP, lsData);
          _imagesDirty = true;
          await _doSaveToFile();
          localStorage.removeItem('gma_logo_b64');
        }
      }
    } catch(e2) {}
  }
}

var _saveTimer = null;
function _debouncedSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(function(){ _doSaveToFile(); }, 3000);
}

async function saveToFile() {
  // Trigger debounced save
  if(!_dirHandle) return;
  _debouncedSave();
}

// Admin gate for storage persistence prompts (non-admins don't see setup UI)
function _canUseFilePersistence() {
  try { var u = typeof _currentUser === 'function' ? _currentUser() : null; return !!(u && u.role === 'admin'); }
  catch(e) { return false; }
}

// SHA-256 integrity hash (hex string) for post-save verification
async function _sha256Hex(str) {
  var buf = new TextEncoder().encode(str);
  var hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
}

async function _doSaveToFile() {
  if(!_dirHandle) return;
  try {
    var perm = await _dirHandle.queryPermission({mode:'readwrite'});
    if(perm !== 'granted') {
      updateFileSaveIndicator(false, 'Permission expir\u00e9e');
      return;
    }
    // Strip images from APP, save compact JSON
    var refs = _stripImages(APP);
    var jsonStr = JSON.stringify(APP);
    _restoreImages(APP, refs); // Restore in-memory immediately
    // Compute expected hash BEFORE writing
    var expectedHash = await _sha256Hex(jsonStr);
    // Write data file
    var fh = await _dirHandle.getFileHandle(_SAVE_FILE, {create:true});
    var w = await fh.createWritable();
    await w.write(jsonStr);
    await w.close();
    // ── Post-save verification : relire le fichier et comparer le SHA-256 ──
    // Détecte corruption silencieuse (disque plein mid-write, antivirus qui intercepte, etc.)
    try {
      var checkFile = await fh.getFile();
      var checkText = await checkFile.text();
      var actualHash = await _sha256Hex(checkText);
      if (actualHash !== expectedHash) {
        updateFileSaveIndicator(false, 'Hash mismatch post-save');
        if (typeof notify === 'function') notify('\u26a0 Sauvegarde fichier corrompue (hash mismatch). V\u00e9rifiez l\u2019espace disque / antivirus.', 'error');
        console.warn('[PSM] saveToFile hash mismatch: expected=' + expectedHash.slice(0,8) + ' actual=' + actualHash.slice(0,8));
        return;
      }
    } catch(verifyErr) {
      console.warn('[PSM] saveToFile verify failed:', verifyErr);
      // Vérif impossible → warning mais on n'annule pas (write a peut-être réussi)
    }
    // Bug 5 fix : toujours écrire le fichier images
    // (_imagesDirty n'était jamais mis à true → nouvelles photos/logos jamais sauvegardées)
    var newImgs = _extractImages(APP);
    Object.assign(_imagesCache, newImgs);
    if (Object.keys(_imagesCache).length > 0) {
      var imgJson = JSON.stringify(_imagesCache);
      var expectedImgHash = await _sha256Hex(imgJson);
      var ifh = await _dirHandle.getFileHandle(_IMG_FILE, {create:true});
      var iw = await ifh.createWritable();
      await iw.write(imgJson);
      await iw.close();
      try {
        var checkImgFile = await ifh.getFile();
        var checkImgText = await checkImgFile.text();
        var actualImgHash = await _sha256Hex(checkImgText);
        if (actualImgHash !== expectedImgHash)
          console.warn('[PSM] images file hash mismatch');
      } catch(imgVerifyErr) { console.warn('[PSM] images verify:', imgVerifyErr); }
    }
    _imagesDirty = false;
    updateFileSaveIndicator(true);
  } catch(e) {
    console.warn('[PSM] saveToFile:', e);
    updateFileSaveIndicator(false, e.message);
  }
}

let _pendingHandle = null; // handle stored but not yet authorized this session
let _autoReconnectBound = false;

async function initFileStorage() {
  // Toujours charger depuis localStorage en premier (fallback fiable)
  loadDB();
  if(_IS_ANDROID) return; // Android : pas de sauvegarde persistante locale (cloud + localStorage uniquement)
  if(!('showDirectoryPicker' in window)) return; // Firefox : localStorage seulement
  try {
    const db = await _openIDB();
    const handle = await _idbGet(db, 'dirHandle');
    if(handle) {
      let perm = await handle.queryPermission({mode:'readwrite'});
      if(perm === 'granted') {
        _dirHandle = handle;
        await _loadFromDir();
        return;
      }
      // Permission not granted yet — skip requestPermission during init (can hang behind splash)
      // Auto-reconnect on first user interaction instead
      {
        console.log('[PSM] Permission not granted yet, will auto-reconnect on first click');
      }
      // Store pending handle and setup auto-reconnect on first user interaction
      _pendingHandle = handle;
      _setupAutoReconnect();
    }
  } catch(e) { console.warn('[PSM] initFileStorage:', e); }
}

function _setupAutoReconnect() {
  if(_autoReconnectBound || !_pendingHandle) return;
  _autoReconnectBound = true;
  const handler = async () => {
    document.removeEventListener('click', handler, true);
    document.removeEventListener('keydown', handler, true);
    _autoReconnectBound = false;
    if(!_pendingHandle || _dirHandle) return;
    try {
      const perm = await _pendingHandle.requestPermission({mode:'readwrite'});
      if(perm === 'granted') {
        _dirHandle = _pendingHandle;
        _pendingHandle = null;
        await _loadFromDir();
        document.getElementById('psm-reconnect-bar')?.remove();
        document.body.style.paddingTop = '';
        updateFileSaveIndicator(true);
        notify('Sauvegarde locale reconnect\u00e9e automatiquement','success');
        if(currentPage === 'settings') renderSettings();
        // Re-render current page with loaded data
        await _finishAppInit();
      }
    } catch(e) {
      // Still needs explicit action — show reconnect bar as fallback
      _showReconnectBar();
    }
  };
  document.addEventListener('click', handler, true);
  document.addEventListener('keydown', handler, true);
}

async function _reconnectStorage() {
  if(!_pendingHandle) return;
  try {
    const perm = await _pendingHandle.requestPermission({mode:'readwrite'});
    if(perm === 'granted') {
      _dirHandle = _pendingHandle;
      _pendingHandle = null;
      // G7: ne pas charger depuis le fichier — cloud est la source de vérité
      document.getElementById('psm-reconnect-bar')?.remove();
      document.body.style.paddingTop = '';
      updateFileSaveIndicator(true);
      notify('Sauvegarde admin reconnectée ✓','success');
      if(currentPage === 'settings') renderSettings();
    }
  } catch(e) {
    notify('Autorisation refusée — réessayez ou reconfigurez','warning');
  }
}

async function pickSaveDirectory() {
  if(!('showDirectoryPicker' in window)) {
    notify('Utilisez Chrome ou Edge pour cette fonction', 'error'); return;
  }
  try {
    // L'utilisateur sélectionne un dossier parent (ex: Documents)
    const parentHandle = await window.showDirectoryPicker({
      id: 'psmSaveDir',
      startIn: 'documents',
      mode: 'readwrite'
    });
    // Vérifier/créer automatiquement le sous-dossier PSm Saves
    let saveDir;
    if(parentHandle.name === _SAVE_FOLDER) {
      // L'utilisateur a directement sélectionné le bon dossier
      saveDir = parentHandle;
    } else {
      // Chercher ou créer le sous-dossier dans le parent sélectionné
      saveDir = await parentHandle.getDirectoryHandle(_SAVE_FOLDER, {create: true});
    }
    _dirHandle = saveDir;
    const db = await _openIDB();
    await _idbSet(db, 'dirHandle', saveDir);
    await _loadFromDir();
    // Nettoyer uniquement le legacy logo
    try { localStorage.removeItem('gma_logo_b64'); } catch(ex) {}
    _closeSaveSetupModal();
    document.getElementById('psm-storage-banner')?.remove();
    updateFileSaveIndicator(true);
    notify('\u2705 Dossier "' + _SAVE_FOLDER + '" configur\u00e9 ! Sauvegarde automatique active.', 'success');
    if(currentPage === 'settings') renderSettings();
  } catch(e) {
    if(e.name !== 'AbortError') notify('Erreur : ' + e.message, 'error');
  }
}


function _showReconnectBar() {
  if(_IS_ANDROID) return;
  if(typeof _canUseFilePersistence === 'function' && !_canUseFilePersistence()) return;  // Non-admins
  if(document.getElementById('psm-reconnect-bar')) return;
  const el = document.createElement('div');
  el.id = 'psm-reconnect-bar';
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(90deg,#1a1a2e,#252545);border-bottom:2px solid #f5a623;padding:10px 20px;display:flex;align-items:center;justify-content:center;gap:14px;box-shadow:0 4px 16px rgba(0,0,0,.4)';
  el.innerHTML = `
    <span style="font-size:14px">💾</span>
    <span style="color:#fff;font-size:13px">Cliquez pour reconnecter votre sauvegarde locale</span>
    <button onclick="_reconnectStorage()" style="padding:6px 16px;background:#f5a623;color:#000;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">Autoriser</button>
  `;
  document.body.appendChild(el);
  // Also adjust main content so bar doesn't overlap
  document.body.style.paddingTop = '44px';
}

function _showStorageBanner() {
  if(_IS_ANDROID) return;
  if(!_canUseFilePersistence()) return;  // Non-admins : pas de banner
  if(document.getElementById('psm-storage-banner')) return;
  const el = document.createElement('div');
  el.id = 'psm-storage-banner';
  el.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9000;background:#1a1a2e;border:1px solid #f5a623;border-radius:12px;padding:12px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,.5);max-width:520px;width:90%';
  el.innerHTML = `
    <div style="font-size:22px">💾</div>
    <div style="flex:1;min-width:0">
      <div style="font-weight:700;font-size:13px;color:#fff">Sauvegarde non persistante</div>
      <div style="font-size:11px;color:#aaa;margin-top:2px">Sélectionnez votre dossier Documents pour activer la sauvegarde locale automatique.</div>
    </div>
    <button onclick="pickSaveDirectory()" style="padding:8px 14px;background:#f5a623;color:#000;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">📂 Configurer</button>
    <button onclick="document.getElementById('psm-storage-banner')?.remove()" style="padding:6px 10px;background:transparent;color:#666;border:none;cursor:pointer;font-size:16px">×</button>
  `;
  document.body.appendChild(el);
}

function _showSaveSetupModal() {
  if(!_canUseFilePersistence()) return;  // Non-admins : pas de modal
  if(document.getElementById('psm-save-setup')) return;
  const el = document.createElement('div');
  el.id = 'psm-save-setup';
  el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:inherit';
  el.innerHTML = `
    <div style="background:var(--bg-1,#1a1a2e);border:1px solid var(--border,#333);border-radius:16px;padding:40px 36px;max-width:500px;width:90%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.7)">
      <div style="font-size:52px;margin-bottom:16px">💾</div>
      <h2 style="margin:0 0 12px;font-size:22px;color:var(--text-1,#fff)">Configuration de la sauvegarde</h2>
      <p style="color:var(--text-2,#aaa);font-size:14px;margin:0 0 8px;line-height:1.6">
        Vos données seront enregistrées dans le dossier :<br>
        <strong style="color:#f5a623;font-size:15px">${_SAVE_FOLDER}</strong>
      </p>
      <p style="color:var(--text-3,#888);font-size:12px;margin:0 0 28px;line-height:1.6">
        Aucune donnée stockée dans le navigateur.<br>
        Même si vous nettoyez votre navigateur, vos données restent sur votre PC.<br>
        Sur un autre PC, sélectionnez votre dossier depuis une clé USB ou OneDrive.
      </p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <button onclick="pickSaveDirectory()" style="padding:14px 20px;background:#f5a623;color:#000;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer">
          📂 Sélectionner Mes Documents
        </button>
        <button onclick="pickSaveDirectory()" style="padding:13px 20px;background:var(--bg-2,#252540);color:var(--text-1,#fff);border:1px solid var(--border,#444);border-radius:10px;font-size:14px;cursor:pointer">
          📍 J'ai déjà le dossier ailleurs (clé USB, OneDrive...)
        </button>
      </div>
      <p style="color:var(--text-3,#666);font-size:11px;margin:20px 0 0;line-height:1.5">
        💡 Sélectionnez simplement <strong>Documents</strong> — le sous-dossier <strong>${_SAVE_FOLDER}</strong> sera créé automatiquement.</p>
    </div>`;
  document.body.appendChild(el);
}

function _closeSaveSetupModal() {
  const el = document.getElementById('psm-save-setup');
  if(el) el.remove();
}

function updateFileSaveIndicator(ok, errMsg) {
  var el = document.getElementById('file-save-indicator');
  if(!el) return;
  if(_IS_ANDROID) { el.innerHTML = ''; return; }
  // Non-admins ne voient aucun indicateur de stockage persistant
  if(!_canUseFilePersistence()) { el.innerHTML = ''; return; }
  if(!_dirHandle) {
    el.innerHTML = '<span onclick="_showSaveSetupModal()" title="Configurer le dossier de sauvegarde" style="color:var(--warning);font-size:10px;cursor:pointer;white-space:nowrap">⚠️ Non persistant</span>';
  } else if(ok === true) {
    updateFileSaveIndicator._lastSave = Date.now();
    el.innerHTML = '<span style="color:var(--success);font-size:10px;white-space:nowrap">✅ Sauvegardé</span>';
    setTimeout(function(){ _updateSaveTimeAgo(); }, 2000);
  } else {
    el.innerHTML = '<span onclick="_showSaveSetupModal()" title="' + (errMsg||'Erreur de sauvegarde') + '" style="color:var(--danger);font-size:10px;cursor:pointer;white-space:nowrap">❌ Erreur sauvegarde</span>';
  }
}

function _updateSaveTimeAgo() {
  var el = document.getElementById('file-save-indicator');
  if(!el || !_dirHandle || !updateFileSaveIndicator._lastSave) return;
  var diff = Math.floor((Date.now() - updateFileSaveIndicator._lastSave) / 1000);
  var ago;
  if(diff < 5) ago = '\u00e0 l\u2019instant';
  else if(diff < 60) ago = 'il y a ' + diff + 's';
  else if(diff < 3600) ago = 'il y a ' + Math.floor(diff/60) + 'min';
  else ago = 'il y a ' + Math.floor(diff/3600) + 'h';
  el.innerHTML = '<span title="Derni\u00e8re sauvegarde" style="color:var(--text-3);font-size:10px;white-space:nowrap;cursor:default">💾 ' + ago + '</span>';
}
// setInterval moved to startBackupScheduler() to avoid running before login

window.addEventListener('beforeunload', function(e) {
  if(!_dirHandle) {
    e.preventDefault();
    e.returnValue = "Aucun dossier de sauvegarde configur\u00e9. Vos modifications risquent d'etre perdues.";
  }
});


// ── Ctrl+S: Save to Firebase cloud ──────────────────────
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser) {
      APP._ts = Date.now();
      _doSaveToCloud().then(function() {
        if (typeof notify === 'function') notify('\u2601 Sauvegard\u00e9 dans le cloud', 'success');
      }).catch(function(err) {
        if (typeof notify === 'function') notify('\u274c Erreur de sauvegarde: ' + err.message, 'error');
      });
    } else {
      if (typeof notify === 'function') notify('\u26a0 Non connect\u00e9 — impossible de sauvegarder', 'warning');
    }
  }
});
