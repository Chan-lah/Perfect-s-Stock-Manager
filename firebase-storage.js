// ============================================================
// firebase-storage.js — PSM Image Storage (Firebase Storage)
// Images articles, commerciaux, utilisateurs, logo entreprise
// Spark plan : 5 GB gratuit, largement suffisant pour 200 images (~18 MB)
// ============================================================

var _firebaseStorageRef = null;

// ── Initialisation ────────────────────────────────────────────
(function _initStorage() {
  try {
    if (typeof firebase !== 'undefined' && typeof _firebaseApp !== 'undefined' && _firebaseApp) {
      _firebaseStorageRef = firebase.storage(_firebaseApp).ref();
      console.log('[PSM] Firebase Storage prêt');
    }
  } catch(e) {
    console.warn('[PSM] Firebase Storage init failed:', e.message || e);
  }
})();

// ── Limites de taille par type ────────────────────────────────
var _IMG_SIZE_LIMITS = {
  article:    3 * 1024 * 1024,   // 3 MB — photos gadgets
  commercial: 2 * 1024 * 1024,   // 2 MB — photos commerciaux
  user:       2 * 1024 * 1024,   // 2 MB — photos utilisateurs
  signature:    512 * 1024,       // 512 KB — signatures
  logo:       2 * 1024 * 1024    // 2 MB — logo entreprise
};

// Taille approximative d'un dataUrl en bytes (base64 overhead = ×0.75)
function _imgSizeBytes(dataUrl) {
  var b64 = (dataUrl || '').split(',')[1] || dataUrl || '';
  return Math.floor(b64.length * 0.75);
}

// Validation taille — retourne true si OK, false + notify si trop lourd
function _validateImgSize(dataUrl, type) {
  var limit = _IMG_SIZE_LIMITS[type] || _IMG_SIZE_LIMITS.article;
  var size  = _imgSizeBytes(dataUrl);
  if (size > limit) {
    var limitMB = (limit  / (1024 * 1024)).toFixed(0);
    var sizeMB  = (size   / (1024 * 1024)).toFixed(1);
    if (typeof notify === 'function')
      notify('Image trop lourde (' + sizeMB + ' MB) — limite ' + limitMB + ' MB. Compressez avant l\'import.', 'error');
    return false;
  }
  return true;
}

// Compression canvas : redimensionne à max 1200 px, JPEG 82%
function _compressImg(dataUrl, maxPx, quality) {
  return new Promise(function(resolve) {
    var img = new Image();
    img.onload = function() {
      var w = img.width, h = img.height, max = maxPx || 1200;
      if (w > max) { h = Math.round(h * max / w); w = max; }
      if (h > max) { w = Math.round(w * max / h); h = max; }
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', quality || 0.82));
    };
    img.onerror = function() { resolve(dataUrl); };
    img.src = dataUrl;
  });
}

// ── Upload principal ──────────────────────────────────────────
// dataUrl    : 'data:image/...' ou URL existante (https://)
// storagePath: 'psm/articles/abc123/photo.jpg'
// type       : 'article' | 'commercial' | 'user' | 'signature' | 'logo'
// Retourne   : URL publique Firebase Storage, ou dataUrl si Storage indisponible
async function _uploadImg(dataUrl, storagePath, type) {
  if (!dataUrl) return null;
  if (dataUrl.startsWith('https://')) return dataUrl; // déjà dans Storage

  if (!_firebaseStorageRef) {
    console.warn('[PSM] Storage indisponible — image conservée en local');
    return dataUrl;
  }

  // Validation taille (avant compression)
  if (!_validateImgSize(dataUrl, type)) throw new Error('IMAGE_TOO_LARGE');

  // Compression
  var compressed = await _compressImg(dataUrl, 1200, 0.82);
  var b64  = compressed.split(',')[1];
  var mime = (compressed.split(';')[0].split(':')[1]) || 'image/jpeg';

  // Upload
  var ref = _firebaseStorageRef.child(storagePath);
  await ref.putString(b64, 'base64', { contentType: mime });
  var url = await ref.getDownloadURL();
  return url;
}

// ── Suppression ───────────────────────────────────────────────
async function _deleteImg(url) {
  if (!url || !url.startsWith('https://') || !_firebaseStorageRef) return;
  try {
    await firebase.storage().refFromURL(url).delete();
  } catch(e) {
    // Fichier déjà supprimé ou URL invalide — silencieux
    console.warn('[PSM] Storage delete:', e.code || e.message);
  }
}

// ── Migration des images existantes vers Storage ──────────────
// À déclencher manuellement par l'admin depuis les Paramètres.
async function migrateImagesToStorage() {
  if (!_firebaseStorageRef || !_cloudUser) {
    notify('Firebase Storage non disponible', 'error'); return;
  }
  var ok = 0, fail = 0;
  notify('Migration images en cours...', 'info');

  for (var i = 0; i < (APP.articles || []).length; i++) {
    var art = APP.articles[i];
    if (art.image && art.image.startsWith('data:')) {
      try {
        art.image = await _uploadImg(art.image, 'psm/articles/' + art.id + '/photo.jpg', 'article');
        ok++;
      } catch(e) { fail++; }
    }
  }
  for (var j = 0; j < (APP.commerciaux || []).length; j++) {
    var com = APP.commerciaux[j];
    if (com.photo && com.photo.startsWith('data:')) {
      try {
        com.photo = await _uploadImg(com.photo, 'psm/commerciaux/' + com.id + '/photo.jpg', 'commercial');
        ok++;
      } catch(e) { fail++; }
    }
  }
  for (var k = 0; k < (APP.users || []).length; k++) {
    var u = APP.users[k];
    if (u.photo && u.photo.startsWith('data:')) {
      try {
        u.photo = await _uploadImg(u.photo, 'psm/users/' + u.id + '/photo.jpg', 'user');
        ok++;
      } catch(e) { fail++; }
    }
  }
  if (APP.settings && APP.settings.companyLogo && APP.settings.companyLogo.startsWith('data:')) {
    try {
      APP.settings.companyLogo = await _uploadImg(APP.settings.companyLogo, 'psm/settings/logo.jpg', 'logo');
      ok++;
    } catch(e) { fail++; }
  }

  if (ok > 0) {
    saveDB();
    try { localStorage.removeItem('psm_images_cache'); } catch(e) {}
  }
  notify(ok + ' image(s) migrée(s) vers Firebase Storage' + (fail ? ' / ' + fail + ' échec(s)' : '') + ' ✓', ok > 0 ? 'success' : 'warning');
}
