// ============================================================
// PSM — version + error handling (injected top-of-file)
// ============================================================
var APP_VERSION = '1.0.0';
var APP_BUILD_DATE = '2026-04-15';

function logError(context, error, meta) {
  try {
    var payload = {
      version: APP_VERSION,
      context: context || 'unknown',
      message: (error && error.message) ? String(error.message) : String(error),
      stack: (error && error.stack) ? String(error.stack).slice(0, 4000) : null,
      url: (typeof location !== 'undefined') ? location.href : null,
      userAgent: (typeof navigator !== 'undefined') ? navigator.userAgent : null,
      timestamp: Date.now(),
      user: (typeof _userProfile !== 'undefined' && _userProfile && _userProfile.email) ? _userProfile.email : null,
      meta: meta || null
    };
    try { console.error('[PSM]', context, error, meta || ''); } catch(e) {}
    try {
      if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _firebaseAuth !== 'undefined' && _firebaseAuth && _firebaseAuth.currentUser) {
        _firebaseDB.ref('error_log').push(payload).catch(function(){});
      }
    } catch(e) {}
    try {
      if (typeof Sentry !== 'undefined' && Sentry.captureException) {
        Sentry.captureException(error, { extra: meta || {}, tags: { context: context || 'unknown', version: APP_VERSION } });
      }
    } catch(e) {}
  } catch(e) { /* never let logError throw */ }
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', function(e) {
    logError('uncaught', e.error || new Error(e.message || 'unknown'), { filename: e.filename, lineno: e.lineno, colno: e.colno });
  });
  window.addEventListener('unhandledrejection', function(e) {
    logError('unhandled_promise', e.reason || new Error('unhandled rejection'));
  });
}

(function(){
  // Splash stays visible until Firebase is connected + data synced
  var _splashProgress = 0;
  var _splashInterval = null;

  window._splashSetProgress = function(pct, text) {
    var bar = document.getElementById('splash-bar-fill');
    var label = document.getElementById('splash-label');
    if (pct > _splashProgress) _splashProgress = pct;
    if (bar) { bar.style.transition = 'width 0.25s ease'; bar.style.width = _splashProgress + '%'; }
    if (label && text) label.textContent = text;
  };

  var _splashStart = Date.now();
  window._splashHide = function() {
    var elapsed = Date.now() - _splashStart;
    var MIN_SPLASH_MS = 200;
    var wait = Math.max(0, MIN_SPLASH_MS - elapsed);
    setTimeout(function(){
      clearInterval(_splashInterval);
      var bar = document.getElementById('splash-bar-fill');
      var label = document.getElementById('splash-label');
      var splash = document.getElementById('splash');
      var app = document.getElementById('app');
      if(bar) { bar.style.transition = 'width 0.25s cubic-bezier(0.4,0,0.2,1)'; bar.style.width = '100%'; }
      if(label) label.textContent = 'Pr\u00eat !';
      setTimeout(function(){
        if(splash) splash.classList.add('splash-out');
        if(app) app.classList.remove('splash-hidden');
        setTimeout(function(){
          if(splash && splash.parentNode) splash.parentNode.removeChild(splash);
        }, 500);
      }, 150);
    }, wait);
  };

  // Gentle progress animation while waiting
  document.addEventListener('DOMContentLoaded', function(){
    var bar = document.getElementById('splash-bar-fill');
    var label = document.getElementById('splash-label');
    if(label) label.textContent = 'Connexion au serveur\u2026';
    _splashInterval = setInterval(function(){
      if(_splashProgress < 30) {
        _splashProgress += Math.random() * 2 + 0.8;
        if(_splashProgress > 30) _splashProgress = 30;
        if(bar) bar.style.width = _splashProgress + '%';
      }
    }, 220);
  });
})();


// ============================================================
// I18N — LANGUAGE SYSTEM (FR / EN)
// ============================================================
const I18N = {
  fr: {
    // Navigation & Pages
    dashboard: 'Tableau de bord', articles: 'Gadgets & Stock', bons: 'Bons de sortie',
    commerciaux: 'Commerciaux', fournisseurs: 'Fournisseurs', calendar: 'Calendrier',
    dispatch: 'Dispatch', settings: 'Paramètres', audit: 'Audit', zones: 'Zones',
    'fourn-dashboard': 'Suivi livraisons',
    // Common actions
    add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer',
    cancel: 'Annuler', confirm: 'Confirmer', close: 'Fermer', search: 'Rechercher...',
    export: 'Export', import: 'Import', print: 'Imprimer', back: 'Retour',
    // Dashboard
    stock_value: 'Valeur du stock', total_articles: 'Total gadgets',
    stock_alerts: 'Alertes stock', recent_movements: 'Mouvements récents',
    stock_by_category: 'Stock par catégorie', movement_history: 'Historique mouvements',
    stock_report: 'Rapport de stock', entries: 'Entrées', exits: 'Sorties',
    // Articles
    name: 'Nom', code: 'Code', category: 'Catégorie', stock: 'Stock',
    stock_min: 'Stock minimum', unit: 'Unité', price: 'Prix', status: 'Statut',
    supplier: 'Fournisseur', contact: 'Contact', current_stock: 'Stock actuel',
    all_categories: 'Toutes catégories', all_stock: 'Tout le stock',
    alert: 'En alerte', stock_ok: 'Stock OK', image: 'Image',
    description: 'Description', new_article: 'Nouvel article', edit_article: 'Modifier article',
    // Bons
    bon_number: 'N° Bon', company: 'Entreprise', recipient: 'Destinataire',
    gadgets: 'Gadgets', date: 'Date', actions: 'Actions', requester: 'Demandeur',
    object_reason: 'Objet / Motif', validity: 'Validité', new_bon: 'Nouveau bon de sortie',
    edit_bon: 'Modifier bon de sortie', draft: 'Brouillon', validated: 'Validé',
    cancelled: 'Annulé', verify: 'Vérifier', restock: 'Réappro',
    // Commerciaux
    firstname: 'Prénom', lastname: 'Nom', zone: 'Zone', sector: 'Secteur',
    pdv_count: 'PDV', phone: 'Téléphone', email: 'Email',
    // Fournisseurs
    contact_name: 'Nom du contact', company_name: 'Entreprise / Société',
    address: 'Adresse', orders: 'Commandes', tracking: 'Suivi',
    manage_articles: 'Gérer les articles',
    // Delivery planner
    qty_ordered: 'Qté cmd.', qty_received: 'Qté reçue', delivery_date: 'Date livraison',
    delivery_status: 'Statut', pending: 'En attente', in_progress: 'En cours',
    delivered: 'Livré',
    // Settings
    company_settings: 'Entreprise', data: 'Données', theme: 'Thème',
    currency: 'Devise', language: 'Langue', persistent_storage: 'Stockage Persistant',
    categories_gadgets: 'Catégories de gadgets', zone_management: 'Gestion des Zones',
    auto_backups: 'Sauvegardes automatiques', backup_frequency: 'Fréquence',
    save_now: 'Sauvegarder maintenant', reset: 'Reset complet',
    export_json: 'Export global JSON', import_json: 'Import JSON',
    // Calendar
    month: 'Mois', week: 'Semaine', day: 'Jour', today: "Aujourd'hui",
    // Page IDs (for sidebar)
    mouvements: 'Mouvements', territoire: 'Zones & Secteurs', pdv: 'Points de Vente',
    'gma-catalogue': 'Catalogue GMA', analytics: 'Analytique',
    boneditor: 'Éditeur de Bon',
    // Misc
    no_data: 'Aucune donnée', loading: 'Chargement...', success: 'Succès',
    error: 'Erreur', warning: 'Attention', info: 'Info',
    insufficient_stock: 'Stock insuffisant pour',
    available: 'Dispo',
    // Dispatch v2
    allocation: 'Répartition', needsMatrix: 'Matrice Besoins', summary: 'Récapitulatif',
    history: 'Historique', entities: 'Entités', target: 'Cible', allocated: 'Alloué',
    recipient: 'Destinataire', total: 'Total', details: 'Détails', calculate: 'Calculer',
    qtyToDispatch: 'Qté à répartir', editNeeds: 'Besoins', autoSuggest: 'Suggestion auto',
    autoSuggestApplied: 'Suggestions appliquées', needsSaved: 'Besoins enregistrés',
    dispatchSettings: 'Paramètres Dispatch', allocWeights: 'Poids d\'allocation',
    zonePriority: 'Priorité par zone', priority: 'Priorité',
    settingsSaved: 'Paramètres enregistrés', entityManager: 'Gestionnaire d\'entités',
    noArticlesInStock: 'Aucun article en stock', noHistory: 'Aucun historique',
    noRecipients: 'Aucun destinataire configuré', enterQty: 'Saisissez une quantité',
    insufficientStock: 'Stock insuffisant', validateDispatch: 'Valider la répartition',
    dispatchValidated: 'Répartition validée', configured: 'configuré(s)',
  },
  en: {
    // Navigation & Pages
    dashboard: 'Dashboard', articles: 'Gadgets & Stock', bons: 'Outgoing Vouchers',
    commerciaux: 'Sales Reps', fournisseurs: 'Suppliers', calendar: 'Calendar',
    dispatch: 'Dispatch', settings: 'Settings', audit: 'Audit', zones: 'Zones',
    'fourn-dashboard': 'Delivery Tracking',
    // Common actions
    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save',
    cancel: 'Cancel', confirm: 'Confirm', close: 'Close', search: 'Search...',
    export: 'Export', import: 'Import', print: 'Print', back: 'Back',
    // Dashboard
    stock_value: 'Stock Value', total_articles: 'Total Gadgets',
    stock_alerts: 'Stock Alerts', recent_movements: 'Recent Movements',
    stock_by_category: 'Stock by Category', movement_history: 'Movement History',
    stock_report: 'Stock Report', entries: 'Entries', exits: 'Exits',
    // Articles
    name: 'Name', code: 'Code', category: 'Category', stock: 'Stock',
    stock_min: 'Minimum Stock', unit: 'Unit', price: 'Price', status: 'Status',
    supplier: 'Supplier', contact: 'Contact', current_stock: 'Current Stock',
    all_categories: 'All Categories', all_stock: 'All Stock',
    alert: 'Alert', stock_ok: 'Stock OK', image: 'Image',
    description: 'Description', new_article: 'New Article', edit_article: 'Edit Article',
    // Bons
    bon_number: 'Voucher #', company: 'Company', recipient: 'Recipient',
    gadgets: 'Gadgets', date: 'Date', actions: 'Actions', requester: 'Requester',
    object_reason: 'Purpose / Reason', validity: 'Validity', new_bon: 'New Outgoing Voucher',
    edit_bon: 'Edit Outgoing Voucher', draft: 'Draft', validated: 'Validated',
    cancelled: 'Cancelled', verify: 'Verify', restock: 'Restock',
    // Commerciaux
    firstname: 'First Name', lastname: 'Last Name', zone: 'Zone', sector: 'Sector',
    pdv_count: 'POS', phone: 'Phone', email: 'Email',
    // Fournisseurs
    contact_name: 'Contact Name', company_name: 'Company / Organization',
    address: 'Address', orders: 'Orders', tracking: 'Tracking',
    manage_articles: 'Manage Articles',
    // Delivery planner
    qty_ordered: 'Qty Ordered', qty_received: 'Qty Received', delivery_date: 'Delivery Date',
    delivery_status: 'Status', pending: 'Pending', in_progress: 'In Progress',
    delivered: 'Delivered',
    // Settings
    company_settings: 'Company', data: 'Data', theme: 'Theme',
    currency: 'Currency', language: 'Language', persistent_storage: 'Persistent Storage',
    categories_gadgets: 'Gadget Categories', zone_management: 'Zone Management',
    auto_backups: 'Auto Backups', backup_frequency: 'Frequency',
    save_now: 'Save Now', reset: 'Full Reset',
    export_json: 'Export Full JSON', import_json: 'Import JSON',
    // Calendar
    month: 'Month', week: 'Week', day: 'Day', today: 'Today',
    // Page IDs (for sidebar)
    mouvements: 'Movements', territoire: 'Zones & Sectors', pdv: 'Points of Sale',
    'gma-catalogue': 'GMA Catalogue', analytics: 'AI Analytics',
    boneditor: 'Voucher Editor',
    // Misc
    no_data: 'No data', loading: 'Loading...', success: 'Success',
    error: 'Error', warning: 'Warning', info: 'Info',
    insufficient_stock: 'Insufficient stock for',
    available: 'Available',
    // Dispatch v2
    allocation: 'Allocation', needsMatrix: 'Needs Matrix', summary: 'Summary',
    history: 'History', entities: 'Entities', target: 'Target', allocated: 'Allocated',
    recipient: 'Recipient', total: 'Total', details: 'Details', calculate: 'Calculate',
    qtyToDispatch: 'Qty to dispatch', editNeeds: 'Needs', autoSuggest: 'Auto-suggest',
    autoSuggestApplied: 'Suggestions applied', needsSaved: 'Needs saved',
    dispatchSettings: 'Dispatch Settings', allocWeights: 'Allocation Weights',
    zonePriority: 'Zone Priority', priority: 'Priority',
    settingsSaved: 'Settings saved', entityManager: 'Entity Manager',
    noArticlesInStock: 'No articles in stock', noHistory: 'No history',
    noRecipients: 'No recipients configured', enterQty: 'Enter a quantity',
    insufficientStock: 'Insufficient stock', validateDispatch: 'Validate dispatch',
    dispatchValidated: 'Dispatch validated', configured: 'configured',
  }
};

function _lang() { return APP.settings?.lang || 'fr'; }
function t(key) { return (I18N[_lang()] && I18N[_lang()][key]) || (I18N.fr[key]) || key; }
function setLang(lang) {
  APP.settings.lang = lang;
  saveDB();
  // Re-render current page
  const curPage = APP.settings?.lastPage || 'dashboard';
  renderSidebar();
  showPage(curPage);
  notify(lang === 'fr' ? 'Langue : Français' : 'Language: English', 'success');
}

// ============================================================
// DATA STORE
// ============================================================
const GMA_DEFAULT_LOGO = 'data:image/png;base64,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';

let APP = {
  // ── GADGETS / ARTICLES ───────────────────────────────────────
  articles: [
    // ── INSTITUTIONNELS ──
    {id:'gma001',name:'Chasubles GMA (Marron & Orange)',        code:'MY0A003',category:'INSTITUTIONNELS',fournisseur:'2BPUB',        colors:'Marron, Orange',       description:'Chasubles aux couleurs GMA',       unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma002',name:'Tabliers GMA (Marron & Orange)',         code:'MY0A005',category:'INSTITUTIONNELS',fournisseur:'2BPUB',        colors:'Marron, Orange',       description:'Tabliers aux couleurs GMA',        unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma003',name:'Seaux GMA',                              code:'MY0A125',category:'INSTITUTIONNELS',fournisseur:'2BPUB',        colors:'',                     description:'Seaux GMA',                        unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma004',name:'Pelons GMA',                             code:'MY0A058',category:'INSTITUTIONNELS',fournisseur:"POUVOIR D'ART",colors:'',                     description:'Pelons GMA',                       unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma005',name:'Cahiers GMA A4',                           code:'MY0A136',category:'INSTITUTIONNELS',fournisseur:'',            colors:'',                     description:'Cahiers GMA format A4',             unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma020',name:'Cahiers GMA A5',                           code:'MY0A236',category:'INSTITUTIONNELS',fournisseur:'',            colors:'',                     description:'Cahiers GMA format A5',             unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma006',name:'Pagnes GMA (Pièces)',               code:'MY0A-PGN',category:'INSTITUTIONNELS',fournisseur:'2BPUB',       colors:'',                     description:'Pagnes GMA à la pièce',  unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma007',name:'Parasols GMA',                           code:'MY0A-PAR',category:'INSTITUTIONNELS',fournisseur:'2BPUB',       colors:'',                     description:'Parasols GMA',                     unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma008',name:'Tee-Shirt GMA (Marron, Orange et Blanc)',code:'MY0A068',category:'INSTITUTIONNELS',fournisseur:'',            colors:'Marron, Orange, Blanc',description:'Tee-shirts GMA tricolore',         unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma009',name:'Casquette GMA (Beige & Blanc)',          code:'MY0A-CAS',category:'INSTITUTIONNELS',fournisseur:"POUVOIR D'ART",colors:'Beige, Blanc',        description:'Casquettes GMA bicolore',          unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    // ── SUPER-BEIGNETS ──
    {id:'gma010',name:'Tee-shirts Super-Beignets',              code:'MY0A157',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tee-shirts Super-Beignets',        unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma011',name:'Tabliers Super-Beignets Plus',           code:'MY0A159',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tabliers Super-Beignets Plus',     unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma012',name:'Seaux Super-Beignets',                   code:'MY0A161',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Seaux Super-Beignets',             unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma013',name:'Bassines Super-Beignets',                code:'MY0A120',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Bassines Super-Beignets',          unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma014',name:'Tabliers Super-Beignets Simple',         code:'MY0A121',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tabliers Super-Beignets Simple',   unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma015',name:'Tee-shirt Super-Beignets Plus',          code:'MY0A117',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tee-shirts Super-Beignets Plus',   unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    // ── EXCEPTIONNEL - DIVERS ──
    {id:'gma016',name:'Polos 60 ans',                           code:'MY0A201',category:'EXCEPTIONNEL - DIVERS',fournisseur:'2BPUB',   colors:'',                     description:'Polos édition 60 ans',        unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma017',name:'Tee-shirt beige 60 ans',                 code:'MY0A-T60',category:'EXCEPTIONNEL - DIVERS',fournisseur:'2BPUB',  colors:'Beige',                description:'Tee-shirts beige 60 ans',          unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    // ── SOGO BALO PRO ──
    {id:'gma018',name:'Tee-shirt Sogo Balo Pro',                code:'MY0A066',category:'SOGO BALO PRO',  fournisseur:'2BPUB',        colors:'',                     description:'Tee-shirts Sogo Balo Pro',         unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma019',name:'Seaux Sogo Balo Pro',                    code:'MY0A165',category:'SOGO BALO PRO',  fournisseur:'2BPUB',        colors:'',                     description:'Seaux Sogo Balo Pro',              unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
  ],
  bons: [],
  mouvements: [],
  // ── COMMERCIAUX ──────────────────────────────────────────────
  // prenom = premier mot, nom = reste (nom de famille en majuscules)
  commerciaux: [
    /* ── ZONE ABIDJAN ── */
    {id:'a1', prenom:'Landry',        nom:'YAO',                              service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:123, secteurId:'sa1', dispatchZoneId:'abidjan', dispatchBoul:120, dispatchDist:3,   dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'a2', prenom:'YAO Kouadio',   nom:'Tehua Bouatini - Bernard',         service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:171, secteurId:'sa2', dispatchZoneId:'abidjan', dispatchBoul:148, dispatchDist:23,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'a3', prenom:'Privat',        nom:"N'ZUÉ",                            service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:365, secteurId:'sa3', dispatchZoneId:'abidjan', dispatchBoul:283, dispatchDist:82,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'a4', prenom:'Gosse Jean',    nom:'Claude Guillaume',                 service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:144, secteurId:'sa4', dispatchZoneId:'abidjan', dispatchBoul:132, dispatchDist:12,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'a5', prenom:'KANGA',         nom:'Armand',                           service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:232, secteurId:'sa5', dispatchZoneId:'abidjan', dispatchBoul:178, dispatchDist:54,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'a6', prenom:'Jean',          nom:'NGNAMÉ',                           service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:435, secteurId:'sa6', dispatchZoneId:'abidjan', dispatchBoul:185, dispatchDist:250, dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    /* ── ZONE CNE ── */
    {id:'b1', prenom:'Esmel',         nom:'GNAGNE',                           service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:351, secteurId:'sb1', dispatchZoneId:'cne',     dispatchBoul:167, dispatchDist:184, dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'b2', prenom:'Jean-Martial',  nom:'ZORÉ',                             service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:197, secteurId:'sb2', dispatchZoneId:'cne',     dispatchBoul:72,  dispatchDist:125, dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'b3', prenom:'Louis',         nom:'KRAGBE',                           service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:289, secteurId:'sb3', dispatchZoneId:'cne',     dispatchBoul:104, dispatchDist:185, dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'b4', prenom:'Odjinwin',      nom:'SÉKONGO',                          service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:186, secteurId:'sb4', dispatchZoneId:'cne',     dispatchBoul:171, dispatchDist:15,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'b5', prenom:'Tiorna',        nom:'COULIBALY',                        service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:54,  secteurId:'sb5', dispatchZoneId:'cne',     dispatchBoul:45,  dispatchDist:9,   dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    /* ── ZONE CNO ── */
    {id:'c1', prenom:'Ali',           nom:'TRAORÉ',                           service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:234, secteurId:'sc1', dispatchZoneId:'cno',     dispatchBoul:106, dispatchDist:128, dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'c2', prenom:'Brice',         nom:"N'GUESSAN",                        service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:230, secteurId:'sc2', dispatchZoneId:'cno',     dispatchBoul:145, dispatchDist:85,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'c3', prenom:'Marcel',        nom:'AVI',                              service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:198, secteurId:'sc3', dispatchZoneId:'cno',     dispatchBoul:124, dispatchDist:74,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'c4', prenom:'SANOU',         nom:'Martinien',                        service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:140, secteurId:'sc4', dispatchZoneId:'cno',     dispatchBoul:64,  dispatchDist:76,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1},
    {id:'c5', prenom:'Hermann Oria',  nom:'ORIA',                             service:'Commercial terrain', tel:'', email:'', photo:'', nbClients:60,  secteurId:'sc5', dispatchZoneId:'cno',     dispatchBoul:49,  dispatchDist:11,  dispatchCustomRate:null, dispatchRateLocked:false, createdAt:0, _version:1}
  ],
  // ── FOURNISSEURS ─────────────────────────────────────────────
  fournisseurs: [
    {id:'fiv1', nom:'IVA COM',       entreprise:'IVA COM',       contact:'Bleu', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fs2m', nom:'S2ML',          entreprise:'S2ML',          contact:'',     tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'f2bp', nom:'2BPUB',         entreprise:'2BPUB',         contact:'Borro',tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fpda', nom:"POUVOIR D'ART", entreprise:"POUVOIR D'ART", contact:'',     tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'ftaj', nom:'TAJPLAST',      entreprise:'TAJPLAST',      contact:'',     tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fiec', nom:'IECM',          entreprise:'IECM',          contact:'',     tel:'', email:'', adresse:'', actif:true, createdAt:0}
  ],
  commandesFourn: [],
  // ── ZONES ────────────────────────────────────────────────────
  zones: [
    {id:'abidjan', label:'ABIDJAN',                color:'#f5a623'},
    {id:'cne',     label:'CNE (Centre-Nord-Est)',   color:'#4da3ff'},
    {id:'cno',     label:'CNO (Centre-Nord-Ouest)', color:'#3ecf7a'}
  ],
  // ── SECTEURS (= zones terrain des agents du Dispatch) ────────
  secteurs: [
    {id:'sa1', label:'Abidjan Nord 1 A',       color:'#f5a623', zoneId:'abidjan'},
    {id:'sa2', label:'Grand Pont Agnéby-Tiassa',color:'#f5a623', zoneId:'abidjan'},
    {id:'sa3', label:'Abidjan Nord 2 A',        color:'#f5a623', zoneId:'abidjan'},
    {id:'sa4', label:'Abidjan Nord 2B',         color:'#f5a623', zoneId:'abidjan'},
    {id:'sa5', label:'Abidjan Sud',             color:'#f5a623', zoneId:'abidjan'},
    {id:'sa6', label:'Sud-Comoé',               color:'#f5a623', zoneId:'abidjan'},
    {id:'sb1', label:'Centre 1',                color:'#4da3ff', zoneId:'cne'},
    {id:'sb2', label:'Centre 2',                color:'#4da3ff', zoneId:'cne'},
    {id:'sb3', label:'Centre Est',              color:'#4da3ff', zoneId:'cne'},
    {id:'sb4', label:'Nord',                    color:'#4da3ff', zoneId:'cne'},
    {id:'sb5', label:'Est',                     color:'#4da3ff', zoneId:'cne'},
    {id:'sc1', label:'Sud Ouest',               color:'#3ecf7a', zoneId:'cno'},
    {id:'sc2', label:'Centre Ouest',            color:'#3ecf7a', zoneId:'cno'},
    {id:'sc3', label:'Ouest',                   color:'#3ecf7a', zoneId:'cno'},
    {id:'sc4', label:'Grand Ouest 1',           color:'#3ecf7a', zoneId:'cno'},
    {id:'sc5', label:'Grand Ouest 2',           color:'#3ecf7a', zoneId:'cno'}
  ],
  // ── PDV  (1 entrée par boulangerie + 1 par distributeur pour chaque commercial) ──
  pdv: [
    /* ─── ABIDJAN ─── */
    /* a1 – Landry YAO — Abidjan Nord 1 A : 120 boul, 3 dist */
    ...Array.from({length:120},(_,i)=>({id:`p-a1-b${i+1}`,  nom:`Boulangerie ABN1A-${String(i+1).padStart(3,'0')}`,  type:'boulangerie',  secteurId:'sa1',zoneId:'abidjan',commercialId:'a1',adresse:'',contact:'',actif:true})),
    ...Array.from({length:3},  (_,i)=>({id:`p-a1-d${i+1}`,  nom:`Distributeur ABN1A-${String(i+1).padStart(3,'0')}`, type:'distributeur', secteurId:'sa1',zoneId:'abidjan',commercialId:'a1',adresse:'',contact:'',actif:true})),
    /* a2 – YAO Kouadio — Grand Pont : 148 boul, 23 dist */
    ...Array.from({length:148},(_,i)=>({id:`p-a2-b${i+1}`,  nom:`Boulangerie GPT-${String(i+1).padStart(3,'0')}`,     type:'boulangerie',  secteurId:'sa2',zoneId:'abidjan',commercialId:'a2',adresse:'',contact:'',actif:true})),
    ...Array.from({length:23}, (_,i)=>({id:`p-a2-d${i+1}`,  nom:`Distributeur GPT-${String(i+1).padStart(3,'0')}`,    type:'distributeur', secteurId:'sa2',zoneId:'abidjan',commercialId:'a2',adresse:'',contact:'',actif:true})),
    /* a3 – Privat N'ZUÉ — Abidjan Nord 2 A : 283 boul, 82 dist */
    ...Array.from({length:283},(_,i)=>({id:`p-a3-b${i+1}`,  nom:`Boulangerie ABN2A-${String(i+1).padStart(3,'0')}`,  type:'boulangerie',  secteurId:'sa3',zoneId:'abidjan',commercialId:'a3',adresse:'',contact:'',actif:true})),
    ...Array.from({length:82}, (_,i)=>({id:`p-a3-d${i+1}`,  nom:`Distributeur ABN2A-${String(i+1).padStart(3,'0')}`, type:'distributeur', secteurId:'sa3',zoneId:'abidjan',commercialId:'a3',adresse:'',contact:'',actif:true})),
    /* a4 – Gosse Jean Claude — Abidjan Nord 2B : 132 boul, 12 dist */
    ...Array.from({length:132},(_,i)=>({id:`p-a4-b${i+1}`,  nom:`Boulangerie ABN2B-${String(i+1).padStart(3,'0')}`,  type:'boulangerie',  secteurId:'sa4',zoneId:'abidjan',commercialId:'a4',adresse:'',contact:'',actif:true})),
    ...Array.from({length:12}, (_,i)=>({id:`p-a4-d${i+1}`,  nom:`Distributeur ABN2B-${String(i+1).padStart(3,'0')}`, type:'distributeur', secteurId:'sa4',zoneId:'abidjan',commercialId:'a4',adresse:'',contact:'',actif:true})),
    /* a5 – KANGA Armand — Abidjan Sud : 178 boul, 54 dist */
    ...Array.from({length:178},(_,i)=>({id:`p-a5-b${i+1}`,  nom:`Boulangerie ABS-${String(i+1).padStart(3,'0')}`,    type:'boulangerie',  secteurId:'sa5',zoneId:'abidjan',commercialId:'a5',adresse:'',contact:'',actif:true})),
    ...Array.from({length:54}, (_,i)=>({id:`p-a5-d${i+1}`,  nom:`Distributeur ABS-${String(i+1).padStart(3,'0')}`,   type:'distributeur', secteurId:'sa5',zoneId:'abidjan',commercialId:'a5',adresse:'',contact:'',actif:true})),
    /* a6 – Jean NGNAMÉ — Sud-Comoé : 185 boul, 250 dist */
    ...Array.from({length:185},(_,i)=>({id:`p-a6-b${i+1}`,  nom:`Boulangerie SCO-${String(i+1).padStart(3,'0')}`,    type:'boulangerie',  secteurId:'sa6',zoneId:'abidjan',commercialId:'a6',adresse:'',contact:'',actif:true})),
    ...Array.from({length:250},(_,i)=>({id:`p-a6-d${i+1}`,  nom:`Distributeur SCO-${String(i+1).padStart(3,'0')}`,   type:'distributeur', secteurId:'sa6',zoneId:'abidjan',commercialId:'a6',adresse:'',contact:'',actif:true})),
    /* ─── CNE ─── */
    /* b1 – Esmel GNAGNE — Centre 1 : 167 boul, 184 dist */
    ...Array.from({length:167},(_,i)=>({id:`p-b1-b${i+1}`,  nom:`Boulangerie CNT1-${String(i+1).padStart(3,'0')}`,   type:'boulangerie',  secteurId:'sb1',zoneId:'cne',commercialId:'b1',adresse:'',contact:'',actif:true})),
    ...Array.from({length:184},(_,i)=>({id:`p-b1-d${i+1}`,  nom:`Distributeur CNT1-${String(i+1).padStart(3,'0')}`,  type:'distributeur', secteurId:'sb1',zoneId:'cne',commercialId:'b1',adresse:'',contact:'',actif:true})),
    /* b2 – Jean-Martial ZORÉ — Centre 2 : 72 boul, 125 dist */
    ...Array.from({length:72}, (_,i)=>({id:`p-b2-b${i+1}`,  nom:`Boulangerie CNT2-${String(i+1).padStart(3,'0')}`,   type:'boulangerie',  secteurId:'sb2',zoneId:'cne',commercialId:'b2',adresse:'',contact:'',actif:true})),
    ...Array.from({length:125},(_,i)=>({id:`p-b2-d${i+1}`,  nom:`Distributeur CNT2-${String(i+1).padStart(3,'0')}`,  type:'distributeur', secteurId:'sb2',zoneId:'cne',commercialId:'b2',adresse:'',contact:'',actif:true})),
    /* b3 – Louis KRAGBE — Centre Est : 104 boul, 185 dist */
    ...Array.from({length:104},(_,i)=>({id:`p-b3-b${i+1}`,  nom:`Boulangerie CE-${String(i+1).padStart(3,'0')}`,     type:'boulangerie',  secteurId:'sb3',zoneId:'cne',commercialId:'b3',adresse:'',contact:'',actif:true})),
    ...Array.from({length:185},(_,i)=>({id:`p-b3-d${i+1}`,  nom:`Distributeur CE-${String(i+1).padStart(3,'0')}`,    type:'distributeur', secteurId:'sb3',zoneId:'cne',commercialId:'b3',adresse:'',contact:'',actif:true})),
    /* b4 – Odjinwin SÉKONGO — Nord : 171 boul, 15 dist */
    ...Array.from({length:171},(_,i)=>({id:`p-b4-b${i+1}`,  nom:`Boulangerie NORD-${String(i+1).padStart(3,'0')}`,   type:'boulangerie',  secteurId:'sb4',zoneId:'cne',commercialId:'b4',adresse:'',contact:'',actif:true})),
    ...Array.from({length:15}, (_,i)=>({id:`p-b4-d${i+1}`,  nom:`Distributeur NORD-${String(i+1).padStart(3,'0')}`,  type:'distributeur', secteurId:'sb4',zoneId:'cne',commercialId:'b4',adresse:'',contact:'',actif:true})),
    /* b5 – Tiorna COULIBALY — Est : 45 boul, 9 dist */
    ...Array.from({length:45}, (_,i)=>({id:`p-b5-b${i+1}`,  nom:`Boulangerie EST-${String(i+1).padStart(3,'0')}`,    type:'boulangerie',  secteurId:'sb5',zoneId:'cne',commercialId:'b5',adresse:'',contact:'',actif:true})),
    ...Array.from({length:9},  (_,i)=>({id:`p-b5-d${i+1}`,  nom:`Distributeur EST-${String(i+1).padStart(3,'0')}`,   type:'distributeur', secteurId:'sb5',zoneId:'cne',commercialId:'b5',adresse:'',contact:'',actif:true})),
    /* ─── CNO ─── */
    /* c1 – Ali TRAORÉ — Sud Ouest : 106 boul, 128 dist */
    ...Array.from({length:106},(_,i)=>({id:`p-c1-b${i+1}`,  nom:`Boulangerie SO-${String(i+1).padStart(3,'0')}`,     type:'boulangerie',  secteurId:'sc1',zoneId:'cno',commercialId:'c1',adresse:'',contact:'',actif:true})),
    ...Array.from({length:128},(_,i)=>({id:`p-c1-d${i+1}`,  nom:`Distributeur SO-${String(i+1).padStart(3,'0')}`,    type:'distributeur', secteurId:'sc1',zoneId:'cno',commercialId:'c1',adresse:'',contact:'',actif:true})),
    /* c2 – Brice N'GUESSAN — Centre Ouest : 145 boul, 85 dist */
    ...Array.from({length:145},(_,i)=>({id:`p-c2-b${i+1}`,  nom:`Boulangerie CO-${String(i+1).padStart(3,'0')}`,     type:'boulangerie',  secteurId:'sc2',zoneId:'cno',commercialId:'c2',adresse:'',contact:'',actif:true})),
    ...Array.from({length:85}, (_,i)=>({id:`p-c2-d${i+1}`,  nom:`Distributeur CO-${String(i+1).padStart(3,'0')}`,    type:'distributeur', secteurId:'sc2',zoneId:'cno',commercialId:'c2',adresse:'',contact:'',actif:true})),
    /* c3 – Marcel AVI — Ouest : 124 boul, 74 dist */
    ...Array.from({length:124},(_,i)=>({id:`p-c3-b${i+1}`,  nom:`Boulangerie OUEST-${String(i+1).padStart(3,'0')}`,  type:'boulangerie',  secteurId:'sc3',zoneId:'cno',commercialId:'c3',adresse:'',contact:'',actif:true})),
    ...Array.from({length:74}, (_,i)=>({id:`p-c3-d${i+1}`,  nom:`Distributeur OUEST-${String(i+1).padStart(3,'0')}`, type:'distributeur', secteurId:'sc3',zoneId:'cno',commercialId:'c3',adresse:'',contact:'',actif:true})),
    /* c4 – SANOU Martinien — Grand Ouest 1 : 64 boul, 76 dist */
    ...Array.from({length:64}, (_,i)=>({id:`p-c4-b${i+1}`,  nom:`Boulangerie GO1-${String(i+1).padStart(3,'0')}`,    type:'boulangerie',  secteurId:'sc4',zoneId:'cno',commercialId:'c4',adresse:'',contact:'',actif:true})),
    ...Array.from({length:76}, (_,i)=>({id:`p-c4-d${i+1}`,  nom:`Distributeur GO1-${String(i+1).padStart(3,'0')}`,   type:'distributeur', secteurId:'sc4',zoneId:'cno',commercialId:'c4',adresse:'',contact:'',actif:true})),
    /* c5 – Hermann Oria ORIA — Grand Ouest 2 : 49 boul, 11 dist */
    ...Array.from({length:49}, (_,i)=>({id:`p-c5-b${i+1}`,  nom:`Boulangerie GO2-${String(i+1).padStart(3,'0')}`,    type:'boulangerie',  secteurId:'sc5',zoneId:'cno',commercialId:'c5',adresse:'',contact:'',actif:true})),
    ...Array.from({length:11}, (_,i)=>({id:`p-c5-d${i+1}`,  nom:`Distributeur GO2-${String(i+1).padStart(3,'0')}`,   type:'distributeur', secteurId:'sc5',zoneId:'cno',commercialId:'c5',adresse:'',contact:'',actif:true}))
  ],
  audit: [],
  backups: [],
  // ── DISPATCH ─────────────────────────────────────────────────
  dispatch: { besoins:{}, entities:[], weights:{pdv:50,zone:20,history:30}, zonePriority:{}, rules:{respectMin:true,respectMax:true}, history:[] },
  settings: { companyName: 'GMA - Les Grands Moulins d\'Abidjan', theme: 'dark', currency: 'XOF', companyLogo: GMA_DEFAULT_LOGO, backupInterval: 180, companyAddress: 'Zone Portuaire, Quai no. 1. Treichville', companyTel: '+225 27 21 75 11 00', companyFax: '', companyEmail: 'marketing@gma.ci', categories: [] }
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2,6); }
function fmtDate(ts) { return new Date(ts).toLocaleDateString('fr-FR'); }
function fmtDateTime(ts) { return new Date(ts).toLocaleString('fr-FR'); }
function fmtCurrency(v, cur) {
  cur = cur || APP.settings.currency || 'XOF';
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency:cur, minimumFractionDigits:0 }).format(v||0);
}
async function bonNumber() {
  var _yr = new Date().getFullYear();
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser) {
    try {
      // Seed cloud counter from local max to avoid collisions on first cloud sync
      var _localMax = 0;
      (APP.bons||[]).forEach(function(b){
        if(b.numero && b.numero.indexOf('BS-' + _yr + '-') === 0) {
          var n = parseInt(b.numero.split('-').pop()) || 0;
          if (n > _localMax) _localMax = n;
        }
      });
      var _res = await _firebaseDB.ref('counters/bons/' + _yr).transaction(function(n) {
        var cur = n || 0;
        return Math.max(cur, _localMax) + 1;
      });
      return 'BS-' + _yr + '-' + String(_res.snapshot.val()).padStart(4, '0');
    } catch(e) { console.warn('[PSM] bonNumber tx:', e); }
  }
  // Local fallback: use max + 1 (not length + 1) to avoid duplicates after deletions
  var _max = 0;
  (APP.bons||[]).forEach(function(b){
    if(b.numero && b.numero.indexOf('BS-' + _yr + '-') === 0) {
      var n = parseInt(b.numero.split('-').pop()) || 0;
      if (n > _max) _max = n;
    }
  });
  return 'BS-' + _yr + '-' + String(_max + 1).padStart(4, '0');
}
async function cmdOrderNum() {
  var _yr = new Date().getFullYear();
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser) {
    try {
      var _localMax = 0;
      (APP.commandesFourn||[]).forEach(function(c){
        if(c.numero && c.numero.indexOf('CF-' + _yr + '-') === 0) {
          var n = parseInt(c.numero.split('-').pop()) || 0;
          if (n > _localMax) _localMax = n;
        }
      });
      var _res = await _firebaseDB.ref('counters/cmds/' + _yr).transaction(function(n) {
        var cur = n || 0;
        return Math.max(cur, _localMax) + 1;
      });
      return 'CF-' + _yr + '-' + String(_res.snapshot.val()).padStart(3, '0');
    } catch(e) { console.warn('[PSM] cmdOrderNum tx:', e); }
  }
  var _max = 0;
  (APP.commandesFourn||[]).forEach(function(c){
    if(c.numero && c.numero.indexOf('CF-' + _yr + '-') === 0) {
      var n = parseInt(c.numero.split('-').pop()) || 0;
      if (n > _max) _max = n;
    }
  });
  return 'CF-' + _yr + '-' + String(_max + 1).padStart(3, '0');
}
function downloadFile(content, filename, type) {
  const blob = new Blob([content], {type}); const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}
function bumpVersion(obj) {
  if(!obj._versions) obj._versions = [];
  obj._versions.push({ts:Date.now(),data:JSON.stringify(obj)});
  if(obj._versions.length > 10) obj._versions = obj._versions.slice(-10);
  obj._version = (obj._version||1) + 1;
}
function hexToLight(hex) {
  try {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return `rgb(${Math.round(r*0.08+255*0.92)},${Math.round(g*0.08+255*0.92)},${Math.round(b*0.08+255*0.92)})`;
  } catch(e) { return '#FDF0E8'; }
}

// ── Storage: Page Cache + saveDB + loadDB ── (moved to storage.js)

// ============================================================
// AUDIT LOG
// ============================================================
function _truncStr(v, max) {
  if (!v) return '';
  var s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > max ? s.substring(0, max) + '...' : s;
}

function auditLog(type, entity, entityId, oldVal, newVal) {
  var _u = (typeof _currentUser === 'function') ? _currentUser() : null;
  var _cu = (typeof _cloudUser !== 'undefined') ? _cloudUser : null;
  var _entry = {
    id: generateId(), ts: Date.now(), type: type, entity: entity, entityId: entityId,
    oldVal: _truncStr(oldVal, 200), newVal: _truncStr(newVal, 200),
    userEmail: (_u && _u.email) || (_cu && _cu.email) || 'unknown',
    userName:  (_u && (_u.name || _u.display_name)) || (_cu && _cu.displayName) || 'unknown',
    userRole:  (_u && _u.role) || 'unknown'
  };
  if (!APP.audit) APP.audit = [];
  APP.audit.unshift(_entry);
  if (APP.audit.length > 500) APP.audit = APP.audit.slice(0, 500);
  saveDB();
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && _cu) {
    _firebaseDB.ref('audit_log').push(_entry).catch(function(){});
  }
}

// ── Storage: Backup Scheduler + autoBackup + _saveBackupToFile ── (moved to storage.js)

// ============================================================
// NAVIGATION
// ============================================================
const PAGES = [
  { id:'dashboard',       label:'Tableau de bord',   icon:'home',      section:'PRINCIPAL' },
  { id:'articles',        label:'Gadgets & Stock',  icon:'box',       section:null },
  { id:'bons',            label:'Bons de sortie',    icon:'file',      section:null },
  { id:'mouvements',      label:'Mouvements',         icon:'arrow',     section:null },
  { id:'commerciaux',     label:'Commerciaux',        icon:'users',     section:'GESTION' },
  { id:'territoire',      label:'Zones & Secteurs',   icon:'map',       section:null },
  { id:'pdv',             label:'Points de Vente',    icon:'store',     section:null },
  { id:'fournisseurs',    label:'Fournisseurs',       icon:'truck',     section:null },
  { id:'annuaire',        label:'Annuaire',           icon:'users',     section:null },
  { id:'fourn-dashboard', label:'Suivi livraisons',   icon:'clipboard', section:null },
  { id:'gma-catalogue',   label:'Catalogue GMA',      icon:'star',      section:'GMA' },
  { id:'analytics',       label:'Analytique',      icon:'brain',     section:'INTELLIGENCE' },
  { id:'dispatch',        label:'Dispatch Gadgets',   icon:'dispatch',  section:'DISPATCH' },
  { id:'audit',           label:'Audit Trail',        icon:'shield',    section:'OUTILS' },
  { id:'calendar',        label:'Calendrier',         icon:'calendar',  section:null },
  { id:'boneditor',       label:'Éditeur de Bon',     icon:'edit',      section:null },
  { id:'administration', label:'Administration',     icon:'shield',    section:'OUTILS' },
  { id:'settings',        label:'Paramètres',         icon:'settings',  section:null },
];

const ICONS = {
  home: '<i data-lucide="home" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  box: '<i data-lucide="package" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  file: '<i data-lucide="file-text" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  arrow: '<i data-lucide="arrow-left-right" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  users: '<i data-lucide="users" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  truck: '<i data-lucide="truck" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  clipboard: '<i data-lucide="clipboard-list" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  brain: '<i data-lucide="activity" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  shield: '<i data-lucide="shield" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  building: '<i data-lucide="building-2" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  calendar: '<i data-lucide="calendar" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  edit: '<i data-lucide="pencil" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  settings: '<i data-lucide="settings" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  dispatch: '<i data-lucide="share-2" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  map: '<i data-lucide="map" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  store: '<i data-lucide="store" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
  star: '<i data-lucide="star" width="18" height="18" stroke-width="1.75" class="sb-ico"></i>',
};

let currentPage = null;
let _bonStatusFilter = null;
let _bonShowAll = false;

const BON_STATUSES = [
  { key: 'brouillon', label: 'Brouillon', color: 'badge-yellow', icon: '📝' },
  { key: 'validé',   label: 'Validé',    color: 'badge-green',  icon: '✅' },
  { key: 'annulé',   label: 'Annulé',    color: 'badge-red',    icon: '❌' },
];


// ============================================================
// F3 — NOTIFICATIONS NAVIGATEUR
// ============================================================
function _requestNotifPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  Notification.requestPermission().catch(function(){});
}

function _sendBrowserNotif(title, body, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body: body,
      icon: 'favicon.ico',
      tag: tag || ('psm-' + Date.now())
    });
  } catch(e) {}
}

var _notifSentAlerts = new Set();

// ── Storage pruning: remove old historical data ──────────────
// ============================================================
// ARCHIVE SYSTEM — Cold storage with rolling window
// Hot window: APP.settings.archiveRetentionMonths (default 12)
// Archives in Firebase: app_data/archives/{bons|mouvements|audit}/{year}
// ============================================================
if (typeof APP !== 'undefined' && !APP._archivesCache) {
  APP._archivesCache = { bons: {}, mouvements: {}, audit: {} };
}

function _archRetentionMonths() {
  var m = parseInt(APP.settings && APP.settings.archiveRetentionMonths);
  if (!m || m < 1) m = 12;
  return m;
}
function _archCutoffTs() {
  return Date.now() - _archRetentionMonths() * 30 * 86400000;
}
function _archItemTs(item, type) {
  if (!item) return 0;
  if (type === 'bons') return item.createdAt || item.ts || item._validatedAt || 0;
  return item.ts || 0;
}
function _archArrayFromSnap(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(function(x){ return x != null; });
  if (typeof val === 'object') return Object.keys(val).map(function(k){ return val[k]; }).filter(function(x){ return x != null; });
  return [];
}
function _archGroupByYear(items, type) {
  var out = {};
  items.forEach(function(item) {
    var ts = _archItemTs(item, type);
    if (!ts) return;
    var y = new Date(ts).getFullYear();
    (out[y] = out[y] || []).push(item);
  });
  return out;
}

async function archiveDryRun() {
  var cutoff = _archCutoffTs();
  var bonsOld  = (APP.bons        || []).filter(function(b){ return _archItemTs(b,'bons')        < cutoff; });
  var mvtsOld  = (APP.mouvements  || []).filter(function(m){ return _archItemTs(m,'mouvements')  < cutoff; });
  var auditOld = (APP.audit       || []).filter(function(a){ return _archItemTs(a,'audit')       < cutoff; });
  var byYear = {};
  function _add(type, list) {
    var grp = _archGroupByYear(list, type);
    Object.keys(grp).forEach(function(y){
      byYear[y] = byYear[y] || { bons:0, mouvements:0, audit:0 };
      byYear[y][type] = grp[y].length;
    });
  }
  _add('bons', bonsOld); _add('mouvements', mvtsOld); _add('audit', auditOld);
  return {
    cutoff: cutoff,
    cutoffDate: new Date(cutoff).toLocaleDateString('fr-FR'),
    bons: bonsOld.length, mouvements: mvtsOld.length, audit: auditOld.length,
    total: bonsOld.length + mvtsOld.length + auditOld.length,
    byYear: byYear
  };
}

async function archiveSweep() {
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) {
    throw new Error('Firebase indisponible — archivage impossible');
  }
  var cutoff = _archCutoffTs();
  var bonsOld  = (APP.bons        || []).filter(function(b){ return _archItemTs(b,'bons')        < cutoff; });
  var mvtsOld  = (APP.mouvements  || []).filter(function(m){ return _archItemTs(m,'mouvements')  < cutoff; });
  var auditOld = (APP.audit       || []).filter(function(a){ return _archItemTs(a,'audit')       < cutoff; });

  if (bonsOld.length + mvtsOld.length + auditOld.length === 0) {
    APP.settings._lastArchiveRun = Date.now();
    if (typeof saveDB === 'function') saveDB();
    return { moved: 0, bons: 0, mouvements: 0, audit: 0, message: 'Aucun élément à archiver' };
  }

  var groups = {
    bons:       _archGroupByYear(bonsOld,  'bons'),
    mouvements: _archGroupByYear(mvtsOld,  'mouvements'),
    audit:      _archGroupByYear(auditOld, 'audit')
  };

  // COPY phase: merge into archives (dedupe by id)
  async function _mergeYear(type, year, items) {
    var ref = _firebaseDB.ref('app_data/archives/' + type + '/' + year);
    var snap = await ref.once('value');
    var existing = _archArrayFromSnap(snap.val());
    var seen = {};
    existing.forEach(function(e){ if (e && e.id) seen[e.id] = true; });
    var merged = existing.concat(items.filter(function(i){ return i && i.id && !seen[i.id]; }));
    await ref.set(merged);
    // Invalidate cache for that year
    if (APP._archivesCache[type]) delete APP._archivesCache[type][year];
  }

  for (var type in groups) {
    for (var y in groups[type]) {
      await _mergeYear(type, y, groups[type][y]);
    }
  }

  // PRUNE phase: remove from hot data only after successful copy
  APP.bons       = (APP.bons       || []).filter(function(b){ return _archItemTs(b,'bons')       >= cutoff; });
  APP.mouvements = (APP.mouvements || []).filter(function(m){ return _archItemTs(m,'mouvements') >= cutoff; });
  APP.audit      = (APP.audit      || []).filter(function(a){ return _archItemTs(a,'audit')      >= cutoff; });

  APP.settings._lastArchiveRun = Date.now();
  if (typeof saveDB === 'function') saveDB();

  return {
    moved: bonsOld.length + mvtsOld.length + auditOld.length,
    bons: bonsOld.length, mouvements: mvtsOld.length, audit: auditOld.length
  };
}

async function maybeAutoArchive() {
  try {
    var last = (APP.settings && APP.settings._lastArchiveRun) || 0;
    if (Date.now() - last < 30 * 86400000) return;
    if (typeof _firebaseDB === 'undefined' || !_firebaseDB) return;
    var r = await archiveSweep();
    if (r.moved > 0) console.log('[PSM] Archive auto: ' + r.moved + ' éléments déplacés');
  } catch(e) { console.warn('[PSM] Archive auto échec:', e); }
}

async function loadArchiveYears(type) {
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) return [];
  try {
    var snap = await _firebaseDB.ref('app_data/archives/' + type).once('value');
    var val = snap.val() || {};
    return Object.keys(val).sort(function(a,b){ return parseInt(b) - parseInt(a); });
  } catch(e) { return []; }
}

async function loadArchiveYear(type, year) {
  if (!year) return [];
  if (APP._archivesCache[type] && APP._archivesCache[type][year]) return APP._archivesCache[type][year];
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) return [];
  try {
    var snap = await _firebaseDB.ref('app_data/archives/' + type + '/' + year).once('value');
    var items = _archArrayFromSnap(snap.val());
    APP._archivesCache[type] = APP._archivesCache[type] || {};
    APP._archivesCache[type][year] = items;
    return items;
  } catch(e) { return []; }
}

async function deleteArchiveEntry(type, year, id) {
  var _cu = typeof _currentUser==='function' ? _currentUser() : null;
  if (!_cu || _cu.role !== 'admin') {
    if (typeof notify === 'function') notify('Action réservée aux administrateurs', 'error');
    return false;
  }
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) return false;
  var ref = _firebaseDB.ref('app_data/archives/' + type + '/' + year);
  var snap = await ref.once('value');
  var items = _archArrayFromSnap(snap.val()).filter(function(i){ return i.id !== id; });
  await ref.set(items);
  if (APP._archivesCache[type] && APP._archivesCache[type][year]) {
    APP._archivesCache[type][year] = APP._archivesCache[type][year].filter(function(i){ return i.id !== id; });
  }
  if (typeof auditLog === 'function') auditLog('DELETE', 'archive_' + type, id, { year: year }, null);
  return true;
}

function confirmDeleteArchiveEntry(type, year, id, label) {
  var _cu = typeof _currentUser==='function' ? _currentUser() : null;
  if (!_cu || _cu.role !== 'admin') {
    if (typeof notify === 'function') notify('Action réservée aux administrateurs', 'error');
    return;
  }
  var msg = '⚠️ SUPPRESSION PERMANENTE\n\n'
    + 'Vous êtes sur le point de supprimer définitivement cet élément archivé :\n\n'
    + '• Type : ' + type + '\n'
    + '• Année : ' + year + '\n'
    + '• ' + (label || id) + '\n\n'
    + 'Cette action est irréversible. L\'élément ne sera plus consultable.\n\n'
    + 'Continuer ?';
  if (!confirm(msg)) return;
  deleteArchiveEntry(type, year, id).then(function(ok){
    if (ok) {
      if (typeof notify === 'function') notify('Élément archivé supprimé', 'success');
      var sel = document.getElementById('arch-year-select');
      if (sel) openArchivesModal(type, year);
    }
  });
}

// ============================================================
// ARCHIVES UI — Modal for Bons / Mouvements / Audit
// ============================================================
async function openArchivesModal(type, preselectYear) {
  var titles = { bons: 'Archives — Bons', mouvements: 'Archives — Mouvements de stock', audit: 'Archives — Audit Trail' };
  var title = titles[type] || 'Archives';
  openModal('modal-archives-' + type, '📦 ' + title,
    '<div style="text-align:center;padding:40px;color:#888">⏳ Chargement des années disponibles…</div>',
    null, 'modal-xl');
  var years = await loadArchiveYears(type);
  var bodyEl = document.querySelector('#active-modal .modal-body');
  if (!bodyEl) return;
  if (years.length === 0) {
    bodyEl.innerHTML = '<div class="empty-state" style="padding:40px;text-align:center"><p style="font-size:14px;color:var(--text-2)">Aucune archive disponible pour le moment.</p><p style="font-size:12px;color:var(--text-3);margin-top:8px">Les éléments de plus de ' + _archRetentionMonths() + ' mois sont déplacés ici automatiquement.</p></div>';
    return;
  }
  var selected = preselectYear && years.indexOf(String(preselectYear)) >= 0 ? String(preselectYear) : years[0];
  var yearOpts = years.map(function(y){ return '<option value="'+y+'"'+(y===selected?' selected':'')+'>'+y+'</option>'; }).join('');
  var selectorHtml = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 14px;background:var(--bg-2);border-radius:8px;margin-bottom:12px">'
    + '<label style="font-size:12px;font-weight:600;color:var(--text-1)">Année :</label>'
    + '<select id="arch-year-select" onchange="_loadArchiveBody(\''+type+'\', this.value)" style="width:auto;font-weight:600">' + yearOpts + '</select>'
    + '<span style="flex:1"></span>'
    + '<span style="font-size:11px;color:var(--text-3);font-style:italic">Lecture seule · Rétention chaude : ' + _archRetentionMonths() + ' mois</span>'
    + '</div>';
  bodyEl.innerHTML = selectorHtml + '<div id="arch-body-wrap"><div style="text-align:center;padding:30px;color:#888">⏳</div></div>';
  _loadArchiveBody(type, selected);
}

async function _loadArchiveBody(type, year) {
  var wrap = document.getElementById('arch-body-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div style="text-align:center;padding:30px;color:#888">⏳ Chargement de ' + year + '…</div>';
  var items = await loadArchiveYear(type, year);
  if (type === 'bons')          wrap.innerHTML = _renderArchivesBonsBody(year, items);
  else if (type === 'mouvements') wrap.innerHTML = _renderArchivesMvtsBody(year, items);
  else                            wrap.innerHTML = _renderArchivesAuditBody(year, items);
}

function _renderArchivesBonsBody(year, items) {
  if (!items || items.length === 0) return '<div class="empty-state" style="padding:30px;text-align:center"><p>Aucun bon archivé pour ' + year + '</p></div>';
  var statuses = [''].concat(Array.from(new Set(items.map(function(b){ return b.status || ''; }))).sort());
  var statusOpts = statuses.map(function(s){ return '<option value="'+s+'">'+(s||'Tous statuts')+'</option>'; }).join('');
  var filterHtml = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">'
    + '<select id="arch-bons-status" onchange="_filterArchBons(\''+year+'\')" style="width:auto"><option value="">Tous statuts</option>'
    + statuses.filter(function(s){return s;}).map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join('')
    + '</select>'
    + '<input type="text" id="arch-bons-search" placeholder="Numéro, demandeur, objet…" oninput="_filterArchBons(\''+year+'\')" style="flex:1;min-width:180px;padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-1)">'
    + '<span id="arch-bons-count" style="font-size:11px;color:var(--text-2);white-space:nowrap">' + items.length + ' bon(s)</span>'
    + '</div>';
  return filterHtml + '<div id="arch-bons-list" style="max-height:60vh;overflow:auto">' + _buildArchBonsRows(year, items) + '</div>';
}

function _buildArchBonsRows(year, list) {
  if (!list || list.length === 0) return '<div class="empty-state" style="padding:20px;text-align:center;color:var(--text-2)">Aucun résultat</div>';
  var _cu = typeof _currentUser==='function' ? _currentUser() : null;
  var _isAdmin = !!(_cu && _cu.role === 'admin');
  var html = '';
  list.slice().sort(function(a,b){ return (b.createdAt||0) - (a.createdAt||0); }).forEach(function(b) {
    var st = b.status || '—';
    var badgeCls = st==='validé' ? 'badge-green' : (st==='annulé' ? 'badge-red' : (st==='brouillon' ? 'badge-gray' : 'badge-orange'));
    var gadgets = (b.lignes || []).map(function(l){ return l.qty + '× ' + (l.name || l.articleName || ''); }).join(', ');
    html += '<div class="card" style="margin-bottom:6px;padding:10px 14px">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px;flex-wrap:wrap">'
      + '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'
      + '<span style="font-family:monospace;font-weight:700;color:var(--accent)">' + (b.numero || '?') + '</span>'
      + '<span class="badge ' + badgeCls + '">' + st + '</span>'
      + '<span style="font-size:11px;color:var(--text-3)">' + (b.date || (b.createdAt ? new Date(b.createdAt).toLocaleDateString('fr-FR') : '—')) + '</span>'
      + '</div>'
      + '<div style="display:flex;gap:4px">'
      + '<button class="btn btn-sm btn-secondary" onclick="previewArchivedBon(\''+year+'\',\''+b.id+'\')" title="Aperçu"><i class="fa-solid fa-eye"></i></button>'
      + '<button class="btn btn-sm btn-secondary" onclick="printArchivedBon(\''+year+'\',\''+b.id+'\')" title="Imprimer"><i class="fa-solid fa-print"></i></button>'
      + '<button class="btn btn-sm btn-secondary" onclick="exportArchivedBonPDF(\''+year+'\',\''+b.id+'\')" title="PDF"><i class="fa-solid fa-file-pdf"></i></button>'
      + (_isAdmin ? '<button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="confirmDeleteArchiveEntry(\'bons\',\''+year+'\',\''+b.id+'\',\'Bon '+(b.numero||'?')+'\')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>' : '')
      + '</div>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;font-size:11px;color:var(--text-2)">'
      + '<div><b>Demandeur:</b> ' + (b.demandeur || '—') + '</div>'
      + '<div><b>Destinataire:</b> ' + (b.recipiendaire || '—') + '</div>'
      + '<div style="grid-column:1/-1"><b>Objet:</b> ' + (b.objet || '—') + '</div>'
      + '</div>'
      + (gadgets ? '<div style="margin-top:4px;font-size:11px"><b>Gadgets:</b> ' + gadgets + '</div>' : '')
      + '</div>';
  });
  return html;
}

function _filterArchBons(year) {
  var items = (APP._archivesCache.bons && APP._archivesCache.bons[year]) || [];
  var st = (document.getElementById('arch-bons-status')||{}).value || '';
  var needle = _normSearch((document.getElementById('arch-bons-search')||{}).value || '');
  var filtered = items.filter(function(b) {
    if (st && b.status !== st) return false;
    if (needle) {
      var hay = _normSearch([b.numero, b.demandeur, b.recipiendaire, b.objet, b.commanditaire, b.note].filter(Boolean).join(' '));
      if (hay.indexOf(needle) < 0) return false;
    }
    return true;
  });
  var list = document.getElementById('arch-bons-list');
  var cnt  = document.getElementById('arch-bons-count');
  if (list) list.innerHTML = _buildArchBonsRows(year, filtered);
  if (cnt) cnt.textContent = filtered.length + ' bon(s)';
}

function _renderArchivesMvtsBody(year, items) {
  if (!items || items.length === 0) return '<div class="empty-state" style="padding:30px;text-align:center"><p>Aucun mouvement archivé pour ' + year + '</p></div>';
  var filterHtml = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">'
    + '<select id="arch-mvt-type" onchange="_filterArchMvt(\''+year+'\')" style="width:auto">'
    + '<option value="all">Tous types</option><option value="entree">↑ Entrées</option><option value="sortie">↓ Sorties</option>'
    + '</select>'
    + '<input type="text" id="arch-mvt-search" placeholder="Article, code, observation…" oninput="_filterArchMvt(\''+year+'\')" style="flex:1;min-width:180px;padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-1)">'
    + '<span id="arch-mvt-count" style="font-size:11px;color:var(--text-2);white-space:nowrap">' + items.length + ' mvt(s)</span>'
    + '</div>';
  return filterHtml + '<div id="arch-mvt-list" style="max-height:60vh;overflow:auto">' + _buildArchMvtsRows(year, items) + '</div>';
}

function _buildArchMvtsRows(year, list) {
  if (!list || list.length === 0) return '<div class="empty-state" style="padding:20px;text-align:center;color:var(--text-2)">Aucun résultat</div>';
  var _cu = typeof _currentUser==='function' ? _currentUser() : null;
  var _isAdmin = !!(_cu && _cu.role === 'admin');
  var rows = list.slice().sort(function(a,b){ return (b.ts||0)-(a.ts||0); }).map(function(m) {
    var isE = m.type === 'entree';
    return '<tr>'
      + '<td style="font-size:11px;font-family:monospace;white-space:nowrap">' + (typeof fmtDateTime==='function' ? fmtDateTime(m.ts) : new Date(m.ts).toLocaleString('fr-FR')) + '</td>'
      + '<td><span class="badge ' + (isE?'badge-green':'badge-orange') + '">' + (isE?'↑ Entrée':'↓ Sortie') + '</span></td>'
      + '<td style="font-weight:600">' + (m.articleName||'—') + '</td>'
      + '<td style="white-space:nowrap;font-size:13px;font-weight:700;color:' + (isE?'var(--success)':'var(--accent3)') + '">' + (isE?'+':'-') + m.qty + '</td>'
      + '<td style="font-size:11px;color:var(--text-2);max-width:240px">' + (m.obs||m.note||'—') + '</td>'
      + (_isAdmin ? '<td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="confirmDeleteArchiveEntry(\'mouvements\',\''+year+'\',\''+m.id+'\',\'Mvt '+(m.articleName||'?')+'\')" title="Supprimer"><i class="fa-solid fa-trash"></i></button></td>' : '<td></td>')
      + '</tr>';
  }).join('');
  return '<div class="table-wrap"><table><thead><tr><th>Date / Heure</th><th>Type</th><th>Article</th><th>Quantité</th><th>Observation</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function _filterArchMvt(year) {
  var items = (APP._archivesCache.mouvements && APP._archivesCache.mouvements[year]) || [];
  var t = (document.getElementById('arch-mvt-type')||{}).value || 'all';
  var needle = _normSearch((document.getElementById('arch-mvt-search')||{}).value || '');
  var filtered = items.filter(function(m) {
    if (t !== 'all' && m.type !== t) return false;
    if (needle) {
      var hay = _normSearch([m.articleName, m.articleCode, m.obs, m.note, m.userName].filter(Boolean).join(' '));
      if (hay.indexOf(needle) < 0) return false;
    }
    return true;
  });
  var list = document.getElementById('arch-mvt-list');
  var cnt  = document.getElementById('arch-mvt-count');
  if (list) list.innerHTML = _buildArchMvtsRows(year, filtered);
  if (cnt) cnt.textContent = filtered.length + ' mvt(s)';
}

function _renderArchivesAuditBody(year, items) {
  if (!items || items.length === 0) return '<div class="empty-state" style="padding:30px;text-align:center"><p>Aucun événement archivé pour ' + year + '</p></div>';
  var types = Array.from(new Set(items.map(function(a){ return a.type||''; }))).sort();
  var entities = Array.from(new Set(items.map(function(a){ return a.entity||''; }))).sort();
  var filterHtml = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">'
    + '<select id="arch-aud-type" onchange="_filterArchAudit(\''+year+'\')" style="width:auto"><option value="all">Tous types</option>'
    + types.map(function(t){ return '<option value="'+t+'">'+(typeof _auditTypeLabel==='function'?_auditTypeLabel(t):t)+'</option>'; }).join('')
    + '</select>'
    + '<select id="arch-aud-ent" onchange="_filterArchAudit(\''+year+'\')" style="width:auto"><option value="all">Toutes entités</option>'
    + entities.map(function(e){ return '<option value="'+e+'">'+e+'</option>'; }).join('')
    + '</select>'
    + '<input type="text" id="arch-aud-search" placeholder="Rechercher…" oninput="_filterArchAudit(\''+year+'\')" style="flex:1;min-width:160px;padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-1)">'
    + '<span id="arch-aud-count" style="font-size:11px;color:var(--text-2);white-space:nowrap">' + items.length + ' event(s)</span>'
    + '</div>';
  return filterHtml + '<div id="arch-aud-list" style="max-height:60vh;overflow:auto">' + _buildArchAuditRows(year, items) + '</div>';
}

function _buildArchAuditRows(year, list) {
  if (!list || list.length === 0) return '<div class="empty-state" style="padding:20px;text-align:center;color:var(--text-2)">Aucun résultat</div>';
  var _cu = typeof _currentUser==='function' ? _currentUser() : null;
  var _isAdmin = !!(_cu && _cu.role === 'admin');
  var rows = list.slice().sort(function(a,b){ return (b.ts||0)-(a.ts||0); }).map(function(a) {
    return '<tr>'
      + '<td style="font-size:11px;font-family:monospace;white-space:nowrap">' + (typeof fmtDateTime==='function' ? fmtDateTime(a.ts) : new Date(a.ts).toLocaleString('fr-FR')) + '</td>'
      + '<td>' + (typeof _auditTypeLabel==='function' ? _auditTypeLabel(a.type) : (a.type||'—')) + '</td>'
      + '<td style="font-weight:600">' + (a.entity||'—') + '</td>'
      + '<td style="font-size:11px;color:var(--text-2)">' + (a.entityId||'—') + '</td>'
      + '<td style="font-size:11px;color:var(--text-2)">' + (a.userName||a.userLogin||'—') + '</td>'
      + (_isAdmin ? '<td><button class="btn btn-sm" style="background:var(--danger);color:#fff" onclick="confirmDeleteArchiveEntry(\'audit\',\''+year+'\',\''+a.id+'\',\''+(a.type||'?')+' '+(a.entity||'')+'\')" title="Supprimer"><i class="fa-solid fa-trash"></i></button></td>' : '<td></td>')
      + '</tr>';
  }).join('');
  return '<div class="table-wrap"><table><thead><tr><th>Date / Heure</th><th>Type</th><th>Entité</th><th>ID</th><th>Utilisateur</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function _filterArchAudit(year) {
  var items = (APP._archivesCache.audit && APP._archivesCache.audit[year]) || [];
  var t = (document.getElementById('arch-aud-type')||{}).value || 'all';
  var e = (document.getElementById('arch-aud-ent')||{}).value || 'all';
  var needle = _normSearch((document.getElementById('arch-aud-search')||{}).value || '');
  var filtered = items.filter(function(a) {
    if (t !== 'all' && a.type !== t) return false;
    if (e !== 'all' && a.entity !== e) return false;
    if (needle) {
      var hay = _normSearch([a.type, a.entity, a.entityId, a.userName, a.userLogin, a.details].filter(Boolean).join(' '));
      if (hay.indexOf(needle) < 0) return false;
    }
    return true;
  });
  var list = document.getElementById('arch-aud-list');
  var cnt  = document.getElementById('arch-aud-count');
  if (list) list.innerHTML = _buildArchAuditRows(year, filtered);
  if (cnt) cnt.textContent = filtered.length + ' event(s)';
}

// ============================================================
// Preview / Print / PDF for ARCHIVED bons
// ============================================================
async function previewArchivedBon(year, bonId) {
  var items = await loadArchiveYear('bons', year);
  var bon = items.find(function(b){ return b.id === bonId; });
  if (!bon) { if (typeof notify==='function') notify('Bon archivé introuvable','error'); return; }
  openModal('modal-arch-bon-preview', 'Aperçu — ' + (bon.numero||'?') + ' (archive ' + year + ')',
    '<div style="text-align:center;padding:40px;color:#888">⏳ Chargement…</div>', null, 'modal-xl');
  if (typeof _loadSignaturesCache === 'function') { try { await _loadSignaturesCache(); } catch(e) {} }
  var bodyEl = document.querySelector('#active-modal .modal-body');
  if (!bodyEl) return;
  var sizes = ['A4','A5','Letter','Legal'];
  var opts = sizes.map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join('');
  bodyEl.innerHTML = '<div style="max-height:70vh;overflow:auto">'
    + '<div style="display:flex;gap:8px;align-items:center;padding:10px 14px;background:var(--bg-2);border-radius:8px;margin-bottom:10px;flex-wrap:wrap">'
    + '<label style="font-size:12px;font-weight:600">Format :</label>'
    + '<select id="arch-preview-paper" onchange="_refreshArchPreview(\''+year+'\',\''+bonId+'\')" style="width:auto">' + opts + '</select>'
    + '<div style="flex:1"></div>'
    + '<button class="btn btn-sm btn-secondary" onclick="printArchivedBon(\''+year+'\',\''+bonId+'\',document.getElementById(\'arch-preview-paper\').value)">Imprimer</button>'
    + '<button class="btn btn-sm btn-secondary" onclick="exportArchivedBonPDF(\''+year+'\',\''+bonId+'\',document.getElementById(\'arch-preview-paper\').value)">PDF</button>'
    + '</div>'
    + '<div id="arch-preview-content">' + generateBonHTML(bon, { paperSize: 'A4', minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined }) + '</div>'
    + '</div>';
}

function _refreshArchPreview(year, bonId) {
  var items = (APP._archivesCache.bons && APP._archivesCache.bons[year]) || [];
  var bon = items.find(function(b){ return b.id === bonId; });
  if (!bon) return;
  var paper = (document.getElementById('arch-preview-paper')||{}).value || 'A4';
  var el = document.getElementById('arch-preview-content');
  if (el) el.innerHTML = generateBonHTML(bon, { paperSize: paper, minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined });
}

async function printArchivedBon(year, bonId, paperSize) {
  paperSize = (paperSize || 'A4').toUpperCase();
  var items = await loadArchiveYear('bons', year);
  var bon = items.find(function(b){ return b.id === bonId; });
  if (!bon) { if (typeof notify==='function') notify('Bon archivé introuvable','error'); return; }
  var win = window.open('', '_blank', 'width=900,height=750');
  if (!win) { if (typeof notify==='function') notify('Popup bloquée','warning'); return; }
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="padding:40px;text-align:center;font-family:Arial,sans-serif;color:#666"><div>⏳ Chargement…</div></body></html>');
  if (typeof _loadSignaturesCache === 'function') { try { await _loadSignaturesCache(); } catch(e) {} }
  if (win.closed) return;
  win.document.open();
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bon ' + (bon.numero||'?') + ' (archive)</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#f0f0f0;padding:20px;font-family:Arial,sans-serif}'
    + '@media print{body{background:white;padding:0}@page{margin:10mm;size:' + paperSize.toLowerCase() + '}}</style></head><body>'
    + generateBonHTML(bon, { paperSize: paperSize, minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined })
    + '<script>window.onload=function(){setTimeout(function(){window.print();},300);};<' + '/script></body></html>');
  win.document.close();
  if (typeof auditLog === 'function') auditLog('PRINT','archive_bon',bon.id,null,{numero:bon.numero,year:year});
}

async function exportArchivedBonPDF(year, bonId, paperSize) {
  paperSize = (paperSize || 'A4').toUpperCase();
  var items = await loadArchiveYear('bons', year);
  var bon = items.find(function(b){ return b.id === bonId; });
  if (!bon) { if (typeof notify==='function') notify('Bon archivé introuvable','error'); return; }
  if (typeof auditLog === 'function') auditLog('DOWNLOAD','archive_bon',bon.numero,null,{format:'PDF',year:year});
  var win = window.open('', '_blank');
  if (!win) { if (typeof notify==='function') notify('Popup bloquée','warning'); return; }
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="padding:40px;text-align:center;font-family:Arial,sans-serif;color:#666"><div>⏳ Chargement…</div></body></html>');
  if (typeof _loadSignaturesCache === 'function') { try { await _loadSignaturesCache(); } catch(e) {} }
  if (win.closed) return;
  win.document.open();
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF — ' + (bon.numero||'?') + ' (archive)</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:20px;font-family:Arial,sans-serif}'
    + '@media print{body{padding:0}@page{margin:10mm;size:' + paperSize.toLowerCase() + '}}'
    + '.no-print{margin:16px auto;text-align:center}@media print{.no-print{display:none}}</style></head><body>'
    + '<div class="no-print"><p style="margin-bottom:8px;color:#666;font-size:14px">💡 Sélectionnez <strong>"Enregistrer au format PDF"</strong> comme imprimante</p>'
    + '<button onclick="window.print()" style="padding:10px 24px;background:#f5a623;color:#000;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">📥 Télécharger en PDF</button></div>'
    + generateBonHTML(bon, { paperSize: paperSize, minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined })
    + '</body></html>');
  win.document.close();
}

// ============================================================
// Settings actions for archive panel
// ============================================================
async function runArchiveDryRun() {
  var btn = document.getElementById('btn-arch-dryrun');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Analyse…'; }
  try {
    var r = await archiveDryRun();
    var html = '<div style="margin-top:10px;padding:10px 14px;background:var(--bg-2);border-radius:8px;font-size:12px;line-height:1.6">'
      + '<div style="font-weight:700;margin-bottom:6px">🔍 Résultat du dry-run (aucune modification)</div>'
      + '<div>Seuil : éléments antérieurs au <b>' + r.cutoffDate + '</b></div>'
      + '<div style="margin-top:6px"><b>Total :</b> ' + r.total + ' élément(s) — '
      + r.bons + ' bons · ' + r.mouvements + ' mouvements · ' + r.audit + ' audits</div>';
    var yrs = Object.keys(r.byYear).sort();
    if (yrs.length) {
      html += '<div style="margin-top:6px"><b>Par année :</b></div><ul style="margin:4px 0 0 18px">';
      yrs.forEach(function(y){
        var b = r.byYear[y];
        html += '<li>' + y + ' : ' + (b.bons||0) + ' bons · ' + (b.mouvements||0) + ' mvts · ' + (b.audit||0) + ' audits</li>';
      });
      html += '</ul>';
    }
    html += '</div>';
    var out = document.getElementById('arch-dryrun-output');
    if (out) out.innerHTML = html;
  } catch(e) {
    if (typeof notify==='function') notify('Dry-run échoué : ' + e.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🔍 Simuler (dry-run)'; }
  }
}

async function runArchiveSweep() {
  var msg = '⚠️ ARCHIVAGE IMMÉDIAT\n\n'
    + 'Les éléments de plus de ' + _archRetentionMonths() + ' mois seront déplacés vers les archives.\n\n'
    + 'Les archives restent consultables via le bouton "📦 Archives" dans chaque module.\n\n'
    + 'Continuer ?';
  if (!confirm(msg)) return;
  var btn = document.getElementById('btn-arch-sweep');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Archivage…'; }
  try {
    var r = await archiveSweep();
    if (typeof notify==='function') {
      if (r.moved === 0) notify(r.message || 'Rien à archiver', 'info');
      else notify('✅ ' + r.moved + ' éléments archivés (' + r.bons + ' bons · ' + r.mouvements + ' mvts · ' + r.audit + ' audits)', 'success');
    }
    if (typeof renderSettings === 'function') renderSettings();
  } catch(e) {
    if (typeof notify==='function') notify('Archivage échoué : ' + e.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '📦 Archiver maintenant'; }
  }
}

function saveArchiveRetention() {
  var v = parseInt((document.getElementById('set-arch-retention')||{}).value);
  if (!v || v < 1 || v > 120) {
    if (typeof notify==='function') notify('Durée invalide (1 à 120 mois)','error');
    return;
  }
  APP.settings.archiveRetentionMonths = v;
  if (typeof saveDB === 'function') saveDB();
  if (typeof notify==='function') notify('Rétention mise à jour : ' + v + ' mois','success');
}

function _pruneHistoricalData() {
  // Replaced by archive system (archives/{type}/{year} in Firebase).
  // Fire-and-forget auto-archive if last run > 30 days ago.
  if (typeof maybeAutoArchive === 'function') maybeAutoArchive();
}

// Cursor-tracking shine on liquid-glass cards (event delegation, 1 listener)
(function _initCardHoverShine(){
  if (window._cardShineBound) return; window._cardShineBound=true;
  var _sel='.card,.fourn-card,.order-card,.gma-art-card';
  document.addEventListener('mousemove', function(e){
    var el=e.target && e.target.closest ? e.target.closest(_sel) : null;
    if(!el) return;
    var r=el.getBoundingClientRect();
    el.style.setProperty('--mx',(e.clientX-r.left)+'px');
    el.style.setProperty('--my',(e.clientY-r.top)+'px');
  }, {passive:true});
})();

async function initApp() {
  try {
    if (typeof _splashSetProgress === 'function') _splashSetProgress(20, 'V\u00e9rification du serveur\u2026');

    // 1. Load localStorage data first (instant backup)
    try {
      var lsData = localStorage.getItem('psm_pro_db');
      if (lsData) {
        var parsed = JSON.parse(lsData);
        if (parsed && typeof parsed === 'object') {
          Object.assign(APP, parsed);
          console.log('[PSM] localStorage loaded (_ts=' + (APP._ts||0) + ')');
        }
      }
    } catch(e) { console.warn('[PSM] localStorage load:', e); }

    // === ONE-TIME DATA RESET (2026-04-06) ===
    if (!APP._resetDone_20260406) {
      console.log('[PSM] One-time data reset: clearing mouvements, audit, activityLog, dispatch history');
      APP.mouvements = [];
      APP.audit = [];
      APP._activityLog = [];
      if (APP.dispatch) { APP.dispatch.history = []; }
      APP.dispatchHistory = [];
      APP._resetDone_20260406 = true;
      try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
      console.log('[PSM] Data reset complete');
    }

    // === ONE-TIME: strip signatureKey from all annuaire entries (2026-04-09) ===
    if (!APP._annuaireSigStrip_20260409) {
      (APP.annuaire || []).forEach(function(p) { delete p.signatureKey; delete p.signature; });
      APP._annuaireSigStrip_20260409 = true;
      try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
      console.log('[PSM] Annuaire signatures stripped');
    }

    // === ONE-TIME: backfill validator snapshot on old validated bons (2026-04-20) ===
    if (!APP._bonValidatorBackfill_20260420) {
      try {
        if (typeof _backfillBonValidators === 'function') {
          var _bfRes = _backfillBonValidators();
          console.log('[PSM] Bon validator backfill:', _bfRes);
        }
      } catch(e) { console.warn('[PSM] backfill failed:', e); }
      APP._bonValidatorBackfill_20260420 = true;
      try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
    }

    // 2. Sign out any previous session — force fresh login every time
    if (typeof _firebaseAuth !== 'undefined' && _firebaseAuth) {
      try { await _firebaseAuth.signOut(); } catch(e) {}
    }
    sessionStorage.removeItem('psm_user');

    if (typeof _splashSetProgress === 'function') _splashSetProgress(60, 'Serveur pr\u00eat');

    if (typeof _splashSetProgress === 'function') _splashSetProgress(90, 'Pr\u00e9paration\u2026');

    // 3. Render init + show login
    await _finishAppInit();
  } catch(e) {
    console.error('[PSM] initApp failed:', e);
    try { loadDB(); renderSidebar(); showPage('dashboard'); } catch(e2) { console.error('[PSM] fallback failed:', e2); }
  }
}

function _deduplicateUsers() {
  if (!APP.users) return;
  var seen = {};
  APP.users = APP.users.filter(function(u) {
    if (!u.email) return true;
    var key = u.email.toLowerCase();
    if (seen[key]) {
      // Keep the one with more data (photo, signature, etc.)
      var prev = seen[key];
      if (u.photo && !prev.photo) prev.photo = u.photo;
      if (u.signature && !prev.signature) prev.signature = u.signature;
      if (u.name && u.name !== u.email.split('@')[0] && prev.name === prev.email.split('@')[0]) prev.name = u.name;
      return false;
    }
    seen[key] = u;
    return true;
  });
}

async function _finishAppInit() {
  _requestNotifPermission();
  _deduplicateUsers();
  try {
  if(!APP.commandesFourn) APP.commandesFourn = [];
  if(!APP.backups) APP.backups = [];
  if(!APP.zones) APP.zones = [];
  if(!APP.secteurs) APP.secteurs = [];
  if(!APP.pdv) APP.pdv = [];
  if(!APP.dispatch) APP.dispatch = {};
  if(!APP.dispatch.besoins) APP.dispatch.besoins = {};
  if(!APP.dispatch.entities) APP.dispatch.entities = [];
  if(!APP.dispatch.weights) APP.dispatch.weights = {pdv:50,zone:20,history:30};
  if(!APP.dispatch.history) APP.dispatch.history = [];
  if(!APP.dispatch.rules) APP.dispatch.rules = {respectMin:true,respectMax:true};
  if(!APP.settings.categories) APP.settings.categories = [];
  if(!APP.users) APP.users = [];
  if(!APP.commerciaux) APP.commerciaux = [];
  if(!APP.articles) APP.articles = [];
  if(!APP.bons) APP.bons = [];
  if(!APP.fournisseurs) APP.fournisseurs = [];
  if(!APP.annuaire) APP.annuaire = [];
  // DCM migration: ensure DCM entry exists in annuaire + backfill bons demandeur/recipiendaire === 'DCM'
  (function _dcmInit(){
    function _findDCM() {
      return (APP.annuaire||[]).find(function(p){
        var full = ((p.prenom||'') + ' ' + (p.nom||'')).trim().toUpperCase();
        return full === 'DCM';
      });
    }
    var _dcm = _findDCM();
    if (!_dcm) {
      _dcm = {
        id: 'an_dcm_' + Date.now(),
        createdAt: Date.now(),
        _version: 1,
        prenom: '',
        nom: 'DCM',
        poste: 'D\u00e9partement Commercial Marketing',
        departement: '',
        telephone: '',
        email: '',
        matricule: '',
        tag: 'DEMANDEUR'
      };
      APP.annuaire.push(_dcm);
      console.log('[PSM] DCM cree dans l\'annuaire');
    }
    window._DCM_ID = _dcm.id;
    if (!APP._dcmMigration_20260420) {
      var _count = 0;
      (APP.bons||[]).forEach(function(b){
        var _d = String(b.demandeur||'').trim().toUpperCase();
        if (_d === 'DCM') {
          b.demandeur = 'DCM';
          b._demandeurType = 'list';
          b._demandeurAnnuaireId = _dcm.id;
          _count++;
        }
        var _r = String(b.recipiendaire||'').trim().toUpperCase();
        if (_r === 'DCM') {
          b.recipiendaire = 'DCM';
          b._recipType = 'list';
          b._recipiendaireAnnuaireId = _dcm.id;
          _count++;
        }
      });
      APP._dcmMigration_20260420 = Date.now();
      if (_count > 0) console.log('[PSM] Migration DCM: ' + _count + ' bon(s) lies a l\'annuaire');
    }
  })();
  // Phase 9: backfill _isDispatch flag on existing bons (one-time)
  if (!APP._dispatchSigMigratedAt) {
    var _dpBonIds = {};
    ((APP.dispatch && APP.dispatch.history) || []).forEach(function(snap) {
      if (snap && Array.isArray(snap.bonIds)) {
        snap.bonIds.forEach(function(bid) { _dpBonIds[bid] = true; });
      }
    });
    var _dpFlagged = 0;
    (APP.bons || []).forEach(function(b) {
      if (_dpBonIds[b.id] && !b._isDispatch) { b._isDispatch = true; _dpFlagged++; }
    });
    APP._dispatchSigMigratedAt = Date.now();
    if (_dpFlagged > 0) console.log('[PSM] Phase 9: ' + _dpFlagged + ' bon(s) dispatch flagg\u00e9(s) r\u00e9troactivement');
  }
  // Phase 10: migrate APP.users[].signature (base64) -> RTDB key (one-time, async, non-blocking)
  if (!APP._sigMigrationDone) {
    (async function() {
      try {
        if (typeof _uploadSignature !== 'function' || typeof _firebaseDB === 'undefined' || !_firebaseDB) return;
        var users = APP.users || [];
        var migrated = 0;
        for (var i = 0; i < users.length; i++) {
          var uu = users[i];
          if (uu && uu.signature && !uu.signatureKey && String(uu.signature).indexOf('data:') === 0) {
            try {
              var key = await _uploadSignature(uu.signature, 'sig');
              uu.signatureKey = key;
              delete uu.signature;
              uu._version = (uu._version || 1) + 1;
              migrated++;
            } catch(e) {
              console.warn('[PSM] Phase 10 sig upload failed for ' + (uu.email || uu.id), e);
              return; // abort -- do NOT mark migration done so we retry next session
            }
          }
        }
        APP._sigMigrationDone = Date.now();
        if (migrated > 0) {
          console.log('[PSM] Phase 10: ' + migrated + ' user signature(s) migr\u00e9e(s) vers RTDB');
          if (typeof saveDB === 'function') saveDB();
        } else if (typeof saveDB === 'function') {
          saveDB(); // mark migration done even if no users had sigs
        }
      } catch(err) { console.warn('[PSM] Phase 10 migration error:', err); }
    })();
  }
  initGMAData();
  _pruneHistoricalData();
  (APP.commerciaux||[]).forEach(c => dInitCommercialDispatchFields(c));
  (APP.articles||[]).forEach(a => { if(a.dispatchAllocMax === undefined) a.dispatchAllocMax = a.stock > 0 ? a.stock : 0; });
  if(!APP.dispatchHistory) APP.dispatchHistory = [];
  if(!APP.recentlyViewed) APP.recentlyViewed = [];
  // Migration: déplacer le logo GMA de localStorage vers APP.settings
  try {
    const legacyLogo = localStorage.getItem('gma_logo_b64');
    if(legacyLogo && !APP.settings.gmaLogo) { APP.settings.gmaLogo = legacyLogo; localStorage.removeItem('gma_logo_b64'); }
  } catch(e) {}
  // Migration: si companyLogo correspond a l'ancien logo GMA par defaut, basculer vers le nouveau
  try {
    const _oldDefaultSig = 'iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAEAAElEQVR42uydd5gdxbH2';
    const _cur = APP.settings && APP.settings.companyLogo;
    if(_cur && typeof _cur === 'string' && _cur.indexOf(_oldDefaultSig) >= 0) {
      APP.settings.companyLogo = GMA_DEFAULT_LOGO;
      _imagesDirty = true;
    }
  } catch(e) {}
  // Always require login — check BEFORE rendering UI
  if(!sessionStorage.getItem('psm_user')) {
    applyTheme(APP.settings.theme || 'dark');
    if (typeof _splashHide === 'function') _splashHide();
    showLoginScreen();
    return;
  }
  updateFileSaveIndicator(!!_dirHandle);
  // Phase 1: load signatures cache from RTDB (fire-and-forget)
  if (typeof _loadSignaturesCache === 'function') _loadSignaturesCache();
  renderSidebar();
  if(_pendingHandle && !_autoReconnectBound) _showReconnectBar();
  else if(!_dirHandle && !_pendingHandle) _showStorageBanner();
  updateCompanyPanel();
  startClock();
  showPage(APP.settings?.lastPage || 'dashboard');
  updateAlertBadge();
  initStockNotifications();
  applyTheme(APP.settings.theme || 'dark');
  setTimeout(updateThemeBtn, 50);
  updateUserBadge();
  startBackupScheduler();
  // Hide splash — app is fully ready
  if (typeof _splashHide === 'function') _splashHide();
  } catch(err) {
    console.error('[PSM] _finishAppInit error:', err);
    // Always hide splash even on error
    if (typeof _splashHide === 'function') _splashHide();
    if (!sessionStorage.getItem('psm_user') && typeof showLoginScreen === 'function') showLoginScreen();
  }
}

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  var collapsed = sb.classList.toggle('sb-collapsed');
  APP.settings._sidebarCollapsed = collapsed;
  clearTimeout(toggleSidebar._t);
  toggleSidebar._t = setTimeout(function(){ try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e){} }, 500);
}

function renderSidebar() {
  var sb = document.getElementById('sidebar');
  if(APP.settings._sidebarCollapsed) sb.classList.add('sb-collapsed');
  var nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  // Collapse toggle button
  var togBtn = document.createElement('div');
  togBtn.className = 'sb-collapse-btn';
  togBtn.title = 'R\u00e9duire / Agrandir';
  togBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>';
  togBtn.onclick = toggleSidebar;
  nav.appendChild(togBtn);
  // Pinned/Favorites section
  var pins = APP.settings._pinnedPages || [];
  if(pins.length > 0) {
    var pinSec = document.createElement('div'); pinSec.className = 'sb-section'; pinSec.textContent = '\u2b50 FAVORIS';
    nav.appendChild(pinSec);
    pins.forEach(function(pid) {
      var p = PAGES.find(function(pg){ return pg.id === pid; });
      if(!p || !canView(p.id)) return;
      var _hpg = APP.settings._hiddenPages || []; if(_hpg.indexOf(p.id) >= 0) return;
      var item = document.createElement('div');
      item.className = 'sb-item sb-pinned' + (p.id === currentPage ? ' active' : '');
      item.dataset.page = p.id;
      var lbl = I18N[_lang()][p.id] || p.label;
      item.innerHTML = (ICONS[p.icon]||'') + '<span>' + lbl + '</span>';
      item.onclick = function(){ showPage(p.id); };
      item.oncontextmenu = function(ev) {
        ev.preventDefault();
        var pns = APP.settings._pinnedPages || [];
        var ix = pns.indexOf(p.id);
        if(ix >= 0) { pns.splice(ix, 1); notify(lbl + ' retir\u00e9 des favoris', 'info'); }
        else { pns.push(p.id); notify(lbl + ' ajout\u00e9 aux favoris', 'success'); }
        APP.settings._pinnedPages = pns;
        saveDB();
        renderSidebar();
      };
      nav.appendChild(item);
    });
  }
  var lastSection = null;
  PAGES.filter(function(p){ var hp = APP.settings._hiddenPages || []; if(hp.indexOf(p.id) >= 0 && p.id !== 'dashboard' && p.id !== 'settings') return false; return canView(p.id); }).forEach(p => {
    if(p.section && p.section !== lastSection) {
      const sec = document.createElement('div'); sec.className = 'sb-section'; sec.textContent = p.section;
      nav.appendChild(sec); lastSection = p.section;
    }
    const item = document.createElement('div');
    item.className = 'sb-item' + (p.id === currentPage ? ' active' : '');
    item.dataset.page = p.id;
    if(p.id==='administration' && (!_currentUser() || _currentUser().role!=='admin')) { return; }
    const lbl = I18N[_lang()][p.id] || p.label;
    item.innerHTML = `${ICONS[p.icon]||''}<span>${lbl}</span>`;
    // Badges
    if(p.id === 'articles') {
      const alerts = APP.articles.filter(a => a.stock <= a.stockMin).length;
      if(alerts > 0) item.innerHTML += `<span class="sb-badge" id="badge-articles">${alerts}</span>`;
    }
    if(p.id === 'fourn-dashboard') {
      const pending = (APP.commandesFourn||[]).filter(c=>c.status==='pending'||c.status==='partial').length;
      if(pending > 0) item.innerHTML += `<span class="sb-badge" id="badge-commandes" style="background:var(--warning)">${pending}</span>`;
    }
    item.onclick = function(){ showPage(p.id); };
    item.oncontextmenu = function(ev) {
      ev.preventDefault();
      var pns = APP.settings._pinnedPages || [];
      var ix = pns.indexOf(p.id);
      if(ix >= 0) { pns.splice(ix, 1); notify(lbl + ' retir\u00e9 des favoris', 'info'); }
      else { pns.push(p.id); notify(lbl + ' ajout\u00e9 aux favoris', 'success'); }
      APP.settings._pinnedPages = pns;
      saveDB();
      renderSidebar();
    };
    nav.appendChild(item);
  });
}

function updateCompanyPanel() {
  const name = APP.settings.companyName || 'GMA — Les Grands Moulins d\'Abidjan';
  const logo = _safeCompanyLogo();
  const nameEl = document.getElementById('sb-company-name');
  if(nameEl) nameEl.textContent = name;
  const icon = document.getElementById('sb-company-icon');
  if(logo) {
    // Affiche le logo dans la sidebar, masque le texte du nom
    icon.innerHTML = `<img src="${logo}" style="width:100%;height:100%;object-fit:contain">`;
    if(nameEl) nameEl.style.display = 'none';
  } else {
    icon.textContent = '🏢';
    if(nameEl) nameEl.style.display = '';
  }
}

function showPage(id) {
  if(!hasPermission(id, 'view')) {
    notify('\u26d4 Acc\u00e8s refus\u00e9 \u2014 vous n\u2019avez pas la permission de voir ce module', 'warning');
    return;
  }
  currentPage = id;
  if(APP.settings) { APP.settings.lastPage = id; try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {} }
  document.querySelectorAll('.sb-item').forEach(i => i.classList.toggle('active', i.dataset.page === id));
  document.querySelectorAll('.mbn-item').forEach(i => i.classList.toggle('active', i.dataset.page === id));
  const titles = {
    dashboard:'Tableau de bord', articles:'Gadgets & Stocks', bons:'Bons de sortie',
    mouvements:'Mouvements de stock', commerciaux:'Commerciaux', territoire:'\ud83d\uddfa Zones & Secteurs',
    pdv:'\ud83c\udfea Points de Vente', fournisseurs:'Fournisseurs', annuaire:'\ud83d\udcd2 Annuaire',
    'fourn-dashboard':'Suivi des livraisons', 'gma-catalogue':'\u2b50 Catalogue GMA',
    analytics:'\ud83e\udde0 Analytique', dispatch:'\u2699\ufe0f Dispatch Gadgets',
    audit:'Audit Trail', calendar:'Calendrier des Mouvements', boneditor:'\ud83c\udfa8 \u00c9diteur de Bon', administration:'\ud83d\udee1\ufe0f Administration', settings:'Param\u00e8tres'
  };
  const titleEl = document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent = titles[id] || id;
  const renders = {
    dashboard:renderDashboard, articles:renderArticles, bons:renderBons, mouvements:renderMouvements,
    commerciaux:renderCommerciaux, territoire:renderTerritoire, pdv:renderPDV,
    fournisseurs:renderFournisseurs, annuaire:renderAnnuaire, 'fourn-dashboard':renderFournDashboard,
    'gma-catalogue':renderGMACatalogue,
    analytics:renderAnalytics, dispatch:renderDispatchPage, audit:renderAudit, boneditor:renderBonEditor, settings:renderSettings,
    calendar:renderCalendar,
    administration:function(){ document.getElementById('content').innerHTML = renderAdminPage(); _watchPresence(); }
  };
  document.getElementById('content').innerHTML = '';
  if(renders[id]) renders[id]();
  if(id==='settings' && typeof _loadCloudSnapshotsUI==='function') setTimeout(_loadCloudSnapshotsUI, 100);
  if(id==='administration' && typeof _initAdminPage==='function') _initAdminPage();
}

function startClock() {
  const el = document.getElementById('clock');
  const tick = () => { if(el) el.textContent = new Date().toLocaleTimeString('fr-FR'); };
  tick(); setInterval(tick, 1000);
}

// ─── Theme metadata ───────────────────────────────────────────────────────────
const THEME_META = {
  dark:      { name:'Dark',        desc:'Sombre classique',     bg:'#111318', c1:'#3d7fff', c2:'#00e5aa', c3:'#0a0c10' },
  light:     { name:'Light',       desc:'Clair & épuré',        bg:'#ffffff', c1:'#3d7fff', c2:'#00e5aa', c3:'#e8eaf2' },
  purple:    { name:'Nebula',      desc:'Violet cosmique',      bg:'#150e20', c1:'#9d4edd', c2:'#c77dff', c3:'#0d0814' },
  ocean:     { name:'Océan',      desc:'Bleu profond',        bg:'#0a1628', c1:'#0ea5e9', c2:'#38bdf8', c3:'#060e18' },
  midnight:  { name:'Midnight',   desc:'Indigo nocturne',   bg:'#0f172a', c1:'#818cf8', c2:'#a5b4fc', c3:'#020617' },
};

function applyTheme(t) {
  if (!t || !THEME_META[t]) t = 'light';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('psm_theme', t); } catch(e) {}
  if (typeof APP !== 'undefined' && APP && APP.settings) APP.settings.theme = t;
  document.body.style.removeProperty('--bg-image');
  // Flash transition overlay
  let overlay = document.getElementById('_themeFlash');
  if(!overlay) {
    overlay = document.createElement('div');
    overlay.id = '_themeFlash';
    overlay.className = 'theme-flash-overlay';
    document.body.appendChild(overlay);
  }
  overlay.style.opacity = '0.18';
  requestAnimationFrame(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  });
  setTimeout(updateThemeBtn, 10);
  setTimeout(initDynamicBg, 50);
}

function openThemePicker(btn) {
  const existing = document.getElementById('_tp_panel');
  if(existing) { existing.remove(); return; }
  const rect = btn.getBoundingClientRect();
  const cur  = document.documentElement.dataset.theme || 'dark';
  const panel = document.createElement('div');
  panel.id = '_tp_panel';
  panel.className = 'tp-panel';
  panel.style.cssText = 'top:'+(rect.bottom+6)+'px;right:'+(window.innerWidth-rect.right)+'px';
  panel.innerHTML =
    '<div style="font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;padding:0 2px">Apparence</div>' +
    Object.entries(THEME_META).map(([id, m]) => {
      const active = cur === id;
      return '<div class="tp-item'+(active?' tp-active':'')+'" onclick="selectThemePicker(\''+id+'\')">'+
        '<div class="tp-palette">'+
          '<div class="tp-dot" style="background:'+m.c3+'"></div>'+
          '<div class="tp-dot" style="background:'+m.bg+'"></div>'+
          '<div class="tp-dot" style="background:'+m.c1+(m.special?';box-shadow:0 0 5px '+m.c1:'')+';"></div>'+
        '</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:13px;font-weight:600;color:var(--text-0);display:flex;align-items:center;gap:6px">'+
            m.name+
            (m.special?'<span style="font-size:9px;background:'+m.c1+';color:#000;padding:1px 5px;border-radius:99px;font-weight:700;letter-spacing:.04em">SPÉCIAL</span>':'')+
          '</div>'+
          '<div style="font-size:11px;color:var(--text-3);margin-top:1px">'+m.desc+'</div>'+
        '</div>'+
        (active?'<svg width="13" height="13" fill="none" stroke="var(--accent)" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>':'')+
      '</div>';
    }).join('') +
    '';
  document.body.appendChild(panel);
  setTimeout(()=>document.addEventListener('click',function h(e){
    if(!panel.contains(e.target)&&!btn.contains(e.target)){panel.remove();document.removeEventListener('click',h);}
  },true),10);
}

function selectThemePicker(themeId) {
  APP.settings.theme = themeId;
  saveDB();
  applyTheme(themeId);
  document.getElementById('_tp_panel')?.remove();
  if(currentPage === 'settings') { renderSettings(); _loadCloudSnapshotsUI(); if(typeof _updateBackupIndicator==='function') _updateBackupIndicator(); }
  // Persist to Firebase prefs so theme survives reconnect (same payload as saveSettings)
  if (typeof _saveUserPrefs === 'function') {
    _saveUserPrefs({
      theme: themeId,
      _dynamicBg: APP.settings._dynamicBg,
      _dynamicBgIntensity: APP.settings._dynamicBgIntensity,
      _hiddenPages: APP.settings._hiddenPages
    });
  }
}

// ── DYNAMIC BACKGROUND ENGINE ──
var _dynBgRAF = null;
var _dynBgParticles = [];

function _hexToRgba(hex, alpha) {
  hex = hex.replace('#','');
  if(hex.length===3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  var r = parseInt(hex.substring(0,2),16), g = parseInt(hex.substring(2,4),16), b = parseInt(hex.substring(4,6),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

function initDynamicBg() {
  var mode = APP.settings._dynamicBg || 'off';
  var intensity = APP.settings._dynamicBgIntensity || 'subtil';
  var canvas = document.getElementById('dynamic-bg-canvas');
  if(!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'dynamic-bg-canvas';
    document.body.prepend(canvas);
  }
  if(_dynBgRAF) { cancelAnimationFrame(_dynBgRAF); _dynBgRAF = null; }
  if(mode === 'off') { canvas.classList.remove('active'); return; }
  canvas.classList.add('active');
  var ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  var count = intensity === 'actif' ? 55 : 22;
  var cs = getComputedStyle(document.documentElement);
  var accentHex = cs.getPropertyValue('--accent').trim() || '#3d7fff';
  var accent2Hex = cs.getPropertyValue('--accent2').trim() || '#00e5aa';
  if(mode === 'particules') {
    _dynBgParticles = [];
    for(var i=0;i<count;i++) {
      _dynBgParticles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*2+0.5,
        vx: (Math.random()-0.5)*(intensity==='actif'?0.7:0.25),
        vy: (Math.random()-0.5)*(intensity==='actif'?0.7:0.25),
        hex: Math.random()>0.5 ? accentHex : accent2Hex,
        alpha: Math.random()*0.3+0.1
      });
    }
    var maxDist = intensity==='actif'?120:80;
    function drawP() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var pts = _dynBgParticles;
      for(var i=0;i<pts.length;i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if(p.x<0) p.x=canvas.width; if(p.x>canvas.width) p.x=0;
        if(p.y<0) p.y=canvas.height; if(p.y>canvas.height) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283);
        ctx.fillStyle=_hexToRgba(p.hex,p.alpha); ctx.fill();
      }
      for(var i=0;i<pts.length;i++) {
        for(var j=i+1;j<pts.length;j++) {
          var dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
          if(d<maxDist) {
            ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
            ctx.strokeStyle=_hexToRgba(accentHex,(1-d/maxDist)*0.12); ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      _dynBgRAF=requestAnimationFrame(drawP);
    }
    drawP();
  } else if(mode === 'ambiance') {
    var t=0;
    var spd = intensity==='actif'?0.006:0.002;
    var blobAlpha = intensity==='actif'?0.08:0.04;
    function drawA() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      t += spd;
      var w=canvas.width, h=canvas.height;
      var blobR = Math.min(w,h)*0.3;
      var cx1=w*0.3+Math.sin(t)*w*0.15, cy1=h*0.4+Math.cos(t*0.7)*h*0.15;
      var cx2=w*0.7+Math.cos(t*0.5)*w*0.15, cy2=h*0.6+Math.sin(t*0.8)*h*0.15;
      var g1=ctx.createRadialGradient(cx1,cy1,0,cx1,cy1,blobR);
      g1.addColorStop(0,_hexToRgba(accentHex,blobAlpha)); g1.addColorStop(1,'transparent');
      ctx.fillStyle=g1; ctx.fillRect(0,0,w,h);
      var g2=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,blobR);
      g2.addColorStop(0,_hexToRgba(accent2Hex,blobAlpha*0.8)); g2.addColorStop(1,'transparent');
      ctx.fillStyle=g2; ctx.fillRect(0,0,w,h);
      _dynBgRAF=requestAnimationFrame(drawA);
    }
    drawA();
  }
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-picker-btn');
  if(!btn) return;
  const cur = document.documentElement.dataset.theme || 'dark';
  const m = THEME_META[cur] || THEME_META.dark;
  btn.innerHTML =
    '<div style="width:10px;height:10px;border-radius:50%;background:'+m.c1+';flex-shrink:0'+(m.special?';box-shadow:0 0 7px '+m.c1:'')+';"></div>'+
    '<span>'+m.name+'</span>'+
    '<svg width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>';
}
function quickNewBon() { showPage('bons'); setTimeout(()=>openBonModal(),100); }

function updateAlertBadge() {
  const alerts = APP.articles.filter(a => a.stock <= a.stockMin);
  const b = document.getElementById('badge-articles');
  if(b) { b.textContent = alerts.length; b.style.display = alerts.length ? '' : 'none'; }
  // F3: Browser notifications for low stock
  alerts.forEach(function(a) {
    var _nkey = 'stock_' + a.id;
    if (!_notifSentAlerts.has(_nkey)) {
      _sendBrowserNotif(
        '\u26a0 Stock bas \u2014 ' + a.name,
        'Stock: ' + (a.stock||0) + ' (min: ' + (a.stockMin||0) + ')',
        _nkey
      );
      _notifSentAlerts.add(_nkey);
    }
  });
  const pendingCmds = (APP.commandesFourn||[]).filter(c=>c.status==='pending'||c.status==='partial').length;
  const cb = document.getElementById('badge-commandes');
  if(cb) { cb.textContent = pendingCmds; cb.style.display = pendingCmds ? '' : 'none'; }
  updateNotifBell();
}

// ============================================================
// NOTIFY
// ============================================================
function updateNotifBell() {
  // Notification bell — no-op (reserved for future use)
}

function notify(msg, type='info') {
  const container = document.getElementById('notify-container');
  const el = document.createElement('div');
  el.className = `notify notify-${type}`;
  const icons = {success:'✓',error:'✕',danger:'✕',warning:'⚠',info:'ℹ'};
  const col = type==='error'||type==='danger'?'danger':type==='success'?'success':type==='warning'?'warning':'accent';
  el.innerHTML = `<span style="color:var(--${col})">${icons[type]||'ℹ'}</span><div style="flex:1;line-height:1.4">${msg}</div>`;
  container.appendChild(el);
  setTimeout(() => { el.style.animation='slideOut 0.3s ease forwards'; setTimeout(()=>el.remove(),300); }, 3500);
}

// ============================================================
// MODAL ENGINE
// ============================================================
function openModal(id, title, body, onConfirm, sizeClass='') {
  // Support alternate call: openModal(title, bodyHtml, buttonsArray)
  if(Array.isArray(body)) {
    var _btns = body; body = title; title = id; id = 'modal-' + Date.now();
    closeModal();
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay'; overlay.id = 'active-modal';
    overlay.onclick = function(e){ if(e.target===overlay) closeModal(); };
    overlay.innerHTML = '<div class="modal modal-lg">'
      + '<div class="modal-header"><div class="modal-title">' + title + '</div><button class="close-btn" onclick="closeModal()">✕</button></div>'
      + '<div class="modal-body">' + body + '</div>'
      + '<div class="modal-footer" id="_modal_btns"></div>'
      + '</div>';
    document.body.appendChild(overlay);
    var _footer = document.getElementById('_modal_btns');
    _btns.forEach(function(b) {
      var _b = document.createElement('button');
      _b.className = 'btn ' + (b.cls || 'btn-secondary');
      _b.textContent = b.label;
      _b.onclick = function() { new Function(b.onclick || 'closeModal()')(); };
      _footer.appendChild(_b);
    });
    requestAnimationFrame(function(){ overlay.classList.add('show'); });
    return;
  }
  closeModal();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'active-modal';
  overlay.onclick = e => { if(e.target===overlay) closeModal(); };
  overlay.innerHTML = `<div class="modal ${sizeClass}">
    <div class="modal-header">
      <div class="modal-title">${title}</div>
      <button class="close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">${body}</div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">${onConfirm?'Annuler':'Fermer'}</button>
      ${onConfirm?`<button class="btn btn-primary" onclick="document.getElementById('active-modal')._confirm()">Enregistrer</button>`:''}
    </div>
  </div>`;
  if(onConfirm) overlay._confirm = onConfirm;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
}
function closeModal() {
  const m = document.getElementById('active-modal');
  if(m) { m.classList.remove('show'); setTimeout(() => m.remove(), 200); }
  // Run optional cleanup hook (used by activity log to detach Firebase listeners)
  try { if (typeof window._modalCloseCleanup === 'function') { window._modalCloseCleanup(); window._modalCloseCleanup = null; } } catch(e) {}
}
function openGenericModal(title, bodyHtml) {
  openModal('generic-modal', title, bodyHtml, null, 'modal-xl');
}

// ============================================================
// INLINE EDITING ENGINE
// ============================================================
function makeEditable(td, value, type, options, onSave) {
  if(td.dataset.editing === 'true') return;
  td.dataset.editing = 'true';
  const original = td.innerHTML;
  let saved = false;
  let input;
  if(type === 'select' && options) {
    input = document.createElement('select');
    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value !== undefined ? o.value : o;
      opt.textContent = o.label || o;
      if(opt.value == value) opt.selected = true;
      input.appendChild(opt);
    });
  } else {
    input = document.createElement('input'); input.type = type || 'text'; input.value = value;
  }
  td.innerHTML = ''; td.appendChild(input); input.focus();
  if(input.select) input.select();
  const save = () => {
    if(saved) return; saved = true;
    input.onblur = null;
    const newVal = input.value;
    if(newVal != value) {
      // Remove input immediately, show new value as text
      td.textContent = newVal;
      td.dataset.editing = 'false';
      onSave(newVal);
      notify('Modifié avec succès','success');
    } else {
      td.innerHTML = original;
      td.dataset.editing = 'false';
    }
  };
  const cancel = () => { if(saved) return; saved = true; input.onblur = null; td.innerHTML = original; td.dataset.editing = 'false'; };
  input.onblur = save;
  input.onkeydown = e => {
    if(e.key === 'Enter') { e.preventDefault(); save(); }
    if(e.key === 'Escape') { e.preventDefault(); cancel(); }
  };
}

// ============================================================
// ARTICLE GALLERY
// ============================================================
let _galCurrentIdx = 0;
function openArticleGallery(artId) {
  const art = APP.articles.find(a => a.id === artId);
  if (!art) return;
  const images = [];
  if (art.image) images.push(art.image);
  if (art._extraImages) images.push(...art._extraImages);
  if (images.length === 0) {
    _galAddPhoto(artId);
    return;
  }
  _galCurrentIdx = 0;
  _galRender(artId);
}

function _galRender(artId) {
  const art = APP.articles.find(a => a.id === artId);
  if (!art) return;
  const images = [];
  if (art.image) images.push(art.image);
  if (art._extraImages) images.push(...art._extraImages);
  const total = images.length;
  if (total === 0) { closeModal(); return; }
  if (_galCurrentIdx >= total) _galCurrentIdx = total - 1;
  if (_galCurrentIdx < 0) _galCurrentIdx = 0;
  const src = images[_galCurrentIdx];
  let html = '<div style="text-align:center">'
    + '<div style="margin-bottom:10px;background:#111;border-radius:8px;padding:8px;min-height:200px;display:flex;align-items:center;justify-content:center">'
    + '<img src="' + src + '" style="max-width:100%;max-height:50vh;border-radius:6px;object-fit:contain">'
    + '</div>'
    + '<div style="display:flex;justify-content:center;align-items:center;gap:16px;margin:10px 0">'
    + '<button class="btn btn-sm"' + (_galCurrentIdx <= 0 ? ' disabled style="opacity:.3"' : ' onclick="_galCurrentIdx--;_galRender(\'' + artId + '\')"') + '>\u25C0</button>'
    + '<span style="font-size:13px;min-width:60px">' + (_galCurrentIdx + 1) + ' / ' + total + '</span>'
    + '<button class="btn btn-sm"' + (_galCurrentIdx >= total - 1 ? ' disabled style="opacity:.3"' : ' onclick="_galCurrentIdx++;_galRender(\'' + artId + '\')"') + '>\u25B6</button>'
    + '</div>'
    + '<div style="display:flex;gap:6px;overflow-x:auto;padding:6px 0;justify-content:center">';
  images.forEach(function(img, i) {
    html += '<div onclick="_galCurrentIdx=' + i + ';_galRender(\'' + artId + '\')" style="width:48px;height:48px;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid ' + (i === _galCurrentIdx ? 'var(--accent)' : 'transparent') + ';flex-shrink:0">'
      + '<img src="' + img + '" style="width:100%;height:100%;object-fit:cover"></div>';
  });
  html += '</div>'
    + '<div style="margin-top:12px;display:flex;justify-content:center;gap:8px">'
    + '<button class="btn btn-primary btn-sm" onclick="_galAddPhoto(\'' + artId + '\')">\uD83D\uDCF7 Ajouter</button>'
    + '<button class="btn btn-danger btn-sm" onclick="_galDeletePhoto(\'' + artId + '\')">\uD83D\uDDD1 Supprimer</button>'
    + '</div></div>';
  openGenericModal('\uD83D\uDDBC ' + art.name + ' \u2014 Galerie', html);
}

function _galAddPhoto(artId) {
  const art = APP.articles.find(a => a.id === artId);
  if (!art) return;
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
  inp.onchange = function() {
    let loaded = 0;
    const files = Array.from(inp.files);
    files.forEach(function(file) {
      if (file.size > 500 * 1024) { notify('Image trop grande (max 500KB): ' + file.name, 'warning'); loaded++; return; }
      const reader = new FileReader();
      reader.onload = function(e) {
        _imagesDirty = true; if (!art.image) art.image = e.target.result;
        else {
          if (!art._extraImages) art._extraImages = [];
          art._extraImages.push(e.target.result);
        }
        loaded++;
        if (loaded >= files.length) {
          saveDB();
          notify(files.length + ' photo(s) ajout\u00e9e(s)', 'success');
          openArticleGallery(artId);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  inp.click();
}

function _galDeletePhoto(artId) {
  const art = APP.articles.find(a => a.id === artId);
  if (!art) return;
  const images = [];
  if (art.image) images.push(art.image);
  if (art._extraImages) images.push(...art._extraImages);
  if (images.length === 0) return;
  if (!confirm('Supprimer cette photo ?')) return;
  if (_galCurrentIdx === 0 && art.image) {
    if (art._extraImages && art._extraImages.length > 0) {
      art.image = art._extraImages.shift();
    } else {
      art.image = '';
    }
  } else {
    const extraIdx = art.image ? _galCurrentIdx - 1 : _galCurrentIdx;
    if (art._extraImages) art._extraImages.splice(extraIdx, 1);
  }
  saveDB();
  notify('Photo supprim\u00e9e', 'success');
  const remaining = (art.image ? 1 : 0) + (art._extraImages ? art._extraImages.length : 0);
  if (remaining > 0) _galRender(artId);
  else closeModal();
}

// ============================================================
// BON PDF EXPORT
// ============================================================
async function exportBonPDF(id, paperSize) {
  paperSize = (paperSize || 'A4').toUpperCase();
  const bon = APP.bons.find(b => b.id === id);
  if (!bon) { notify('Bon introuvable', 'error'); return; }
  auditLog('DOWNLOAD', 'bon', bon.numero, null, {format: 'PDF'});
  // Open popup synchronously to preserve user gesture
  const win = window.open('', '_blank');
  if (!win) { notify('Popup bloqu\u00e9 \u2014 autorisez les popups', 'warning'); return; }
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF \u2014 ' + bon.numero + '</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;color:#666"><div style="font-size:14px">\u23f3 Chargement des signatures\u2026</div></body></html>');
  // Wait for sig cache before writing the real PDF body
  if (typeof _loadSignaturesCache === 'function') {
    try { await _loadSignaturesCache(); } catch(e) {}
  }
  if (win.closed) return;
  win.document.open();
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF \u2014 ' + bon.numero + '</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:20px;font-family:Arial,sans-serif}'
    + '@media print{body{padding:0}@page{margin:10mm;size:' + paperSize.toLowerCase() + '}}'
    + '.no-print{margin:16px auto;text-align:center}'
    + '@media print{.no-print{display:none}}</style></head><body>'
    + '<div class="no-print"><p style="margin-bottom:8px;color:#666;font-size:14px">'
    + '\uD83D\uDCA1 S\u00e9lectionnez <strong>"Enregistrer au format PDF"</strong> comme imprimante</p>'
    + '<button onclick="window.print()" style="padding:10px 24px;background:#f5a623;color:#000;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">'
    + '\uD83D\uDCE5 T\u00e9l\u00e9charger en PDF</button></div>'
    + generateBonHTML(bon, {paperSize: paperSize, minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined}) + '</body></html>');
  win.document.close();
}

// ============================================================
// STOCK ALERT NOTIFICATIONS
// ============================================================
let _notifPermission = 'default';
let _notifCheckTimer = null;

function initStockNotifications() {
  if (!('Notification' in window)) return;
  _notifPermission = Notification.permission;
  if (_notifPermission === 'default') {
    Notification.requestPermission().then(function(p) { _notifPermission = p; });
  }
  // Check stock alerts every 60 seconds
  if (_notifCheckTimer) clearInterval(_notifCheckTimer);
  _notifCheckTimer = setInterval(checkStockAlerts, 60000);
  // Initial check after 5s
  setTimeout(checkStockAlerts, 5000);
}

let _lastNotifiedAlerts = {};
function checkStockAlerts() {
  if (_notifPermission !== 'granted') return;
  const alerts = APP.articles.filter(function(a) { return a.stock <= a.stockMin && a.stock >= 0; });
  const newAlerts = alerts.filter(function(a) {
    const key = a.id + '_' + a.stock;
    if (_lastNotifiedAlerts[key]) return false;
    _lastNotifiedAlerts[key] = true;
    return true;
  });
  if (newAlerts.length === 0) return;
  const body = newAlerts.slice(0, 5).map(function(a) {
    return a.name + ': ' + a.stock + '/' + a.stockMin;
  }).join('\n');
  const title = '\u26A0\uFE0F ' + newAlerts.length + ' alerte(s) stock';
  try {
    const n = new Notification(title, {
      body: body + (newAlerts.length > 5 ? '\n... et ' + (newAlerts.length - 5) + ' autres' : ''),
      icon: (typeof _safeCompanyLogo==='function' ? _safeCompanyLogo() : APP.settings.companyLogo) || undefined,
      tag: 'psm-stock-alert',
      requireInteraction: false
    });
    n.onclick = function() { window.focus(); showPage('articles'); n.close(); };
    setTimeout(function() { n.close(); }, 10000);
  } catch(e) {}
}


// ============================================================
// IMAGE LOADER
// ============================================================
function loadImgPreview(inputId, previewId, dataId) {
  const file = document.getElementById(inputId)?.files[0];
  if(!file) return;
  if(file.size > 500*1024) { notify('Image trop grande (max 500KB)','warning'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    if(dataId) document.getElementById(dataId).value = e.target.result;
    const prev = document.getElementById(previewId);
    if(prev) prev.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:contain">`;
  };
  reader.readAsDataURL(file);
}

// ============================================================
// DASHBOARD
// ============================================================
let dashTimer = null;
function renderDashboard() {
  const content = document.getElementById('content');
  const logo = _safeCompanyLogo();
  const name = APP.settings.companyName || 'Mon Entreprise';
  content.innerHTML = `
  <div class="page-header">
    <div style="display:flex;align-items:center;gap:14px">
      ${logo
        ? `<div style="height:52px;display:flex;align-items:center"><img src="${logo}" style="max-height:52px;max-width:160px;object-fit:contain"></div>`
        : `<div style="font-size:20px;font-weight:900;letter-spacing:-.01em">${name}</div>`}
      <div>
        <div class="page-sub">${fmtDate(Date.now())} — Tableau de bord gadgets</div>
      </div>
    </div>
    <div class="flex-center gap-8">
      <button class="btn btn-secondary btn-sm" onclick="openDashWidgetConfig()" title="Personnaliser">⚙️ Personnaliser</button>
    </div>
  </div>
  <div class="grid-3 mb-16 dash-widget" data-widget="kpis">
    <div class="card"><div class="card-header"><span class="card-title">Stock Total</span><div class="kpi-icon" style="background:rgba(61,127,255,.15);color:var(--accent)">${ICONS.box}</div></div><div class="kpi-value" id="kv-stock" style="color:var(--accent)">—</div><div class="kpi-change" id="ks-stock">—</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Alertes</span><div class="kpi-icon" style="background:rgba(255,71,87,.15);color:var(--danger)">⚠️</div></div><div class="kpi-value" id="kv-alerts">—</div><div class="kpi-change">Gadgets sous seuil</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Bons / 30j</span><div class="kpi-icon" style="background:rgba(0,229,170,.15);color:var(--accent2)">📋</div></div><div class="kpi-value" id="kv-bons" style="color:var(--accent2)">—</div><div class="kpi-change">Bons émis</div></div>
  </div>
  <!-- Dispatch summary bar -->
  <div class="card mb-16 dash-widget" data-widget="dispatch" style="border-left:3px solid var(--accent);cursor:pointer" onclick="showPage('dispatch')">
    <div class="card-header"><span class="card-title">⚙️ Dispatch Gadgets — aperçu rapide</span><button class="btn btn-secondary btn-sm">Ouvrir →</button></div>
    <div id="dash-dispatch-preview" style="display:flex;gap:16px;flex-wrap:wrap;padding:0 4px 4px">
      <span style="font-size:12px;color:var(--text-2)">Chargement...</span>
    </div>
  </div>
  <div class="grid-2 mb-16 dash-widget" data-widget="charts">
    <div class="card"><div class="card-header"><span class="card-title">Stock par catégorie</span></div><div class="chart-container"><canvas id="chartCat"></canvas></div></div>
    <div class="card"><div class="card-header" style="flex-wrap:wrap;gap:6px"><span class="card-title">Évolution Sorties / Entrées</span><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><input type="date" id="chartMvt-from" style="font-size:11px;padding:3px 6px;width:auto;min-width:0" onchange="drawChartMvt()"><span style="font-size:11px;color:var(--text-2)">au</span><input type="date" id="chartMvt-to" style="font-size:11px;padding:3px 6px;width:auto;min-width:0" onchange="drawChartMvt()"></div></div><div class="chart-container"><canvas id="chartMvt"></canvas></div></div>
  </div>
  <div class="grid-2 dash-widget" data-widget="alerts-activity">
    <div class="card"><div class="card-header"><span class="card-title">⚠️ Gadgets en alerte</span><button class="btn btn-sm btn-secondary" onclick="showPage('articles')">Voir tout</button></div><div id="dash-alerts"></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Activité récente</span></div><div id="dash-activity"></div></div>
  </div>
  <div class="card dash-widget" data-widget="report" style="margin-top:16px">
    <div class="card-header" style="flex-wrap:wrap;gap:8px">
      <span class="card-title">📊 Rapport de stock</span>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <select id="rpt-period" onchange="toggleReportPeriod();refreshReportCard()" style="width:auto;font-size:12px">
          <option value="7">7 derniers jours</option>
          <option value="30" selected>30 derniers jours</option>
          <option value="90">3 derniers mois</option>
          <option value="365">Cette année</option>
          <option value="custom">📅 Période personnalisée</option>
        </select>
        <span id="rpt-custom-wrap" style="display:none;align-items:center;gap:4px">
          <input type="date" id="rpt-from" style="width:auto;font-size:12px" onchange="refreshReportCard()">
          <span style="font-size:12px;color:var(--text-2)">→</span>
          <input type="date" id="rpt-to" style="width:auto;font-size:12px" onchange="refreshReportCard()">
        </span>
        <button class="btn btn-secondary btn-sm" onclick="refreshReportCard()">🔄 Actualiser</button>
        <button class="btn btn-primary btn-sm" onclick="printStockReport()">🖨 Stock</button>
        <button class="btn btn-secondary btn-sm" onclick="printComReport()">👤 Par commercial</button>
        <button class="btn btn-secondary btn-sm" onclick="printDispatchReport(0)">⚙️ Dispatch</button>
      </div>
    </div>
    <div id="rpt-kpi-row" style="display:flex;gap:12px;padding:8px 4px 4px;flex-wrap:wrap"></div>
    <div id="rpt-table-wrap" style="overflow-x:auto;max-height:420px;overflow-y:auto;padding:0 4px 8px"></div>
  </div>`;
  _applyDashWidgets();
  _initDashDragDrop();
  refreshDashboard(false);
  drawChartCat(); drawChartMvt();
  setTimeout(refreshReportCard, 50);
  if(dashTimer) clearInterval(dashTimer);
  dashTimer = setInterval(() => refreshDashboard(false), 30000);
}

function animateNumber(el, newVal) {
  if(!el) return;
  el.style.transform = 'scale(1.15)'; el.style.opacity = '0.7';
  setTimeout(() => { el.textContent = typeof newVal === 'number' ? newVal.toLocaleString('fr-FR') : newVal; el.style.transform = 'scale(1)'; el.style.opacity = '1'; }, 200);
}

function getDashPeriod() {
  const sel = document.getElementById('dash-period')?.value || '30';
  const fromVal = document.getElementById('dash-from')?.value;
  const toVal   = document.getElementById('dash-to')?.value;
  let tFrom, tTo, label;

  if(sel === 'custom' && fromVal && toVal) {
    tFrom = new Date(fromVal).getTime();
    tTo   = new Date(toVal).getTime() + 86399999;
    label = `Du ${fromVal.split('-').reverse().join('/')} au ${toVal.split('-').reverse().join('/')}`;
  } else {
    tTo = Date.now();
    const now = new Date();
    switch(sel) {
      case '7':   tFrom = tTo - 7*86400000;   label='7 derniers jours';  break;
      case '30':  tFrom = tTo - 30*86400000;  label='30 derniers jours'; break;
      case '90':  tFrom = tTo - 90*86400000;  label='3 derniers mois';   break;
      case '365': tFrom = new Date(now.getFullYear(),0,1).getTime(); label='Cette année ('+now.getFullYear()+')'; break;
      default:    tFrom = tTo - 30*86400000;  label='30 derniers jours';
    }
  }
  return {tFrom, tTo, label};
}

function toggleCustomPeriod() {
  const sel = document.getElementById('dash-period')?.value;
  const wrap = document.getElementById('dash-custom-wrap');
  if(wrap) wrap.style.display = sel === 'custom' ? 'flex' : 'none';
  refreshDashboard(false);
}

function printDashboard() {
  const {tFrom, tTo, label} = getDashPeriod();
  const _isGhostEntree = (n) => /^(?:Annulation|Retour brouillon|Suppression)\s+Bon\s/i.test(n||'') || /^Modif\s+Bon\s.*\(restauration\)/i.test(n||'');
  const _isBonSortie = (n) => /^(?:Modif\s+|Suppression\s+|Renvoi\s+)?Bon\s+\S+/i.test(n||'');
  const _validBonsInP = APP.bons.filter(b=>b.status==='valid\u00e9' && ((b._validatedAt||b.createdAt)>=tFrom && (b._validatedAt||b.createdAt)<=tTo));
  const _artMatch = (l,a) => l.articleId===a.id || l.code===a.code || (l.name||l.articleName)===a.name;
  const totalQte  = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alerts    = APP.articles.filter(a => a.stock <= a.stockMin);
  const sortiesP  = APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>=tFrom&&m.ts<=tTo&&!_isBonSortie(m.note)).reduce((s,m)=>s+m.qty,0)
                  + _validBonsInP.reduce((s,b)=>s+(b.lignes||[]).reduce((ss,l)=>ss+(parseInt(l.qty)||0),0),0);
  const entreesP  = APP.mouvements.filter(m=>m.type==='entree'&&m.ts>=tFrom&&m.ts<=tTo&&!_isGhostEntree(m.note)).reduce((s,m)=>s+m.qty,0);
  const bonsP     = APP.bons.filter(b=>b.createdAt>=tFrom&&b.createdAt<=tTo).length;
  const logo      = _safeCompanyLogo();
  const addr      = APP.settings.companyAddress || '';
  const tel       = APP.settings.companyTel || '';
  const fax       = APP.settings.companyFax || '';
  const email     = APP.settings.companyEmail || '';

  // Mouvements sur la période
  const movsP = APP.mouvements.filter(m=>m.ts>=tFrom&&m.ts<=tTo).slice().sort((a,b)=>b.ts-a.ts);

  // Stock par gadget
  const stockRows = APP.articles.map(a => {
    const sorties = APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo&&!_isBonSortie(m.note)).reduce((s,m)=>s+m.qty,0)
                  + _validBonsInP.reduce((s,b)=>s+(b.lignes||[]).filter(l=>_artMatch(l,a)).reduce((ss,l)=>ss+(parseInt(l.qty)||0),0),0);
    const entrees = APP.mouvements.filter(m=>m.type==='entree'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo&&!_isGhostEntree(m.note)).reduce((s,m)=>s+m.qty,0);
    const isAlert = a.stock <= a.stockMin;
    return `<tr style="${isAlert?'background:#fff5f5':''}">
      <td>${a.code}</td>
      <td style="font-weight:600">${a.name}</td>
      <td style="text-align:center;color:${isAlert?'#cc0000':'#007700'};font-weight:700">${a.stock}</td>
      <td style="text-align:center;color:#007700">+${entrees}</td>
      <td style="text-align:center;color:#cc4400">-${sorties}</td>
      <td style="text-align:center">${a.price ? a.price.toLocaleString('fr-FR')+' FCFA' : '—'}</td>
      <td style="text-align:center">${isAlert?'<span style="color:#cc0000;font-weight:700">⚠ ALERTE</span>':'<span style="color:#007700">✓ OK</span>'}</td>
    </tr>`;
  }).join('');

  const win = window.open('','_blank','width=1000,height=750');
  win.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
  <title>Rapport de Stock — ${label}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;padding:24px 32px;color:#111;background:#fff;font-size:12px}
    .header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #111}
    .header-left{}
    .header-logo{max-height:90px;max-width:220px;object-fit:contain;display:block;margin-bottom:8px}
    .header-info{font-size:11px;color:#444;line-height:1.7}
    .header-right{text-align:right}
    .report-title{font-size:18px;font-weight:900;color:#111;border:2px solid #111;padding:8px 18px;display:inline-block;letter-spacing:.04em;margin-bottom:6px}
    .period-label{font-size:11px;color:#555;margin-top:4px}
    .print-date{font-size:10px;color:#888;margin-top:4px}
    .kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
    .kpi{border:1px solid #ddd;border-radius:6px;padding:12px;text-align:center;background:#fafafa}
    .kpi-val{font-size:24px;font-weight:900;color:#1a3a8b}
    .kpi-label{font-size:10px;color:#666;margin-top:3px;text-transform:uppercase;letter-spacing:.05em}
    .section-title{font-size:13px;font-weight:700;margin:16px 0 8px;padding:6px 10px;background:#f0f0f0;border-left:4px solid #1a3a8b;text-transform:uppercase;letter-spacing:.04em}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#1a3a8b;color:white;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.04em}
    td{padding:7px 10px;border-bottom:1px solid #eee;font-size:11px;vertical-align:middle}
    tr:nth-child(even) td{background:#f9f9f9}
    .footer{margin-top:24px;padding-top:12px;border-top:1px solid #ccc;display:flex;justify-content:space-between;font-size:10px;color:#888}
    @media print{@page{margin:10mm;size:A4} body{padding:0} .no-print{display:none}}
  </style></head><body>

  <div class="header">
    <div class="header-left">
      ${logo ? `<img src="${logo}" class="header-logo" alt="Logo">` : ''}
      <div class="header-info">
        ${addr ? `<div>${addr}</div>` : ''}
        ${tel  ? `<div>Tél : <strong>${tel}</strong>${fax?' &nbsp;|&nbsp; Fax : <strong>'+fax+'</strong>':''}</div>` : ''}
        ${email? `<div>${email}</div>` : ''}
      </div>
    </div>
    <div class="header-right">
      <div class="report-title">RAPPORT DE STOCK</div>
      <div class="period-label">Période : <strong>${label}</strong></div>
      <div class="print-date">Imprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-val">${totalQte.toLocaleString('fr-FR')}</div><div class="kpi-label">Stock total</div></div>
    <div class="kpi"><div class="kpi-val" style="color:${alerts.length>0?'#cc0000':'#007700'}">${alerts.length}</div><div class="kpi-label">Alertes stock</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#007700">+${entreesP.toLocaleString('fr-FR')}</div><div class="kpi-label">Entrées période</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#cc4400">-${sortiesP.toLocaleString('fr-FR')}</div><div class="kpi-label">Sorties période</div></div>
    <div class="kpi"><div class="kpi-val">${bonsP}</div><div class="kpi-label">Bons émis</div></div>
  </div>

  <div class="section-title">État des stocks par gadget</div>
  <table>
    <thead><tr><th>Code</th><th>Désignation</th><th style="text-align:center">Stock actuel</th><th style="text-align:center">Entrées</th><th style="text-align:center">Sorties</th><th style="text-align:center">Prix unitaire</th><th style="text-align:center">Statut</th></tr></thead>
    <tbody>${stockRows}</tbody>
  </table>

  ${movsP.length > 0 ? `
  <div class="section-title">Mouvements sur la période (${movsP.length})</div>
  <table>
    <thead><tr><th>Date / Heure</th><th>Type</th><th>Article</th><th>Code</th><th style="text-align:center">Quantité</th><th>Commanditaire</th><th>Observation</th></tr></thead>
    <tbody>${movsP.slice(0,100).map(m=>{
      const art  = APP.articles.find(a=>a.id===m.articleId);
      const dt   = new Date(m.ts);
      const isE  = m.type === 'entree';
      const fourn= m.fournisseurId ? APP.fournisseurs.find(f=>f.id===m.fournisseurId) : null;
      const who  = m.commercialId  ? APP.commerciaux.find(c=>c.id===m.commercialId)   : null;
      let whoLabel;
      const _bm = /^(?:Modif |Suppression |Renvoi )?Bon\s+(\S+)/i.exec(m.note||'');
      if (_bm) {
        const _bon = APP.bons.find(b=>String(b.numero)===_bm[1]);
        if (_bon) whoLabel = '<div style="font-weight:600">'+(_bonLiveName(_bon)||'—')+'</div><div style="font-size:10px;color:#666">Dem: '+(_bon.demandeur||'—')+'</div>';
      }
      if (typeof whoLabel === 'undefined') {
        if (isE && fourn)         whoLabel = '🏭 '+fourn.nom;
        else if (!isE && who)     whoLabel = '👤 '+who.prenom+' '+who.nom;
        else if (m.userLogin)     whoLabel = '<span style="color:#666">👨‍💻 '+m.userLogin+'</span>';
        else                      whoLabel = '—';
      }
      const dateStr = dt.toLocaleDateString('fr-FR')+' '+dt.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
      return `<tr><td style="white-space:nowrap">${dateStr}</td><td style="color:${isE?'#007700':'#cc4400'};font-weight:700">${isE?'ENTRÉE':'SORTIE'}</td><td>${m.articleName||'—'}</td><td style="font-family:monospace;font-size:10px;color:#555">${art?art.code:'—'}</td><td style="text-align:center;font-weight:700">${isE?'+':'−'}${m.qty}</td><td>${whoLabel}</td><td style="color:#666;font-style:italic">${m.note||m.obs||''}</td></tr>`;
    }).join('')}
    ${movsP.length>100?`<tr><td colspan="7" style="text-align:center;color:#888;font-style:italic">… ${movsP.length-100} mouvement(s) supplémentaire(s) non affichés</td></tr>`:''}
    </tbody>
  </table>` : ''}

  <div class="footer">
    <div>Document généré automatiquement — Perfect's Stock Manager</div>
    <div>Page 1</div>
  </div>

  <script>window.onload=()=>{setTimeout(()=>window.print(),400)}<\/script>
  </body></html>`);
  win.document.close();
}

// ─── Rapport de stock (sélecteur de période dédié + aperçu + impression) ─────

function getReportPeriod() {
  const sel = document.getElementById('rpt-period')?.value || '30';
  const fromVal = document.getElementById('rpt-from')?.value;
  const toVal   = document.getElementById('rpt-to')?.value;
  let tFrom, tTo, label;
  if(sel === 'custom' && fromVal && toVal) {
    tFrom = new Date(fromVal).getTime();
    tTo   = new Date(toVal).getTime() + 86399999;
    label = `Du ${fromVal.split('-').reverse().join('/')} au ${toVal.split('-').reverse().join('/')}`;
  } else {
    tTo = Date.now();
    const now = new Date();
    switch(sel) {
      case '7':   tFrom = tTo - 7*86400000;   label = '7 derniers jours';  break;
      case '90':  tFrom = tTo - 90*86400000;  label = '3 derniers mois';   break;
      case '365': tFrom = new Date(now.getFullYear(),0,1).getTime(); label = 'Cette année ('+now.getFullYear()+')'; break;
      default:    tFrom = tTo - 30*86400000;  label = '30 derniers jours';
    }
  }
  return {tFrom, tTo, label};
}

function toggleReportPeriod() {
  const sel  = document.getElementById('rpt-period')?.value;
  const wrap = document.getElementById('rpt-custom-wrap');
  if(wrap) wrap.style.display = sel === 'custom' ? 'flex' : 'none';
}

function refreshReportCard() {
  const {tFrom, tTo, label} = getReportPeriod();
  const kpiEl   = document.getElementById('rpt-kpi-row');
  const tableEl = document.getElementById('rpt-table-wrap');
  if(!kpiEl || !tableEl) return;

  const _isGhostEntree = (n) => /^(?:Annulation|Retour brouillon|Suppression)\s+Bon\s/i.test(n||'') || /^Modif\s+Bon\s.*\(restauration\)/i.test(n||'');
  const _isBonSortie = (n) => /^(?:Modif\s+|Suppression\s+|Renvoi\s+)?Bon\s+\S+/i.test(n||'');
  const _validBonsInP = APP.bons.filter(b=>b.status==='valid\u00e9' && ((b._validatedAt||b.createdAt)>=tFrom && (b._validatedAt||b.createdAt)<=tTo));
  const _artMatch = (l,a) => l.articleId===a.id || l.code===a.code || (l.name||l.articleName)===a.name;

  const totalStock  = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alertCount  = APP.articles.filter(a => a.stock <= a.stockMin).length;
  const entreesP    = APP.mouvements.filter(m => m.type==='entree' && m.ts>=tFrom && m.ts<=tTo && !_isGhostEntree(m.note)).reduce((s,m)=>s+m.qty,0);
  const sortiesP    = APP.mouvements.filter(m => m.type==='sortie' && m.ts>=tFrom && m.ts<=tTo && !_isBonSortie(m.note)).reduce((s,m)=>s+m.qty,0)
                    + _validBonsInP.reduce((s,b)=>s+(b.lignes||[]).reduce((ss,l)=>ss+(parseInt(l.qty)||0),0),0);
  const bonsP       = APP.bons.filter(b => b.createdAt>=tFrom && b.createdAt<=tTo).length;

  kpiEl.innerHTML = `
    <div style="background:var(--bg-2);border-radius:8px;padding:10px 16px;min-width:120px;text-align:center">
      <div style="font-size:20px;font-weight:900;color:var(--accent)">${totalStock.toLocaleString('fr-FR')}</div>
      <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;margin-top:2px">Stock total</div>
    </div>
    <div style="background:var(--bg-2);border-radius:8px;padding:10px 16px;min-width:120px;text-align:center">
      <div style="font-size:20px;font-weight:900;color:${alertCount>0?'var(--danger)':'var(--success)'}">${alertCount}</div>
      <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;margin-top:2px">Alertes</div>
    </div>
    <div style="background:var(--bg-2);border-radius:8px;padding:10px 16px;min-width:120px;text-align:center">
      <div style="font-size:20px;font-weight:900;color:var(--success)">+${entreesP.toLocaleString('fr-FR')}</div>
      <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;margin-top:2px">Entrées</div>
    </div>
    <div style="background:var(--bg-2);border-radius:8px;padding:10px 16px;min-width:120px;text-align:center">
      <div style="font-size:20px;font-weight:900;color:var(--accent3)">-${sortiesP.toLocaleString('fr-FR')}</div>
      <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;margin-top:2px">Sorties</div>
    </div>
    <div style="background:var(--bg-2);border-radius:8px;padding:10px 16px;min-width:120px;text-align:center">
      <div style="font-size:20px;font-weight:900;color:var(--accent2)">${bonsP}</div>
      <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;margin-top:2px">Bons émis</div>
    </div>
    <div style="flex:1;min-width:120px;display:flex;align-items:center;padding:0 4px;font-size:11px;color:var(--text-3);font-style:italic">
      Période : <strong style="margin-left:4px;color:var(--text-2)">${label}</strong>
    </div>`;

  const rows = APP.articles.map(a => {
    const ent = APP.mouvements.filter(m=>m.type==='entree'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo&&!_isGhostEntree(m.note)).reduce((s,m)=>s+m.qty,0);
    const sor = APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo&&!_isBonSortie(m.note)).reduce((s,m)=>s+m.qty,0)
              + _validBonsInP.reduce((s,b)=>s+(b.lignes||[]).filter(l=>_artMatch(l,a)).reduce((ss,l)=>ss+(parseInt(l.qty)||0),0),0);
    const isAlert = a.stock <= a.stockMin;
    return `<tr style="${isAlert?'background:rgba(255,71,87,.07)':''}">
      <td style="font-size:11px;color:var(--text-3)">${a.code}</td>
      <td style="font-weight:600;font-size:12px">${a.name}</td>
      <td style="text-align:center;font-size:12px;font-weight:700;color:${isAlert?'var(--danger)':'var(--success)'}">${a.stock}</td>
      <td style="text-align:center;font-size:12px;color:var(--success)">+${ent}</td>
      <td style="text-align:center;font-size:12px;color:var(--accent3)">-${sor}</td>
      <td style="text-align:center;font-size:11px">${isAlert?'<span style="color:var(--danger);font-weight:700">⚠ ALERTE</span>':'<span style="color:var(--success)">✓ OK</span>'}</td>
    </tr>`;
  }).join('');

  tableEl.innerHTML = `
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="position:sticky;top:0;z-index:1;background:var(--bg-1)">
        <th style="padding:7px 10px;text-align:left;font-size:10px;color:var(--text-3);border-bottom:1px solid var(--border);text-transform:uppercase">Code</th>
        <th style="padding:7px 10px;text-align:left;font-size:10px;color:var(--text-3);border-bottom:1px solid var(--border);text-transform:uppercase">Désignation</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;color:var(--text-3);border-bottom:1px solid var(--border);text-transform:uppercase">Stock actuel</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;color:var(--text-3);border-bottom:1px solid var(--border);text-transform:uppercase">Entrées</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;color:var(--text-3);border-bottom:1px solid var(--border);text-transform:uppercase">Sorties</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;color:var(--text-3);border-bottom:1px solid var(--border);text-transform:uppercase">Statut</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function printStockReport() {
  const {tFrom, tTo, label} = getReportPeriod();
  const _isGhostEntree = (n) => /^(?:Annulation|Retour brouillon|Suppression)\s+Bon\s/i.test(n||'') || /^Modif\s+Bon\s.*\(restauration\)/i.test(n||'');
  const _isBonSortie = (n) => /^(?:Modif\s+|Suppression\s+|Renvoi\s+)?Bon\s+\S+/i.test(n||'');
  const _validBonsInP = APP.bons.filter(b=>b.status==='valid\u00e9' && ((b._validatedAt||b.createdAt)>=tFrom && (b._validatedAt||b.createdAt)<=tTo));
  const _artMatch = (l,a) => l.articleId===a.id || l.code===a.code || (l.name||l.articleName)===a.name;
  const totalQte  = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alerts    = APP.articles.filter(a => a.stock <= a.stockMin);
  const sortiesP  = APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>=tFrom&&m.ts<=tTo&&!_isBonSortie(m.note)).reduce((s,m)=>s+m.qty,0)
                  + _validBonsInP.reduce((s,b)=>s+(b.lignes||[]).reduce((ss,l)=>ss+(parseInt(l.qty)||0),0),0);
  const entreesP  = APP.mouvements.filter(m=>m.type==='entree'&&m.ts>=tFrom&&m.ts<=tTo&&!_isGhostEntree(m.note)).reduce((s,m)=>s+m.qty,0);
  const bonsP     = APP.bons.filter(b=>b.createdAt>=tFrom&&b.createdAt<=tTo).length;
  const logo      = _safeCompanyLogo();
  const addr      = APP.settings.companyAddress || '';
  const tel       = APP.settings.companyTel || '';
  const fax       = APP.settings.companyFax || '';
  const email     = APP.settings.companyEmail || '';

  const movsP = APP.mouvements.filter(m=>m.ts>=tFrom&&m.ts<=tTo).slice().sort((a,b)=>b.ts-a.ts);

  const stockRows = APP.articles.map(a => {
    const sorties = APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo&&!_isBonSortie(m.note)).reduce((s,m)=>s+m.qty,0)
                  + _validBonsInP.reduce((s,b)=>s+(b.lignes||[]).filter(l=>_artMatch(l,a)).reduce((ss,l)=>ss+(parseInt(l.qty)||0),0),0);
    const entrees = APP.mouvements.filter(m=>m.type==='entree'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo&&!_isGhostEntree(m.note)).reduce((s,m)=>s+m.qty,0);
    const isAlert = a.stock <= a.stockMin;
    return `<tr style="${isAlert?'background:#fff5f5':''}">
      <td>${a.code}</td>
      <td style="font-weight:600">${a.name}</td>
      <td style="text-align:center;color:${isAlert?'#cc0000':'#007700'};font-weight:700">${a.stock}</td>
      <td style="text-align:center;color:#007700">+${entrees}</td>
      <td style="text-align:center;color:#cc4400">-${sorties}</td>
      <td style="text-align:center">${a.price ? a.price.toLocaleString('fr-FR')+' FCFA' : '—'}</td>
      <td style="text-align:center">${isAlert?'<span style="color:#cc0000;font-weight:700">⚠ ALERTE</span>':'<span style="color:#007700">✓ OK</span>'}</td>
    </tr>`;
  }).join('');

  const win = window.open('','_blank','width=1000,height=750');
  win.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
  <title>Rapport de Stock — ${label}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;padding:24px 32px;color:#111;background:#fff;font-size:12px}
    .header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #111}
    .header-logo{max-height:90px;max-width:220px;object-fit:contain;display:block;margin-bottom:8px}
    .header-info{font-size:11px;color:#444;line-height:1.7}
    .report-title{font-size:18px;font-weight:900;color:#111;border:2px solid #111;padding:8px 18px;display:inline-block;letter-spacing:.04em;margin-bottom:6px}
    .period-label{font-size:11px;color:#555;margin-top:4px}
    .print-date{font-size:10px;color:#888;margin-top:4px}
    .kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
    .kpi{border:1px solid #ddd;border-radius:6px;padding:12px;text-align:center;background:#fafafa}
    .kpi-val{font-size:24px;font-weight:900;color:#1a3a8b}
    .kpi-label{font-size:10px;color:#666;margin-top:3px;text-transform:uppercase;letter-spacing:.05em}
    .section-title{font-size:13px;font-weight:700;margin:16px 0 8px;padding:6px 10px;background:#f0f0f0;border-left:4px solid #1a3a8b;text-transform:uppercase;letter-spacing:.04em}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#1a3a8b;color:white;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.04em}
    td{padding:7px 10px;border-bottom:1px solid #eee;font-size:11px;vertical-align:middle}
    tr:nth-child(even) td{background:#f9f9f9}
    .footer{margin-top:24px;padding-top:12px;border-top:1px solid #ccc;display:flex;justify-content:space-between;font-size:10px;color:#888}
    @media print{@page{margin:10mm;size:A4} body{padding:0} .no-print{display:none}}
  </style></head><body>
  <div class="header">
    <div>
      ${logo ? `<img src="${logo}" class="header-logo" alt="Logo">` : ''}
      <div class="header-info">
        ${addr ? `<div>${addr}</div>` : ''}
        ${tel  ? `<div>Tél : <strong>${tel}</strong>${fax?' &nbsp;|&nbsp; Fax : <strong>'+fax+'</strong>':''}</div>` : ''}
        ${email? `<div>${email}</div>` : ''}
      </div>
    </div>
    <div style="text-align:right">
      <div class="report-title">RAPPORT DE STOCK</div>
      <div class="period-label">Période : <strong>${label}</strong></div>
      <div class="print-date">Imprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
    </div>
  </div>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-val">${totalQte.toLocaleString('fr-FR')}</div><div class="kpi-label">Stock total</div></div>
    <div class="kpi"><div class="kpi-val" style="color:${alerts.length>0?'#cc0000':'#007700'}">${alerts.length}</div><div class="kpi-label">Alertes stock</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#007700">+${entreesP.toLocaleString('fr-FR')}</div><div class="kpi-label">Entrées période</div></div>
    <div class="kpi"><div class="kpi-val" style="color:#cc4400">-${sortiesP.toLocaleString('fr-FR')}</div><div class="kpi-label">Sorties période</div></div>
    <div class="kpi"><div class="kpi-val">${bonsP}</div><div class="kpi-label">Bons émis</div></div>
  </div>
  <div class="section-title">État des stocks par gadget</div>
  <table>
    <thead><tr><th>Code</th><th>Désignation</th><th style="text-align:center">Stock actuel</th><th style="text-align:center">Entrées</th><th style="text-align:center">Sorties</th><th style="text-align:center">Prix unitaire</th><th style="text-align:center">Statut</th></tr></thead>
    <tbody>${stockRows}</tbody>
  </table>
  ${movsP.length > 0 ? `
  <div class="section-title">Mouvements sur la période (${movsP.length})</div>
  <table>
    <thead><tr><th>Date / Heure</th><th>Type</th><th>Article</th><th>Code</th><th style="text-align:center">Quantité</th><th>Commanditaire</th><th>Observation</th></tr></thead>
    <tbody>${movsP.slice(0,100).map(m=>{
      var art  = APP.articles.find(function(a){return a.id===m.articleId;});
      var dt   = new Date(m.ts);
      var isE  = m.type === 'entree';
      var fourn= m.fournisseurId ? APP.fournisseurs.find(function(f){return f.id===m.fournisseurId;}) : null;
      var who  = m.commercialId  ? APP.commerciaux.find(function(c){return c.id===m.commercialId;})   : null;
      var whoLabel;
      var _bm = /^(?:Modif |Suppression |Renvoi )?Bon\s+(\S+)/i.exec(m.note||'');
      if (_bm) {
        var _bon = APP.bons.find(function(b){return String(b.numero)===_bm[1];});
        if (_bon) whoLabel = '<div style="font-weight:600">'+(_bonLiveName(_bon)||'—')+'</div><div style="font-size:10px;color:#666">Dem: '+(_bon.demandeur||'—')+'</div>';
      }
      if (typeof whoLabel === 'undefined') {
        if (isE && fourn)         whoLabel = '🏭 '+fourn.nom;
        else if (!isE && who)     whoLabel = '👤 '+who.prenom+' '+who.nom;
        else if (m.userLogin)     whoLabel = '<span style="color:#666">👨‍💻 '+m.userLogin+'</span>';
        else                      whoLabel = '—';
      }
      var dateStr = dt.toLocaleDateString('fr-FR')+' '+dt.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
      return '<tr><td style="white-space:nowrap">'+dateStr+'</td><td style="color:'+(isE?'#007700':'#cc4400')+';font-weight:700">'+(isE?'ENTRÉE':'SORTIE')+'</td><td>'+(m.articleName||'—')+'</td><td style="font-family:monospace;font-size:10px;color:#555">'+(art?art.code:'—')+'</td><td style="text-align:center;font-weight:700">'+(isE?'+':'−')+m.qty+'</td><td>'+whoLabel+'</td><td style="color:#666;font-style:italic">'+(m.note||m.obs||'')+'</td></tr>';
    }).join('')}
    ${movsP.length>100?`<tr><td colspan="7" style="text-align:center;color:#888;font-style:italic">… ${movsP.length-100} mouvement(s) supplémentaire(s) non affichés</td></tr>`:''}
    </tbody>
  </table>` : ''}
  <div class="footer">
    <div>Document généré automatiquement — Perfect's Stock Manager</div>
    <div>${new Date().toLocaleDateString('fr-FR')}</div>
  </div>
  <script>window.onload=()=>{setTimeout(()=>window.print(),400)}<\/script>
  </body></html>`);
  win.document.close();
}

function refreshDashboard(showNotif) {
  const {tFrom, tTo, label} = getDashPeriod();
  const totalQte = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alerts = APP.articles.filter(a => a.stock <= a.stockMin);
  const t30 = tFrom;
  const bonsMonth = APP.bons.filter(b=>b.createdAt>=tFrom&&b.createdAt<=tTo).length;
  animateNumber(document.getElementById('kv-stock'), totalQte);
  const ae = document.getElementById('kv-alerts');
  if(ae) { ae.style.color = alerts.length>0?'var(--danger)':'var(--success)'; animateNumber(ae, alerts.length); }
  animateNumber(document.getElementById('kv-bons'), bonsMonth);
  const ss = document.getElementById('ks-stock'); if(ss) ss.textContent = APP.articles.length + ' gadgets référencés';
  // Redraw charts on every refresh so categories stay in sync
  drawChartCat(); drawChartMvt();
  const alertsEl = document.getElementById('dash-alerts');
  if(alertsEl) alertsEl.innerHTML = alerts.length === 0
    ? '<div class="empty-state"><p>✅ Aucune alerte de stock</p></div>'
    : alerts.map(a=>`<div class="stat-row"><div><div style="font-size:13px;font-weight:600">${a.name}</div><div style="font-size:11px;color:var(--text-2)">${a.code}</div></div><div class="text-right"><span class="badge badge-red">Stock: ${a.stock}</span><div style="font-size:11px;color:var(--text-2)">Min: ${a.stockMin}</div></div></div>`).join('');
  const actEl = document.getElementById('dash-activity');
  if(actEl) {
    const recent = [...APP.mouvements].sort((a,b)=>b.ts-a.ts).slice(0,8);
    actEl.innerHTML = recent.length === 0 ? '<div class="empty-state"><p>Aucune activité</p></div>'
      : recent.map(m => {
        const isE = m.type==='entree';
        const who = m.commercialId ? APP.commerciaux.find(c=>c.id===m.commercialId) : null;
        const fourn = m.fournisseurId ? APP.fournisseurs.find(f=>f.id===m.fournisseurId) : null;
        const whoLabel = who ? who.prenom+' '+who.nom : fourn ? fourn.nom : '';
        return `<div class="activity-item"><div class="activity-dot" style="background:${isE?'var(--success)':'var(--accent3)'}"></div><div style="flex:1"><div style="font-size:13px"><strong>${isE?'+':'-'}${m.qty}</strong> ${m.articleName}${whoLabel?' → '+whoLabel:''}</div><div class="activity-meta">${fmtDateTime(m.ts)}</div></div></div>`;
      }).join('');
  }
  const rss = document.getElementById('dash-refresh-status');
  if(rss) rss.textContent = 'Actualisé à ' + new Date().toLocaleTimeString('fr-FR');
  if(showNotif) notify('Tableau de bord actualisé','success');
  // Dispatch preview
  const dpv = document.getElementById('dash-dispatch-preview');
  if(dpv) {
    const activeArts = APP.articles.filter(a => a.stock > 0);
    const dispRules = APP.dispatch && APP.dispatch.rules ? APP.dispatch.rules : {};
    var _dh = APP.dispatch && APP.dispatch.history;
    var _dhArr = Array.isArray(_dh) ? _dh : (_dh && typeof _dh === 'object' ? Object.values(_dh) : []);
    const totalDispatched = _dhArr.reduce(function(s, h) { return s + ((Array.isArray(h.lignes)?h.lignes:Object.values(h.lignes||{})).reduce(function(s2,l){ return s2+(l.qty||0); }, 0)); }, 0);
    const activeRulesCount = Object.values(dispRules).filter(Boolean).length;
    dpv.innerHTML = [
      `<span class="chip">${APP.commerciaux.length} commerciaux</span>`,
      `<span class="chip">${(APP.zones||[]).length} zones</span>`,
      `<span class="chip">${activeArts.length} gadgets en stock</span>`,
      `<span class="chip" style="color:var(--accent)">${totalDispatched} unités distribuées</span>`,
      `<span class="chip" style="color:var(--text-2)">${activeRulesCount} règles actives</span>`,
    ].join('');
  }
}

function drawChartCat() {
  const canvas = document.getElementById('chartCat'); if(!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth || 300;
  const h = 180;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Resolve CSS variables to actual computed colors (canvas doesn't support CSS vars)
  const cs = getComputedStyle(document.documentElement);
  const bgCard   = cs.getPropertyValue('--bg-card').trim()  || '#161920';
  const textCol  = cs.getPropertyValue('--text-1').trim()   || '#b8bdd4';
  const emptyCol = cs.getPropertyValue('--text-2').trim()   || '#6b7280';
  const accent   = cs.getPropertyValue('--accent').trim()   || '#3d7fff';
  const accent2  = cs.getPropertyValue('--accent2').trim()  || '#00e5aa';
  const accent3  = cs.getPropertyValue('--accent3').trim()  || '#ff6b35';
  const warning  = cs.getPropertyValue('--warning').trim()  || '#ffa502';
  const danger   = cs.getPropertyValue('--danger').trim()   || '#ff4757';

  // Build stock map using getAllCategories() as source of truth
  const stockMap = {};
  APP.articles.forEach(a => {
    const cat = (a.category||'').trim();
    if(cat) stockMap[cat] = (stockMap[cat]||0) + (a.stock||0);
  });

  // Use getAllCategories() order — include any extra categories found in articles
  const allCats = getAllCategories ? getAllCategories() : Object.keys(stockMap);
  const extraCats = Object.keys(stockMap).filter(c => !allCats.includes(c));
  const orderedCats = [...allCats, ...extraCats];

  // Only display categories with stock > 0
  const activeLabels = orderedCats.filter(c => (stockMap[c]||0) > 0);
  const values = activeLabels.map(c => stockMap[c]||0);

  if(!activeLabels.length) {
    ctx.fillStyle = emptyCol;
    ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Aucun article en stock', w/2, 90);
    return;
  }

  // Theme-aware color palette
  const palette = [accent, accent2, accent3, warning, danger, '#9d4edd','#00c8ff','#f6c90e','#e040fb','#00bcd4'];

  const total = values.reduce((s,v)=>s+v,0)||1;
  let angle = -Math.PI/2;
  const cx = w/2, cy = 90, r = 70;

  activeLabels.forEach((l,i) => {
    const slice = (values[i]/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+slice);
    ctx.closePath(); ctx.fillStyle = palette[i%palette.length]; ctx.fill();
    angle += slice;
  });

  // Donut hole — use actual bg-card color
  ctx.beginPath(); ctx.arc(cx,cy,34,0,Math.PI*2);
  ctx.fillStyle = bgCard; ctx.fill();

  // Center: total stock
  ctx.fillStyle = textCol; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(total.toLocaleString('fr-FR'), cx, cy+1);
  ctx.fillStyle = emptyCol; ctx.font = '9px sans-serif';
  ctx.fillText('total', cx, cy+13);

  // Legend (max 8)
  const maxLg = Math.min(activeLabels.length, 8);
  let ly = 14;
  for(let i=0;i<maxLg;i++) {
    const lx = w - 92;
    ctx.fillStyle = palette[i%palette.length];
    ctx.beginPath(); ctx.arc(lx+5, ly-3, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = textCol; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    const lbl = activeLabels[i].length>13 ? activeLabels[i].slice(0,11)+'…' : activeLabels[i];
    ctx.fillText(lbl+' ('+values[i]+')', lx+13, ly+1);
    ly += 17;
  }
  if(activeLabels.length > maxLg) {
    ctx.fillStyle = emptyCol; ctx.font = '9px sans-serif';
    ctx.fillText('+'+( activeLabels.length-maxLg)+' autres', w-92, ly+1);
  }
}

function drawChartMvt() {
  var canvas = document.getElementById('chartMvt'); if(!canvas) return;
  var dpr = window.devicePixelRatio || 1;
  var w = canvas.offsetWidth || 300;
  var h = 200;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  // Determine period from date pickers or default to current month
  var fromEl = document.getElementById('chartMvt-from');
  var toEl = document.getElementById('chartMvt-to');
  var now = new Date();
  var startDate, endDate;
  if(fromEl && fromEl.value) {
    startDate = new Date(fromEl.value); startDate.setHours(0,0,0,0);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    if(fromEl) fromEl.value = startDate.toISOString().slice(0,10);
  }
  if(toEl && toEl.value) {
    endDate = new Date(toEl.value); endDate.setHours(23,59,59,999);
  } else {
    endDate = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59,999);
    if(toEl) toEl.value = endDate.toISOString().slice(0,10);
  }
  // Build daily data
  var days = [];
  var d = new Date(startDate);
  while(d <= endDate) {
    days.push(new Date(d));
    d.setDate(d.getDate()+1);
  }
  if(days.length === 0) return;
  if(days.length > 90) days = days.slice(0, 90); // cap at 90 days
  var entrees = [], sorties = [], labels = [];
  days.forEach(function(day) {
    var ds = day.getTime();
    var de = ds + 86400000;
    labels.push(day.getDate() + '/' + (day.getMonth()+1));
    entrees.push(APP.mouvements.filter(function(m){return m.type==='entree'&&m.ts>=ds&&m.ts<de}).reduce(function(x,m){return x+m.qty},0));
    sorties.push(APP.mouvements.filter(function(m){return m.type==='sortie'&&m.ts>=ds&&m.ts<de}).reduce(function(x,m){return x+m.qty},0));
  });
  var N = days.length;
  var W=w, H=h, padL=36, padB=30, padT=22, padR=10;
  var chartW=W-padL-padR, chartH=H-padB-padT;
  var maxVal=Math.max.apply(null, entrees.concat(sorties).concat([1]));
  var _cs = getComputedStyle(document.documentElement);
  var _text2 = _cs.getPropertyValue('--text-2').trim()||'#6b7280';
  var _text1 = _cs.getPropertyValue('--text-1').trim()||'#b8bdd4';
  var _border = _cs.getPropertyValue('--border').trim()||'rgba(37,42,56,0.6)';
  var _acc2 = _cs.getPropertyValue('--accent2').trim()||'#00e5aa';
  var _acc3 = _cs.getPropertyValue('--accent3').trim()||'#ff6b35';
  var _accent = _cs.getPropertyValue('--accent').trim()||'#3d7fff';
  // Grid lines
  ctx.strokeStyle = _border; ctx.lineWidth=0.5;
  for(var i=0;i<=4;i++){
    var y=padT+chartH-(i/4)*chartH;
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(W-padR,y); ctx.stroke();
    ctx.fillStyle=_text2; ctx.font='9px sans-serif'; ctx.textAlign='right';
    ctx.fillText(Math.round((i/4)*maxVal), padL-4, y+3);
  }
  // Draw lines (entrees = green, sorties = orange)
  function drawLine(data, color) {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    data.forEach(function(v, i) {
      var x = padL + (i/(N-1||1))*chartW;
      var y = padT + chartH - (v/maxVal)*chartH;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
    // Fill area under
    ctx.lineTo(padL+chartW, padT+chartH);
    ctx.lineTo(padL, padT+chartH);
    ctx.closePath();
    ctx.fillStyle = color.replace(')',',0.08)').replace('rgb','rgba');
    // For hex colors, use alpha
    if(color.charAt(0)==='#') { ctx.globalAlpha = 0.08; ctx.fillStyle = color; }
    ctx.fill();
    ctx.globalAlpha = 1;
    // Dots
    data.forEach(function(v, i) {
      if(v > 0) {
        var x = padL + (i/(N-1||1))*chartW;
        var y = padT + chartH - (v/maxVal)*chartH;
        ctx.beginPath(); ctx.arc(x,y,N>45?1.5:2.5,0,6.283); ctx.fillStyle=color; ctx.fill();
      }
    });
  }
  drawLine(entrees, _acc2);
  drawLine(sorties, _acc3);
  // X axis labels (show some, not all if too many)
  var step = N<=15?1:N<=31?2:N<=60?5:7;
  ctx.fillStyle=_text2; ctx.font='9px sans-serif'; ctx.textAlign='center';
  labels.forEach(function(l, i) {
    if(i%step===0 || i===N-1) {
      var x = padL + (i/(N-1||1))*chartW;
      ctx.fillText(l, x, H-5);
    }
  });
  // Highlight today
  var todayStr = now.getDate()+'/'+(now.getMonth()+1);
  var todayIdx = labels.indexOf(todayStr);
  if(todayIdx >= 0) {
    var tx = padL + (todayIdx/(N-1||1))*chartW;
    ctx.strokeStyle = _accent; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(tx, padT); ctx.lineTo(tx, padT+chartH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = _accent; ctx.font = 'bold 8px sans-serif';
    ctx.fillText('auj.', tx, padT-3);
  }
  // Legend
  ctx.fillStyle = _acc2; ctx.fillRect(padL, 4, 10, 3);
  ctx.fillStyle = _text1; ctx.font='10px sans-serif'; ctx.textAlign='left';
  ctx.fillText('Entrées', padL+14, 10);
  ctx.fillStyle = _acc3; ctx.fillRect(padL+64, 4, 10, 3);
  ctx.fillStyle = _text1; ctx.fillText('Sorties', padL+78, 10);
  // Period summary
  var totalE = entrees.reduce(function(a,b){return a+b},0);
  var totalS = sorties.reduce(function(a,b){return a+b},0);
  ctx.fillStyle = _text2; ctx.font='9px sans-serif'; ctx.textAlign='right';
  ctx.fillText('E:'+totalE+' | S:'+totalS, W-padR, 10);
}

// ============================================================
// ARTICLES (INLINE EDITING)
// ============================================================
let artSearch='', artCat='all', artStk='all';
function renderArticles() {
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">${t('articles')}</div>
    <div class="flex-center gap-8">
      <button class="btn btn-secondary btn-sm" onclick="renderBonsHistory()"><i class="fa-solid fa-clock-rotate-left"></i> Historique</button>
      <button class="btn btn-secondary btn-sm" onclick="renderStockPredictions()">📊 Suggestions</button>
      <button class="btn btn-primary" onclick="openArticleModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Ajouter</button>
    </div>
  </div>
  <div class="filters">
    <div class="search-bar" style="flex:1;max-width:300px">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Rechercher..." id="art-search" oninput="filterArticles()" value="${artSearch}">
    </div>
    <select id="art-cat" onchange="filterArticles()" style="width:auto">
      <option value="all">Toutes catégories</option>
      ${[...new Set(APP.articles.map(a=>a.category))].filter(Boolean).map(c=>`<option value="${c}" ${artCat===c?'selected':''}>${c}</option>`).join('')}
    </select>
    <select id="art-stk" onchange="filterArticles()" style="width:auto">
      <option value="all">Tout le stock</option>
      <option value="alert">En alerte</option>
      <option value="ok">Stock OK</option>
    </select>
    <button class="btn btn-secondary btn-sm" onclick="exportCSV()">📥 CSV</button>
    <button class="btn btn-primary btn-sm" onclick="openManualStockModal()">⚖️ Saisie manuelle</button>
  </div>
  <div style="font-size:11px;color:var(--text-2);margin-bottom:8px">💡 <strong>Double-cliquez</strong> sur une cellule pour la modifier directement</div>
  <div id="art-table"></div>`;
  filterArticles();
}

// Normalise une chaine pour recherche tolerante: minuscules, sans accents, separateurs -> espace, trim
function _normSearch(s) {
  return (s==null?'':String(s)).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[-_/\\.\s]+/g,' ')
    .trim();
}

function filterArticles() {
  artSearch=document.getElementById('art-search')?.value||'';
  artCat=document.getElementById('art-cat')?.value||'all';
  artStk=document.getElementById('art-stk')?.value||'all';
  const needle=_normSearch(artSearch);
  const arts=APP.articles.filter(a=>{
    let ms=!needle;
    if(!ms){
      const fourn=a.fournisseurId?APP.fournisseurs.find(f=>f.id===a.fournisseurId):null;
      const hay=_normSearch([a.name,a.code,a.category,a.description,a.colors,a.unit,fourn&&fourn.nom,fourn&&fourn.contact].filter(Boolean).join(' '));
      ms=hay.includes(needle);
    }
    const mc=artCat==='all'||a.category===artCat;
    const mk=artStk==='all'||(artStk==='alert'&&a.stock<=a.stockMin)||(artStk==='ok'&&a.stock>a.stockMin);
    return ms&&mc&&mk;
  });
  const sortMode = document.getElementById('art-sort')?.value || 'alpha';
  if(sortMode==='alpha') arts.sort((a,b)=>a.name.localeCompare(b.name,'fr'));
  else if(sortMode==='cat') arts.sort((a,b)=>((a.category||'').localeCompare(b.category||'','fr'))||a.name.localeCompare(b.name,'fr'));
  else if(sortMode==='stock-asc') arts.sort((a,b)=>a.stock-b.stock);
  else if(sortMode==='stock-desc') arts.sort((a,b)=>b.stock-a.stock);
  const w=document.getElementById('art-table'); if(!w) return;
  if(!arts.length){w.innerHTML='<div class="empty-state"><p>Aucun gadget trouvé</p></div>';return;}
  w.innerHTML=`<div class="table-wrap"><table>
    <thead><tr><th style="width:50px">${t('image')}</th><th>${t('code')}</th><th>${t('name')}</th><th>${t('category')}</th><th>${t('supplier')}</th><th>${t('contact')}</th><th>${t('current_stock')}</th><th>${t('stock_min')}</th><th>${t('unit')}</th><th>${t('price')}</th><th>${t('status')}</th><th>${t('actions')}</th></tr></thead>
    <tbody id="art-tbody">${arts.map(a=>renderArticleRow(a)).join('')}</tbody>
  </table></div>`;
  arts.forEach(a=>attachArticleEditors(a));
}

function renderArticleRow(a) {
  const isAlert=a.stock<=a.stockMin;
  const fourn=a.fournisseurId?APP.fournisseurs.find(f=>f.id===a.fournisseurId):null;
  return `<tr id="art-row-${a.id}">
    <td><div class="item-thumb" onclick="openArticleGallery('${a.id}')" style="cursor:pointer" title="Voir la galerie photo">${a.image?`<img src="${a.image}" alt="">`:'<span style="font-size:18px;opacity:0.25">📷</span>'}</div></td>
    <td><span class="font-mono">${a.code}</span></td>
    <td class="editable" id="td-name-${a.id}">${a.name}</td>
    <td class="editable" id="td-cat-${a.id}">${a.category}</td>
    <td style="font-size:12px;color:var(--accent)">${fourn?fourn.nom:'—'}</td>
    <td style="font-size:12px">${fourn?(fourn.contact||fourn.tel||'—'):'—'}</td>
    <td class="editable" id="td-stock-${a.id}" style="font-weight:700;color:${isAlert?'var(--danger)':a.stock<a.stockMin*2?'var(--warning)':'var(--success)'}">${a.stock}</td>
    <td class="editable" id="td-min-${a.id}">${a.stockMin}</td>
    <td class="editable" id="td-unit-${a.id}">${a.unit||'pcs'}</td>
    <td class="editable" id="td-price-${a.id}">${fmtCurrency(a.price)}</td>
    <td>${isAlert?'<span class="badge badge-red">⚠ Alerte</span>':'<span class="badge badge-green">✓ OK</span>'}</td>
    <td><div style="display:flex;gap:6px">
      <button class="btn btn-sm btn-secondary" onclick="openMvtModal('${a.id}')">📦</button>
      <button class="btn btn-sm btn-secondary" onclick="openArticleHistory('${a.id}')" title="Historique">📜</button>
      <button class="btn btn-sm btn-secondary" onclick="openArticleModal('${a.id}')">✏️</button>
      <button class="btn btn-sm btn-danger" onclick="deleteArticle('${a.id}')">🗑</button>
    </div></td>
  </tr>`;
}

function attachArticleEditors(a) {
  const cats=[...new Set(APP.articles.map(x=>x.category).filter(Boolean))];
  const fields=[{id:'td-name-'+a.id,key:'name',type:'text'},{id:'td-cat-'+a.id,key:'category',type:'select',options:cats.length?cats:['Goodies','PDR','Matériel','Autres']},{id:'td-stock-'+a.id,key:'stock',type:'number'},{id:'td-min-'+a.id,key:'stockMin',type:'number'},{id:'td-unit-'+a.id,key:'unit',type:'text'},{id:'td-price-'+a.id,key:'price',type:'number'}];
  fields.forEach(f=>{
    const td=document.getElementById(f.id); if(!td) return;
    td.ondblclick=()=>{
      const oldVal=a[f.key];
      makeEditable(td,f.key==='price'?a.price:a[f.key],f.type,f.options,(newVal)=>{
        const old={...a};
        if(f.key==='stock'||f.key==='stockMin'||f.key==='price') a[f.key]=parseFloat(newVal)||0;
        else a[f.key]=newVal;
        auditLog('EDIT','article',a.id,{[f.key]:oldVal},{[f.key]:a[f.key]});
        saveDB(); updateAlertBadge();
        // Re-render entire articles page to guarantee visual refresh
        if(currentPage==='articles') renderArticles();
        else filterArticles();
      });
    };
  });
}

function openArticleModal(id) {
  const a=id?APP.articles.find(x=>x.id===id):null;
  const allCats=[...new Set([...getAllCategories(),...APP.articles.map(x=>x.category).filter(Boolean)])];
  const body=`
  <div class="form-row">
    <div class="form-group"><label>Nom *</label><input id="f-name" value="${a?.name||''}"></div>
    <div class="form-group"><label>Code</label><input id="f-code" value="${a?.code||'ART-'+String(APP.articles.length+1).padStart(3,'0')}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Catégorie</label><select id="f-cat">${allCats.map(c=>`<option ${a?.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>Unité</label><input id="f-unit" value="${a?.unit||'pcs'}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Fournisseur</label><select id="f-fournisseur"><option value="">— Aucun —</option>${(APP.fournisseurs||[]).map(f=>`<option value="${f.id}" ${a?.fournisseurId===f.id?'selected':''}>${f.nom}</option>`).join('')}</select></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Stock actuel</label><input id="f-stock" type="number" value="${a?.stock||0}"></div>
    <div class="form-group"><label>Stock minimum</label><input id="f-min" type="number" value="${a?.stockMin||10}"></div>
  </div>
  <div class="form-group"><label>Prix unitaire</label><input id="f-price" type="number" value="${a?.price||0}"></div>
  <div class="form-group"><label>Description</label><textarea id="f-desc">${a?.description||''}</textarea></div>
  <div class="form-group">
    <label>🖼 Illustration de l'article</label>
    <div style="display:flex;gap:12px;align-items:center">
      <div class="field-img" id="art-img-box" onclick="document.getElementById('f-img-file').click()" style="width:80px;height:80px;border-radius:var(--radius);cursor:pointer" title="Cliquer pour ajouter une image">
        ${a?.image?`<img src="${a.image}" id="art-img-preview" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius)">`:'<span style="font-size:28px;opacity:0.3">📷</span>'}
      </div>
      <input type="file" id="f-img-file" accept="image/*" style="display:none" onchange="previewArticleImg(this)">
      <input type="hidden" id="f-img-data" value="${a?.image||''}">
      <div style="font-size:12px;color:var(--text-2)">Cliquez pour ajouter/changer l'image<br><span style="font-size:11px;color:var(--text-3)">Max 3MB · JPG, PNG, WebP</span></div>
    </div>
  </div>`;
  openModal('art',id?'Modifier article':'Nouvel article',body,()=>{
    const name=document.getElementById('f-name').value.trim();
    if(!name){notify('Nom requis','danger');return;}
    const imgData = document.getElementById('f-img-data')?.value||'';
    if(a){
      const old={...a};
      Object.assign(a,{name,code:document.getElementById('f-code').value,category:document.getElementById('f-cat').value,unit:document.getElementById('f-unit').value, fournisseurId:document.getElementById('f-fournisseur')?.value||null,stock:parseFloat(document.getElementById('f-stock').value)||0,stockMin:parseFloat(document.getElementById('f-min').value)||0,price:parseFloat(document.getElementById('f-price').value)||0,description:document.getElementById('f-desc').value,image:imgData||a.image||''});
      auditLog('EDIT','article',a.id,old,a);
    } else {
      const newA={id:generateId(),name,code:document.getElementById('f-code').value,category:document.getElementById('f-cat').value,unit:document.getElementById('f-unit').value,fournisseurId:document.getElementById('f-fournisseur')?.value||null,stock:parseFloat(document.getElementById('f-stock').value)||0,stockMin:parseFloat(document.getElementById('f-min').value)||0,price:parseFloat(document.getElementById('f-price').value)||0,description:document.getElementById('f-desc').value,image:imgData,createdAt:Date.now(),_version:1,_versions:[]};
      APP.articles.push(newA); auditLog('CREATE','article',newA.id,null,newA);
    }
    saveDB(); closeModal(); filterArticles(); updateAlertBadge();
    notify(id?'Gadget modifié ✓':'Gadget créé ✓','success');
  },'modal-lg');
  if(a) setTimeout(()=>{document.getElementById('f-cat').value=a.category;},10);
}

function previewArticleImg(input) {
  const file = input.files[0]; if(!file) return;
  if(file.size > 3*1024*1024) { notify('Image trop grande (max 3MB)','error'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('f-img-data').value = e.target.result;
    const box = document.getElementById('art-img-box');
    if(box) box.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius)">`;
    notify('Image prête — enregistrez pour valider','info');
  };
  reader.readAsDataURL(file);
  input.value='';
}

function deleteArticle(id) {
  // Refuse deletion if article is referenced by any bon
  var refBons = (APP.bons||[]).filter(function(b){
    return (b.lignes||[]).some(function(l){ return l.articleId === id; });
  });
  if (refBons.length > 0) {
    var nums = refBons.slice(0,5).map(function(b){ return b.numero || b.id; }).join(', ');
    var more = refBons.length > 5 ? ' (+' + (refBons.length-5) + ')' : '';
    notify('Impossible : ce gadget est référencé par ' + refBons.length + ' bon(s) : ' + nums + more, 'error');
    return;
  }
  if(!confirm('Supprimer ce gadget ?')) return;
  const idx=APP.articles.findIndex(a=>a.id===id); if(idx<0) return;
  auditLog('DELETE','article',id,APP.articles[idx],null);
  APP.articles.splice(idx,1);
  saveDB(); filterArticles(); updateAlertBadge();
  notify('Gadget supprimé','success');
}


// ─── Manual stock entry ──────────────────────────────────────────────────
let _manualStockArticleId = null;

function openManualStockModal(articleId) {
  _manualStockArticleId = articleId || null;
  const artOptions = APP.articles.map(a =>
    `<option value="${a.id}" ${articleId===a.id?'selected':''}>${a.name} (stock: ${a.stock})</option>`
  ).join('');

  openModal('Saisie manuelle de stock', `
    <div class="form-group">
      <label>Type de saisie</label>
      <select id="ms-type" onchange="updateManualStockUI()">
        <option value="initial">Stock initial / Réinitialisation (écrase le stock actuel)</option>
        <option value="ajout">Ajout (entrée positive)</option>
        <option value="retrait">Retrait (sortie manuelle)</option>
      </select>
    </div>
    <div class="form-group">
      <label>Gadget *</label>
      <select id="ms-article">${artOptions}</select>
    </div>
    <div class="form-group" id="ms-qty-wrap">
      <label id="ms-qty-label">Quantité *</label>
      <input type="number" id="ms-qty" min="0" value="0" style="width:120px">
    </div>
    <div class="form-group">
      <label>Motif / Observation</label>
      <input id="ms-note" placeholder="ex: Inventaire du 11/03/2026, Correction casse...">
    </div>
    <div id="ms-preview" style="background:var(--bg-1);border-radius:6px;padding:10px;font-size:13px;margin-top:8px;display:none"></div>
  `, [
    { label: 'Annuler', cls: 'btn-secondary', onclick: 'closeModal()' },
    { label: '✓ Valider', cls: 'btn-primary',   onclick: 'saveManualStock()' }
  ]);
  updateManualStockUI();
  document.getElementById('ms-article').addEventListener('change', updateManualStockUI);
  document.getElementById('ms-qty').addEventListener('input', updateManualStockUI);
}

function updateManualStockUI() {
  const type = document.getElementById('ms-type')?.value;
  const artId = document.getElementById('ms-article')?.value;
  const art = APP.articles.find(a => a.id === artId);
  const qty = parseInt(document.getElementById('ms-qty')?.value) || 0;
  const lbl = document.getElementById('ms-qty-label');
  const prev = document.getElementById('ms-preview');
  if(lbl) {
    lbl.textContent = type === 'initial' ? 'Nouveau stock total *'
                    : type === 'ajout'   ? 'Quantité à ajouter *'
                    :                      'Quantité à retirer *';
  }
  if(art && prev) {
    let newStock, icon, color;
    if(type === 'initial') { newStock = qty; icon = '🔄'; color = 'var(--accent)'; }
    else if(type === 'ajout') { newStock = art.stock + qty; icon = '⬆️'; color = 'var(--success)'; }
    else { newStock = Math.max(0, art.stock - qty); icon = '⬇️'; color = 'var(--warning)'; }
    prev.style.display = 'block';
    prev.innerHTML = `${icon} <strong>${art.name}</strong> : ${art.stock} → <strong style="color:${color}">${newStock}</strong>`;
  }
}

function saveManualStock() {
  const type  = document.getElementById('ms-type')?.value;
  const artId = document.getElementById('ms-article')?.value;
  const qty   = parseInt(document.getElementById('ms-qty')?.value) || 0;
  const note  = document.getElementById('ms-note')?.value || '';
  const art   = APP.articles.find(a => a.id === artId);
  if(!art) { notify('Sélectionnez un gadget', 'warning'); return; }
  if(qty < 0) { notify('Quantité invalide', 'warning'); return; }

  const oldStock = art.stock;
  let delta = 0, mvtType = 'entree';

  if(type === 'initial') {
    delta    = qty - art.stock;
    art.stock = qty;
    mvtType  = delta >= 0 ? 'entree' : 'sortie';
  } else if(type === 'ajout') {
    delta    = qty;
    art.stock += qty;
    mvtType  = 'entree';
  } else {
    delta    = -Math.min(qty, art.stock);
    art.stock = Math.max(0, art.stock - qty);
    mvtType  = 'sortie';
  }

  const mvtNote = (type === 'initial' ? '[Stock initial] ' : type === 'ajout' ? '[Ajout manuel] ' : '[Retrait manuel] ') + note;
  APP.mouvements.unshift({
    id: generateId(), type: mvtType, ts: Date.now(),
    articleId: art.id, articleName: art.name,
    qty: Math.abs(delta), note: mvtNote, commercialId: '',
    stockBefore: oldStock, stockAfter: art.stock
  });
  auditLog(type === 'initial' ? 'STOCK_INIT' : mvtType === 'entree' ? 'STOCK_ENTREE' : 'STOCK_SORTIE',
    'article', art.id, { stock: oldStock }, { stock: art.stock, note: mvtNote });

  saveDB();
  closeModal();
  notify(`✅ Stock mis à jour : ${art.name} → ${art.stock}`, 'success');
  filterArticles();
  updateAlertBadge();
}

function exportCSV() {
  const rows=[['Code','Nom','Catégorie','Stock','Stock Min','Unité','Prix']];
  APP.articles.forEach(a=>rows.push([a.code,a.name,a.category,a.stock,a.stockMin,a.unit||'pcs',a.price]));
  downloadFile(rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n'),'gadgets.csv','text/csv');
  notify('Export CSV téléchargé','success');
}

// ============================================================
// MOUVEMENT MODAL (depuis article)
// ============================================================
function openMvtModal(artId) {
  const art=APP.articles.find(a=>a.id===artId); if(!art) return;
  const body=`
  <div class="form-group"><label>Article</label><input value="${art.name}" disabled></div>
  <div class="form-row">
    <div class="form-group"><label>Type</label><select id="m-type"><option value="sortie">Sortie</option><option value="entree">Entrée</option></select></div>
    <div class="form-group"><label>Quantité</label><input id="m-qty" type="number" value="1" min="1"></div>
  </div>
  <div class="form-group"><label>Commercial</label><select id="m-com"><option value="">— Aucun —</option>${APP.commerciaux.map(c=>`<option value="${c.id}">${c.prenom} ${c.nom}</option>`).join('')}</select></div>
  <div class="form-group"><label>Note</label><textarea id="m-note" style="min-height:60px"></textarea></div>
  <p style="font-size:12px;color:var(--text-2)">Stock actuel: <strong>${art.stock} ${art.unit||'pcs'}</strong></p>`;
  openModal('mvt',`Mouvement — ${art.name}`,body,()=>{
    const type=document.getElementById('m-type').value;
    const qty=parseInt(document.getElementById('m-qty').value)||1;
    const comId=document.getElementById('m-com').value;
    if(type==='sortie'&&qty>art.stock){notify('Stock insuffisant','danger');return;}
    var _sbefore = art.stock;
    if(type==='sortie') art.stock-=qty; else art.stock+=qty;
    const mvt={id:generateId(),type,articleId:art.id,articleName:art.name,qty,ts:Date.now(),commercialId:comId||null,note:document.getElementById('m-note').value,stockBefore:_sbefore,stockAfter:art.stock};
    APP.mouvements.push(mvt);
    auditLog(type,'article',art.id,{stock:_sbefore},{stock:art.stock});
    saveDB(); closeModal(); filterArticles(); updateAlertBadge();
    notify(`${type==='sortie'?'Sortie':'Entrée'} enregistrée`,'success');
  });
}

// ============================================================
// BONS DE SORTIE
// ============================================================
function renderBonPipeline() {
  const counts = {};
  BON_STATUSES.forEach(s => { counts[s.key] = APP.bons.filter(b => (b.status||'brouillon') === s.key).length; });
  const total = APP.bons.length;
  const btn = (label, active, onclick) =>
    `<button onclick="${onclick}" style="padding:5px 14px;border-radius:99px;border:1px solid var(--border);cursor:pointer;font-size:12px;font-weight:600;background:${active?'var(--accent)':'var(--bg-2)'};color:${active?'#fff':'var(--text-1)'};">${label}</button>`;
  return `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
    ${btn('Tous (' + total + ')', !_bonStatusFilter, '_bonStatusFilter=null;renderBons()')}
    ${BON_STATUSES.map(s => btn(s.icon + ' ' + s.label + ' (' + (counts[s.key]||0) + ')', _bonStatusFilter===s.key, "_bonStatusFilter='" + s.key + "';renderBons()")).join('')}
  </div>`;
}

function renderStockPredictions() {
  const predictions = (typeof predictShortages === 'function') ? predictShortages() : [];
  if(!predictions.length) { notify('Aucune rupture de stock prévue sous 30 jours ✅', 'success'); return; }
  const rows = predictions.slice(0,10).map(p =>
    `<div class="stat-row"><div><div style="font-size:13px;font-weight:600">${p.article.name}</div><div style="font-size:11px;color:var(--text-2)">${p.dailyRate}/jour — Stock: ${p.article.stock}</div></div><div><span class="badge ${p.urgency==='critical'?'badge-red':p.urgency==='high'?'badge-orange':'badge-yellow'}">${p.daysLeft===0?'Rupture!':p.daysLeft+' j'}</span></div></div>`
  ).join('');
  openModal('modal-predictions', '📊 Prévisions de rupture', `<div style="max-height:400px;overflow-y:auto">${rows}</div>`);
}
function renderBonsHistory() {
  var validatedBons = APP.bons.filter(function(b) {
    return b.status === 'valid\u00e9' || b.status === 'annul\u00e9';
  }).sort(function(a, b) { return (b._validatedAt || b._cancelledAt || b.createdAt || 0) - (a._validatedAt || a._cancelledAt || a.createdAt || 0); });

  var filterHtml = '<div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;flex-wrap:wrap">'
    + '<button class="btn btn-sm" onclick="renderBons()" style="font-weight:600"><i class="fa-solid fa-arrow-left" style="margin-right:4px"></i>Retour</button>'
    + '<button class="btn btn-sm btn-secondary" onclick="openArchivesModal(\'bons\')" title="Consulter les bons archiv\u00e9s"><i class="fa-solid fa-box-archive" style="margin-right:4px"></i>Archives</button>'
    + '<span style="font-size:0.85rem;color:var(--text-2);margin-left:8px">' + validatedBons.length + ' bon(s) valid\u00e9s/annul\u00e9s</span>'
    + '<label style="font-size:0.82rem;color:var(--text-2);margin-left:auto">Du <input type="date" id="bh-from" style="padding:4px;border-radius:4px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-1);margin-left:4px"></label>'
    + '<label style="font-size:0.82rem;color:var(--text-2)">Au <input type="date" id="bh-to" style="padding:4px;border-radius:4px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-1);margin-left:4px"></label>'
    + '<button class="btn btn-sm" onclick="_filterBonsHistory()"><i class="fa-solid fa-filter"></i></button>'
    + '</div>';
  document.getElementById('content').innerHTML = '<div class="flex-between mb-16">'
    + '<div class="page-title"><i class="fa-solid fa-clock-rotate-left" style="margin-right:8px"></i>Historique des Bons</div></div>'
    + filterHtml
    + '<div id="bh-list">' + _buildBonsHistoryRows(validatedBons) + '</div>';
}

function _buildBonsHistoryRows(list) {
  if (list.length === 0) return '<div class="card" style="padding:32px;text-align:center;color:var(--text-2)"><i class="fa-solid fa-inbox" style="font-size:2rem;margin-bottom:12px;display:block"></i>Aucun bon valid\u00e9 ou annul\u00e9</div>';
  var html = '';
  list.forEach(function(b) {
    var isValid = b.status === 'valid\u00e9';
    var actionDate = isValid ? b._validatedAt : b._cancelledAt;
    var gadgets = (b.lignes || []).map(function(l) { return l.qty + '\u00d7 ' + (l.name || l.articleName || ''); }).join(', ');
    var statusBadge = isValid
      ? '<span class="badge badge-green">\u2713 Valid\u00e9</span>'
      : '<span class="badge badge-red">\u2717 Annul\u00e9</span>';
    html += '<div class="card" style="margin-bottom:8px;padding:12px 16px;border-left:4px solid ' + (isValid ? 'var(--success,#28a745)' : 'var(--danger,#dc3545)') + '">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
      + '<div style="display:flex;align-items:center;gap:10px">'
      + '<span style="font-family:monospace;font-weight:700;font-size:0.95rem;color:var(--accent)">' + b.numero + '</span>'
      + statusBadge + '</div>'
      + '<div style="display:flex;gap:6px;align-items:center">'
      + '<button class="btn btn-sm btn-secondary" onclick="previewBon(\'' + b.id + '\')" title="Aper\u00e7u"><i class="fa-solid fa-eye"></i></button>'
      + '<button class="btn btn-sm btn-secondary" onclick="printBon(\'' + b.id + '\')" title="Imprimer"><i class="fa-solid fa-print"></i></button>'
      + '<button class="btn btn-sm btn-secondary" onclick="exportBonPDF(\'' + b.id + '\')" title="PDF"><i class="fa-solid fa-file-pdf"></i></button>'
      + '</div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;font-size:0.82rem;color:var(--text-2)">'
      + '<div><strong>Demandeur:</strong> ' + (b.demandeur || '\u2014') + '</div>'
      + '<div><strong>Destinataire:</strong> ' + (_bonLiveName(b) || '\u2014') + '</div>'
      + '<div><strong>Objet:</strong> ' + (b.objet || '\u2014') + '</div>'
      + '<div><strong>Date bon:</strong> ' + (b.date || fmtDate(b.createdAt)) + '</div>'
      + '</div>'
      + '<div style="margin-top:6px;font-size:0.8rem;color:var(--text-1)"><strong>Gadgets:</strong> ' + (gadgets || 'Aucun') + '</div>'
      + (actionDate ? '<div style="margin-top:4px;font-size:0.72rem;color:var(--text-2)">' + (isValid ? 'Valid\u00e9' : 'Annul\u00e9') + ' le ' + new Date(actionDate).toLocaleString('fr-FR') + (isValid && b._validatedByName ? ' par <strong>' + b._validatedByName + '</strong>' : (!isValid && b._cancelledByName ? ' par <strong>' + b._cancelledByName + '</strong>' : '')) + '</div>' : '')
      + ((b._printHistory && b._printHistory.length) ? '<div style="margin-top:2px;font-size:0.72rem;color:var(--text-2)">\ud83d\udda8 Imprim\u00e9 ' + b._printHistory.length + '\u00d7 \u2014 derni\u00e8re le ' + new Date(b._printHistory[b._printHistory.length-1].ts).toLocaleString('fr-FR') + ' par ' + (b._printHistory[b._printHistory.length-1].byName || '?') + '</div>' : '')
      + '</div>';
  });
  return html;
}

function _filterBonsHistory() {
  var from = document.getElementById('bh-from');
  var to = document.getElementById('bh-to');
  var fromTs = from && from.value ? new Date(from.value).getTime() : 0;
  var toTs = to && to.value ? new Date(to.value + 'T23:59:59').getTime() : Infinity;
  var filtered = APP.bons.filter(function(b) {
    if (b.status !== 'valid\u00e9' && b.status !== 'annul\u00e9') return false;
    var ts = b._validatedAt || b._cancelledAt || b.createdAt || 0;
    return ts >= fromTs && ts <= toTs;
  }).sort(function(a, b) { return (b._validatedAt || b._cancelledAt || b.createdAt || 0) - (a._validatedAt || a._cancelledAt || a.createdAt || 0); });
  var el = document.getElementById('bh-list');
  if (el) el.innerHTML = _buildBonsHistoryRows(filtered);
}

function renderBons() {
  const _bStartOfDay = new Date(); _bStartOfDay.setHours(0,0,0,0);
  const _bDayMs = _bStartOfDay.getTime();
  let filtered;
  if(_bonStatusFilter) {
    filtered = APP.bons.filter(b => (b.status||'brouillon') === _bonStatusFilter);
  } else if(_bonShowAll) {
    filtered = APP.bons;
  } else {
    filtered = APP.bons.filter(b => {
      var s = b.status || 'brouillon';
      if(s === 'brouillon') return true;
      var ts = b._validatedAt || b._cancelledAt || b.createdAt || 0;
      return ts >= _bDayMs;
    });
  }
  const _hiddenCount = APP.bons.length - filtered.length;
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">${t('bons')}</div>
    <div class="flex-center gap-8">
      <button class="btn btn-secondary btn-sm" onclick="renderBonsHistory()">📚 Historique</button>
      <button class="btn btn-secondary btn-sm" onclick="openVerifyCodeModal()">🔐 Vérifier</button>
      <button class="btn btn-secondary btn-sm" onclick="renderStockPredictions()">📊 Réappro</button>
      <button class="btn btn-secondary btn-sm" onclick="exportBonsJSON()">📥 Export</button>
      <button class="btn btn-primary" onclick="openBonModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Nouveau bon</button>
    </div>
  </div>
  ${renderBonPipeline()}
  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;color:var(--text-2);margin-bottom:12px;flex-wrap:wrap">
    <div>💡 <strong>Double-cliquez</strong> sur Statut pour modifier</div>
    ${(!_bonStatusFilter && !_bonShowAll && _hiddenCount > 0) ? `<div style="display:flex;align-items:center;gap:8px"><span style="font-style:italic">${_hiddenCount} bon(s) plus ancien(s) masqué(s)</span><button class="btn btn-sm btn-secondary" onclick="_bonShowAll=true;renderBons()">👁 Tout afficher</button></div>` : ''}
    ${(_bonShowAll && !_bonStatusFilter) ? `<button class="btn btn-sm btn-secondary" onclick="_bonShowAll=false;renderBons()">🎯 Vue active uniquement</button>` : ''}
  </div>
  <div class="table-wrap"><table>
    <thead><tr><th>${t('bon_number')}</th><th>${t('recipient')}</th><th>${t('gadgets')}</th><th>${t('date')}</th><th>${t('status')}</th><th>${t('actions')}</th></tr></thead>
    <tbody>${filtered.length===0?`<tr><td colspan="6"><div class="empty-state"><p>Aucun bon de sortie</p></div></td></tr>`:filtered.slice().sort((a,b)=>b.createdAt-a.createdAt).map(b=>renderBonRow(b)).join('')}</tbody>
  </table></div>`;
  filtered.forEach(b=>attachBonEditors(b));
}

function renderBonRow(b) {
  const statusColor=(BON_STATUSES.find(s=>s.key===(b.status||'brouillon'))?.color)||'badge-yellow';
  const _isAdmin = _currentUser() && _currentUser().role === 'admin';
  const _bonLocked = b.status === 'validé' && !_isAdmin;
  return `<tr id="bon-row-${b.id}">
    <td style="font-family:monospace;font-weight:700;color:var(--accent)">${b.numero}</td>
    <td style="font-size:13px" title="Demandeur: ${b.demandeur||'—'}">${_bonLiveName(b)||'—'}<div style="font-size:10px;color:var(--text-2)">Dem: ${b.demandeur||'—'}</div></td>
    <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${(b.lignes||[]).map(l=>`${l.qty}× ${l.name||l.articleName}`).join(', ')}</td>
    <td style="font-size:12px;color:var(--text-2)">${fmtDate(b.createdAt)}</td>
    <td class="${_bonLocked?'':'editable'}" id="td-bstat-${b.id}" ${_bonLocked?'title="Bon validé — modification réservée à l\'admin" style="cursor:not-allowed;opacity:0.85"':''}><span class="badge ${statusColor}">${(BON_STATUSES.find(s=>s.key===(b.status||'brouillon'))?.icon||'')+' '+(b.status||'brouillon')}</span></td>
    <td><div style="display:flex;gap:4px">
      ${(b.status||'brouillon')==='brouillon'?`<button class="btn btn-sm btn-success" onclick="validateBon('${b.id}')" title="Valider et prélever le stock">✓ Valider</button><button class="btn btn-sm btn-warning" onclick="cancelBon('${b.id}')" title="Annuler ce bon">✕</button>`:(b.status==='validé'?(_isAdmin?`<button class="btn btn-sm btn-warning" onclick="cancelBon('${b.id}')" title="Annuler ce bon">✕ Annuler</button>`:''):`<button class="btn btn-sm btn-success" onclick="reactivateBon('${b.id}')" title="Réactiver ce bon">↻ Réactiver</button>`)}
      <button class="btn btn-sm btn-secondary" onclick="previewBon('${b.id}')">👁</button>
      <button class="btn btn-sm btn-secondary" onclick="printBon('${b.id}')">🖨</button>
      <button class="btn btn-sm btn-secondary" onclick="exportBonPDF('${b.id}')" title="PDF">📥</button>
      ${_bonLocked?'':`<button class="btn btn-sm btn-secondary" onclick="openBonModal('${b.id}')">✏️</button>`}
      ${_bonLocked?'':`<button class="btn btn-sm btn-danger" onclick="deleteBon('${b.id}')">🗑</button>`}
    </div></td>
  </tr>`;
}

function _setBonStatusTimestamp(b, newStatus) {
  if (newStatus === 'validé') { b._validatedAt = Date.now(); _snapshotValidator(b); }
  if (newStatus === 'annulé') { b._cancelledAt = Date.now(); _snapshotCanceller(b); }
}

function _computeAvailableForBon(articleId, excludeBonId) {
  var art = APP.articles.find(function(a){ return a.id === articleId; });
  if (!art) return 0;
  var avail = parseInt(art.stock) || 0;
  // re-add the qty engaged by the bon being edited if it was already validated
  if (excludeBonId) {
    var bx = (APP.bons||[]).find(function(b){ return b.id === excludeBonId; });
    if (bx && bx.status === 'validé') {
      (bx.lignes||[]).forEach(function(l){
        if (l.articleId === articleId) avail += (parseInt(l.qty)||0);
      });
    }
  }
  // subtract qty already engaged in OTHER non-annulé bons (brouillon + validé)
  // validé bons already deducted from art.stock, so only count brouillons here
  (APP.bons||[]).forEach(function(b){
    if (b.id === excludeBonId) return;
    if ((b.status||'brouillon') !== 'brouillon') return;
    (b.lignes||[]).forEach(function(l){
      if (l.articleId === articleId) avail -= (parseInt(l.qty)||0);
    });
  });
  return avail;
}

function _handleBonStatusStockChange(b, oldStatus, newStatus) {
  // brouillon → validé : deduct stock
  if(oldStatus === 'brouillon' && newStatus === 'validé') {
    for(const l of (b.lignes||[])) {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > art.stock) { notify('Stock insuffisant pour ' + (l.name||'') + ' (Dispo: ' + art.stock + ')','error'); return false; }
    }
    (b.lignes || []).forEach(l => {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > 0) {
        var _sb = art.stock;
        art.stock -= l.qty;
        APP.mouvements.unshift({
          id: generateId(), type: 'sortie', ts: Date.now(),
          articleId: art.id, articleName: art.name, qty: l.qty,
          note: 'Bon ' + (b.numero||'') + ' → ' + (b.recipiendaire||''), commercialId: b.commercialId||'',
          stockBefore: _sb, stockAfter: art.stock
        });
      }
    });
  }
  // validé → brouillon : restore stock (bon revient à l'état non engagé)
  if(oldStatus === 'validé' && newStatus === 'brouillon') {
    (b.lignes || []).forEach(l => {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > 0) {
        var _sb = art.stock;
        art.stock += l.qty;
        APP.mouvements.unshift({
          id: generateId(), type: 'entree', ts: Date.now(),
          articleId: art.id, articleName: art.name, qty: l.qty,
          note: 'Retour brouillon Bon ' + (b.numero||''), commercialId: b.commercialId||'',
          stockBefore: _sb, stockAfter: art.stock
        });
      }
    });
  }
  // When status changes TO annulé → restore stock (only if was validated)
  if(newStatus === 'annulé' && oldStatus !== 'annulé' && oldStatus !== 'brouillon') {
    (b.lignes || []).forEach(l => {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > 0) {
        var _sb = art.stock;
        art.stock += l.qty;
        APP.mouvements.unshift({
          id: generateId(), type: 'entree', ts: Date.now(),
          articleId: art.id, articleName: art.name, qty: l.qty,
          note: 'Annulation Bon ' + (b.numero||''), commercialId: b.commercialId||'',
          stockBefore: _sb, stockAfter: art.stock
        });
      }
    });
  }
  // When status changes FROM annulé to validé → deduct stock again
  if(oldStatus === 'annulé' && newStatus === 'validé') {
    for(const l of (b.lignes||[])) {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > art.stock) { notify('Stock insuffisant pour ' + (l.name||'') + ' (Dispo: ' + art.stock + ')','error'); return false; }
    }
    (b.lignes || []).forEach(l => {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > 0) {
        var _sb = art.stock;
        art.stock -= l.qty;
        APP.mouvements.unshift({
          id: generateId(), type: 'sortie', ts: Date.now(),
          articleId: art.id, articleName: art.name, qty: l.qty,
          note: 'Réactivation Bon ' + (b.numero||''), commercialId: b.commercialId||'',
          stockBefore: _sb, stockAfter: art.stock
        });
      }
    });
  }
  return true;
}

function attachBonEditors(b) {
  const stTd=document.getElementById('td-bstat-'+b.id);
  if(!stTd) return;
  const _u=(typeof _currentUser==='function')?_currentUser():null;
  const _isAdmin=_u && _u.role==='admin';
  // Verrou édition inline : un bon validé n'est modifiable que par admin
  if (b.status==='validé' && !_isAdmin) {
    stTd.ondblclick=()=>notify('Bon validé — modification réservée à l\'admin','warning');
    return;
  }
  stTd.ondblclick=()=>{
    // Défense finale : re-check au moment du double-click (l'état a pu changer)
    const _u2=(typeof _currentUser==='function')?_currentUser():null;
    const _isAdmin2=_u2 && _u2.role==='admin';
    if (b.status==='validé' && !_isAdmin2) { notify('Bon validé — modification réservée à l\'admin','warning'); return; }
    makeEditable(stTd,b.status||'brouillon','select',BON_STATUSES.map(s=>s.key),(v)=>{
      // Défense ultime dans le callback onSave
      const _u3=(typeof _currentUser==='function')?_currentUser():null;
      const _isAdmin3=_u3 && _u3.role==='admin';
      if ((b.status==='validé' || v==='validé') && !_isAdmin3 && b.status!==v && b.status==='validé') {
        notify('Bon validé — modification réservée à l\'admin','error'); return;
      }
      const old=b.status;
      if(!_handleBonStatusStockChange(b, old, v)) return;
      b.status=v;
      _setBonStatusTimestamp(b, v);
      b._version=(b._version||1)+1;
      auditLog('EDIT','bon',b.id,{status:old},{status:v}); saveDBNow(); updateAlertBadge();
      const row=document.getElementById('bon-row-'+b.id);
      if(row){row.outerHTML=renderBonRow(b);attachBonEditors(b);}
    });
  };
}

function openBonModal(bonId) {
  const bon = bonId ? APP.bons.find(b=>b.id===bonId) : null;
  if (bon && bon.status === 'validé' && (!_currentUser() || _currentUser().role !== 'admin')) {
    notify('Bon validé — modification réservée à l\'admin', 'warning'); return;
  }
  const coOptions='';
  const comOptions=APP.commerciaux.map(c=>`<option value="${c.id}" ${bon?.commercialId===c.id?'selected':''}>${c.prenom} ${c.nom}</option>`).join('');
  const today=new Date().toISOString().split('T')[0];

  let lignesHtml='';
  if(bon && bon.lignes) {
    lignesHtml=bon.lignes.map(l=>{
      const artOptions=[...APP.articles].sort((x,y)=>x.name.localeCompare(y.name,'fr')).map(a=>`<option value="${a.id}" ${a.id===l.articleId?'selected':''}>${a.name} (stock: ${a.stock})</option>`).join('');
      return `<div class="b-ligne" style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
        <select class="b-art" style="flex:2">${artOptions}</select>
        <input class="b-code" value="${l.code||''}" placeholder="Code" style="flex:1">
        <input class="b-qty" type="number" value="${l.qty}" min="1" style="flex:1" placeholder="Qté">
        <input class="b-obs" value="${l.obs||''}" placeholder="Obs." style="flex:1">
        <button class="btn btn-sm btn-danger" onclick="this.closest('.b-ligne').remove()">✕</button>
      </div>`;
    }).join('');
  } else {
    const artOpts=[...APP.articles].sort((x,y)=>x.name.localeCompare(y.name,'fr')).map(a=>`<option value="${a.id}">${a.name} (stock: ${a.stock})</option>`).join('');
    lignesHtml=`<div class="b-ligne" style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
      <select class="b-art" style="flex:2" onchange="bonAutoFillCode(this)">${artOpts}</select>
      <input class="b-code" placeholder="Code" style="flex:1">
      <input class="b-qty" type="number" value="1" min="1" style="flex:1" placeholder="Qté">
      <input class="b-obs" placeholder="Obs." style="flex:1">
      <button class="btn btn-sm btn-danger" onclick="this.closest('.b-ligne').remove()">✕</button>
    </div>`;
  }

  const body=`
  <div class="form-row">
    '<div></div>'
    <div class="form-group"><label>Statut</label><select id="bon-status"><option value="brouillon" ${!bon||bon?.status==='brouillon'?'selected':''}>Brouillon</option><option value="validé" ${bon?.status==='validé'?'selected':''}>Validé</option><option value="annulé" ${bon?.status==='annulé'?'selected':''}>Annulé</option></select></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Demandeur</label>
      <select id="bon-demandeur-type" onchange="bonDemandeurToggle()">
        <option value="list" ${bon && bon._demandeurType==='custom'?'':'selected'}>Commercial / Annuaire</option>
        <option value="custom" ${bon && bon._demandeurType==='custom'?'selected':''}>Saisie Libre</option>
      </select>
      <select id="bon-commercial" style="margin-top:4px;${bon && bon._demandeurType==='custom'?'display:none':''}"><option value="">\u2014 S\u00e9lectionner \u2014</option>${_buildMergedPersonList('demandeur', bon?.demandeur)}</select>
      <div id="bon-custom-demandeur-wrap" style="margin-top:4px;${bon && bon._demandeurType==='custom'?'':'display:none'}">
        <input id="bon-custom-demandeur" value="${bon && bon._demandeurType==='custom' ? (bon.demandeur||'').replace(/"/g,'&amp;quot;') : ''}" placeholder="Nom et pr\u00e9nom (saisie libre)" style="width:100%">
      </div>
    </div>
    <div class="form-group"><label>Destinataire / R\u00e9cipiendaire *</label>
      <select id="bon-recip-type" onchange="bonRecipToggle()">
        <option value="list" ${bon && bon._recipType==='custom'?'':'selected'}>Commercial / Annuaire</option>
        <option value="custom" ${bon && bon._recipType==='custom'?'selected':''}>Saisie Libre</option>
      </select>
      <select id="bon-recip-list" style="margin-top:4px;${bon && bon._recipType==='custom'?'display:none':''}"><option value="">\u2014 S\u00e9lectionner \u2014</option>${_buildMergedPersonList('recipiendaire', bon?.recipiendaire)}</select>
      <div id="bon-custom-recip-wrap" style="margin-top:4px;${bon && bon._recipType==='custom'?'':'display:none'}">
        <input id="bon-custom-recip" value="${bon && bon._recipType==='custom' ? (bon.recipiendaire||'').replace(/"/g,'&amp;quot;') : ''}" placeholder="Nom et pr\u00e9nom (saisie libre)" style="width:100%">
      </div>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Objet / Motif</label><input id="bon-objet" value="${bon?.objet||''}"></div>
    <div class="form-group"><label>Date</label><input type="date" id="bon-date" value="${bon?.date||today}"></div>
  </div>
  <div class="form-group"><label>Validité</label><input id="bon-validite" value="${bon?.validite||'1 mois'}" placeholder="ex: 1 mois"></div>
  <div class="form-group"><label>Gadgets</label>
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:4px;margin-bottom:4px;font-size:10px;color:var(--text-2)">
      <span>Gadget</span><span>Code</span><span>Qté</span><span>Obs.</span><span></span>
    </div>
    <div id="b-lignes">${lignesHtml}</div>
    <button class="btn btn-secondary btn-sm" onclick="addBonLigne()" style="margin-top:4px">+ Ajouter ligne</button>
  </div>`;
  openModal('bon',bonId?'Modifier bon de sortie':'Nouveau bon de sortie',body,()=>saveBon(bonId),'modal-lg');
}

function addBonLigne() {
  const artOpts=[...APP.articles].sort((x,y)=>x.name.localeCompare(y.name,'fr')).map(a=>`<option value="${a.id}">${a.name} (stock: ${a.stock})</option>`).join('');
  const div=document.createElement('div'); div.className='b-ligne'; div.style.cssText='display:flex;gap:8px;margin-bottom:8px;align-items:center';
  div.innerHTML=`<select class="b-art" style="flex:2" onchange="bonAutoFillCode(this)">${artOpts}</select><input class="b-code" placeholder="Code" style="flex:1"><input class="b-qty" type="number" value="1" min="1" style="flex:1"><input class="b-obs" placeholder="Obs." style="flex:1"><button class="btn btn-sm btn-danger" onclick="this.closest('.b-ligne').remove()">✕</button>`;
  document.getElementById('b-lignes').appendChild(div);
}

function bonAutoFillCode(sel) {
  const artId = sel.value;
  const art = APP.articles.find(a=>a.id===artId);
  const ligne = sel.closest('.b-ligne');
  if(art && ligne) {
    const codeInput = ligne.querySelector('.b-code');
    if(codeInput) codeInput.value = art.code || '';
  }
}

// Build merged alphabetical list of commerciaux + annuaire names (all UPPERCASE)
function _buildMergedPersonList(context, selectedValue) {
  var names = [];
  var seen = {};
  // Add commerciaux
  (APP.commerciaux || []).forEach(function(c) {
    var nm = (((c.prenom||'') + ' ' + (c.nom||'')).trim()).toUpperCase();
    if (nm && !seen[nm]) { seen[nm] = 1; names.push({name: nm, src: 'com', id: c.id}); }
  });
  // Add annuaire (all tags for both contexts)
  (APP.annuaire || []).forEach(function(p) {
    var nm = (((p.prenom||'') + ' ' + (p.nom||'')).trim()).toUpperCase();
    if (nm && !seen[nm]) { seen[nm] = 1; names.push({name: nm, src: 'ann', id: p.id}); }
  });
  // Sort alphabetically
  names.sort(function(a, b) { return a.name.localeCompare(b.name, 'fr'); });
  var selUpper = (selectedValue || '').toUpperCase().trim();
  return names.map(function(n) {
    var sel = (n.name === selUpper) ? ' selected' : '';
    return '<option value="' + n.name.replace(/"/g,'&quot;') + '"' + sel + '>' + n.name + '</option>';
  }).join('');
}

function bonDemandeurToggle() {
  var t = document.getElementById('bon-demandeur-type').value;
  var listSel = document.getElementById('bon-commercial');
  var custWrap = document.getElementById('bon-custom-demandeur-wrap');
  if (t === 'custom') {
    listSel.style.display = 'none';
    custWrap.style.display = '';
  } else {
    listSel.style.display = '';
    custWrap.style.display = 'none';
  }
}

function bonRecipToggle() {
  var t = document.getElementById('bon-recip-type').value;
  var listSel = document.getElementById('bon-recip-list');
  var custWrap = document.getElementById('bon-custom-recip-wrap');
  if (t === 'custom') {
    listSel.style.display = 'none';
    custWrap.style.display = '';
  } else {
    listSel.style.display = '';
    custWrap.style.display = 'none';
  }
}

async function saveBon(existingId) {
  var _recipType = (document.getElementById('bon-recip-type')||{}).value || 'list';
  var recip = '';
  if (_recipType === 'custom') {
    recip = ((document.getElementById('bon-custom-recip')||{}).value || '').trim().toUpperCase();
  } else {
    recip = ((document.getElementById('bon-recip-list')||{}).value || '').trim().toUpperCase();
  }
  if(!recip){notify('Récipiendaire requis','error');return;}
  const rows=document.querySelectorAll('#b-lignes .b-ligne');
  const lignes=[];
  rows.forEach(row=>{
    const artId=row.querySelector('.b-art')?.value;
    const qty=parseInt(row.querySelector('.b-qty')?.value)||1;
    const code=row.querySelector('.b-code')?.value||'';
    const obs=row.querySelector('.b-obs')?.value||'';
    const art=APP.articles.find(a=>a.id===artId);
    if(art) lignes.push({articleId:art.id,name:art.name,articleName:art.name,code:code||art.code,qty,obs,unit:art.unit||'pcs'});
  });
  if(!lignes.length){notify('Ajoutez au moins un gadget','danger');return;}
  const comId=document.getElementById('bon-commercial').value;
  const com=comId?APP.commerciaux.find(c=>c.id===comId):null;
  const coId=null;
  // Demandeur logic
  var demType = (document.getElementById('bon-demandeur-type')||{}).value || 'list';
  var demandeur = '';
  var _demandeurType = demType;
  if (demType === 'custom') {
    demandeur = ((document.getElementById('bon-custom-demandeur')||{}).value || '').trim().toUpperCase();
  } else {
    demandeur = ((document.getElementById('bon-commercial')||{}).value || '').trim().toUpperCase();
  }
  // Phase 5: resolve annuaire IDs from name (best-effort)
  var _demandeurAnnuaireId = '';
  var _recipiendaireAnnuaireId = '';
  if (demType !== 'list' || true) {
    var _dp = (typeof _lookupAnnuaireByName === 'function') ? _lookupAnnuaireByName(demandeur) : null;
    if (_dp) _demandeurAnnuaireId = _dp.id;
  }
  var _rp = (typeof _lookupAnnuaireByName === 'function') ? _lookupAnnuaireByName(recip) : null;
  if (_rp) _recipiendaireAnnuaireId = _rp.id;

  if(existingId) {
    const bon=APP.bons.find(b=>b.id===existingId); if(!bon) return;
    const old={...bon};
    var _oldStatus = bon.status || 'brouillon';
    var _newStatus = document.getElementById('bon-status').value;
    var _wasDeducted = (_oldStatus === 'validé');
    var _willDeduct = (_newStatus === 'validé');
    // Restore old stock ONLY if it was previously deducted (with audit mouvement)
    if(_wasDeducted) {
      (bon.lignes||[]).forEach(function(l){
        var art=APP.articles.find(function(a){return a.id===l.articleId;});
        if(art && l.qty>0){
          art.stock+=l.qty;
          var _sb7=art.stock-l.qty; APP.mouvements.unshift({id:generateId(),type:'entree',ts:Date.now(),articleId:art.id,articleName:art.name,qty:l.qty,commercialId:bon.commercialId||null,note:'Modif Bon '+(bon.numero||'')+' (restauration)',stockBefore:_sb7,stockAfter:art.stock});
        }
      });
    }
    // Global stock constraint: even brouillons must not exceed real stock
    // Aggregate qty per article in this bon
    var _aggThis = {};
    lignes.forEach(function(l){ _aggThis[l.articleId]=(_aggThis[l.articleId]||0)+(parseInt(l.qty)||0); });
    for(var _aid in _aggThis){
      var _avail = _computeAvailableForBon(_aid, existingId);
      if(_aggThis[_aid] > _avail){
        var _art=APP.articles.find(function(a){return a.id===_aid;});
        notify('Stock insuffisant pour '+(_art?_art.name:_aid)+' (Dispo réel: '+_avail+', demandé: '+_aggThis[_aid]+')','error');
        // rollback restoration
        if(_wasDeducted){
          (bon.lignes||[]).forEach(function(l2){
            var a=APP.articles.find(function(x){return x.id===l2.articleId;});
            if(a && l2.qty>0){
              a.stock-=l2.qty;
              if(APP.mouvements && APP.mouvements[0] && APP.mouvements[0].note && APP.mouvements[0].note.indexOf('restauration')>=0) APP.mouvements.shift();
            }
          });
        }
        return;
      }
    }
    // Deduct new ONLY if needed
    if(_willDeduct) {
      lignes.forEach(function(l){var art=APP.articles.find(function(a){return a.id===l.articleId;});if(art){var _sb8=art.stock;art.stock-=l.qty;APP.mouvements.unshift({id:generateId(),type:'sortie',ts:Date.now(),articleId:art.id,articleName:art.name,qty:l.qty,commercialId:comId||null,note:'Modif Bon '+bon.numero,stockBefore:_sb8,stockAfter:art.stock});}});
    }
    Object.assign(bon,{recipiendaire:recip,companyId:coId,commercialId:comId||null,commercialName:com?com.prenom+' '+com.nom:'',demandeur:demandeur,_demandeurType:_demandeurType,_recipType:_recipType,_demandeurAnnuaireId:_demandeurAnnuaireId,_recipiendaireAnnuaireId:_recipiendaireAnnuaireId,objet:document.getElementById('bon-objet').value,date:document.getElementById('bon-date').value,validite:document.getElementById('bon-validite').value,lignes,status:_newStatus,_version:(bon._version||1)+1});
    if(_oldStatus !== _newStatus) _setBonStatusTimestamp(bon, _newStatus);
    auditLog('UPDATE','bon',bon.id,old,bon);
    saveDB();closeModal();renderBons();updateAlertBadge();renderSidebar();
    // When a validated bon is re-saved, the stock was restored then re-deducted (cancel+reactivate).
    // Dates (createdAt, _validatedAt) and validator snapshot are intentionally preserved.
    var _bounced = _wasDeducted && _willDeduct;
    notify('Bon '+bon.numero+(_bounced ? ' mis à jour — stock recyclé (annulé puis réactivé)' : ' mis à jour'),'success');
    setTimeout(()=>{if(confirm('Imprimer le bon modifié ?'))printBon(bon.id);},300);
  } else {
    var _newStatus = document.getElementById('bon-status').value || 'brouillon';
    // Global stock constraint: even brouillons must not exceed real available stock
    var _aggThis = {};
    lignes.forEach(function(l){ _aggThis[l.articleId]=(_aggThis[l.articleId]||0)+(parseInt(l.qty)||0); });
    for(var _aid in _aggThis){
      var _avail = _computeAvailableForBon(_aid, null);
      if(_aggThis[_aid] > _avail){
        var _art=APP.articles.find(function(a){return a.id===_aid;});
        notify('Stock insuffisant pour '+(_art?_art.name:_aid)+' (Dispo réel: '+_avail+', demandé: '+_aggThis[_aid]+')','error');
        return;
      }
    }
    const bon={id:generateId(),numero:await bonNumber(),companyId:coId,recipiendaire:recip,commercialId:comId||null,commercialName:com?com.prenom+' '+com.nom:'',demandeur:demandeur,_demandeurType:_demandeurType,_recipType:_recipType,_demandeurAnnuaireId:_demandeurAnnuaireId,_recipiendaireAnnuaireId:_recipiendaireAnnuaireId,objet:document.getElementById('bon-objet').value,date:document.getElementById('bon-date').value,validite:document.getElementById('bon-validite').value,lignes,status:_newStatus,sigDemandeur:'',sigMKT:'',createdAt:Date.now(),_version:1};
    if(_newStatus === 'validé') {
      bon._validatedAt = Date.now();
      lignes.forEach(l=>{const art=APP.articles.find(a=>a.id===l.articleId);if(art){const old={...art};var _sb9=art.stock;art.stock-=l.qty;APP.mouvements.unshift({id:generateId(),type:'sortie',ts:Date.now(),articleId:art.id,articleName:art.name,qty:l.qty,commercialId:comId||null,note:'Bon '+bon.numero,stockBefore:_sb9,stockAfter:art.stock});auditLog('STOCK_OUT','article',art.id,old,art);}});
    }
    APP.bons.push(bon);auditLog('CREATE','bon',bon.id,null,bon);
    saveDB();closeModal();renderBons();updateAlertBadge();renderSidebar();
    notify('Bon '+bon.numero+' créé ✓','success');
    setTimeout(()=>{if(confirm('Imprimer le bon maintenant ?'))printBon(bon.id);},300);
  }
}

function deleteBon(id) {
  const bon=APP.bons.find(b=>b.id===id); if(!bon) return;
  if (bon.status === 'validé' && (!_currentUser() || _currentUser().role !== 'admin')) {
    notify('Bon validé — suppression réservée à l\'admin', 'warning'); return;
  }
  var _wasDeducted = (bon.status === 'validé');
  if(!confirm('Supprimer le bon '+bon.numero+' ?' + (_wasDeducted ? '\nLe stock sera restauré.' : ''))) return;
  // Restore stock with audit mouvement if bon was validated
  if(_wasDeducted) {
    (bon.lignes||[]).forEach(function(l){
      var art=APP.articles.find(function(a){return a.id===l.articleId;});
      if(art && l.qty>0){
        art.stock+=l.qty;
        var _sb10=art.stock-l.qty; APP.mouvements.unshift({id:generateId(),type:'entree',ts:Date.now(),articleId:art.id,articleName:art.name,qty:l.qty,commercialId:bon.commercialId||null,note:'Suppression Bon '+(bon.numero||''),stockBefore:_sb10,stockAfter:art.stock});
      }
    });
  }
  auditLog('DELETE','bon',bon.id,bon,null);
  APP.bons=APP.bons.filter(b=>b.id!==id);
  saveDB();renderBons();updateAlertBadge();renderSidebar();
  notify('Bon '+bon.numero+' supprimé' + (_wasDeducted ? ' (stock restauré)' : ''),'warning');
}

// ============================================================
// GENERATE BON HTML (imprimable)
// ============================================================
function generateConfirmCode(bon) {
  // Double-pass FNV-1a inspired hash — numero + createdAt + recipiendaire + objet
  const seed = [(bon.numero||''), String(bon.createdAt||0), (bon.recipiendaire||''), (bon.objet||'')].join('\u00b7');
  let h1 = 0x811c9dc5 >>> 0;
  let h2 = 0xc4ceb9fe >>> 0;
  for(let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    h1 = (Math.imul(h1 ^ c, 0x01000193) ^ (c << 13)) >>> 0;
    h2 = (Math.imul(h2 ^ (c * 0x1b873593), 0x85ebca6b) ^ (i * 0x27d4eb2f)) >>> 0;
  }
  const mixed = ((h1 ^ (h2 >>> 5)) * 0x9e3779b9 ^ (h2 << 3)) >>> 0;
  return mixed.toString(36).toUpperCase().padStart(6, '0').slice(-6);
}


function openVerifyCodeModal() { verifyBonCode(); }
function verifyBonCode() {
  openModal('verify-code', '🔐 Vérifier un code de bon', `
    <div style="text-align:center;margin-bottom:14px;font-size:13px;color:var(--text-2)">
      Saisissez le code de vérification à 6 caractères imprimé sur le bon. Le système retrouvera automatiquement le bon associé.
    </div>
    <div class="form-group">
      <label>Code de vérification</label>
      <input id="vc-input" maxlength="6" placeholder="A1B2C3" style="text-transform:uppercase;font-size:24px;letter-spacing:8px;font-weight:700;text-align:center;font-family:monospace">
    </div>
    <div id="vc-result" style="margin-top:12px"></div>
  `, null, 'modal-md');
  const inp = document.getElementById('vc-input');
  if(inp) {
    inp.addEventListener('input', function(){
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
      vcCheck();
    });
    setTimeout(function(){ inp.focus(); }, 100);
  }
}
function vcAutoCode() {} // legacy stub -- kept for backward compat
function vcCheck() {
  const input = (document.getElementById('vc-input')?.value || '').trim().toUpperCase();
  const resEl = document.getElementById('vc-result');
  if(!resEl) return;
  if(input.length < 6) { resEl.innerHTML = ''; return; }
  var match = null;
  for(var i=0; i<(APP.bons||[]).length; i++) {
    if(generateConfirmCode(APP.bons[i]) === input) { match = APP.bons[i]; break; }
  }
  if(!match) {
    resEl.innerHTML = '<div style="padding:14px;background:rgba(220,53,69,0.1);border:1px solid var(--danger);border-radius:6px;color:var(--danger);text-align:center;font-weight:600">❌ CODE INVALIDE — aucun bon ne correspond à ce code</div>';
    return;
  }
  var validatedAt = match._validatedAt ? new Date(match._validatedAt).toLocaleString('fr-FR') : '—';
  var validatorName = match._validatedByName || '<em style="color:var(--text-2)">Non renseigné</em>';
  var prints = (match._printHistory || []).length;
  var lastPrintInfo = '—';
  if(prints) {
    var lp = match._printHistory[prints-1];
    lastPrintInfo = new Date(lp.ts).toLocaleString('fr-FR') + ' par ' + (lp.byName || '?');
  }
  var stColor = match.status === 'validé' ? 'var(--success)' : (match.status === 'annulé' ? 'var(--danger)' : 'var(--warning)');
  resEl.innerHTML = '<div style="padding:14px;background:rgba(40,167,69,0.08);border:1px solid var(--success);border-radius:6px">'
    + '<div style="text-align:center;font-size:18px;font-weight:700;color:var(--success);margin-bottom:12px">✅ CODE VALIDE</div>'
    + '<div style="display:grid;grid-template-columns:auto 1fr;gap:7px 14px;font-size:13px">'
    + '<strong>Bon :</strong><span style="font-family:monospace;color:var(--accent);font-weight:700">' + match.numero + '</span>'
    + '<strong>Statut :</strong><span style="color:' + stColor + ';font-weight:700">' + (match.status||'brouillon') + '</span>'
    + '<strong>Destinataire :</strong><span>' + (match.recipiendaire || '—') + '</span>'
    + '<strong>Demandeur :</strong><span>' + (match.demandeur || '—') + '</span>'
    + '<strong>Objet :</strong><span>' + (match.objet || '—') + '</span>'
    + '<strong>Validé le :</strong><span>' + validatedAt + '</span>'
    + '<strong>Validé par :</strong><span style="font-weight:600">' + validatorName + '</span>'
    + '<strong>Impressions :</strong><span>' + prints + (prints ? ' fois — dernière : ' + lastPrintInfo : ' (jamais imprimé)') + '</span>'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-top:14px;justify-content:center">'
    + '<button class="btn btn-sm btn-primary" onclick="closeModal();previewBon(\''+match.id+'\')">👁 Voir le bon</button>'
    + '<button class="btn btn-sm btn-secondary" onclick="printBon(\''+match.id+'\')">🖨 Réimprimer</button>'
    + '</div>'
    + '</div>';
}

// Nom live du destinataire d'un bon: resoud via commercialId / _annuaireId
// au moment de l'affichage. Fallback sur le snapshot (bon.recipiendaire /
// bon.commercialName) si l'entite n'existe plus.
function _bonLiveName(bon) {
  if (!bon) return '';
  if (bon.commercialId) {
    var c = (APP.commerciaux || []).find(function(x){ return x.id === bon.commercialId; });
    if (c) {
      var n = ((c.prenom||'') + ' ' + (c.nom||'')).trim();
      if (n) return n;
    }
  }
  if (bon._annuaireId) {
    var p = (APP.annuaire || []).find(function(x){ return x.id === bon._annuaireId; });
    if (p) {
      var n2 = ((p.prenom||'') + ' ' + (p.nom||'')).trim();
      if (n2) return n2;
    }
  }
  return bon.recipiendaire || bon.commercialName || '';
}

function generateBonHTML(bon, overrides) {
  const co=null;
  const ov=overrides||{};
  const cName=ov.name||co?.name||APP.settings.companyName||'Mon Entreprise';
  const cShort=ov.shortName||co?.shortName||'';
  const cLogo=ov.logo||co?.logo||_safeCompanyLogo();
  const cAddr=ov.address||co?.address||'';
  const cTel=ov.tel||co?.tel||'';
  const cFax=ov.fax||co?.fax||'';
  const cEmail=ov.email||co?.email||'';
  const cPrimary=ov.colorPrimary||co?.colorPrimary||'#111111';
  const bonTitle=ov.bonTitle||'BON DE SORTIE DE GADGETS';
  const qrSvg=`<div style="text-align:center;background:white;padding:4px"><img src="data:image/png;base64,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" style="max-width:110px;height:auto;display:block;margin:0 auto" /></div>`;
  const commercial=bon.commercialId?APP.commerciaux.find(c=>c.id===bon.commercialId):null;
  const paperSize=(ov.paperSize||'A4').toUpperCase();
  const paperSizeMap={'A4':{rows:17,minHeight:1050},'A5':{rows:7,minHeight:740},'LETTER':{rows:16,minHeight:1010},'LEGAL':{rows:22,minHeight:1330}};
  const _pinfo=paperSizeMap[paperSize]||paperSizeMap['A4'];
  const _extraRaw=parseInt(ov.minRows);
  const _lignesCount=(bon.lignes||[]).length;
  const dataRows=(bon.lignes||[]).map(l=>`
    <tr>
      <td style="padding:7px 10px;border:1px solid #555;font-size:12px;font-weight:700;color:#111;text-align:center">${l.code||''}</td>
      <td style="padding:7px 10px;border:1px solid #555;font-size:13px;color:#111">${l.name||l.articleName||''}</td>
      <td style="padding:7px 10px;border:1px solid #555;font-size:13px;font-weight:700;color:#111;text-align:center">${l.qty||''}</td>
      <td style="padding:7px 10px;border:1px solid #555;font-size:12px;color:#111;font-style:italic">${l.obs||''}</td>
    </tr>`).join('');
  const blankCount=!isNaN(_extraRaw)?Math.max(0,_extraRaw):Math.max(0,_pinfo.rows-_lignesCount);
  const _blankCellBase='padding:7px 10px;border:1px dashed #d8d8d8';
  const blankRows=Array(blankCount).fill(0).map(()=>`<tr><td style="${_blankCellBase};height:20px"></td><td style="${_blankCellBase};color:#bcbcbc;font-size:10px;font-style:italic;text-align:center;letter-spacing:0.32em;text-transform:uppercase;opacity:0.55">ligne vide</td><td style="${_blankCellBase}"></td><td style="${_blankCellBase}"></td></tr>`).join('');
  // All bons: left+center = validator sig+date+matricule, right = validation date only
  return `<div style="background:white;color:#111;font-family:'Arial',sans-serif;max-width:800px;margin:0 auto;padding:28px 32px;box-shadow:0 2px 12px rgba(0,0,0,0.10);min-height:${_pinfo.minHeight}px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:6px">
      <tr>
        <td style="width:42%;vertical-align:top;padding-right:16px">
          ${cLogo
            ?`<img src="${cLogo}" style="max-height:130px;max-width:240px;object-fit:contain;display:block;margin-bottom:8px">`
            :`<div style="font-size:20px;font-weight:900;color:#111;line-height:1.2;margin-bottom:6px">${cName}</div>`}
          <div style="font-size:11px;color:#222;margin-top:2px;line-height:1.6">
            ${cAddr?`<div>${cAddr}</div>`:''}
            ${(cTel||cFax)?`<div>Tél. : <strong>${cTel}</strong>${cFax?' - Fax : <strong>'+cFax+'</strong>':''}</div>`:''}
            ${cEmail?`<div>${cEmail}</div>`:''}
          </div>
          <div style="width:60%;height:2px;background:#111;margin-top:8px"></div>
        </td>
        <td style="vertical-align:top;text-align:right">
          <div style="font-size:11px;color:#111;margin-bottom:12px">Abidjan, le <strong>${bon.date||new Date(bon.createdAt||Date.now()).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})}</strong></div>
          <div style="font-size:20px;font-weight:900;color:#111;text-align:center;border:2px solid #111;padding:10px 18px;display:inline-block;letter-spacing:0.01em;line-height:1.3">${bonTitle}</div>
          <div style="text-align:center;margin-top:8px;font-size:14px;font-weight:700;color:#111">
            Valable ${bon.validite||'1 mois'}
            <span style="font-size:22px;font-weight:900;color:${cPrimary};margin-left:8px;letter-spacing:0.05em">N° ${bon.numero}</span>
          </div>
        </td>
      </tr>
    </table>
    <div style="margin:14px 0 6px">
      <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:5px">
        <strong>DEMANDEUR :</strong> <span style="display:inline-block;width:400px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${bon.demandeur||(commercial?commercial.prenom+' '+commercial.nom:'—')}</span>
      </div>
      <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:5px">
        <strong>DESTINATAIRE / RÉCIPIENDAIRE :</strong> <span style="display:inline-block;width:340px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${_bonLiveName(bon)}</span>
      </div>
      <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:10px">
        <strong>Objet / Motif :</strong> <span style="display:inline-block;width:${bon._isDispatch?'460':'330'}px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${bon.objet||''}</span>
        ${bon._isDispatch?'':`<span style="margin-left:16px"><strong>DU</strong> <span style="display:inline-block;width:110px;border-bottom:1px dotted #555;padding-left:8px">${bon.date||''}</span></span>`}
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;border:2px solid #111;margin-bottom:0">
      <thead>
        <tr style="background:#fff">
          <th style="padding:10px 12px;border:1px solid #555;font-size:12px;font-weight:700;color:#111;text-align:center;width:14%">Code<br>Produits</th>
          <th style="padding:10px 12px;border:1px solid #555;font-size:13px;font-weight:700;color:#111;text-align:center;width:46%;letter-spacing:0.12em">D é s i g n a t i o n</th>
          <th style="padding:10px 12px;border:1px solid #555;font-size:12px;font-weight:700;color:#111;text-align:center;width:14%">Quantité</th>
          <th style="padding:10px 12px;border:1px solid #555;font-size:12px;font-weight:700;color:#111;text-align:center;width:26%">Observations</th>
        </tr>
      </thead>
      <tbody>${dataRows}${blankRows}</tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;border:2px solid #111;border-top:none">
      <tr>
        <td style="width:33%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px">
          <div style="font-size:11px;font-weight:700;color:#111;text-align:center;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;text-align:center;margin-bottom:8px">Gestionnaire de Stock</div>
          ${_renderBonGestionnaireSigBox(bon)}
        </td>
        <td style="width:34%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px">Magasin</div>
          ${_renderBonGestionnaireSigBox(bon)}
        </td>
        <td style="width:33%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px">R\u00e9ceptionnaire</div>
          ${_renderBonReceptionnaireDate(bon)}
        </td>
      </tr>
    </table>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px">
      <div style="font-size:9px;color:#777;line-height:1.6">Document généré le ${fmtDateTime(bon.createdAt)}<br>Bon valable ${bon.validite||'1 mois'}<br>Code vérif: <strong style="font-size:14px;letter-spacing:4px;color:#111">${generateConfirmCode(bon)}</strong></div>
      <div style="text-align:center">${qrSvg}<div style="font-size:9px;color:#888;margin-top:3px">${bon.numero}</div></div>
    </div>
  </div>`;
}

function generateQRSVG(text, color) {
  color=color||'#000'; let hash=0;
  for(let i=0;i<text.length;i++){hash=((hash<<5)-hash)+text.charCodeAt(i);hash|=0;}
  const size=64,cells=11,cs=size/cells; let rects='';
  for(let r=0;r<cells;r++) for(let c=0;c<cells;c++){
    const bit=(hash>>((r*cells+c)%32))&1;
    if(bit||(r<3&&c<3)||(r<3&&c>7)||(r>7&&c<3)) rects+=`<rect x="${c*cs}" y="${r*cs}" width="${cs-0.8}" height="${cs-0.8}" fill="${color}" rx="1"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:2px solid ${color};background:white;border-radius:4px">${rects}</svg>`;
}

async function previewBon(id) {
  const bon=APP.bons.find(b=>b.id===id); if(!bon) return;
  // Open modal immediately with a loading placeholder so the UI is responsive
  openModal('modal-bon-preview','Aperçu — '+bon.numero,
    '<div style="text-align:center;padding:40px;color:#888;font-size:13px">⏳ Chargement des signatures…</div>',
    null,'modal-xl');
  // Wait for the signature cache so all 3 sig boxes render correctly
  if (typeof _loadSignaturesCache === 'function') {
    try { await _loadSignaturesCache(); } catch(e) {}
  }
  // Swap in the real content (modal may have been closed in the meantime)
  var bodyEl = document.querySelector('#active-modal .modal-body');
  if (bodyEl) bodyEl.innerHTML = renderBonPreviewBody(id, 'A4');
}
function renderBonPreviewBody(bonId, paperSize) {
  const bon = APP.bons.find(b => b.id === bonId); if (!bon) return '';
  paperSize = (paperSize || 'A4').toUpperCase();
  const sizes = ['A4','A5','Letter','Legal'];
  const opts = sizes.map(s => `<option value="${s}"${s.toUpperCase()===paperSize?' selected':''}>${s}</option>`).join('');
  const changeJs = `document.querySelector('#active-modal .modal-body').innerHTML = renderBonPreviewBody('${bonId}', this.value)`;
  const selector = `<div style="display:flex;gap:8px;align-items:center;padding:10px 14px;background:var(--bg-2);border-radius:8px;margin-bottom:10px;flex-wrap:wrap">
    <label style="font-size:12px;font-weight:600;color:var(--text-1)">Format papier :</label>
    <select onchange="${changeJs}" style="width:auto;font-weight:600">${opts}</select>
    <div style="flex:1"></div>
    <button class="btn btn-sm btn-secondary" onclick="printBon('${bonId}', '${paperSize}')">Imprimer</button>
    <button class="btn btn-sm btn-secondary" onclick="exportBonPDF('${bonId}', '${paperSize}')">PDF</button>
  </div>`;
  return `<div style="max-height:70vh;overflow:auto">${selector}${generateBonHTML(bon, {paperSize: paperSize, minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined})}</div>`;
}
async function printBon(id, paperSize) {
  paperSize=(paperSize||'A4').toUpperCase();
  const bon=APP.bons.find(b=>b.id===id); if(!bon) return;
  // Open the popup synchronously to preserve the user gesture (popup blockers)
  const win=window.open('','_blank','width=900,height=750');
  if(!win){ notify('Popup bloquée — autorisez les popups','warning'); return; }
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bon '+bon.numero+'</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;color:#666"><div style="font-size:14px">⏳ Chargement des signatures…</div></body></html>');
  // Now wait for the sig cache before writing the real bon HTML
  if (typeof _loadSignaturesCache === 'function') {
    try { await _loadSignaturesCache(); } catch(e) {}
  }
  if (win.closed) return; // user closed it while we waited
  win.document.open();
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bon ${bon.numero}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#f0f0f0;padding:20px;font-family:Arial,sans-serif}@media print{body{background:white;padding:0}@page{margin:10mm;size:${paperSize.toLowerCase()}}}</style></head><body>${generateBonHTML(bon, {paperSize: paperSize, minRows: (APP.settings && APP.settings.bonMinRows!=null) ? APP.settings.bonMinRows : undefined})}<script>window.onload=()=>{setTimeout(()=>window.print(),300)}<\/script></body></html>`);
  win.document.close();
  _recordBonPrint(bon);
  auditLog('PRINT','bon',bon.id,null,{numero:bon.numero});
  saveDB();
}
function exportBonsJSON() {
  downloadFile(JSON.stringify({bons:APP.bons,exportedAt:Date.now()},null,2),'bons-export-'+Date.now()+'.json','application/json');
  notify('Export JSON téléchargé','success');
}

// ============================================================
// MOUVEMENTS
// ============================================================
function renderMouvements() {
  const totalEntrees = APP.mouvements.filter(m=>m.type==='entree').reduce((s,m)=>s+m.qty,0);
  const totalSorties = APP.mouvements.filter(m=>m.type==='sortie').reduce((s,m)=>s+m.qty,0);
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div>
      <div class="page-title">Mouvements de stock</div>
      <div class="page-sub" style="margin-top:4px">
        <span style="color:var(--success);font-weight:600">↑ ${totalEntrees} entrées</span>
        &nbsp;·&nbsp;
        <span style="color:var(--accent3);font-weight:600">↓ ${totalSorties} sorties</span>
        &nbsp;·&nbsp;
        <span style="color:var(--text-2)">${APP.mouvements.length} mouvements au total</span>
      </div>
    </div>
    <div style="display:flex;gap:8px"><button class="btn btn-secondary btn-sm" onclick="openArchivesModal('mouvements')" title="Consulter les mouvements archivés">📦 Archives</button><button class="btn btn-secondary btn-sm" id="btn-mvt-summary" onclick="toggleMvtSummary()">📊 Résumé Audit</button><button class="btn btn-secondary btn-sm" onclick="exportMvtCSV()">📥 Export CSV</button></div>
  </div>
  <div id="mvt-summary-wrap" style="display:none"></div>
  <div class="filters">
    <select id="mvt-type-filter" onchange="filterMvt()" style="width:auto">
      <option value="all">Tous types</option>
      <option value="entree">↑ Entrées seulement</option>
      <option value="sortie">↓ Sorties seulement</option>
    </select>
    <input type="date" id="mvt-date-from" onchange="filterMvt()" style="width:auto" title="Date début">
    <input type="date" id="mvt-date-to" onchange="filterMvt()" style="width:auto" title="Date fin">
    <div class="search-bar" style="flex:1;max-width:280px">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="mvt-search" placeholder="Article, code, agent..." oninput="filterMvt()">
    </div>
  </div>
  <div id="mvt-table-wrap"></div>`;
  filterMvt();
}

function filterMvt() {
  const type   = document.getElementById('mvt-type-filter')?.value || 'all';
  const from   = document.getElementById('mvt-date-from')?.value;
  const to     = document.getElementById('mvt-date-to')?.value;
  const needle = _normSearch(document.getElementById('mvt-search')?.value || '');
  const mvts = APP.mouvements.filter(m => {
    if(type !== 'all' && m.type !== type) return false;
    if(from && m.ts < new Date(from).getTime()) return false;
    if(to   && m.ts > new Date(to).getTime() + 86399999) return false;
    if(needle) {
      const art  = APP.articles.find(a => a.id === m.articleId);
      const who  = m.commercialId ? APP.commerciaux.find(c => c.id === m.commercialId) : null;
      const fourn= m.fournisseurId ? APP.fournisseurs.find(f => f.id === m.fournisseurId) : null;
      const hay = _normSearch([
        m.articleName, art && art.code, art && art.category,
        who ? (who.prenom+' '+who.nom) : '',
        fourn && fourn.nom, m.obs, m.note
      ].filter(Boolean).join(' '));
      if(!hay.includes(needle)) return false;
    }
    return true;
  }).sort((a, b) => b.ts - a.ts);

  const wrap = document.getElementById('mvt-table-wrap'); if(!wrap) return;
  const entCount = mvts.filter(m=>m.type==='entree').length;
  const sorCount = mvts.filter(m=>m.type==='sortie').length;

  wrap.innerHTML = `
  <div style="font-size:11px;color:var(--text-2);margin-bottom:8px">
    ${mvts.length} résultat${mvts.length!==1?'s':''} —
    <span style="color:var(--success)">↑ ${entCount} entrée${entCount!==1?'s':''}</span> ·
    <span style="color:var(--accent3)">↓ ${sorCount} sortie${sorCount!==1?'s':''}</span>
  </div>
  <div class="table-wrap"><table>
    <thead><tr>
      <th>Date / Heure</th><th>Type</th><th>Article</th><th>Code</th>
      <th>Quantité</th><th title="Destinataire (bons) · Fournisseur (entrées) · Compte opérateur (saisies manuelles)">Commanditaire</th><th>Observation</th>
    </tr></thead>
    <tbody>${mvts.length ? mvts.map(m => {
      const isE  = m.type === 'entree';
      const art  = APP.articles.find(a => a.id === m.articleId);
      const who  = m.commercialId  ? APP.commerciaux.find(c => c.id === m.commercialId)   : null;
      const fourn= m.fournisseurId ? APP.fournisseurs.find(f => f.id === m.fournisseurId) : null;
      const agentLabel = (function(){
        const _note = m.note || '';
        const _bm = /^(?:Modif |Suppression |Renvoi )?Bon\s+(\S+)/i.exec(_note);
        if (_bm) {
          const _bon = APP.bons.find(b => String(b.numero) === _bm[1]);
          if (_bon) {
            const _dest = _bonLiveName(_bon) || '—';
            const _dem  = _bon.demandeur    || '—';
            return '<div style="font-weight:600">' + _dest + '</div>'
                 + '<div style="font-size:10px;color:var(--text-2)">Dem: ' + _dem + '</div>';
          }
        }
        if (isE && fourn) return '🏭 ' + fourn.nom;
        if (!isE && who)  return '👤 ' + who.prenom + ' ' + who.nom;
        if (m.userLogin)  return '<span style="color:var(--text-2)">👨‍💻 ' + m.userLogin + '</span>';
        return '<span style="color:var(--text-2)">—</span>';
      })();
      return `<tr>
        <td style="font-size:11px;font-family:monospace;white-space:nowrap">${fmtDateTime(m.ts)}</td>
        <td><span class="badge ${isE?'badge-green':'badge-orange'}" style="white-space:nowrap">${isE?'↑ Entrée':'↓ Sortie'}</span></td>
        <td style="font-weight:600">${m.articleName||'—'}</td>
        <td style="font-family:monospace;font-size:11px;color:var(--text-2)">${art?.code||'—'}</td>
        <td style="white-space:nowrap"><div style="font-size:15px;font-weight:700;color:${isE?'var(--success)':'var(--accent3)'}">${isE?'+':'-'}${m.qty}</div>${m.stockBefore!=null?'<div style="font-size:9px;color:var(--text-3);line-height:1.3;margin-top:2px">Avant: <b>'+m.stockBefore+'</b> \u2192 Apr\u00e8s: <b>'+m.stockAfter+'</b></div>':''}</td>
        <td style="font-size:12px">${agentLabel}</td>
        <td style="font-size:12px;color:var(--text-2);max-width:200px">${m.obs||m.note||'—'}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="7"><div class="empty-state"><p>Aucun mouvement trouvé</p></div></td></tr>'}
    </tbody>
  </table></div>`;
}

function openNewMvtModal(type) {
  const artOptions=APP.articles.map(a=>`<option value="${a.id}">${a.code} — ${a.name} (Stock: ${a.stock})</option>`).join('');
  const comOptions=APP.commerciaux.map(c=>`<option value="${c.id}">${c.prenom} ${c.nom}</option>`).join('');
  const foOptions=APP.fournisseurs.map(f=>`<option value="${f.id}">${f.nom}${f.entreprise?' ('+f.entreprise+')':''}</option>`).join('');
  openModal('modal-mvt',type==='entree'?'➕ Entrée de stock':'➖ Sortie de stock',`
    <div class="form-group"><label>Article *</label><select id="mvt-article">${artOptions}</select></div>
    <div class="form-row">
      <div class="form-group"><label>Quantité *</label><input type="number" id="mvt-qty" value="1" min="1"></div>
      <div class="form-group"><label>Date</label><input type="date" id="mvt-date" value="${new Date().toISOString().split('T')[0]}"></div>
    </div>
    ${type==='entree'?`<div class="form-group"><label>Fournisseur</label><select id="mvt-founis"><option value="">— Sélectionner —</option>${foOptions}</select></div>`:`<div class="form-group"><label>Commercial</label><select id="mvt-com"><option value="">— Sélectionner —</option>${comOptions}</select></div>`}
    <div class="form-group"><label>Observation</label><textarea id="mvt-obs" rows="2"></textarea></div>`,
  ()=>{
    const artId=document.getElementById('mvt-article').value;
    const qty=parseInt(document.getElementById('mvt-qty').value)||0;
    if(!artId||qty<=0){notify('Article et quantité requis','error');return;}
    const art=APP.articles.find(a=>a.id===artId); if(!art) return;
    if(type==='sortie'&&qty>art.stock){notify('Stock insuffisant','error');return;}
    const old={...art};
    var _sb12=art.stock;
    if(type==='entree') art.stock+=qty; else art.stock-=qty;
    var _cuM = typeof _currentUser==='function' ? _currentUser() : null;
    var _uLog = _cuM ? (_cuM.display_name || _cuM.name || _cuM.email || '') : '';
    const mvt={id:generateId(),type,ts:Date.now(),articleId:art.id,articleName:art.name,qty,
      fournisseurId:type==='entree'?(document.getElementById('mvt-founis')?.value||null):null,
      commercialId:type==='sortie'?(document.getElementById('mvt-com')?.value||null):null,
      obs:document.getElementById('mvt-obs').value,userLogin:_uLog,stockBefore:_sb12,stockAfter:art.stock};
    APP.mouvements.push(mvt);
    auditLog('STOCK_'+type.toUpperCase(),'article',art.id,old,art);
    saveDB();closeModal();filterMvt();updateAlertBadge();
    notify(`${type==='entree'?'Entrée':'Sortie'} de ${qty} × ${art.name} enregistrée`,'success');
  });
}

function exportMvtCSV() {
  const headers=['Date','Type','Article','Quantité','Observation'];
  const rows=APP.mouvements.map(m=>[fmtDateTime(m.ts),m.type,m.articleName,m.qty,m.obs||m.note||''].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','));
  downloadFile([headers.join(','),...rows].join('\n'),'mouvements-'+Date.now()+'.csv','text/csv');
  notify('Export CSV téléchargé','success');
}

function toggleMvtSummary() {
  const wrap = document.getElementById('mvt-summary-wrap');
  if (!wrap) return;
  const btn = document.getElementById('btn-mvt-summary');
  if (wrap.style.display === 'none') {
    renderMvtSummary();
    wrap.style.display = '';
    if (btn) { btn.classList.add('btn-primary'); btn.classList.remove('btn-secondary'); }
  } else {
    wrap.style.display = 'none';
    if (btn) { btn.classList.remove('btn-primary'); btn.classList.add('btn-secondary'); }
  }
}

function renderMvtSummary() {
  const wrap = document.getElementById('mvt-summary-wrap');
  if (!wrap) return;
  const stats = {};
  APP.mouvements.forEach(m => {
    const art = APP.articles.find(a => a.id === m.articleId);
    if (!stats[m.articleId]) {
      stats[m.articleId] = {
        name: m.articleName || art?.name || '—',
        code: art?.code || '—',
        stock: art?.stock ?? '—',
        bonSorti: 0, bonRestaure: 0, receptions: 0, manuelEntree: 0, manuelSortie: 0
      };
    }
    const s = stats[m.articleId];
    const n = (m.note || m.obs || '').trim();
    if (m.type === 'sortie') {
      if (/^Bon\s|^Réactivation Bon|^Modif Bon/.test(n) && !/restauration/i.test(n)) s.bonSorti += m.qty;
      else s.manuelSortie += m.qty;
    } else {
      if (/Annulation Bon|Retour brouillon|Suppression Bon/.test(n) || (/^Modif Bon/.test(n) && /restauration/i.test(n))) s.bonRestaure += m.qty;
      else if (/^Réception/.test(n)) s.receptions += m.qty;
      else s.manuelEntree += m.qty;
    }
  });
  const entries = Object.entries(stats).sort((a, b) => a[1].name.localeCompare(b[1].name));
  const tot = entries.reduce((t, [, s]) => {
    t.bonSorti += s.bonSorti; t.bonRestaure += s.bonRestaure;
    t.receptions += s.receptions; t.manuelEntree += s.manuelEntree; t.manuelSortie += s.manuelSortie;
    return t;
  }, { bonSorti:0, bonRestaure:0, receptions:0, manuelEntree:0, manuelSortie:0 });
  const netTot = tot.bonSorti - tot.bonRestaure;
  wrap.innerHTML = `
  <div class="card" style="margin-bottom:16px;overflow:auto">
    <div class="card-header" style="flex-wrap:wrap;gap:8px">
      <span class="card-title">Résumé Audit par Article</span>
      <span style="font-size:11px;color:var(--text-2)">${entries.length} article${entries.length!==1?'s':''} avec mouvements</span>
    </div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>Article</th><th>Code</th>
        <th style="color:var(--accent3)">Sorti (Bons)</th>
        <th style="color:var(--success)">Restauré (Bons)</th>
        <th>Net Bons</th>
        <th style="color:var(--success)">Réceptions</th>
        <th style="color:var(--success)">Manuel +</th>
        <th style="color:var(--accent3)">Manuel −</th>
        <th>Stock actuel</th>
      </tr></thead>
      <tbody>
      ${entries.map(([id, s]) => {
        const net = s.bonSorti - s.bonRestaure;
        return '<tr>' +
          '<td style="font-weight:600">' + s.name + '</td>' +
          '<td style="font-family:monospace;font-size:11px;color:var(--text-2)">' + s.code + '</td>' +
          '<td style="color:var(--accent3);font-weight:600">' + (s.bonSorti ? '-' + s.bonSorti : '—') + '</td>' +
          '<td style="color:var(--success);font-weight:600">' + (s.bonRestaure ? '+' + s.bonRestaure : '—') + '</td>' +
          '<td style="font-weight:800;color:' + (net > 0 ? 'var(--accent3)' : net < 0 ? 'var(--success)' : 'var(--text-2)') + '">' + (net > 0 ? '-' + net : net < 0 ? '+' + Math.abs(net) : '0') + '</td>' +
          '<td style="color:var(--success);font-weight:600">' + (s.receptions ? '+' + s.receptions : '—') + '</td>' +
          '<td style="color:var(--success)">' + (s.manuelEntree ? '+' + s.manuelEntree : '—') + '</td>' +
          '<td style="color:var(--accent3)">' + (s.manuelSortie ? '-' + s.manuelSortie : '—') + '</td>' +
          '<td style="font-weight:700;font-size:15px">' + s.stock + '</td>' +
        '</tr>';
      }).join('')}
      </tbody>
      <tfoot><tr style="font-weight:800;border-top:2px solid var(--border)">
        <td colspan="2">TOTAUX</td>
        <td style="color:var(--accent3)">${tot.bonSorti ? '-' + tot.bonSorti : '—'}</td>
        <td style="color:var(--success)">${tot.bonRestaure ? '+' + tot.bonRestaure : '—'}</td>
        <td style="color:${netTot > 0 ? 'var(--accent3)' : 'var(--text-2)'}">${netTot > 0 ? '-' + netTot : netTot < 0 ? '+' + Math.abs(netTot) : '0'}</td>
        <td style="color:var(--success)">${tot.receptions ? '+' + tot.receptions : '—'}</td>
        <td style="color:var(--success)">${tot.manuelEntree ? '+' + tot.manuelEntree : '—'}</td>
        <td style="color:var(--accent3)">${tot.manuelSortie ? '-' + tot.manuelSortie : '—'}</td>
        <td>—</td>
      </tr></tfoot>
    </table></div>
  </div>`;
}

// ============================================================
// COMMERCIAUX
// ============================================================
// ============================================================
// HELPERS TERRITOIRE
// ============================================================
function getZoneColor(zoneId) {
  const z = (APP.zones||[]).find(x=>x.id===zoneId);
  return z?.color || '#6b7280';
}
function getSecteurColor(secteurId) {
  const s = (APP.secteurs||[]).find(x=>x.id===secteurId);
  return s?.color || '#6b7280';
}
function getZoneLabel(zoneId) {
  const z = (APP.zones||[]).find(x=>x.id===zoneId);
  return z?.label || '—';
}
function getSecteurLabel(secteurId) {
  const s = (APP.secteurs||[]).find(x=>x.id===secteurId);
  return s?.label || '—';
}
function getCommercialLabel(comId) {
  const c = APP.commerciaux.find(x=>x.id===comId);
  return c ? c.prenom+' '+c.nom : '—';
}
function comPDVCount(comId) {
  return (APP.pdv||[]).filter(p=>p.commercialId===comId && p.actif!==false).length;
}
function secteurPDVCount(secteurId) {
  return (APP.pdv||[]).filter(p=>p.secteurId===secteurId && p.actif!==false).length;
}
function zonePDVCount(zoneId) {
  return (APP.pdv||[]).filter(p=>p.zoneId===zoneId && p.actif!==false).length;
}
function zoneSecteurCount(zoneId) {
  return (APP.secteurs||[]).filter(s=>s.zoneId===zoneId).length;
}
function zoneCommercialCount(zoneId) {
  return APP.commerciaux.filter(c=>c.dispatchZoneId===zoneId).length;
}
function secteurCommercialCount(secteurId) {
  return APP.commerciaux.filter(c=>c.secteurId===secteurId).length;
}

// ============================================================
// PAGE : COMMERCIAUX
// ============================================================
function renderCommerciaux() {
  // Stats globales
  const totalPDV = APP.commerciaux.reduce((s,c)=>s + comPDVCount(c.id), 0);
  const totalZones = (APP.zones||[]).length;
  const totalSecteurs = (APP.secteurs||[]).length;
  const totalBons = APP.bons.length;

  // Regroupement par zone → secteur → commerciaux
  const zones = APP.zones||[];
  const secteurs = APP.secteurs||[];

  // KPI bar
  const kpiBar = `
  <div class="grid-4 mb-16">
    <div class="card" style="cursor:pointer" onclick="showPage('territoire')">
      <div class="card-header"><span class="card-title">Zones</span><span style="font-size:18px">🗺</span></div>
      <div class="kpi-value" style="color:var(--accent);font-size:28px">${totalZones}</div>
      <div class="kpi-change">${totalSecteurs} secteurs · <span style="color:var(--accent);font-size:11px">Gérer →</span></div>
    </div>
    <div class="card" style="cursor:pointer" onclick="showPage('territoire')">
      <div class="card-header"><span class="card-title">Secteurs</span><span style="font-size:18px">📍</span></div>
      <div class="kpi-value" style="color:var(--accent2);font-size:28px">${totalSecteurs}</div>
      <div class="kpi-change">${zones.map(z=>zoneSecteurCount(z.id)).join(' / ')||'—'} par zone</div>
    </div>
    <div class="card" style="cursor:pointer" onclick="showPage('pdv')">
      <div class="card-header"><span class="card-title">PDV actifs</span><span style="font-size:18px">🏪</span></div>
      <div class="kpi-value" style="color:var(--warning);font-size:28px">${(APP.pdv||[]).filter(p=>p.actif!==false).length}</div>
      <div class="kpi-change">${(APP.pdv||[]).filter(p=>p.type==='boulangerie').length} boul · ${(APP.pdv||[]).filter(p=>p.type==='distributeur').length} dist · <span style="color:var(--accent);font-size:11px">Gérer →</span></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Commerciaux</span><span style="font-size:18px">👥</span></div>
      <div class="kpi-value" style="color:var(--success);font-size:28px">${APP.commerciaux.length}</div>
      <div class="kpi-change">${totalBons} bons émis</div>
    </div>
  </div>`;

  // Vue par zone
  const ZONE_COLORS = ['#3d7fff','#00e5aa','#ff6b35','#ffa502','#9b59b6','#e91e63','#00bcd4','#8bc34a'];

  // Groupes : zones déclarées + commerciaux sans zone
  const zoneBlocks = [];

  // Zones déclarées
  zones.forEach((z, zi) => {
    const zColor = z.color || ZONE_COLORS[zi % ZONE_COLORS.length];
    const zSecteurs = secteurs.filter(s=>s.zoneId===z.id);
    const zComs = APP.commerciaux.filter(c=>c.dispatchZoneId===z.id);
    const zPDV = zonePDVCount(z.id);
    const zBoul = (APP.pdv||[]).filter(p=>p.zoneId===z.id&&p.type==='boulangerie').length;
    const zDist = (APP.pdv||[]).filter(p=>p.zoneId===z.id&&p.type==='distributeur').length;

    // Commerciaux groupés par secteur dans cette zone
    const secBlocks = zSecteurs.map(sec => {
      const sColor = sec.color || zColor;
      const sComs = APP.commerciaux.filter(c=>c.secteurId===sec.id);
      if(!sComs.length) return '';
      return `
        <div style="margin-left:16px;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="width:6px;height:6px;border-radius:50%;background:${sColor}"></div>
            <span style="font-size:12px;font-weight:700;color:${sColor};text-transform:uppercase;letter-spacing:.05em">${sec.label}</span>
            <span style="font-size:10px;color:var(--text-2)">${sComs.length} comm. · ${secteurPDVCount(sec.id)} PDV</span>
            <button class="btn btn-sm btn-secondary" style="padding:2px 7px;font-size:10px;margin-left:auto" onclick="openSecteurModal('${sec.id}')">✏</button>
          </div>
          ${_renderComTable(sComs, sColor)}
        </div>`;
    }).join('');

    // Commerciaux dans cette zone sans secteur assigné
    const comsNoSect = APP.commerciaux.filter(c=>c.dispatchZoneId===z.id && !c.secteurId);
    const noSectBlock = comsNoSect.length ? `
      <div style="margin-left:16px;margin-bottom:12px">
        <div style="font-size:11px;color:var(--text-2);margin-bottom:6px;font-style:italic">Sans secteur assigné</div>
        ${_renderComTable(comsNoSect, zColor)}
      </div>` : '';

    zoneBlocks.push(`
    <div class="card mb-16" style="border-top:3px solid ${zColor}">
      <div style="padding:14px 18px 10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--border)">
        <div style="width:12px;height:12px;border-radius:50%;background:${zColor};box-shadow:0 0 8px ${zColor}88"></div>
        <span style="font-size:16px;font-weight:800;color:${zColor};letter-spacing:.04em;text-transform:uppercase">${z.label}</span>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="chip">${zSecteurs.length} secteur${zSecteurs.length!==1?'s':''}</span>
          <span class="chip">${zComs.length} commercial${zComs.length!==1?'s':''}</span>
          <span class="chip" style="color:var(--warning)">${zPDV} PDV</span>
          ${zBoul?`<span class="chip">${zBoul} 🏭 Boul.</span>`:''}
          ${zDist?`<span class="chip">${zDist} 🚛 Dist.</span>`:''}
        </div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="openZoneModal('${z.id}')">✏ Zone</button>
          <button class="btn btn-secondary btn-sm" onclick="openSecteurModal(null,'${z.id}')">+ Secteur</button>
          <button class="btn btn-danger btn-sm" onclick="deleteZone('${z.id}')">🗑</button>
        </div>
      </div>
      <div style="padding:12px 18px">
        ${secBlocks||''}${noSectBlock||''}
        ${!secBlocks && !noSectBlock ? '<div class="empty-state" style="padding:20px"><p>Aucun commercial dans cette zone</p></div>' : ''}
      </div>
    </div>`);
  });

  // Commerciaux sans zone
  const comsNoZone = APP.commerciaux.filter(c=>!c.dispatchZoneId || !zones.find(z=>z.id===c.dispatchZoneId));
  const noZoneBlock = comsNoZone.length ? `
  <div class="card mb-16" style="border-top:3px solid var(--text-3)">
    <div style="padding:14px 18px 10px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">
      <span style="font-size:14px;font-weight:700;color:var(--text-2)">⚠ Sans zone assignée</span>
      <span class="chip">${comsNoZone.length} commercial${comsNoZone.length!==1?'s':''}</span>
    </div>
    <div style="padding:12px 18px">${_renderComTable(comsNoZone, 'var(--text-2)')}</div>
  </div>` : '';

  document.getElementById('content').innerHTML = `
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div>
      <div class="page-title">Commerciaux</div>
      <div style="font-size:12px;color:var(--text-2);margin-top:2px">${APP.commerciaux.length} commerciaux · ${totalZones} zones · ${totalSecteurs} secteurs</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="showPage('territoire')">🗺 Zones & Secteurs</button>
      <button class="btn btn-secondary" onclick="showPage('pdv')">🏪 Points de Vente</button>
      <button class="btn btn-primary" onclick="openCommercialModal()">+ Ajouter commercial</button>
    </div>
  </div>
  ${kpiBar}
  <div style="font-size:11px;color:var(--text-2);margin-bottom:16px">
    💡 <strong>Double-cliquez</strong> sur un nom ou email pour modifier directement · Classement par <strong>Zone → Secteur → Commercial</strong>
  </div>
  ${APP.commerciaux.length===0 ? '<div class="empty-state"><p>Aucun commercial · <button class="btn btn-primary btn-sm" onclick="openCommercialModal()">+ Créer le premier</button></p></div>' : ''}
  ${zoneBlocks.join('')}
  ${noZoneBlock}`;

  APP.commerciaux.forEach(c=>attachComEditors(c));
}

function _renderComTable(coms, color) {
  if(!coms.length) return '';
  return `<div class="table-wrap"><table>
    <thead><tr>
      <th style="width:36px"></th><th>Nom</th><th>Prénom</th><th>Service</th><th>Tel</th>
      <th>PDV réels</th><th>Boul/Dist</th><th>Zone Dispatch</th><th>Bons</th><th>Retraits</th><th>Actions</th>
    </tr></thead>
    <tbody>${coms.map(c=>{
      const _norm = function(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase(); };
      const _fullA = _norm((c.prenom||'')+' '+(c.nom||''));
      const _fullB = _norm((c.nom||'')+' '+(c.prenom||''));
      const _matchBon = function(b){
        if (b.commercialId===c.id) return true;
        // Bon annuaire: ne jamais le rattacher a un commercial homonyme
        if (b._recipientType === 'annuaire') return false;
        if (!_fullA) return false;
        const _d = _norm(b.demandeur);
        const _r = _norm(b.recipiendaire);
        return (_d===_fullA||_d===_fullB||_r===_fullA||_r===_fullB);
      };
      const _matchedBons = APP.bons.filter(_matchBon);
      const _matchedBonIds = new Set(_matchedBons.map(function(b){return String(b.numero);}));
      const bonsCount = _matchedBonIds.size;
      // Retraits reels = lignes des bons valides + mouvements sortie manuels (sans ref Bon) de ce commercial
      const _retFromBons = _matchedBons.filter(function(b){return b.status==='validé';}).reduce(function(s,b){
        return s + (b.lignes||[]).reduce(function(sl,l){return sl + (parseInt(l.qty)||0);}, 0);
      }, 0);
      const _retFromManual = APP.mouvements.filter(function(m){
        if (m.type!=='sortie') return false;
        if (m.commercialId!==c.id) return false;
        return !/^(?:Modif |Suppression |Renvoi )?Bon\s+\S+/i.test(m.note||'');
      }).reduce(function(s,m){return s+m.qty;},0);
      const totalQty = _retFromBons + _retFromManual;
      const realPDV = comPDVCount(c.id);
      const boul = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.type==='boulangerie'&&p.actif!==false).length;
      const dist = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.type==='distributeur'&&p.actif!==false).length;
      const displayPDV = realPDV;
      const isDispatch = c.dispatchActive !== false;
      const z = (APP.zones||[]).find(x=>x.id===c.dispatchZoneId);
      const secteur = (APP.secteurs||[]).find(x=>x.id===c.secteurId);
      return `<tr id="com-row-${c.id}">
        <td><div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;overflow:hidden;flex-shrink:0">${c.photo?`<img src="${c.photo}" style="width:100%;height:100%;object-fit:cover">`:(c.prenom||'?').charAt(0).toUpperCase()}</div></td>
        <td class="editable" id="td-cnom-${c.id}" style="font-weight:700">${c.nom}</td>
        <td class="editable" id="td-cprenom-${c.id}">${c.prenom}</td>
        <td class="editable" id="td-cservice-${c.id}" style="font-size:12px;color:var(--text-2)">${c.service||'—'}</td>
        <td class="editable" id="td-ctel-${c.id}" style="font-size:12px;color:var(--text-2)">${c.tel||'—'}</td>
        <td style="font-weight:700;color:${color}">${displayPDV} <span style="font-size:10px;font-weight:400;color:var(--text-2)">PDV</span>${isDispatch?'<span style="margin-left:4px;font-size:9px;background:var(--accent)22;color:var(--accent);padding:1px 5px;border-radius:8px">dispatch</span>':''}</td>
        <td style="font-family:var(--font-mono);font-size:12px"><span style="color:var(--accent2)">${boul}🏭</span> <span style="color:var(--warning)">${dist}🚛</span></td>
        <td>${z?`<span style="background:${z.color||'var(--accent)'}22;color:${z.color||'var(--accent)'};border-radius:99px;padding:2px 8px;font-size:11px;font-weight:600">${z.label}</span>`:'<span style="color:var(--text-3);font-size:11px">—</span>'}${secteur?` <span style="background:${secteur.color||'#888'}22;color:${secteur.color||'#888'};border-radius:99px;padding:2px 8px;font-size:10px">${secteur.label}</span>`:''}</td>
        <td><span class="badge badge-blue">${bonsCount}</span></td>
        <td style="font-weight:600;color:var(--accent3)">${totalQty}</td>
        <td><div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-secondary" onclick="openCommercialModal('${c.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCommercial('${c.id}')">🗑</button>
        </div></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function attachComEditors(c) {
  const fields=[{id:'td-cnom-'+c.id,key:'nom'},{id:'td-cprenom-'+c.id,key:'prenom'},{id:'td-cservice-'+c.id,key:'service'},{id:'td-ctel-'+c.id,key:'tel'}];
  fields.forEach(f=>{
    const td=document.getElementById(f.id); if(!td) return;
    td.ondblclick=()=>{
      const old=c[f.key];
      makeEditable(td,c[f.key]||'','text',null,(v)=>{
        c[f.key]=v; auditLog('EDIT','commercial',c.id,{[f.key]:old},{[f.key]:v}); saveDB();
        renderCommerciaux();
      });
    };
  });
}

function openCommercialModal(id) {
  const c=id?APP.commerciaux.find(x=>x.id===id):null;
  const zoneOptions = (APP.zones||[]).map(z=>`<option value="${z.id}"${c?.dispatchZoneId===z.id?' selected':''}>${z.label}</option>`).join('');
  const secteurOptions = (APP.secteurs||[]).map(s=>`<option value="${s.id}"${c?.secteurId===s.id?' selected':''}>${s.label} (${getZoneLabel(s.zoneId)})</option>`).join('');
  openModal('modal-com', id?'Modifier commercial':'Nouveau commercial', `
    <div class="form-row">
      <div class="form-group"><label>Prénom *</label><input id="com-prenom" value="${c?.prenom||''}"></div>
      <div class="form-group"><label>Nom *</label><input id="com-nom" value="${c?.nom||''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Matricule <span style="font-size:10px;color:var(--text-3)">(unique \u2014 GMA-XXX)</span></label><input id="com-matricule" value="${c?.matricule||''}" placeholder="ex: GMA-042"></div>
      <div class="form-group"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Service</label><input id="com-service" value="${c?.service||''}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="com-email" value="${c?.email||''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>T\u00e9l\u00e9phone</label><input id="com-tel" value="${c?.tel||''}"></div>
      <div class="form-group"><label>PDV total <span style="font-size:10px;color:var(--text-2)">(auto = Boul + Dist)</span></label><input type="number" id="com-nbclients" value="${c?.nbClients||0}" min="0" readonly style="background:var(--bg-3);cursor:not-allowed"></div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:8px 12px;border-radius:8px;background:rgba(61,127,255,.06);border:1px solid rgba(61,127,255,.12)">
      <input type="checkbox" id="com-dispatch-active" ${(c?.dispatchActive!==false)?'checked':''} style="width:18px;height:18px;cursor:pointer">
      <label for="com-dispatch-active" style="cursor:pointer;font-size:13px;font-weight:600;color:var(--accent)">Inclure dans le dispatch</label>
      <span style="font-size:11px;color:var(--text-2);margin-left:auto">D\u00e9cochez pour exclure ce commercial du calcul de r\u00e9partition</span>
    </div>
    <div style="background:rgba(61,127,255,.06);border:1px solid rgba(61,127,255,.18);border-radius:var(--radius);padding:14px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em">🗺 Territoire</div>
      <div class="form-row">
        <div class="form-group">
          <label>Zone assignée</label>
          <select id="com-dzone">
            <option value="">— Sélectionner —</option>
            ${zoneOptions}
          </select>
          <div style="font-size:10px;color:var(--text-2);margin-top:4px">Si pas de zone, créez-en une dans <a href="#" onclick="closeModal();showPage('territoire')">Zones & Secteurs</a></div>
        </div>
        <div class="form-group">
          <label>Secteur assigné</label>
          <select id="com-secteur-id">
            <option value="">— Sélectionner —</option>
            ${secteurOptions}
          </select>
        </div>
      </div>
    </div>
    <div style="background:rgba(0,229,170,.06);border:1px solid rgba(0,229,170,.18);border-radius:var(--radius);padding:14px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:var(--accent2);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em">🏪 PDV Dispatch</div>
      <div class="form-row">
        <div class="form-group"><label>Boulangeries</label><input type="number" id="com-dboul" value="${c?.dispatchBoul||Math.round((c?.nbClients||0)*0.65)}" min="0" oninput="document.getElementById('com-nbclients').value=(parseInt(this.value)||0)+(parseInt(document.getElementById('com-ddist').value)||0)"></div>
        <div class="form-group"><label>Distributeurs</label><input type="number" id="com-ddist" value="${c?.dispatchDist||Math.round((c?.nbClients||0)*0.35)}" min="0" oninput="document.getElementById('com-nbclients').value=(parseInt(document.getElementById('com-dboul').value)||0)+(parseInt(this.value)||0)"></div>
      </div>
      <div style="font-size:11px;color:var(--text-2)">Ces valeurs seront utilisées par le moteur dispatch. Vous pouvez aussi saisir les PDV individuellement dans <a href="#" onclick="closeModal();showPage('pdv')">Points de Vente</a>.</div>
    </div>
    <div class="form-group">
      <label>Photo</label>
      <div style="display:flex;gap:12px;align-items:center">
        <div class="field-img" onclick="document.getElementById('com-photo-file').click()" id="com-photo-preview" style="width:56px;height:56px;border-radius:50%">
          ${c?.photo?`<img src="${c.photo}">`:'👤'}
        </div>
        <input type="file" id="com-photo-file" accept="image/*" style="display:none" onchange="loadImgPreview('com-photo-file','com-photo-preview','com-photo-data')">
        <input type="hidden" id="com-photo-data" value="${c?.photo||''}">
        <span style="font-size:12px;color:var(--text-2)">Cliquez pour changer</span>
      </div>
    </div>
    ${(()=>{
      var canEditSig = (typeof _canEditCommercialSignature==='function') && _canEditCommercialSignature();
      var existingSigSrc = (c && c.signatureKey && typeof _getSignature==='function') ? (_getSignature(c.signatureKey)||'') : '';
      _comSigPadAPI = null;
      return `
      <div class="form-group" style="margin-top:6px">
        <label>Signature digitalisée ${canEditSig?'':'<span style="font-size:10px;color:var(--text-3)">(lecture seule — perm spéciale requise)</span>'}</label>
        <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
          <div id="com-sig-preview" style="width:160px;height:60px;background:#fff;border:1px dashed var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden">
            ${existingSigSrc ? `<img src="${existingSigSrc}" style="max-width:160px;max-height:60px;object-fit:contain">` : `<span style="font-size:11px;color:#888">Aucune</span>`}
          </div>
          ${canEditSig ? `<div style="display:flex;flex-direction:column;gap:6px">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('com-sig-file').click()">📁 Importer</button>
            <button class="btn btn-secondary btn-sm" onclick="_comToggleDraw()">✍️ Dessiner</button>
            <button class="btn btn-danger btn-sm" onclick="_comClearSig()">🗑 Retirer</button>
          </div>` : ''}
          <input type="file" id="com-sig-file" accept="image/*" style="display:none" onchange="_comPreviewSigFile(this)">
          <input type="hidden" id="com-sig-data" value="">
          <input type="hidden" id="com-sig-existing-key" value="${c?.signatureKey||''}">
          <input type="hidden" id="com-sig-cleared" value="0">
          <input type="hidden" id="com-sig-can-edit" value="${canEditSig?'1':'0'}">
        </div>
        ${canEditSig ? `<div id="com-sig-canvas-wrap" style="display:none;margin-top:10px">
          <canvas id="com-sig-canvas" width="500" height="150" style="border:1px solid var(--border);background:#fff;border-radius:6px;cursor:crosshair;width:100%;max-width:500px;display:block"></canvas>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button class="btn btn-sm btn-secondary" onclick="_comClearCanvas()">Effacer</button>
            <button class="btn btn-sm btn-primary" onclick="_comValidateCanvas()">✓ Valider signature</button>
          </div>
        </div>` : ''}
      </div>`;
    })()}`,
  ()=>saveCommercial(id), 'modal-lg');
}

function _syncCommercialPDV(comId, wantBoul, wantDist) {
  if(!APP.pdv) APP.pdv = [];
  var com = APP.commerciaux.find(function(c){ return c.id === comId; });
  if(!com) return;
  var comLabel = (com.prenom||'') + ' ' + (com.nom||'');

  // Current real PDV for this commercial
  var curBoul = APP.pdv.filter(function(p){ return p.commercialId===comId && p.type==='boulangerie' && p.actif!==false; });
  var curDist = APP.pdv.filter(function(p){ return p.commercialId===comId && p.type==='distributeur' && p.actif!==false; });

  // Boulangeries: add or remove
  if(wantBoul > curBoul.length) {
    for(var i = curBoul.length + 1; i <= wantBoul; i++) {
      APP.pdv.push({
        id: generateId(),
        nom: 'Boulangerie ' + i + ' (' + com.nom + ')',
        type: 'boulangerie',
        commercialId: comId,
        zoneId: com.dispatchZoneId || '',
        secteurId: com.secteurId || '',
        adresse: '', contact: '', actif: true,
        createdAt: Date.now()
      });
    }
  } else if(wantBoul < curBoul.length) {
    // Remove excess (most recent first)
    var toRemove = curBoul.slice(wantBoul);
    var removeIds = {};
    toRemove.forEach(function(p){ removeIds[p.id] = true; });
    APP.pdv = APP.pdv.filter(function(p){ return !removeIds[p.id]; });
  }

  // Distributeurs: add or remove
  if(wantDist > curDist.length) {
    for(var j = curDist.length + 1; j <= wantDist; j++) {
      APP.pdv.push({
        id: generateId(),
        nom: 'Distributeur ' + j + ' (' + com.nom + ')',
        type: 'distributeur',
        commercialId: comId,
        zoneId: com.dispatchZoneId || '',
        secteurId: com.secteurId || '',
        adresse: '', contact: '', actif: true,
        createdAt: Date.now()
      });
    }
  } else if(wantDist < curDist.length) {
    var toRemoveD = curDist.slice(wantDist);
    var removeIdsD = {};
    toRemoveD.forEach(function(p){ removeIdsD[p.id] = true; });
    APP.pdv = APP.pdv.filter(function(p){ return !removeIdsD[p.id]; });
  }
}

async function saveCommercial(existingId) {
  const prenom = document.getElementById('com-prenom').value.trim();
  const nom = document.getElementById('com-nom').value.trim();
  if(!prenom||!nom){notify('Prénom et nom requis','danger');return;}
  const matricule = (document.getElementById('com-matricule')?.value||'').trim();
  if (matricule && !_isMatriculeUnique(matricule, existingId || null)) {
    notify('Matricule déjà utilisé (user/commercial/annuaire)','error'); return;
  }
  const photo = document.getElementById('com-photo-data').value;
  // Phase 7: signature handling (only if user has perm)
  const canEditSig = (document.getElementById('com-sig-can-edit')?.value === '1');
  const newSigDataUrl = canEditSig ? (document.getElementById('com-sig-data')?.value || '') : '';
  const existingSigKey = document.getElementById('com-sig-existing-key')?.value || '';
  const sigCleared = canEditSig && (document.getElementById('com-sig-cleared')?.value === '1');
  let finalSigKey = existingSigKey;
  if (canEditSig) {
    try {
      if (newSigDataUrl) {
        if (existingSigKey && typeof _deleteSignature === 'function') {
          try { await _deleteSignature(existingSigKey); } catch(e) {}
        }
        if (typeof _uploadSignature === 'function') {
          finalSigKey = await _uploadSignature(newSigDataUrl, 'sig');
        } else {
          finalSigKey = '';
        }
      } else if (sigCleared && existingSigKey) {
        if (typeof _deleteSignature === 'function') {
          try { await _deleteSignature(existingSigKey); } catch(e) {}
        }
        finalSigKey = '';
      }
    } catch(e) {
      console.warn('[PSM] Commercial sig op failed:', e);
      notify('Erreur signature: ' + (e.message || e), 'error');
      return;
    }
  }
  const fields = {
    prenom, nom, matricule,
    service: document.getElementById('com-service').value,
    email: document.getElementById('com-email').value,
    tel: document.getElementById('com-tel').value,
    dispatchBoul: parseInt(document.getElementById('com-dboul').value)||0,
    dispatchDist: parseInt(document.getElementById('com-ddist').value)||0,
    nbClients: (parseInt(document.getElementById('com-dboul').value)||0) + (parseInt(document.getElementById('com-ddist').value)||0),
    dispatchActive: document.getElementById('com-dispatch-active').checked,
    dispatchZoneId: document.getElementById('com-dzone').value||'',
    secteurId: document.getElementById('com-secteur-id').value||'',
    signatureKey: finalSigKey,
  };
  if(existingId) {
    const c = APP.commerciaux.find(x=>x.id===existingId);
    const old = {...c};
    Object.assign(c, fields);
    if(photo) c.photo = photo;
    auditLog('EDIT','commercial',c.id,old,c);
    notify('Commercial mis à jour ✓','success');
  } else {
    const nc = {id:generateId(),...fields,dispatchCustomRate:null,dispatchRateLocked:false,photo:photo||'',createdAt:Date.now(),_version:1};
    APP.commerciaux.push(nc);
    auditLog('CREATE','commercial',nc.id,null,nc);
    notify('Commercial ajouté ✓','success');
  }
  // Sync real PDV records with Boul/Dist values
  const comId = existingId || APP.commerciaux.find(x=>x.prenom===prenom&&x.nom===nom)?.id;
  if(comId) _syncCommercialPDV(comId, fields.dispatchBoul, fields.dispatchDist);

  saveDB(); closeModal(); renderCommerciaux();
  const saved = APP.commerciaux.find(x=>x.prenom===prenom&&x.nom===nom);
  if(saved) dInitCommercialDispatchFields(saved);
}

function deleteCommercial(id) {
  if(!confirm('Supprimer ce commercial ? Les PDV associés seront désassignés.')) return;
  (APP.pdv||[]).forEach(p=>{ if(p.commercialId===id) p.commercialId=''; });
  const idx = APP.commerciaux.findIndex(c=>c.id===id); if(idx<0) return;
  auditLog('DELETE','commercial',id,APP.commerciaux[idx],null);
  APP.commerciaux.splice(idx,1);
  // Nettoie les references dispatch (eligibilite + alloc fixe) pour eviter les orphelins
  if (APP.dispatch) {
    if (APP.dispatch.eligibility) {
      Object.keys(APP.dispatch.eligibility).forEach(function(aid){
        if (APP.dispatch.eligibility[aid] && APP.dispatch.eligibility[aid][id] !== undefined) {
          delete APP.dispatch.eligibility[aid][id];
        }
      });
    }
    if (APP.dispatch.fixedAlloc) {
      Object.keys(APP.dispatch.fixedAlloc).forEach(function(aid){
        if (APP.dispatch.fixedAlloc[aid] && APP.dispatch.fixedAlloc[aid][id] !== undefined) {
          delete APP.dispatch.fixedAlloc[aid][id];
        }
      });
    }
  }
  saveDB(); renderCommerciaux();
  notify('Commercial supprimé','warning');
}

// ============================================================
// PAGE : TERRITOIRE (Zones & Secteurs)
// ============================================================
function renderTerritoire() {
  const zones = APP.zones||[];
  const secteurs = APP.secteurs||[];

  const totalPDVReg = (APP.pdv||[]).filter(p=>p.actif!==false).length;
  const totalComs = APP.commerciaux.length;

  document.getElementById('content').innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
    <div>
      <div class="page-title">🗺 Zones & Secteurs</div>
      <div style="font-size:12px;color:var(--text-2);margin-top:2px">${zones.length} zones · ${secteurs.length} secteurs · ${totalPDVReg} PDV · ${totalComs} commerciaux</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-secondary" onclick="showPage('commerciaux')">👥 Commerciaux</button>
      <button class="btn btn-secondary" onclick="showPage('pdv')">🏪 PDV</button>
      <button class="btn btn-secondary" onclick="openSecteurModal()">+ Secteur</button>
      <button class="btn btn-primary" onclick="openZoneModal()">+ Zone</button>
    </div>
  </div>

  <div id="territoire-content">${_buildTerritoireContent()}</div>`;
}

function _buildTerritoireContent() {
  const zones = APP.zones||[];
  const secteurs = APP.secteurs||[];
  if(!zones.length) return `
    <div class="empty-state" style="padding:60px">
      <div style="font-size:48px;margin-bottom:12px">🗺</div>
      <p style="font-size:16px;font-weight:600;margin-bottom:8px">Aucune zone définie</p>
      <p style="font-size:13px">Commencez par créer vos zones géographiques (ex: NORD, SUD, CENTRE…)</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="openZoneModal()">+ Créer la première zone</button>
    </div>`;

  return zones.map((z,zi) => {
    const color = z.color || ['#3d7fff','#00e5aa','#ff6b35','#ffa502','#9b59b6','#e91e63'][zi%6];
    const zSecteurs = secteurs.filter(s=>s.zoneId===z.id);
    const zComs = APP.commerciaux.filter(c=>c.dispatchZoneId===z.id);
    const zPDV = zonePDVCount(z.id);
    return `
    <div class="card mb-16" style="border-left:4px solid ${color}">
      <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color}88;flex-shrink:0"></div>
        <div style="flex:1">
          <span style="font-size:18px;font-weight:800;color:${color};letter-spacing:.03em;text-transform:uppercase">${z.label}</span>
          ${z.description?`<div style="font-size:11px;color:var(--text-2);margin-top:1px">${z.description}</div>`:''}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="chip">${zSecteurs.length} secteur${zSecteurs.length!==1?'s':''}</span>
          <span class="chip">${zComs.length} commercial${zComs.length!==1?'s':''}</span>
          <span class="chip" style="color:var(--warning)">${zPDV} PDV</span>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="openZoneModal('${z.id}')">✏ Modifier</button>
          <button class="btn btn-secondary btn-sm" onclick="openSecteurModal(null,'${z.id}')">+ Secteur</button>
          <button class="btn btn-danger btn-sm" onclick="deleteZone('${z.id}')">🗑</button>
        </div>
      </div>
      <div style="padding:14px 18px">
        ${!zSecteurs.length ? `<div style="font-size:12px;color:var(--text-2);font-style:italic;margin-bottom:10px">Aucun secteur — <button class="btn btn-secondary btn-sm" onclick="openSecteurModal(null,'${z.id}')">+ Créer un secteur</button></div>` : ''}
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px">
          ${zSecteurs.map(s => {
            const sColor = s.color || color;
            const sComs = APP.commerciaux.filter(c=>c.secteurId===s.id);
            const sPDV = secteurPDVCount(s.id);
            return `
            <div style="background:var(--bg-2);border:1px solid var(--border);border-left:3px solid ${sColor};border-radius:var(--radius);padding:12px">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <span style="font-size:13px;font-weight:700;color:${sColor}">${s.label}</span>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-secondary btn-sm" style="padding:2px 7px;font-size:10px" onclick="openSecteurModal('${s.id}')">✏</button>
                  <button class="btn btn-danger btn-sm" style="padding:2px 7px;font-size:10px" onclick="deleteSecteur('${s.id}')">✕</button>
                </div>
              </div>
              <div style="font-size:11px;color:var(--text-2);display:flex;gap:10px;margin-bottom:8px">
                <span>${sComs.length} comm.</span>
                <span>${sPDV} PDV</span>
              </div>
              ${sComs.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px">
                ${sComs.map(c=>`<span style="background:${sColor}22;color:${sColor};border-radius:99px;padding:2px 8px;font-size:10px;font-weight:600;cursor:pointer" onclick="openCommercialModal('${c.id}')" title="Modifier">${c.prenom} ${c.nom}</span>`).join('')}
              </div>` : `<span style="font-size:11px;color:var(--text-3);font-style:italic">Aucun commercial assigné</span>`}
            </div>`;
          }).join('')}
        </div>
        ${zComs.filter(c=>!c.secteurId||!secteurs.find(s=>s.id===c.secteurId&&s.zoneId===z.id)).length ? `
        <div style="margin-top:10px;padding:10px 12px;background:var(--bg-3);border-radius:var(--radius);border:1px dashed var(--border)">
          <span style="font-size:11px;color:var(--text-2)">Sans secteur : </span>
          ${zComs.filter(c=>!c.secteurId||!secteurs.find(s=>s.id===c.secteurId&&s.zoneId===z.id)).map(c=>`<span style="background:${color}22;color:${color};border-radius:99px;padding:2px 8px;font-size:10px;font-weight:600;cursor:pointer" onclick="openCommercialModal('${c.id}')">${c.prenom} ${c.nom}</span>`).join(' ')}
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// Zone CRUD
function openZoneModal(id) {
  const z = id?(APP.zones||[]).find(x=>x.id===id):null;
  openModal('zone-modal', id?'Modifier zone':'Nouvelle zone', `
    <div class="form-group"><label>Nom de la zone *</label><input id="zone-label" value="${z?.label||''}" placeholder="Ex: NORD, SUD, ABIDJAN..."></div>
    <div class="form-group"><label>Description</label><input id="zone-desc" value="${z?.description||''}" placeholder="Ex: Région nord d'Abidjan"></div>
    <div class="form-group"><label>Couleur</label><input type="color" id="zone-color" value="${z?.color||'#3d7fff'}" style="height:44px;cursor:pointer;padding:4px"></div>`,
  () => {
    const label = document.getElementById('zone-label').value.trim();
    if(!label){notify('Nom requis','danger');return;}
    const color = document.getElementById('zone-color').value;
    const desc = document.getElementById('zone-desc').value;
    if(!APP.zones) APP.zones=[];
    if(id) {
      const z = APP.zones.find(x=>x.id===id);
      Object.assign(z,{label,color,description:desc});
      notify('Zone mise à jour ✓','success');
    } else {
      APP.zones.push({id:generateId(),label,color,description:desc,createdAt:Date.now()});
      notify('Zone créée ✓','success');
    }
    saveDB(); closeModal();
    if(currentPage==='territoire') renderTerritoire();
    else if(currentPage==='commerciaux') renderCommerciaux();
    renderSidebar();
  });
}
function deleteZone(id) {
  const z = (APP.zones||[]).find(x=>x.id===id);
  if(!z) return;
  const comCount = APP.commerciaux.filter(c=>c.dispatchZoneId===id).length;
  const secCount = (APP.secteurs||[]).filter(s=>s.zoneId===id).length;
  if(!confirm(`Supprimer la zone "${z.label}" ?\n${comCount} commerciaux et ${secCount} secteurs seront désassignés.`)) return;
  APP.commerciaux.forEach(c=>{if(c.dispatchZoneId===id)c.dispatchZoneId='';});
  (APP.secteurs||[]).forEach(s=>{if(s.zoneId===id)s.zoneId='';});
  (APP.pdv||[]).forEach(p=>{if(p.zoneId===id)p.zoneId='';});
  APP.zones = APP.zones.filter(x=>x.id!==id);
  saveDB(); notify('Zone supprimée','warning');
  if(currentPage==='territoire') renderTerritoire();
  else renderCommerciaux();
}

// Secteur CRUD
function openSecteurModal(id, preZoneId) {
  const s = id?(APP.secteurs||[]).find(x=>x.id===id):null;
  const zoneOptions = (APP.zones||[]).map(z=>`<option value="${z.id}"${(s?.zoneId||preZoneId||'')==z.id?' selected':''}>${z.label}</option>`).join('');
  openModal('sect-modal', id?'Modifier secteur':'Nouveau secteur', `
    <div class="form-group"><label>Nom du secteur *</label><input id="sect-label" value="${s?.label||''}" placeholder="Ex: Secteur Plateau, Zone Cocody..."></div>
    <div class="form-group"><label>Zone parente *</label>
      <select id="sect-zone"><option value="">— Sélectionner —</option>${zoneOptions}</select>
    </div>
    <div class="form-group"><label>Couleur</label><input type="color" id="sect-color" value="${s?.color||'#00e5aa'}" style="height:44px;cursor:pointer;padding:4px"></div>
    <div class="form-group"><label>Description</label><input id="sect-desc" value="${s?.description||''}"></div>`,
  () => {
    const label = document.getElementById('sect-label').value.trim();
    const zoneId = document.getElementById('sect-zone').value;
    if(!label){notify('Nom requis','danger');return;}
    const color = document.getElementById('sect-color').value;
    const desc = document.getElementById('sect-desc').value;
    if(!APP.secteurs) APP.secteurs=[];
    if(id) {
      const s = APP.secteurs.find(x=>x.id===id);
      Object.assign(s,{label,zoneId,color,description:desc});
      notify('Secteur mis à jour ✓','success');
    } else {
      APP.secteurs.push({id:generateId(),label,zoneId,color,description:desc,createdAt:Date.now()});
      notify('Secteur créé ✓','success');
    }
    saveDB(); closeModal();
    if(currentPage==='territoire') renderTerritoire();
    else if(currentPage==='commerciaux') renderCommerciaux();
  });
}
function deleteSecteur(id) {
  const s = (APP.secteurs||[]).find(x=>x.id===id);
  if(!s) return;
  const comCount = APP.commerciaux.filter(c=>c.secteurId===id).length;
  if(!confirm(`Supprimer le secteur "${s.label}" ?\n${comCount} commerciaux seront désassignés.`)) return;
  APP.commerciaux.forEach(c=>{if(c.secteurId===id)c.secteurId='';});
  (APP.pdv||[]).forEach(p=>{if(p.secteurId===id)p.secteurId='';});
  APP.secteurs = APP.secteurs.filter(x=>x.id!==id);
  saveDB(); notify('Secteur supprimé','warning');
  if(currentPage==='territoire') renderTerritoire();
  else renderCommerciaux();
}

// ============================================================
// PAGE : PDV (Points de Vente)
// ============================================================
function buildPDVTooltip(p) {
  const lines = [];
  if(p.contact) lines.push('📞 ' + p.contact);
  if(p.adresse) lines.push('📍 ' + p.adresse);
  const z = (APP.zones||[]).find(x=>x.id===p.zoneId);
  if(z) lines.push('🗺 ' + z.label);
  const s = (APP.secteurs||[]).find(x=>x.id===p.secteurId);
  if(s) lines.push('📌 ' + s.label);
  const c = APP.commerciaux.find(x=>x.id===p.commercialId);
  if(c) lines.push('👤 ' + c.prenom + ' ' + c.nom);
  return lines.join('<br>') || '—';
}

let _pdvSearch='', _pdvZone='all', _pdvType='all', _pdvCom='all';
let _pdvSelectMode = false, _pdvSelected = new Set();

function renderPDV() {
  const pdv = APP.pdv||[];
  const boul = pdv.filter(p=>p.type==='boulangerie'&&p.actif!==false).length;
  const dist = pdv.filter(p=>p.type==='distributeur'&&p.actif!==false).length;
  const inactif = pdv.filter(p=>p.actif===false).length;

  document.getElementById('content').innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
    <div>
      <div class="page-title">🏪 Points de Vente</div>
      <div style="font-size:12px;color:var(--text-2);margin-top:2px">${pdv.length} PDV total · ${boul} boulangeries · ${dist} distributeurs · ${inactif} inactifs</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="togglePdvSelectMode()" id="pdv-select-btn">${_pdvSelectMode?'Annuler s\u00e9lection':'\u2610 S\u00e9lectionner'}</button>
      <button class="btn btn-secondary btn-sm" onclick="importPDVCSV()">📥 Import CSV</button>
      <button class="btn btn-secondary btn-sm" onclick="exportPDVCSV()">📤 Export CSV</button>
      <button class="btn btn-secondary" onclick="showPage('territoire')">🗺 Zones</button>
      <button class="btn btn-primary" onclick="openPDVModal()">+ Ajouter PDV</button>
    </div>
  </div>

  <div class="grid-4 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">Total PDV</span></div><div class="kpi-value" style="color:var(--accent)">${pdv.filter(p=>p.actif!==false).length}</div><div class="kpi-change">actifs</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Boulangeries</span></div><div class="kpi-value" style="color:var(--accent2)">🏭 ${boul}</div><div class="kpi-change">${pdv.filter(p=>p.type==='boulangerie'&&p.actif!==false).length > 0 ? Math.round(boul/Math.max(1,boul+dist)*100)+'%':'—'} du total</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Distributeurs</span></div><div class="kpi-value" style="color:var(--warning)">🚛 ${dist}</div><div class="kpi-change">${pdv.filter(p=>p.type==='distributeur'&&p.actif!==false).length > 0 ? Math.round(dist/Math.max(1,boul+dist)*100)+'%':'—'} du total</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Commerciaux couverts</span></div><div class="kpi-value" style="color:var(--success)">${new Set(pdv.filter(p=>p.commercialId&&p.actif!==false).map(p=>p.commercialId)).size}</div><div class="kpi-change">sur ${APP.commerciaux.length} total</div></div>
  </div>

  <div class="filters mb-16">
    <div class="search-bar" style="flex:1;max-width:280px">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input id="pdv-search" placeholder="Rechercher nom, adresse..." oninput="_pdvSearch=this.value;_renderPDVTable()" value="${_pdvSearch}">
    </div>
    <select id="pdv-zone" onchange="_pdvZone=this.value;_renderPDVTable()" style="width:auto">
      <option value="all">Toutes les zones</option>
      ${(APP.zones||[]).map(z=>`<option value="${z.id}"${_pdvZone===z.id?' selected':''}>${z.label}</option>`).join('')}
    </select>
    <select id="pdv-type" onchange="_pdvType=this.value;_renderPDVTable()" style="width:auto">
      <option value="all">Tous types</option>
      <option value="boulangerie"${_pdvType==='boulangerie'?' selected':''}>🏭 Boulangeries</option>
      <option value="distributeur"${_pdvType==='distributeur'?' selected':''}>🚛 Distributeurs</option>
    </select>
    <select id="pdv-com" onchange="_pdvCom=this.value;_renderPDVTable()" style="width:auto">
      <option value="all">Tous commerciaux</option>
      ${APP.commerciaux.map(c=>`<option value="${c.id}"${_pdvCom===c.id?' selected':''}>${c.prenom} ${c.nom}</option>`).join('')}
    </select>
    <label style="display:flex;align-items:center;gap:6px;font-size:12px;text-transform:none;letter-spacing:0;margin:0;cursor:pointer">
      <input type="checkbox" id="pdv-show-inactif" onchange="_renderPDVTable()" style="width:auto"> Afficher inactifs
    </label>
  </div>

  <div id="pdv-table-wrap"></div>`;
  _renderPDVTable();
}

function _renderPDVTable() {
  const showInactif = document.getElementById('pdv-show-inactif')?.checked;
  const needle = _normSearch(_pdvSearch);
  let pdv = (APP.pdv||[]).filter(p => {
    if(!showInactif && p.actif===false) return false;
    if(needle) {
      const z = (APP.zones||[]).find(x=>x.id===p.zoneId);
      const s = (APP.secteurs||[]).find(x=>x.id===p.secteurId);
      const c = APP.commerciaux.find(x=>x.id===p.commercialId);
      const hay = _normSearch([p.nom,p.adresse,p.contact,p.tel,p.email,p.type,z&&z.label,s&&s.label,c&&(c.prenom+' '+c.nom)].filter(Boolean).join(' '));
      if(!hay.includes(needle)) return false;
    }
    if(_pdvZone!=='all' && p.zoneId!==_pdvZone) return false;
    if(_pdvType!=='all' && p.type!==_pdvType) return false;
    if(_pdvCom!=='all' && p.commercialId!==_pdvCom) return false;
    return true;
  });
  const wrap = document.getElementById('pdv-table-wrap'); if(!wrap) return;
  if(!pdv.length){wrap.innerHTML='<div class="empty-state"><p>Aucun PDV trouvé</p></div>';return;}

  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr>
      ${_pdvSelectMode?'<th style="width:36px"><input type="checkbox" onchange="togglePdvSelectAll(this.checked)" style="width:16px;height:16px;cursor:pointer"></th>':''}
      <th>Nom du PDV</th><th>Type</th><th>Zone</th><th>Secteur</th><th>Commercial</th><th>Adresse</th><th>Contact</th><th>Statut</th><th>Actions</th>
    </tr></thead>
    <tbody>${pdv.map(p=>{
      const z = (APP.zones||[]).find(x=>x.id===p.zoneId);
      const s = (APP.secteurs||[]).find(x=>x.id===p.secteurId);
      const c = APP.commerciaux.find(x=>x.id===p.commercialId);
      const actif = p.actif!==false;
      return `<tr style="${actif?'':'opacity:.5'}${_pdvSelectMode&&_pdvSelected.has(p.id)?';background:rgba(99,102,241,.08)':''}">
        ${_pdvSelectMode?`<td><input type="checkbox" ${_pdvSelected.has(p.id)?'checked':''} onchange="togglePdvSelect('${p.id}')" style="width:16px;height:16px;cursor:pointer"></td>`:''}
        <td style="font-weight:600"><div class="pdv-name-wrap">${p.nom||'—'}<div class="pdv-tooltip">${buildPDVTooltip(p)}</div></div></td>
        <td>${p.type==='boulangerie'?'<span class="badge badge-teal">🏭 Boulangerie</span>':'<span class="badge badge-yellow">🚛 Distributeur</span>'}</td>
        <td>${z?`<span style="background:${z.color}22;color:${z.color};border-radius:99px;padding:2px 8px;font-size:11px;font-weight:600">${z.label}</span>`:'<span class="badge badge-gray">—</span>'}</td>
        <td>${s?`<span style="background:${s.color||'#888'}22;color:${s.color||'#888'};border-radius:99px;padding:2px 8px;font-size:11px">${s.label}</span>`:'—'}</td>
        <td>${c?`<span style="font-size:12px">${c.prenom} ${c.nom}</span>`:'<span style="color:var(--text-3)">—</span>'}</td>
        <td style="font-size:12px;color:var(--text-2)">${p.adresse||'—'}</td>
        <td style="font-size:12px">${p.contact||'—'}</td>
        <td>${actif?'<span class="badge badge-green">Actif</span>':'<span class="badge badge-gray">Inactif</span>'}</td>
        <td><div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-secondary" onclick="openPDVModal('${p.id}')">✏️</button>
          <button class="btn btn-sm ${actif?'btn-warning':'btn-success'}" onclick="togglePDVActif('${p.id}')">${actif?'⏸':'▶'}</button>
          <button class="btn btn-sm btn-danger" onclick="deletePDV('${p.id}')">🗑</button>
        </div></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>
  <div style="font-size:11px;color:var(--text-2);margin-top:8px">Affichage : ${pdv.length} PDV</div>
  ${_pdvSelectMode?'<div id="pdv-select-bar" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--bg-1);border:1px solid var(--border);border-radius:12px;padding:10px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,.18);z-index:999"><span id="pdv-select-count" style="font-size:13px;font-weight:600;color:var(--text-1)">'+_pdvSelected.size+' s\u00e9lectionn\u00e9(s)</span><button class="btn btn-danger btn-sm" onclick="deletePdvSelection()" style="font-weight:600">\ud83d\uddd1 Supprimer la s\u00e9lection</button><button class="btn btn-secondary btn-sm" onclick="togglePdvSelectMode()">Annuler</button></div>':''}`;
}

function openPDVModal(id) {
  const p = id?(APP.pdv||[]).find(x=>x.id===id):null;
  const zoneOptions = (APP.zones||[]).map(z=>`<option value="${z.id}"${p?.zoneId===z.id?' selected':''}>${z.label}</option>`).join('');
  const secteurOptions = (APP.secteurs||[]).map(s=>`<option value="${s.id}"${p?.secteurId===s.id?' selected':''}>${s.label} (${getZoneLabel(s.zoneId)})</option>`).join('');
  const comOptions = APP.commerciaux.map(c=>`<option value="${c.id}"${p?.commercialId===c.id?' selected':''}>${c.prenom} ${c.nom}</option>`).join('');
  openModal('pdv-modal', id?'Modifier PDV':'Nouveau PDV', `
    <div class="form-row">
      <div class="form-group"><label>Nom du PDV *</label><input id="pdv-nom" value="${p?.nom||''}" placeholder="Ex: Boulangerie Centrale"></div>
      <div class="form-group"><label>Type *</label>
        <select id="pdv-type-sel">
          <option value="boulangerie"${p?.type==='boulangerie'||!p?' selected':''}>🏭 Boulangerie</option>
          <option value="distributeur"${p?.type==='distributeur'?' selected':''}>🚛 Distributeur</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Zone</label>
        <select id="pdv-zone-sel"><option value="">— Sélectionner —</option>${zoneOptions}</select>
      </div>
      <div class="form-group"><label>Secteur</label>
        <select id="pdv-sect-sel"><option value="">— Sélectionner —</option>${secteurOptions}</select>
      </div>
    </div>
    <div class="form-group"><label>Commercial assigné</label>
      <select id="pdv-com-sel"><option value="">— Sélectionner —</option>${comOptions}</select>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Adresse</label><input id="pdv-adresse" value="${p?.adresse||''}" placeholder="Ex: Rue du Commerce, Cocody"></div>
      <div class="form-group"><label>Contact / Tel</label><input id="pdv-contact" value="${p?.contact||''}"></div>
    </div>
`,
  () => {
    const nom = document.getElementById('pdv-nom').value.trim();
    if(!nom){notify('Nom requis','danger');return;}
    if(!APP.pdv) APP.pdv=[];
    const fields = {
      nom,
      type: document.getElementById('pdv-type-sel').value,
      zoneId: document.getElementById('pdv-zone-sel').value||'',
      secteurId: document.getElementById('pdv-sect-sel').value||'',
      commercialId: document.getElementById('pdv-com-sel').value||'',
      adresse: document.getElementById('pdv-adresse').value,
      contact: document.getElementById('pdv-contact').value,
      actif: true,
    };
    if(id) {
      const px = APP.pdv.find(x=>x.id===id);
      Object.assign(px, fields);
      notify('PDV mis à jour ✓','success');
    } else {
      APP.pdv.push({id:generateId(),...fields,createdAt:Date.now()});
      notify('PDV ajouté ✓','success');
    }
    saveDB(); closeModal(); renderPDV();
  }, 'modal-lg');
}

function togglePDVActif(id) {
  const p = (APP.pdv||[]).find(x=>x.id===id); if(!p) return;
  p.actif = p.actif===false ? true : false;
  saveDB(); _renderPDVTable();
  notify(p.actif?'PDV activé ✓':'PDV désactivé','info');
}

function deletePDV(id) {
  if(!confirm('Supprimer ce PDV ?')) return;
  APP.pdv = (APP.pdv||[]).filter(x=>x.id!==id);
  saveDB(); _renderPDVTable();
  notify('PDV supprimé','warning');
}

function togglePdvSelectMode() {
  _pdvSelectMode = !_pdvSelectMode;
  _pdvSelected.clear();
  renderPDV();
}

function togglePdvSelectAll(checked) {
  const showInactif = document.getElementById('pdv-show-inactif')?.checked;
  const pdv = (APP.pdv||[]).filter(function(p) {
    if(!showInactif && p.actif===false) return false;
    if(_pdvSearch && !p.nom?.toLowerCase().includes(_pdvSearch.toLowerCase()) && !p.adresse?.toLowerCase().includes(_pdvSearch.toLowerCase())) return false;
    if(_pdvZone!=='all' && p.zoneId!==_pdvZone) return false;
    if(_pdvType!=='all' && p.type!==_pdvType) return false;
    if(_pdvCom!=='all' && p.commercialId!==_pdvCom) return false;
    return true;
  });
  _pdvSelected.clear();
  if(checked) pdv.forEach(function(p){ _pdvSelected.add(p.id); });
  _renderPDVTable();
}

function togglePdvSelect(id) {
  if(_pdvSelected.has(id)) _pdvSelected.delete(id); else _pdvSelected.add(id);
  _renderPDVTable();
}

function deletePdvSelection() {
  if(_pdvSelected.size===0){notify('Aucun PDV s\u00e9lectionn\u00e9','warning');return;}
  if(!confirm('Supprimer '+_pdvSelected.size+' PDV ?')) return;
  APP.pdv = (APP.pdv||[]).filter(function(p){ return !_pdvSelected.has(p.id); });
  var count = _pdvSelected.size;
  _pdvSelected.clear();
  _pdvSelectMode = false;
  saveDB();
  renderPDV();
  notify(count+' PDV supprim\u00e9(s) \u2713','success');
  auditLog('DELETE','pdv',count+' PDV supprim\u00e9s en lot');
}

function exportPDVCSV() {
  const headers = ['Nom','Type','Zone','Secteur','Commercial','Adresse','Contact','Actif'];
  const rows = (APP.pdv||[]).map(p=>[
    p.nom, p.type, getZoneLabel(p.zoneId), getSecteurLabel(p.secteurId),
    getCommercialLabel(p.commercialId), p.adresse||'', p.contact||'', p.actif!==false?'Oui':'Non'
  ].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','));
  downloadFile([headers.join(','),...rows].join('\n'), 'pdv-export-'+Date.now()+'.csv','text/csv');
  notify('Export CSV téléchargé ✓','success');
}

function importPDVCSV() {
  const input = document.createElement('input');
  input.type='file'; input.accept='.csv';
  input.onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.split('\n').filter(l=>l.trim());
      if(lines.length<2){notify('CSV vide ou invalide','error');return;}
      let added=0;
      for(let i=1;i<lines.length;i++){
        const cols = lines[i].split(',').map(v=>v.trim().replace(/^"|"$/g,''));
        if(!cols[0]) continue;
        const nom=cols[0], type=cols[1]==='distributeur'?'distributeur':'boulangerie', adresse=cols[4]||'', contact=cols[5]||'';
        const zone = (APP.zones||[]).find(z=>z.label.toLowerCase()===((cols[2]||'').toLowerCase()));
        const sect = (APP.secteurs||[]).find(s=>s.label.toLowerCase()===((cols[3]||'').toLowerCase()));
        const com = APP.commerciaux.find(c=>(c.prenom+' '+c.nom).toLowerCase()===((cols[4]||'').toLowerCase()));
        if(!APP.pdv) APP.pdv=[];
        APP.pdv.push({id:generateId(),nom,type,zoneId:zone?.id||'',secteurId:sect?.id||'',commercialId:com?.id||'',adresse,contact,obs:'',actif:true,createdAt:Date.now()});
        added++;
      }
      saveDB(); renderPDV();
      notify(`${added} PDV importés ✓`,'success');
    };
    reader.readAsText(file);
  };
  input.click();
}

// ============================================================
// FOURNISSEURS
// ============================================================
function renderFournisseurs() {
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">${t('fournisseurs')}</div>
    <button class="btn btn-primary" onclick="openFournModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Ajouter</button>
  </div>
  <div style="font-size:11px;color:var(--text-2);margin-bottom:12px">💡 <strong>Double-cliquez</strong> sur une cellule pour modifier directement</div>
  <div class="table-wrap"><table>
    <thead><tr><th>${t('contact_name')}</th><th>${t('company')}</th><th>Email / ${t('contact')}</th><th>${t('phone')}</th><th>${t('address')}</th><th>${t('orders')}</th><th>${t('actions')}</th></tr></thead>
    <tbody>${APP.fournisseurs.length===0?`<tr><td colspan="7"><div class="empty-state"><p>Aucun fournisseur</p></div></td></tr>`:APP.fournisseurs.map(f=>renderFournRow(f)).join('')}</tbody>
  </table></div>`;
  APP.fournisseurs.forEach(f=>attachFournEditors(f));
}

function renderFournRow(f) {
  const cmds=(APP.commandesFourn||[]).filter(c=>c.fournisseurId===f.id).length;
  return `<tr id="fourn-row-${f.id}">
    <td class="editable" id="td-fname-${f.id}" style="font-weight:600">${f.nom}</td>
    <td class="editable" id="td-fentreprise-${f.id}" style="font-size:12px;color:var(--accent)">${f.entreprise||'—'}</td>
    <td class="editable" id="td-fcontact-${f.id}" style="font-size:12px">${f.contact||'—'}</td>
    <td class="editable" id="td-ftel-${f.id}" style="font-size:12px">${f.tel||'—'}</td>
    <td class="editable" id="td-fadresse-${f.id}" style="font-size:12px">${f.adresse||'—'}</td>
    <td><span class="badge badge-blue">${cmds}</span></td>
    <td><div style="display:flex;gap:6px">
      <button class="btn btn-sm btn-secondary" onclick="openFournArticlesModal('${f.id}')" title="Gérer les articles">📦</button>
      <button class="btn btn-sm btn-secondary" onclick="viewFournDetail('${f.id}')">📊 Suivi</button>
      <button class="btn btn-sm btn-danger" onclick="deleteFourn('${f.id}')">🗑</button>
    </div></td>
  </tr>`;
}

function attachFournEditors(f) {
  const fields=[{id:'td-fname-'+f.id,key:'nom'},{id:'td-fentreprise-'+f.id,key:'entreprise'},{id:'td-fcontact-'+f.id,key:'contact'},{id:'td-ftel-'+f.id,key:'tel'},{id:'td-fadresse-'+f.id,key:'adresse'}];
  fields.forEach(fl=>{
    const td=document.getElementById(fl.id); if(!td) return;
    td.ondblclick=()=>{
      const old=f[fl.key];
      makeEditable(td,f[fl.key]||'','text',null,(v)=>{
        f[fl.key]=v; auditLog('EDIT','fournisseur',f.id,{[fl.key]:old},{[fl.key]:v}); saveDB();
        renderFournisseurs();
      });
    };
  });
}

function openFournModal(id) {
  const f=id?APP.fournisseurs.find(x=>x.id===id):null;
  openModal('fourn',id?'Modifier fournisseur':'Nouveau fournisseur',`
    <div class="form-row">
      <div class="form-group"><label>Nom du contact *</label><input id="fn-nom" value="${f?.nom||''}" placeholder="Ex: Jean Kouamé"></div>
      <div class="form-group"><label>Entreprise / Société</label><input id="fn-entreprise" value="${f?.entreprise||''}" placeholder="Ex: PromoPlus SARL"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Email / Contact</label><input id="fn-contact" value="${f?.contact||''}"></div>
      <div class="form-group"><label>Téléphone</label><input id="fn-tel" value="${f?.tel||''}"></div>
    </div>
    <div class="form-group"><label>Adresse</label><textarea id="fn-adresse" rows="2">${f?.adresse||''}</textarea></div>`,
  ()=>{
    const nom=document.getElementById('fn-nom').value.trim();
    if(!nom){notify('Nom du contact requis','danger');return;}
    const entreprise=document.getElementById('fn-entreprise').value.trim();
    if(f){
      const old={...f};
      Object.assign(f,{nom,entreprise,contact:document.getElementById('fn-contact').value,tel:document.getElementById('fn-tel').value,adresse:document.getElementById('fn-adresse').value});
      auditLog('EDIT','fournisseur',f.id,old,f); notify('Fournisseur mis à jour','success');
    } else {
      const nf={id:generateId(),nom,entreprise,contact:document.getElementById('fn-contact').value,tel:document.getElementById('fn-tel').value,adresse:document.getElementById('fn-adresse').value,createdAt:Date.now()};
      APP.fournisseurs.push(nf); auditLog('CREATE','fournisseur',nf.id,null,nf); notify('Fournisseur ajouté','success');
    }
    saveDB(); closeModal(); renderFournisseurs();
  });
}

function deleteFourn(id) {
  if(!confirm('Supprimer ce fournisseur ?')) return;
  const idx=APP.fournisseurs.findIndex(f=>f.id===id); if(idx<0) return;
  auditLog('DELETE','fournisseur',id,APP.fournisseurs[idx],null);
  APP.fournisseurs.splice(idx,1); saveDB(); renderFournisseurs();
  notify('Fournisseur supprimé','success');
}

function openFournArticlesModal(fournId) {
  const f = APP.fournisseurs.find(x=>x.id===fournId); if(!f) return;
  const assigned = APP.articles.filter(a=>a.fournisseurId===fournId);
  const unassigned = APP.articles.filter(a=>a.fournisseurId!==fournId);
  const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-2)">Fournisseur: <strong style="color:var(--accent)">${f.nom}</strong> ${f.entreprise?'('+f.entreprise+')':''}</div>
    <div style="margin-bottom:8px;font-weight:600;font-size:13px">Articles assignés (${assigned.length})</div>
    <div id="fa-assigned" style="max-height:200px;overflow-y:auto;margin-bottom:16px">
      ${assigned.length?assigned.map(a=>`<div class="fa-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--bg-2);border-radius:6px;margin-bottom:4px;border:1px solid var(--border)">
        <div><span style="font-weight:600">${a.name}</span> <span style="font-size:11px;color:var(--text-2)">${a.code} — Stock: ${a.stock}</span></div>
        <button class="btn btn-sm btn-danger" onclick="removeFournArticle('${fournId}','${a.id}')">✕</button>
      </div>`).join(''):'<div style="color:var(--text-2);font-size:12px;padding:8px">Aucun article assigné</div>'}
    </div>
    <div style="margin-bottom:8px;font-weight:600;font-size:13px">Ajouter des articles</div>
    <select id="fa-select" style="width:100%;margin-bottom:8px">
      <option value="">— Choisir un article —</option>
      ${unassigned.sort((a,b)=>a.name.localeCompare(b.name,'fr')).map(a=>`<option value="${a.id}">${a.name} (${a.code})</option>`).join('')}
    </select>
    <button class="btn btn-sm btn-primary" onclick="addFournArticle('${fournId}')">+ Assigner</button>`;
  openModal('fourn-arts','📦 Articles — '+f.nom, body, null, 'modal-lg');
}

function addFournArticle(fournId) {
  const sel = document.getElementById('fa-select');
  const artId = sel?.value; if(!artId) { notify('Sélectionnez un article','warning'); return; }
  const art = APP.articles.find(a=>a.id===artId); if(!art) return;
  art.fournisseurId = fournId;
  auditLog('EDIT','article',art.id,{fournisseurId:null},{fournisseurId:fournId});
  saveDB(); notify(art.name+' assigné ✓','success');
  openFournArticlesModal(fournId);
}

function removeFournArticle(fournId, artId) {
  const art = APP.articles.find(a=>a.id===artId); if(!art) return;
  art.fournisseurId = null;
  auditLog('EDIT','article',art.id,{fournisseurId:fournId},{fournisseurId:null});
  saveDB(); notify(art.name+' retiré','info');
  openFournArticlesModal(fournId);
}

function viewFournDetail(fournId) {
  window._fournFocus = fournId; showPage('fourn-dashboard');
}

// ============================================================
// GMA DATA — Articles & Fournisseurs (données permanentes)
// ============================================================
const GMA_FOURNISSEURS = [
  { nom:'2BPUB',          entreprise:'2BPUB',          contact:'Borro', tel:'27 21 35 84 93', adresse:'Côte d\'Ivoire' },
  { nom:"POUVOIR D'ART",  entreprise:"POUVOIR D'ART",  contact:'',      tel:'07 57 50 99 28', adresse:'Côte d\'Ivoire' },
];
const GMA_ARTICLES = [
  // INSTITUTIONNELS
  { name:'Chasubles GMA (Marron & Orange)',         code:'MY0A003', category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'Marron, Orange',  description:'Chasubles aux couleurs GMA' },
  { name:'Tabliers GMA (Marron & Orange)',           code:'MY0A005', category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'Marron, Orange',  description:'Tabliers aux couleurs GMA' },
  { name:'Seaux GMA',                                code:'MY0A125', category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'',               description:'Seaux GMA' },
  { name:'Pelons GMA',                               code:'MY0A058', category:'INSTITUTIONNELS',  fournisseur:'POUVOIR D\'ART',  colors:'',               description:'Pelons GMA' },
  { name:'Cahiers GMA',                              code:'MY0A136', category:'INSTITUTIONNELS',  fournisseur:'',              colors:'',               description:'Cahiers GMA' },
  { name:'Pagnes GMA (Pièces)',                      code:'—',       category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'',               description:'Pagnes GMA à la pièce' },
  { name:'Parasols GMA',                             code:'—',       category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'',               description:'Parasols GMA' },
  { name:'Tee-Shirt GMA (Marron, Orange et Blanc)',  code:'MY0A068', category:'INSTITUTIONNELS',  fournisseur:'',              colors:'Marron, Orange, Blanc', description:'Tee-shirts GMA tricolore' },
  { name:'Casquette GMA (Beige & Blanc)',            code:'—',       category:'INSTITUTIONNELS',  fournisseur:'POUVOIR D\'ART',  colors:'Beige, Blanc',   description:'Casquettes GMA bicolore' },
  // SUPER-BEIGNETS
  { name:'Tee-shirts Super-Beignets',                code:'MY0A157', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Super-Beignets' },
  { name:'Tabliers Super-Beignets Plus',             code:'MY0A159', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Tabliers Super-Beignets Plus' },
  { name:'Seaux Super-Beignets',                     code:'MY0A161', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Seaux Super-Beignets' },
  { name:'Bassines Super-Beignets',                  code:'MY0A120', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Bassines Super-Beignets' },
  { name:'Tabliers Super-Beignets Simple',           code:'MY0A121', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Tabliers Super-Beignets Simple' },
  { name:'Tee-shirt Super-Beignets Plus',            code:'MY0A117', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Super-Beignets Plus' },
  // EXCEPTIONNEL - DIVERS
  { name:'Polos 60 ans',                             code:'MY0A201', category:'EXCEPTIONNEL - DIVERS', fournisseur:'2BPUB',    colors:'',               description:'Polos édition 60 ans' },
  { name:'Tee-shirt beige 60 ans',                   code:'—',       category:'EXCEPTIONNEL - DIVERS', fournisseur:'2BPUB',    colors:'Beige',          description:'Tee-shirts beige 60 ans' },
  // SOGO BALO PRO
  { name:'Tee-shirt Sogo Balo Pro',                  code:'MY0A066', category:'SOGO BALO PRO',     fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Sogo Balo Pro' },
  { name:'Seaux Sogo Balo Pro',                      code:'MY0A165', category:'SOGO BALO PRO',     fournisseur:'2BPUB',          colors:'',               description:'Seaux Sogo Balo Pro' },
];

// GMA logo storage key
const GMA_LOGO_KEY = 'gma_logo_b64';

function _safeCompanyLogo() {
  var logo = APP.settings && APP.settings.companyLogo;
  if (!logo || logo.indexOf('__img:') === 0 || logo.length < 100) return GMA_DEFAULT_LOGO;
  return logo;
}

function initGMAData() {
  if(_savedDataLoaded) {
    // ── Sauvegarde chargée : elle fait autorité, on ne touche à rien ──
    // Seule exception : garantir que le logo est présent si absent de la save
    if(APP.settings && !APP.settings.companyLogo) APP.settings.companyLogo = GMA_DEFAULT_LOGO;
    // Garantir les clés structurelles nécessaires pour les nouvelles fonctions
    if(!APP.fournisseurs) APP.fournisseurs = [];
    if(!APP.articles) APP.articles = [];
    if(!APP.bons) APP.bons = [];
    if(!APP.mouvements) APP.mouvements = [];
    if(!APP.audit) APP.audit = [];

    // ── Migrations permanentes (appliquées à chaque démarrage, même sur données sauvegardées) ──
    // Supprimer définitivement TAGPLAST
    APP.fournisseurs = APP.fournisseurs.filter(f => f.nom !== 'TAGPLAST' && f.entreprise !== 'TAGPLAST');
    // Mettre à jour les articles qui référencent TAGPLAST
    APP.articles.forEach(a => { if(a.fournisseur === 'TAGPLAST') { a.fournisseur = ''; a.fournisseurId = null; } });
    // Renommer catégorie '60 ANS' → 'EXCEPTIONNEL - DIVERS' dans les articles existants
    APP.articles.forEach(a => { if(a.category === '60 ANS') a.category = 'EXCEPTIONNEL - DIVERS'; });
    // Corriger le champ entreprise pour les fournisseurs existants sans entreprise
    APP.fournisseurs.forEach(f => { if(!f.entreprise && f.nom) f.entreprise = f.nom; });
    // Rétrograder les noms de contact mal placés dans 'nom' (erreur migration précédente)
    APP.fournisseurs.forEach(f => {
      if(f.nom === 'Bleu' && f.entreprise === 'IVA COM')  { f.nom = 'IVA COM'; f.contact = f.contact || 'Bleu'; }
      if(f.nom === 'Borro' && f.entreprise === '2BPUB')   { f.nom = '2BPUB';   f.contact = f.contact || 'Borro'; }
    });
    // Affecter les contacts connus si manquants
    const fivaCom = APP.fournisseurs.find(f => f.nom === 'IVA COM' || f.entreprise === 'IVA COM');
    if(fivaCom) { fivaCom.entreprise = 'IVA COM'; if(!fivaCom.contact) fivaCom.contact = 'Bleu'; }
    const f2bpub = APP.fournisseurs.find(f => f.nom === '2BPUB' || f.entreprise === '2BPUB');
    if(f2bpub) { f2bpub.entreprise = '2BPUB'; if(!f2bpub.contact) f2bpub.contact = 'Borro'; }

    return; // STOP — la sauvegarde est la source de vérité
  }

  // ── Premier lancement (pas de sauvegarde) : seeder les données GMA ──
  if(APP.settings && !APP.settings.companyLogo) APP.settings.companyLogo = GMA_DEFAULT_LOGO;

  // Supprimer les anciens articles génériques (g1-g10) si présents par défaut
  const LEGACY_IDS = ['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10'];
  const LEGACY_CODES = ['TSH-GMA','TSH-SBP','CHAS','TABL','SEA-GMA','SEA-SBP','PELO','CAHI','BASS','POLO'];
  APP.articles = APP.articles.filter(a => !LEGACY_IDS.includes(a.id) && !LEGACY_CODES.includes(a.code));

  // Supprimer ANNONAFRICA
  APP.fournisseurs = APP.fournisseurs.filter(f => f.nom !== 'ANNONAFRICA');

  // Ajouter fournisseurs GMA manquants
  GMA_FOURNISSEURS.forEach(gf => {
    if(!APP.fournisseurs.find(f => f.nom === gf.nom)) {
      APP.fournisseurs.push({ id:generateId(), nom:gf.nom, entreprise:gf.nom, contact:gf.contact, tel:gf.tel, adresse:gf.adresse, createdAt:Date.now(), _gma:true });
    }
  });

  // Ajouter articles GMA manquants (stock=0 par défaut)
  GMA_ARTICLES.forEach(ga => {
    const exists = APP.articles.find(a => a.code === ga.code) || APP.articles.find(a => a.name === ga.name);
    if(!exists) {
      const fournObj = APP.fournisseurs.find(f => f.nom === ga.fournisseur);
      APP.articles.push({ id:generateId(), name:ga.name, code:ga.code, category:ga.category, fournisseur:ga.fournisseur, fournisseurId:fournObj?.id||null, colors:ga.colors||'', description:ga.description||'', unit:'pcs', stock:0, stockMin:5, price:0, image:'', dispatchAllocMax:0, actif:true, createdAt:Date.now(), _version:1, _gma:true });
    }
  });
  // NE PAS appeler saveDB() — la première sauvegarde se fait lors d'une action utilisateur
}

// ============================================================
// CATALOGUE GMA
// ============================================================
function applyGMAFilters() {
  var _needle = _normSearch(((document.getElementById('gma-search') || {}).value) || '');
  var _stockF = (document.getElementById('gma-filter-stock') || {}).value || 'all';
  var _fournF = (document.getElementById('gma-filter-fourn') || {}).value || 'all';
  var _catF   = (document.getElementById('gma-filter-cat') || {}).value || 'all';
  var _arts = (APP.articles || []).filter(function(a) {
    if (!a._gma) return false;
    if (_catF !== 'all' && a.category !== _catF) return false;
    if (_fournF !== 'all' && a.fournisseur !== _fournF) return false;
    if (_stockF === 'ok'  && (a.stock||0) <= (a.stockMin||0)) return false;
    if (_stockF === 'low' && !((a.stock||0) > 0 && (a.stock||0) <= (a.stockMin||0))) return false;
    if (_stockF === 'out' && (a.stock||0) > 0) return false;
    if (_needle) {
      var _hay = _normSearch([a.name,a.code,a.category,a.description,a.colors,a.fournisseur].filter(Boolean).join(' '));
      if (!_hay.includes(_needle)) return false;
    }
    return true;
  });
  var _grid = document.getElementById('gma-grid');
  if (_grid) {
    _grid.innerHTML = _arts.length
      ? _arts.map(function(a,i){ return renderGMACard(a,i); }).join('')
      : '<div style="grid-column:1/-1;padding:40px;text-align:center"><p style="color:var(--text-2)">Aucun article trouvé</p></div>';
  }
}

function renderGMACatalogue() {
  const logo = APP.settings.gmaLogo || APP.settings.companyLogo || localStorage.getItem(GMA_LOGO_KEY) || '';
  const cats = [...new Set(GMA_ARTICLES.map(a=>a.category))];
  document.getElementById('content').innerHTML = `
  <div class="gma-logo-banner anim-up">
    <div class="gma-logo-box" id="gma-logo-preview">
      ${logo?`<img src="${logo}" alt="GMA Logo">`:'<span style="font-size:20px;font-weight:900;letter-spacing:-1px">GMA</span>'}
    </div>
    <div style="flex:1">
      <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em">Catalogue GMA</div>
      <div style="font-size:12px;color:var(--text-2);margin-top:2px">Gadgets institutionnels, goodies et gadgets GMA</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="showPage('articles')">📦 Voir les stocks →</button>
      <button class="btn btn-primary btn-sm" onclick="showPage('fourn-dashboard')">🚚 Nouvelle commande</button>
    </div>
  </div>
  <div style="font-size:13px;font-weight:600;color:var(--text-1);margin-bottom:12px">${APP.articles.filter(a=>a._gma).length} gadgets GMA · ${APP.fournisseurs.filter(f=>f._gma).length} fournisseurs</div>
  <div class="gma-cat-tabs" id="gma-tabs">
    <button class="gma-cat-tab active" onclick="filterGMACat('all',this)">Tous</button>
    ${cats.map(c=>`<button class="gma-cat-tab" onclick="filterGMACat('${c}',this)">${c}</button>`).join('')}
  </div>
  <div class="filters" style="margin:10px 0 14px;gap:8px;flex-wrap:wrap">
    <input type="text" id="gma-search" placeholder="Rechercher..." oninput="applyGMAFilters()" style="flex:1;min-width:140px">
    <select id="gma-filter-stock" onchange="applyGMAFilters()" style="width:auto">
      <option value="all">Tout le stock</option>
      <option value="ok">Stock OK</option>
      <option value="low">En alerte</option>
      <option value="out">Rupture</option>
    </select>
    <select id="gma-filter-fourn" onchange="applyGMAFilters()" style="width:auto">
      <option value="all">Tous fournisseurs</option>
      ${[...new Set(APP.articles.filter(a=>a._gma&&a.fournisseur).map(a=>a.fournisseur))].map(f=>`<option value="${f}">${f}</option>`).join('')}
    </select>
    <select id="gma-filter-cat" onchange="applyGMAFilters()" style="width:auto">
      <option value="all">Toutes catégories</option>
      ${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}
    </select>
  </div>
  <div class="gma-article-grid" id="gma-grid">
    ${APP.articles.filter(a=>a._gma).map((a,i)=>renderGMACard(a,i)).join('')}
  </div>`;
}

function saveGMALogo(input) {
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    APP.settings.gmaLogo = e.target.result; _imagesDirty = true;
    // Migration: nettoyer l'ancien stockage navigateur
    try { localStorage.removeItem(GMA_LOGO_KEY); } catch(ex) {}
    saveDB();
    notify('Logo GMA mis à jour ✓','success');
    renderGMACatalogue();
  };
  reader.readAsDataURL(file);
  input.value='';
}

function renderGMACard(a, i=0) {
  const delay = Math.min(i*0.04, 0.4);
  const price = a.price || 0;
  const value = (a.stock || 0) * price;
  return `<div class="gma-art-card" style="animation-delay:${delay}s" onclick="openGMAArticleDetail('${a.id}')">
    <div class="gma-art-img">
      ${a.image?`<img src="${a.image}" alt="${a.name}">`:`<div class="gma-art-img-ph">📦</div>`}
      <div style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.5);border-radius:4px;padding:2px 6px;font-size:10px;color:white;font-weight:600">+Photo</div>
    </div>
    <div class="gma-art-body">
      ${(()=>{const _fr=a.fournisseurId?(APP.fournisseurs||[]).find(x=>x.id===a.fournisseurId):null;return _fr?`<div class="gma-art-fourn">🏭 <strong>${_fr.nom}</strong></div>`:'<div class="gma-art-fourn" style="opacity:0.55;background:var(--bg-3);border-color:var(--border)">🏭 <strong>Sans fournisseur</strong></div>';})()}
      <div class="gma-art-cat">${a.category}</div>
      <div class="gma-art-name">${a.name}</div>
      ${a.code&&a.code!=='—'?`<div class="gma-art-code">${a.code}</div>`:''}
      ${a.colors?`<div style="font-size:11px;color:var(--warning);margin-bottom:4px">🎨 ${a.colors}</div>`:''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 4px;gap:8px;flex-wrap:wrap">
        <span class="gma-art-price">${fmtCurrency(price)}</span>
        ${value>0?`<span class="gma-art-value" title="Valeur stock">∑ ${fmtCurrency(value)}</span>`:''}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
        <span style="font-size:12px;color:${a.stock<=a.stockMin?'var(--danger)':'var(--success)'};font-weight:600">Stock: ${a.stock}</span>
        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation();openCmdFromArticle('${a.id}')">Commander</button>
      </div>
    </div>
  </div>`;
}

function filterGMACat(cat, btn) {
  document.querySelectorAll('.gma-cat-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  var _sel = document.getElementById('gma-filter-cat');
  if (_sel) { _sel.value = cat; applyGMAFilters(); return; }
  const arts = APP.articles.filter(a=>a._gma && (cat==='all'||a.category===cat));
  document.getElementById('gma-grid').innerHTML = arts.map((a,i)=>renderGMACard(a,i)).join('');
}

function renderArticleMiniHistory(artId, limit) {
  limit = limit || 20;
  var events = [];
  // Bons (sorties)
  (APP.bons || []).forEach(function(b) {
    (b.lignes || []).forEach(function(l) {
      if (l.articleId === artId) {
        events.push({
          ts: b.createdAt || b.ts || 0,
          type: 'bon',
          qty: -(l.qte || l.quantity || 0),
          label: 'Bon ' + (b.numero || b.id || ''),
          ref: b.id
        });
      }
    });
  });
  // Mouvements manuels
  (APP.mouvements || []).forEach(function(m) {
    if (m.articleId === artId) {
      events.push({
        ts: m.ts || 0,
        type: m.type === 'entree' ? 'entree' : 'sortie',
        qty: m.type === 'entree' ? (m.qty || 0) : -(m.qty || 0),
        label: m.type === 'entree' ? 'Entr\u00e9e manuelle' : 'Sortie manuelle',
        ref: m.id || ''
      });
    }
  });
  // Receptions fournisseur
  (APP.commandesFourn || []).forEach(function(c) {
    (c.lignes || []).forEach(function(l) {
      if (l.articleId === artId) {
        var recs = Array.isArray(l.receptions) ? l.receptions : Object.values(l.receptions || {});
        recs.forEach(function(r) {
          events.push({
            ts: r.date || 0,
            type: 'reception',
            qty: r.qty || 0,
            label: 'R\u00e9ception ' + (c.numero || ''),
            ref: c.id
          });
        });
      }
    });
  });
  events.sort(function(a, b) { return b.ts - a.ts; });
  if (events.length === 0) {
    return '<div style="font-size:12px;color:var(--text-2);font-style:italic;padding:12px;text-align:center">Aucun mouvement enregistr\u00e9</div>';
  }
  var rows = events.slice(0, limit).map(function(e) {
    var icon, color;
    if (e.type === 'bon') { icon = '\ud83d\udcc4'; color = 'var(--warning)'; }
    else if (e.type === 'entree') { icon = '\u2795'; color = 'var(--success)'; }
    else if (e.type === 'sortie') { icon = '\u2796'; color = 'var(--danger)'; }
    else if (e.type === 'reception') { icon = '\ud83d\udce5'; color = 'var(--accent)'; }
    else { icon = '\u2022'; color = 'var(--text-2)'; }
    var qtyStr = (e.qty > 0 ? '+' : '') + e.qty;
    return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--border);font-size:12px">'
      + '<span style="font-size:14px">' + icon + '</span>'
      + '<span style="color:var(--text-2);min-width:80px">' + (e.ts ? fmtDate(e.ts) : '?') + '</span>'
      + '<span style="flex:1;color:var(--text-1)">' + e.label + '</span>'
      + '<span style="font-weight:700;color:' + color + '">' + qtyStr + '</span>'
      + '</div>';
  }).join('');
  var more = events.length > limit ? '<div style="font-size:10px;color:var(--text-3);text-align:center;padding:4px">+ ' + (events.length - limit) + ' entr\u00e9es plus anciennes</div>' : '';
  return '<div style="max-height:260px;overflow-y:auto;background:var(--bg-2);border-radius:8px;border:1px solid var(--border)">' + rows + more + '</div>';
}

function openArticleHistory(artId) {
  var a = (APP.articles || []).find(function(x) { return x.id === artId; });
  if (!a) { notify('Gadget introuvable', 'error'); return; }
  var body = '<div style="font-size:12px;color:var(--text-2);margin-bottom:10px">Historique complet des mouvements (bons, entr\u00e9es/sorties manuelles, r\u00e9ceptions)</div>'
    + renderArticleMiniHistory(artId, 50);
  openModal('art-history', '\ud83d\udcdc Historique \u2014 ' + a.name, body, null, 'modal-md');
}

function openGMAArticleDetail(artId) {
  // Enrich with fournisseur name
  const _art = APP.articles.find(a=>a.id===artId);
  if(_art && _art.fournisseurId) {
    const _fourn = (APP.fournisseurs||[]).find(f=>f.id===_art.fournisseurId);
    if(_fourn) _art._fournisseurName = _fourn.nom;
  }

  const a = APP.articles.find(x=>x.id===artId); if(!a) return;
  const fourn = APP.fournisseurs.find(f=>f.id===a.fournisseurId||f.nom===a.fournisseur);
  const body = `
  <div style="display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:start">
    <div>
      <div style="width:200px;height:200px;border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative" onclick="document.getElementById('art-img-file-${a.id}').click()">
        ${a.image?`<img src="${a.image}" style="width:100%;height:100%;object-fit:cover" id="art-img-preview-${a.id}">`:`<div style="font-size:5rem;opacity:0.15">📦</div><div style="position:absolute;bottom:8px;left:0;right:0;text-align:center;font-size:11px;color:var(--text-2)">Cliquer pour ajouter</div>`}
      </div>
      <input type="file" id="art-img-file-${a.id}" accept="image/*" style="display:none" onchange="saveArticleImage('${a.id}',this)">
      <button class="btn btn-secondary btn-sm" style="width:100%;margin-top:8px" onclick="document.getElementById('art-img-file-${a.id}').click()">🖼 ${a.image?'Changer l\'image':'Ajouter une image'}</button>
      ${a.image?`<button class="btn btn-sm" style="width:100%;margin-top:4px;background:var(--danger);color:white" onclick="removeArticleImage('${a.id}')">✕ Supprimer</button>`:''}
    </div>
    <div>
      <div class="gma-art-cat" style="margin-bottom:4px">${a.category}</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:8px">${a.name}</div>
      ${a.code&&a.code!=='—'?`<div style="margin-bottom:10px"><span class="badge badge-blue" style="font-family:monospace">${a.code}</span></div>`:''}
      ${a.colors?`<div style="margin-bottom:10px;font-size:13px">🎨 <strong>Couleurs:</strong> ${a.colors}</div>`:''}
      <div style="background:var(--bg-2);border-radius:var(--radius);padding:12px;margin-bottom:12px">
        <div class="stat-row"><span class="stat-label">Fournisseur</span><span class="stat-val" style="color:var(--accent2)">${a.fournisseur}</span></div>
        ${fourn?.tel?`<div class="stat-row"><span class="stat-label">Contact</span><span class="stat-val">${fourn.tel}</span></div>`:''}
        <div class="stat-row"><span class="stat-label">Stock actuel</span><span class="stat-val" style="color:${a.stock<=a.stockMin?'var(--danger)':'var(--success)'}">${a.stock} ${a.unit||'pcs'}</span></div>
        <div class="stat-row"><span class="stat-label">Stock minimum</span><span class="stat-val">${a.stockMin}</span></div>
      </div>
      ${a.description?`<div style="font-size:12px;color:var(--text-2);line-height:1.6;margin-bottom:12px">${a.description}</div>`:''}
      <div style="font-size:12px;font-weight:700;color:var(--text-1);margin:12px 0 6px">📜 Historique récent</div>
      ${renderArticleMiniHistory(a.id, 15)}
    </div>
  </div>`;
  openModal('gma-detail', a.name, body, null, 'modal-lg');
}

function saveArticleImage(artId, input) {
  const file = input.files[0]; if(!file) return;
  if(file.size > 3*1024*1024) { notify('Image trop grande (max 3MB)','error'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const a = APP.articles.find(x=>x.id===artId); if(!a) return;
    _imagesDirty = true; a.image = e.target.result;
    saveDB();
    notify('Image enregistrée ✓','success');
    // Refresh the preview in the modal
    const prev = document.getElementById('art-img-preview-'+artId);
    if(prev) { prev.src = e.target.result; } else closeModal();
    // Refresh catalogue if open
    if(currentPage==='gma-catalogue') renderGMACatalogue();
    if(currentPage==='articles') filterArticles();
  };
  reader.readAsDataURL(file);
  input.value='';
}

function removeArticleImage(artId) {
  const a = APP.articles.find(x=>x.id===artId); if(!a) return;
  a.image = ''; saveDB(); closeModal();
  if(currentPage==='gma-catalogue') renderGMACatalogue();
  if(currentPage==='articles') filterArticles();
  notify('Image supprimée','success');
}

function openCmdFromArticle(artId) {
  const a = APP.articles.find(x=>x.id===artId); if(!a) return;
  const fourn = APP.fournisseurs.find(f=>f.nom===a.fournisseur||f.id===a.fournisseurId);
  openNewCmdModal(fourn?.id, [{artId:a.id, name:a.name}]);
}

// ============================================================
// FOURNISSEUR DASHBOARD + COMMANDES (FIXED multi-article)
// ============================================================
// ============================================================
// SUIVI DES LIVRAISONS — REFONTE COMPLÈTE
// ============================================================

var _fournStatusFilter = 'all'; // all, pending, partial, complete, late

function calcCmdPct(cmd) {
  var totalCmd = (cmd.lignes||[]).reduce(function(s,l){ return s + (l.qteCommandee||0); }, 0);
  var totalRecu = (cmd.lignes||[]).reduce(function(s,l){ return s + (l.qteRecue||0); }, 0);
  return totalCmd > 0 ? Math.round(totalRecu / totalCmd * 100) : 0;
}

function calcCmdStatus(cmd) {
  var pct = calcCmdPct(cmd);
  if (cmd.status === 'cancelled') return 'cancelled';
  if (pct === 0) return 'pending';
  if (pct >= 100) return 'complete';
  return 'partial';
}

function isCmdLate(cmd) {
  if (cmd.status === 'complete' || cmd.status === 'cancelled') return false;
  if (!cmd.dateLivraisonPrevue) return false;
  return Date.now() > cmd.dateLivraisonPrevue;
}

function getCmdStatusLabel(s) {
  return { pending: 'En attente', partial: 'Partielle', complete: 'Compl\u00e8te', cancelled: 'Annul\u00e9e', late: 'En retard' }[s] || s;
}
function getCmdStatusClass(s) {
  return { pending: 'order-status-pending', partial: 'order-status-partial', complete: 'order-status-complete', cancelled: 'order-status-cancelled', late: 'order-status-pending' }[s] || 'order-status-pending';
}
function getCmdProgressColor(pct) {
  if (pct >= 100) return 'var(--success)';
  if (pct >= 60) return 'var(--accent)';
  if (pct >= 30) return 'var(--warning)';
  return 'var(--accent3)';
}

function calcCmdTotal(cmd) {
  return (cmd.lignes||[]).reduce(function(s,l) { return s + (l.qteCommandee||0) * (l.prixUnitaire||0); }, 0);
}

// ── Dashboard principal ─────────────────────────────────────

function renderFournDashboard() {
  var cmds = APP.commandesFourn || [];
  // Update statuses
  cmds.forEach(function(c) { c.status = calcCmdStatus(c); });

  var pending = cmds.filter(function(c){ return c.status==='pending'; }).length;
  var partial = cmds.filter(function(c){ return c.status==='partial'; }).length;
  var complete = cmds.filter(function(c){ return c.status==='complete'; }).length;
  var late = cmds.filter(function(c){ return isCmdLate(c); }).length;
  var totalValue = cmds.reduce(function(s,c){ return s + calcCmdTotal(c); }, 0);

  var filterBtns = ['all','pending','partial','complete','late'].map(function(f) {
    var label = f === 'all' ? 'Toutes' : getCmdStatusLabel(f);
    var count = f === 'all' ? cmds.length : (f === 'late' ? late : cmds.filter(function(c){ return c.status === f; }).length);
    var active = _fournStatusFilter === f ? 'btn-primary' : 'btn-secondary';
    return '<button class="btn btn-sm ' + active + '" onclick="_fournStatusFilter=\'' + f + '\';renderFournDashboard()">' + label + ' (' + count + ')</button>';
  }).join('');

  document.getElementById('content').innerHTML = '<div class="page-header">'
    + '<div><div class="page-title">Suivi des livraisons</div><div class="page-sub">Commandes fournisseurs & r\u00e9ceptions</div></div>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-primary" onclick="openNewCmdModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Nouvelle commande</button>'
    + '</div>'
    + '</div>'
    + '<div class="grid-4 mb-16">'
    + '<div class="card"><div class="card-header"><span class="card-title">En attente</span></div><div class="kpi-value" style="color:var(--warning)">' + pending + '</div><div class="kpi-change">commandes</div></div>'
    + '<div class="card"><div class="card-header"><span class="card-title">En cours</span></div><div class="kpi-value" style="color:var(--accent)">' + partial + '</div><div class="kpi-change">livraisons partielles</div></div>'
    + '<div class="card"><div class="card-header"><span class="card-title">Compl\u00e8tes</span></div><div class="kpi-value" style="color:var(--success)">' + complete + '</div><div class="kpi-change">commandes</div></div>'
    + '<div class="card"><div class="card-header"><span class="card-title">' + (late > 0 ? '\u26a0 En retard' : 'Valeur totale') + '</span></div><div class="kpi-value" style="color:' + (late > 0 ? 'var(--danger)' : 'var(--accent2)') + ';font-size:18px">' + (late > 0 ? late + ' cmd' : fmtCurrency(totalValue)) + '</div><div class="kpi-change">' + (late > 0 ? 'date d\u00e9pass\u00e9e' : 'en commande') + '</div></div>'
    + '</div>'
    + '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">' + filterBtns + '</div>'
    + '<div id="fourn-cards-grid">' + _renderFournCards(cmds) + '</div>';
}

function _renderFournCards(cmds) {
  if (!APP.fournisseurs || APP.fournisseurs.length === 0) {
    return '<div class="empty-state"><p>Aucun fournisseur \u2014 <button class="btn btn-sm btn-primary" onclick="showPage(\'fournisseurs\')">Ajouter</button></p></div>';
  }
  return APP.fournisseurs.map(function(f) {
    var fCmds = cmds.filter(function(c) { return c.fournisseurId === f.id; });
    // Apply filter
    var filteredCmds = fCmds;
    if (_fournStatusFilter !== 'all') {
      if (_fournStatusFilter === 'late') {
        filteredCmds = fCmds.filter(function(c) { return isCmdLate(c); });
      } else {
        filteredCmds = fCmds.filter(function(c) { return c.status === _fournStatusFilter; });
      }
    }
    if (_fournStatusFilter !== 'all' && filteredCmds.length === 0) return '';

    var fPending = fCmds.filter(function(c){ return c.status==='pending' || c.status==='partial'; }).length;
    var fLate = fCmds.filter(function(c){ return isCmdLate(c); }).length;
    var totalRecu = fCmds.reduce(function(s,c){ return s + calcCmdPct(c); }, 0);
    var avgPct = fCmds.length ? Math.round(totalRecu / fCmds.length) : 0;
    var circum = 2 * Math.PI * 30;
    var dashOffset = circum * (1 - avgPct / 100);

    return '<div class="fourn-card" id="fc-' + f.id + '" onclick="toggleFournOrders(\'' + f.id + '\')">'
      + '<div class="fourn-card-header">'
      + '<div style="display:flex;align-items:center;gap:12px">'
      + '<div class="fourn-avatar">' + (f.nom||'?').charAt(0).toUpperCase() + '</div>'
      + '<div><div class="fourn-name">' + f.nom + '</div><div class="fourn-sub" style="color:var(--accent);font-weight:600">' + (f.entreprise||'') + '</div><div class="fourn-sub">' + (f.contact||f.adresse||'') + '</div></div>'
      + '</div>'
      + '<div style="display:flex;gap:6px;align-items:center">'
      + (fLate > 0 ? '<span class="badge" style="background:var(--danger);color:#fff">\u26a0 ' + fLate + ' en retard</span>' : '')
      + (fPending > 0 ? '<span class="badge badge-orange">\u26a1 ' + fPending + ' en cours</span>' : '')
      + '<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();openNewCmdModal(\'' + f.id + '\')">+</button>'
      + '</div></div>'
      + '<div class="gauge-wrap">'
      + '<div class="gauge-circle"><svg viewBox="0 0 72 72" width="72" height="72"><circle class="gauge-circle-bg" cx="36" cy="36" r="30"/><circle class="gauge-circle-fill" cx="36" cy="36" r="30" stroke="' + getCmdProgressColor(avgPct) + '" stroke-dasharray="' + circum + '" stroke-dashoffset="' + dashOffset + '"/></svg><div class="gauge-pct">' + avgPct + '%</div></div>'
      + '<div class="gauge-stats">' + ['pending','partial','complete'].map(function(st){ return '<div class="gauge-stat-row"><span class="gauge-stat-label">' + getCmdStatusLabel(st) + '</span><span class="gauge-stat-val">' + fCmds.filter(function(c){return c.status===st;}).length + '</span></div>'; }).join('') + '</div>'
      + '</div>'
      + '<div id="forders-' + f.id + '" style="display:none;margin-top:12px" onclick="event.stopPropagation()"></div>'
      + '</div>';
  }).join('');
}

// ── Toggle fournisseur ─────────────────────────────────────

function toggleFournOrders(fournId) {
  var container = document.getElementById('forders-' + fournId);
  if (!container) return;
  var isOpen = container.style.display === 'block';
  APP.fournisseurs.forEach(function(f) {
    var c = document.getElementById('forders-' + f.id);
    if (c) c.style.display = 'none';
    var fc = document.getElementById('fc-' + f.id);
    if (fc) fc.classList.remove('active');
  });
  if (!isOpen) {
    container.style.display = 'block';
    var fc = document.getElementById('fc-' + fournId);
    if (fc) fc.classList.add('active');
    var fCmds = (APP.commandesFourn||[]).filter(function(c){ return c.fournisseurId === fournId; }).sort(function(a,b){ return b.createdAt - a.createdAt; });
    // Apply filter
    if (_fournStatusFilter !== 'all') {
      if (_fournStatusFilter === 'late') {
        fCmds = fCmds.filter(function(c){ return isCmdLate(c); });
      } else {
        fCmds = fCmds.filter(function(c){ return c.status === _fournStatusFilter; });
      }
    }
    if (!fCmds.length) {
      container.innerHTML = '<div class="empty-state" style="padding:16px"><p>Aucune commande' + (_fournStatusFilter !== 'all' ? ' avec ce filtre' : '') + '</p></div>';
      return;
    }
    container.innerHTML = fCmds.map(function(c) { return renderOrderCard(c); }).join('');
  }
}

// ── Carte commande détaillée (améliorée) ────────────────────

function renderOrderCard(c) {
  var pct = calcCmdPct(c);
  var late = isCmdLate(c);
  var total = calcCmdTotal(c);
  var totalRecu = (c.lignes||[]).reduce(function(s,l){return s+(l.qteRecue||0);},0);
  var totalCmd = (c.lignes||[]).reduce(function(s,l){return s+(l.qteCommandee||0);},0);
  var totalRestant = totalCmd - totalRecu;
  var latedays = late && c.dateLivraisonPrevue ? Math.ceil((Date.now()-c.dateLivraisonPrevue)/86400000) : 0;

  var lignesHtml = (c.lignes||[]).map(function(l, i) {
    var restant = Math.max(0, (l.qteCommandee||0) - (l.qteRecue||0));
    var lineTotal = (l.qteCommandee||0) * (l.prixUnitaire||0);
    var linePct = (l.qteCommandee||0) > 0 ? Math.round((l.qteRecue||0) / (l.qteCommandee||0) * 100) : 0;
    var receptions = Array.isArray(l.receptions) ? l.receptions : Object.values(l.receptions||{});

    // Collapsible timeline
    var timelineHtml = '';
    if (receptions.length > 0) {
      var tlId = 'tl-' + c.id + '-' + i;
      timelineHtml = '<tr><td colspan="8" style="padding:0 8px 8px">'
        + '<div style="cursor:pointer;font-size:10px;font-weight:700;color:var(--accent);padding:4px 0" onclick="var el=document.getElementById(\'' + tlId + '\');el.style.display=el.style.display===\'none\'?\'block\':\'none\'">' + '\u25b6 ' + receptions.length + ' r\u00e9ception(s) \u2014 cliquer pour d\u00e9plier</div>'
        + '<div id="' + tlId + '" style="display:none;background:var(--bg-3);border-radius:6px;padding:8px 10px">'
        + receptions.map(function(r) {
          var byName = r.by || '';
          return '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:3px 0;border-bottom:1px solid var(--border)">'
            + '<span style="color:var(--text-2)">' + fmtDate(r.date) + '</span>'
            + '<span style="font-weight:600;color:var(--success)">+' + r.qty + ' u.</span>'
            + (byName ? '<span style="color:var(--accent);font-size:10px">' + byName + '</span>' : '')
            + (r.note ? '<span style="color:var(--text-3);font-style:italic;font-size:10px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + (r.note||'').replace(/"/g,'&quot;') + '">' + r.note + '</span>' : '')
            + '</div>';
        }).join('')
        + '</div></td></tr>';
    }

    var _artRef = (APP.articles||[]).find(function(x){ return x.id === l.articleId; }) || {};
    var _thumb = _artRef.image
      ? '<img src="' + _artRef.image + '" style="width:40px;height:40px;object-fit:cover;border-radius:6px;display:block">'
      : '<div style="width:40px;height:40px;border-radius:6px;background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:14px;opacity:0.4">\ud83d\udce6</div>';
    return '<tr>'
      + '<td style="padding:4px">' + _thumb + '</td>'
      + '<td style="font-weight:500">' + l.articleName + '</td>'
      + '<td style="text-align:center;font-weight:600">' + (l.qteCommandee||0) + '</td>'
      + '<td style="text-align:center;font-weight:600;color:var(--success)">' + (l.qteRecue||0) + '</td>'
      + '<td style="text-align:center;font-weight:700;color:' + (restant > 0 ? 'var(--warning)' : 'var(--success)') + '">' + restant + '</td>'
      + '<td style="text-align:right;font-size:12px;color:var(--text-2)">' + fmtCurrency(lineTotal) + '</td>'
      + '<td style="width:90px"><div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden"><div style="height:100%;width:' + linePct + '%;background:' + getCmdProgressColor(linePct) + ';border-radius:3px"></div></div><div style="font-size:9px;text-align:center;color:var(--text-3)">' + linePct + '%</div></td>'
      + '<td style="text-align:center;font-size:11px">' + (restant === 0 ? '<span style="color:var(--success)">\u2713</span>' : '<span style="color:var(--warning)">\u23f3</span>') + '</td>'
      + '</tr>' + timelineHtml;
  }).join('');

  return '<div class="order-card" id="order-card-' + c.id + '" style="' + (late ? 'border-left:3px solid var(--danger)' : '') + '">'
    + '<div class="order-card-header">'
    + '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;flex-wrap:wrap">'
    + '<span class="order-num" style="font-weight:700">' + c.numero + '</span>'
    + (c.fournisseurNom ? '<span style="font-size:11px;color:var(--accent2);font-weight:600">\ud83c\udfed ' + c.fournisseurNom + '</span>' : '')
    + '<span class="order-status-badge ' + getCmdStatusClass(c.status) + '">' + getCmdStatusLabel(c.status) + '</span>'
    + (late ? '<span class="badge" style="background:var(--danger);color:#fff;font-size:10px">\u26a0 ' + latedays + 'j de retard</span>' : '')
    + (c.dateLivraisonPrevue ? '<span style="font-size:11px;color:var(--text-2)">\ud83d\udcc5 ' + fmtDate(c.dateLivraisonPrevue) + '</span>' : '')
    + '</div>'
    + '<div style="display:flex;gap:4px;align-items:center;flex-shrink:0;flex-wrap:wrap">'
    + '<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();openReceptionModal(\'' + c.id + '\')" title="R\u00e9ceptionner">\ud83d\udce5 R\u00e9ceptionner</button>'
    + '<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();openEditCmdModal(\'' + c.id + '\')" title="Modifier">\u270f</button>'
    + '<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();duplicateCmd(\'' + c.id + '\')" title="Dupliquer">\ud83d\udccb</button>'
    + '<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteCmd(\'' + c.id + '\')" title="Supprimer">\ud83d\uddd1</button>'
    + '</div></div>'
    + '<div class="order-progress-wrap">'
    + '<div class="order-progress-track"><div class="order-progress-fill" style="width:' + pct + '%;background:' + getCmdProgressColor(pct) + '"></div></div>'
    + '<div class="order-progress-labels">'
    + '<span>Command\u00e9: ' + totalCmd + ' u.</span>'
    + '<span style="font-weight:600;color:var(--success)">Re\u00e7u: ' + totalRecu + ' u.</span>'
    + '<span style="color:var(--warning);font-weight:600">Restant: ' + totalRestant + ' u.</span>'
    + '<span style="font-weight:700">' + pct + '%</span>'
    + '</div></div>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;padding:0 2px;font-size:12px">'
    + '<span style="color:var(--text-2)">Date: ' + fmtDate(c.dateCommande) + '</span>'
    + '<span style="font-weight:700;color:var(--accent2)">Total: ' + fmtCurrency(total) + '</span>'
    + '</div>'
    + '<table class="order-lignes-table" style="table-layout:fixed">'
    + '<thead><tr><th style="width:48px"></th><th>Article</th><th style="width:75px;text-align:center">Command\u00e9</th><th style="width:60px;text-align:center">Re\u00e7u</th><th style="width:65px;text-align:center">Restant</th><th style="width:85px;text-align:right">Montant</th><th style="width:90px;text-align:center">Progression</th><th style="width:40px;text-align:center">\u2713</th></tr></thead>'
    + '<tbody>' + lignesHtml + '</tbody>'
    + '</table>'
    + (c.note ? '<div style="font-size:11px;color:var(--text-2);margin-top:8px;background:var(--bg-3);padding:6px 10px;border-radius:6px">\ud83d\udcdd ' + c.note + '</div>' : '')
    + '</div>';
}

// ── Modal réception (refonte) ───────────────────────────────

function generateReceptionHTML(cmd, recLines) {
  var _co = APP.settings || {};
  var _logo = '<img src="'+(_co.companyLogo && _co.companyLogo.indexOf("__img:")!==0 && _co.companyLogo.length>100 ? _co.companyLogo : GMA_DEFAULT_LOGO)+'" style="height:60px;object-fit:contain">';
  var _fourn = (APP.fournisseurs||[]).find(function(f){return f.id===cmd.fournisseurId;}) || {};
  var _now = Date.now();
  var _rows = (recLines||[]).map(function(l){
    return '<tr>'
      + '<td style="padding:6px 10px;border:1px solid #ddd">' + (l.articleCode||'') + '</td>'
      + '<td style="padding:6px 10px;border:1px solid #ddd">' + (l.articleName||'') + '</td>'
      + '<td style="padding:6px 10px;border:1px solid #ddd;text-align:center">' + (l.qtyCommanded||0) + '</td>'
      + '<td style="padding:6px 10px;border:1px solid #ddd;text-align:center;font-weight:700;color:#E8640A">' + (l.qtyReceived||0) + '</td>'
      + '<td style="padding:6px 10px;border:1px solid #ddd;text-align:center">' + (l.totalReceived||0) + '</td>'
      + '<td style="padding:6px 10px;border:1px solid #ddd;text-align:center">' + (Math.max(0,(l.qtyCommanded||0)-(l.totalReceived||0))) + '</td>'
      + '</tr>';
  }).join('');
  return '<div style="background:#fff;max-width:800px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;font-size:13px">'
    + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">'
    + '<div>' + _logo + '<div style="font-size:18px;font-weight:700;color:#1B3A6B;margin-top:6px">' + (_co.companyName||'GMA') + '</div></div>'
    + '<div style="text-align:right"><div style="font-size:22px;font-weight:900;color:#E8640A">BON DE RÉCEPTION</div>'
    + '<div style="font-size:14px;font-weight:700;color:#1B3A6B">' + (cmd.numero||'') + '</div>'
    + '<div style="font-size:11px;color:#666">' + (typeof fmtDateTime === 'function' ? fmtDateTime(_now) : new Date(_now).toLocaleString()) + '</div></div></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:12px">'
    + '<div><strong>Fournisseur:</strong> ' + (_fourn.nom||cmd.fournisseurNom||'') + '</div>'
    + '<div><strong>Commande:</strong> ' + (cmd.numero||'') + '</div></div>'
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">'
    + '<thead><tr style="background:#1B3A6B;color:#fff">'
    + '<th style="padding:8px 10px;text-align:left">Code</th>'
    + '<th style="padding:8px 10px;text-align:left">Désignation</th>'
    + '<th style="padding:8px 10px;text-align:center">Qté cmdée</th>'
    + '<th style="padding:8px 10px;text-align:center">Qté reçue</th>'
    + '<th style="padding:8px 10px;text-align:center">Total reçu</th>'
    + '<th style="padding:8px 10px;text-align:center">Restant</th>'
    + '</tr></thead><tbody>' + _rows + '</tbody></table>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:30px">'
    + '<div style="border-top:2px solid #333;padding-top:8px;text-align:center;font-size:12px">Réceptionnaire</div>'
    + '<div style="border-top:2px solid #333;padding-top:8px;text-align:center;font-size:12px">Gestionnaire</div>'
    + '<div style="border-top:2px solid #333;padding-top:8px;text-align:center;font-size:12px">Représentant Fournisseur</div>'
    + '</div></div>';
}

function printReceptionBon(cmd, recLines) {
  var _win = window.open('', '_blank', 'width=900,height=750');
  if (!_win) { notify('Autorisez les popups pour imprimer', 'warning'); return; }
  _win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bon Reception ' + (cmd.numero||'') + '<\/title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#f0f0f0;padding:20px}@media print{body{background:#fff;padding:0}@page{margin:10mm}}<\/style>'
    + '<\/head><body>' + generateReceptionHTML(cmd, recLines)
    + '<script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script>'
    + '<\/body><\/html>');
  _win.document.close();
  if (typeof auditLog === 'function') auditLog('PRINT', 'commandeFourn', cmd.id, null, { action: 'reception_pdf' });
}

function openReceptionModal(cmdId) {
  var c = (APP.commandesFourn||[]).find(function(x){ return x.id === cmdId; });
  if (!c) return;
  var pct = calcCmdPct(c);

  var lignesHtml = (c.lignes||[]).map(function(l, i) {
    var restant = Math.max(0, (l.qteCommandee||0) - (l.qteRecue||0));
    return '<div style="background:var(--bg-2);border-radius:var(--radius);padding:12px;margin-bottom:8px">'
      + '<div style="font-size:13px;font-weight:600;margin-bottom:8px">' + l.articleName + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px">'
      + '<div><label style="font-size:10px;color:var(--text-3)">QTE Command\u00e9</label><div style="font-weight:700;font-size:14px;padding:6px 0">' + (l.qteCommandee||0) + '</div></div>'
      + '<div><label style="font-size:10px;color:var(--success)">QTE Re\u00e7u</label><div style="font-weight:700;font-size:14px;padding:6px 0;color:var(--success)">' + (l.qteRecue||0) + '</div></div>'
      + '<div><label style="font-size:10px;color:var(--warning)">QTE Restant</label><div style="font-weight:700;font-size:14px;padding:6px 0;color:var(--warning)">' + restant + '</div></div>'
      + '<div><label style="font-size:10px;color:var(--accent)">\u00c0 enregistrer \u270f</label><input class="rec-qty-new" type="number" value="0" min="0" max="' + restant + '" data-idx="' + i + '" data-max="' + restant + '" style="font-weight:700;font-size:14px;text-align:center;width:100%;padding:4px"></div>'
      + '</div>'
      + '<div style="margin-top:6px"><label style="font-size:10px;color:var(--text-3)">Note (optionnel)</label><input class="rec-note" data-idx="' + i + '" placeholder="Ex: Palette endommag\u00e9e, lot #123..." style="width:100%;font-size:11px;padding:4px 8px;box-sizing:border-box"></div>'
      + '</div>';
  }).join('');

  var body = '<div style="margin-bottom:16px">'
    + '<div style="font-size:13px;font-weight:600;margin-bottom:4px">' + c.numero + ' \u2014 ' + c.fournisseurNom + '</div>'
    + '<div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden;margin:8px 0"><div style="height:100%;width:' + pct + '%;background:' + getCmdProgressColor(pct) + ';border-radius:3px"></div></div>'
    + '<div style="font-size:11px;color:var(--text-2)">' + pct + '% re\u00e7u actuellement</div>'
    + '</div>'
    + '<div class="form-group" style="margin-bottom:12px"><label style="font-size:11px">Date de r\u00e9ception</label><input type="date" id="rec-date" value="' + new Date().toISOString().split('T')[0] + '"></div>'
    + '<div id="rec-lignes">' + lignesHtml + '</div>'
    + '<div style="font-size:11px;color:var(--text-2);margin-top:8px;background:var(--bg-3);padding:8px 10px;border-radius:6px">\u26a1 Entrez la quantit\u00e9 re\u00e7ue <strong>aujourd\'hui</strong> pour chaque article. Elle sera ajout\u00e9e au stock et \u00e0 l\'historique.</div>';

  openModal('reception', '\ud83d\udce5 R\u00e9ceptionner \u2014 ' + c.numero, body, function() {
    var recDate = document.getElementById('rec-date');
    var dateTs = recDate && recDate.value ? new Date(recDate.value).getTime() : Date.now();
    var anyChange = false;
    var _recLines = [];

    document.querySelectorAll('.rec-qty-new').forEach(function(inp) {
      var idx = parseInt(inp.dataset.idx);
      var qtyToAdd = Math.min(Math.max(0, parseInt(inp.value) || 0), parseInt(inp.dataset.max) || 0);
      if (qtyToAdd <= 0) return;

      var ligne = c.lignes[idx];
      var noteEl = document.querySelector('.rec-note[data-idx="' + idx + '"]');
      var note = noteEl ? noteEl.value.trim() : '';

      // Add to reception history
      if (!ligne.receptions) ligne.receptions = [];
      ligne.receptions.push({ date: dateTs, qty: qtyToAdd, note: note, by: (typeof _currentUser === 'function' && _currentUser()) ? _currentUser().name : '' });

      // Update stock
      var art = APP.articles.find(function(a){ return a.id === ligne.articleId; });
      if (art) {
        art.stock += qtyToAdd;
        var _sb11=art.stock-qtyToAdd; APP.mouvements.push({ id: generateId(), type: 'entree', articleId: art.id, articleName: art.name, qty: qtyToAdd, ts: dateTs, fournisseurId: c.fournisseurId, note: 'R\u00e9ception ' + c.numero + (note ? ' - ' + note : ''), stockBefore: _sb11, stockAfter: art.stock });
      }

      ligne.qteRecue = (ligne.qteRecue || 0) + qtyToAdd;
      _recLines.push({ articleCode: ligne.articleCode||ligne.code||'', articleName: ligne.articleName||'', qtyCommanded: ligne.qteCommandee||0, qtyReceived: qtyToAdd, totalReceived: ligne.qteRecue||0 });
      anyChange = true;
    });

    c.status = calcCmdStatus(c);
    auditLog('EDIT', 'commandeFourn', c.id, null, { status: c.status });
    saveDB(); closeModal();
    // Re-render full dashboard (including supplier gauge-circles)
    renderFournDashboard();
    // Re-open the supplier's order list
    setTimeout(function() { toggleFournOrders(c.fournisseurId); }, 100);
    updateAlertBadge();
    notify(anyChange ? 'R\u00e9ception enregistr\u00e9e, stock mis \u00e0 jour \u2713' : 'Aucun changement', anyChange ? 'success' : 'info');
    if (anyChange && _recLines.length > 0) {
      var _rc = c; var _rl = _recLines.slice();
      setTimeout(function() {
        if (confirm('Imprimer le bon de réception ?')) printReceptionBon(_rc, _rl);
      }, 400);
    }
  }, 'modal-lg');
}

// ── Modal édition complète ──────────────────────────────────

function openEditCmdModal(cmdId) {
  var c = (APP.commandesFourn||[]).find(function(x){ return x.id === cmdId; });
  if (!c) return;

  var lignesHtml = (c.lignes||[]).map(function(l, i) {
    return '<div class="ec-ligne-row" data-idx="' + i + '" style="background:var(--bg-2);border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid var(--border)">'
      + '<div style="display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr auto;gap:8px;align-items:end">'
      + '<div><label style="font-size:10px">Article</label><input value="' + l.articleName + '" disabled style="opacity:.7"></div>'
      + '<div><label style="font-size:10px">Qt\u00e9 command\u00e9e</label><input class="ec-qteCmd" type="number" value="' + (l.qteCommandee||0) + '" data-idx="' + i + '" min="1"></div>'
      + '<div><label style="font-size:10px">Qt\u00e9 re\u00e7ue</label><div style="font-weight:700;padding:8px 0;color:var(--success)">' + (l.qteRecue||0) + '</div></div>'
      + '<div><label style="font-size:10px">Prix unit.</label><input class="ec-prix" type="number" value="' + (l.prixUnitaire||0) + '" data-idx="' + i + '" min="0" step="0.01"></div>'
      + '<button class="btn btn-sm btn-danger" onclick="this.closest(\'.ec-ligne-row\').remove()" style="margin-bottom:2px">\u2716</button>'
      + '</div></div>';
  }).join('');

  // Article options for adding new lines
  var artOpts = (APP.articles||[]).map(function(a) {
    return '<option value="' + a.id + '">' + a.name + '</option>';
  }).join('');

  var body = '<div class="form-row">'
    + '<div class="form-group"><label>N\u00b0 Commande</label><input id="ec-num" value="' + c.numero + '"></div>'
    + '<div class="form-group"><label>Statut</label><select id="ec-status"><option value="pending" ' + (c.status==='pending'?'selected':'') + '>En attente</option><option value="partial" ' + (c.status==='partial'?'selected':'') + '>Partielle</option><option value="complete" ' + (c.status==='complete'?'selected':'') + '>Compl\u00e8te</option><option value="cancelled" ' + (c.status==='cancelled'?'selected':'') + '>Annul\u00e9e</option></select></div>'
    + '</div>'
    + '<div class="form-row">'
    + '<div class="form-group"><label>Date commande</label><input id="ec-date" type="date" value="' + new Date(c.dateCommande).toISOString().split('T')[0] + '"></div>'
    + '<div class="form-group"><label>Livraison pr\u00e9vue</label><input id="ec-dliv" type="date" value="' + (c.dateLivraisonPrevue ? new Date(c.dateLivraisonPrevue).toISOString().split('T')[0] : '') + '"></div>'
    + '</div>'
    + '<div style="font-size:12px;font-weight:700;margin:12px 0 6px">Articles de la commande</div>'
    + '<div id="ec-lignes">' + lignesHtml + '</div>'
    + '<div style="display:flex;gap:8px;align-items:end;margin:8px 0;background:var(--bg-3);padding:10px;border-radius:8px">'
    + '<div style="flex:2"><label style="font-size:10px">Ajouter un article</label><select id="ec-new-art"><option value="">-- Choisir --</option>' + artOpts + '</select></div>'
    + '<div style="flex:1"><label style="font-size:10px">Qt\u00e9</label><input id="ec-new-qty" type="number" value="1" min="1"></div>'
    + '<div style="flex:1"><label style="font-size:10px">Prix unit.</label><input id="ec-new-prix" type="number" value="0" min="0"></div>'
    + '<button class="btn btn-sm btn-primary" onclick="_addEditCmdLine()">+ Ajouter</button>'
    + '</div>'
    + '<div class="form-group"><label>Note</label><textarea id="ec-note" style="min-height:60px">' + (c.note||'') + '</textarea></div>';

  openModal('edit-cmd', '\u270f Modifier \u2014 ' + c.numero, body, function() {
    c.numero = document.getElementById('ec-num').value || c.numero;
    c.status = document.getElementById('ec-status').value;
    var dateVal = document.getElementById('ec-date').value;
    if (dateVal) c.dateCommande = new Date(dateVal).getTime();
    var dlivVal = document.getElementById('ec-dliv').value;
    c.dateLivraisonPrevue = dlivVal ? new Date(dlivVal).getTime() : null;
    c.note = document.getElementById('ec-note').value;

    // Update existing lines
    document.querySelectorAll('.ec-qteCmd').forEach(function(inp) {
      var i = parseInt(inp.dataset.idx);
      if (c.lignes[i]) c.lignes[i].qteCommandee = parseInt(inp.value) || c.lignes[i].qteCommandee;
    });
    document.querySelectorAll('.ec-prix').forEach(function(inp) {
      var i = parseInt(inp.dataset.idx);
      if (c.lignes[i]) c.lignes[i].prixUnitaire = parseFloat(inp.value) || 0;
    });

    // Remove deleted lines (check which data-idx still exist in DOM)
    var remaining = [];
    document.querySelectorAll('.ec-ligne-row').forEach(function(row) {
      var idx = parseInt(row.dataset.idx);
      if (!isNaN(idx) && c.lignes[idx]) remaining.push(c.lignes[idx]);
    });
    // Also add any new lines
    document.querySelectorAll('.ec-new-ligne-row').forEach(function(row) {
      var artId = row.dataset.artid;
      var artName = row.dataset.artname;
      var qty = parseInt(row.querySelector('.ec-new-ligne-qty').value) || 1;
      var prix = parseFloat(row.querySelector('.ec-new-ligne-prix').value) || 0;
      remaining.push({ articleId: artId, articleName: artName, qteCommandee: qty, qteRecue: 0, prixUnitaire: prix, receptions: [] });
    });
    if (remaining.length > 0) c.lignes = remaining;

    c.status = calcCmdStatus(c);
    auditLog('EDIT', 'commandeFourn', c.id, null, c);
    saveDB(); closeModal(); renderFournDashboard(); updateAlertBadge();
    notify('Commande modifi\u00e9e', 'success');
  }, 'modal-lg');
}

function _addEditCmdLine() {
  var sel = document.getElementById('ec-new-art');
  var qty = document.getElementById('ec-new-qty');
  var prix = document.getElementById('ec-new-prix');
  if (!sel || !sel.value) { notify('Choisissez un article', 'warning'); return; }
  var art = APP.articles.find(function(a){ return a.id === sel.value; });
  if (!art) return;

  var row = document.createElement('div');
  row.className = 'ec-new-ligne-row';
  row.dataset.artid = art.id;
  row.dataset.artname = art.name;
  row.style.cssText = 'background:var(--bg-2);border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid var(--accent);border-style:dashed';
  row.innerHTML = '<div style="display:grid;grid-template-columns:2.5fr 1fr 1fr auto;gap:8px;align-items:end">'
    + '<div><label style="font-size:10px;color:var(--accent)">Nouvel article</label><input value="' + art.name + '" disabled style="color:var(--accent)"></div>'
    + '<div><label style="font-size:10px">Qt\u00e9</label><input class="ec-new-ligne-qty" type="number" value="' + (parseInt(qty.value)||1) + '" min="1"></div>'
    + '<div><label style="font-size:10px">Prix unit.</label><input class="ec-new-ligne-prix" type="number" value="' + (parseFloat(prix.value)||0) + '" min="0"></div>'
    + '<button class="btn btn-sm btn-danger" onclick="this.closest(\'.ec-new-ligne-row\').remove()" style="margin-bottom:2px">\u2716</button>'
    + '</div>';
  document.getElementById('ec-lignes').appendChild(row);
  sel.value = '';
  qty.value = '1';
  prix.value = '0';
}

// ── Supprimer commande ──────────────────────────────────────

function deleteCmd(cmdId) {
  if (!confirm('Supprimer cette commande ?')) return;
  var idx = (APP.commandesFourn||[]).findIndex(function(c){ return c.id === cmdId; });
  if (idx < 0) return;
  auditLog('DELETE', 'commandeFourn', cmdId, APP.commandesFourn[idx], null);
  APP.commandesFourn.splice(idx, 1);
  saveDB(); renderFournDashboard(); updateAlertBadge();
  notify('Commande supprim\u00e9e', 'success');
}

// ── Dupliquer commande ───────────────────────────────────────

async function duplicateCmd(cmdId) {
  var orig = (APP.commandesFourn||[]).find(function(c) { return c.id === cmdId; });
  if (!orig) return;
  if (!confirm('Dupliquer la commande ' + orig.numero + ' ?')) return;
  var dup = JSON.parse(JSON.stringify(orig));
  dup.id = generateId();
  dup.numero = await cmdOrderNum();
  dup.status = 'pending';
  dup.dateCommande = Date.now();
  dup.createdAt = Date.now();
  // Reset receptions
  (dup.lignes||[]).forEach(function(l) { l.qteRecue = 0; l.receptions = []; });
  if (!APP.commandesFourn) APP.commandesFourn = [];
  APP.commandesFourn.push(dup);
  auditLog('CREATE', 'commandeFourn', dup.id, null, dup);
  saveDB(); renderFournDashboard(); updateAlertBadge();
  notify('Commande dupliqu\u00e9e: ' + dup.numero, 'success');
}

// ── Refresh card ────────────────────────────────────────────

function refreshOrderCard(c) {
  var card = document.getElementById('order-card-' + c.id);
  if (!card) return;
  card.outerHTML = renderOrderCard(c);
}

// ── Créer une nouvelle commande ─────────────────────────────

function _importLowStockCmd() {
  var lowStock = (APP.articles||[]).filter(function(a) {
    var threshold = a.stockMin || a.seuilAlerte || 10;
    return (a.stock||0) <= threshold;
  });
  if (lowStock.length === 0) { notify('Aucun article en stock bas', 'info'); return; }
  var preselected = lowStock.map(function(a) {
    return { artId: a.id, name: a.name };
  });
  openNewCmdModal(null, preselected);
}

function _findDuplicateCmds(fournisseurId, lignes) {
  var _artIds = new Set(lignes.map(function(l) { return l.articleId; }));
  return (APP.commandesFourn || []).filter(function(c) {
    if (c.fournisseurId !== fournisseurId) return false;
    if (c.status !== 'pending' && c.status !== 'partial') return false;
    return (c.lignes || []).some(function(l) { return _artIds.has(l.articleId); });
  });
}

function _confirmDuplicateCmd() {
  closeModal();
  var p = window._pendingCmdData;
  if (!p) return;
  var fourn = (APP.fournisseurs || []).find(function(f){ return f.id === p.fournId; });
  var cmd = {
    id: generateId(), numero: p.numero, fournisseurId: p.fournId,
    fournisseurNom: fourn ? (fourn.nom || '') : '',
    lignes: p.lignes, status: 'pending', note: p.note,
    dateCommande: Date.now(), dateLivraisonPrevue: null, createdAt: Date.now(),
    _createdDespiteDuplicate: true
  };
  if (!APP.commandesFourn) APP.commandesFourn = [];
  APP.commandesFourn.push(cmd);
  auditLog('CREATE', 'commandeFourn', cmd.id, null, cmd);
  saveDB(); renderFournDashboard(); updateAlertBadge();
  notify('Commande ' + cmd.numero + ' créée ✓', 'success');
  window._pendingCmdData = null;
}

async function openNewCmdModal(prefFournId, preselectedArts) {
  var fournOpts = (APP.fournisseurs||[]).map(function(f) {
    return '<option value="' + f.id + '" ' + (prefFournId === f.id ? 'selected' : '') + '>' + f.nom + (f.entreprise ? ' (' + f.entreprise + ')' : '') + '</option>';
  }).join('');

  var artOpts = (APP.articles||[]).map(function(a) {
    return '<option value="' + a.id + '" data-name="' + (a.name||'').replace(/"/g,'&quot;') + '" data-prix="' + (a.prixAchat||a.prix||0) + '">' + a.name + ' (stock: ' + (a.stock||0) + ')</option>';
  }).join('');

  // Pre-fill lines
  var prefillHtml = '';
  if (preselectedArts && preselectedArts.length) {
    preselectedArts.forEach(function(pa, i) {
      var art = APP.articles.find(function(a) { return a.id === pa.artId; });
      prefillHtml += _newCmdLineHtml(i, pa.artId, pa.name || (art ? art.name : ''), 1, art ? (art.prixAchat||art.prix||0) : 0, artOpts);
    });
  }

  var _ncNum = await cmdOrderNum();
  var body = '<div class="form-row">'
    + '<div class="form-group"><label>Fournisseur *</label><select id="nc-fourn"><option value="">-- Choisir --</option>' + fournOpts + '</select></div>'
    + '<div class="form-group"><label>N\u00b0 Commande</label><input id="nc-num" value="' + _ncNum + '"></div>'
    + '</div>'
    + '<div class="form-row">'
    + '<div class="form-group"><label>Date commande</label><input id="nc-date" type="date" value="' + new Date().toISOString().split('T')[0] + '"></div>'
    + '<div class="form-group"><label>Livraison pr\u00e9vue</label><input id="nc-dliv" type="date"></div>'
    + '</div>'
    + '<div style="font-size:12px;font-weight:700;margin:12px 0 6px">Articles de la commande</div>'
    + '<div id="nc-lignes">' + prefillHtml + '</div>'
    + '<div style="display:flex;gap:8px;align-items:end;margin:8px 0;background:var(--bg-3);padding:10px;border-radius:8px">'
    + '<div style="flex:2"><label style="font-size:10px">Ajouter un article</label><select id="nc-art-sel"><option value="">-- Choisir --</option>' + artOpts + '</select></div>'
    + '<div style="flex:1"><label style="font-size:10px">Qt\u00e9</label><input id="nc-art-qty" type="number" value="1" min="1"></div>'
    + '<div style="flex:1"><label style="font-size:10px">Prix unit.</label><input id="nc-art-prix" type="number" value="0" min="0" step="0.01"></div>'
    + '<button class="btn btn-sm btn-primary" onclick="_addNewCmdLine()">+ Ajouter</button>'
    + '</div>'
    + '<div class="form-group"><label>Note</label><textarea id="nc-note" style="min-height:50px" placeholder="Remarques sur la commande..."></textarea></div>';

  openModal('new-cmd', '\ud83d\udce6 Nouvelle commande fournisseur', body, function() {
    var fournId = document.getElementById('nc-fourn').value;
    if (!fournId) { notify('S\u00e9lectionnez un fournisseur', 'warning'); return; }
    var fourn = APP.fournisseurs.find(function(f) { return f.id === fournId; });

    // Collect lines
    var lignes = [];
    document.querySelectorAll('.nc-ligne-row').forEach(function(row) {
      var artId = row.dataset.artid;
      var artName = row.dataset.artname;
      var qty = parseInt(row.querySelector('.nc-ligne-qty').value) || 0;
      var prix = parseFloat(row.querySelector('.nc-ligne-prix').value) || 0;
      if (artId && qty > 0) {
        lignes.push({ articleId: artId, articleName: artName, qteCommandee: qty, qteRecue: 0, prixUnitaire: prix, receptions: [] });
      }
    });

    if (lignes.length === 0) { notify('Ajoutez au moins un article', 'warning'); return; }

    var dateVal = document.getElementById('nc-date').value;
    var dlivVal = document.getElementById('nc-dliv').value;

    var cmd = {
      id: generateId(),
      numero: document.getElementById('nc-num').value || _ncNum,
      fournisseurId: fournId,
      fournisseurNom: fourn ? fourn.nom : '',
      lignes: lignes,
      status: 'pending',
      note: document.getElementById('nc-note').value || '',
      dateCommande: dateVal ? new Date(dateVal).getTime() : Date.now(),
      dateLivraisonPrevue: dlivVal ? new Date(dlivVal).getTime() : null,
      createdAt: Date.now()
    };

    if (!APP.commandesFourn) APP.commandesFourn = [];

    // F10: Duplicate check
    var _dupCmds = _findDuplicateCmds(fournId, lignes);
    if (_dupCmds.length > 0) {
      var _dupRows = _dupCmds.map(function(dc) {
        var _shared = (dc.lignes||[]).filter(function(dl){ return lignes.some(function(nl){ return nl.articleId === dl.articleId; }); });
        return '<div style="background:var(--bg-2);border-radius:8px;padding:10px;margin-bottom:8px;border-left:3px solid var(--warning)">'
          + '<div style="font-weight:700;font-size:13px">' + (dc.numero||'') + '</div>'
          + '<div style="font-size:12px;color:var(--warning);margin-top:4px">Articles en commun: ' + _shared.map(function(l){ return l.articleName||''; }).join(', ') + '</div>'
          + '</div>';
      }).join('');
      var _warnBody = '<div style="color:var(--warning);font-weight:700;font-size:14px;margin-bottom:12px">⚠ Commande similaire déjà en cours</div>'
        + '<p style="font-size:13px;margin-bottom:12px">Ce fournisseur a déjà une commande en attente avec les mêmes articles :</p>'
        + _dupRows
        + '<p style="font-size:12px;color:var(--text-2);margin-top:12px">Créer quand même ?</p>';
      window._pendingCmdData = { fournId: fournId, lignes: lignes, note: cmd.note||'', numero: cmd.numero };
      closeModal();
      openModal('dup-warning', '⚠ Doublon potentiel', _warnBody, function() { _confirmDuplicateCmd(); }, 'modal-md');
      return;
    }

    APP.commandesFourn.push(cmd);
    auditLog('CREATE', 'commandeFourn', cmd.id, null, cmd);
    saveDB(); closeModal(); renderFournDashboard(); updateAlertBadge();
    notify('Commande ' + cmd.numero + ' cr\u00e9\u00e9e \u2713', 'success');
  }, 'modal-lg');

  // Auto-fill price when selecting article
  var artSel = document.getElementById('nc-art-sel');
  if (artSel) {
    artSel.onchange = function() {
      var opt = artSel.options[artSel.selectedIndex];
      if (opt && opt.dataset.prix) {
        document.getElementById('nc-art-prix').value = opt.dataset.prix;
      }
    };
  }
}

function _newCmdLineHtml(idx, artId, artName, qty, prix, artOpts) {
  var _a = (APP.articles||[]).find(function(x){ return x.id === artId; }) || {};
  var _f = _a.fournisseurId ? ((APP.fournisseurs||[]).find(function(f){return f.id===_a.fournisseurId;})||{}) : {};
  var _thumb = _a.image
    ? '<img src="' + _a.image + '" style="width:44px;height:44px;object-fit:cover;border-radius:6px;display:block">'
    : '<div style="width:44px;height:44px;border-radius:6px;background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:18px;opacity:0.4">\ud83d\udce6</div>';
  var _fournHint = _f.nom ? '<div style="font-size:10px;color:var(--accent2);font-weight:600;margin-top:2px">\ud83c\udfed ' + _f.nom + '</div>' : '';
  return '<div class="nc-ligne-row" data-artid="' + artId + '" data-artname="' + (artName||'').replace(/"/g,'&quot;') + '" style="background:var(--bg-2);border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid var(--border)">'
    + '<div style="display:grid;grid-template-columns:44px 2.5fr 1fr 1fr auto;gap:8px;align-items:end">'
    + '<div>' + _thumb + '</div>'
    + '<div><label style="font-size:10px">Article</label><input value="' + (artName||'') + '" disabled style="font-weight:600">' + _fournHint + '</div>'
    + '<div><label style="font-size:10px">Qt\u00e9</label><input class="nc-ligne-qty" type="number" value="' + (qty||1) + '" min="1"></div>'
    + '<div><label style="font-size:10px">Prix unit.</label><input class="nc-ligne-prix" type="number" value="' + (prix||0) + '" min="0" step="0.01"></div>'
    + '<button class="btn btn-sm btn-danger" onclick="this.closest(\'.nc-ligne-row\').remove()" style="margin-bottom:2px">\u2716</button>'
    + '</div></div>';
}

function _addNewCmdLine() {
  var sel = document.getElementById('nc-art-sel');
  var qtyEl = document.getElementById('nc-art-qty');
  var prixEl = document.getElementById('nc-art-prix');
  if (!sel || !sel.value) { notify('Choisissez un article', 'warning'); return; }
  var opt = sel.options[sel.selectedIndex];
  var artId = sel.value;
  var artName = opt.dataset.name || opt.textContent;
  var qty = parseInt(qtyEl.value) || 1;
  var prix = parseFloat(prixEl.value) || 0;

  // Check if already added
  var existing = document.querySelector('.nc-ligne-row[data-artid="' + artId + '"]');
  if (existing) { notify('Article d\u00e9j\u00e0 ajout\u00e9', 'warning'); return; }

  var container = document.getElementById('nc-lignes');
  container.insertAdjacentHTML('beforeend', _newCmdLineHtml(0, artId, artName, qty, prix));
  sel.value = '';
  qtyEl.value = '1';
  prixEl.value = '0';
}

// Legacy compat
function attachOrderInlineEditors() {}
function openFragLivModal() {}
function saveFragLiv() {}
function _ORIGINAL_openFragLivModal() {}
function addFragRow() {}


// ============================================================
// ANALYTICS IA
// ============================================================
function getTopArticles(limit=5) {
  const w30=Date.now()-30*86400000, artQty={};
  APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>w30).forEach(m=>{
    if(!artQty[m.articleId]) artQty[m.articleId]={id:m.articleId,name:m.articleName,qty:0,count:0};
    artQty[m.articleId].qty+=m.qty; artQty[m.articleId].count++;
  });
  return Object.values(artQty).sort((a,b)=>b.qty-a.qty).slice(0,limit);
}

function getActiveAgents(limit=5) {
  const w30 = Date.now() - 30*86400000;
  const _norm = function(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase(); };
  const agentData = {};
  (APP.commerciaux||[]).forEach(function(c){
    const _fullA = _norm((c.prenom||'')+' '+(c.nom||''));
    const _fullB = _norm((c.nom||'')+' '+(c.prenom||''));
    const _matchBon = function(b){
      if (b.commercialId === c.id) return true;
      // Bon annuaire: ne jamais le rattacher a un commercial homonyme
      if (b._recipientType === 'annuaire') return false;
      if (!_fullA) return false;
      const _d = _norm(b.demandeur);
      const _r = _norm(b.recipiendaire);
      return (_d===_fullA||_d===_fullB||_r===_fullA||_r===_fullB);
    };
    const matchedBons = (APP.bons||[]).filter(function(b){ return _matchBon(b) && (b.createdAt||0) > w30; });
    const bonsCount = matchedBons.length;
    const qtyFromBons = matchedBons.filter(function(b){return b.status==='validé';}).reduce(function(s,b){
      return s + (b.lignes||[]).reduce(function(sl,l){return sl + (parseInt(l.qty)||0);}, 0);
    }, 0);
    const qtyFromManual = (APP.mouvements||[]).filter(function(m){
      if (m.type !== 'sortie') return false;
      if ((m.ts||0) <= w30) return false;
      if (m.commercialId !== c.id) return false;
      return !/^(?:Modif |Suppression |Renvoi )?Bon\s+\S+/i.test(m.note||'');
    }).reduce(function(s,m){return s+m.qty;}, 0);
    const qty = qtyFromBons + qtyFromManual;
    if (qty > 0 || bonsCount > 0) {
      agentData[c.id] = { id:c.id, name:((c.prenom||'')+' '+(c.nom||'')).trim()||'Inconnu', qty:qty, bons:bonsCount };
    }
  });
  return Object.values(agentData).sort(function(a,b){return b.qty-a.qty;}).slice(0, limit);
}

function getEntryExitRatio() {
  const w30=Date.now()-30*86400000;
  const entrees=APP.mouvements.filter(m=>m.type==='entree'&&m.ts>w30).reduce((s,m)=>s+m.qty,0);
  const sorties=APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>w30).reduce((s,m)=>s+m.qty,0);
  return{entrees,sorties,ratio:sorties>0?(entrees/sorties).toFixed(2):'∞',balance:entrees-sorties};
}

function predictShortages() {
  const predictions=[], w30=Date.now()-30*86400000;
  APP.articles.forEach(a=>{
    const sorties30d=APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>w30).reduce((s,m)=>s+m.qty,0);
    if(!sorties30d) return;
    const dailyRate=sorties30d/30; if(!dailyRate) return;
    const daysLeft=Math.floor((a.stock-a.stockMin)/dailyRate);
    if(daysLeft<=30) predictions.push({article:a,dailyRate:dailyRate.toFixed(1),daysLeft:Math.max(0,daysLeft),urgency:daysLeft<=7?'critical':daysLeft<=14?'high':'medium'});
  });
  return predictions.sort((a,b)=>a.daysLeft-b.daysLeft);
}

function getSuggestions() {
  return predictShortages().filter(p=>p.daysLeft<=21).map(p=>{
    const suggestQty=Math.ceil(p.dailyRate*30+p.article.stockMin-p.article.stock);
    return{...p,suggestQty:Math.max(suggestQty,p.article.stockMin*2)};
  });
}

function renderAnalytics() {
  const topArts=getTopArticles(), agents=getActiveAgents();
  const ratio=getEntryExitRatio(), predictions=predictShortages(), suggestions=getSuggestions();
  document.getElementById('content').innerHTML=`
  <div class="page-header">
    <div><div class="page-title">🧠 Analytique</div><div class="page-sub">Insights intelligents — prévisions basées sur l'historique, fréquence et moyenne des sorties</div></div>
  </div>
  <div class="grid-4 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">Entrées / 30j</span></div><div class="kpi-value" style="color:var(--success)">${ratio.entrees}</div><div class="kpi-change">unités reçues</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Sorties / 30j</span></div><div class="kpi-value" style="color:var(--accent3)">${ratio.sorties}</div><div class="kpi-change">unités distribuées</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Ratio E/S</span></div><div class="kpi-value" style="color:${parseFloat(ratio.ratio)<1?'var(--danger)':parseFloat(ratio.ratio)>1.5?'var(--success)':'var(--warning)'}">${ratio.ratio}</div><div class="kpi-change">entrées par sortie</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Balance</span></div><div class="kpi-value" style="color:${ratio.balance>=0?'var(--success)':'var(--danger)'}">${ratio.balance>=0?'+':''}${ratio.balance}</div><div class="kpi-change">unités net</div></div>
  </div>
  <div class="card mb-16">
    <div class="card-header"><span class="card-title">👑 Agents les plus actifs</span><span style="font-size:11px;color:var(--text-2)">30 jours</span></div>
    ${agents.length===0?'<div class="empty-state"><p>Aucune activité</p></div>':agents.map((a,i)=>{const max=agents[0].qty||1;return`<div class="rank-item"><div class="rank-num ${i===0?'top':''}">${i+1}</div><div style="flex:1"><div style="font-size:13px;font-weight:600;margin-bottom:4px">${a.name}</div><div class="progress-bar"><div class="progress-fill" style="width:${a.qty/max*100}%;background:${i===0?'var(--warning)':'var(--accent)'}"></div></div></div><div class="text-right" style="margin-left:12px"><div style="font-weight:700;font-size:13px">${a.qty}</div><div style="font-size:11px;color:var(--text-2)">${a.bons} bons</div></div></div>`;}).join('')}
  </div>
  <div class="grid-2 mb-16">
    <div class="card">
      <div class="card-header"><span class="card-title">📦 Top gadgets sortis</span><span style="font-size:11px;color:var(--text-2)">30 jours</span></div>
      ${topArts.length===0?'<div class="empty-state"><p>Aucune sortie</p></div>':topArts.map((a,i)=>{const max=topArts[0].qty||1;return`<div class="rank-item"><div class="rank-num ${i===0?'top':''}">${i+1}</div><div style="flex:1"><div style="font-size:13px;font-weight:600;margin-bottom:4px">${a.name}</div><div class="progress-bar"><div class="progress-fill" style="width:${a.qty/max*100}%;background:${i===0?'var(--accent3)':'var(--accent)'}"></div></div></div><div class="text-right" style="margin-left:12px"><div style="font-weight:700;font-size:13px">${a.qty}</div><div style="font-size:11px;color:var(--text-2)">${a.count} mvts</div></div></div>`;}).join('')}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">📉 Prévisions de rupture</span>${predictions.filter(p=>p.urgency==='critical').length?`<span class="badge badge-red">⚠ Critique</span>`:''}</div>
      ${predictions.length===0?'<div class="empty-state"><p>✅ Aucune rupture prévue sous 30 jours</p></div>':predictions.slice(0,6).map(p=>`<div class="stat-row"><div><div style="font-size:13px;font-weight:600">${p.article.name}</div><div style="font-size:11px;color:var(--text-2)">${p.dailyRate}/jour — Stock: ${p.article.stock}</div></div><div><span class="badge ${p.urgency==='critical'?'badge-red':p.urgency==='high'?'badge-orange':'badge-yellow'}">${p.daysLeft===0?'Rupture!':p.daysLeft+' j'}</span></div></div>`).join('')}
    </div>
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">🛒 Commandes suggérées</span></div>
    ${suggestions.length===0?'<div class="empty-state"><p>✅ Aucune commande urgente nécessaire</p></div>':suggestions.map(s=>`<div class="suggestion-card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px"><div style="flex:1;min-width:200px"><div class="art-name">${s.article.name} <span class="badge badge-blue">${s.article.code}</span></div><div class="art-detail">Stock: ${s.article.stock} — Seuil: ${s.article.stockMin} — Rate: ${s.dailyRate}/j</div></div><div style="display:flex;align-items:center;gap:14px"><div class="text-right"><div style="font-size:20px;font-weight:700;color:var(--accent)">${s.suggestQty}</div><div style="font-size:11px;color:var(--text-2)">unités à commander</div><div style="font-size:11px;color:${s.urgency==='critical'?'var(--danger)':'var(--warning)'}">${s.daysLeft===0?'⚡ Urgent!':s.daysLeft+' jours'}</div></div><button class="btn btn-sm btn-primary" onclick="launchSuggestedOrder('${s.article.id}',${s.suggestQty})" title="Lancer une commande fournisseur">🛒 Commander</button></div></div>`).join('')}
  </div>`;
}

function launchSuggestedOrder(articleId, suggestQty) {
  const art = APP.articles.find(a=>a.id===articleId);
  if(!art) { notify('Article introuvable','error'); return; }
  // Find the supplier for this article
  const fourn = art.fournisseurId ? APP.fournisseurs.find(f=>f.id===art.fournisseurId) : null;
  const prefFournId = fourn ? fourn.id : (APP.fournisseurs[0]?.id || '');
  if(!APP.fournisseurs.length) { notify('Ajoutez d\'abord un fournisseur dans le module Fournisseurs','warning'); return; }
  // Open the new command modal pre-filled with this article and suggested qty
  openNewCmdModal(prefFournId, [{ artId: articleId, name: art.name }]);
  // After modal opens, pre-fill the quantity
  setTimeout(() => {
    const qtyInput = document.querySelector('#nc-lignes .nc-ligne .nc-qty');
    if(qtyInput) qtyInput.value = suggestQty;
  }, 100);
}

// ============================================================
// AUDIT TRAIL
// ============================================================
function renderAudit() {
  const types   = [...new Set(APP.audit.map(a=>a.type))].sort();
  const entities= [...new Set(APP.audit.map(a=>a.entity))].sort();
  document.getElementById('content').innerHTML=`
  <div class="flex-between mb-16">
    <div>
      <div class="page-title">Audit Trail</div>
      <div class="page-sub">${APP.audit.length} événements enregistrés</div>
    </div>
    <div class="flex-center gap-8">
      <button class="btn btn-secondary btn-sm" onclick="openArchivesModal('audit')" title="Consulter les événements archivés">📦 Archives</button>
      <button class="btn btn-secondary btn-sm" onclick="printAuditTrail()">🖨 Imprimer</button>
      <button class="btn btn-primary btn-sm" onclick="downloadAuditPDF()">📄 Télécharger PDF</button>
    </div>
  </div>
  <div class="filters" style="flex-wrap:wrap;gap:8px">
    <select id="audit-type-filter" onchange="filterAudit()" style="width:auto">
      <option value="all">Tous les types</option>
      ${types.map(t=>`<option value="${t}">${_auditTypeLabel(t)}</option>`).join('')}
    </select>
    <select id="audit-entity-filter" onchange="filterAudit()" style="width:auto">
      <option value="all">Toutes entités</option>
      ${entities.map(e=>`<option value="${e}">${e}</option>`).join('')}
    </select>
    <input type="date" id="audit-date-from" onchange="filterAudit()" style="width:auto" title="Depuis">
    <input type="date" id="audit-date-to"   onchange="filterAudit()" style="width:auto" title="Jusqu'au">
    <div class="search-bar" style="flex:1;min-width:200px">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="audit-search" placeholder="Rechercher dans l'audit..." oninput="filterAudit()">
    </div>
  </div>
  <div id="audit-list" style="margin-top:12px"></div>`;
  filterAudit();
}

function _auditTypeLabel(type) {
  const labels = {
    create:'➕ Création', edit:'✏️ Modification', delete:'🗑️ Suppression',
    CREATE:'➕ Création', UPDATE:'✏️ Modification', DELETE:'🗑️ Suppression',
    entree:'↑ Entrée stock', sortie:'↓ Sortie stock',
    STOCK_OUT:'↓ Sortie stock', STOCK_ENTREE:'↑ Entrée stock', STOCK_SORTIE:'↓ Sortie stock',
    PRINT:'🖨️ Impression', EXPORT:'📥 Export', IMPORT:'📤 Import', RESET:'♻️ Reset',
  };
  return labels[type] || type;
}

function _auditEntityName(entity, entityId) {
  try {
    switch((entity||'').toLowerCase()) {
      case 'article':    return APP.articles.find(a=>a.id===entityId)?.name || entityId;
      case 'bon':        return APP.bons.find(b=>b.id===entityId)?.numero || entityId;
      case 'commercial': return (()=>{const c=APP.commerciaux.find(c=>c.id===entityId);return c?c.prenom+' '+c.nom:entityId;})();
      case 'fournisseur':return APP.fournisseurs.find(f=>f.id===entityId)?.nom || entityId;
      case 'zone':       return (APP.zones||[]).find(z=>z.id===entityId)?.label || entityId;
      case 'pdv':        return (APP.pdv||[]).find(p=>p.id===entityId)?.nom || entityId;
      default:           return entityId || '—';
    }
  } catch(e) { return entityId || '—'; }
}

function _auditDescription(e) {
  var user = (e.userName && e.userName !== 'unknown') ? e.userName : (e.userEmail || 'Quelqu\u2019un');
  var role = (e.userRole && e.userRole !== 'unknown') ? (' (' + e.userRole + ')') : '';
  var entity = _auditEntityName(e.entity, e.entityId);
  var typeMap = {
    'create': 'a cr\u00e9\u00e9', 'CREATE': 'a cr\u00e9\u00e9',
    'edit': 'a modifi\u00e9', 'UPDATE': 'a modifi\u00e9',
    'delete': 'a supprim\u00e9', 'DELETE': 'a supprim\u00e9',
    'STOCK_ENTREE': 'a enregistr\u00e9 une entr\u00e9e de stock pour',
    'STOCK_SORTIE': 'a enregistr\u00e9 une sortie de stock pour',
    'STOCK_OUT': 'a enregistr\u00e9 une sortie de stock pour',
    'STOCK_INIT': 'a initialis\u00e9 le stock de',
    'PRINT': 'a imprim\u00e9', 'DOWNLOAD': 'a t\u00e9l\u00e9charg\u00e9',
    'EXPORT': 'a export\u00e9', 'IMPORT': 'a import\u00e9',
    'RESET': 'a r\u00e9initialis\u00e9',
    'VALIDATE': 'a valid\u00e9', 'CANCEL': 'a annul\u00e9',
    'UNDO': 'a annul\u00e9',
    'DISPATCH': 'a valid\u00e9 un dispatch'
  };
  var entityLabels = {
    'article': 'l\u2019article', 'bon': 'le bon', 'commercial': 'le commercial',
    'fournisseur': 'le fournisseur', 'zone': 'la zone', 'pdv': 'le PDV',
    'commandeFourn': 'la commande fournisseur', 'company': 'l\u2019entreprise',
    'settings': 'les param\u00e8tres', 'dispatch': 'le dispatch',
    'all': 'les donn\u00e9es', 'operational': 'les donn\u00e9es op\u00e9rationnelles',
    'audit': 'le journal d\u2019audit', 'mouvement': 'le mouvement'
  };
  var action = typeMap[e.type] || e.type;
  var entLabel = entityLabels[(e.entity || '').toLowerCase()] || e.entity || '';
  var desc = '<b>' + user + '</b>' + role + ' ' + action + ' ' + entLabel;
  if (entity && entity !== '\u2014' && entity !== e.entityId) {
    desc += ' <b>' + entity + '</b>';
  }
  return desc;
}

function _auditDiff(oldStr, newStr) {
  try {
    const o = oldStr ? JSON.parse(oldStr) : null;
    const n = newStr ? JSON.parse(newStr) : null;
    if(!o && !n) return '';
    if(!o) return `<span style="color:var(--success)">Créé</span>`;
    if(!n) return `<span style="color:var(--danger)">Supprimé</span>`;
    // Fields to hide in diff (internal/noisy)
    const SKIP = new Set(['_version','createdAt','id','updatedAt']);
    const changes = [];
    const allKeys = new Set([...Object.keys(o||{}), ...Object.keys(n||{})]);
    allKeys.forEach(k => {
      if(SKIP.has(k)) return;
      const ov = JSON.stringify(o[k]), nv = JSON.stringify(n[k]);
      if(ov !== nv) {
        const oval = String(o[k]??'—'), nval = String(n[k]??'—');
        const short = (s,max=30) => s.length>max ? s.slice(0,max)+'…' : s;
        changes.push(`<span style="font-size:11px"><strong>${k}</strong>: <span style="color:var(--text-2)">${short(oval)}</span> → <span style="color:var(--accent)">${short(nval)}</span></span>`);
      }
    });
    return changes.length ? changes.slice(0,5).join(' &nbsp;|&nbsp; ') + (changes.length>5?` <span style="color:var(--text-3)">+${changes.length-5} autres</span>`:'') : '<span style="color:var(--text-3)">Aucun changement détecté</span>';
  } catch(e) { return '<span style="color:var(--text-3)">—</span>'; }
}

function filterAudit() {
  const typeF   = document.getElementById('audit-type-filter')?.value   || 'all';
  const entityF = document.getElementById('audit-entity-filter')?.value || 'all';
  const from    = document.getElementById('audit-date-from')?.value;
  const to      = document.getElementById('audit-date-to')?.value;
  const needle  = _normSearch(document.getElementById('audit-search')?.value || '');

  const TYPE_COLOR = {
    create:'var(--success)', CREATE:'var(--success)',
    edit:'var(--accent)',    UPDATE:'var(--accent)',
    delete:'var(--danger)', DELETE:'var(--danger)',
    entree:'var(--success)',STOCK_ENTREE:'var(--success)',
    sortie:'var(--accent3)',STOCK_OUT:'var(--accent3)',STOCK_SORTIE:'var(--accent3)',
    PRINT:'var(--text-2)', EXPORT:'var(--warning)', IMPORT:'var(--accent2)',
    RESET:'var(--danger)',
  };

  const entries = APP.audit.filter(e => {
    if(typeF   !== 'all' && e.type   !== typeF)   return false;
    if(entityF !== 'all' && e.entity !== entityF) return false;
    if(from && e.ts < new Date(from).getTime()) return false;
    if(to   && e.ts > new Date(to).getTime()+86399999) return false;
    if(needle) {
      const name = _auditEntityName(e.entity, e.entityId);
      const hay = _normSearch([e.type, e.entity, e.entityId, name, e.userName, e.userLogin, e.oldVal, e.newVal].filter(Boolean).join(' '));
      if(!hay.includes(needle)) return false;
    }
    return true;
  }).sort((a,b) => b.ts-a.ts).slice(0, 300);

  const list = document.getElementById('audit-list'); if(!list) return;
  if(!entries.length) { list.innerHTML='<div class="empty-state"><p>Aucune entrée d\'audit correspondante</p></div>'; return; }

  list.innerHTML = entries.map(e => {
    const color   = TYPE_COLOR[e.type] || 'var(--text-3)';
    const label   = _auditTypeLabel(e.type);
    const name    = _auditEntityName(e.entity, e.entityId);
    const diff    = _auditDiff(e.oldVal, e.newVal);
    const desc = _auditDescription(e);
    const entityIcon = {article:'📦',bon:'📋',commercial:'👤',fournisseur:'🚛',zone:'🗺️',pdv:'🏪'}[(e.entity||'').toLowerCase()] || '📝';
    return `
    <div class="audit-row" style="border-left:3px solid ${color}22;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:1">
          <span class="badge" style="background:${color}20;color:${color};white-space:nowrap">${label}</span>
          <span style="font-size:12px">${desc}</span>
        </div>
        <div style="font-size:10px;color:var(--text-2);white-space:nowrap">${fmtDateTime(e.ts)}</div>
      </div>
      ${diff ? `<div style="margin-top:6px;padding:4px 8px;background:var(--bg-2);border-radius:4px;display:flex;flex-wrap:wrap;gap:4px">${diff}</div>` : ''}
    </div>`;
  }).join('');
}

function _buildAuditPrintHTML() {
  const logo = _safeCompanyLogo();
  const name = APP.settings.companyName || 'GMA';
  const entries = APP.audit.slice().sort((a,b)=>b.ts-a.ts).slice(0,500);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Audit Trail — ${name}</title>
  <style>
    body{font-family:Arial,sans-serif;font-size:11px;color:#222;margin:20px}
    h1{font-size:18px;margin:0 0 4px} .sub{font-size:12px;color:#666;margin-bottom:16px}
    table{width:100%;border-collapse:collapse;font-size:10px}
    th{background:#f0f0f0;padding:6px 8px;text-align:left;border:1px solid #ddd;font-weight:700}
    td{padding:5px 8px;border:1px solid #eee;vertical-align:top}
    tr:nth-child(even){background:#fafafa}
    .header{display:flex;align-items:center;gap:12px;margin-bottom:16px}
    .logo{width:60px;height:60px;object-fit:contain}
    .badge{display:inline-block;padding:1px 6px;border-radius:4px;font-size:9px;font-weight:700}
    .b-create{background:#d4edda;color:#155724} .b-edit{background:#fff3cd;color:#856404}
    .b-delete{background:#f8d7da;color:#721c24} .b-other{background:#e2e3e5;color:#383d41}
    @media print{body{margin:0;font-size:10px} .no-print{display:none!important}}
  </style></head><body>
  <div class="header">
    ${logo?'<img src="'+logo+'" class="logo">':''}
    <div><h1>Audit Trail</h1><div class="sub">${name} — ${entries.length} événements — Généré le ${fmtDateTime(Date.now())}</div></div>
  </div>
  <table>
    <thead><tr><th>Date/Heure</th><th>Type</th><th>Entité</th><th>Nom</th><th>Détails</th></tr></thead>
    <tbody>${entries.map(e=>{
      const typeClass = (e.type||'').toLowerCase().includes('create')?'b-create':(e.type||'').toLowerCase().includes('delete')?'b-delete':(e.type||'').toLowerCase().includes('edit')||(e.type||'').toLowerCase().includes('update')?'b-edit':'b-other';
      return `<tr>
        <td style="white-space:nowrap">${fmtDateTime(e.ts)}</td>
        <td><span class="badge ${typeClass}">${_auditTypeLabel(e.type)}</span></td>
        <td>${e.entity||'—'}</td>
        <td>${_auditEntityName(e.entity,e.entityId)}</td>
        <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis">${_auditDiff(e.oldVal,e.newVal)}</td>
      </tr>`;
    }).join('')}</tbody>
  </table>
  </body></html>`;
}

function printAuditTrail() {
  auditLog('PRINT','audit',null,null,{action:'print',count:APP.audit.length,ts:Date.now()});
  saveDB();
  const html = _buildAuditPrintHTML();
  const w = window.open('','_blank','width=900,height=700');
  w.document.write(html);
  w.document.close();
  w.onload = () => { w.focus(); w.print(); };
  notify('Impression audit lancée','success');
}

function downloadAuditPDF() {
  auditLog('DOWNLOAD','audit',null,null,{action:'pdf',count:APP.audit.length,ts:Date.now()});
  saveDB();
  const html = _buildAuditPrintHTML();
  const w = window.open('','_blank','width=900,height=700');
  w.document.write(html);
  w.document.close();
  w.onload = () => {
    w.focus(); w.print();
    notify('Utilisez "Enregistrer en PDF" dans la boîte de dialogue d\'impression','info');
  };
}

// ============================================================
// COMPANIES
// ============================================================
function renderCompanies() {
  document.getElementById('content').innerHTML=`
  <div class="flex-between mb-16">
    <div><div class="page-title">Entreprises</div><div class="page-sub">Gérez les entreprises émettrices de bons de sortie</div></div>
    <button class="btn btn-primary" onclick="openCompanyModal()">+ Ajouter entreprise</button>
  </div>
  <div class="grid-2" style="gap:16px">
    ${(APP.companies||[]).map(co=>renderCompanyCard(co)).join('')}
    ${(APP.companies||[]).length===0?'<div class="empty-state"><p>Aucune entreprise configurée. Ajoutez votre première entreprise pour pouvoir émettre des bons.</p></div>':''}
  </div>`;
}

function renderCompanyCard(co) {
  const bonsCount=APP.bons.filter(b=>b.companyId===co.id).length;
  return `<div class="card" style="border-left:4px solid ${co.colorPrimary||'var(--accent)'}">
    <div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px">
      <div style="width:72px;height:72px;border-radius:10px;background:white;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
        ${co.logo?`<img src="${co.logo}" style="width:100%;height:100%;object-fit:contain">`:`<span style="font-size:24px;font-weight:900;color:${co.colorPrimary||'#333'}">${co.shortName||co.name.charAt(0)}</span>`}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:16px;font-weight:700;margin-bottom:2px">${co.name}</div>
        ${co.shortName?`<div style="font-size:11px;color:var(--text-2);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">${co.shortName}</div>`:''}
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <span style="width:18px;height:18px;border-radius:4px;background:${co.colorPrimary||'#333'};display:inline-block;border:1px solid rgba(0,0,0,0.1)" title="Couleur principale"></span>
          <span style="width:18px;height:18px;border-radius:4px;background:${co.colorSecondary||'#666'};display:inline-block;border:1px solid rgba(0,0,0,0.1)" title="Couleur secondaire"></span>
          <span style="width:18px;height:18px;border-radius:4px;background:${co.colorAccent||'#999'};display:inline-block;border:1px solid rgba(0,0,0,0.1)" title="Couleur accent"></span>
        </div>
        <div style="font-size:11px;color:var(--text-2)">${co.address||'—'}</div>
      </div>
    </div>
    <div class="stat-row"><span class="stat-label">Tél</span><span class="stat-val">${co.tel||'—'}</span></div>
    <div class="stat-row"><span class="stat-label">Email</span><span class="stat-val" style="font-size:12px">${co.email||'—'}</span></div>
    <div class="stat-row"><span class="stat-label">Bons émis</span><span class="stat-val" style="color:var(--accent)">${bonsCount}</span></div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-secondary btn-sm" style="flex:1" onclick="openCompanyModal('${co.id}')">✏️ Modifier</button>
      <button class="btn btn-secondary btn-sm" onclick="previewCompanyBon('${co.id}')">👁 Aperçu</button>
      ${(APP.companies||[]).length>1?`<button class="btn btn-danger btn-sm" onclick="deleteCompany('${co.id}')">🗑</button>`:''}
    </div>
  </div>`;
}

function openCompanyModal(id) {
  const co=id?(APP.companies||[]).find(c=>c.id===id):null;
  openModal('modal-company',co?'Modifier entreprise':'Nouvelle entreprise',`
    <div class="form-row">
      <div class="form-group"><label>Nom complet *</label><input id="co-name" value="${co?.name||''}"></div>
      <div class="form-group"><label>Abréviation</label><input id="co-short" value="${co?.shortName||''}" maxlength="8"></div>
    </div>
    <div class="form-group"><label>Adresse</label><input id="co-addr" value="${co?.address||''}"></div>
    <div class="form-row">
      <div class="form-group"><label>Téléphone</label><input id="co-tel" value="${co?.tel||''}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="co-email" value="${co?.email||''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Fax</label><input id="co-fax" value="${co?.fax||''}"></div>
      <div class="form-group"><label>Site web</label><input id="co-website" value="${co?.website||''}"></div>
    </div>
    <div style="border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">🎨 Couleurs du bon de sortie</div>
      <div class="form-row-3">
        <div class="form-group"><label>Couleur principale</label><div style="display:flex;gap:8px;align-items:center"><input type="color" id="co-color1" value="${co?.colorPrimary||'#111111'}" style="width:48px;height:36px;padding:2px;border-radius:6px;cursor:pointer" oninput="syncColor('co-color1','co-color1-hex')"><input id="co-color1-hex" value="${co?.colorPrimary||'#111111'}" style="flex:1;font-family:monospace;font-size:12px" oninput="syncColor('co-color1','co-color1-hex',true)"></div></div>
        <div class="form-group"><label>Couleur secondaire</label><div style="display:flex;gap:8px;align-items:center"><input type="color" id="co-color2" value="${co?.colorSecondary||'#333333'}" style="width:48px;height:36px;padding:2px;border-radius:6px;cursor:pointer" oninput="syncColor('co-color2','co-color2-hex')"><input id="co-color2-hex" value="${co?.colorSecondary||'#333333'}" style="flex:1;font-family:monospace;font-size:12px" oninput="syncColor('co-color2','co-color2-hex',true)"></div></div>
        <div class="form-group"><label>Couleur accent</label><div style="display:flex;gap:8px;align-items:center"><input type="color" id="co-color3" value="${co?.colorAccent||'#999999'}" style="width:48px;height:36px;padding:2px;border-radius:6px;cursor:pointer" oninput="syncColor('co-color3','co-color3-hex')"><input id="co-color3-hex" value="${co?.colorAccent||'#999999'}" style="flex:1;font-family:monospace;font-size:12px" oninput="syncColor('co-color3','co-color3-hex',true)"></div></div>
      </div>
      <div id="color-preview" style="height:36px;border-radius:8px;margin-top:8px;background:linear-gradient(90deg,${co?.colorPrimary||'#111'},${co?.colorSecondary||'#333'},${co?.colorAccent||'#999'})"></div>
    </div>
    <div class="form-group">
      <label>Logo</label>
      <div style="display:flex;gap:12px;align-items:center">
        <div class="field-img" onclick="document.getElementById('co-logo-file').click()" id="co-logo-preview" style="width:80px;height:80px;border-radius:10px;background:white">
          ${co?.logo?`<img src="${co.logo}">`:'<span style="font-size:28px">🏢</span>'}
        </div>
        <input type="file" id="co-logo-file" accept="image/*" style="display:none" onchange="loadImgPreview('co-logo-file','co-logo-preview','co-logo-data');updateColorPreview()">
        <input type="hidden" id="co-logo-data" value="">
        <div style="font-size:12px;color:var(--text-2)">PNG transparent recommandé<br>Le logo apparaîtra sur les bons</div>
      </div>
    </div>`,
  ()=>saveCompany(id),'modal-lg');
  setTimeout(()=>{
    const ld=document.getElementById('co-logo-data');
    if(ld&&co?.logo) ld.value=co.logo;
    ['1','2','3'].forEach(n=>{
      const picker=document.getElementById('co-color'+n);
      if(picker) picker.addEventListener('input',()=>{const hex=document.getElementById('co-color'+n+'-hex');if(hex)hex.value=picker.value;updateColorPreview();});
    });
    updateColorPreview();
  },50);
}

function syncColor(pickerId, hexId, fromHex) {
  const src=document.getElementById(fromHex?hexId:pickerId);
  const dst=document.getElementById(fromHex?pickerId:hexId);
  if(!src||!dst) return;
  if(fromHex){if(/^#[0-9A-Fa-f]{6}$/.test(src.value)) dst.value=src.value;}
  else dst.value=src.value;
  updateColorPreview();
}

function updateColorPreview() {
  const c1=document.getElementById('co-color1')?.value||'#111';
  const c2=document.getElementById('co-color2')?.value||'#333';
  const c3=document.getElementById('co-color3')?.value||'#999';
  const prev=document.getElementById('color-preview');
  if(prev) prev.style.background=`linear-gradient(90deg,${c1},${c2},${c3})`;
}

function saveCompany(existingId) {
  const name=document.getElementById('co-name').value.trim();
  if(!name){notify('Nom obligatoire','error');return;}
  const logo=document.getElementById('co-logo-data').value;
  const data={name,shortName:document.getElementById('co-short').value.trim(),address:document.getElementById('co-addr').value,tel:document.getElementById('co-tel').value,fax:document.getElementById('co-fax').value,email:document.getElementById('co-email').value,website:document.getElementById('co-website').value,colorPrimary:document.getElementById('co-color1').value,colorSecondary:document.getElementById('co-color2').value,colorAccent:document.getElementById('co-color3').value,colorLight:hexToLight(document.getElementById('co-color1').value)};
  if(logo) data.logo=logo;
  if(existingId){
    const co=(APP.companies||[]).find(c=>c.id===existingId); if(!logo&&co.logo) data.logo=co.logo;
    Object.assign(co,data); auditLog('UPDATE','company',co.id,null,{name:co.name}); notify('Entreprise mise à jour ✓','success');
  } else {
    const nc={id:generateId(),...data,logo:logo||'',createdAt:Date.now()};
    (APP.companies||[]).push(nc); auditLog('CREATE','company',nc.id,null,{name:nc.name}); notify('Entreprise créée ✓','success');
  }
  saveDB();closeModal();renderCompanies();updateCompanyPanel();
}

function deleteCompany(id) {
  if((APP.companies||[]).length<=1){notify('Impossible de supprimer la dernière entreprise','error');return;}
  if(!confirm('Supprimer cette entreprise ?')) return;
  APP.companies=(APP.companies||[]).filter(c=>c.id!==id); saveDB(); renderCompanies();
  notify('Entreprise supprimée','warning');
}

function previewCompanyBon(coId) {
  const co=null;
  const dummyBon={id:'preview',numero:'BS-'+new Date().getFullYear()+'-XXXX',companyId:coId,recipiendaire:'Prénom Nom',commercialId:null,objet:'Aperçu bon de sortie',date:new Date().toISOString().split('T')[0],lignes:[{code:'ART-001',name:'Article exemple',qty:50,obs:''},{code:'ART-002',name:'Deuxième article',qty:20,obs:'Grande taille'}],sigDemandeur:'',sigMKT:'',createdAt:Date.now()};
  openModal('modal-co-preview','Aperçu bon — '+co.name,`<div style="max-height:75vh;overflow:auto">${generateBonHTML(dummyBon)}</div>`,null,'modal-xl');
}

// ============================================================
// ÉDITEUR DE BON (temps réel)
// ============================================================
let bonEditorState={
  name:'GMA \u2014 Les Grands Moulins d\'Abidjan',
  shortName:'GMA',
  address:'Zone Portuaire, Quai no. 1. Treichville',
  tel:'+225 27 21 75 11 00',
  fax:'',
  email:'marketing@gma.ci',
  colorPrimary:'#E8621A',
  colorSecondary:'#5C2E0A',
  colorAccent:'#FFFFFF',
  bonTitle:'BON DE SORTIE DE GADGETS',
  logo:'',
  minRows:8
};

function renderBonEditor() {
  // Synchroniser avec APP.settings à l'ouverture
  if(APP && APP.settings) {
    if(APP.settings.companyAddress) bonEditorState.address = APP.settings.companyAddress;
    if(APP.settings.companyTel)     bonEditorState.tel     = APP.settings.companyTel;
    bonEditorState.fax   = APP.settings.companyFax   || '';
    bonEditorState.email = APP.settings.companyEmail  || bonEditorState.email;
    bonEditorState.logo = bonEditorState.logo || _safeCompanyLogo();
    if (APP.settings.bonMinRows!=null) bonEditorState.minRows = parseInt(APP.settings.bonMinRows,10);
    if (APP.settings.companyBonTitle) bonEditorState.bonTitle = APP.settings.companyBonTitle;
    if (APP.settings.bonColorPrimary) bonEditorState.colorPrimary = APP.settings.bonColorPrimary;
    if (APP.settings.bonColorSecondary) bonEditorState.colorSecondary = APP.settings.bonColorSecondary;
    if (APP.settings.bonColorAccent) bonEditorState.colorAccent = APP.settings.bonColorAccent;
  }
  const s=bonEditorState;
  document.getElementById('content').innerHTML=`
  <div style="display:grid;grid-template-columns:320px 1fr;gap:0;height:calc(100vh - 56px);margin:-24px">
    <div style="background:var(--bg-1);border-right:1px solid var(--border);overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px">
      <div style="font-size:15px;font-weight:700;color:var(--text-0);margin-bottom:4px">🎨 Éditeur de Bon</div>
      <div style="font-size:11px;color:var(--text-2)">Modifiez en temps réel — les changements s'appliquent immédiatement à l'aperçu</div>
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-2);margin-bottom:10px">🏢 Informations GMA</div>
        <div class="form-group"><label>Titre du bon</label><input id="be-title" value="${s.bonTitle}" oninput="beLiveUpdate()"></div>
        <div class="form-group"><label>Adresse</label><input id="be-addr" value="${s.address}" oninput="beLiveUpdate()"></div>
        <div class="form-group"><label>Téléphone</label><input id="be-tel" value="${s.tel}" oninput="beLiveUpdate()"></div>
        <div class="form-group"><label>Fax</label><input id="be-fax" value="${s.fax||''}" oninput="beLiveUpdate()"></div>
        <div class="form-group"><label>Email</label><input id="be-email" value="${s.email||''}" oninput="beLiveUpdate()"></div>
        <div class="form-group"><label>Lignes vides supplémentaires</label><input type="number" id="be-rows" value="${s.minRows||8}" min="0" max="30" oninput="beLiveUpdate()"></div>
      </div>
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-2);margin-bottom:10px">🖼 Logo GMA</div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="field-img" onclick="document.getElementById('be-logo-file').click()" id="be-logo-preview" style="width:90px;height:90px;border-radius:8px;background:white;flex-shrink:0;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer">
            ${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:contain">`:'<span style="font-size:32px">🏢</span>'}
          </div>
          <input type="file" id="be-logo-file" accept="image/*" style="display:none" onchange="beLoadLogo(this)">
          <div style="display:flex;flex-direction:column;gap:6px">
            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('be-logo-file').click()">📂 Choisir logo</button>
            ${s.logo?`<button class="btn btn-sm btn-danger" style="margin-top:4px" onclick="bonEditorState.logo='';beLiveUpdate();renderBonEditor()">✕ Supprimer</button>`:''}
            <div style="font-size:10px;color:var(--text-2)">Le logo remplace<br>le nom sur le bon</div>
          </div>
        </div>
      </div>
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-2);margin-bottom:10px">🎨 Couleurs</div>
        <div class="form-group"><label>Couleur du N° de bon</label><div style="display:flex;gap:8px"><input type="color" id="be-color1" value="${s.colorPrimary}" style="width:44px;height:34px;padding:2px;border-radius:6px;cursor:pointer" oninput="beSyncColor('be-color1','be-hex1')"><input id="be-hex1" value="${s.colorPrimary}" style="flex:1;font-family:monospace;font-size:12px" oninput="beSyncColor('be-hex1','be-color1',true)"></div></div>
        <div class="form-group"><label>Couleur secondaire</label><div style="display:flex;gap:8px"><input type="color" id="be-color2" value="${s.colorSecondary}" style="width:44px;height:34px;padding:2px;border-radius:6px;cursor:pointer" oninput="beSyncColor('be-color2','be-hex2')"><input id="be-hex2" value="${s.colorSecondary}" style="flex:1;font-family:monospace;font-size:12px" oninput="beSyncColor('be-hex2','be-color2',true)"></div></div>
        <div class="form-group"><label>Couleur accent</label><div style="display:flex;gap:8px"><input type="color" id="be-color3" value="${s.colorAccent}" style="width:44px;height:34px;padding:2px;border-radius:6px;cursor:pointer" oninput="beSyncColor('be-color3','be-hex3')"><input id="be-hex3" value="${s.colorAccent}" style="flex:1;font-family:monospace;font-size:12px" oninput="beSyncColor('be-hex3','be-color3',true)"></div></div>
        <div style="font-size:10px;font-weight:700;color:var(--text-2);margin-bottom:6px;text-transform:uppercase">Palettes rapides</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[{label:'Sombre',c1:'#111111',c2:'#333333',c3:'#999999'},{label:'Bleu',c1:'#1A3A8B',c2:'#2563EB',c3:'#F59E0B'},{label:'Rouge',c1:'#8B1A1A',c2:'#C0392B',c3:'#D4A017'},{label:'Vert',c1:'#1A5C2A',c2:'#16A34A',c3:'#CA8A04'},{label:'Marine',c1:'#1E3A5F',c2:'#2563EB',c3:'#E67E22'},{label:'Violet',c1:'#4C1D95',c2:'#7C3AED',c3:'#F59E0B'}].map(p=>`<button class="btn btn-sm btn-secondary" onclick="beApplyPalette('${p.c1}','${p.c2}','${p.c3}')" style="border-left:4px solid ${p.c1}">${p.label}</button>`).join('')}
        </div>
      </div>
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-2);margin-bottom:10px">💾 Sauvegarder</div>
        <button class="btn btn-primary" style="width:100%" onclick="beSaveToCompany()">✅ Appliquer à l'entreprise principale</button>
        <button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="bePrintPreview()">🖨 Imprimer aperçu</button>
      </div>
    </div>
    <div style="overflow-y:auto;background:#e0e0e0;padding:24px" id="be-preview-zone">
      <div id="be-preview">${generateBonEditorPreview(s)}</div>
    </div>
  </div>`;
}

function generateBonEditorPreview(s) {
  const dummy={id:'preview',numero:'BS-'+new Date().getFullYear()+'-0001',companyId:null,recipiendaire:'Prénom NOM',commercialId:null,objet:'Aperçu en temps réel',date:new Date().toISOString().split('T')[0],lignes:[{code:'ART-001',name:'Premier gadget',qty:50,obs:''},{code:'ART-002',name:'Deuxième gadget',qty:20,obs:'Grande taille'},{code:'ART-003',name:'Troisième gadget',qty:10,obs:'Taille unique'}],sigDemandeur:'',sigMKT:'',createdAt:Date.now()};
  return generateBonHTML(dummy,s);
}

function beLiveUpdate() {
  const s=bonEditorState;
  s.bonTitle=document.getElementById('be-title')?.value||s.bonTitle;
  s.address=document.getElementById('be-addr')?.value||s.address;
  s.tel=document.getElementById('be-tel')?.value||s.tel;
  s.fax=document.getElementById('be-fax')?.value||'';
  s.email=document.getElementById('be-email')?.value||'';
  s.colorPrimary=document.getElementById('be-color1')?.value||s.colorPrimary;
  s.colorSecondary=document.getElementById('be-color2')?.value||s.colorSecondary;
  s.colorAccent=document.getElementById('be-color3')?.value||s.colorAccent;
  var _brv=document.getElementById('be-rows')?.value;
  s.minRows=(_brv===''||_brv==null)?8:(parseInt(_brv,10)||0);
  const prev=document.getElementById('be-preview');
  if(prev) prev.innerHTML=generateBonEditorPreview(s);
}

function beSyncColor(srcId,dstId,fromHex) {
  const src=document.getElementById(srcId), dst=document.getElementById(dstId);
  if(!src||!dst) return;
  if(fromHex){if(/^#[0-9A-Fa-f]{6}$/.test(src.value)) dst.value=src.value;}
  else dst.value=src.value;
  beLiveUpdate();
}

function beApplyPalette(c1,c2,c3) {
  ['be-color1','be-hex1'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=c1;});
  ['be-color2','be-hex2'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=c2;});
  ['be-color3','be-hex3'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=c3;});
  bonEditorState.colorPrimary=c1;bonEditorState.colorSecondary=c2;bonEditorState.colorAccent=c3;
  beLiveUpdate();
}

function beLoadLogo(input) {
  const file=input.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    bonEditorState.logo=e.target.result;
    const prev=document.getElementById('be-logo-preview');
    if(prev) prev.innerHTML=`<img src="${e.target.result}" style="width:100%;height:100%;object-fit:contain">`;
    beLiveUpdate();
  };
  reader.readAsDataURL(file);
}

function beSaveToCompany() {
  const s=bonEditorState; beLiveUpdate();
  APP.settings.companyAddress=s.address;
  APP.settings.companyTel=s.tel;
  APP.settings.companyFax=s.fax||'';
  APP.settings.companyEmail=s.email||'';
  APP.settings.companyBonTitle=s.bonTitle||'BON DE SORTIE DE GADGETS';
  APP.settings.bonMinRows=(s.minRows===0||s.minRows===''||s.minRows==null)?(s.minRows===0?0:8):(parseInt(s.minRows,10)||8);
  APP.settings.bonColorPrimary=s.colorPrimary||'#111111';
  APP.settings.bonColorSecondary=s.colorSecondary||'#333333';
  APP.settings.bonColorAccent=s.colorAccent||'#FFFFFF';
  if(s.logo) APP.settings.companyLogo=s.logo;
  saveDB(); if (typeof updateCompanyPanel==='function') updateCompanyPanel();
  notify('Paramètres GMA sauvegardés ✓','success');
  auditLog('UPDATE','company','settings',null,{from:'boneditor',minRows:APP.settings.bonMinRows});
}

function bePrintPreview() {
  beLiveUpdate(); const s=bonEditorState;
  const dummy={id:'preview',numero:'BS-'+new Date().getFullYear()+'-XXXX',companyId:null,recipiendaire:'Prénom NOM',commercialId:null,objet:'Aperçu impression',date:new Date().toISOString().split('T')[0],lignes:[{code:'ART-001',name:'Premier article',qty:50,obs:''},{code:'ART-002',name:'Deuxième article',qty:20,obs:''},{code:'ART-003',name:'Troisième article',qty:10,obs:'Taille unique'}],sigDemandeur:'',sigMKT:'',createdAt:Date.now()};
  const win=window.open('','_blank','width=900,height=750');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Aperçu bon</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#f0f0f0;padding:20px;font-family:Arial,sans-serif}@media print{body{background:white;padding:0}@page{margin:8mm;size:A4}}</style></head><body>${generateBonHTML(dummy,s)}<script>window.onload=()=>{setTimeout(()=>window.print(),300)}<\/script></body></html>`);
  win.document.close();
}

// ============================================================
// ZONES
// ============================================================
function renderZonesList() {
  const zones = APP.zones || [];
  if(!zones.length) return '<div style="font-size:12px;color:var(--text-2);padding:8px">Aucune zone — <a href="#" onclick="showPage(\'territoire\')">Créer dans Zones & Secteurs</a></div>';
  return zones.map(z=>{
    const coms = APP.commerciaux.filter(c=>c.dispatchZoneId===z.id);
    const sects = (APP.secteurs||[]).filter(s=>s.zoneId===z.id);
    return `<div class="stat-row"><div>
      <div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;border-radius:50%;background:${z.color||'#888'}"></div><div style="font-size:13px;font-weight:600">${z.label||z.name||'Zone'}</div></div>
      <div style="font-size:11px;color:var(--text-2)">${coms.length} commercial${coms.length!==1?'s':''} · ${sects.length} secteur${sects.length!==1?'s':''}</div>
    </div><div style="display:flex;gap:4px">
      <button class="btn btn-sm btn-secondary" onclick="editZone('${z.id}')">✏️</button>
      <button class="btn btn-sm btn-danger" onclick="deleteZone('${z.id}')">🗑</button>
    </div></div>`;
  }).join('');
}

function editZone(id){openZoneModal(id);}

// deleteZone defined in territoire section above

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
  const s=APP.settings;
  const _cu = typeof _currentUser==='function' ? _currentUser() : null;
  const _isAdmin = !!(_cu && _cu.role === 'admin');
  document.getElementById('content').innerHTML=`
  <div class="page-title mb-16">${t('settings')}</div>
  <div class="grid-2" style="gap:16px">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('company_settings')}</span></div>
      <div class="form-group"><label>Nom entreprise</label><input id="set-company" value="${s.companyName||'GMA - Les Grands Moulins d\'Abidjan'}"></div>
      <div class="form-row">
        <div class="form-group"><label>Téléphone</label><input id="set-tel" value="${s.companyTel||'+225 27 21 75 11 00'}"></div>
        <div class="form-group"><label>Fax</label><input id="set-fax" value="${s.companyFax||''}"></div>
      </div>
      <div class="form-group"><label>Email</label><input id="set-email" value="${s.companyEmail||'marketing@gma.ci'}"></div>
      <div class="form-group"><label>Adresse</label><input id="set-address" value="${s.companyAddress||'Zone Portuaire, Quai no. 1. Treichville'}"></div>
      <div class="form-group">
        <label>Logo entreprise</label>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <div id="set-logo-preview" ${_isAdmin ? `onclick="document.getElementById('set-logo-file').click()"` : ''}
            style="width:100px;height:100px;${_isAdmin ? 'cursor:pointer;' : ''}border-radius:10px;overflow:hidden;
                   border:2px ${_isAdmin ? 'dashed' : 'solid'} var(--border);display:flex;align-items:center;justify-content:center;
                   background:var(--bg-2);flex-shrink:0" ${_isAdmin ? `title="Cliquer pour changer le logo"` : ''}>
            ${(s.companyLogo && s.companyLogo.indexOf('__img:')!==0 && s.companyLogo.length>100)
              ? `<img src="${s.companyLogo}" style="width:100%;height:100%;object-fit:contain">`
              : `<span style="font-size:32px">🏢</span>`}
          </div>
          <input type="file" id="set-logo-file" accept="image/*" style="display:none"
            onchange="loadImgPreview('set-logo-file','set-logo-preview','set-logo-data')">
          <input type="hidden" id="set-logo-data" value="">
          <div style="display:flex;flex-direction:column;gap:8px">
            ${_isAdmin ? `
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('set-logo-file').click()">
              📂 Changer le logo
            </button>
            <button class="btn btn-secondary btn-sm" onclick="resetDefaultLogo()">
              ↺ Revenir au logo GMA
            </button>
            <span style="font-size:11px;color:var(--text-2)">PNG transparent recommandé · max 500KB</span>
            ` : `
            <span style="font-size:11px;color:var(--warning);display:flex;align-items:center;gap:6px">🔒 Seul l'administrateur peut modifier le logo</span>
            `}
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="grid-column:1/-1">
          <label>Thème</label>
          <input type="hidden" id="set-theme" value="${APP.settings.theme||'dark'}">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:4px" id="theme-picker-grid">
            ${Object.entries(THEME_META).map(([id,m]) => `
              <div onclick="document.getElementById('set-theme').value='${id}';document.querySelectorAll('.theme-swatch').forEach(e=>e.classList.remove('theme-swatch-active'));this.classList.add('theme-swatch-active')"
                class="theme-swatch${(APP.settings.theme||'dark')===id?' theme-swatch-active':''}"
                style="cursor:pointer;border-radius:10px;padding:10px 6px;text-align:center;border:2px solid ${(APP.settings.theme||'dark')===id?m.c1:'var(--border)'};background:${m.bg};transition:all .2s;position:relative;overflow:hidden">
                <div style="display:flex;gap:2px;justify-content:center;margin-bottom:6px">
                  <div style="width:8px;height:20px;border-radius:3px;background:${m.c3}"></div>
                  <div style="width:8px;height:20px;border-radius:3px;background:${m.c1}${m.special?';box-shadow:0 0 6px '+m.c1:''}"></div>
                  <div style="width:8px;height:20px;border-radius:3px;background:${m.c2}"></div>
                </div>
                <div style="font-size:10px;font-weight:700;color:${id==='light'?'#111':'#eee'};letter-spacing:.03em">${m.name}</div>
                ${m.special?'<div style="position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;background:'+m.c1+';box-shadow:0 0 5px '+m.c1+'"></div>':''}
              </div>
            `).join('')}
          </div>

        </div>
        <div class="form-group"><label>Devise</label><select id="set-currency"><option value="XOF" ${s.currency==='XOF'?'selected':''}>XOF (CFA)</option><option value="EUR" ${s.currency==='EUR'?'selected':''}>EUR (€)</option><option value="USD" ${s.currency==='USD'?'selected':''}>USD ($)</option></select></div>
        <div class="form-group"><label>${t('language')}</label>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="btn ${_lang()==='fr'?'btn-primary':'btn-secondary'} btn-sm" onclick="setLang('fr')" style="flex:1;font-weight:700">🇫🇷 Français</button>
            <button class="btn ${_lang()==='en'?'btn-primary':'btn-secondary'} btn-sm" onclick="setLang('en')" style="flex:1;font-weight:700">🇬🇧 English</button>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="card-header"><span class="card-title">Personnalisation avancée</span></div>
        <div class="form-row">
          <div class="form-group">
            <label>Fond dynamique</label>
            <select id="set-dynbg">
              <option value="off"${(APP.settings._dynamicBg||'off')==='off'?' selected':''}>Désactivé</option>
              <option value="particules"${APP.settings._dynamicBg==='particules'?' selected':''}>Particules</option>
              <option value="ambiance"${APP.settings._dynamicBg==='ambiance'?' selected':''}>Ambiance</option>
            </select>
          </div>
          <div class="form-group">
            <label>Intensité</label>
            <select id="set-dynbg-int">
              <option value="subtil"${(APP.settings._dynamicBgIntensity||'subtil')==='subtil'?' selected':''}>Subtil</option>
              <option value="actif"${APP.settings._dynamicBgIntensity==='actif'?' selected':''}>Actif</option>
            </select>
          </div>
        </div>
        <div style="margin-top:12px">
          <label>Pages visibles dans la barre latérale</label>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px;margin-top:6px">
            ${PAGES.filter(function(p){return p.id!=='dashboard' && p.id!=='settings';}).map(function(p){
              var hidden = (APP.settings._hiddenPages||[]).indexOf(p.id) >= 0;
              var lbl = I18N[_lang()][p.id] || p.label;
              return '<label style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--bg-3);border-radius:var(--radius);cursor:pointer;font-size:12px;font-weight:500;color:var(--text-1);text-transform:none;letter-spacing:0">'
                + '<input type="checkbox" class="page-vis-cb" data-pid="'+p.id+'"'+(!hidden?' checked':'')+' style="width:16px;height:16px;flex-shrink:0"> '+lbl+'</label>';
            }).join('')}
          </div>
          <div style="font-size:10px;color:var(--text-3);margin-top:4px">Le Tableau de bord et les Paramètres restent toujours visibles.</div>
        </div>
      </div>
            <button class="btn btn-primary" onclick="saveSettings()">💾 Enregistrer</button>
    </div>
${_isAdmin ? `    <div class="card">
      <div class="card-header"><span class="card-title">${t('data')}</span></div>
      <div class="stat-row"><span class="stat-label">Gadgets</span><span class="stat-val">${APP.articles.length}</span></div>
      <div class="stat-row"><span class="stat-label">Bons émis</span><span class="stat-val">${APP.bons.length}</span></div>
      <div class="stat-row"><span class="stat-label">Mouvements</span><span class="stat-val">${APP.mouvements.length}</span></div>
      <div class="stat-row"><span class="stat-label">Commerciaux</span><span class="stat-val">${APP.commerciaux.length}</span></div>
      <div class="stat-row"><span class="stat-label">Fournisseurs</span><span class="stat-val">${APP.fournisseurs.length}</span></div>
      <div class="stat-row"><span class="stat-label">Entrées audit</span><span class="stat-val">${APP.audit.length}</span></div>
      <div class="stat-row"><span class="stat-label">Backups auto</span><span class="stat-val">${APP.backups.length}/5</span></div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
        <button class="btn btn-secondary" onclick="exportAllJSON()">⬇ Export global JSON</button>
        <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">⬆ Import JSON</button>
        <input type="file" id="import-file" accept=".json" style="display:none" onchange="importJSON(this)">
        <button class="btn btn-danger" onclick="resetAll()">⚠️ Réinitialiser les historiques</button>
        <p style="font-size:11px;color:var(--text-2);margin-top:6px">Efface uniquement : mouvements, audit, journal d'activité, historique de dispatch.<br>Conserve : stocks, bons, gadgets, commerciaux, fournisseurs, zones, PDV, backups, paramètres.</p>
        ${(function(){ var _cu=typeof _currentUser==='function'?_currentUser():null; return _cu&&_cu.role==='admin'?'<button class="btn btn-danger" style="margin-top:8px;background:#7f1d1d;border-color:#991b1b" onclick="purgeBackups()"><i class="fa-solid fa-fire"></i> Purger les sauvegardes</button>':''; })()}
      </div>
    </div>` : ''}
    <div class="card">
      <div class="card-header"><span class="card-title">💾 Stockage Persistant</span></div>
      <div style="font-size:12px;color:var(--text-2);margin-bottom:10px">Vos données sont sauvegardées dans le dossier <strong>PSm Saves (Do Not Delete)</strong> sur votre PC — aucune dépendance au navigateur.</div>
      <div id="file-status-settings" style="font-size:12px;margin-bottom:12px;padding:10px 12px;border-radius:var(--radius);background:var(--bg-2);border:1px solid var(--border)">${_dirHandle?`✅ Dossier : <strong>${_dirHandle.name||'PSm Saves (Do Not Delete)'}</strong> — psm_data.json`:`⚠️ <strong>Aucun dossier configuré</strong>`}</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="pickSaveDirectory()">📂 Changer le dossier de sauvegarde</button>
        <button class="btn btn-secondary btn-sm" onclick="pickSaveDirectory()">📍 Utiliser un dossier existant (clé USB, OneDrive...)</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">🏷️ Catégories de gadgets</span><button class="btn btn-sm btn-primary" onclick="openAddCategoryModal()">+ Nouvelle catégorie</button></div>
      <div id="cat-list-settings" style="padding:4px 0"></div>
    </div>
${_isAdmin ? `    <div class="card">
      <div class="card-header"><span class="card-title">⏱ Sauvegardes automatiques</span></div>
      <div class="form-group">
        <label>Fréquence</label>
        <select id="set-backup-interval" style="margin-bottom:8px">
          <option value="0" ${(s.backupInterval||180)==0?'selected':''}>Désactivée</option>
          <option value="60" ${(s.backupInterval||180)==60?'selected':''}>1 heure</option>
          <option value="180" ${(s.backupInterval||180)==180?'selected':''}>3 heures</option>
          <option value="360" ${(s.backupInterval||180)==360?'selected':''}>6 heures</option>
          <option value="720" ${(s.backupInterval||180)==720?'selected':''}>12 heures</option>
          <option value="1440" ${(s.backupInterval||180)==1440?'selected':''}>1 jour</option>
        </select>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="manualBackup()">💾 Sauvegarder maintenant</button> <button class="btn btn-secondary btn-sm" onclick="validateData()">🔎 Vérifier les données</button>
    </div>` : ''}
    <div class="card">
      <div class="card-header"><span class="card-title">📦 Backups locaux (${APP.backups.length}/5)</span></div>
      ${APP.backups.length?APP.backups.slice().reverse().map(b=>`<div class="stat-row"><span class="stat-label">${fmtDateTime(b.ts)} · ${Math.round(b.size/1024)}KB ${b.hash?'<span style="color:var(--success);font-size:10px" title="Hash: '+b.hash.slice(0,12)+'...">✓ intégrité</span>':''}</span>${_isAdmin?`<button class="btn btn-sm btn-secondary" onclick="restoreSpecificBackup('${b.id}')">Restaurer</button>`:''}</div>`).join(''):'<div class="empty-state"><p>Aucun backup encore</p></div>'}
    </div>
${_isAdmin ? `    <div class="card" style="margin-top:12px">
      <div class="card-header"><span class="card-title">☁️ Snapshots cloud (7 derniers jours)</span></div>
      <div id="cloud-snapshots-list"><div class="empty-state"><p>Chargement...</p></div></div>
    </div>` : ''}
${_isAdmin ? `    <div style="margin-top:10px;padding:8px 12px;background:var(--bg-2);border-radius:8px;display:flex;align-items:center;gap:8px">
      <span style="font-size:18px">🛡️</span>
      <span id="backup-indicator" style="font-size:12px;color:var(--text-2)">Aucun backup</span>
    </div>` : ''}
${_isAdmin ? `    <div class="card" style="margin-top:12px;border:1px solid rgba(245,166,35,0.3)">
      <div class="card-header"><span class="card-title">📦 Archivage des historiques</span></div>
      <div style="font-size:12px;color:var(--text-2);margin-bottom:10px;line-height:1.5">
        Les bons, mouvements et événements d'audit de plus de <b>${_archRetentionMonths()} mois</b> sont déplacés vers des archives permanentes (consultables depuis chaque module via le bouton 📦 Archives).
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Rétention chaude (mois)</label>
          <input type="number" id="set-arch-retention" min="1" max="120" value="${_archRetentionMonths()}" style="width:100px">
        </div>
        <div class="form-group" style="align-self:end">
          <button class="btn btn-secondary btn-sm" onclick="saveArchiveRetention()">💾 Enregistrer</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
        <button class="btn btn-secondary btn-sm" id="btn-arch-dryrun" onclick="runArchiveDryRun()">🔍 Simuler (dry-run)</button>
        <button class="btn btn-primary btn-sm" id="btn-arch-sweep" onclick="runArchiveSweep()">📦 Archiver maintenant</button>
      </div>
      <div id="arch-dryrun-output"></div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-3)">Dernier archivage : ${(APP.settings && APP.settings._lastArchiveRun) ? new Date(APP.settings._lastArchiveRun).toLocaleString('fr-FR') : 'jamais'}</div>
    </div>` : ''}
  </div>
  <div class="card" style="margin-top:16px;background:linear-gradient(135deg,rgba(61,127,255,0.06),rgba(0,229,170,0.04));border-color:rgba(61,127,255,0.2)">
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden"><img src="data:image/png;base64,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" alt="Logo" style="width:36px;height:36px;object-fit:contain;"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:var(--text-0);margin-bottom:4px">Perfect's Stock Manager <span style="font-size:11px;font-weight:500;color:var(--text-2);margin-left:6px">v${APP_VERSION}</span></div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-size:12px;color:var(--text-2)">© Fassibiri Ibrahim Konate</span>
          <span style="font-size:11px;color:var(--text-3)">•</span>
          <span style="font-size:11px;color:var(--text-3);font-family:var(--font-mono)">build ${APP_BUILD_DATE}</span>
          <span style="font-size:11px;color:var(--text-3)">—</span>
          <span style="font-size:12px;color:var(--danger);font-weight:600">Usage non autorisé interdit</span>
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:11px;color:var(--text-3);font-family:var(--font-mono)">Tous droits réservés</div>
        <div style="font-size:11px;color:var(--text-3);font-family:var(--font-mono)">${new Date().getFullYear()}</div>
      </div>
    </div>
  </div>`;
  setTimeout(()=>{ const ld=document.getElementById('set-logo-data'); if(ld) ld.value=APP.settings.companyLogo||''; const zl=document.getElementById('zones-list'); if(zl) zl.innerHTML=renderZonesList(); renderCatListSettings(); },10);
}


// ─── Category management ────────────────────────────────────────────────────
const GMA_BUILTIN_CATS = ['INSTITUTIONNELS', 'SUPER-BEIGNETS', 'EXCEPTIONNEL - DIVERS', 'SOGO BALO PRO'];

function getAllCategories() {
  const custom = APP.settings.categories || [];
  const hidden = APP.settings.hiddenCategories || [];
  const renames = APP.settings.categoryRenames || {};
  const builtins = GMA_BUILTIN_CATS
    .filter(c => !hidden.includes(c))
    .map(c => renames[c] || c);
  return [...new Set([...builtins, ...custom])];
}

function renderCatListSettings() {
  const el = document.getElementById('cat-list-settings');
  if(!el) return;
  const cats = getAllCategories();
  const usages = {};
  APP.articles.forEach(a => { usages[a.category] = (usages[a.category]||0)+1; });
  el.innerHTML = cats.map(c => {
    const isBuiltin = GMA_BUILTIN_CATS.includes(c);
    const count = usages[c] || 0;
    return `<div class="stat-row">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-weight:600;font-size:13px">${c}</span>
        <span style="font-size:11px;color:var(--text-3)">${count} gadget(s)</span>
        ${isBuiltin ? '<span style="font-size:10px;color:var(--accent);background:var(--bg-2);padding:1px 6px;border-radius:99px">système</span>' : ''}
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-secondary" onclick="deleteCategoryUI('${c}')">🗑️</button>
        <button class="btn btn-sm btn-secondary" onclick="renameCategoryUI('${c}')">✏️</button>
      </div>
    </div>`;
  }).join('');
}

function openAddCategoryModal() {
  openModal('Nouvelle catégorie', `
    <div class="form-group">
      <label>Nom de la catégorie *</label>
      <input id="new-cat-name" placeholder="ex: PROMOTIONNEL 2026" style="text-transform:uppercase">
    </div>
  `, [
    { label: 'Annuler', cls: 'btn-secondary', onclick: 'closeModal()' },
    { label: '+ Créer', cls: 'btn-primary', onclick: 'saveNewCategory()' }
  ]);
  document.getElementById('new-cat-name').addEventListener('input', function(){ this.value = this.value.toUpperCase(); });
}

function saveNewCategory() {
  const name = document.getElementById('new-cat-name')?.value?.trim().toUpperCase();
  if(!name) { notify('Saisissez un nom', 'warning'); return; }
  if(getAllCategories().includes(name)) { notify('Cette catégorie existe déjà', 'warning'); return; }
  if(!APP.settings.categories) APP.settings.categories = [];
  APP.settings.categories.push(name);
  saveDB();
  closeModal();
  notify('Catégorie ajoutée ✓', 'success');
  renderCatListSettings();
}

function deleteCategoryUI(name) {
  const count = APP.articles.filter(a => a.category === name).length;
  const msg = count > 0
    ? `Supprimer la catégorie "${name}" ? ${count} gadget(s) auront leur catégorie effacée.`
    : `Supprimer la catégorie "${name}" ?`;
  if(!confirm(msg)) return;
  const isBuiltin = GMA_BUILTIN_CATS.includes(name);
  if(isBuiltin) {
    if(!APP.settings.hiddenCategories) APP.settings.hiddenCategories = [];
    if(!APP.settings.hiddenCategories.includes(name)) APP.settings.hiddenCategories.push(name);
  } else {
    APP.settings.categories = (APP.settings.categories||[]).filter(c => c !== name);
  }
  if(count > 0) APP.articles.forEach(a => { if(a.category === name) a.category = ''; });
  saveDB();
  notify('Catégorie supprimée', 'success');
  renderCatListSettings();
}

function renameCategoryUI(oldName) {
  openModal('rename-cat', 'Renommer la catégorie', `
    <div class="form-group">
      <label>Nouveau nom</label>
      <input id="rename-cat-name" value="${oldName}" style="text-transform:uppercase">
    </div>
  `, ()=>saveRenameCategory(oldName));
  document.getElementById('rename-cat-name').addEventListener('input', function(){ this.value = this.value.toUpperCase(); });
}

function saveRenameCategory(oldName) {
  const newName = document.getElementById('rename-cat-name')?.value?.trim().toUpperCase();
  if(!newName || newName === oldName) { closeModal(); return; }
  if(getAllCategories().includes(newName)) { notify('Ce nom existe déjà', 'warning'); return; }
  const isBuiltin = GMA_BUILTIN_CATS.includes(oldName);
  if(isBuiltin) {
    // Stocker le remplacement du nom builtin
    if(!APP.settings.categoryRenames) APP.settings.categoryRenames = {};
    APP.settings.categoryRenames[oldName] = newName;
  } else {
    APP.settings.categories = (APP.settings.categories||[]).map(c => c === oldName ? newName : c);
  }
  // Mettre à jour tous les articles utilisant cette catégorie
  APP.articles.forEach(a => { if(a.category === oldName) a.category = newName; });
  saveDB();
  closeModal();
  notify('Catégorie renommée ✓', 'success');
  renderCatListSettings();
}


// ============================================================
// REPORTS: Per-commercial + Dispatch
// ============================================================
function printComReport() {
  const logo = _safeCompanyLogo();
  const name = APP.settings.companyName || 'Mon Entreprise';
  const addr = APP.settings.companyAddress || '';
  const tel  = APP.settings.companyTel || '';
  const _norm = function(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase(); };
  const comRows = APP.commerciaux.map(c => {
    const _fullA = _norm((c.prenom||'')+' '+(c.nom||''));
    const _fullB = _norm((c.nom||'')+' '+(c.prenom||''));
    const _matchBon = function(b){
      if (b.commercialId===c.id) return true;
      // Bon annuaire: ne jamais le rattacher a un commercial homonyme
      if (b._recipientType === 'annuaire') return false;
      if (!_fullA) return false;
      const _d = _norm(b.demandeur);
      const _r = _norm(b.recipiendaire);
      return (_d===_fullA||_d===_fullB||_r===_fullA||_r===_fullB);
    };
    const matchedBons = APP.bons.filter(_matchBon);
    const bonsCount = matchedBons.length;
    // Retraits reels = lignes des bons valides + mouvements sortie manuels (sans ref Bon) de ce commercial
    const artMap = {};
    matchedBons.filter(b => b.status==='valid\u00e9').forEach(b => {
      (b.lignes||[]).forEach(l => {
        const n = l.name || l.articleName || 'Article';
        const q = parseInt(l.qty)||0;
        artMap[n] = (artMap[n]||0) + q;
      });
    });
    APP.mouvements.filter(m => {
      if (m.type!=='sortie') return false;
      if (m.commercialId!==c.id) return false;
      return !/^(?:Modif |Suppression |Renvoi )?Bon\s+\S+/i.test(m.note||'');
    }).forEach(m => { artMap[m.articleName||'Article'] = (artMap[m.articleName||'Article']||0) + m.qty; });
    const totalQty = Object.values(artMap).reduce((s,q)=>s+q,0);
    const zone = (APP.zones||[]).find(z=>z.id===(c.dispatchZoneId||c.zoneId));
    const pdv = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.actif!==false).length;
    const artDetail = Object.entries(artMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([n,q])=>n+': '+q).join(', ');
    return '<tr><td style="font-weight:600">'+c.prenom+' '+c.nom+'</td><td>'+(zone?zone.label:'\u2014')+'</td><td style="text-align:center">'+pdv+'</td><td style="text-align:center">'+bonsCount+'</td><td style="text-align:center;font-weight:700;color:#cc4400">'+totalQty+'</td><td style="font-size:10px;color:#666">'+(artDetail||'\u2014')+'</td></tr>';
  }).join('');
  const win = window.open('','_blank','width=1000,height=750');
  win.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>R\u00e9capitulatif par commercial</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:24px 32px;color:#111;background:#fff;font-size:12px}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#1a3a8b;color:white;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase}td{padding:7px 10px;border-bottom:1px solid #eee;font-size:11px}tr:nth-child(even) td{background:#f9f9f9}.header{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:16px}@media print{@page{margin:10mm;size:A4 landscape}}</style></head><body><div class="header"><div>'+(logo?'<img src="'+logo+'" style="max-height:80px;max-width:180px;object-fit:contain;display:block;margin-bottom:6px">':'')+'<div style="font-size:11px;color:#444">'+(addr||'')+'</div>'+(tel?'<div style="font-size:11px">T\u00e9l: '+tel+'</div>':'')+'</div><div style="text-align:right"><div style="font-size:18px;font-weight:900;border:2px solid #111;padding:8px 16px;display:inline-block">R\u00c9CAPITULATIF PAR COMMERCIAL</div><div style="font-size:11px;color:#555;margin-top:4px">Imprim\u00e9 le '+new Date().toLocaleDateString('fr-FR')+'</div></div></div><table><thead><tr><th>Commercial</th><th>Zone</th><th style="text-align:center">PDV</th><th style="text-align:center">Bons</th><th style="text-align:center">Total sorti</th><th>Top gadgets</th></tr></thead><tbody>'+comRows+'</tbody></table><div style="margin-top:20px;font-size:10px;color:#888;border-top:1px solid #ccc;padding-top:8px">Document g\u00e9n\u00e9r\u00e9 automatiquement \u2014 Perfect\'s Stock Manager</div><script>window.onload=()=>{setTimeout(()=>window.print(),400)}<\/script></body></html>');
  win.document.close();
}

function printDispatchReport(histIndex) {
  var hist = APP.dispatch?.history || [];
  if(!hist.length) { notify('Aucun dispatch valid\u00e9','warning'); return; }
  var idx = typeof histIndex === 'number' ? histIndex : 0;
  var snap = hist[idx];
  if(!snap) { notify('Dispatch introuvable','error'); return; }
  var logo = _safeCompanyLogo();
  var name = APP.settings.companyName || 'Mon Entreprise';
  var addr = APP.settings.companyAddress || '';
  var tel  = APP.settings.companyTel || '';
  var dateStr = new Date(snap.ts).toLocaleDateString('fr-FR', {year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
  // Build rows from snap.alloc (new format) or snap.items (old format)
  var itemRows = '';
  if(snap.alloc && snap.articleName) {
    // New dispatch format: single article with alloc array
    snap.alloc.filter(function(a){return a.qty>0}).forEach(function(a){
      itemRows += '<tr><td style="font-weight:600">'+snap.articleName+'</td><td>'+(a.name||'')+'</td><td style="text-align:center;font-weight:700">'+a.qty+'</td></tr>';
    });
  } else if(snap.items) {
    // Old format
    (snap.items||[]).forEach(function(item){
      (item.zones||[]).forEach(function(z){
        (z.coms||[]).forEach(function(c){
          if(c.qty>0) itemRows += '<tr><td style="font-weight:600">'+item.name+'</td><td>'+c.name+'</td><td style="text-align:center;font-weight:700">'+c.qty+'</td></tr>';
        });
      });
    });
  }
  var totalQty = snap.totalQty || 0;
  var win = window.open('','_blank','width=1000,height=750');
  win.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Dispatch '+dateStr+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:24px 32px;color:#111;background:#fff;font-size:12px}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#1a3a8b;color:white;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase}td{padding:7px 10px;border-bottom:1px solid #eee;font-size:11px}tr:nth-child(even) td{background:#f9f9f9}.header{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:16px}.sig-row{display:flex;gap:40px;margin-top:30px}.sig-box{flex:1;text-align:center;padding-top:60px;border-top:1px solid #555;font-size:11px;font-weight:700}@media print{@page{margin:10mm;size:A4}}</style></head><body><div class="header"><div>'+(logo?'<img src="'+logo+'" style="max-height:80px;max-width:180px;object-fit:contain;display:block;margin-bottom:6px">':'')+'<div style="font-size:11px;color:#444">'+(addr||'')+'</div>'+(tel?'<div style="font-size:11px">T\u00e9l: '+tel+'</div>':'')+'</div><div style="text-align:right"><div style="font-size:18px;font-weight:900;border:2px solid #111;padding:8px 16px;display:inline-block">RAPPORT DE DISPATCH</div><div style="font-size:12px;color:#333;margin-top:6px;font-weight:600">'+snap.articleName+' \u2014 '+totalQty+' unit\u00e9(s)</div><div style="font-size:11px;color:#555;margin-top:4px">'+dateStr+'</div></div></div><table><thead><tr><th>Gadget</th><th>Destinataire</th><th style="text-align:center">Quantit\u00e9</th></tr></thead><tbody>'+itemRows+'<tr style="font-weight:bold;border-top:2px solid #333"><td colspan="2">TOTAL</td><td style="text-align:center">'+totalQty+'</td></tr></tbody></table><div class="sig-row"><div class="sig-box">Responsable Stock</div><div class="sig-box">Directeur Commercial</div><div class="sig-box">Direction G\u00e9n\u00e9rale</div></div><div style="margin-top:20px;font-size:10px;color:#888;border-top:1px solid #ccc;padding-top:8px">Document g\u00e9n\u00e9r\u00e9 automatiquement \u2014 Perfect\'s Stock Manager</div><script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>');
  win.document.close();
}

function resetDefaultLogo() {
  if(!confirm('Revenir au logo GMA par défaut ?')) return;
  APP.settings.companyLogo = GMA_DEFAULT_LOGO;
  saveDB();
  updateCompanyPanel();
  notify('Logo par défaut restauré ✓', 'success');
  renderSettings();
}


// Disable shared settings inputs for non-admin users
function _restrictSettingsForNonAdmin() {
  var _cu = typeof _currentUser === 'function' ? _currentUser() : null;
  if(_cu && _cu.role === 'admin') return; // admin sees everything
  // Disable shared settings inputs
  var sharedIds = ['set-company','set-tel','set-fax','set-email','set-address','set-logo-data','set-currency','set-backup-interval'];
  sharedIds.forEach(function(id) {
    var el = document.getElementById(id);
    if(el) { el.disabled = true; el.style.opacity = '0.6'; }
  });
  // (Logo controls are already conditionally omitted from the template for non-admin)
  // Add notice
  var companyCard = document.querySelector('.card-title');
  if(companyCard && companyCard.textContent.includes('Entreprise')) {
    var notice = document.createElement('div');
    notice.style.cssText = 'font-size:11px;color:var(--warning);padding:4px 8px;margin-bottom:8px;background:var(--warning)11;border-radius:var(--radius)';
    notice.textContent = '\ud83d\udd12 Seul l\u2019administrateur peut modifier ces param\u00e8tres';
    companyCard.parentElement.after(notice);
  }
}

function saveSettings() {
  var _cu = typeof _currentUser === 'function' ? _currentUser() : null;
  var _isAdmin = _cu && _cu.role === 'admin';

  // Shared settings (admin only)
  if(_isAdmin) {
  APP.settings.companyName=document.getElementById('set-company').value;
  APP.settings.companyTel=document.getElementById('set-tel')?.value||APP.settings.companyTel||'';
  const _faxEl=document.getElementById('set-fax'); APP.settings.companyFax=_faxEl?_faxEl.value:(APP.settings.companyFax||'');
  const _emailEl=document.getElementById('set-email'); APP.settings.companyEmail=_emailEl?_emailEl.value:(APP.settings.companyEmail||'');
  const _addrEl=document.getElementById('set-address'); APP.settings.companyAddress=_addrEl?_addrEl.value:(APP.settings.companyAddress||'');
  const logo=document.getElementById('set-logo-data').value; if(logo) { APP.settings.companyLogo=logo; _imagesDirty=true; }
  } // end admin-only shared settings

  // Personal settings (all users)
  APP.settings.theme=document.getElementById('set-theme').value;
  var _dbgEl = document.getElementById('set-dynbg');
  if(_dbgEl) APP.settings._dynamicBg = _dbgEl.value;
  var _dbgIntEl = document.getElementById('set-dynbg-int');
  if(_dbgIntEl) APP.settings._dynamicBgIntensity = _dbgIntEl.value;
  var _hiddenPgs = [];
  document.querySelectorAll('.page-vis-cb').forEach(function(cb) {
    if(!cb.checked) _hiddenPgs.push(cb.dataset.pid);
  });
  APP.settings._hiddenPages = _hiddenPgs;
  applyTheme(APP.settings.theme);
  renderSidebar();
  APP.settings.currency=document.getElementById('set-currency').value;
  const newInterval=parseInt(document.getElementById('set-backup-interval').value);
  const intervalChanged=newInterval!==APP.settings.backupInterval;
  APP.settings.backupInterval=newInterval;
  saveDB(); updateCompanyPanel();
  if(intervalChanged) startBackupScheduler();
  // Re-init dynamic background with new settings
  if(typeof initDynamicBg === 'function') initDynamicBg();
  notify('Paramètres enregistrés ✓','success');
  auditLog('UPDATE','settings',null,null,{...APP.settings,companyLogo:'[omitted]'});

  // Save personal preferences (theme, background) to Firebase profile
  if(typeof _saveUserPrefs === 'function') {
    _saveUserPrefs({
      theme: APP.settings.theme,
      _dynamicBg: APP.settings._dynamicBg,
      _dynamicBgIntensity: APP.settings._dynamicBgIntensity,
      _hiddenPages: APP.settings._hiddenPages
    });
  }
}

function exportAllJSON() {
  downloadFile(JSON.stringify({...APP,exportedAt:Date.now(),version:'3.0'},null,2),'stockpro-backup-'+Date.now()+'.json','application/json');
  auditLog('EXPORT','all',null,null,{ts:Date.now()});
  notify('Export complet téléchargé','success');
}

function importJSON(input) {
  const file=input.files[0]; if(!file) return;
  if(!confirm('Importer ce fichier ? Les données actuelles seront remplacées. Un backup sera créé automatiquement.')) {input.value='';return;}
  autoBackup(true);
  const reader=new FileReader();
  reader.onload=e=>{
    try {
      const data=JSON.parse(e.target.result);
      ['articles','fournisseurs','commerciaux','mouvements','bons','audit','backups','commandesFourn'].forEach(k=>{if(Array.isArray(data[k])) APP[k]=data[k];});
      if(data.settings) APP.settings=data.settings;
      saveDB(); auditLog('IMPORT','all',null,null,{file:file.name});
      notify('Import réussi ✓','success'); initApp();
    } catch(err){notify('Fichier invalide: '+err.message,'error');}
    input.value='';
  };
  reader.readAsText(file);
}

function restoreSpecificBackup(id) {
  const bk=APP.backups.find(b=>b.id===id);
  if(!bk||!confirm('Restaurer ce backup ? Les données actuelles seront remplacées.')) return;
  try{const restored=JSON.parse(bk.data);Object.assign(APP,restored);saveDB();notify('Backup restauré ✓','success');initApp();}
  catch(e){notify('Erreur restauration','error');}
}

function resetAll() {
  const c1=prompt('Tapez "RESET" pour confirmer la réinitialisation des historiques:');
  if(c1!=='RESET') return;
  const c2=prompt('Confirmation 2/2 — Tapez "OUI":');
  if(c2!=='OUI') return;
  autoBackup(true);
  // Clear ONLY histories — keep stocks, bons, gadgets, commerciaux, fournisseurs, zones, PDV, backups, settings
  APP.mouvements = [];
  APP.audit = [];
  APP._activityLog = [];
  if(APP.dispatch) APP.dispatch.history = [];
  APP.dispatchHistory = [];
  APP.recentlyViewed = [];
  auditLog('RESET','histories',null,null,{ts:Date.now(),note:'Only histories cleared, all data preserved'});
  saveDB();notify('Historiques réinitialisés (stocks, bons, gadgets, commerciaux, fournisseurs, zones, PDV, backups conservés)','success');renderSettings();renderSidebar();
}

function purgeBackups() {
  var _cu = typeof _currentUser === 'function' ? _currentUser() : null;
  if (!_cu || _cu.role !== 'admin') { notify('Accès refusé', 'error'); return; }
  var code = prompt('Entrez le code de sécurité :');
  if (!code) return;
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  var valid = [h + 'h' + m, h + 'H' + m, h + m];
  if (valid.indexOf(code.trim()) === -1) {
    notify('Code incorrect', 'error');
    return;
  }
  if (!confirm('Supprimer toutes les sauvegardes ? Cette action est irréversible.')) return;
  APP.backups = [];
  auditLog('RESET', 'backups', null, null, {ts: Date.now(), note: 'All backups purged by admin'});
  saveDB();
  notify('Sauvegardes purgées', 'success');
  renderSettings();
}

function _loadCloudSnapshotsUI(retry) {
  var el = document.getElementById('cloud-snapshots-list');
  if (!el) return;
  if (typeof _listCloudSnapshots !== 'function') { el.innerHTML = '<div class="empty-state"><p>Fonction non disponible</p></div>'; return; }
  // Not connected yet -> show pending state and retry once
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB || typeof _cloudUser === 'undefined' || !_cloudUser) {
    el.innerHTML = '<div class="empty-state"><p>\u23f3 Connexion cloud en cours\u2026</p></div>';
    if (!retry) setTimeout(function(){ _loadCloudSnapshotsUI(true); }, 2000);
    return;
  }
  el.innerHTML = '<div class="empty-state"><p>Chargement\u2026</p></div>';
  _listCloudSnapshots().then(function(snapshots) {
    if (!snapshots || snapshots.length === 0) {
      el.innerHTML = '<div class="empty-state"><p>Aucun snapshot cloud pour l\'instant</p></div>';
      return;
    }
    el.innerHTML = snapshots.map(function(s) {
      return '<div class="stat-row">'
        + '<span class="stat-label">' + s.date + ' \u00b7 ' + Math.round(s.size/1024) + 'KB'
        + (s.hash ? ' <span style="color:var(--success);font-size:10px">\u2713</span>' : '')
        + ' <span style="color:var(--text-3);font-size:10px">v' + (s.version||'?') + '</span>'
        + '</span>'
        + '<button class="btn btn-sm btn-secondary" onclick="_confirmRestoreSnapshot(\'' + s.dayKey + '\',\'' + s.date + '\')">Restaurer</button>'
        + '</div>';
    }).join('');
  }).catch(function(e) {
    el.innerHTML = '<div class="empty-state"><p>Erreur: ' + (e.message||e) + '</p></div>';
  });
}

function _confirmRestoreSnapshot(dayKey, dateStr) {
  if (!confirm('Restaurer le snapshot du ' + dateStr + ' ?\n\nCela remplacera toutes les donn\u00e9es actuelles (sauf les backups locaux).')) return;
  notify('Restauration en cours...', 'info');
  _restoreCloudSnapshot(dayKey).then(function(ok) {
    if (ok && typeof renderSettings === 'function') renderSettings();
  });
}

function manualBackup() { autoBackup(false); renderSettings(); }

function validateData() {
  var issues = [];
  // 1. Doublons d'articles (meme nom)
  var artNames = {};
  APP.articles.forEach(function(a) {
    var k = (a.name||'').toLowerCase().trim();
    if(artNames[k]) issues.push({type:'doublon',level:'warning',msg:'Article en double : '+a.name+' (IDs: '+artNames[k]+', '+a.id+')'});
    else artNames[k] = a.id;
  });
  // 2. Doublons de codes articles
  var artCodes = {};
  APP.articles.forEach(function(a) {
    if(!a.code) return;
    var k = a.code.toLowerCase().trim();
    if(artCodes[k]) issues.push({type:'doublon',level:'warning',msg:'Code article en double : '+a.code+' ('+a.name+' et '+artCodes[k]+')'});
    else artCodes[k] = a.name;
  });
  // 3. Stocks négatifs
  APP.articles.forEach(function(a) {
    if(a.stock < 0) issues.push({type:'stock',level:'error',msg:'Stock n\u00e9gatif : '+a.name+' ('+a.stock+')'});
  });
  // 4. Articles sous seuil minimum
  APP.articles.forEach(function(a) {
    if(a.stockMin && a.stock < a.stockMin && a.stock >= 0) issues.push({type:'seuil',level:'info',msg:'Stock bas : '+a.name+' ('+a.stock+'/'+a.stockMin+' min)'});
  });
  // 5. Commerciaux sans zone
  APP.commerciaux.forEach(function(c) {
    if(!c.dispatchZoneId) issues.push({type:'config',level:'info',msg:'Commercial sans zone : '+(c.prenom||'')+' '+(c.nom||'')});
  });
  // 6. Mouvements sans article valide
  var artIds = new Set(APP.articles.map(function(a){return a.id}));
  var orphanMvt = APP.mouvements.filter(function(m){return !artIds.has(m.articleId)}).length;
  if(orphanMvt > 0) issues.push({type:'orphelin',level:'warning',msg:orphanMvt+' mouvement(s) r\u00e9f\u00e9ren\u00e7ant des articles supprim\u00e9s'});
  // 7. Bons en brouillon depuis longtemps
  var now = Date.now();
  APP.bons.forEach(function(b) {
    if(b.status === 'draft' && b.createdAt && (now - b.createdAt) > 7*86400000) {
      issues.push({type:'brouillon',level:'info',msg:'Bon en brouillon depuis '+Math.floor((now-b.createdAt)/86400000)+' jours : '+(b.numero||b.id)});
    }
  });
  // Display results
  var html = '<div style="max-height:60vh;overflow-y:auto">';
  if(issues.length === 0) {
    html += '<div style="text-align:center;padding:24px;color:var(--success)"><div style="font-size:48px">\u2705</div><p style="margin-top:8px;font-size:16px">Aucun probl\u00e8me d\u00e9tect\u00e9 !</p></div>';
  } else {
    var errors = issues.filter(function(i){return i.level==='error'}).length;
    var warnings = issues.filter(function(i){return i.level==='warning'}).length;
    var infos = issues.filter(function(i){return i.level==='info'}).length;
    html += '<div style="display:flex;gap:12px;margin-bottom:12px">';
    if(errors) html += '<span class="badge" style="background:var(--danger);color:white">'+errors+' erreur(s)</span>';
    if(warnings) html += '<span class="badge" style="background:var(--warning);color:#111">'+warnings+' avertissement(s)</span>';
    if(infos) html += '<span class="badge" style="background:var(--accent);color:white">'+infos+' info(s)</span>';
    html += '</div>';
    issues.forEach(function(i) {
      var color = i.level==='error'?'var(--danger)':i.level==='warning'?'var(--warning)':'var(--accent)';
      var icon = i.level==='error'?'\u274C':i.level==='warning'?'\u26A0\uFE0F':'\u2139\uFE0F';
      html += '<div style="padding:8px 12px;margin-bottom:4px;border-left:3px solid '+color+';background:var(--bg-3);border-radius:4px;font-size:0.9em">'+icon+' '+i.msg+'</div>';
    });
  }
  html += '</div>';
  openGenericModal('Validation des donn\u00e9es ('+issues.length+' probl\u00e8me'+(issues.length!==1?'s':'')+')', html);
}

// ============================================================
// SMART SEARCH ENGINE
// ============================================================
// DASHBOARD WIDGET CUSTOMIZATION
// ============================================================
const DASH_WIDGETS = [
  {id:'kpis', label:'KPIs (Stock, Alertes, Bons)', default:true},
  {id:'dispatch', label:'Aperçu Dispatch', default:true},
  {id:'charts', label:'Graphiques (Catégories, Mouvements)', default:true},
  {id:'alerts-activity', label:'Alertes & Activité récente', default:true},
  {id:'report', label:'Rapport de stock', default:true}
];

function _getDashWidgetConfig() {
  if(!APP.settings._dashWidgets) {
    APP.settings._dashWidgets = {};
    DASH_WIDGETS.forEach(function(w){APP.settings._dashWidgets[w.id]=w.default;});
  }
  return APP.settings._dashWidgets;
}

function _applyDashWidgets() {
  var cfg = _getDashWidgetConfig();
  var order = APP.settings._dashWidgetOrder || DASH_WIDGETS.map(function(w){return w.id;});
  var container = document.getElementById('content');
  var widgets = Array.from(document.querySelectorAll('.dash-widget'));
  widgets.forEach(function(el) {
    var wid = el.dataset.widget;
    if(wid && cfg[wid] === false) el.style.display = 'none';
    else if(wid) el.style.display = '';
  });
  // Apply saved order
  order.forEach(function(wid) {
    var el = widgets.find(function(w){ return w.dataset.widget === wid; });
    if(el) container.appendChild(el);
  });
}

function _initDashDragDrop() {
  document.querySelectorAll('.dash-widget').forEach(function(el) {
    el.draggable = true;
    el.style.cursor = 'grab';
    el.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', el.dataset.widget);
      el.style.opacity = '0.4';
      el.classList.add('dash-dragging');
    });
    el.addEventListener('dragend', function() {
      el.style.opacity = '1';
      el.classList.remove('dash-dragging');
      document.querySelectorAll('.dash-drop-target').forEach(function(d){ d.classList.remove('dash-drop-target'); });
    });
    el.addEventListener('dragover', function(e) { e.preventDefault(); el.classList.add('dash-drop-target'); });
    el.addEventListener('dragleave', function() { el.classList.remove('dash-drop-target'); });
    el.addEventListener('drop', function(e) {
      e.preventDefault();
      el.classList.remove('dash-drop-target');
      var fromId = e.dataTransfer.getData('text/plain');
      var toId = el.dataset.widget;
      if(fromId === toId) return;
      var order = APP.settings._dashWidgetOrder || DASH_WIDGETS.map(function(w){return w.id;});
      var fromIdx = order.indexOf(fromId);
      var toIdx = order.indexOf(toId);
      if(fromIdx < 0 || toIdx < 0) return;
      order.splice(fromIdx, 1);
      order.splice(toIdx, 0, fromId);
      APP.settings._dashWidgetOrder = order;
      saveDB();
      _applyDashWidgets();
      _initDashDragDrop();
      notify('Widgets r\u00e9organis\u00e9s', 'success');
    });
  });
}

function openDashWidgetConfig() {
  var cfg = _getDashWidgetConfig();
  var rows = '';
  DASH_WIDGETS.forEach(function(w) {
    var checked = cfg[w.id] !== false ? ' checked' : '';
    rows += '<label style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-2);border-radius:8px;cursor:pointer;margin-bottom:6px">'
      + '<input type="checkbox" class="dash-wid-chk" data-wid="' + w.id + '"' + checked + ' style="width:18px;height:18px">'
      + '<span style="font-size:14px">' + w.label + '</span></label>';
  });
  var html = '<div style="margin-bottom:12px;color:var(--text-2);font-size:13px">Cochez les widgets \u00e0 afficher sur le tableau de bord :</div>'
    + rows
    + '<div style="margin-top:16px;text-align:right">'
    + '<button class="btn btn-primary btn-sm" onclick="saveDashWidgetConfig()">Enregistrer</button></div>';
  openGenericModal('\u2699\uFE0F Personnaliser le tableau de bord', html);
}

function saveDashWidgetConfig() {
  var cfg = _getDashWidgetConfig();
  document.querySelectorAll('.dash-wid-chk').forEach(function(el) {
    cfg[el.dataset.wid] = el.checked;
  });
  APP.settings._dashWidgets = cfg;
  saveDB();
  closeModal();
  _applyDashWidgets();
  notify('Tableau de bord personnalisé', 'success');
}

// ============================================================
let smartSearchIdx=-1;
function openSmartSearch() {
  const overlay=document.getElementById('smart-search-overlay');
  overlay.classList.add('open');
  setTimeout(()=>document.getElementById('smart-search-input').focus(),50);
}
function closeSmartSearch(e) {
  if(!e||e.target===document.getElementById('smart-search-overlay')){
    document.getElementById('smart-search-overlay').classList.remove('open');
    document.getElementById('smart-search-input').value='';
    document.getElementById('smart-search-results').innerHTML='<div style="padding:24px;text-align:center;color:var(--text-2);font-size:13px">Tapez pour rechercher dans tout le stock manager...</div>';
  }
}
function fuzzyMatch(text,query) {
  text=text.toLowerCase(); query=query.toLowerCase();
  if(text.includes(query)) return true;
  let qi=0;
  for(let i=0;i<text.length&&qi<query.length;i++){if(text[i]===query[qi])qi++;}
  return qi===query.length;
}
function runSmartSearch(q) {
  smartSearchIdx=-1;
  const container=document.getElementById('smart-search-results');
  if(!q.trim()){container.innerHTML='<div style="padding:24px;text-align:center;color:var(--text-2);font-size:13px">Tapez pour rechercher...</div>';return;}
  const results=[];
  APP.articles.forEach(a=>{if(fuzzyMatch(a.name,q)||fuzzyMatch(a.code,q)||fuzzyMatch(a.category||'',q)){const isAlert=a.stock<=a.stockMin;results.push({type:'gadget',icon:'📦',color:'#3d7fff',title:a.name,sub:`${a.code} · ${a.category} · Stock: ${a.stock}${isAlert?' ⚠️':''}`,action:()=>{closeSmartSearch();showPage('articles');}});}});
  APP.commerciaux.forEach(c=>{const name=c.prenom+' '+c.nom;if(fuzzyMatch(name,q)||fuzzyMatch(c.email||'',q)||fuzzyMatch(c.service||'',q)){const bons=APP.bons.filter(b=>b.commercialId===c.id).length;results.push({type:'commercial',icon:'👤',color:'#00e5aa',title:name,sub:`${c.service||''} · ${bons} bons émis`,action:()=>{closeSmartSearch();showPage('commerciaux');}});}});
  APP.bons.forEach(b=>{if(fuzzyMatch(b.numero,q)||fuzzyMatch(b.commercialName||'',q)||fuzzyMatch(b.recipiendaire||'',q)||fuzzyMatch(_bonLiveName(b),q)){results.push({type:'bon',icon:'📋',color:'#ffa502',title:b.numero,sub:`${_bonLiveName(b)||'—'} · ${fmtDate(b.createdAt)} · ${b.status}`,action:()=>{closeSmartSearch();showPage('bons');}});}});
  APP.fournisseurs.forEach(f=>{if(fuzzyMatch(f.nom,q)||fuzzyMatch(f.entreprise||'',q)||fuzzyMatch(f.contact||'',q)){results.push({type:'fournisseur',icon:'🚚',color:'#ff6b35',title:f.nom+(f.entreprise?' — '+f.entreprise:''),sub:f.contact||f.adresse||'',action:()=>{closeSmartSearch();viewFournDetail(f.id);}});}});
  (APP.commandesFourn||[]).forEach(c=>{if(fuzzyMatch(c.numero,q)||fuzzyMatch(c.fournisseurNom||'',q)){const pct=calcCmdPct(c);results.push({type:'commande',icon:'📦',color:'#ffa502',title:c.numero,sub:`${c.fournisseurNom} · ${getCmdStatusLabel(c.status)} · ${pct}%`,action:()=>{closeSmartSearch();showPage('fourn-dashboard');}});}});
  // companies search removed
    // PDV search
  (APP.pdv||[]).forEach(function(p){
    var pName = p.nom || '';
    if(fuzzyMatch(pName,q)){
      var zone = (APP.zones||[]).find(function(z){return z.id===p.zoneId;});
      results.push({type:'pdv',icon:'🏪',color:'#e056fd',title:pName,sub:(p.type||'')+(zone?' \u00b7 '+zone.name:'')+' \u00b7 '+(p.actif!==false?'Actif':'Inactif'),action:function(){closeSmartSearch();showPage('pdv');}});
    }
  });
  // Mouvements search
  (APP.mouvements||[]).slice(0,200).forEach(function(m){
    var desc = (m.articleName||'')+(m.note?' \u2014 '+m.note:'');
    if(fuzzyMatch(desc,q)||fuzzyMatch(m.type||'',q)){
      results.push({type:'mouvement',icon:m.type==='entree'?'📥':'📤',color:m.type==='entree'?'#2ed573':'#ff4757',title:(m.type==='entree'?'Entr\u00e9e':'Sortie')+' \u2014 '+(m.articleName||''),sub:'Qty: '+m.qty+' \u00b7 '+fmtDate(m.ts)+(m.note?' \u00b7 '+m.note:''),action:function(){closeSmartSearch();showPage('mouvements');}});
    }
  });
  if(fuzzyMatch('analytique',q)||fuzzyMatch('analyse',q)) results.push({type:'page',icon:'🧠',color:'#9b59b6',title:'Analytique',sub:'Prédictions, top gadgets, agents actifs',action:()=>{closeSmartSearch();showPage('analytics');}});
  if(!results.length){container.innerHTML=`<div style="padding:24px;text-align:center;color:var(--text-2);font-size:13px">Aucun résultat pour "<strong>${q}</strong>"</div>`;return;}
  container.innerHTML=results.slice(0,8).map((r,i)=>`
    <div class="search-result-item" id="sr-${i}" onclick="r${i}()" data-idx="${i}">
      <div class="search-result-icon" style="background:${r.color}22;color:${r.color}">${r.icon}</div>
      <div><div class="search-result-title">${highlight(r.title,q)}</div><div class="search-result-sub">${r.sub}</div></div>
      <div style="margin-left:auto;font-size:11px;color:var(--text-3);background:var(--bg-3);padding:2px 6px;border-radius:4px">${r.type}</div>
    </div>`).join('');
  results.slice(0,8).forEach((r,i)=>{window['r'+i]=r.action;});
}
function highlight(text,q) {
  if(!q) return text;
  const idx=text.toLowerCase().indexOf(q.toLowerCase());
  if(idx<0) return text;
  return text.slice(0,idx)+`<mark style="background:rgba(61,127,255,.3);border-radius:2px;padding:0 2px">${text.slice(idx,idx+q.length)}</mark>`+text.slice(idx+q.length);
}
function smartSearchKey(e) {
  const items=document.querySelectorAll('.search-result-item');
  if(e.key==='ArrowDown'){e.preventDefault();smartSearchIdx=Math.min(smartSearchIdx+1,items.length-1);items.forEach((it,i)=>it.style.background=i===smartSearchIdx?'var(--bg-3)':'');}
  else if(e.key==='ArrowUp'){e.preventDefault();smartSearchIdx=Math.max(smartSearchIdx-1,0);items.forEach((it,i)=>it.style.background=i===smartSearchIdx?'var(--bg-3)':'');}
  else if(e.key==='Enter'){e.preventDefault();const idx=smartSearchIdx>=0?smartSearchIdx:0;if(items[idx])items[idx].click();}
  else if(e.key==='Escape') closeSmartSearch();
}
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSmartSearch();}
  if((e.ctrlKey||e.metaKey)&&e.key==='s'){
    e.preventDefault();
    e.stopPropagation();
    if(_dirHandle){
      clearTimeout(_saveTimer);
      _doSaveToFile().then(function(){notify('✔ Sauvegardé localement','success')})
                     .catch(function(err){notify('Erreur: '+err.message,'error')});
    } else {
      try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(ex){}
      notify('✔ Données sauvegardées','success');
    }
    return false;
  }
  if(e.key==='Escape') closeSmartSearch();
});

// ═══════════════════════════════════════════════════════════════════════════
// USER & PERMISSION SYSTEM
// Admin: PERFECT (full access, no password for now)
// Others: configurable view/edit per module
// Session stored in sessionStorage (not persisted to file)
// ═══════════════════════════════════════════════════════════════════════════

const ALL_PAGES_PERMS = [
  { id:'dashboard',       label:'Tableau de bord',   group:'PRINCIPAL' },
  { id:'articles',        label:'Gadgets & Stock',    group:'PRINCIPAL' },
  { id:'bons',            label:'Bons de sortie',     group:'PRINCIPAL' },
  { id:'mouvements',      label:'Mouvements',         group:'PRINCIPAL' },
  { id:'commerciaux',     label:'Commerciaux',        group:'GESTION' },
  { id:'territoire',      label:'Zones & Secteurs',   group:'GESTION' },
  { id:'pdv',             label:'Points de Vente',    group:'GESTION' },
  { id:'fournisseurs',    label:'Fournisseurs',       group:'GESTION' },
  { id:'annuaire',        label:'Annuaire',           group:'GESTION' },
  { id:'fourn-dashboard', label:'Suivi livraisons',   group:'GESTION' },
  { id:'gma-catalogue',   label:'Catalogue GMA',      group:'GMA' },
  { id:'analytics',       label:'Analytique',      group:'INTELLIGENCE' },
  { id:'dispatch',        label:'Dispatch Gadgets',   group:'DISPATCH' },
  { id:'audit',           label:'Audit Trail',        group:'OUTILS' },
  { id:'boneditor',       label:'\u00c9diteur de Bon', group:'OUTILS' },
  { id:'administration', label:'Administration',     group:'OUTILS' },
  { id:'settings',        label:'Param\u00e8tres',     group:'OUTILS' },
];

// ── Auth: _currentUser, hasPermission, canView, canEdit, showLoginScreen, loginAs, logoutUser, updateUserBadge, showUserSwitchMenu ── (moved to auth.js)

// ── User Management ───────────────────────────────────────────────────────
function renderUserManagement() {
  const u = _currentUser();
  if(u?.role !== 'admin') return '<div class="empty-state"><p>\u26D4 R\u00e9serv\u00e9 \u00e0 l\u2019administrateur</p></div>';
  const users = APP.users || [];
  return `
  <div class="card-header"><span class="card-title">\uD83D\uDC65 Gestion des utilisateurs</span><button class="btn btn-sm btn-primary" onclick="openUserModal()">+ Nouvel utilisateur</button></div>
  <div style="padding:8px 0">
    ${users.map(uu => `
    <div class="stat-row">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--accent);overflow:hidden;flex-shrink:0">
          ${uu.photo?`<img src="${uu.photo}" style="width:36px;height:36px;object-fit:cover;border-radius:50%">`:uu.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-weight:600;font-size:13px">${uu.name} ${uu.id===(_currentUser()?.id)?'<span style="font-size:10px;color:var(--accent);">(vous)</span>':''}</div>
          <div style="font-size:11px;color:var(--text-2)">${uu.email||'—'} · ${uu.role==='admin'?'<span style="color:var(--accent);font-weight:600">Admin</span>':'Utilisateur'}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-secondary" onclick="openUserModal('${uu.id}')">\u270F\uFE0F</button>
        ${uu.role!=='admin'?`<button class="btn btn-sm btn-secondary" onclick="deleteUser('${uu.id}')">\uD83D\uDDD1\uFE0F</button>`:''}
      </div>
    </div>`).join('')}
  </div>`;
}

function openUserModal(userId) {
  // Accept either an ID or an email
  var u = null;
  if (userId) {
    u = (APP.users||[]).find(x=>x.id===userId);
    if (!u) u = (APP.users||[]).find(x=>x.email && x.email.toLowerCase() === userId.toLowerCase());
  }
  const permHtml = ALL_PAGES_PERMS.map(p => {
    const vChecked = u?.permissions?.[p.id]?.view ? 'checked' : (!userId || u?.role==='admin' ? 'checked' : '');
    const eChecked = u?.permissions?.[p.id]?.edit ? 'checked' : (!userId || u?.role==='admin' ? 'checked' : '');
    return `<tr>
      <td style="font-size:12px;padding:3px 6px">${p.label}</td>
      <td style="text-align:center;padding:3px 6px"><input type="checkbox" ${vChecked} id="perm-v-${p.id}"></td>
      <td style="text-align:center;padding:3px 6px"><input type="checkbox" ${eChecked} id="perm-e-${p.id}"></td>
    </tr>`;
  }).join('');

  var _uPrenom = u?.prenom || '';
  var _uNom = u?.nom || '';
  if (!_uPrenom && !_uNom && u?.name) {
    var _parts = u.name.trim().split(/\s+/);
    _uPrenom = _parts[0] || '';
    _uNom = _parts.slice(1).join(' ') || '';
  }
  openModal(userId ? 'Modifier utilisateur' : 'Nouvel utilisateur', `
    <div class="form-row">
      <div class="form-group"><label>Prénom *</label><input id="um-prenom" value="${(_uPrenom||'').replace(/"/g,'&quot;')}"></div>
      <div class="form-group"><label>Nom *</label><input id="um-nom" value="${(_uNom||'').replace(/"/g,'&quot;')}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Email *</label><input id="um-email" value="${u?.email||''}" type="email"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Mot de passe ${userId ? '<span style="font-size:10px;color:var(--text-3)">(laisser vide = inchang\u00e9)</span>' : '<span style="font-size:10px;color:var(--danger)">* obligatoire</span>'}</label><input id="um-pass" type="text" placeholder="${userId ? 'Laisser vide = inchang\u00e9' : 'Min. 6 caract\u00e8res'}" value="" autocomplete="off">${userId && u ? '<div style="font-size:10px;color:var(--text-3);margin-top:2px">\u2705 Mot de passe d\u00e9j\u00e0 d\u00e9fini</div>' : ''}</div>
      <div class="form-group"><label>R\u00f4le</label><select id="um-role" onchange="_onRoleChange(this.value)">
        ${typeof ROLE_TEMPLATES!=='undefined' ? Object.keys(ROLE_TEMPLATES).map(function(k){ return '<option value="'+k+'" '+(u&&u.role===k?'selected':'')+'>'+ROLE_TEMPLATES[k].label+'</option>'; }).join('') : '<option value="user">Utilisateur</option><option value="admin">Administrateur</option>'}
      </select></div>
    </div>
    <div class="form-group">
      <label>Matricule <span style="font-size:10px;color:var(--text-3)">(unique \u2014 GMA-XXX)</span></label>
      <input id="um-matricule" value="${u?.matricule||''}" placeholder="ex: GMA-042">
    </div>
    <div class="form-group">
      <label>Photo (optionnel)</label>
      <div style="display:flex;align-items:center;gap:10px">
        <div id="um-photo-preview" style="width:48px;height:48px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:20px;overflow:hidden">${u?.photo?`<img src="${u.photo}" style="width:48px;height:48px;object-fit:cover">`:'\uD83D\uDC64'}</div>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('um-photo-input').click()">Choisir photo</button>
        <input type="file" id="um-photo-input" accept="image/*" style="display:none" onchange="previewUserPhoto(this)">
        <input type="hidden" id="um-photo-data" value="${u?.photo||''}">
      </div>
    </div>
    ${(()=>{
      // Phase 10: prefer signatureKey (RTDB), fall back to legacy base64
      var existingSigSrc = '';
      if (u && u.signatureKey && typeof _getSignature === 'function') {
        existingSigSrc = _getSignature(u.signatureKey) || '';
      }
      if (!existingSigSrc && u && u.signature) existingSigSrc = u.signature;
      return `
    <div class="form-group" id="um-sig-section">
      <label>Signature digitalis\u00e9e (optionnel)</label>
      <div style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap">
        <div id="um-sig-preview" style="width:120px;height:50px;background:var(--bg-2);border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;border-radius:6px;overflow:hidden">
          ${existingSigSrc ? `<img src="${existingSigSrc}" style="max-width:120px;max-height:50px;object-fit:contain">` : '<span style="font-size:11px;color:var(--text-3)">Aucune</span>'}
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('um-sig-input').click()">\uD83D\uDCC1 Importer image</button>
          <button class="btn btn-secondary btn-sm" onclick="openSigDrawCanvas()">\u270D\uFE0F Dessiner signature</button>
          <button class="btn btn-danger btn-sm" onclick="_umClearSig()">\uD83D\uDDD1 Retirer</button>
        </div>
        <input type="file" id="um-sig-input" accept="image/*" style="display:none" onchange="previewUserSignature(this)">
        <input type="hidden" id="um-sig-data" value="">
        <input type="hidden" id="um-sig-existing-key" value="${u?.signatureKey||''}">
        <input type="hidden" id="um-sig-cleared" value="0">
      </div>`;
    })()}
      <div id="um-sig-canvas-wrap" style="display:none;margin-top:8px">
        <canvas id="um-sig-canvas" width="400" height="120" style="border:1px solid var(--border);border-radius:6px;background:#fff;cursor:crosshair;max-width:100%"></canvas>
        <div style="display:flex;gap:6px;margin-top:4px">
          <button class="btn btn-sm btn-secondary" onclick="clearSigCanvas()">Effacer</button>
          <button class="btn btn-sm btn-primary" onclick="saveSigCanvas()">\u2713 Valider signature</button>
        </div>
      </div>
    </div>
    <div id="um-perms-section" style="display:${u?.role==='admin'?'none':'block'}">
      <label style="display:block;margin:12px 0 6px;font-weight:600">Permissions par module</label>
      <div style="max-height:200px;overflow-y:auto;overflow-x:hidden;border:1px solid var(--border);border-radius:8px;padding:4px">
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead><tr><th style="text-align:left;padding:4px 6px;position:sticky;top:0;background:var(--bg-1)">Module</th><th style="text-align:center;width:60px;padding:4px;position:sticky;top:0;background:var(--bg-1)">Voir</th><th style="text-align:center;width:60px;padding:4px;position:sticky;top:0;background:var(--bg-1)">Modifier</th></tr></thead>
          <tbody>${permHtml}</tbody>
        </table>
      </div>
      <label style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:8px 12px;border-radius:8px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.18);cursor:pointer">
        <input type="checkbox" id="perm-special-comsig" ${u?.permissions?._special?.commercialSignature?'checked':''}>
        <span style="font-size:12px;font-weight:600;color:var(--text-1)">Autoriser la modification des signatures de commerciaux</span>
      </label>
    </div>
  `, [
    { label: 'Annuler', cls: 'btn-secondary', onclick: 'closeModal()' },
    { label: '\u2713 Enregistrer', cls: 'btn-primary', onclick: 'saveUserModal(\"' + (userId||'') + '\")' }
  ]);

  // Apply role preset permissions if changing role
  setTimeout(function() { _onRoleChange(document.getElementById('um-role')?.value); }, 50);
}

function _onRoleChange(role) {
  var permsSection = document.getElementById('um-perms-section');
  if(permsSection) permsSection.style.display = (role === 'admin') ? 'none' : 'block';
  if(typeof _getDefaultPerms === 'function' && role && role !== 'custom') {
    var defaults = _getDefaultPerms(role);
    ALL_PAGES_PERMS.forEach(function(pg) {
      var vEl = document.getElementById('perm-v-' + pg.id);
      var eEl = document.getElementById('perm-e-' + pg.id);
      if(vEl && defaults[pg.id]) vEl.checked = defaults[pg.id].view;
      if(eEl && defaults[pg.id]) eEl.checked = defaults[pg.id].edit;
    });
  }
}

function previewUserPhoto(input) {
  const f = input.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = e => {
    document.getElementById('um-photo-data').value = e.target.result;
    const prev = document.getElementById('um-photo-preview');
    if(prev) prev.innerHTML = `<img src="${e.target.result}" style="width:48px;height:48px;object-fit:cover;border-radius:50%">`;
  };
  r.readAsDataURL(f);
}

function previewUserSignature(input) {
  const f = input.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = e => {
    document.getElementById('um-sig-data').value = e.target.result;
    var clrEl = document.getElementById('um-sig-cleared'); if (clrEl) clrEl.value = '0';
    const prev = document.getElementById('um-sig-preview');
    if(prev) prev.innerHTML = `<img src="${e.target.result}" style="max-width:120px;max-height:50px;object-fit:contain">`;
  };
  r.readAsDataURL(f);
}


let _sigDrawing = false;
function openSigDrawCanvas() {
  const wrap = document.getElementById('um-sig-canvas-wrap');
  if(!wrap) return;
  wrap.style.display = 'block';
  const canvas = document.getElementById('um-sig-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let drawing = false;
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.touches?e.touches[0].clientX:e.clientX)-r.left;
    const y = (e.touches?e.touches[0].clientY:e.clientY)-r.top;
    return {x: x*(canvas.width/r.width), y: y*(canvas.height/r.height)};
  }
  canvas.onmousedown = canvas.ontouchstart = function(e) { e.preventDefault(); drawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  canvas.onmousemove = canvas.ontouchmove = function(e) { e.preventDefault(); if(!drawing)return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); };
  canvas.onmouseup = canvas.ontouchend = canvas.onmouseleave = function() { drawing=false; };
}
function clearSigCanvas() {
  const canvas = document.getElementById('um-sig-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
}
function saveSigCanvas() {
  const canvas = document.getElementById('um-sig-canvas');
  if(!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');
  document.getElementById('um-sig-data').value = dataUrl;
  var clrEl = document.getElementById('um-sig-cleared'); if (clrEl) clrEl.value = '0';
  const prev = document.getElementById('um-sig-preview');
  if(prev) prev.innerHTML = '<img src="' + dataUrl + '" style="max-width:120px;max-height:50px;object-fit:contain">';
  document.getElementById('um-sig-canvas-wrap').style.display = 'none';
  notify('Signature captur\u00e9e \u2713', 'success');
}
function _umClearSig() {
  var dataEl = document.getElementById('um-sig-data');
  var clrEl = document.getElementById('um-sig-cleared');
  var prev = document.getElementById('um-sig-preview');
  if (dataEl) dataEl.value = '';
  if (clrEl) clrEl.value = '1';
  if (prev) prev.innerHTML = '<span style="font-size:11px;color:var(--text-3)">Aucune (sera retir\u00e9e)</span>';
}

async function saveUserModal(userId) {
  if(_currentUser()?.role !== 'admin') { notify('\u26d4 Action r\u00e9serv\u00e9e', 'warning'); return; }
  const prenom = document.getElementById('um-prenom')?.value?.trim() || '';
  const nom   = document.getElementById('um-nom')?.value?.trim() || '';
  const name  = (prenom + ' ' + nom).trim();
  const email = document.getElementById('um-email')?.value?.trim();
  const pass  = document.getElementById('um-pass')?.value?.trim() || null;
  const role  = document.getElementById('um-role')?.value || 'viewer';
  const photo = document.getElementById('um-photo-data')?.value || null;
  const newSigDataUrl = document.getElementById('um-sig-data')?.value || '';
  const existingSigKey = document.getElementById('um-sig-existing-key')?.value || '';
  const sigCleared = (document.getElementById('um-sig-cleared')?.value === '1');
  const matricule = document.getElementById('um-matricule')?.value?.trim() || '';
  // Resolve actual user.id for matricule check (userId may be an email)
  var _resolvedUser = userId ? ((APP.users||[]).find(x=>x.id===userId) || (APP.users||[]).find(x=>x.email&&x.email.toLowerCase()===userId.toLowerCase())) : null;
  var _resolvedId = _resolvedUser ? _resolvedUser.id : null;
  if (matricule && !_isMatriculeUnique(matricule, _resolvedId)) {
    notify('Matricule d\u00e9j\u00e0 utilis\u00e9 (user/commercial/annuaire)', 'error'); return;
  }
  // Phase 10: resolve final signatureKey (upload new / delete old / leave alone)
  let finalSigKey = existingSigKey;
  let finalSigDataUrl = '';  // for Firebase profile mirror
  try {
    if (newSigDataUrl) {
      // New sig provided -- upload to RTDB, delete old key if any
      if (existingSigKey && typeof _deleteSignature === 'function') {
        try { await _deleteSignature(existingSigKey); } catch(e) {}
      }
      if (typeof _uploadSignature === 'function') {
        finalSigKey = await _uploadSignature(newSigDataUrl, 'sig');
        finalSigDataUrl = newSigDataUrl;
      } else {
        finalSigKey = '';
      }
    } else if (sigCleared && existingSigKey) {
      // Explicit removal
      if (typeof _deleteSignature === 'function') {
        try { await _deleteSignature(existingSigKey); } catch(e) {}
      }
      finalSigKey = '';
    } else if (existingSigKey && typeof _getSignature === 'function') {
      // No change -- preserve existing key, resolve dataUrl for profile mirror
      finalSigDataUrl = _getSignature(existingSigKey) || '';
    }
  } catch(e) {
    console.warn('[PSM] User sig op failed:', e);
    notify('Erreur signature: ' + (e.message || e), 'error');
    return;
  }
  if(!prenom || !nom) { notify('Le pr\u00e9nom et le nom sont obligatoires', 'warning'); return; }
  if(!email) { notify('L\'email est obligatoire', 'warning'); return; }

  // Validate for new user
  if(!userId) {
    if(!pass || pass.length < 6) { notify('Mot de passe obligatoire (min. 6 caract\u00e8res)', 'warning'); return; }
  }

  // Collect permissions
  let permissions = null;
  if(role !== 'admin') {
    permissions = {};
    ALL_PAGES_PERMS.forEach(p => {
      permissions[p.id] = {
        view: document.getElementById('perm-v-'+p.id)?.checked || false,
        edit: document.getElementById('perm-e-'+p.id)?.checked || false,
      };
    });
    permissions._special = {
      commercialSignature: document.getElementById('perm-special-comsig')?.checked || false,
    };
  }

  if(!APP.users) APP.users = [];

  try {
    if(userId) {
      // ── EDIT existing user ── (find by ID or email)
      var u = APP.users.find(x => x.id === userId);
      if (!u) u = APP.users.find(x => x.email && x.email.toLowerCase() === userId.toLowerCase());
      if(u) {
        u.prenom = prenom; u.nom = nom; u.name = name;
        u.email = email; u.role = role; u.permissions = permissions;
        u.matricule = matricule;
        if(photo) u.photo = photo;
        u.signatureKey = finalSigKey || '';
        // Phase 10: drop legacy base64 once we have a key (or were cleared)
        if (u.signatureKey || sigCleared) delete u.signature;
        u._version = (u._version||1) + 1;
      }
      // Update Firebase profile (mirrors photo + resolved sig dataUrl)
      if(typeof _adminUpdateProfile === 'function' && _firebaseDB && _cloudUser) {
        try { await _adminUpdateProfile(email, name, role, permissions, true, photo, finalSigDataUrl, matricule, finalSigKey); } catch(e) { console.warn('[PSM] profile update:', e); }
      }
    } else {
      // ── CREATE new user ──
      // 1. Create Supabase Auth account + profile
      if(typeof _adminCreateSupabaseUser === 'function' && _firebaseAuth && _cloudUser) {
        notify('Cr\u00e9ation du compte...', 'info');
        await _adminCreateSupabaseUser(email, pass, name, role, permissions);
      }
      // 2. Create local entry
      var existing = APP.users.find(function(x) { return x.email === email; });
      if(!existing) {
        APP.users.push({ id: generateId(), prenom: prenom, nom: nom, name: name, email: email, password: null, role: role, matricule: matricule, photo: photo||null, signatureKey: finalSigKey||'', permissions: permissions, createdAt: Date.now(), _version: 1 });
      }
    }

    saveDB();
    closeModal();
    notify('\u2705 Utilisateur enregistr\u00e9', 'success');
    if(typeof currentPage !== 'undefined' && currentPage === 'administration') { showPage('administration'); }
    else { renderSettings(); }
  } catch(err) {
    var msg = err.message || String(err);
    if(msg.includes('EMAIL_EXISTS')) msg = 'Cet email a d\u00e9j\u00e0 un compte';
    notify('\u274c ' + msg, 'error');
  }
}

async function deleteUser(userId) {
  if(_currentUser()?.role !== 'admin') { notify('\u26d4 Action r\u00e9serv\u00e9e', 'warning'); return; }
  if(!confirm('Supprimer cet utilisateur ?')) return;
  var user = (APP.users||[]).find(u => u.id === userId);
  if (!user) user = (APP.users||[]).find(u => u.email && u.email.toLowerCase() === userId.toLowerCase());
  var userEmail = user ? user.email : null;
  var userIdToRemove = user ? user.id : userId;
  APP.users = (APP.users||[]).filter(u => u.id !== userIdToRemove);
  // Nettoie les entrees annuaire liees a ce user (et tombstone pour bloquer la recreation auto)
  // _annuaireTombstones est un object { userId: true } (cf deleteAnnuaire + _syncUsersToAnnuaire)
  var annBefore = (APP.annuaire||[]).length;
  APP.annuaire = (APP.annuaire||[]).filter(function(a){
    if (a._fromUserId === userIdToRemove) {
      if (!APP._annuaireTombstones || typeof APP._annuaireTombstones !== 'object' || Array.isArray(APP._annuaireTombstones)) APP._annuaireTombstones = {};
      APP._annuaireTombstones[userIdToRemove] = true;
      return false;
    }
    return true;
  });
  if (annBefore !== APP.annuaire.length) { try { auditLog('DELETE','annuaire_auto','user:'+userIdToRemove,null,null); } catch(e){} }
  if(sessionStorage.getItem('psm_user') === userId) sessionStorage.removeItem('psm_user');

  // Delete profile from Firebase
  if(userEmail && typeof _firebaseDB !== 'undefined' && _firebaseDB) {
    try {
      var snap = await _firebaseDB.ref('profiles').orderByChild('email').equalTo(userEmail).once('value');
      if(snap.exists()) {
        var updates = {};
        Object.keys(snap.val()).forEach(function(uid) { updates[uid] = null; });
        await _firebaseDB.ref('profiles').update(updates);
        console.log('[PSM] Firebase profile deleted:', userEmail);
      }
    } catch(e) {
      console.warn('[PSM] Firebase profile delete error:', e);
      if (typeof notify === 'function') notify('⚠ Profil cloud non supprimé pour ' + userEmail + ' — réessayer (sinon le compte peut réapparaitre)', 'error');
    }
    if(typeof logActivity === 'function') logActivity('admin_delete_user', 'Suppression: ' + userEmail);
  }

  // Save locally + force immediate cloud save and WAIT for it
  APP._ts = Date.now();
  _invalidatePageCache();
  try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
  if(typeof _doSaveToCloud === 'function') {
    try { await _doSaveToCloud(); } catch(e) { console.warn('[PSM] cloud save after delete:', e); }
  }
  notify('Utilisateur supprim\u00e9', 'success');
  if(typeof currentPage !== 'undefined' && currentPage === 'administration') { showPage('administration'); }
  else { renderSettings(); }
}




// ============================================================
// ADMINISTRATION MODULE — Admin-only user & account management
// ============================================================

var ROLE_TEMPLATES = {
  admin:    { label: 'Administrateur', desc: 'Accès total à tous les modules', color: '#6366f1' },
  manager:  { label: 'Manager', desc: 'Voir et modifier la plupart des modules', color: '#f59e0b' },
  commercial: { label: 'Commercial', desc: 'Bons, articles, mouvements, PDV', color: '#22c55e' },
  viewer:   { label: 'Lecteur', desc: 'Consultation uniquement (aucune modification)', color: '#8888aa' },
  custom:   { label: 'Personnalisé', desc: 'Permissions définies manuellement', color: '#ec4899' }
};

function _getDefaultPerms(role) {
  var p = {};
  ALL_PAGES_PERMS.forEach(function(pg) { p[pg.id] = { view: false, edit: false }; });
  if (role === 'admin') {
    ALL_PAGES_PERMS.forEach(function(pg) { p[pg.id] = { view: true, edit: true }; });
  } else if (role === 'manager') {
    ALL_PAGES_PERMS.forEach(function(pg) { p[pg.id] = { view: true, edit: pg.id !== 'settings' && pg.id !== 'administration' }; });
  } else if (role === 'commercial') {
    ['dashboard','articles','bons','mouvements','pdv','gma-catalogue','boneditor'].forEach(function(id) { if(p[id]) p[id] = { view: true, edit: true }; });
    ['commerciaux','territoire','fourn-dashboard'].forEach(function(id) { if(p[id]) p[id] = { view: true, edit: false }; });
  } else if (role === 'viewer') {
    ALL_PAGES_PERMS.forEach(function(pg) { p[pg.id] = { view: true, edit: false }; });
    p['settings'] = { view: false, edit: false };
    p['administration'] = { view: false, edit: false };
  }
  return p;
}


// ============================================================
// VAGUE 1 -- Permissions helpers + matricule uniqueness
// ============================================================
function _isAdmin() {
  var u = (typeof _currentUser === 'function') ? _currentUser() : null;
  return !!(u && u.role === 'admin');
}
function _canSeeAnnuaire() {
  if (_isAdmin()) return true;
  var u = (typeof _currentUser === 'function') ? _currentUser() : null;
  if (!u) return false;
  return !!(u.permissions && u.permissions.annuaire && u.permissions.annuaire.view);
}
function _canEditAnnuaire() {
  if (_isAdmin()) return true;
  var u = (typeof _currentUser === 'function') ? _currentUser() : null;
  if (!u) return false;
  return !!(u.permissions && u.permissions.annuaire && u.permissions.annuaire.edit);
}
function _canEditCommercialSignature() {
  if (_isAdmin()) return true;
  var u = (typeof _currentUser === 'function') ? _currentUser() : null;
  if (!u) return false;
  return !!(u.permissions && u.permissions._special && u.permissions._special.commercialSignature);
}
// Cross-scope matricule uniqueness (user + commercial + annuaire share one namespace)
function _isMatriculeUnique(matricule, ignoreId) {
  if (!matricule) return true;
  matricule = String(matricule).trim().toLowerCase();
  if (!matricule) return true;
  var _ignLower = ignoreId ? String(ignoreId).toLowerCase() : '';
  var collide = function(arr) {
    return (arr || []).some(function(x) {
      if (ignoreId) {
        if (x.id === ignoreId) return false;
        if (x.email && x.email.toLowerCase() === _ignLower) return false;
        if (x._fromUserId && x._fromUserId === ignoreId) return false;
      }
      return (x.matricule || '').toString().toLowerCase() === matricule;
    });
  };
  if (collide(APP.users)) return false;
  if (collide(APP.commerciaux)) return false;
  if (collide(APP.annuaire)) return false;
  return true;
}

// ============================================================
// VAGUE 3 -- Annuaire lookup helpers + bon role sig resolver
// ============================================================
function _lookupAnnuaireByName(name) {
  if (!name) return null;
  var tokens = String(name).trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  var list = (APP && APP.annuaire) || [];
  // Pass 1: all tokens must match (in any order) the union of prenom + nom tokens
  var hit = list.find(function(p) {
    var personTokens = ((p.prenom||'') + ' ' + (p.nom||'')).toLowerCase().split(/\s+/).filter(Boolean);
    if (personTokens.length !== tokens.length) return false;
    return tokens.every(function(t) { return personTokens.indexOf(t) !== -1; });
  });
  if (hit) return hit;
  // Pass 2: fallback -- match by single distinctive token (last word, often the family name)
  var lastToken = tokens[tokens.length - 1];
  return list.find(function(p) {
    return String(p.nom||'').toLowerCase() === lastToken
        || String(p.prenom||'').toLowerCase() === lastToken;
  }) || null;
}
// Resolve role -> {sig, matricule, name, personId}
// role: 'demandeur' | 'recipiendaire'
// Render only the validation date in the Réceptionnaire cell (no sig, no matricule)
function _renderBonReceptionnaireDate(bon) {
  if (!bon || bon.status !== 'validé') return '';
  var validatedAt = bon._validatedAt || 0;
  if (!validatedAt) return '';
  var d = new Date(validatedAt);
  var dStr = d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
  return '<div style="font-size:9px;color:#444;text-align:center;margin-top:2px">' + dStr + '</div>';
}
// Render the validator signature box (sig + date + matricule).
// Used by Gestionnaire de Stock (left) and Magasin (center) cells on all bons.
function _renderBonGestionnaireSigBox(bon) {
  if (!bon) return '';
  var sig = bon._validatedBySignature || '';
  var matricule = bon._validatedByMatricule || '';
  var name = bon._validatedByName || '';
  var validatedAt = bon._validatedAt || 0;
  // Live fallback (works for old validated bons whose snapshot was empty):
  // 0) If snapshot is fully empty, try to recover validator email from audit log
  if (!sig && !bon._validatedBy) {
    try {
      var ve = (APP.audit || [])
        .filter(function(a){ return a.entity==='bon' && a.entityId===bon.id && a.type==='VALIDATE'; })
        .sort(function(a,b){ return b.ts-a.ts; })[0];
      if (ve && ve.userEmail) {
        var luA = (APP.users || []).find(function(x){ return x.email && x.email.toLowerCase() === String(ve.userEmail).toLowerCase(); });
        if (luA) {
          if (luA.signatureKey && typeof _getSignature === 'function') sig = _getSignature(luA.signatureKey) || '';
          if (!sig && luA.signature) sig = luA.signature;
          if (!matricule) matricule = luA.matricule || '';
          if (!name) name = luA.name || '';
          if (!validatedAt && ve.ts) validatedAt = ve.ts;
        }
      }
    } catch(e) {}
  }
  // 1) Look up validator by stored email in APP.users -> resolve signatureKey via RTDB
  if (!sig && bon._validatedBy) {
    var lu = (APP.users || []).find(function(x) { return x.email && x.email.toLowerCase() === String(bon._validatedBy).toLowerCase(); });
    if (lu) {
      if (lu.signatureKey && typeof _getSignature === 'function') sig = _getSignature(lu.signatureKey) || '';
      if (!sig && lu.signature) sig = lu.signature;
      if (!matricule && lu.matricule) matricule = lu.matricule;
      if (!name) name = lu.name || '';
    }
  }
  // 2) Last resort: current user (for non-validated preview)
  if (!sig && bon.status !== 'validé') { var u = (typeof _currentUser==='function'?_currentUser():null); if (u) { sig = u.signature || ''; if (!name) name = u.name || ''; } }
  // Diagnostic: log when validated bon still has no sig
  if (!sig && bon.status === 'validé') {
    try { console.log('[PSM-SIG]', bon.numero, 'gestionnaire MISSING', { validatedBy: bon._validatedBy, hasMatricule: !!matricule }); } catch(e) {}
  }
  var out = '';
  if (sig) out += '<img src="' + sig + '" style="max-height:45px;display:block;margin:0 auto">';
  if (bon.status === 'validé') {
    if (validatedAt) {
      var d = new Date(validatedAt);
      var dStr = d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
      out += '<div style="font-size:9px;color:#444;text-align:center;margin-top:2px">' + dStr + '</div>';
    }
    var _poLabel = matricule || name || '';
    if (_poLabel) {
      out += '<div style="font-size:10px;color:#111;text-align:center;margin-top:1px;font-family:monospace;font-weight:700;letter-spacing:1px">Po. ' + _poLabel + '</div>';
    }
  }
  return out;
}
// Commercial signature pad lifecycle (Phase 7)
var _comSigPadAPI = null;
function _comPreviewSigFile(input) {
  var f = input.files && input.files[0]; if (!f) return;
  var r = new FileReader();
  r.onload = function(e) {
    var dataUrl = e.target.result;
    var dataEl = document.getElementById('com-sig-data');
    var clrEl = document.getElementById('com-sig-cleared');
    var prev = document.getElementById('com-sig-preview');
    if (dataEl) dataEl.value = dataUrl;
    if (clrEl) clrEl.value = '0';
    if (prev) prev.innerHTML = '<img src="' + dataUrl + '" style="max-width:160px;max-height:60px;object-fit:contain">';
  };
  r.readAsDataURL(f);
}
function _comToggleDraw() {
  var wrap = document.getElementById('com-sig-canvas-wrap');
  if (!wrap) return;
  if (wrap.style.display === 'none' || wrap.style.display === '') {
    wrap.style.display = 'block';
    if (!_comSigPadAPI) {
      var canvas = document.getElementById('com-sig-canvas');
      if (canvas && typeof _initSignaturePad === 'function') {
        _comSigPadAPI = _initSignaturePad(canvas);
      }
    }
  } else {
    wrap.style.display = 'none';
  }
}
function _comClearCanvas() {
  if (_comSigPadAPI && _comSigPadAPI.clear) _comSigPadAPI.clear();
}
function _comValidateCanvas() {
  if (!_comSigPadAPI) return;
  if (_comSigPadAPI.isEmpty && _comSigPadAPI.isEmpty()) { notify('Signature vide', 'warning'); return; }
  var dataUrl = _comSigPadAPI.toDataUrl();
  document.getElementById('com-sig-data').value = dataUrl;
  document.getElementById('com-sig-cleared').value = '0';
  var prev = document.getElementById('com-sig-preview');
  if (prev) prev.innerHTML = '<img src="' + dataUrl + '" style="max-width:160px;max-height:60px;object-fit:contain">';
  document.getElementById('com-sig-canvas-wrap').style.display = 'none';
  notify('Signature captur\u00e9e \u2713', 'success');
}
function _comClearSig() {
  document.getElementById('com-sig-data').value = '';
  document.getElementById('com-sig-cleared').value = '1';
  var prev = document.getElementById('com-sig-preview');
  if (prev) prev.innerHTML = '<span style="font-size:11px;color:#888">Aucune (sera retir\u00e9e)</span>';
}

function _findUserIdByEmail(email) {
  if (!email) return null;
  var u = (APP.users||[]).find(function(x) { return x.email && x.email.toLowerCase() === email.toLowerCase(); });
  return u ? u.id : null;
}

function _watchPresence() {
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) return;
  // Detach any prior listener attached on previous render
  try { _firebaseDB.ref('profiles').off('value', _watchPresence._cb); } catch(e) {}
  _watchPresence._cb = function(snap) {
    if (!snap || !snap.exists()) return;
    var data = snap.val() || {};
    // Build email -> {online, lastSeen} map
    var byEmail = {};
    Object.keys(data).forEach(function(uid) {
      var p = data[uid] || {};
      if (p.email) byEmail[String(p.email).toLowerCase()] = { online: p.online === true, lastSeen: p.lastSeen };
    });
    // Update each local user's dot
    (APP.users || []).forEach(function(uu) {
      var info = uu.email ? byEmail[String(uu.email).toLowerCase()] : null;
      var dot = document.getElementById('presence-dot-' + uu.id);
      if (!dot) return;
      var isOnline = info && info.online;
      dot.style.background = isOnline ? '#22c55e' : '#6b7280';
      dot.title = isOnline
        ? 'En ligne'
        : (info && info.lastSeen
            ? ('Vu le ' + (typeof fmtDateTime === 'function' ? fmtDateTime(info.lastSeen) : new Date(info.lastSeen).toLocaleString()))
            : 'Hors ligne');
    });
  };
  _firebaseDB.ref('profiles').on('value', _watchPresence._cb);
}

function renderAdminPage() {
  var u = _currentUser();
  var role = (typeof _userProfile !== 'undefined' && _userProfile && _userProfile.role) || (u && u.role);
  if (!u || role !== 'admin') return '<div class="empty-state"><p>\u26d4 R\u00e9serv\u00e9 aux administrateurs</p></div>';

  var users = APP.users || [];
  var onlineStatus = (typeof _cloudUser !== 'undefined' && _cloudUser)
    ? '<span style="color:#22c55e">\u25cf En ligne</span> (' + _cloudUser.email + ')'
    : '<span style="color:#f59e0b">\u25cf Mode hors ligne</span>';

  var userCards = users.map(function(uu) {
    var roleMeta = ROLE_TEMPLATES[uu.role] || ROLE_TEMPLATES.custom;
    var lastActivity = '';
    if (APP._activityLog) {
      var entry = APP._activityLog.slice().reverse().find(function(e) { return e.email === uu.email || e.user === uu.name; });
      if (entry) lastActivity = '<div style="font-size:10px;color:var(--text-3);margin-top:2px">Derni\u00e8re activit\u00e9: ' + fmtDateTime(entry.ts) + '</div>';
    }
    return '<div class="card" style="padding:16px;margin-bottom:8px">'
      + '<div style="display:flex;align-items:center;gap:14px">'
      + '<div style="width:48px;height:48px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--accent);overflow:hidden;flex-shrink:0">'
      + (uu.photo ? '<img src="' + uu.photo + '" style="width:48px;height:48px;object-fit:cover;border-radius:50%">' : uu.name.charAt(0).toUpperCase())
      + '</div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="font-weight:700;font-size:14px">' + uu.name + (uu.id === u.id ? ' <span style="font-size:10px;color:var(--accent)">(vous)</span>' : '') + ' <span id="presence-dot-' + uu.id + '" style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#6b7280;margin-left:4px;vertical-align:middle" title="Hors ligne"></span></div>'
      + '<div style="font-size:12px;color:var(--text-2)">' + (uu.email || '\u2014') + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">'
      + '<span style="font-size:10px;background:' + roleMeta.color + '22;color:' + roleMeta.color + ';padding:2px 8px;border-radius:99px;border:1px solid ' + roleMeta.color + '44">' + roleMeta.label + '</span>'
      + (uu.signature ? '<span style="font-size:10px;color:var(--success)">\u2713 Signature</span>' : '<span style="font-size:10px;color:var(--text-3)">Pas de signature</span>')
      + '</div>'
      + lastActivity
      + '</div>'
      + '<div style="display:flex;gap:6px">'
      + '<button class="btn btn-sm btn-secondary" onclick="openUserModal(\'' + (uu.email||'').replace(/'/g, "\\'") + '\')" title="Modifier">\u270f</button>'
      + (uu.role !== 'admin' ? '<button class="btn btn-sm btn-secondary" onclick="_confirmDeleteUser(\'' + (uu.email||'').replace(/'/g, "\\'") + '\')" title="Supprimer" style="color:var(--danger)">\u2716</button>' : '')
      + '</div>'
      + '</div></div>';
  }).join('');

  return '<div class="page-content" style="max-width:900px;margin:0 auto">'
    + '<div class="card" style="padding:20px;margin-bottom:16px">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">'
    + '<div><h2 style="margin:0;font-size:20px">\ud83d\udee1\ufe0f Administration</h2>'
    + '<p style="margin:4px 0 0;font-size:12px;color:var(--text-2)">G\u00e9rez les comptes, r\u00f4les et permissions</p></div>'
    + '<div style="font-size:12px">' + onlineStatus + '</div>'
    + '</div></div>'
    + '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">'
    + '<button class="btn btn-primary" onclick="openUserModal()">+ Nouvel utilisateur</button>'

    + '<button class="btn btn-secondary" onclick="_showActivityLog()">\ud83d\udccb Journal d\'activit\u00e9</button>'
    + '</div>'
    + '<div class="card" style="padding:16px;margin-bottom:16px">'
    + '<div class="card-header" style="margin-bottom:12px"><span class="card-title">\ud83d\udc65 Comptes (' + users.length + ')</span></div>'
    + userCards
    + '</div>'
    + '<div class="card" style="padding:16px">'
    + '<div class="card-header" style="margin-bottom:12px"><span class="card-title">\ud83c\udfad R\u00f4les disponibles</span></div>'
    + '<div style="display:grid;gap:8px">'
    + Object.keys(ROLE_TEMPLATES).map(function(k) {
      var r = ROLE_TEMPLATES[k];
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-2);border-radius:8px">'
        + '<span style="width:10px;height:10px;border-radius:50%;background:' + r.color + '"></span>'
        + '<span style="font-weight:600;font-size:13px;min-width:120px">' + r.label + '</span>'
        + '<span style="font-size:12px;color:var(--text-2)">' + r.desc + '</span>'
        + '</div>';
    }).join('')
    + '</div></div>'
    + '</div>';
}

function _initAdminPage() {
  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser && typeof _adminGetAllProfiles === 'function') {
    _adminGetAllProfiles().then(function(profiles) {
      if (profiles && profiles.length > 0) {
        profiles.forEach(function(p) {
          if (typeof _syncProfileToLocal !== 'function') return;
          // Only refresh fields of locally-known users. Do NOT re-create a user
          // that has been deleted locally (prevents zombie profiles from reappearing).
          var email = p && p.email;
          if (!email) return;
          var existsLocal = (APP.users || []).some(function(u) { return u.email && u.email.toLowerCase() === email.toLowerCase(); });
          if (existsLocal) _syncProfileToLocal(p);
        });
      }
    }).catch(function() {});
  }
}

function _adminCreateSupabaseAccount() {
  if (typeof _firebaseAuth === 'undefined' || !_firebaseAuth) {
    notify('Connexion Firebase requise.', 'warning');
    return;
  }
  if (typeof _cloudUser === 'undefined' || !_cloudUser) {
    notify('Vous devez \u00eatre connect\u00e9 pour cr\u00e9er des comptes.', 'warning');
    return;
  }

  var roleOpts = Object.keys(ROLE_TEMPLATES).map(function(k) {
    return '<option value="' + k + '">' + ROLE_TEMPLATES[k].label + '</option>';
  }).join('');

  openModal('Cr\u00e9er un compte en ligne', ''
    + '<div class="form-row">'
    + '<div class="form-group"><label>Nom complet *</label><input id="ac-name" placeholder="Ex: Kouam\u00e9 Jean"></div>'
    + '<div class="form-group"><label>Email *</label><input id="ac-email" type="email" placeholder="jean@gma.ci"></div>'
    + '</div>'
    + '<div class="form-row">'
    + '<div class="form-group"><label>Mot de passe *</label><input id="ac-pass" type="text" placeholder="Min. 6 caract\u00e8res" value="' + _generateTempPassword() + '"></div>'
    + '<div class="form-group"><label>R\u00f4le</label><select id="ac-role" onchange="_adminPreviewPerms(this.value)">' + roleOpts + '</select></div>'
    + '</div>'
    + '<div id="ac-perms-preview" style="margin-top:8px"></div>'
    + '<div style="margin-top:12px;padding:10px;background:var(--bg-3);border-radius:8px;font-size:12px;color:var(--text-2)">'
    + '\u2139\ufe0f Le mot de passe est visible pour que vous puissiez le communiquer. Il pourra le changer plus tard.'
    + '</div>'
  , [
    { label: 'Annuler', cls: 'btn-secondary', onclick: 'closeModal()' },
    { label: '\u2601 Cr\u00e9er le compte', cls: 'btn-primary', onclick: '_doCreateSupabaseAccount()' }
  ]);
  _adminPreviewPerms('admin');
}

function _generateTempPassword() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  var pass = '';
  for (var i = 0; i < 10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
  return pass;
}

function _adminPreviewPerms(role) {
  var el = document.getElementById('ac-perms-preview');
  if (!el) return;
  var perms = _getDefaultPerms(role);
  if (role === 'admin') { el.innerHTML = '<div style="color:var(--success);font-size:12px">\u2705 Acc\u00e8s total</div>'; return; }
  var html = '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px">Permissions :</label>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px">';
  ALL_PAGES_PERMS.forEach(function(pg) {
    var p = perms[pg.id] || {};
    var v = p.view ? '\u2705' : '\u274c';
    var e = p.edit ? '\u270f' : '\u2014';
    html += '<div style="padding:3px 6px;background:var(--bg-3);border-radius:4px">' + pg.label + ' ' + v + ' ' + e + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

async function _doCreateSupabaseAccount() {
  var name = document.getElementById('ac-name').value.trim();
  var email = document.getElementById('ac-email').value.trim();
  var pass = document.getElementById('ac-pass').value;
  var role = document.getElementById('ac-role').value;

  if (!name || !email || !pass) { notify('Remplissez tous les champs obligatoires', 'warning'); return; }
  if (pass.length < 6) { notify('Mot de passe: 6 caract\u00e8res minimum', 'warning'); return; }

  var perms = _getDefaultPerms(role);

  try {
    notify('Cr\u00e9ation du compte...', 'info');
    if (typeof _adminCreateSupabaseUser === 'function') {
      await _adminCreateSupabaseUser(email, pass, name, role, perms);
    }
    if (!APP.users) APP.users = [];
    var existing = APP.users.find(function(u) { return u.email === email; });
    if (!existing) {
      APP.users.push({
        id: generateId(), name: name, email: email, password: null,
        role: role, photo: null, signature: null, permissions: perms,
        createdAt: Date.now(), _version: 1
      });
    }
    saveDB();
    closeModal();
    notify('\u2705 Compte cr\u00e9\u00e9 pour ' + name, 'success');
    showPage('administration');
  } catch(err) {
    var msg = err.message || String(err);
    if (msg.includes('already registered')) msg = 'Cet email est d\u00e9j\u00e0 utilis\u00e9';
    notify('\u274c ' + msg, 'error');
  }
}

async function _confirmDeleteUser(uid) {
  // Accept either ID or email
  var user = (APP.users || []).find(function(u) { return u.id === uid; });
  if (!user) user = (APP.users || []).find(function(u) { return u.email && u.email.toLowerCase() === uid.toLowerCase(); });
  if (!user) return;
  if (!confirm('Supprimer "' + user.name + '" ? Cette action est irr\u00e9versible.')) return;
  var userEmail = user.email;

  // Remove from local
  APP.users = APP.users.filter(function(u) { return u.id !== uid; });

  // Update UI immediately (no full page re-render)
  var cardEl = document.querySelector('[onclick*="' + uid + '"]');
  if (cardEl) {
    var card = cardEl.closest('.card');
    if (card) {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity = '0';
      card.style.transform = 'translateX(20px)';
      setTimeout(function() { card.remove(); }, 300);
    }
  }
  // Update count
  var countEl = document.querySelector('.card-title');
  if (countEl && countEl.textContent.includes('Comptes')) {
    countEl.textContent = '\uD83D\uDC65 Comptes (' + (APP.users||[]).length + ')';
  }

  // Delete from Firebase profile
  if (userEmail && typeof _firebaseDB !== 'undefined' && _firebaseDB) {
    try {
      var snap = await _firebaseDB.ref('profiles').orderByChild('email').equalTo(userEmail).once('value');
      if (snap.exists()) {
        var updates = {};
        Object.keys(snap.val()).forEach(function(k) { updates[k] = null; });
        await _firebaseDB.ref('profiles').update(updates);
      }
    } catch(e) {
      console.warn('[PSM] Firebase profile delete:', e);
      if (typeof notify === 'function') notify('⚠ Profil cloud non supprimé pour ' + userEmail + ' — réessayer (sinon le compte peut réapparaitre)', 'error');
    }
  }

  // Save to cloud and wait
  APP._ts = Date.now();
  _invalidatePageCache();
  try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
  if (typeof _doSaveToCloud === 'function') {
    try { await _doSaveToCloud(); } catch(e) {}
  }
  if (typeof logActivity === 'function') logActivity('admin_delete_user', 'Suppression: ' + userEmail);
  notify('Utilisateur supprim\u00e9', 'success');
}

function _showActivityLog() {
  var logs = (APP._activityLog || []).slice().reverse();
  var html = '';

  // Online/Offline status section
  html += '<div style="margin-bottom:16px;padding:12px;background:var(--bg-2);border-radius:8px">';
  html += '<div style="font-weight:700;font-size:13px;margin-bottom:8px;color:var(--text-1)"><i class="fa-solid fa-circle-nodes" style="margin-right:6px;color:var(--accent)"></i>Statut des comptes</div>';
  html += '<div id="al-presence-list" style="display:flex;flex-wrap:wrap;gap:10px">';
  var users = APP.users || [];
  users.forEach(function(uu) {
    html += '<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border)">'
      + '<span id="al-dot-' + uu.id + '" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#6b7280"></span>'
      + '<span style="font-size:12px;font-weight:600">' + (uu.name || uu.email) + '</span>'
      + '<span id="al-status-' + uu.id + '" style="font-size:10px;color:var(--text-2)">...</span>'
      + '</div>';
  });
  html += '</div></div>';

  // Connection/disconnection logs
  html += '<div style="max-height:50vh;overflow-y:auto">';
  var connLogs = logs.filter(function(l) { return l.action === 'login' || l.action === 'logout'; });
  var otherLogs = logs.filter(function(l) { return l.action !== 'login' && l.action !== 'logout'; });

  if (connLogs.length > 0) {
    html += '<div style="font-weight:700;font-size:13px;margin-bottom:8px;color:var(--text-1)"><i class="fa-solid fa-right-to-bracket" style="margin-right:6px;color:var(--accent2,#2563eb)"></i>Connexions / D\u00e9connexions</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px">'
      + '<thead><tr style="background:var(--bg-2)"><th style="text-align:left;padding:6px">Date & Heure</th><th style="text-align:left;padding:6px">Utilisateur</th><th style="text-align:left;padding:6px">Action</th><th style="text-align:left;padding:6px">D\u00e9tails</th></tr></thead><tbody>';
    connLogs.slice(0, 50).forEach(function(l) {
      var isLogin = l.action === 'login';
      html += '<tr style="border-top:1px solid var(--border)">'
        + '<td style="padding:6px;white-space:nowrap;font-family:monospace;font-size:11px">' + fmtDateTime(l.ts) + '</td>'
        + '<td style="padding:6px;font-weight:600">' + (l.user || l.email || '\u2014') + '</td>'
        + '<td style="padding:6px"><span class="badge" style="background:' + (isLogin ? 'var(--success,#22c55e)' : 'var(--danger,#ef4444)') + '22;color:' + (isLogin ? 'var(--success,#22c55e)' : 'var(--danger,#ef4444)') + '">' + (isLogin ? '\u25b2 Connexion' : '\u25bc D\u00e9connexion') + '</span></td>'
        + '<td style="padding:6px;color:var(--text-2);font-size:11px">' + (l.details || '') + '</td></tr>';
    });
    html += '</tbody></table>';
  }

  if (otherLogs.length > 0) {
    html += '<div style="font-weight:700;font-size:13px;margin-bottom:8px;color:var(--text-1)"><i class="fa-solid fa-list" style="margin-right:6px;color:var(--warning)"></i>Autres activit\u00e9s</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:12px">'
      + '<thead><tr style="background:var(--bg-2)"><th style="text-align:left;padding:6px">Date & Heure</th><th style="text-align:left;padding:6px">Utilisateur</th><th style="text-align:left;padding:6px">Action</th><th style="text-align:left;padding:6px">D\u00e9tails</th></tr></thead><tbody>';
    otherLogs.slice(0, 100).forEach(function(l) {
      html += '<tr style="border-top:1px solid var(--border)">'
        + '<td style="padding:6px;white-space:nowrap;font-family:monospace;font-size:11px">' + fmtDateTime(l.ts) + '</td>'
        + '<td style="padding:6px">' + (l.user || l.email || '\u2014') + '</td>'
        + '<td style="padding:6px"><span class="badge">' + l.action + '</span></td>'
        + '<td style="padding:6px;color:var(--text-2);font-size:11px">' + (l.details || '') + '</td></tr>';
    });
    html += '</tbody></table>';
  }

  if (logs.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-3)">Aucune activit\u00e9 enregistr\u00e9e</div>';
  }
  html += '</div>';

  openModal('Journal d\'activit\u00e9', html, [
    { label: 'Fermer', cls: 'btn-secondary', onclick: 'closeModal()' }
  ]);

  // ── Real-time presence + activity_log subscription (Firebase) ──
  var _alPresenceCb = null;
  var _alActivityCb = null;
  var _alSeenKeys = {}; // dedupe activity_log keys

  function _alUpdatePresence(data) {
    var byEmail = {};
    Object.keys(data || {}).forEach(function(uid) {
      var p = (data || {})[uid] || {};
      if (p.email) byEmail[String(p.email).toLowerCase()] = { online: p.online === true, lastSeen: p.lastSeen };
    });
    (APP.users || []).forEach(function(uu) {
      var info = uu.email ? byEmail[String(uu.email).toLowerCase()] : null;
      var dot = document.getElementById('al-dot-' + uu.id);
      var stat = document.getElementById('al-status-' + uu.id);
      if (!dot || !stat) return;
      var isOnline = info && info.online;
      dot.style.background = isOnline ? '#22c55e' : '#6b7280';
      stat.textContent = isOnline
        ? 'En ligne'
        : (info && info.lastSeen ? ('Vu ' + fmtDateTime(info.lastSeen)) : 'Hors ligne');
      stat.style.color = isOnline ? '#22c55e' : 'var(--text-2)';
    });
  }

  function _alAppendActivityRow(l) {
    // l: { user_email, action, details, created_at }
    var ts = l.created_at ? new Date(l.created_at).getTime() : Date.now();
    var isLogin = l.action === 'login' || l.action === 'logout';
    // Pick the right table: connections or autres activites
    var tables = document.querySelectorAll('#active-modal table');
    if (!tables.length) return;
    var targetTbody = null;
    if (isLogin && tables[0]) targetTbody = tables[0].querySelector('tbody');
    else if (!isLogin && tables[1]) targetTbody = tables[1].querySelector('tbody');
    else if (tables[0]) targetTbody = tables[0].querySelector('tbody');
    if (!targetTbody) return;
    var row = document.createElement('tr');
    row.style.borderTop = '1px solid var(--border)';
    row.style.background = 'rgba(34,197,94,.07)';
    if (isLogin) {
      var loginBadge = '<span class="badge" style="background:' + (l.action==='login'?'rgba(34,197,94,.2);color:#22c55e':'rgba(239,68,68,.2);color:#ef4444') + '">' + (l.action==='login'?'\u25b2 Connexion':'\u25bc D\u00e9connexion') + '</span>';
      row.innerHTML = '<td style="padding:6px;white-space:nowrap;font-family:monospace;font-size:11px">' + fmtDateTime(ts) + '</td>'
        + '<td style="padding:6px;font-weight:600">' + (l.user_email || '\u2014') + '</td>'
        + '<td style="padding:6px">' + loginBadge + '</td>'
        + '<td style="padding:6px;color:var(--text-2);font-size:11px">' + (l.details || '') + '</td>';
    } else {
      row.innerHTML = '<td style="padding:6px;white-space:nowrap;font-family:monospace;font-size:11px">' + fmtDateTime(ts) + '</td>'
        + '<td style="padding:6px">' + (l.user_email || '\u2014') + '</td>'
        + '<td style="padding:6px"><span class="badge">' + l.action + '</span></td>'
        + '<td style="padding:6px;color:var(--text-2);font-size:11px">' + (l.details || '') + '</td>';
    }
    targetTbody.insertBefore(row, targetTbody.firstChild);
    // Fade highlight back to normal
    setTimeout(function() { row.style.transition = 'background 1.2s'; row.style.background = 'transparent'; }, 80);
  }

  if (typeof _firebaseDB !== 'undefined' && _firebaseDB) {
    // Presence: live listener
    _alPresenceCb = function(snap) { _alUpdatePresence(snap.val() || {}); };
    _firebaseDB.ref('profiles').on('value', _alPresenceCb);

    // Activity log: prime with last 100 then subscribe to child_added
    _firebaseDB.ref('activity_log').orderByChild('created_at').limitToLast(100).once('value').then(function(snap) {
      var entries = [];
      snap.forEach(function(c) { _alSeenKeys[c.key] = true; entries.push(c.val()); });
      // entries are oldest->newest in snap order; render so newest ends up on top
      entries.forEach(function(l) { if (l) _alAppendActivityRow(l); });
      // Now subscribe to new ones
      _alActivityCb = function(c) {
        if (_alSeenKeys[c.key]) return;
        _alSeenKeys[c.key] = true;
        var l = c.val(); if (l) _alAppendActivityRow(l);
      };
      _firebaseDB.ref('activity_log').orderByChild('created_at').limitToLast(50).on('child_added', _alActivityCb);
    }).catch(function() {});
  }

  // Register cleanup so listeners detach when the modal closes
  window._modalCloseCleanup = function() {
    try { if (_firebaseDB && _alPresenceCb) _firebaseDB.ref('profiles').off('value', _alPresenceCb); } catch(e) {}
    try { if (_firebaseDB && _alActivityCb) _firebaseDB.ref('activity_log').off('child_added', _alActivityCb); } catch(e) {}
    _alPresenceCb = null; _alActivityCb = null; _alSeenKeys = {};
  };
}

// ============================================================
// CALENDAR PAGE — Monthly / Weekly / Daily views
// ============================================================
let _calView = 'month';
let _calDate = new Date();

function renderCalendar() {
  const c = document.getElementById('content'); if(!c) return;
  const y = _calDate.getFullYear(), m = _calDate.getMonth();
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  c.innerHTML = `
  <div class="page-header">
    <div>
      <div class="page-title">\uD83D\uDCC5 Calendrier des Mouvements</div>
      <div class="page-sub">Suivi des mouvements, planning de distribution et rappels</div>
    </div>
    <div class="flex-center gap-8" style="flex-wrap:wrap">
      ${['month','week','day'].map(v => `<button class="btn btn-sm ${_calView===v?'btn-primary':'btn-secondary'}" onclick="_calView='${v}';renderCalendar()">${v==='month'?'Mois':v==='week'?'Semaine':'Jour'}</button>`).join('')}
    </div>
  </div>
  <div class="card" style="margin-bottom:16px">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 4px">
      <button class="btn btn-sm btn-secondary" onclick="calNav(-1)">\u25c0 Précédent</button>
      <div style="font-size:16px;font-weight:700;color:var(--text-1)" id="cal-title">${monthNames[m]} ${y}</div>
      <div class="flex-center gap-8">
        <button class="btn btn-sm btn-secondary" onclick="_calDate=new Date();renderCalendar()">Aujourd'hui</button>
        <button class="btn btn-sm btn-secondary" onclick="calNav(1)">Suivant \u25b6</button>
      </div>
    </div>
  </div>
  <div id="cal-body"></div>`;
  if(_calView === 'month') renderCalMonth();
  else if(_calView === 'week') renderCalWeek();
  else renderCalDay();
}

function calNav(dir) {
  if(_calView === 'month') _calDate.setMonth(_calDate.getMonth() + dir);
  else if(_calView === 'week') _calDate.setDate(_calDate.getDate() + 7 * dir);
  else _calDate.setDate(_calDate.getDate() + dir);
  renderCalendar();
}

function _calMvtForDay(year, month, day) {
  const start = new Date(year, month, day).getTime();
  const end = start + 86400000;
  return APP.mouvements.filter(m => m.ts >= start && m.ts < end);
}

function renderCalMonth() {
  const y = _calDate.getFullYear(), m = _calDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // Monday=0
  const today = new Date(); const isThisMonth = today.getFullYear()===y && today.getMonth()===m;
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  let html = '<div class="cal-grid-header">' + dayNames.map(d=>'<div class="cal-weekday">'+d+'</div>').join('') + '</div><div class="cal-grid">';
  for(let i=0;i<startOffset;i++) html += '<div class="cal-cell cal-empty"></div>';
  for(let d=1;d<=daysInMonth;d++) {
    const mvts = _calMvtForDay(y,m,d);
    const isToday = isThisMonth && today.getDate()===d;
    const entrees = mvts.filter(mv=>mv.type==='entree').reduce((s,mv)=>s+mv.qty,0);
    const sorties = mvts.filter(mv=>mv.type==='sortie').reduce((s,mv)=>s+mv.qty,0);
    const hasData = mvts.length>0;
    html += `<div class="cal-cell${isToday?' today':''}${hasData?' has-data':''}" ${hasData?'onclick="calShowDay('+y+','+m+','+d+')"':''} style="--vol-intensity:${Math.min(1,mvts.length/10)}">
      <div class="cal-day-num">${d}</div>
      ${hasData?`<div class="cal-indicators">
        ${entrees>0?'<span class="cal-dot" style="background:var(--success)" title="Entrées: +'+entrees+'"></span>':''}
        ${sorties>0?'<span class="cal-dot" style="background:var(--accent3)" title="Sorties: -'+sorties+'"></span>':''}
      </div><div class="cal-vol">${mvts.length}</div>`:''}
    </div>`;
  }
  html += '</div>';
  document.getElementById('cal-body').innerHTML = html;
}

function renderCalWeek() {
  const d = new Date(_calDate);
  const dayOfWeek = (d.getDay()+6)%7; // Mon=0
  d.setDate(d.getDate()-dayOfWeek);
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const today = new Date();
  let html = '<div class="grid-1" style="display:flex;flex-direction:column;gap:8px">';
  for(let i=0;i<7;i++) {
    const dd = new Date(d); dd.setDate(d.getDate()+i);
    const mvts = _calMvtForDay(dd.getFullYear(),dd.getMonth(),dd.getDate());
    const isToday = dd.toDateString()===today.toDateString();
    const entrees = mvts.filter(mv=>mv.type==='entree').reduce((s,mv)=>s+mv.qty,0);
    const sorties = mvts.filter(mv=>mv.type==='sortie').reduce((s,mv)=>s+mv.qty,0);
    html += `<div class="card" style="${isToday?'border-left:3px solid var(--accent)':''};padding:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div><span style="font-weight:700;font-size:14px">${dayNames[i]}</span> <span style="color:var(--text-2)">${dd.getDate()}/${dd.getMonth()+1}/${dd.getFullYear()}</span>${isToday?' <span class="badge badge-blue" style="font-size:10px">Aujourd\'hui</span>':''}</div>
        <div style="display:flex;gap:12px;font-size:13px">
          ${entrees>0?'<span style="color:var(--success);font-weight:600">+'+entrees+' entr\u00e9es</span>':''}
          ${sorties>0?'<span style="color:var(--accent3);font-weight:600">-'+sorties+' sorties</span>':''}
          ${mvts.length===0?'<span style="color:var(--text-3)">Aucun mouvement</span>':''}
        </div>
      </div>
      ${mvts.length>0?'<div style="font-size:12px;color:var(--text-2)">'+mvts.slice(0,5).map(mv=>'<div style="padding:2px 0">'+(mv.type==='entree'?'<span style="color:var(--success)">+'+mv.qty+'</span>':'<span style="color:var(--accent3)">-'+mv.qty+'</span>')+' '+mv.articleName+(mv.note?' — <em>'+mv.note+'</em>':'')+'</div>').join('')+(mvts.length>5?'<div style="color:var(--text-3);font-style:italic">... '+(mvts.length-5)+' autres</div>':'')+'</div>':''}
    </div>`;
  }
  html += '</div>';
  const titleEl = document.getElementById('cal-title');
  if(titleEl) {
    const endWeek = new Date(d); endWeek.setDate(d.getDate()+6);
    titleEl.textContent = 'Semaine du '+d.getDate()+'/'+(d.getMonth()+1)+' au '+endWeek.getDate()+'/'+(endWeek.getMonth()+1)+'/'+endWeek.getFullYear();
  }
  document.getElementById('cal-body').innerHTML = html;
}

function renderCalDay() {
  const d = _calDate;
  const mvts = _calMvtForDay(d.getFullYear(),d.getMonth(),d.getDate()).sort((a,b)=>a.ts-b.ts);
  const isToday = d.toDateString()===new Date().toDateString();
  const entrees = mvts.filter(mv=>mv.type==='entree').reduce((s,mv)=>s+mv.qty,0);
  const sorties = mvts.filter(mv=>mv.type==='sortie').reduce((s,mv)=>s+mv.qty,0);
  const titleEl = document.getElementById('cal-title');
  const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  if(titleEl) titleEl.textContent = dayNames[d.getDay()]+' '+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
  let html = `<div class="grid-3 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">Mouvements</span></div><div class="kpi-value" style="color:var(--accent)">${mvts.length}</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Entr\u00e9es</span></div><div class="kpi-value" style="color:var(--success)">+${entrees}</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Sorties</span></div><div class="kpi-value" style="color:var(--accent3)">-${sorties}</div></div>
  </div>`;
  if(mvts.length===0) {
    html += '<div class="card"><div class="empty-state"><p>Aucun mouvement ce jour</p></div></div>';
  } else {
    html += '<div class="card"><div class="card-header"><span class="card-title">D\u00e9tail des mouvements</span></div><div class="table-wrap"><table><thead><tr><th>Heure</th><th>Type</th><th>Gadget</th><th style="text-align:center">Qt\u00e9</th><th>Note</th><th>Actions</th></tr></thead><tbody>';
    mvts.forEach(m => {
      const t = new Date(m.ts);
      const time = String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
      html += '<tr><td>'+time+'</td><td><span class="badge '+(m.type==='entree'?'badge-green">Entr\u00e9e':'badge-orange">Sortie')+'</span></td><td style="font-weight:600">'+m.articleName+'</td><td style="text-align:center;font-weight:700">'+(m.type==='entree'?'+':'-')+m.qty+'</td><td style="color:var(--text-2)">'+(m.note||'')+'</td><td><button class="btn btn-sm" style="color:var(--danger);font-size:10px" onclick="undoMouvement('+'\''+m.id+'\''+')" title="Annuler">\u21A9</button></td></tr>';
    });
    html += '</tbody></table></div></div>';
  }
  document.getElementById('cal-body').innerHTML = html;
}

function calShowDay(y, m, d) {
  _calDate = new Date(y, m, d);
  _calView = 'day';
  renderCalendar();
}

// ═══════════════════════════════════════════════════════════════════════
// NEEDS-BASED DISPATCH ENGINE v2
// 3-pass allocation: minimums → targets (weighted) → caps
// Supports commercials + non-commercial entities (UCAB, Export, etc.)
// ═══════════════════════════════════════════════════════════════════════

// ============================================================
// DISPATCH MODULE v3
// Logic: Part = (PDV commercial / PDV total) x 100
//        Pool per gadget configurable, eligibility per commercial
//        100% of pool always distributed among eligible commercials
// ============================================================

function _dispEnsure() {
  if (!APP.dispatch) APP.dispatch = {};
  const D = APP.dispatch;
  if (!D.pools)       D.pools = {};
  if (!D.eligibility) D.eligibility = {};
  if (!D.fixedAlloc)  D.fixedAlloc = {};
  if (!D.history)     D.history = [];
  if (!D.splitRatio)  D.splitRatio = { com: 90, ann: 10 };
  return D;
}

// Lit le split commerciaux/annuaire (0-100). Annuaire = 100 - com.
function dispGetSplit() {
  _dispEnsure();
  var s = APP.dispatch.splitRatio || { com: 90, ann: 10 };
  var com = Math.max(0, Math.min(100, parseInt(s.com) || 0));
  return { com: com, ann: 100 - com };
}

function dispSetSplit(comPct) {
  _dispEnsure();
  var c = Math.max(0, Math.min(100, parseInt(comPct) || 0));
  APP.dispatch.splitRatio = { com: c, ann: 100 - c };
  saveDB();
}

// Liste des personnes de l'annuaire concernees par le dispatch (ordre alphabetique stable)
// Exclut les homonymes d'un commercial actif (email OU matricule) pour eviter
// la double-attribution dans le dispatch.
function _dispActiveAnnuaire() {
  var actCom = (APP.commerciaux || []).filter(function(c){ return c.actif !== false && c.dispatchActive !== false; });
  var comEmails = new Set(actCom.map(function(c){ return (c.email||'').trim().toLowerCase(); }).filter(Boolean));
  var comMats = new Set(actCom.map(function(c){ return (c.matricule||'').trim().toLowerCase(); }).filter(Boolean));
  return (APP.annuaire || []).filter(function(p) {
      if (!p.includeDispatch) return false;
      var pe = (p.email||'').trim().toLowerCase();
      var pm = (p.matricule||'').trim().toLowerCase();
      if (pe && comEmails.has(pe)) return false;
      if (pm && comMats.has(pm)) return false;
      return true;
    })
    .slice().sort(function(a, b) {
      var an = ((a.nom||'') + ' ' + (a.prenom||'')).trim().toLowerCase();
      var bn = ((b.nom||'') + ' ' + (b.prenom||'')).trim().toLowerCase();
      if (an < bn) return -1;
      if (an > bn) return 1;
      return (a.id || '').localeCompare(b.id || '');
    });
}

function _dispActiveCommerciaux() {
  return (APP.commerciaux || []).filter(function(c) { return c.actif !== false && c.dispatchActive !== false; });
}

// Real PDV count: only APP.pdv assigned to this commercial (no fallback)
function _dispGetPdv(c) {
  return (APP.pdv || []).filter(function(p) { return p.commercialId === c.id && p.actif !== false; }).length;
}

function _dispTotalPdv() {
  return _dispActiveCommerciaux().reduce(function(s, c) { return s + _dispGetPdv(c); }, 0) || 1;
}

// Returns { [comId]: { name, pdv, pct } } for all active commercials
function _dispShares() {
  var total = _dispTotalPdv();
  var out = {};
  _dispActiveCommerciaux().forEach(function(c) {
    var pdv = _dispGetPdv(c);
    var name = ((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.name || c.id;
    out[c.id] = { name: name, pdv: pdv, pct: (pdv / total) * 100 };
  });
  return out;
}

function dispGetPool(articleId) {
  _dispEnsure();
  return APP.dispatch.pools[articleId] || 0;
}

function dispSetPool(articleId, qty) {
  _dispEnsure();
  APP.dispatch.pools[articleId] = Math.max(0, parseInt(qty) || 0);
  saveDB();
}

function dispGetFixedAlloc(articleId, commercialId) {
  _dispEnsure();
  return parseInt((APP.dispatch.fixedAlloc[articleId] || {})[commercialId]) || 0;
}
function dispSetFixedAlloc(articleId, commercialId, qty) {
  _dispEnsure();
  if (!APP.dispatch.fixedAlloc[articleId]) APP.dispatch.fixedAlloc[articleId] = {};
  var q = Math.max(0, parseInt(qty) || 0);
  if (q > 0) { APP.dispatch.fixedAlloc[articleId][commercialId] = q; }
  else { delete APP.dispatch.fixedAlloc[articleId][commercialId]; }
  saveDB();
  _dispRefreshGadgetCard(articleId);
}

function dispIsEligible(articleId, commercialId) {
  _dispEnsure();
  var e = APP.dispatch.eligibility[articleId];
  return !!(e && e[commercialId]);
}

function dispToggleEligible(articleId, commercialId) {
  _dispEnsure();
  if (!APP.dispatch.eligibility[articleId]) APP.dispatch.eligibility[articleId] = {};
  var cur = !!APP.dispatch.eligibility[articleId][commercialId];
  if (cur) {
    delete APP.dispatch.eligibility[articleId][commercialId];
  } else {
    APP.dispatch.eligibility[articleId][commercialId] = true;
  }
  saveDB();
  _dispRefreshGadgetCard(articleId);
}

function dispSetAllEligible(articleId, eligible) {
  _dispEnsure();
  if (eligible) {
    APP.dispatch.eligibility[articleId] = {};
    _dispActiveCommerciaux().forEach(function(c) {
      APP.dispatch.eligibility[articleId][c.id] = true;
    });
  } else {
    APP.dispatch.eligibility[articleId] = {};
  }
  saveDB();
  _dispRefreshGadgetCard(articleId);
}

// Compute allocation for one gadget.
// Split le pool entre commerciaux (PDV-pondere Hamilton) et personnes de l'annuaire
// marquees includeDispatch (part equitable integer, reste distribue Hamilton alphabetique).
// Returns null si rien a dispatcher, sinon tableau plat d'items {id, name, pdv?, pct, qty, type}
// avec type = 'com' | 'ann'.
function dispCompute(articleId) {
  _dispEnsure();
  var pool = dispGetPool(articleId);
  if (pool <= 0) return null;
  var shares = _dispShares();
  var eligible = _dispActiveCommerciaux().filter(function(c) {
    return dispIsEligible(articleId, c.id);
  });
  var annuaireList = _dispActiveAnnuaire();
  if (eligible.length === 0 && annuaireList.length === 0) return null;

  // Split le pool selon splitRatio global. Si un des deux groupes est vide,
  // l'autre recupere TOUT le pool (pas de gaspillage).
  var split = dispGetSplit();
  var poolCom, poolAnn;
  if (eligible.length === 0) { poolCom = 0; poolAnn = pool; }
  else if (annuaireList.length === 0) { poolCom = pool; poolAnn = 0; }
  else {
    poolCom = Math.floor(pool * split.com / 100);
    poolAnn = pool - poolCom;
  }

  // ---- Groupe COMMERCIAUX (allocation fixe + Hamilton PDV sur le reste) ----
  var comResults = [];
  if (poolCom > 0 && eligible.length > 0) {
    var fixedMap = (APP.dispatch.fixedAlloc || {})[articleId] || {};
    var fixedResults = [];
    var pdvEligible = [];
    var fixedTotal = 0;
    eligible.forEach(function(c) {
      var fa = parseInt(fixedMap[c.id]) || 0;
      if (fa > 0) {
        fixedResults.push({ id: c.id, name: shares[c.id] ? shares[c.id].name : c.id, pdv: _dispGetPdv(c), qty: fa, pct: 0, fixed: true, type: 'com' });
        fixedTotal += fa;
      } else {
        pdvEligible.push(c);
      }
    });
    var remainingPool = poolCom - fixedTotal;
    var pdvResults = [];
    if (remainingPool > 0 && pdvEligible.length > 0) {
      var eligiblePdvTotal = pdvEligible.reduce(function(s, c) { return s + _dispGetPdv(c); }, 0) || 1;
      pdvResults = pdvEligible.map(function(c) {
        var pdv = _dispGetPdv(c);
        var raw = remainingPool * (pdv / eligiblePdvTotal);
        return { id: c.id, name: shares[c.id] ? shares[c.id].name : c.id, pdv: pdv, raw: raw, floor: Math.floor(raw), rem: raw - Math.floor(raw), qty: 0, type: 'com' };
      });
      var floorSum = pdvResults.reduce(function(s, r) { return s + r.floor; }, 0);
      var leftover = remainingPool - floorSum;
      pdvResults.forEach(function(r) { r.qty = r.floor; });
      pdvResults.sort(function(a, b) { return b.rem - a.rem; });
      for (var i = 0; i < leftover; i++) pdvResults[i].qty++;
    }
    comResults = fixedResults.concat(pdvResults);
    comResults.sort(function(a, b) { return (shares[a.id] ? shares[a.id].pct : 0) > (shares[b.id] ? shares[b.id].pct : 0) ? -1 : 1; });
  }

  // ---- Groupe ANNUAIRE (equitable integer + remainder Hamilton alphabetique) ----
  var annResults = [];
  if (poolAnn > 0 && annuaireList.length > 0) {
    var perPerson = Math.floor(poolAnn / annuaireList.length);
    var remainder = poolAnn - perPerson * annuaireList.length;
    annuaireList.forEach(function(p, idx) {
      var fullName = ((p.prenom||'') + ' ' + (p.nom||'')).trim() || p.id;
      annResults.push({
        id: p.id,
        name: fullName,
        qty: perPerson + (idx < remainder ? 1 : 0),
        pct: 0,
        type: 'ann'
      });
    });
  }

  var all = comResults.concat(annResults);
  if (all.length === 0) return null;
  all.forEach(function(r) { r.pct = (r.qty / pool) * 100; });
  return all;
}

// Validate a specific list of articleIds (or all configured ones)
async function validateDispatchV3(articleIds) {
  // Extract demandeur/objet from recap modal
  var _dispDemType = 'commercial';
  var _dispDemandeur = 'DCM';
  var _dispObjet = 'DOTATION MENSUELLE';
  var dtEl = document.getElementById('disp-demandeur-type');
  if (dtEl) {
    _dispDemType = dtEl.value;
    if (_dispDemType === 'dcm') { _dispDemandeur = 'DCM'; _dispDemType = 'commercial'; }
    else if (_dispDemType === 'commercial') {
      var comSel = document.getElementById('disp-dem-com');
      if (comSel && comSel.value) {
        var dc = APP.commerciaux.find(function(c){ return c.id === comSel.value; });
        _dispDemandeur = dc ? ((dc.prenom||'') + ' ' + (dc.nom||'')).trim() : 'DCM';
      } else { _dispDemandeur = 'DCM'; }
    } else if (_dispDemType === 'custom') {
      _dispDemandeur = (document.getElementById('disp-custom-dem')||{}).value || '';
      if (_dispDemandeur.trim()) {
        if (!APP.settings) APP.settings = {};
        if (!APP.settings._customDemandeurs) APP.settings._customDemandeurs = [];
        var lcn = _dispDemandeur.trim().toLowerCase();
        if (!APP.settings._customDemandeurs.some(function(n){ return n.toLowerCase() === lcn; })) {
          APP.settings._customDemandeurs.push(_dispDemandeur.trim());
        }
      }
    }
  }
  var objEl = document.getElementById('disp-objet');
  if (objEl) _dispObjet = objEl.value || 'DOTATION MENSUELLE';
  _dispEnsure();
  var toDispatch = articleIds || Object.keys(APP.dispatch.pools).filter(function(id) { return dispGetPool(id) > 0; });
  if (toDispatch.length === 0) { notify('Aucun gadget \u00e0 dispatcher', 'warning'); return; }

  var errors = [];
  var results = [];
  toDispatch.forEach(function(articleId) {
    var art = (APP.articles || []).find(function(a) { return a.id === articleId; });
    if (!art) return;
    var pool = dispGetPool(articleId);
    if (pool <= 0) return;
    if (pool > art.stock) { errors.push(art.name + ': pool (' + pool + ') > stock (' + art.stock + ')'); return; }
    var alloc = dispCompute(articleId);
    if (!alloc) { errors.push(art.name + ': aucun commercial \u00e9ligible (ignor\u00e9)'); return; }
    results.push({ art: art, pool: pool, alloc: alloc });
  });

  if (errors.length > 0 && results.length === 0) {
    notify(errors[0], 'error'); return;
  }

  // Global stock constraint: ensure dispatch pool + existing brouillons <= real stock
  var _constraintErr = null;
  for (var _ri = 0; _ri < results.length; _ri++) {
    var _r = results[_ri];
    var _avail = (typeof _computeAvailableForBon === 'function') ? _computeAvailableForBon(_r.art.id, null) : (_r.art.stock || 0);
    if (_r.pool > _avail) {
      _constraintErr = _r.art.name + ' : pool (' + _r.pool + ') > dispo r\u00e9el (' + _avail + '). D\u2019autres bons brouillons engagent d\u00e9j\u00e0 une partie du stock.';
      break;
    }
  }
  if (_constraintErr) { notify(_constraintErr, 'error'); return; }

  var confirmMsg = results.map(function(r) {
    var _nCom = r.alloc.filter(function(a){ return a.type !== 'ann' && a.qty > 0; }).length;
    var _nAnn = r.alloc.filter(function(a){ return a.type === 'ann' && a.qty > 0; }).length;
    var _who = _nAnn > 0 ? (_nCom + ' com. + ' + _nAnn + ' annuaire') : (_nCom + ' commerciaux');
    return r.art.name + ' \u00d7' + r.pool + ' \u2192 ' + _who;
  }).join('\n');
  if (!confirm('Valider le dispatch ?\n\n' + confirmMsg + (errors.length > 0 ? '\n\nIgnor\u00e9s:\n' + errors.join('\n') : ''))) return;

  var ts = Date.now();
  results.forEach(function(r) {
    // No stock deduction here — stock is deducted when bon status changes from brouillon
    // Reset pool after validation
    APP.dispatch.pools[r.art.id] = 0;
    var _split = dispGetSplit();
    var _hasCom = r.alloc.some(function(a){ return a.type === 'com' && a.qty > 0; });
    var _hasAnn = r.alloc.some(function(a){ return a.type === 'ann' && a.qty > 0; });
    APP.dispatch.history.unshift({
      ts: ts,
      articleId: r.art.id,
      articleName: r.art.name,
      totalQty: r.pool,
      stockAtDispatch: (parseInt(r.art.stock)||0),
      splitRatio: { com: _split.com, ann: _split.ann },
      mixed: _hasCom && _hasAnn,
      alloc: r.alloc.map(function(a) { return { id: a.id, name: a.name, qty: a.qty, type: a.type || 'com' }; })
    });
  });

  // Generate bons de sortie per recipient (commercial ou annuaire)
  // Group par id, en capturant le type et le nom snapshot
  var bonsByRecipient = {};
  results.forEach(function(r) {
    r.alloc.forEach(function(a) {
      if (a.qty > 0) {
        if (!bonsByRecipient[a.id]) bonsByRecipient[a.id] = { name: a.name, lignes: [], type: a.type || 'com' };
        bonsByRecipient[a.id].lignes.push({ articleId: r.art.id, code: r.art.code || '', name: r.art.name, qty: a.qty });
      }
    });
  });
  var bonIds = [];
  for (var recipId in bonsByRecipient) {
    var bd = bonsByRecipient[recipId];
    var bonNum = await bonNumber();
    var bon;
    if (bd.type === 'ann') {
      // Snapshot du nom annuaire au moment du dispatch (pas de lookup ulterieur)
      bon = {
        id: generateId(), numero: bonNum,
        companyId: (APP.settings && APP.settings.companyId) || '',
        demandeur: _dispDemandeur || 'DCM',
        _demandeurType: (_dispDemandeur==='DCM' || !_dispDemandeur) ? 'list' : (_dispDemType || 'list'),
        _demandeurAnnuaireId: (_dispDemandeur==='DCM' || !_dispDemandeur) ? (window._DCM_ID || '') : '',
        recipiendaire: bd.name,
        commercialId: '',
        commercialName: '',
        _recipientType: 'annuaire',
        _annuaireId: recipId,
        objet: _dispObjet || 'DOTATION MENSUELLE',
        date: new Date().toISOString().split('T')[0],
        validite: '',
        lignes: bd.lignes,
        status: 'brouillon',
        sigDemandeur: '', sigMKT: '',
        _isDispatch: true,
        createdAt: ts, _version: 1
      };
    } else {
      var com = APP.commerciaux.find(function(x){ return x.id === recipId; });
      var fullName = com ? ((com.prenom||'') + ' ' + (com.nom||'')).trim() : bd.name;
      bon = {
        id: generateId(), numero: bonNum,
        companyId: (APP.settings && APP.settings.companyId) || '',
        demandeur: _dispDemandeur || 'DCM',
        _demandeurType: (_dispDemandeur==='DCM' || !_dispDemandeur) ? 'list' : (_dispDemType || 'list'),
        _demandeurAnnuaireId: (_dispDemandeur==='DCM' || !_dispDemandeur) ? (window._DCM_ID || '') : '',
        recipiendaire: fullName,
        commercialId: recipId,
        commercialName: fullName,
        _recipientType: 'commercial',
        objet: _dispObjet || 'DOTATION MENSUELLE',
        date: new Date().toISOString().split('T')[0],
        validite: '',
        lignes: bd.lignes,
        status: 'brouillon',
        sigDemandeur: '', sigMKT: '',
        _isDispatch: true,
        createdAt: ts, _version: 1
      };
    }
    APP.bons.push(bon);
    bonIds.push(bon.id);
  }

  // Attach generated bonIds to the dispatch history snapshots (for safe undo)
  results.forEach(function(r) {
    var snap = (APP.dispatch.history || []).find(function(h){ return h.ts === ts && h.articleId === r.art.id; });
    if (!snap) return;
    snap.bonIds = [];
    bonIds.forEach(function(bid) {
      var b = APP.bons.find(function(x){ return x.id === bid; });
      if (b && (b.lignes||[]).some(function(l){ return l.articleId === r.art.id; })) snap.bonIds.push(bid);
    });
  });

  saveDB();
  auditLog('DISPATCH', 'dispatch', '', null, { message: results.length + ' gadget(s) dispatched, ' + bonIds.length + ' bon(s) generated', bonIds: bonIds });
  notify('\u2705 Dispatch valid\u00e9 \u2014 ' + results.length + ' gadget(s), ' + bonIds.length + ' bon(s) cr\u00e9\u00e9(s)', 'success');
  renderDispatchPage();

  // Offer to print bons
  if (bonIds.length > 0) {
    setTimeout(function() {
      if (confirm(bonIds.length + ' bon(s) de sortie g\u00e9n\u00e9r\u00e9(s). Imprimer ?')) {
        bonIds.forEach(function(bid) { printBon(bid); });
      }
    }, 300);
  }
}

// ── Partial refresh (eligibility/pool change without full re-render) ──────────
function _dispRefreshGadgetCard(articleId) {
  var card = document.getElementById('dp-card-' + articleId);
  if (!card) return;
  var art = (APP.articles || []).find(function(a) { return a.id === articleId; });
  if (!art) return;
  card.outerHTML = _renderDispGadgetCard(art, _dispShares());
}

function _dispUpdatePool(articleId) {
  var inp = document.getElementById('dp-pool-' + articleId);
  if (!inp) return;
  var val = parseInt(inp.value) || 0;
  var art = (APP.articles || []).find(function(a) { return a.id === articleId; });
  if (art && val > art.stock) { val = art.stock; inp.value = val; }
  dispSetPool(articleId, val);
  // refresh preview only
  var prev = document.getElementById('dp-prev-' + articleId);
  if (prev) prev.innerHTML = _renderDispPreview(articleId);
}

// ── Render functions ──────────────────────────────────────────────────────────

function _dispReset() {
  if (!confirm('Remettre tout le dispatch \u00e0 z\u00e9ro ?\n(Pools, \u00e9ligibilit\u00e9s et historique)')) return;
  _dispEnsure();
  APP.dispatch.pools = {};
  APP.dispatch.eligibility = {};
  APP.dispatch.fixedAlloc = {};
  APP.dispatch.history = [];
  saveDB();
  renderDispatchPage();
  notify('Dispatch r\u00e9initialis\u00e9 \u2713', 'info');
}

function _showDispatchRecap() {
  _dispEnsure();
  var articles = (APP.articles || []).filter(function(a) { return a.stock > 0 && dispGetPool(a.id) > 0; });
  if (articles.length === 0) { notify('Aucun gadget configur\u00e9', 'warning'); return; }

  // Build recap: per commercial, total across all gadgets
  var comTotals = {};
  var errors = [];
  articles.forEach(function(a) {
    var pool = dispGetPool(a.id);
    if (pool > a.stock) { errors.push(a.name + ': pool (' + pool + ') > stock (' + a.stock + ')'); return; }
    var alloc = dispCompute(a.id);
    if (!alloc) { errors.push(a.name + ': aucun commercial \u00e9ligible'); return; }
    alloc.forEach(function(al) {
      if (al.qty > 0) {
        if (!comTotals[al.id]) comTotals[al.id] = { name: al.name, gadgets: [], total: 0 };
        comTotals[al.id].gadgets.push({ name: a.name, qty: al.qty });
        comTotals[al.id].total += al.qty;
      }
    });
  });

  if (Object.keys(comTotals).length === 0 && errors.length > 0) {
    notify(errors[0], 'error'); return;
  }

  // Build HTML table
  var rows = '';
  var grandTotal = 0;
  for (var comId in comTotals) {
    var ct = comTotals[comId];
    grandTotal += ct.total;
    var detail = ct.gadgets.map(function(g) { return g.name + ' \u00d7' + g.qty; }).join(', ');
    rows += '<tr style="border-bottom:1px solid var(--border)">'
      + '<td style="padding:8px 10px;font-weight:700">' + ct.name + '</td>'
      + '<td style="padding:8px 10px;font-size:0.85rem;color:var(--text-2)">' + detail + '</td>'
      + '<td style="padding:8px 10px;text-align:right;font-weight:800;color:var(--accent);font-size:1.1rem">' + ct.total + '</td>'
      + '</tr>';
  }

  var errHtml = errors.length > 0
    ? '<div style="background:var(--danger)11;border:1px solid var(--danger)33;border-radius:8px;padding:8px 12px;margin-bottom:14px;font-size:0.82rem;color:var(--danger)">'
      + '<strong>Ignor\u00e9s :</strong> ' + errors.join(', ') + '</div>'
    : '';

  var html = errHtml
    + '<div style="margin-bottom:14px;font-size:0.88rem;color:var(--text-2)"><strong>' + articles.length + '</strong> gadget(s) \u2192 <strong>' + Object.keys(comTotals).length + '</strong> commercial(aux) \u2192 <strong>' + grandTotal + '</strong> unit\u00e9s total</div>'
    + '<div class="table-wrap"><table style="width:100%;border-collapse:collapse">'
    + '<thead><tr><th style="text-align:left;padding:8px 10px;font-size:0.78rem;text-transform:uppercase;color:var(--text-2)">Commercial</th>'
    + '<th style="text-align:left;padding:8px 10px;font-size:0.78rem;text-transform:uppercase;color:var(--text-2)">D\u00e9tail gadgets</th>'
    + '<th style="text-align:right;padding:8px 10px;font-size:0.78rem;text-transform:uppercase;color:var(--text-2)">Total</th></tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '<tfoot><tr style="background:var(--accent)08"><td colspan="2" style="padding:10px;font-weight:700;font-size:0.92rem">TOTAL G\u00c9N\u00c9RAL</td>'
    + '<td style="padding:10px;text-align:right;font-weight:900;font-size:1.2rem;color:var(--accent)">' + grandTotal + '</td></tr></tfoot>'
    + '</table></div>'
    + '<div style="margin-top:16px;padding:10px 14px;background:var(--accent)08;border-radius:8px;font-size:0.82rem;color:var(--text-2)">'
    + '<i class="fa-solid fa-file-invoice" style="color:var(--accent);margin-right:6px"></i>'
    + '<strong>' + Object.keys(comTotals).length + ' bon(s) de sortie</strong> seront g\u00e9n\u00e9r\u00e9s</div>'
    + '<div style="margin-top:12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">'
    + '<label style="font-size:0.85rem;font-weight:600">Demandeur :</label>'
    + '<select id="disp-demandeur-type" onchange="var cw=document.getElementById(\'disp-custom-dem-wrap\');var cs=document.getElementById(\'disp-dem-com\');if(this.value===\'custom\'){cw.style.display=\'\';cs.style.display=\'none\';}else if(this.value===\'commercial\'){cs.style.display=\'\';cw.style.display=\'none\';}else{cw.style.display=\'none\';cs.style.display=\'none\';}" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border)">'
    + '<option value="dcm">DCM</option><option value="commercial">Commercial</option><option value="custom">Autre</option></select>'
    + '<select id="disp-dem-com" style="display:none;padding:4px 8px;border-radius:6px;border:1px solid var(--border)">' + APP.commerciaux.map(function(c){return '<option value="'+c.id+'">'+((c.prenom||'')+' '+(c.nom||'')).trim()+'</option>';}).join('') + '</select>'
    + '<div id="disp-custom-dem-wrap" style="display:none"><input id="disp-custom-dem" list="disp-custom-dem-list" placeholder="Nom..." style="padding:4px 8px;border-radius:6px;border:1px solid var(--border)"><datalist id="disp-custom-dem-list">' + ((APP.settings||{})._customDemandeurs||[]).map(function(n){return '<option value="'+n+'">';}).join('') + '</datalist></div>'
    + '<label style="font-size:0.85rem;font-weight:600;margin-left:12px">Objet :</label>'
    + '<input id="disp-objet" value="DOTATION MENSUELLE" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);width:200px">'
    + '</div>';

  openModal('dispatch-recap-modal', '\ud83d\udce6 R\u00e9cap Dispatch', html, function() {
    closeModal();
    validateDispatchV3(null);
  }, 'modal-lg');
}

function renderDispatchPage() {
  _dispEnsure();
  var articles = (APP.articles || []).filter(function(a) { return a.stock > 0; });
  var shares   = _dispShares();
  var totalPdv = _dispTotalPdv();
  var coms     = _dispActiveCommerciaux();
  var activeTab = (document.querySelector('.dp-tab.active') || {}).dataset && document.querySelector('.dp-tab.active').dataset.tab || 'dispatch';

  // KPI row
  var configured = articles.filter(function(a) { return dispGetPool(a.id) > 0; }).length;
  var kpis = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">'
    + _dpKpi(coms.length, 'Commerciaux', 'var(--accent)', 'fa-user-tie')
    + _dpKpi(totalPdv, 'PDV total', 'var(--accent2)', 'fa-store')
    + _dpKpi(articles.length, 'Gadgets en stock', 'var(--warning)', 'fa-boxes-stacked')
    + _dpKpi(configured, 'Pools\u00a0configur\u00e9s', 'var(--success,#0f0)', 'fa-check-circle')
    + '</div>';

  // Tabs
  var tabs = '<div style="display:flex;gap:4px;margin-bottom:18px;border-bottom:2px solid var(--border);padding-bottom:0">'
    + _dpTab('dispatch', 'R\u00e9partition', activeTab)
    + _dpTab('historique', 'Historique', activeTab)
    + '<div style="margin-left:auto;padding-bottom:8px;display:flex;gap:8px">'
    + '<button class="btn btn-sm" onclick="_dispReset()" style="font-weight:600;color:var(--danger)"><i class="fa-solid fa-rotate-left" style="margin-right:5px"></i>Reset</button>'
    + '<button class="btn btn-secondary btn-sm" onclick="saveDB();notify(&quot;\u2601 Configuration sauvegard\u00e9e&quot;,&quot;success&quot;);renderDispatchPage()" style="font-weight:600"><i class="fa-solid fa-cloud-arrow-up" style="margin-right:5px"></i>Sauvegarder config</button>'
    + (configured > 0 ? '<button class="btn btn-primary btn-sm" onclick="_showDispatchRecap()" style="font-weight:700"><i class="fa-solid fa-check" style="margin-right:6px"></i>Valider le dispatch</button>' : '')
    + '</div></div>';

  // Tab: dispatch
  var tabDispatch = '<div class="dp-tab-pane" id="dp-pane-dispatch" style="display:' + (activeTab === 'dispatch' ? 'block' : 'none') + '">';

  // Shares summary (collapsible)
  tabDispatch += '<div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">';
  tabDispatch += '<div onclick="var b=document.getElementById(\'dp-shares-body\');b.style.display=b.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.dp-caret\').style.transform=b.style.display===\'none\'?\'rotate(0deg)\':\' rotate(180deg)\'" '
    + 'style="padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">'
    + '<i class="fa-solid fa-chart-pie" style="color:var(--accent)"></i>'
    + '<strong style="font-size:0.95rem">Parts terrain par commercial</strong>'
    + '<span class="dp-caret" style="margin-left:auto;display:inline-block;transition:transform .2s;color:var(--text-2)">&#8964;</span>'
    + '</div>';
  tabDispatch += '<div id="dp-shares-body" style="padding:12px 16px">' + _renderSharesTable(shares, totalPdv) + '</div>';
  tabDispatch += '</div>';

  // Split ratio control (global, editable)
  tabDispatch += _renderDispSplitControl();

  // Annuaire dispatchables (if any)
  tabDispatch += _renderDispAnnuaireTable();

  // Gadget cards
  if (articles.length === 0) {
    tabDispatch += '<div class="card" style="padding:32px;text-align:center;color:var(--text-2)"><i class="fa-solid fa-box-open" style="font-size:2rem;margin-bottom:12px;display:block"></i>Aucun gadget en stock</div>';
  } else {
    tabDispatch += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">';
    articles.forEach(function(a) { tabDispatch += _renderDispGadgetCard(a, shares); });
    tabDispatch += '</div>';
  }
  tabDispatch += '</div>';

  // Tab: historique
  var tabHist = '<div class="dp-tab-pane" id="dp-pane-historique" style="display:' + (activeTab === 'historique' ? 'block' : 'none') + '">'
    + _renderDispTabHistory() + '</div>';

  document.getElementById('content').innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">'
    + '<h2 style="margin:0"><i class="fa-solid fa-share-nodes" style="color:var(--accent);margin-right:10px"></i>Dispatch Gadgets</h2>'
    + '</div>'
    + kpis + tabs + tabDispatch + tabHist;
}

function _dpKpi(val, label, color, icon) {
  return '<div class="card" style="padding:14px 16px;display:flex;align-items:center;gap:12px">'
    + '<div style="width:36px;height:36px;border-radius:8px;background:' + color + '22;display:flex;align-items:center;justify-content:center;flex-shrink:0">'
    + '<i class="fa-solid ' + icon + '" style="color:' + color + ';font-size:0.95rem"></i></div>'
    + '<div><div style="font-size:1.4rem;font-weight:800;color:' + color + ';line-height:1">' + val + '</div>'
    + '<div style="font-size:0.75rem;color:var(--text-2);margin-top:2px">' + label + '</div></div>'
    + '</div>';
}

function _dpTab(id, label, activeTab) {
  var isActive = activeTab === id;
  return '<button class="dp-tab btn btn-sm' + (isActive ? ' btn-primary active' : '') + '" data-tab="' + id + '" '
    + 'onclick="document.querySelectorAll(\'.dp-tab\').forEach(function(b){b.classList.remove(\'active\',\'btn-primary\')});this.classList.add(\'active\',\'btn-primary\');'
    + 'document.querySelectorAll(\'.dp-tab-pane\').forEach(function(p){p.style.display=\'none\'});document.getElementById(\'dp-pane-\'+this.dataset.tab).style.display=\'block\'" '
    + 'style="border-radius:6px 6px 0 0;border-bottom:none;margin-bottom:-2px;padding:7px 18px">' + label + '</button>';
}

function _renderSharesTable(shares, totalPdv) {
  var coms = _dispActiveCommerciaux();
  if (coms.length === 0) return '<p style="color:var(--text-2);font-size:0.85rem">Aucun commercial actif</p>';
  var rows = '';
  coms.forEach(function(c) {
    var s = shares[c.id] || { name: c.id, pdv: 0, pct: 0 };
    var barW = Math.round(s.pct);
    rows += '<tr>'
      + '<td style="font-weight:600;font-size:0.88rem">' + s.name + '</td>'
      + '<td style="text-align:center;font-size:0.85rem">' + s.pdv + '</td>'
      + '<td style="min-width:80px"><div style="background:var(--border);border-radius:3px;height:6px;overflow:hidden">'
      + '<div style="background:var(--accent);height:100%;width:' + barW + '%;border-radius:3px"></div></div></td>'
      + '<td style="text-align:right;font-weight:700;color:var(--accent);font-size:0.88rem">' + s.pct.toFixed(1) + '%</td>'
      + '</tr>';
  });
  return '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">'
    + '<thead><tr><th style="text-align:left;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.78rem;text-transform:uppercase">Commercial</th>'
    + '<th style="text-align:center;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.78rem">PDV</th>'
    + '<th style="padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.78rem">R\u00e9partition</th>'
    + '<th style="text-align:right;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.78rem">Part</th></tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '<tfoot><tr><td style="padding:6px 8px;border-top:1px solid var(--border);font-weight:700;font-size:0.82rem">TOTAL</td>'
    + '<td style="text-align:center;padding:6px 8px;border-top:1px solid var(--border);font-weight:700">' + totalPdv + '</td>'
    + '<td style="border-top:1px solid var(--border)"></td>'
    + '<td style="text-align:right;padding:6px 8px;border-top:1px solid var(--border);font-weight:700;color:var(--accent)">100%</td></tr></tfoot>'
    + '</table>';
}

// Carte de controle du split global commerciaux/annuaire
function _renderDispSplitControl() {
  var split = dispGetSplit();
  var annList = _dispActiveAnnuaire();
  var annWarn = annList.length === 0
    ? '<span style="font-size:0.72rem;color:var(--text-3);margin-left:8px"><i class="fa-solid fa-info-circle"></i> Aucune personne annuaire marqu\u00e9e — le pool ira à 100% aux commerciaux.</span>'
    : '';
  return '<div class="card" style="margin-bottom:16px;padding:12px 16px">'
    + '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'
    + '<i class="fa-solid fa-scale-balanced" style="color:var(--accent2)"></i>'
    + '<strong style="font-size:0.95rem">R\u00e9partition du pool</strong>'
    + '<span style="font-size:0.8rem;color:var(--text-2);margin-left:4px">Commerciaux</span>'
    + '<input type="number" id="dp-split-com" value="' + split.com + '" min="0" max="100" '
    + 'oninput="_dispUpdateSplit()" '
    + 'style="width:60px;text-align:center;padding:4px 6px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input,var(--bg-card));color:var(--text-1);font-weight:700">'
    + '<span style="font-size:0.8rem;color:var(--text-2)">%</span>'
    + '<span style="margin:0 6px;color:var(--text-3)">↔</span>'
    + '<span style="font-size:0.8rem;color:var(--text-2)">Annuaire</span>'
    + '<span id="dp-split-ann-lbl" style="font-weight:800;color:var(--accent);font-size:0.95rem">' + split.ann + '%</span>'
    + annWarn
    + '</div>'
    + '</div>';
}

// Table des personnes de l'annuaire concernees par le dispatch (collapsible)
function _renderDispAnnuaireTable() {
  var list = _dispActiveAnnuaire();
  if (list.length === 0) return '';
  var rows = list.map(function(p) {
    var fullName = ((p.prenom||'') + ' ' + (p.nom||'')).trim() || p.id;
    return '<tr>'
      + '<td style="padding:4px 8px;font-weight:600;font-size:0.85rem">' + fullName + '</td>'
      + '<td style="padding:4px 8px;font-size:0.78rem;color:var(--text-2)">' + (p.poste || '\u2014') + '</td>'
      + '<td style="padding:4px 8px;font-size:0.78rem;color:var(--text-2)">' + (p.departement || '\u2014') + '</td>'
      + '<td style="padding:4px 8px;text-align:right;font-size:0.78rem;color:var(--text-2)">' + (p.matricule || '\u2014') + '</td>'
      + '</tr>';
  }).join('');
  return '<div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">'
    + '<div onclick="var b=document.getElementById(\'dp-ann-body\');b.style.display=b.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.dp-caret\').style.transform=b.style.display===\'none\'?\'rotate(0deg)\':\' rotate(180deg)\'" '
    + 'style="padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">'
    + '<i class="fa-solid fa-address-book" style="color:#00c875"></i>'
    + '<strong style="font-size:0.95rem">Annuaire — personnes concern\u00e9es par le dispatch</strong>'
    + '<span class="badge" style="background:#00c87522;color:#00c875;font-size:0.7rem;padding:2px 8px;border-radius:99px;font-weight:700">' + list.length + '</span>'
    + '<span class="dp-caret" style="margin-left:auto;display:inline-block;transition:transform .2s;color:var(--text-2)">&#8964;</span>'
    + '</div>'
    + '<div id="dp-ann-body" style="padding:8px 16px;display:none">'
    + '<div style="font-size:0.78rem;color:var(--text-2);margin-bottom:6px">Part équitable du pool annuaire (entiers). Si le pool ne se divise pas, les premiers dans l’ordre alphabétique reçoivent +1.</div>'
    + '<table style="width:100%;border-collapse:collapse">'
    + '<thead><tr>'
    + '<th style="text-align:left;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.72rem;text-transform:uppercase">Nom</th>'
    + '<th style="text-align:left;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.72rem;text-transform:uppercase">Poste</th>'
    + '<th style="text-align:left;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.72rem;text-transform:uppercase">D\u00e9partement</th>'
    + '<th style="text-align:right;padding:4px 8px;color:var(--text-2);font-weight:600;font-size:0.72rem;text-transform:uppercase">Matricule</th>'
    + '</tr></thead>'
    + '<tbody>' + rows + '</tbody></table></div></div>';
}

// Handler d'edit du split global
function _dispUpdateSplit() {
  var inp = document.getElementById('dp-split-com');
  if (!inp) return;
  var v = parseInt(inp.value);
  if (isNaN(v) || v < 0) v = 0;
  if (v > 100) v = 100;
  inp.value = v;
  dispSetSplit(v);
  var lbl = document.getElementById('dp-split-ann-lbl');
  if (lbl) lbl.textContent = (100 - v) + '%';
  // Refresh toutes les previews de gadgets
  (APP.articles || []).forEach(function(a) {
    var prev = document.getElementById('dp-prev-' + a.id);
    if (prev) prev.innerHTML = _renderDispPreview(a.id);
  });
}

function _renderDispGadgetCard(art, shares) {
  var artId = art.id;
  var pool  = dispGetPool(artId);
  var coms  = _dispActiveCommerciaux();

  // Eligibility chips
  var chips = '<div style="display:flex;flex-wrap:wrap;gap:5px;margin:10px 0">';
  coms.forEach(function(c) {
    var eli = dispIsEligible(artId, c.id);
    var s   = shares[c.id] || { name: c.id, pct: 0 };
    chips += '<span onclick="dispToggleEligible(\'' + artId + '\',\'' + c.id + '\')" '
      + 'title="' + s.name + ' \u2014 ' + s.pct.toFixed(1) + '%" '
      + 'style="cursor:pointer;padding:4px 8px;border-radius:20px;font-size:0.75rem;font-weight:600;user-select:none;transition:all .15s;'
      + (eli ? 'background:var(--accent);color:#fff;' : 'background:var(--border);color:var(--text-2);')
      + '">' + s.name.split(' ')[0] + '</span>';
  });
  chips += '</div>';

  // Quick-select all/none
  chips += '<div style="display:flex;gap:6px;margin-bottom:8px">'
    + '<button class="btn btn-sm" onclick="dispSetAllEligible(\'' + artId + '\',true)" style="font-size:0.72rem;padding:2px 8px">Tous</button>'
    + '<button class="btn btn-sm" onclick="dispSetAllEligible(\'' + artId + '\',false)" style="font-size:0.72rem;padding:2px 8px">Aucun</button>'
    + '</div>';

  // Fixed allocation panel (collapsible)
  var _hasEligible = coms.some(function(c) { return dispIsEligible(artId, c.id); });
  var showFixedBtn = _hasEligible ? '<button class="btn btn-sm" onclick="var p=document.getElementById(\'dp-fixpanel-' + artId + '\');p.style.display=p.style.display===\'none\'?\'block\':\'none\'" style="font-size:0.7rem;padding:1px 6px;margin-bottom:4px;color:var(--text-2)"><i class="fa-solid fa-sliders" style="margin-right:3px"></i>Alloc. fixes</button>' : '';
  var allFixedHtml = '<div id="dp-fixpanel-' + artId + '" style="display:none;background:var(--border)22;border-radius:6px;padding:6px 10px;margin-bottom:6px">';
  allFixedHtml += '<div style="font-size:0.72rem;color:var(--text-2);margin-bottom:4px"><i class="fa-solid fa-lock" style="margin-right:3px"></i>Quantit\u00e9s fixes (d\u00e9duites du pool avant r\u00e9partition PDV)</div>';
  coms.forEach(function(c) {
    if (!dispIsEligible(artId, c.id)) return;
    var sn = (shares[c.id] || {}).name || c.id;
    var fa = dispGetFixedAlloc(artId, c.id);
    var pdv = _dispGetPdv(c);
    allFixedHtml += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;font-size:0.78rem">'
      + '<span style="min-width:110px;color:' + (pdv === 0 ? 'var(--warning)' : 'var(--text-1)') + '">' + sn.split(' ')[0] + (pdv === 0 ? ' <i style="font-size:0.65rem;color:var(--warning)">(0 PDV)</i>' : ' <i style="font-size:0.65rem;color:var(--text-2)">(' + pdv + ' PDV)</i>') + '</span>'
      + '<input type="number" value="' + fa + '" min="0" style="width:60px;padding:2px 4px;border-radius:4px;border:1px solid var(--border);font-size:0.78rem;text-align:center;background:var(--bg-input,var(--bg-card));color:var(--text-1)" '
      + 'onchange="dispSetFixedAlloc(\'' + artId + '\',\'' + c.id + '\',this.value)" placeholder="0">'
      + '<span style="font-size:0.7rem;color:var(--text-2)">fixe</span></div>';
  });
  allFixedHtml += '</div>';

  // Preview
  var previewHtml = _renderDispPreview(artId);

  return '<div class="card" id="dp-card-' + artId + '" style="padding:14px 16px">'
    // Header
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">'
    + '<div><span style="font-weight:700;font-size:0.95rem">' + art.name + '</span>'
    + (art.category ? '<span style="margin-left:8px;font-size:0.72rem;color:var(--text-2)">' + art.category + '</span>' : '')
    + '</div>'
    + '<span class="badge" style="background:var(--accent)22;color:var(--accent)">Stock&nbsp;' + art.stock + '</span>'
    + '</div>'
    // Pool input
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">'
    + '<label style="font-size:0.8rem;color:var(--text-2);white-space:nowrap">Pool \u00e0 dispatcher</label>'
    + '<input type="number" id="dp-pool-' + artId + '" value="' + pool + '" min="0" max="' + art.stock + '" '
    + 'oninput="_dispUpdatePool(\'' + artId + '\')" '
    + 'style="width:80px;text-align:center;padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input,var(--bg-card));color:var(--text-1);font-weight:700">'
    + '<span style="font-size:0.75rem;color:var(--text-2)">/ ' + art.stock + '</span>'
    + '</div>'
    // Eligibility
    + '<div style="font-size:0.75rem;color:var(--text-2);margin-bottom:2px">Commerciaux \u00e9ligibles <span style="color:var(--text-2)">(cliquer pour basculer)</span></div>'
    + chips
    + showFixedBtn
    + allFixedHtml
    // Preview
    + '<div id="dp-prev-' + artId + '">' + previewHtml + '</div>'
    + '</div>';
}

function _renderDispPreview(articleId) {
  var alloc = dispCompute(articleId);
  if (!alloc) {
    var pool = dispGetPool(articleId);
    if (pool <= 0) return '<p style="font-size:0.78rem;color:var(--text-2);margin:4px 0">D\u00e9finissez un pool pour voir la r\u00e9partition.</p>';
    return '<p style="font-size:0.78rem;color:var(--warning);margin:4px 0"><i class="fa-solid fa-triangle-exclamation"></i>&nbsp;Aucun commercial \u00e9ligible &mdash; gadget ignor\u00e9.</p>';
  }
  var total = alloc.reduce(function(s, a) { return s + a.qty; }, 0);
  var rows = '';
  alloc.forEach(function(a) {
    var barW = Math.round((a.qty / (total || 1)) * 100);
    var isFixed = a.fixed ? true : false;
    var isAnn = a.type === 'ann';
    var typeBadge = isAnn
      ? ' <span style="font-size:8px;background:#00c875;color:#fff;padding:1px 5px;border-radius:99px;font-weight:700;vertical-align:middle;margin-left:4px">ANN</span>'
      : '';
    var barColor = isFixed ? 'var(--warning)' : (isAnn ? '#00c875' : 'var(--accent2)');
    rows += '<tr>'
      + '<td style="padding:3px 6px;font-size:0.8rem">' + a.name + (isFixed ? ' <i class="fa-solid fa-lock" style="font-size:0.6rem;color:var(--warning)" title="Allocation fixe"></i>' : '') + typeBadge + '</td>'
      + '<td style="padding:3px 6px;text-align:center"><div style="background:var(--border);border-radius:2px;height:5px;width:60px;display:inline-block;vertical-align:middle;overflow:hidden">'
      + '<div style="background:' + barColor + ';height:100%;width:' + barW + '%;border-radius:2px"></div></div></td>'
      + '<td style="padding:3px 6px;text-align:right;font-weight:700;font-size:0.8rem;color:' + barColor + '">' + a.qty + '</td>'
      + '<td style="padding:3px 6px;text-align:right;font-size:0.75rem;color:var(--text-2)">' + a.pct.toFixed(1) + '%</td>'
      + '</tr>';
  });
  return '<div style="margin-top:6px;border-top:1px solid var(--border);padding-top:6px">'
    + '<table style="width:100%;border-collapse:collapse">'
    + '<thead><tr><th style="text-align:left;font-size:0.72rem;color:var(--text-2);padding:2px 6px;text-transform:uppercase">Destinataire</th>'
    + '<th style="font-size:0.72rem;color:var(--text-2);padding:2px 6px"></th>'
    + '<th style="text-align:right;font-size:0.72rem;color:var(--text-2);padding:2px 6px">Qtt\u00e9</th>'
    + '<th style="text-align:right;font-size:0.72rem;color:var(--text-2);padding:2px 6px">%</th></tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '<tfoot><tr><td colspan="2" style="padding:4px 6px;font-weight:700;font-size:0.8rem;border-top:1px solid var(--border)">Total dispatch\u00e9</td>'
    + '<td style="text-align:right;padding:4px 6px;font-weight:700;font-size:0.8rem;border-top:1px solid var(--border);color:var(--accent)">' + total + '</td>'
    + '<td style="text-align:right;padding:4px 6px;font-size:0.8rem;border-top:1px solid var(--border);color:var(--accent)">100%</td></tr></tfoot>'
    + '</table></div>';
}

function _renderDispTabHistory() {
  _dispEnsure();
  var hist = APP.dispatch.history || [];
  if (hist.length === 0) return '<div class="card" style="padding:32px;text-align:center;color:var(--text-2)"><i class="fa-solid fa-clock-rotate-left" style="font-size:2rem;margin-bottom:12px;display:block"></i>Aucun dispatch valid\u00e9</div>';
  // Collect available years from history + include current year
  var yrs = {};
  hist.forEach(function(h){ yrs[new Date(h.ts).getFullYear()] = true; });
  var curYear = new Date().getFullYear();
  yrs[curYear] = true;
  var yearList = Object.keys(yrs).map(function(y){return parseInt(y,10);}).sort(function(a,b){return b-a;});
  var selYear = window._dispHistSelectedYear || curYear;
  if (yearList.indexOf(selYear) === -1) selYear = yearList[0];
  var yearOpts = yearList.map(function(y){
    return '<option value="' + y + '"' + (y===selYear?' selected':'') + '>' + y + '</option>';
  }).join('');
  var html = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap">'
    + '<label style="font-size:0.82rem;color:var(--text-2);font-weight:600"><i class="fa-solid fa-calendar-days" style="margin-right:6px;color:var(--accent)"></i>Ann\u00e9e</label>'
    + '<select id="disp-hist-year" onchange="_dispHistSelectYear(this.value)" style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg-card);color:var(--text-1);font-weight:600">' + yearOpts + '</select>'
    + '<span style="font-size:0.78rem;color:var(--text-3);margin-left:auto">Dispatches mensuels - historique 5 ans</span>'
    + '</div>'
    + '<div id="disp-hist-list">' + _buildDispHistByMonth(selYear) + '</div>';
  return html;
}

function _dispHistSelectYear(y) {
  window._dispHistSelectedYear = parseInt(y, 10) || new Date().getFullYear();
  var el = document.getElementById('disp-hist-list');
  if (el) el.innerHTML = _buildDispHistByMonth(window._dispHistSelectedYear);
}

function _buildDispHistByMonth(year) {
  var hist = (APP.dispatch && APP.dispatch.history) || [];
  year = parseInt(year, 10) || new Date().getFullYear();
  var monthNames = ['Janvier','F\u00e9vrier','Mars','Avril','Mai','Juin','Juillet','Ao\u00fbt','Septembre','Octobre','Novembre','D\u00e9cembre'];
  var byMonth = {};
  hist.forEach(function(h){
    var d = new Date(h.ts);
    if (d.getFullYear() !== year) return;
    var m = d.getMonth();
    (byMonth[m] = byMonth[m] || []).push(h);
  });
  var html = '';
  for (var m = 0; m < 12; m++) {
    var items = byMonth[m] || [];
    var monthHead = '<div style="display:flex;align-items:center;gap:10px;margin:14px 0 8px 2px">'
      + '<div style="width:28px;height:28px;border-radius:8px;background:' + (items.length ? 'var(--accent)22' : 'var(--border)') + ';display:flex;align-items:center;justify-content:center;color:' + (items.length ? 'var(--accent)' : 'var(--text-3)') + ';font-weight:700;font-size:0.82rem">' + (m+1) + '</div>'
      + '<strong style="font-size:0.95rem;color:' + (items.length ? 'var(--text-0)' : 'var(--text-3)') + '">' + monthNames[m] + ' ' + year + '</strong>'
      + (items.length ? '<span class="badge" style="background:var(--accent)22;color:var(--accent);font-size:10px">' + items.length + ' dispatch' + (items.length>1?'es':'') + '</span>' : '')
      + '</div>';
    if (items.length === 0) {
      html += monthHead + '<div style="padding:8px 14px;margin-left:38px;font-size:0.78rem;color:var(--text-3);font-style:italic;border-left:2px solid var(--border)">Aucun dispatch ce mois-ci</div>';
    } else {
      html += monthHead + _buildDispHistRows(items);
    }
  }
  return html;
}

function _buildDispHistRows(list) {
  var fullHist = APP.dispatch.history || [];
  var rows = '';
  list.forEach(function(h) {
    var realIdx = fullHist.indexOf(h);
    var details = (h.alloc || []).filter(function(a) { return a.qty > 0; }).map(function(a) { return '<span style="font-size:0.75rem;background:var(--border);border-radius:10px;padding:2px 7px;display:inline-block;margin:1px">' + a.name + ': <strong>' + a.qty + '</strong></span>'; }).join(' ');
    rows += '<div class="card" style="margin-bottom:8px;padding:12px 14px">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
      + '<div><strong style="font-size:0.92rem">' + (h.articleName || '') + '</strong>'
      + '<span class="badge" style="margin-left:8px;background:var(--accent)22;color:var(--accent)">' + h.totalQty + ' unit\u00e9s pr\u00e9lev\u00e9es</span>'
      + (h.stockAtDispatch != null ? '<span class="badge" style="margin-left:6px;background:var(--border);color:var(--text-1)" title="Stock du gadget au moment du dispatch">' + h.stockAtDispatch + ' stock initial</span>'
      + '<span class="badge" style="margin-left:6px;background:var(--border);color:var(--text-2)" title="Simulation : stock initial \u2212 unit\u00e9s pr\u00e9lev\u00e9es. N\'impacte pas le stock r\u00e9el.">' + (h.stockAtDispatch - h.totalQty) + ' \u00e0 rester</span>' : '')
      + '</div>'
      + '<div style="display:flex;gap:6px;align-items:center">'
      + '<span style="font-size:0.78rem;color:var(--text-2)">' + new Date(h.ts).toLocaleString('fr-FR') + '</span>'
      + '<button class="btn btn-sm" onclick="printDispatchReport(' + realIdx + ')" title="Imprimer"><i class="fa-solid fa-print"></i></button>'
      + '<button class="btn btn-sm" onclick="undoDispatch(' + realIdx + ')" title="Annuler" style="color:var(--danger)"><i class="fa-solid fa-rotate-left"></i></button>'
      + '</div></div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:4px">' + details + '</div>'
      + '</div>';
  });
  return rows || '<p style="color:var(--text-2);font-size:0.85rem">Aucun r\u00e9sultat</p>';
}

function dInitCommercialDispatchFields(c) {
  if (c.dispatchZoneId === undefined) c.dispatchZoneId = c.zoneId || '';
}


// ============================================================
// SIGNATURES -- RTDB cache + helpers (Phase 1)
// ============================================================

// In-memory cache: { sig_xxx: 'data:image/jpeg;base64,...' }
// Loaded once after login, kept live via real-time listener
var _sigCache = {};
var _sigCacheLoaded = false;
var _sigListenerAttached = false;
var _sigCachePromise = null;

// Load all signatures from RTDB (called after login from _finishAppInit).
// Idempotent: multiple callers await the same in-flight promise; resolved once.
async function _loadSignaturesCache() {
  if (_sigCacheLoaded) return;
  if (_sigCachePromise) return _sigCachePromise;
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) return;
  _sigCachePromise = (async function() {
    try {
      var snap = await _firebaseDB.ref('signatures').once('value');
      var data = snap.val() || {};
      var count = 0;
      for (var key in data) {
        if (data[key] && data[key].data) { _sigCache[key] = data[key].data; count++; }
      }
      _sigCacheLoaded = true;
      console.log('[PSM] Sig cache loaded: ' + count + ' signature(s)');
      _attachSignaturesListener();
    } catch(e) {
      console.warn('[PSM] sig cache load failed:', e);
      _sigCachePromise = null; // allow retry on next call
    }
  })();
  return _sigCachePromise;
}

// Real-time listener: keeps _sigCache in sync across devices
function _attachSignaturesListener() {
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB || _sigListenerAttached) return;
  _sigListenerAttached = true;
  var ref = _firebaseDB.ref('signatures');
  ref.on('child_added', function(snap) {
    var v = snap.val();
    if (v && v.data) { _sigCache[snap.key] = v.data; _onSignatureUpdated(snap.key); }
  });
  ref.on('child_changed', function(snap) {
    var v = snap.val();
    if (v && v.data) { _sigCache[snap.key] = v.data; _onSignatureUpdated(snap.key); }
  });
  ref.on('child_removed', function(snap) {
    delete _sigCache[snap.key];
    _onSignatureUpdated(snap.key);
  });
}

// Compress an image File/Blob to a JPEG dataURL string
async function _compressImageToDataUrl(file, maxW, quality) {
  maxW = maxW || 400;
  quality = quality || 0.85;
  return new Promise(function(resolve, reject) {
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function() {
      var w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white'; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = function() { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

// Upload a signature dataURL to RTDB, returns the storage key
async function _uploadSignature(dataUrl, prefix) {
  if (typeof _firebaseDB === 'undefined' || !_firebaseDB) throw new Error('Firebase DB non disponible');
  prefix = prefix || 'sig';
  var key = prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  var entry = {
    data: dataUrl,
    contentType: 'image/jpeg',
    uploadedAt: Date.now(),
    uploadedBy: (typeof _currentUser === 'function' && _currentUser() ? (_currentUser().email || '') : '')
  };
  await _firebaseDB.ref('signatures/' + key).set(entry);
  _sigCache[key] = dataUrl;
  return key;
}

// Delete a signature from RTDB + cache
async function _deleteSignature(key) {
  if (!key || typeof _firebaseDB === 'undefined' || !_firebaseDB) return;
  try {
    await _firebaseDB.ref('signatures/' + key).remove();
    delete _sigCache[key];
  } catch(e) { console.warn('[PSM] Delete sig failed:', key, e); }
}

// Get a signature dataURL by key (returns '' if missing)
function _getSignature(key) {
  if (!key) return '';
  return _sigCache[key] || '';
}

// Universal signature renderer: handles legacy base64, key-based, or empty
function _renderSignatureImg(srcOrKey, maxHeight) {
  if (!srcOrKey) return '';
  maxHeight = maxHeight || 45;
  var src = srcOrKey;
  // Key-based lookup (new system)
  if (typeof srcOrKey === 'string' && (srcOrKey.indexOf('sig_') === 0 || srcOrKey.indexOf('photo_') === 0)) {
    src = _sigCache[srcOrKey] || '';
    if (!src) return '';
  }
  return '<img src="' + src + '" style="max-height:' + maxHeight + 'px;display:block;margin:0 auto">';
}

// Hook: called when a signature changes in real-time
// Will be overridden later by Annuaire/Bon UI to refresh open views
function _onSignatureUpdated(key) {
  // No-op default. Custom event for any listener that wants to react.
  try {
    var ev = new CustomEvent('psm-sig-updated', { detail: { key: key } });
    window.dispatchEvent(ev);
  } catch(e) {}
}

// Signature pad: attach drawing handlers to a <canvas>, returns API
function _initSignaturePad(canvas) {
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var drawing = false, lastX = 0, lastY = 0;
  function pos(e) {
    var rect = canvas.getBoundingClientRect();
    var t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - rect.left) * (canvas.width / rect.width),
             y: (t.clientY - rect.top) * (canvas.height / rect.height) };
  }
  function start(e) { e.preventDefault(); drawing = true; var p = pos(e); lastX = p.x; lastY = p.y; }
  function move(e) {
    if (!drawing) return; e.preventDefault();
    var p = pos(e);
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastX = p.x; lastY = p.y;
  }
  function end() { drawing = false; }
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
  return {
    clear: function() { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height); },
    isEmpty: function() {
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (var i = 0; i < data.length; i += 4) {
        if (data[i] < 250 || data[i+1] < 250 || data[i+2] < 250) return false;
      }
      return true;
    },
    toDataUrl: function(quality) { return canvas.toDataURL('image/jpeg', quality || 0.85); }
  };
}

// ============================================================
// -- Validator/canceller snapshot + print history helpers --
function _snapshotValidator(bon) {
  try {
    var u = (typeof _currentUser === 'function') ? _currentUser() : null;
    if (u) {
      bon._validatedBy = u.email || u.id || '';
      bon._validatedByName = u.name || u.email || '';
      // Phase 10: resolve sig -- prefer local user's signatureKey (RTDB), then profile base64, then legacy local base64
      var localUser = (APP.users || []).find(function(x) {
        return x.email && u.email && x.email.toLowerCase() === u.email.toLowerCase();
      });
      var resolvedSig = '';
      // Try signatureKey from local user, then from current profile
      if (localUser && localUser.signatureKey && typeof _getSignature === 'function') {
        resolvedSig = _getSignature(localUser.signatureKey) || '';
      }
      if (!resolvedSig && u.signatureKey && typeof _getSignature === 'function') {
        resolvedSig = _getSignature(u.signatureKey) || '';
      }
      // Fallback: base64 from profile or local user
      if (!resolvedSig) resolvedSig = u.signature || (localUser && localUser.signature) || '';
      bon._validatedBySignature = resolvedSig;
      bon._validatedByMatricule = (localUser && localUser.matricule) || u.matricule || '';
    }
  } catch(e) {}
}
// One-time backfill for old validated bons missing the validator snapshot.
// Matches each orphan bon to its VALIDATE audit entry to find the real validator.
// Returns { fixed, failed, failures } and saves DB if anything was fixed.
// Usage: open console, type _backfillBonValidators()
function _backfillBonValidators() {
  var fixed = 0, failed = 0, failures = [];
  (APP.bons || []).forEach(function(bon) {
    if (bon.status !== 'validé') return;
    if (bon._validatedBy) return; // already has snapshot
    var entries = (APP.audit || [])
      .filter(function(a) { return a.entity === 'bon' && a.entityId === bon.id && a.type === 'VALIDATE'; })
      .sort(function(a, b) { return b.ts - a.ts; });
    if (!entries.length) { failed++; failures.push(bon.numero + ' (no VALIDATE entry)'); return; }
    var entry = entries[0];
    var email = entry.userEmail;
    if (!email) { failed++; failures.push(bon.numero + ' (no userEmail in audit)'); return; }
    var user = (APP.users || []).find(function(u) {
      return u.email && u.email.toLowerCase() === email.toLowerCase();
    });
    if (!user) { failed++; failures.push(bon.numero + ' (user not found: ' + email + ')'); return; }
    // Resolve sig: signatureKey cache first, then inline base64
    var sig = '';
    if (user.signatureKey && typeof _getSignature === 'function') sig = _getSignature(user.signatureKey) || '';
    if (!sig && user.signature) sig = user.signature;
    bon._validatedBy = user.email;
    bon._validatedByName = user.name || user.email;
    bon._validatedByMatricule = user.matricule || '';
    bon._validatedBySignature = sig;
    if (!bon._validatedAt) bon._validatedAt = entry.ts;
    fixed++;
  });
  if (fixed > 0) saveDB();
  console.log('[BACKFILL] fixed:', fixed, 'failed:', failed);
  if (failures.length) console.log('[BACKFILL] failures:', failures);
  return { fixed: fixed, failed: failed, failures: failures };
}
function _snapshotCanceller(bon) {
  try {
    var u = (typeof _currentUser === 'function') ? _currentUser() : null;
    if (u) {
      bon._cancelledBy = u.email || u.id || '';
      bon._cancelledByName = u.name || u.email || '';
    }
  } catch(e) {}
}
function _recordBonPrint(bon) {
  try {
    var u = (typeof _currentUser === 'function') ? _currentUser() : null;
    var entry = {
      ts: Date.now(),
      by: u ? (u.email || u.id || '') : '',
      byName: u ? (u.name || u.email || '') : ''
    };
    if (!Array.isArray(bon._printHistory)) bon._printHistory = [];
    bon._printHistory.push(entry);
    bon._printedAt = entry.ts;
    bon._printCount = (bon._printCount || 0) + 1;
  } catch(e) {}
}

// ============================================================
// ── Bon validation: deduct stock when brouillon -> valid\u00e9 ──
function validateBon(bonId) {
  var bon = (APP.bons||[]).find(function(b){ return b.id === bonId; });
  if (!bon) { notify('Bon introuvable', 'error'); return; }
  if (bon.status !== 'brouillon') { notify('Ce bon n\u2019est pas en brouillon', 'warning'); return; }
  if (!confirm('Valider ce bon et pr\u00e9lever le stock ?')) return;
  var old = bon.status;
  if (!_handleBonStatusStockChange(bon, old, 'valid\u00e9')) return;
  bon.status = 'valid\u00e9';
  bon._validatedAt = Date.now();
  _snapshotValidator(bon);
  bon._version = (bon._version||1) + 1;
  saveDB();
  auditLog('VALIDATE', 'bon', bon.id, {status: old}, {status: bon.status});
  notify('Bon ' + bon.numero + ' valid\u00e9 \u2014 stock pr\u00e9lev\u00e9 \u2713', 'success');
  if (typeof renderBons === 'function') renderBons();
}

function cancelBon(bonId) {
  var bon = (APP.bons||[]).find(function(b){ return b.id === bonId; });
  if (!bon) { notify('Bon introuvable', 'error'); return; }
  if (bon.status === 'annul\u00e9') { notify('Ce bon est d\u00e9j\u00e0 annul\u00e9', 'info'); return; }
  var wasValidated = (bon.status === 'valid\u00e9');
  if (!confirm('Annuler ce bon ?' + (wasValidated ? ' Le stock sera restaur\u00e9.' : ''))) return;
  var old = bon.status;
  if (!_handleBonStatusStockChange(bon, old, 'annul\u00e9')) return;
  bon.status = 'annul\u00e9';
  bon._cancelledAt = Date.now();
  _snapshotCanceller(bon);
  bon._version = (bon._version||1) + 1;
  saveDB();
  auditLog('CANCEL', 'bon', bon.id, {status: old}, {status: bon.status});
  notify('Bon ' + bon.numero + ' annul\u00e9' + (wasValidated ? ' \u2014 stock restaur\u00e9' : '') + ' \u2713', 'info');
  if (typeof renderBons === 'function') renderBons();
}

function reactivateBon(bonId) {
  var bon = (APP.bons||[]).find(function(b){ return b.id === bonId; });
  if (!bon) { notify('Bon introuvable', 'error'); return; }
  if (bon.status !== 'annulé') { notify('Ce bon n’est pas annulé', 'warning'); return; }
  if (!confirm('Réactiver ce bon ? Le stock sera prélevé à nouveau.')) return;
  var old = bon.status;
  if (!_handleBonStatusStockChange(bon, old, 'validé')) return;
  bon.status = 'validé';
  bon._validatedAt = Date.now();
  _snapshotValidator(bon);
  bon._version = (bon._version||1) + 1;
  saveDB();
  auditLog('REACTIVATE', 'bon', bon.id, {status: old}, {status: bon.status});
  notify('Bon ' + bon.numero + ' réactivé — stock prélevé ✓', 'success');
  if (typeof renderBons === 'function') renderBons();
}

function undoDispatch(histIdx) {
  _dispEnsure();
  var hist = APP.dispatch.history || [];
  if(histIdx < 0 || histIdx >= hist.length) return;
  var snap = hist[histIdx];
  var ids = snap.bonIds || [];
  var toDelete = []; var blockers = []; var alreadyGone = 0;
  ids.forEach(function(bid){
    var b = (APP.bons||[]).find(function(x){ return x.id === bid; });
    if(!b) { alreadyGone++; return; }
    if(b.status === 'valid\u00e9') { blockers.push(b.numero || bid); return; }
    toDelete.push(b);
  });
  if(blockers.length > 0) {
    notify('Impossible : bon(s) d\u00e9j\u00e0 valid\u00e9(s) \u2014 ' + blockers.join(', ') + '. Annulez-les d\u2019abord.', 'error');
    return;
  }
  var msg = 'Annuler le dispatch de ' + snap.articleName + ' (' + snap.totalQty + ' unit\u00e9s) du ' + new Date(snap.ts).toLocaleString('fr-FR') + ' ?\n\n';
  if(toDelete.length > 0) msg += toDelete.length + ' bon(s) brouillon seront supprim\u00e9s.';
  else msg += 'Aucun bon li\u00e9 \u00e0 supprimer (historique seul).';
  if(!confirm(msg)) return;
  toDelete.forEach(function(b){
    auditLog('DELETE', 'bon', b.id, b, null);
    APP.bons = APP.bons.filter(function(x){ return x.id !== b.id; });
  });
  hist.splice(histIdx, 1);
  saveDB();
  auditLog('UNDO', 'dispatch', snap.articleId || '', null, { article: snap.articleName, totalQty: snap.totalQty, deletedBons: toDelete.length });
  notify('Dispatch annul\u00e9 \u2014 ' + toDelete.length + ' bon(s) brouillon supprim\u00e9(s) ✓', 'success');
  renderDispatchPage();
}

function undoMouvement(mvtId) {
  var idx = APP.mouvements.findIndex(function(m){return m.id===mvtId});
  if(idx < 0) { notify('Mouvement introuvable','error'); return; }
  var m = APP.mouvements[idx];
  // Block undo if mouvement was generated by a bon (to avoid stock/bon desync)
  if (m.note && /Bon /i.test(m.note)) {
    notify('Ce mouvement provient d\u2019un bon. Annulez ou modifiez le bon concern\u00e9 directement.', 'error');
    return;
  }
  if(!confirm('Annuler ce mouvement ?\n' + m.type + ' de ' + m.qty + ' x ' + m.articleName + '\n\nLe stock sera ajust\u00e9 en cons\u00e9quence.')) return;
  var art = APP.articles.find(function(a){return a.id===m.articleId});
  if(art) {
    if(m.type === 'sortie') art.stock += m.qty;
    else if(m.type === 'entree') art.stock = Math.max(0, art.stock - m.qty);
  }
  APP.mouvements.splice(idx, 1);
  saveDB();
  auditLog('UNDO', 'mouvement', m.articleName + ' ' + m.type + ' x' + m.qty);
  notify('Mouvement annul\u00e9 \u2014 stock ajust\u00e9 ✓', 'success');
  if(typeof renderMouvements === 'function') renderMouvements();
}

// END OF DISPATCH ENGINE
// ============================================================
// ── MOBILE MENU ──
function toggleMobMenu() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  const isOpen = sb.classList.toggle('mob-open');
  ov.classList.toggle('visible', isOpen);
}
function closeMobMenu() {
  document.getElementById('sidebar').classList.remove('mob-open');
  document.getElementById('sidebar-overlay').classList.remove('visible');
}
// Close mobile menu on nav item click
document.addEventListener('click', function(e) {
  if (e.target.closest('.sb-item') && window.innerWidth <= 600) closeMobMenu();
});

// ── MOBILE: swipe-left-to-close sidebar ──
(function(){
  var startX=0, startY=0, currentX=0, dragging=false, sb=null;
  document.addEventListener('touchstart', function(e){
    sb = document.getElementById('sidebar');
    if(!sb || !sb.classList.contains('mob-open')) return;
    var t = e.touches[0];
    startX = t.clientX; startY = t.clientY; currentX = startX;
    dragging = true;
  }, {passive:true});
  document.addEventListener('touchmove', function(e){
    if(!dragging || !sb) return;
    var t = e.touches[0]; currentX = t.clientX;
    var dx = currentX - startX, dy = Math.abs(t.clientY - startY);
    if(Math.abs(dx) < dy){ dragging = false; return; }
    if(dx < 0){
      sb.style.transform = 'translateX(' + Math.max(dx, -340) + 'px)';
      sb.style.transition = 'none';
    }
  }, {passive:true});
  document.addEventListener('touchend', function(){
    if(!dragging || !sb) return;
    dragging = false;
    sb.style.transition = ''; sb.style.transform = '';
    if(currentX - startX < -60 && typeof closeMobMenu === 'function') closeMobMenu();
  }, {passive:true});
})();


// ── Storage: File System Persistence ── (moved to storage.js)

// ============================================================
// VAGUE 2 -- ANNUAIRE module (Phase 4)
// ============================================================
var _annuaireSearchTerm = '';
var _annuaireTagFilter = 'all';

function _syncUsersToAnnuaire() {
  if (!APP.annuaire) APP.annuaire = [];
  if (!APP._annuaireTombstones) APP._annuaireTombstones = {};
  var changed = false;
  // Dedupe: fusionner les entrees liees au meme utilisateur (meme _fromUserId)
  var _byUid = {};
  APP.annuaire.forEach(function(a) {
    if (!a._fromUserId) return;
    (_byUid[a._fromUserId] = _byUid[a._fromUserId] || []).push(a);
  });
  Object.keys(_byUid).forEach(function(uid) {
    var grp = _byUid[uid];
    if (grp.length <= 1) return;
    grp.sort(function(a, b) {
      var aM = a.matricule ? 1 : 0, bM = b.matricule ? 1 : 0;
      if (aM !== bM) return bM - aM;
      var aF = [a.prenom, a.nom, a.email, a.poste, a.departement, a.telephone].filter(Boolean).length;
      var bF = [b.prenom, b.nom, b.email, b.poste, b.departement, b.telephone].filter(Boolean).length;
      if (aF !== bF) return bF - aF;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
    var keeper = grp[0];
    grp.slice(1).forEach(function(dup) {
      ['prenom','nom','email','matricule','poste','departement','telephone','tag','notes'].forEach(function(f) {
        if (!keeper[f] && dup[f]) keeper[f] = dup[f];
      });
      // Preserver includeDispatch si un des duplicats l'avait active
      if (!keeper.includeDispatch && dup.includeDispatch) keeper.includeDispatch = true;
    });
    var dupIds = grp.slice(1).map(function(d) { return d.id; });
    APP.annuaire = APP.annuaire.filter(function(a) { return dupIds.indexOf(a.id) < 0; });
    changed = true;
  });
  var users = APP.users || [];
  users.forEach(function(uu) {
    // Skip admin account
    if (uu.email && uu.email.toLowerCase() === 'ibkonate26@gmail.com') return;
    // Skip users explicitement retires de l'annuaire (tombstone)
    if (APP._annuaireTombstones[uu.id]) return;
    // Derive prenom/nom from user
    var uPrenom = uu.prenom || '';
    var uNom = uu.nom || '';
    if (!uPrenom && !uNom && uu.name) {
      var parts = uu.name.trim().split(/\s+/);
      uPrenom = parts[0] || '';
      uNom = parts.slice(1).join(' ') || '';
    }
    // Check if already linked
    var existing = APP.annuaire.find(function(a) { return a._fromUserId === uu.id; });
    if (existing) {
      // Respect l'edition manuelle: si _manualEdit est set, on ne touche
      // plus prenom/nom/email/matricule depuis le profil user.
      if (existing._manualEdit) return;
      // Update if name/email/matricule changed
      if (existing.prenom !== uPrenom || existing.nom !== uNom || existing.email !== (uu.email||'') || existing.matricule !== (uu.matricule||'')) {
        existing.prenom = uPrenom;
        existing.nom = uNom;
        existing.email = uu.email || '';
        existing.matricule = uu.matricule || '';
        existing._version = (existing._version||1) + 1;
        changed = true;
      }
    } else {
      // Also check by email to avoid duplicates with manually created entries
      var byEmail = uu.email ? APP.annuaire.find(function(a) { return a.email && a.email.toLowerCase() === uu.email.toLowerCase(); }) : null;
      if (byEmail) {
        // Link existing entry
        byEmail._fromUserId = uu.id;
        if (!byEmail.prenom && !byEmail.nom) { byEmail.prenom = uPrenom; byEmail.nom = uNom; }
        if (!byEmail.matricule && uu.matricule) byEmail.matricule = uu.matricule;
        changed = true;
      } else {
        // Create new annuaire entry
        APP.annuaire.push({
          id: 'an_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
          _fromUserId: uu.id,
          prenom: uPrenom,
          nom: uNom,
          poste: '',
          departement: '',
          telephone: '',
          email: uu.email || '',
          matricule: uu.matricule || '',
          tag: 'mixte',
          createdAt: Date.now(),
          _version: 1
        });
        changed = true;
      }
    }
  });
  if (changed) saveDB();
}

function renderAnnuaire() {
  if (!canView('annuaire')) {
    document.getElementById('content').innerHTML = '<div class="empty-state"><p>\u26d4 Acc\u00e8s refus\u00e9</p></div>';
    return;
  }
  _syncUsersToAnnuaire();
  if (!APP.annuaire) APP.annuaire = [];
  // Force all entries to 'mixte'
  var _forceMixte = false;
  (APP.annuaire||[]).forEach(function(p){ if(p.tag !== 'mixte'){ p.tag = 'mixte'; _forceMixte = true; } });
  if (_forceMixte) saveDB();
  var canEditAnn = canEdit('annuaire');
  var list = _annuaireFilteredList();
  var pill = function(val, label, color) {
    var active = _annuaireTagFilter === val;
    return `<button class="btn btn-sm" style="background:${active?color:'transparent'};color:${active?'#fff':'var(--text-2)'};border:1px solid ${color};font-size:11px;padding:5px 10px" onclick="_annuaireSetTag('${val}')">${label}</button>`;
  };
  var searchVal = (_annuaireSearchTerm||'').replace(/"/g,'&quot;');
  document.getElementById('content').innerHTML = `
    <div class="flex-between mb-16">
      <div class="page-title">\ud83d\udcd2 Annuaire</div>
      ${canEditAnn ? `<button class="btn btn-primary" onclick="openAnnuaireModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Nouvelle personne</button>` : ''}
    </div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap">
      <input type="text" id="annuaire-search" placeholder="\ud83d\udd0e Rechercher (nom, poste, matricule, email\u2026)" value="${searchVal}" oninput="_annuaireSearch(this.value)" style="flex:1;min-width:240px;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-2);color:var(--text-1)">
      <div style="display:flex;gap:6px">
        ${pill('all','Tous','var(--accent)')}
        ${pill('demandeur','Demandeur','#3d7fff')}
        ${pill('recipiendaire','R\u00e9cipiendaire','#00c875')}
        ${pill('mixte','Mixte','#f59e0b')}
      </div>
      <div style="font-size:11px;color:var(--text-2)">${list.length} / ${(APP.annuaire||[]).length}</div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Nom</th><th>Poste</th><th>D\u00e9partement</th><th>Contact</th><th>Matricule</th><th>Tag</th><th>Actions</th></tr></thead>
      <tbody id="annuaire-tbody">${list.length === 0 ? `<tr><td colspan="8"><div class="empty-state"><p>Aucune personne dans l\u2019annuaire</p></div></td></tr>` : list.map(_annuaireRow).join('')}</tbody>
    </table></div>`;
  // Restore search focus if user was typing
  setTimeout(function() {
    var s = document.getElementById('annuaire-search');
    if (s && _annuaireSearchTerm) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
  }, 0);
}

function _annuaireFilteredList() {
  var arr = ((APP && APP.annuaire) || []).slice();
  if (_annuaireTagFilter !== 'all') {
    arr = arr.filter(function(p) { return p.tag === _annuaireTagFilter; });
  }
  if (_annuaireSearchTerm) {
    var needle = _normSearch(_annuaireSearchTerm);
    arr = arr.filter(function(p) {
      var hay = _normSearch([p.prenom, p.nom, p.poste, p.departement, p.email, p.telephone, p.matricule, p.tag, p.notes].filter(Boolean).join(' '));
      return hay.indexOf(needle) >= 0;
    });
  }
  return arr.sort(function(a,b) {
    return ((a.nom||'') + (a.prenom||'')).localeCompare(((b.nom||'') + (b.prenom||'')), 'fr');
  });
}

function _annuaireSearch(v) {
  _annuaireSearchTerm = v || '';
  var tbody = document.getElementById('annuaire-tbody');
  if (!tbody) { renderAnnuaire(); return; }
  var list = _annuaireFilteredList();
  tbody.innerHTML = list.length === 0
    ? `<tr><td colspan="7"><div class="empty-state"><p>Aucun r\u00e9sultat</p></div></td></tr>`
    : list.map(_annuaireRow).join('');
}

function _annuaireSetTag(tag) {
  _annuaireTagFilter = tag;
  renderAnnuaire();
}

function _annuaireRow(p) {
  var canEditAnn = canEdit('annuaire');
  var tagColors = { demandeur:'#3d7fff', recipiendaire:'#00c875', mixte:'#f59e0b' };
  var tagLabels = { demandeur:'Demandeur', recipiendaire:'R\u00e9cipiendaire', mixte:'Mixte' };
  var tagColor = tagColors[p.tag] || 'var(--text-2)';
  var tagLabel = tagLabels[p.tag] || '\u2014';
  return `<tr>
    <td style="font-weight:600">${p.prenom||''} ${p.nom||''}${p._fromUserId ? ' <span style="font-size:8px;background:var(--accent);color:#fff;padding:1px 5px;border-radius:99px;vertical-align:middle;margin-left:4px">Auto</span>' : ''}${p.includeDispatch ? ' <span title="Concern\u00e9(e) par le dispatch" style="font-size:8px;background:#00c875;color:#fff;padding:1px 5px;border-radius:99px;vertical-align:middle;margin-left:4px">Dispatch</span>' : ''}</td>
    <td style="font-size:12px">${p.poste||'\u2014'}</td>
    <td style="font-size:12px;color:var(--text-2)">${p.departement||'\u2014'}</td>
    <td style="font-size:11px;color:var(--text-2)">${p.email||''}${p.email&&p.telephone?'<br>':''}${p.telephone||''}</td>
    <td style="font-size:12px;font-family:monospace;font-weight:700;color:var(--accent)">${p.matricule||'\u2014'}</td>
    <td><span style="background:${tagColor}22;color:${tagColor};border-radius:99px;padding:3px 9px;font-size:10px;font-weight:700">${tagLabel}</span></td>
    <td><div style="display:flex;gap:6px">
      ${canEditAnn ? `<button class="btn btn-sm btn-secondary" onclick="openAnnuaireModal('${p.id}')">\u270f\ufe0f</button>` : ''}
      ${canEditAnn ? `<button class="btn btn-sm btn-danger" onclick="deleteAnnuaire('${p.id}')">\ud83d\uddd1</button>` : ''}
    </div></td>
  </tr>`;
}

function openAnnuaireModal(id) {
  if (!canEdit('annuaire')) { notify('\u26d4 Acc\u00e8s refus\u00e9', 'warning'); return; }
  if (!APP.annuaire) APP.annuaire = [];
  var p = id ? APP.annuaire.find(function(x){ return x.id === id; }) : null;
  var body = `
    <div class="form-row">
      <div class="form-group"><label>Pr\u00e9nom *</label><input id="an-prenom" value="${(p?.prenom||'').replace(/"/g,'&quot;')}"></div>
      <div class="form-group"><label>Nom *</label><input id="an-nom" value="${(p?.nom||'').replace(/"/g,'&quot;')}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Poste / Fonction</label><input id="an-poste" value="${(p?.poste||'').replace(/"/g,'&quot;')}" placeholder="ex: Directeur Marketing"></div>
      <div class="form-group"><label>D\u00e9partement</label><input id="an-dept" value="${(p?.departement||'').replace(/"/g,'&quot;')}" placeholder="ex: Marketing"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>T\u00e9l\u00e9phone</label><input id="an-tel" value="${(p?.telephone||'').replace(/"/g,'&quot;')}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="an-email" value="${(p?.email||'').replace(/"/g,'&quot;')}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Matricule <span style="font-size:10px;color:var(--text-3)">(unique \u2014 GMA-XXX)</span></label><input id="an-matricule" value="${(p?.matricule||'').replace(/"/g,'&quot;')}" placeholder="ex: GMA-042"></div>
      <div class="form-group"><label>Tag *</label><select id="an-tag">
        <option value="demandeur"${(p&&p.tag==='demandeur')?' selected':''}>Demandeur (peut DEMANDER des bons)</option>
        <option value="recipiendaire"${(p&&p.tag==='recipiendaire')?' selected':''}>R\u00e9cipiendaire (peut RECEVOIR des bons)</option>
        <option value="mixte"${(!p||!p.tag||p.tag==='mixte')?' selected':''}>Mixte (les deux)</option>
      </select></div>
    </div>
    <div class="form-row">
      <div class="form-group" style="background:var(--bg-2);border:1px solid var(--border);border-radius:8px;padding:10px 12px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:0">
          <input type="checkbox" id="an-include-dispatch" ${p&&p.includeDispatch?'checked':''} style="width:18px;height:18px;cursor:pointer">
          <span style="font-weight:600">Concern\u00e9(e) par le dispatch</span>
        </label>
        <div style="font-size:11px;color:var(--text-3);margin-top:4px;padding-left:26px">Inclure cette personne dans la distribution automatique lors des dispatches (en plus des commerciaux).</div>
      </div>
    </div>
`;
  openModal('modal-annuaire', id ? 'Modifier personne' : 'Nouvelle personne', body, function() { saveAnnuaire(id); }, 'modal-lg');
}











async function saveAnnuaire(existingId) {
  if (!canEdit('annuaire')) { notify('\u26d4 Acc\u00e8s refus\u00e9', 'warning'); return; }
  var prenom = document.getElementById('an-prenom').value.trim();
  var nom = document.getElementById('an-nom').value.trim();
  if (!prenom || !nom) { notify('Pr\u00e9nom et nom requis', 'danger'); return; }
  var matricule = (document.getElementById('an-matricule').value||'').trim();
  if (matricule && !_isMatriculeUnique(matricule, existingId || null)) {
    notify('Matricule d\u00e9j\u00e0 utilis\u00e9 (user/commercial/annuaire)', 'error'); return;
  }
  var tag = document.getElementById('an-tag').value || 'mixte';
  var fields = {
    prenom: prenom,
    nom: nom,
    poste: document.getElementById('an-poste').value.trim(),
    departement: document.getElementById('an-dept').value.trim(),
    telephone: document.getElementById('an-tel').value.trim(),
    email: document.getElementById('an-email').value.trim(),
    matricule: matricule,
    tag: tag,
    includeDispatch: !!(document.getElementById('an-include-dispatch') && document.getElementById('an-include-dispatch').checked),
  };
  if (!APP.annuaire) APP.annuaire = [];
  if (existingId) {
    var p = APP.annuaire.find(function(x) { return x.id === existingId; });
    if (!p) return;
    var old = Object.assign({}, p);
    Object.assign(p, fields);
    // Marque l'entree comme editee manuellement: _syncUsersToAnnuaire
    // ne re-ecrasera plus prenom/nom/email/matricule depuis APP.users
    if (p._fromUserId) p._manualEdit = true;
    p._version = (p._version||1) + 1;
    auditLog('EDIT', 'annuaire', p.id, old, p);
    notify('Personne mise \u00e0 jour \u2713', 'success');
  } else {
    var np = Object.assign(
      { id: 'an_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), createdAt: Date.now(), _version: 1 },
      fields
    );
    APP.annuaire.push(np);
    auditLog('CREATE', 'annuaire', np.id, null, np);
    notify('Personne ajout\u00e9e \u2713', 'success');
  }
  saveDB();
  closeModal();
  renderAnnuaire();
}

async function deleteAnnuaire(id) {
  if (!canEdit('annuaire')) { notify('\u26d4 Acc\u00e8s refus\u00e9', 'warning'); return; }
  if (!APP.annuaire) APP.annuaire = [];
  var p = APP.annuaire.find(function(x) { return x.id === id; });
  if (!p) return;
  var _msg = 'Supprimer ' + (p.prenom||'') + ' ' + (p.nom||'') + ' de l\u2019annuaire ?';
  if (p._fromUserId) _msg += '\n\nCette personne est li\u00e9e \u00e0 un compte utilisateur. Le compte reste actif, mais l\u2019entr\u00e9e ne sera plus recr\u00e9\u00e9e automatiquement dans l\u2019annuaire.';
  if (!confirm(_msg)) return;
  if (p._fromUserId) {
    if (!APP._annuaireTombstones) APP._annuaireTombstones = {};
    APP._annuaireTombstones[p._fromUserId] = true;
  }
  APP.annuaire = APP.annuaire.filter(function(x) { return x.id !== id; });
  auditLog('DELETE', 'annuaire', id, p, null);
  saveDB();
  renderAnnuaire();
  notify('Personne supprim\u00e9e', 'warning');
}


initApp();
