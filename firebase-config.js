// ============================================================
// firebase-config.js — PSM Firebase Configuration
// ============================================================

var firebaseConfig = {
  apiKey: "AIzaSyDZTNrUdTeiMkt91S10LPsEBQerYaz5y7g",
  authDomain: "perfect-stock-manager.firebaseapp.com",
  databaseURL: "https://perfect-stock-manager-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "perfect-stock-manager",
  storageBucket: "perfect-stock-manager.firebasestorage.app",
  messagingSenderId: "744729712901",
  appId: "1:744729712901:web:c32ce636d49d0528b4bf6c"
};

var _firebaseApp = null;
var _firebaseAuth = null;
var _firebaseDB = null;

try {
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    _firebaseApp = firebase.initializeApp(firebaseConfig);
    _firebaseAuth = firebase.auth();
    _firebaseDB = firebase.database();
    console.log('[PSM] Firebase ready');
  } else {
    console.warn('[PSM] Firebase SDK not loaded');
  }
} catch(e) {
  console.warn('[PSM] Firebase init error:', e);
}
