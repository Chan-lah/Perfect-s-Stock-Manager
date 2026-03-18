// ============================================================
// storage.js — PSM Storage Layer
// Handles all data persistence: File System API, localStorage,
// IndexedDB, backups, image separation, and online/offline mode.
// ============================================================

// ── Online / Offline Mode ──────────────────────────────────
let _onlineMode = false; // false = local, true = cloud (Firebase)
let _isConnected = navigator.onLine;

window.addEventListener('online',  function() { _isConnected = true;  _onOnlineStatusChange(); });
window.addEventListener('offline', function() { _isConnected = false; _onOnlineStatusChange(); });

function _onOnlineStatusChange() {
  var el = document.getElementById('online-status-dot');
  if (el) {
    el.style.background = _isConnected ? 'var(--success, #0f0)' : 'var(--danger, #f00)';
    el.title = _isConnected ? 'En ligne' : 'Hors ligne';
  }
  if (_onlineMode && !_isConnected) {
    if (typeof notify === 'function') notify('Connexion perdue — sauvegarde locale active', 'warning');
  }
}

function setOnlineMode(enabled) {
  _onlineMode = !!enabled;
  if (typeof APP !== 'undefined' && APP.settings) {
    APP.settings._onlineMode = _onlineMode;
  }
  if (_onlineMode && _isConnected) {
    // Sync with Firebase
    _saveToCloud();
  }
  if (typeof notify === 'function') {
    notify(_onlineMode ? 'Mode en ligne activ\u00e9' : 'Mode hors ligne', 'info');
  }
}

// ── Cloud sync (Firebase Realtime Database) ─────────────
var _cloudSaveTimer = null;

async function _saveToCloud() {
  // Debounce cloud saves (5 seconds)
  clearTimeout(_cloudSaveTimer);
  _cloudSaveTimer = setTimeout(_doSaveToCloud, 5000);
}

async function _doSaveToCloud() {
  if (!_firebaseDB || !_cloudUser) return;
  try {
    // Track local save timestamp to prevent realtime echo
    _lastLocalSaveTs = APP._ts || Date.now();

    // Strip images for compact JSON
    var refs = (typeof _stripImages === 'function') ? _stripImages(APP) : null;
    var dataStr = JSON.stringify(APP);
    if (refs) _restoreImages(APP, refs);

    var dataObj = JSON.parse(dataStr);

    // Extract images separately
    var imgs = (typeof _extractImages === 'function') ? _extractImages(APP) : {};

    // Save to Firebase Realtime Database (shared — all users see the same data)
    await _firebaseDB.ref('app_data').set({
      data: dataObj,
      images: imgs,
      updated_at: new Date().toISOString()
    });

    console.log('[PSM] Cloud save OK');
  } catch(e) {
    console.warn('[PSM] _doSaveToCloud:', e);
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
    var cloudImages = cloudEntry.images || {};

    if (cloudData) {
      // Use cloud data if newer than local (strict: cloud must be strictly newer)
      if (cloudData._ts && (!APP._ts || cloudData._ts > APP._ts)) {
        Object.assign(APP, cloudData);
        if (typeof _restoreImages === 'function') {
          _restoreImages(APP, cloudImages);
        }
        console.log('[PSM] Cloud data loaded (cloud _ts=' + cloudData._ts + ', local _ts=' + APP._ts + ')');
      } else {
        console.log('[PSM] Local data is newer or equal, keeping local (cloud _ts=' + (cloudData._ts||0) + ', local _ts=' + (APP._ts||0) + ')');
        // Push local data to cloud since it's newer
        _doSaveToCloud();
      }
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

function startRealtimeSync() {
  if (!_firebaseDB || _realtimeListenerActive) return;
  _realtimeListenerActive = true;
  var _firstSnapshot = true;

  _firebaseDB.ref('app_data/data').on('value', function(snap) {
    // Skip the initial snapshot (we already loaded data)
    if (_firstSnapshot) { _firstSnapshot = false; return; }
    if (!snap.exists()) return;
    var cloudData = snap.val();
    if (!cloudData || !cloudData._ts) return;

    // Skip if this is our own save echoing back (within 3 seconds)
    if (Math.abs(cloudData._ts - _lastLocalSaveTs) < 3000) return;

    // Only update if cloud data is strictly newer
    if (cloudData._ts > (APP._ts || 0)) {
      console.log('[PSM] Real-time update received from another user');
      Object.assign(APP, cloudData);

      // Also load images
      _firebaseDB.ref('app_data/images').once('value').then(function(imgSnap) {
        if (imgSnap.exists()) {
          var imgs = imgSnap.val();
          if (typeof _restoreImages === 'function') _restoreImages(APP, imgs);
        }
        // Re-render current page
        if (typeof showPage === 'function' && typeof currentPage !== 'undefined') {
          showPage(currentPage);
        }
        if (typeof updateUserBadge === 'function') updateUserBadge();
        if (typeof notify === 'function') notify('\u2601 Donn\u00e9es mises \u00e0 jour', 'info');
      });
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
function saveDB() {
  APP._ts = Date.now();
  _invalidatePageCache();
  if(_dirHandle) saveToFile();
  else {
    // Fallback localStorage seulement si pas de fichier local
    try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
  }
  // Cloud sync: immediate save (no debounce)
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser) {
    _doSaveToCloud();
  }
}
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
function startBackupScheduler() {
  if(_backupTimer) clearInterval(_backupTimer);
  const min = parseInt(APP.settings.backupInterval)||5;
  if(min > 0) _backupTimer = setInterval(() => autoBackup(true), min * 60000);
}
function autoBackup(silent) {
  if(!APP.backups) APP.backups = [];
  // Backup leger : on ne stocke pas les images dans le backup
  var bkData;
  try {
    var refs = typeof _stripImages === 'function' ? _stripImages(APP) : null;
    bkData = JSON.stringify(APP);
    if(refs) _restoreImages(APP, refs);
  } catch(e) { bkData = JSON.stringify({error:'backup too large'}); }
  var bk = { id:generateId(), ts:Date.now(), data:bkData, size:bkData.length };
  APP.backups.unshift(bk);
  // Garder seulement les 5 dernières versions
  if(APP.backups.length > 5) APP.backups = APP.backups.slice(0, 5);
  saveDB();
  // Sauvegarder aussi en fichier si disponible
  if(_dirHandle) _saveBackupToFile(bk);
  if(!silent) notify('Backup créé (' + APP.backups.length + '/5) ✓','success');
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
  if(s.companyLogo && s.companyLogo.indexOf('__img:')===0) s.companyLogo = refs[s.companyLogo.slice(6)] || _imagesCache[s.companyLogo.slice(6)] || '';
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
    // Write data file
    var fh = await _dirHandle.getFileHandle(_SAVE_FILE, {create:true});
    var w = await fh.createWritable();
    await w.write(jsonStr);
    await w.close();
    // Write images file only if dirty
    if(_imagesDirty) {
      var newImgs = _extractImages(APP);
      Object.assign(_imagesCache, newImgs);
      var ifh = await _dirHandle.getFileHandle(_IMG_FILE, {create:true});
      var iw = await ifh.createWritable();
      await iw.write(JSON.stringify(_imagesCache));
      await iw.close();
      _imagesDirty = false;
    }
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
      await _loadFromDir();
      document.getElementById('psm-reconnect-bar')?.remove();
      document.body.style.paddingTop = '';
      updateFileSaveIndicator(true);
      notify('Sauvegarde locale reconnectée','success');
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
setInterval(_updateSaveTimeAgo, 30000);

window.addEventListener('beforeunload', function(e) {
  if(!_dirHandle) {
    e.preventDefault();
    e.returnValue = "Aucun dossier de sauvegarde configur\u00e9. Vos modifications risquent d'etre perdues.";
  }
});


// ── Augmented saveDB: route to cloud when online mode ───
(function() {
  var _origSaveDB = saveDB;
  saveDB = function() {
    _origSaveDB();
    if (_onlineMode && _isConnected) {
      _saveToCloud();
    }
  };
})();
