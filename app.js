(function(){
  // Si déjà chargé dans cette session (F5/rechargement), masquer le splash immédiatement
  if(sessionStorage.getItem('psm_loaded')) {
    var s = document.getElementById('splash');
    if(s) s.style.display = 'none';
    var a = document.getElementById('app');
    if(a) a.classList.remove('splash-hidden');
    return;
  }

  var progress = 0;
  var labels = ["Chargement des donn\u00e9es\u2026","Initialisation\u2026","Pr\u00e9paration de l'interface\u2026","Presque pr\u00eat\u2026"];
  var labelIdx = 0;
  var interval = null;
  var started = false;

  function startProgress(){
    if(started) return; started = true;
    var bar = document.getElementById('splash-bar-fill');
    var label = document.getElementById('splash-label');
    interval = setInterval(function(){
      if(progress < 85){
        progress += Math.random() * 8 + 3;
        if(progress > 85) progress = 85;
        if(bar) bar.style.width = progress + '%';
        labelIdx = Math.min(Math.floor(progress / 25), labels.length - 1);
        if(label) label.textContent = labels[labelIdx];
      }
    }, 120);
  }

  function hideSplash(){
    clearInterval(interval);
    var bar = document.getElementById('splash-bar-fill');
    var label = document.getElementById('splash-label');
    var splash = document.getElementById('splash');
    var app = document.getElementById('app');
    if(bar) bar.style.transition = 'width 0.3s ease';
    if(bar) bar.style.width = '100%';
    if(label) label.textContent = 'Pr\u00eat !';
    setTimeout(function(){
      if(splash) splash.classList.add('splash-out');
      if(app) app.classList.remove('splash-hidden');
      // Marquer la session comme chargée — les F5 suivants skipperont le splash
      try { sessionStorage.setItem('psm_loaded', '1'); } catch(e) {}
      setTimeout(function(){
        if(splash && splash.parentNode) splash.parentNode.removeChild(splash);
      }, 750);
    }, 400);
  }

  document.addEventListener('DOMContentLoaded', function(){
    startProgress();
    var minWait = new Promise(function(res){ setTimeout(res, 2500); });
    var appReady = new Promise(function(res){
      var check = setInterval(function(){
        if(typeof APP !== 'undefined' && APP.articles !== undefined){
          clearInterval(check); res();
        }
      }, 50);
      setTimeout(function(){ clearInterval(check); res(); }, 5000);
    });
    Promise.all([minWait, appReady]).then(hideSplash);
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
    {id:'gma005',name:'Cahiers GMA A4',                           code:'MY0A136',category:'INSTITUTIONNELS',fournisseur:'TAGPLAST',     colors:'',                     description:'Cahiers GMA format A4',             unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma020',name:'Cahiers GMA A5',                           code:'MY0A236',category:'INSTITUTIONNELS',fournisseur:'TAGPLAST',     colors:'',                     description:'Cahiers GMA format A5',             unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma006',name:'Pagnes GMA (Pièces)',               code:'MY0A-PGN',category:'INSTITUTIONNELS',fournisseur:'2BPUB',       colors:'',                     description:'Pagnes GMA à la pièce',  unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma007',name:'Parasols GMA',                           code:'MY0A-PAR',category:'INSTITUTIONNELS',fournisseur:'2BPUB',       colors:'',                     description:'Parasols GMA',                     unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma008',name:'Tee-Shirt GMA (Marron, Orange et Blanc)',code:'MY0A068',category:'INSTITUTIONNELS',fournisseur:'TAGPLAST',     colors:'Marron, Orange, Blanc',description:'Tee-shirts GMA tricolore',         unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma009',name:'Casquette GMA (Beige & Blanc)',          code:'MY0A-CAS',category:'INSTITUTIONNELS',fournisseur:"POUVOIR D'ART",colors:'Beige, Blanc',        description:'Casquettes GMA bicolore',          unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    // ── SUPER-BEIGNETS ──
    {id:'gma010',name:'Tee-shirts Super-Beignets',              code:'MY0A157',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tee-shirts Super-Beignets',        unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma011',name:'Tabliers Super-Beignets Plus',           code:'MY0A159',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tabliers Super-Beignets Plus',     unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma012',name:'Seaux Super-Beignets',                   code:'MY0A161',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Seaux Super-Beignets',             unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma013',name:'Bassines Super-Beignets',                code:'MY0A120',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Bassines Super-Beignets',          unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma014',name:'Tabliers Super-Beignets Simple',         code:'MY0A121',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tabliers Super-Beignets Simple',   unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma015',name:'Tee-shirt Super-Beignets Plus',          code:'MY0A117',category:'SUPER-BEIGNETS', fournisseur:'2BPUB',        colors:'',                     description:'Tee-shirts Super-Beignets Plus',   unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    // ── 60 ANS ──
    {id:'gma016',name:'Polos 60 ans',                           code:'MY0A201',category:'60 ANS',         fournisseur:'2BPUB',        colors:'',                     description:'Polos édition 60 ans',        unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
    {id:'gma017',name:'Tee-shirt beige 60 ans',                 code:'MY0A-T60',category:'60 ANS',         fournisseur:'2BPUB',        colors:'Beige',                description:'Tee-shirts beige 60 ans',          unit:'pcs',stock:0,stockMin:5,price:0,image:'',dispatchAllocMax:0,actif:true,createdAt:0,_version:1,_gma:true},
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
    {id:'fiv1', nom:'IVA COM',       contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fs2m', nom:'S2ML',          contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'f2bp', nom:'2BPUB',         contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fpda', nom:"POUVOIR D'ART", contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'ftaj', nom:'TAJPLAST',      contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fiec', nom:'IECM',          contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0}
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
  settings: { companyName: 'GMA - Les Grands Moulins d\'Abidjan', theme: 'dark', currency: 'XOF', companyLogo: GMA_DEFAULT_LOGO, backupInterval: 5, companyAddress: 'Zone Industrielle de Vridi, 15 BP 917 Abidjan 15', companyTel: '+225 27 21 75 11 00', companyFax: '+225 27 21 75 11 01', companyEmail: 'gma@gma-ci.com', categories: [] }
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2,6); }
function fmtDate(ts) { return new Date(ts).toLocaleDateString('fr-FR'); }
function fmtDateTime(ts) { return new Date(ts).toLocaleString('fr-FR'); }
function fmtCurrency(v, cur) {
  cur = cur || APP.settings.currency || 'XOF';
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency:cur, minimumFractionDigits:0 }).format(v||0);
}
function bonNumber() {
  const year = new Date().getFullYear();
  const yearBons = APP.bons.filter(b => b.numero && b.numero.startsWith('BS-' + year + '-')).length;
  return 'BS-' + year + '-' + String(yearBons + 1).padStart(4, '0');
}
function cmdOrderNum() { return 'CF-' + new Date().getFullYear() + '-' + String((APP.commandesFourn||[]).length+1).padStart(3,'0'); }
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
function auditLog(type, entity, entityId, oldVal, newVal) {
  APP.audit.unshift({ id:generateId(), ts:Date.now(), type, entity, entityId, oldVal:JSON.stringify(oldVal), newVal:JSON.stringify(newVal) });
  if(APP.audit.length > 1000) APP.audit = APP.audit.slice(0,1000);
  saveDB();
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
  home:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></svg>',
  box:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M12 11L4 7m8 4l8-4"/></svg>',
  file:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  arrow:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>',
  users:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  truck:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  clipboard:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>',
  brain:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  shield:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  building:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="13"/><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>',
  calendar:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  edit:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  settings:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  dispatch:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4m0 0l-5 6m5-6l5 6"/></svg>',
  map:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  store:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  star:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
};

let currentPage = null;
let _bonStatusFilter = null;

const BON_STATUSES = [
  { key: 'brouillon', label: 'Brouillon', color: 'badge-yellow', icon: '📝' },
  { key: 'validé',   label: 'Validé',    color: 'badge-green',  icon: '✅' },
  { key: 'annulé',   label: 'Annulé',    color: 'badge-red',    icon: '❌' },
];


async function initApp() {
  try {
    // 1. Always load local data first
    await initFileStorage();

    // 2. Check if user has an existing Firebase session (page refresh)
    if (typeof _firebaseAuth !== 'undefined' && _firebaseAuth && navigator.onLine) {
      try {
        var session = await _checkSession();
        if (session) {
          _onlineMode = true;
          _cloudUser = session.user;
          _supabaseUser = _cloudUser; // backward compat
          await _loadUserProfile();
          try { await _loadFromCloud(); } catch(ex) {}

          // Auto-restore local session
          if (!APP.users) APP.users = [];
          var localUser = APP.users.find(function(u) { return u.email === _cloudUser.email; });
          if (localUser) {
            sessionStorage.setItem('psm_user', localUser.id);
          }
          // Start real-time sync
          if (typeof startRealtimeSync === 'function') startRealtimeSync();
        }
      } catch(e) { console.warn('[PSM] session restore:', e); }
    }

    // 3. Finish init (shows login if no session)
    await _finishAppInit();
  } catch(e) {
    console.error('[PSM] initApp failed:', e);
    try { loadDB(); renderSidebar(); showPage('dashboard'); } catch(e2) { console.error('[PSM] fallback failed:', e2); }
  }
}

async function _finishAppInit() {
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
  if(!APP.users || APP.users.length === 0) APP.users = [{ id:'admin', name:'Admin GMA', email:'ibkonate26@gmail.com', password:'Perfectionniste', role:'admin', photo:null, signature:null, permissions:null, createdAt:Date.now(), _version:1 }];
  // Migration: update old PERFECT admin to new credentials
  (function(){
    var adm = APP.users.find(function(u){ return u.id==='admin' || u.email==='admin@gma.ci' || u.email==='ibkonate26@gmail.com' || u.name==='PERFECT'; });
    if(adm) { adm.name='Admin GMA'; adm.email='ibkonate26@gmail.com'; adm.password='Perfectionniste'; adm.role='admin'; }
    // Ensure at least one admin exists
    if(!APP.users.find(function(u){ return u.role==='admin'; })) {
      APP.users.unshift({ id:'admin', name:'Admin GMA', email:'ibkonate26@gmail.com', password:'Perfectionniste', role:'admin', photo:null, signature:null, permissions:null, createdAt:Date.now(), _version:1 });
    }
  })();
  initGMAData();
  APP.commerciaux.forEach(c => dInitCommercialDispatchFields(c));
  APP.articles.forEach(a => { if(a.dispatchAllocMax === undefined) a.dispatchAllocMax = a.stock > 0 ? a.stock : 0; });
  if(!APP.dispatchHistory) APP.dispatchHistory = [];
  if(!APP.recentlyViewed) APP.recentlyViewed = [];
  // Migration: déplacer le logo GMA de localStorage vers APP.settings
  try {
    const legacyLogo = localStorage.getItem('gma_logo_b64');
    if(legacyLogo && !APP.settings.gmaLogo) { APP.settings.gmaLogo = legacyLogo; localStorage.removeItem('gma_logo_b64'); }
  } catch(e) {}
  updateFileSaveIndicator(!!_dirHandle);
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
  // Always require login — show login screen if no session
  if(!sessionStorage.getItem('psm_user')) {
    showLoginScreen();
    return;
  }
  updateUserBadge();
  startBackupScheduler();
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
    if(p.id === 'analytics') {
      const frauds = detectFraud();
      if(frauds.length > 0) item.innerHTML += `<span class="sb-badge" id="badge-fraud" style="background:var(--warning)">!</span>`;
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
  const logo = APP.settings.companyLogo || '';
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
  const titles = {
    dashboard:'Tableau de bord', articles:'Gadgets & Stocks', bons:'Bons de sortie',
    mouvements:'Mouvements de stock', commerciaux:'Commerciaux', territoire:'\ud83d\uddfa Zones & Secteurs',
    pdv:'\ud83c\udfea Points de Vente', fournisseurs:'Fournisseurs',
    'fourn-dashboard':'Suivi des livraisons', 'gma-catalogue':'\u2b50 Catalogue GMA',
    analytics:'\ud83e\udde0 Analytique', dispatch:'\u2699\ufe0f Dispatch Gadgets',
    audit:'Audit Trail', calendar:'Calendrier des Mouvements', boneditor:'\ud83c\udfa8 \u00c9diteur de Bon', administration:'\ud83d\udee1\ufe0f Administration', settings:'Param\u00e8tres'
  };
  const titleEl = document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent = titles[id] || id;
  const renders = {
    dashboard:renderDashboard, articles:renderArticles, bons:renderBons, mouvements:renderMouvements,
    commerciaux:renderCommerciaux, territoire:renderTerritoire, pdv:renderPDV,
    fournisseurs:renderFournisseurs, 'fourn-dashboard':renderFournDashboard,
    'gma-catalogue':renderGMACatalogue,
    analytics:renderAnalytics, dispatch:renderDispatchPage, audit:renderAudit, boneditor:renderBonEditor, settings:renderSettings,
    calendar:renderCalendar,
    administration:function(){ document.getElementById('content').innerHTML = renderAdminPage(); }
  };
  document.getElementById('content').innerHTML = '';
  if(renders[id]) renders[id]();
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
  guardian:  { name:'Guardian',    desc:'Command Center ⚡',    bg:'#01120e', c1:'#00dcc0', c2:'#00ff99', c3:'#010d0c', special:true },
  christian: { name:'Heritage',    desc:'Or & tradition',       bg:'#1e1710', c1:'#d4a017', c2:'#e8c547', c3:'#14100a' },
  muslim:    { name:'Emerald',     desc:'Vert & nature',        bg:'#0e1e18', c1:'#00c875', c2:'#4dde9c', c3:'#071510' },
  purple:    { name:'Nebula',      desc:'Violet cosmique',      bg:'#150e20', c1:'#9d4edd', c2:'#c77dff', c3:'#0d0814' },
  ocean:     { name:'Océan',      desc:'Bleu profond',        bg:'#0a1628', c1:'#0ea5e9', c2:'#38bdf8', c3:'#060e18' },
  rose:      { name:'Rosé',       desc:'Élégance florale',    bg:'#1e0e18', c1:'#f43f5e', c2:'#fb7185', c3:'#140a10' },
  midnight:  { name:'Midnight',   desc:'Indigo nocturne',   bg:'#0f172a', c1:'#818cf8', c2:'#a5b4fc', c3:'#020617' },
  sunset:    { name:'Sunset',     desc:'Couché de soleil',   bg:'#261008', c1:'#f97316', c2:'#fb923c', c3:'#1a0a05' },
  picture:   { name:'Fond photo',  desc:'Image personnalisée',  bg:'#0a0c10', c1:'#3d7fff', c2:'#00e5aa', c3:'#0a0c10' },
};

function applyTheme(t) {
  document.documentElement.dataset.theme = t || 'dark';
  if(t === 'picture') {
    const img = APP.settings.bgImage || '';
    document.body.style.setProperty('--bg-image', img ? 'url('+img+')' : 'none');
  } else {
    document.body.style.removeProperty('--bg-image');
  }
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
  const isPicture = cur === 'picture';
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
    (isPicture ? '<div style="border-top:1px solid var(--border);margin:8px 0 0;padding-top:8px"><button onclick="document.getElementById(\'bg-image-input\')?.click();document.getElementById(\'_tp_panel\')?.remove()" style="width:100%;padding:8px;background:var(--bg-3);border:1px dashed var(--border);border-radius:8px;color:var(--text-2);font-size:12px;cursor:pointer;font-family:inherit">📸 Changer la photo de fond</button></div>' : '');
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
  if(currentPage === 'settings') renderSettings();
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
function uploadBgImage() {
  const inp = document.createElement('input');
  inp.type='file'; inp.accept='image/*';
  inp.onchange = function(){
    const file = inp.files[0]; if(!file) return;
    if(file.size > 4*1024*1024){ notify('Image trop grande (max 4MB)','warning'); return; }
    const reader = new FileReader();
    reader.onload = function(e){
      APP.settings.bgImage = e.target.result; _imagesDirty = true;
      APP.settings.theme = 'picture';
      saveDB();
      applyTheme('picture');
      renderSettings();
      updateThemeBtn();
      notify('Image de fond appliquée ✓','success');
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}

function quickNewBon() { showPage('bons'); setTimeout(()=>openBonModal(),100); }

function updateAlertBadge() {
  const alerts = APP.articles.filter(a => a.stock <= a.stockMin);
  const b = document.getElementById('badge-articles');
  if(b) { b.textContent = alerts.length; b.style.display = alerts.length ? '' : 'none'; }
  const frauds = detectFraud();
  const fb = document.getElementById('badge-fraud');
  if(fb) { fb.style.display = frauds.length ? '' : 'none'; }
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
function exportBonPDF(id) {
  const bon = APP.bons.find(b => b.id === id);
  if (!bon) { notify('Bon introuvable', 'error'); return; }
  auditLog('DOWNLOAD', 'bon', bon.numero, null, {format: 'PDF'});
  const win = window.open('', '_blank');
  if (!win) { notify('Popup bloqu\u00e9 \u2014 autorisez les popups', 'warning'); return; }
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF \u2014 ' + bon.numero + '</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:20px;font-family:Arial,sans-serif}'
    + '@media print{body{padding:0}@page{margin:10mm;size:A4}}'
    + '.no-print{margin:16px auto;text-align:center}'
    + '@media print{.no-print{display:none}}</style></head><body>'
    + '<div class="no-print"><p style="margin-bottom:8px;color:#666;font-size:14px">'
    + '\uD83D\uDCA1 S\u00e9lectionnez <strong>"Enregistrer au format PDF"</strong> comme imprimante</p>'
    + '<button onclick="window.print()" style="padding:10px 24px;background:#f5a623;color:#000;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">'
    + '\uD83D\uDCE5 T\u00e9l\u00e9charger en PDF</button></div>'
    + generateBonHTML(bon) + '</body></html>');
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
      icon: APP.settings.companyLogo || undefined,
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
  const logo = APP.settings.companyLogo || '';
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
  <div class="grid-4 mb-16 dash-widget" data-widget="kpis">
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
        <button class="btn btn-secondary btn-sm" onclick="printDispatchReport()">⚙️ Dispatch</button>
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
  const totalQte  = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alerts    = APP.articles.filter(a => a.stock <= a.stockMin);
  const sortiesP  = APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
  const entreesP  = APP.mouvements.filter(m=>m.type==='entree'&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
  const bonsP     = APP.bons.filter(b=>b.createdAt>=tFrom&&b.createdAt<=tTo).length;
  const logo      = APP.settings.companyLogo || '';
  const addr      = APP.settings.companyAddress || '';
  const tel       = APP.settings.companyTel || '';
  const fax       = APP.settings.companyFax || '';
  const email     = APP.settings.companyEmail || '';

  // Mouvements sur la période
  const movsP = APP.mouvements.filter(m=>m.ts>=tFrom&&m.ts<=tTo).slice().sort((a,b)=>b.ts-a.ts);

  // Stock par gadget
  const stockRows = APP.articles.map(a => {
    const sorties = APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
    const entrees = APP.mouvements.filter(m=>m.type==='entree'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
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
    <thead><tr><th>Date</th><th>Type</th><th>Gadget</th><th style="text-align:center">Qté</th><th>Commercial / Fournisseur</th><th>Observations</th></tr></thead>
    <tbody>${movsP.slice(0,100).map(m=>{
      const who = m.commercialId ? APP.commerciaux.find(c=>c.id===m.commercialId) : m.fournisseurId ? APP.fournisseurs.find(f=>f.id===m.fournisseurId) : null;
      const whoLabel = who ? (who.prenom ? who.prenom+' '+who.nom : who.nom) : '—';
      return `<tr><td>${new Date(m.ts).toLocaleDateString('fr-FR')}</td><td style="color:${m.type==='entree'?'#007700':'#cc4400'};font-weight:700">${m.type==='entree'?'ENTRÉE':'SORTIE'}</td><td>${m.articleName||'—'}</td><td style="text-align:center;font-weight:700">${m.type==='entree'?'+':'−'}${m.qty}</td><td>${whoLabel}</td><td style="color:#666;font-style:italic">${m.note||m.obs||''}</td></tr>`;
    }).join('')}
    ${movsP.length>100?`<tr><td colspan="6" style="text-align:center;color:#888;font-style:italic">… ${movsP.length-100} mouvement(s) supplémentaire(s) non affichés</td></tr>`:''}
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

  const totalStock  = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alertCount  = APP.articles.filter(a => a.stock <= a.stockMin).length;
  const entreesP    = APP.mouvements.filter(m => m.type==='entree' && m.ts>=tFrom && m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
  const sortiesP    = APP.mouvements.filter(m => m.type==='sortie' && m.ts>=tFrom && m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
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
    const ent = APP.mouvements.filter(m=>m.type==='entree'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
    const sor = APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
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
  const totalQte  = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alerts    = APP.articles.filter(a => a.stock <= a.stockMin);
  const sortiesP  = APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
  const entreesP  = APP.mouvements.filter(m=>m.type==='entree'&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
  const bonsP     = APP.bons.filter(b=>b.createdAt>=tFrom&&b.createdAt<=tTo).length;
  const logo      = APP.settings.companyLogo || '';
  const addr      = APP.settings.companyAddress || '';
  const tel       = APP.settings.companyTel || '';
  const fax       = APP.settings.companyFax || '';
  const email     = APP.settings.companyEmail || '';

  const movsP = APP.mouvements.filter(m=>m.ts>=tFrom&&m.ts<=tTo).slice().sort((a,b)=>b.ts-a.ts);

  const stockRows = APP.articles.map(a => {
    const sorties = APP.mouvements.filter(m=>m.type==='sortie'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
    const entrees = APP.mouvements.filter(m=>m.type==='entree'&&m.articleId===a.id&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
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
    <thead><tr><th>Date</th><th>Type</th><th>Gadget</th><th style="text-align:center">Qté</th><th>Commercial / Fournisseur</th><th>Observations</th></tr></thead>
    <tbody>${movsP.slice(0,100).map(m=>{
      const who = m.commercialId ? APP.commerciaux.find(c=>c.id===m.commercialId) : m.fournisseurId ? APP.fournisseurs.find(f=>f.id===m.fournisseurId) : null;
      const whoLabel = who ? (who.prenom ? who.prenom+' '+who.nom : who.nom) : '—';
      return '<tr><td>'+new Date(m.ts).toLocaleDateString('fr-FR')+'</td><td style="color:'+(m.type==='entree'?'#007700':'#cc4400')+';font-weight:700">'+(m.type==='entree'?'ENTRÉE':'SORTIE')+'</td><td>'+(m.articleName||'—')+'</td><td style="text-align:center;font-weight:700">'+(m.type==='entree'?'+':'−')+m.qty+'</td><td>'+whoLabel+'</td><td style="color:#666;font-style:italic">'+(m.note||m.obs||'')+'</td></tr>';
    }).join('')}
    ${movsP.length>100?`<tr><td colspan="6" style="text-align:center;color:#888;font-style:italic">… ${movsP.length-100} mouvement(s) supplémentaire(s) non affichés</td></tr>`:''}
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
    const rules = APP.dispatch?.rules || [];
    const totalDispatched = rules.reduce((s, r) => s + (r.totalQty || 0), 0);
    dpv.innerHTML = [
      `<span class="chip">${APP.commerciaux.length} commerciaux</span>`,
      `<span class="chip">${(APP.zones||[]).length} zones</span>`,
      `<span class="chip">${activeArts.length} gadgets en stock</span>`,
      `<span class="chip" style="color:var(--accent)">${totalDispatched} unités planifiées</span>`,
      `<span class="chip" style="color:var(--text-2)">${rules.length} règles dispatch</span>`,
    ].join('');
  }
}

function drawChartCat() {
  const canvas = document.getElementById('chartCat'); if(!canvas) return;
  canvas.width = canvas.offsetWidth||300; canvas.height = 180;
  const ctx = canvas.getContext('2d');

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
    ctx.fillText('Aucun article en stock', canvas.width/2, 90);
    return;
  }

  // Theme-aware color palette
  const palette = [accent, accent2, accent3, warning, danger, '#9d4edd','#00c8ff','#f6c90e','#e040fb','#00bcd4'];

  const total = values.reduce((s,v)=>s+v,0)||1;
  let angle = -Math.PI/2;
  const cx = canvas.width/2, cy = 90, r = 70;

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
    const lx = canvas.width - 92;
    ctx.fillStyle = palette[i%palette.length];
    ctx.beginPath(); ctx.arc(lx+5, ly-3, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = textCol; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    const lbl = activeLabels[i].length>13 ? activeLabels[i].slice(0,11)+'…' : activeLabels[i];
    ctx.fillText(lbl+' ('+values[i]+')', lx+13, ly+1);
    ly += 17;
  }
  if(activeLabels.length > maxLg) {
    ctx.fillStyle = emptyCol; ctx.font = '9px sans-serif';
    ctx.fillText('+'+( activeLabels.length-maxLg)+' autres', canvas.width-92, ly+1);
  }
}

function drawChartMvt() {
  var canvas = document.getElementById('chartMvt'); if(!canvas) return;
  canvas.width = canvas.offsetWidth||300; canvas.height = 200;
  var ctx = canvas.getContext('2d');
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
  var W=canvas.width, H=canvas.height, padL=36, padB=30, padT=22, padR=10;
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

function filterArticles() {
  artSearch=document.getElementById('art-search')?.value||'';
  artCat=document.getElementById('art-cat')?.value||'all';
  artStk=document.getElementById('art-stk')?.value||'all';
  const arts=APP.articles.filter(a=>{
    const ms=!artSearch||a.name.toLowerCase().includes(artSearch.toLowerCase())||a.code.toLowerCase().includes(artSearch.toLowerCase());
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
        auditLog('edit','article',a.id,{[f.key]:oldVal},{[f.key]:a[f.key]});
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
      auditLog('edit','article',a.id,old,a);
    } else {
      const newA={id:generateId(),name,code:document.getElementById('f-code').value,category:document.getElementById('f-cat').value,unit:document.getElementById('f-unit').value,fournisseurId:document.getElementById('f-fournisseur')?.value||null,stock:parseFloat(document.getElementById('f-stock').value)||0,stockMin:parseFloat(document.getElementById('f-min').value)||0,price:parseFloat(document.getElementById('f-price').value)||0,description:document.getElementById('f-desc').value,image:imgData,createdAt:Date.now(),_version:1,_versions:[]};
      APP.articles.push(newA); auditLog('create','article',newA.id,null,newA);
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
  if(!confirm('Supprimer ce gadget ?')) return;
  const idx=APP.articles.findIndex(a=>a.id===id); if(idx<0) return;
  auditLog('delete','article',id,APP.articles[idx],null);
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
    qty: Math.abs(delta), note: mvtNote, commercialId: ''
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
    const mvt={id:generateId(),type,articleId:art.id,articleName:art.name,qty,ts:Date.now(),commercialId:comId||null,note:document.getElementById('m-note').value};
    APP.mouvements.push(mvt);
    if(type==='sortie') art.stock-=qty; else art.stock+=qty;
    auditLog(type,'article',art.id,{stock:art.stock+(type==='sortie'?qty:-qty)},{stock:art.stock});
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

function advanceBonStatus(id) {
  const b = APP.bons.find(b => b.id === id);
  if(!b) return;
  const keys = BON_STATUSES.map(s => s.key);
  const idx = keys.indexOf(b.status || 'brouillon');
  if(idx < keys.length - 1) {
    const old = b.status;
    const next = keys[idx + 1];
    if(!_handleBonStatusStockChange(b, old, next)) return;
    b.status = next;
    auditLog('edit', 'bon', b.id, {status: old}, {status: b.status});
    saveDB(); renderBons(); updateAlertBadge();
  }
}

function renderStockPredictions() {
  const predictions = (typeof predictShortages === 'function') ? predictShortages() : [];
  if(!predictions.length) { notify('Aucune rupture de stock prévue sous 30 jours ✅', 'success'); return; }
  const rows = predictions.slice(0,10).map(p =>
    `<div class="stat-row"><div><div style="font-size:13px;font-weight:600">${p.article.name}</div><div style="font-size:11px;color:var(--text-2)">${p.dailyRate}/jour — Stock: ${p.article.stock}</div></div><div><span class="badge ${p.urgency==='critical'?'badge-red':p.urgency==='high'?'badge-orange':'badge-yellow'}">${p.daysLeft===0?'Rupture!':p.daysLeft+' j'}</span></div></div>`
  ).join('');
  openModal('modal-predictions', '📊 Prévisions de rupture', `<div style="max-height:400px;overflow-y:auto">${rows}</div>`);
}
function renderBons() {
  const filtered = _bonStatusFilter
    ? APP.bons.filter(b => (b.status||'brouillon') === _bonStatusFilter)
    : APP.bons;
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">${t('bons')}</div>
    <div class="flex-center gap-8">
      <button class="btn btn-secondary btn-sm" onclick="openVerifyCodeModal()">🔐 Vérifier</button>
      <button class="btn btn-secondary btn-sm" onclick="renderStockPredictions()">📊 Réappro</button>
      <button class="btn btn-secondary btn-sm" onclick="openBulkBonModal()">📂 Import CSV</button>
      <button class="btn btn-secondary btn-sm" onclick="exportBonsJSON()">📥 Export</button>
      <button class="btn btn-primary" onclick="openBonModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Nouveau bon</button>
    </div>
  </div>
  ${renderBonPipeline()}
  <div style="font-size:11px;color:var(--text-2);margin-bottom:12px">💡 <strong>Double-cliquez</strong> sur Statut pour modifier · <strong>→</strong> pour avancer</div>
  <div class="table-wrap"><table>
    <thead><tr><th>${t('bon_number')}</th><th>${t('company')}</th><th>${t('recipient')}</th><th>${t('gadgets')}</th><th>${t('date')}</th><th>${t('status')}</th><th>${t('actions')}</th></tr></thead>
    <tbody>${filtered.length===0?`<tr><td colspan="7"><div class="empty-state"><p>Aucun bon de sortie</p></div></td></tr>`:filtered.slice().sort((a,b)=>b.createdAt-a.createdAt).map(b=>renderBonRow(b)).join('')}</tbody>
  </table></div>`;
  filtered.forEach(b=>attachBonEditors(b));
}

function renderBonRow(b) {
  const co=null; // companies removed
  const statusColor=(BON_STATUSES.find(s=>s.key===(b.status||'brouillon'))?.color)||'badge-yellow';
  return `<tr id="bon-row-${b.id}">
    <td style="font-family:monospace;font-weight:700;color:var(--accent)">${b.numero}</td>
    <td style="font-size:12px;color:var(--text-2)">${co?.shortName||co?.name||'—'}</td>
    <td style="font-size:13px">${b.recipiendaire||'—'}</td>
    <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${(b.lignes||[]).map(l=>`${l.qty}× ${l.name||l.articleName}`).join(', ')}</td>
    <td style="font-size:12px;color:var(--text-2)">${fmtDate(b.createdAt)}</td>
    <td class="editable" id="td-bstat-${b.id}"><span class="badge ${statusColor}">${(BON_STATUSES.find(s=>s.key===(b.status||'brouillon'))?.icon||'')+' '+(b.status||'brouillon')}</span></td>
    <td><div style="display:flex;gap:4px">
      <button class="btn btn-sm btn-secondary" onclick="advanceBonStatus('${b.id}')" title="Avancer le statut">→</button>
      <button class="btn btn-sm btn-secondary" onclick="previewBon('${b.id}')">👁</button>
      <button class="btn btn-sm btn-secondary" onclick="printBon('${b.id}')">🖨</button>
      <button class="btn btn-sm btn-secondary" onclick="exportBonPDF('${b.id}')" title="PDF">📥</button>
      <button class="btn btn-sm btn-secondary" onclick="openBonModal('${b.id}')">✏️</button>
      <button class="btn btn-sm btn-danger" onclick="deleteBon('${b.id}')">🗑</button>
    </div></td>
  </tr>`;
}

function _handleBonStatusStockChange(b, oldStatus, newStatus) {
  // When status changes TO annulé → restore stock
  if(newStatus === 'annulé' && oldStatus !== 'annulé') {
    (b.lignes || []).forEach(l => {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > 0) {
        art.stock += l.qty;
        APP.mouvements.unshift({
          id: generateId(), type: 'entree', ts: Date.now(),
          articleId: art.id, articleName: art.name, qty: l.qty,
          note: 'Annulation Bon ' + (b.numero||''), commercialId: b.commercialId||''
        });
        auditLog('STOCK_ENTREE','article',art.id,{stock:art.stock-l.qty},{stock:art.stock,note:'Annulation Bon '+(b.numero||'')});
      }
    });
  }
  // When status changes FROM annulé to validé → deduct stock again
  if(oldStatus === 'annulé' && newStatus === 'validé') {
    for(const l of (b.lignes||[])) {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > art.stock) { notify('Stock insuffisant pour ' + l.name + ' (Dispo: ' + art.stock + ')','error'); return false; }
    }
    (b.lignes || []).forEach(l => {
      const art = APP.articles.find(a => a.id === l.articleId);
      if(art && l.qty > 0) {
        art.stock -= l.qty;
        APP.mouvements.unshift({
          id: generateId(), type: 'sortie', ts: Date.now(),
          articleId: art.id, articleName: art.name, qty: l.qty,
          note: 'Réactivation Bon ' + (b.numero||''), commercialId: b.commercialId||''
        });
        auditLog('STOCK_SORTIE','article',art.id,{stock:art.stock+l.qty},{stock:art.stock,note:'Réactivation Bon '+(b.numero||'')});
      }
    });
  }
  return true;
}

function attachBonEditors(b) {
  const stTd=document.getElementById('td-bstat-'+b.id);
  if(stTd) stTd.ondblclick=()=>{
    makeEditable(stTd,b.status||'brouillon','select',BON_STATUSES.map(s=>s.key),(v)=>{
      const old=b.status;
      if(!_handleBonStatusStockChange(b, old, v)) return;
      b.status=v;
      auditLog('edit','bon',b.id,{status:old},{status:v}); saveDB(); updateAlertBadge();
      const row=document.getElementById('bon-row-'+b.id);
      if(row){row.outerHTML=renderBonRow(b);attachBonEditors(b);}
    });
  };
}

function openBonModal(bonId) {
  const bon = bonId ? APP.bons.find(b=>b.id===bonId) : null;
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
    <div class="form-group"><label>Statut</label><select id="bon-status"><option value="brouillon" ${bon?.status==='brouillon'?'selected':''}>Brouillon</option><option value="validé" ${!bon||bon?.status==='validé'?'selected':''}>Validé</option><option value="annulé" ${bon?.status==='annulé'?'selected':''}>Annulé</option></select></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Demandeur (Commercial)</label><select id="bon-commercial"><option value="">— Aucun —</option>${comOptions}</select></div>
    <div class="form-group"><label>Destinataire / Récipiendaire *</label><input id="bon-recip" value="${bon?.recipiendaire||''}" placeholder="Nom du destinataire"></div>
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

function saveBon(existingId) {
  const recip=document.getElementById('bon-recip').value.trim();
  if(!recip){notify('Récipendaire requis','error');return;}
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

  if(existingId) {
    const bon=APP.bons.find(b=>b.id===existingId); if(!bon) return;
    const old={...bon};
    // Restore old stock
    (bon.lignes||[]).forEach(l=>{const art=APP.articles.find(a=>a.id===l.articleId);if(art) art.stock+=l.qty;});
    // Check new stock
    for(const l of lignes){const art=APP.articles.find(a=>a.id===l.articleId);if(art&&l.qty>art.stock){notify(`Stock insuffisant pour ${l.name} (Dispo: ${art.stock})`,'error');(bon.lignes||[]).forEach(l2=>{const a=APP.articles.find(x=>x.id===l2.articleId);if(a)a.stock-=l2.qty;});return;}}
    // Deduct new
    lignes.forEach(l=>{const art=APP.articles.find(a=>a.id===l.articleId);if(art){art.stock-=l.qty;APP.mouvements.push({id:generateId(),type:'sortie',ts:Date.now(),articleId:art.id,articleName:art.name,qty:l.qty,commercialId:comId||null,note:'Modif Bon '+bon.numero});}});
    Object.assign(bon,{recipiendaire:recip,companyId:coId,commercialId:comId||null,commercialName:com?com.prenom+' '+com.nom:'',objet:document.getElementById('bon-objet').value,date:document.getElementById('bon-date').value,validite:document.getElementById('bon-validite').value,lignes,status:document.getElementById('bon-status').value,_version:(bon._version||1)+1});
    auditLog('UPDATE','bon',bon.id,old,bon);
    saveDB();closeModal();renderBons();updateAlertBadge();renderSidebar();
    notify('Bon '+bon.numero+' mis à jour','success');
    setTimeout(()=>{if(confirm('Imprimer le bon modifié ?'))printBon(bon.id);},300);
  } else {
    for(const l of lignes){const art=APP.articles.find(a=>a.id===l.articleId);if(art&&l.qty>art.stock){notify(`Stock insuffisant pour ${l.name} (Dispo: ${art.stock})`,'error');return;}}
    const bon={id:generateId(),numero:bonNumber(),companyId:coId,recipiendaire:recip,commercialId:comId||null,commercialName:com?com.prenom+' '+com.nom:'',objet:document.getElementById('bon-objet').value,date:document.getElementById('bon-date').value,validite:document.getElementById('bon-validite').value,lignes,status:document.getElementById('bon-status').value,sigDemandeur:'',sigMKT:'',createdAt:Date.now(),_version:1,_versions:[]};
    lignes.forEach(l=>{const art=APP.articles.find(a=>a.id===l.articleId);if(art){const old={...art};art.stock-=l.qty;APP.mouvements.push({id:generateId(),type:'sortie',ts:Date.now(),articleId:art.id,articleName:art.name,qty:l.qty,commercialId:comId||null,note:'Bon '+bon.numero});auditLog('STOCK_OUT','article',art.id,old,art);}});
    APP.bons.push(bon);auditLog('CREATE','bon',bon.id,null,bon);
    saveDB();closeModal();renderBons();updateAlertBadge();renderSidebar();
    notify('Bon '+bon.numero+' créé ✓','success');
    setTimeout(()=>{if(confirm('Imprimer le bon maintenant ?'))printBon(bon.id);},300);
  }
}

function deleteBon(id) {
  const bon=APP.bons.find(b=>b.id===id); if(!bon) return;
  if(!confirm(`Supprimer le bon ${bon.numero} ?\nNote : le stock sera restauré.`)) return;
  (bon.lignes||[]).forEach(l=>{const art=APP.articles.find(a=>a.id===l.articleId);if(art)art.stock+=l.qty;});
  auditLog('DELETE','bon',bon.id,bon,null);
  APP.bons=APP.bons.filter(b=>b.id!==id);
  saveDB();renderBons();updateAlertBadge();renderSidebar();
  notify('Bon '+bon.numero+' supprimé (stock restauré)','warning');
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
  openModal('verify-code', 'Vérifier un code de bon', `
    <div class="form-group">
      <label>Numéro du bon</label>
      <select id="vc-bon" onchange="vcAutoCode()">
        <option value="">— Sélectionner un bon —</option>
        ${APP.bons.map(b=>'<option value="'+b.id+'">'+b.numero+' — '+(b.recipiendaire||'')+'</option>').join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Code de vérification saisi</label>
      <input id="vc-input" maxlength="6" placeholder="Ex: A1B2C3" style="text-transform:uppercase;font-size:18px;letter-spacing:4px;font-weight:700;text-align:center">
    </div>
    <div id="vc-result" style="padding:12px;text-align:center;font-size:14px"></div>
  `);
  const inp = document.getElementById('vc-input');
  if(inp) inp.addEventListener('input', function(){ this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,''); vcCheck(); });
}
function vcAutoCode() {
  const bonId = document.getElementById('vc-bon')?.value;
  document.getElementById('vc-input').value = '';
  document.getElementById('vc-result').innerHTML = '';
  if(bonId) document.getElementById('vc-input').focus();
}
function vcCheck() {
  const bonId = document.getElementById('vc-bon')?.value;
  const input = document.getElementById('vc-input')?.value?.trim().toUpperCase();
  const resEl = document.getElementById('vc-result');
  if(!bonId || !input || input.length < 6) { resEl.innerHTML = ''; return; }
  const bon = APP.bons.find(b=>b.id===bonId);
  if(!bon) { resEl.innerHTML = '<span style="color:var(--danger)">Bon introuvable</span>'; return; }
  const expected = generateConfirmCode(bon);
  if(input === expected) {
    resEl.innerHTML = '<div style="color:var(--success);font-weight:700;font-size:16px">\u2705 CODE VALIDE</div><div style="font-size:12px;color:var(--text-2);margin-top:4px">Bon ' + bon.numero + ' authentifi\u00e9 — ' + (bon.recipiendaire||'') + '</div>';
  } else {
    resEl.innerHTML = '<div style="color:var(--danger);font-weight:700;font-size:16px">\u274c CODE INVALIDE</div><div style="font-size:12px;color:var(--text-2);margin-top:4px">Le code ne correspond pas au bon s\u00e9lectionn\u00e9</div>';
  }
}

function generateBonHTML(bon, overrides) {
  const co=null;
  const ov=overrides||{};
  const cName=ov.name||co?.name||APP.settings.companyName||'Mon Entreprise';
  const cShort=ov.shortName||co?.shortName||'';
  const cLogo=ov.logo||co?.logo||APP.settings.companyLogo||'';
  const cAddr=ov.address||co?.address||'';
  const cTel=ov.tel||co?.tel||'';
  const cFax=ov.fax||co?.fax||'';
  const cEmail=ov.email||co?.email||'';
  const cPrimary=ov.colorPrimary||co?.colorPrimary||'#111111';
  const bonTitle=ov.bonTitle||'BON DE SORTIE DE GADGETS';
  const qrSvg=`<div style="text-align:center;background:white;padding:4px"><img src="data:image/png;base64,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" style="max-width:110px;height:auto;display:block;margin:0 auto" /></div>`;
  const commercial=bon.commercialId?APP.commerciaux.find(c=>c.id===bon.commercialId):null;
  const minRows=parseInt(ov.minRows)||8;
  const dataRows=(bon.lignes||[]).map(l=>`
    <tr>
      <td style="padding:7px 10px;border:1px solid #555;font-size:12px;font-weight:700;color:#111;text-align:center">${l.code||''}</td>
      <td style="padding:7px 10px;border:1px solid #555;font-size:13px;color:#111">${l.name||l.articleName||''}</td>
      <td style="padding:7px 10px;border:1px solid #555;font-size:13px;font-weight:700;color:#111;text-align:center">${l.qty||''}</td>
      <td style="padding:7px 10px;border:1px solid #555;font-size:12px;color:#111;font-style:italic">${l.obs||''}</td>
    </tr>`).join('');
  const blankCount=Math.max(0,minRows-(bon.lignes||[]).length);
  const blankRows=Array(blankCount).fill(0).map(()=>`<tr><td style="padding:10px;border:1px solid #555;height:28px"></td><td style="padding:10px;border:1px solid #555"></td><td style="padding:10px;border:1px solid #555"></td><td style="padding:10px;border:1px solid #555"></td></tr>`).join('');
  return `<div style="background:white;color:#111;font-family:'Arial',sans-serif;max-width:800px;margin:0 auto;padding:28px 32px;box-shadow:0 2px 12px rgba(0,0,0,0.10);min-height:900px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:6px">
      <tr>
        <td style="width:42%;vertical-align:top;padding-right:16px">
          ${cLogo
            ?`<img src="${cLogo}" style="max-height:110px;max-width:220px;object-fit:contain;display:block;margin-bottom:8px">`
            :`<div style="font-size:20px;font-weight:900;color:#111;line-height:1.2;margin-bottom:6px">${cName}</div>`}
          <div style="font-size:11px;color:#222;margin-top:2px;line-height:1.6">
            ${cAddr?`<div>${cAddr}</div>`:''}
            ${(cTel||cFax)?`<div>Tél. : <strong>${cTel}</strong>${cFax?' - Fax : <strong>'+cFax+'</strong>':''}</div>`:''}
            ${cEmail?`<div>${cEmail}</div>`:''}
          </div>
          <div style="width:60%;height:2px;background:#111;margin-top:8px"></div>
        </td>
        <td style="vertical-align:top;text-align:right">
          <div style="font-size:11px;color:#111;margin-bottom:12px">Abidjan, le ....................................... 20 .........</div>
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
        <strong>DEMANDEUR :</strong> <span style="display:inline-block;width:400px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${commercial?commercial.prenom+' '+commercial.nom:'—'}</span>
      </div>
      <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:5px">
        <strong>DESTINATAIRE / RÉCIPIENDAIRE :</strong> <span style="display:inline-block;width:340px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${bon.recipiendaire||''}</span>
      </div>
      <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:10px">
        <strong>Objet / Motif :</strong> <span style="display:inline-block;width:330px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${bon.objet||''}</span>
        <span style="margin-left:16px"><strong>DU</strong> <span style="display:inline-block;width:110px;border-bottom:1px dotted #555;padding-left:8px">${bon.date||''}</span></span>
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
          <div style="font-size:11px;font-weight:700;color:#111;text-align:center;margin-bottom:8px">Demandeur / Commercial</div>
          ${bon.sigDemandeur?`<img src="${bon.sigDemandeur}" style="max-height:45px;display:block;margin:0 auto">`:''}
        </td>
        <td style="width:34%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px">Gestionnaire</div>
          ${(()=>{ const u=_currentUser(); return u&&u.signature?`<img src="${u.signature}" style="max-height:45px;display:block;margin:0 auto">`:''; })()}
        </td>
        <td style="width:33%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px">Réceptionnaire</div>
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

function previewBon(id) {
  const bon=APP.bons.find(b=>b.id===id); if(!bon) return;
  openModal('modal-bon-preview','Aperçu — '+bon.numero,`<div style="max-height:70vh;overflow:auto">${generateBonHTML(bon)}</div>`,null,'modal-xl');
}
function printBon(id) {
  const bon=APP.bons.find(b=>b.id===id); if(!bon) return;
  const win=window.open('','_blank','width=900,height=750');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bon ${bon.numero}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#f0f0f0;padding:20px;font-family:Arial,sans-serif}@media print{body{background:white;padding:0}@page{margin:10mm}}</style></head><body>${generateBonHTML(bon)}<script>window.onload=()=>{setTimeout(()=>window.print(),300)}<\/script></body></html>`);
  win.document.close();
  auditLog('PRINT','bon',bon.id,null,{numero:bon.numero});
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
    <button class="btn btn-secondary btn-sm" onclick="exportMvtCSV()">📥 Export CSV</button>
  </div>
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
  const search = (document.getElementById('mvt-search')?.value || '').toLowerCase();
  const mvts = APP.mouvements.filter(m => {
    if(type !== 'all' && m.type !== type) return false;
    if(from && m.ts < new Date(from).getTime()) return false;
    if(to   && m.ts > new Date(to).getTime() + 86399999) return false;
    if(search) {
      const art  = APP.articles.find(a => a.id === m.articleId);
      const who  = m.commercialId ? APP.commerciaux.find(c => c.id === m.commercialId) : null;
      const fourn= m.fournisseurId ? APP.fournisseurs.find(f => f.id === m.fournisseurId) : null;
      const haystack = [
        m.articleName, art?.code, art?.category,
        who ? who.prenom+' '+who.nom : '',
        fourn?.nom, m.obs, m.note
      ].join(' ').toLowerCase();
      if(!haystack.includes(search)) return false;
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
      <th>Quantité</th><th>Agent / Source</th><th>Observation</th>
    </tr></thead>
    <tbody>${mvts.length ? mvts.map(m => {
      const isE  = m.type === 'entree';
      const art  = APP.articles.find(a => a.id === m.articleId);
      const who  = m.commercialId  ? APP.commerciaux.find(c => c.id === m.commercialId)   : null;
      const fourn= m.fournisseurId ? APP.fournisseurs.find(f => f.id === m.fournisseurId) : null;
      const agentLabel = who   ? who.prenom+' '+who.nom
                        : fourn ? fourn.nom
                        : '<span style="color:var(--text-2)">—</span>';
      return `<tr>
        <td style="font-size:11px;font-family:monospace;white-space:nowrap">${fmtDateTime(m.ts)}</td>
        <td><span class="badge ${isE?'badge-green':'badge-orange'}" style="white-space:nowrap">${isE?'↑ Entrée':'↓ Sortie'}</span></td>
        <td style="font-weight:600">${m.articleName||'—'}</td>
        <td style="font-family:monospace;font-size:11px;color:var(--text-2)">${art?.code||'—'}</td>
        <td style="font-size:15px;font-weight:700;color:${isE?'var(--success)':'var(--accent3)'};white-space:nowrap">${isE?'+':'-'}${m.qty}</td>
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
    if(type==='entree') art.stock+=qty; else art.stock-=qty;
    const mvt={id:generateId(),type,ts:Date.now(),articleId:art.id,articleName:art.name,qty,
      fournisseurId:type==='entree'?(document.getElementById('mvt-founis')?.value||null):null,
      commercialId:type==='sortie'?(document.getElementById('mvt-com')?.value||null):null,
      obs:document.getElementById('mvt-obs').value};
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
  const totalPDV = APP.commerciaux.reduce((s,c)=>{
    const real = comPDVCount(c.id);
    return s + (real > 0 ? real : (c.nbClients||0));
  },0);
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
      const bonsCount = APP.bons.filter(b=>b.commercialId===c.id).length;
      const totalQty = APP.mouvements.filter(m=>m.type==='sortie'&&m.commercialId===c.id).reduce((s,m)=>s+m.qty,0);
      const realPDV = comPDVCount(c.id);
      const displayPDV = realPDV > 0 ? realPDV : (c.nbClients||0);
      const boul = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.type==='boulangerie'&&p.actif!==false).length || c.dispatchBoul||0;
      const dist = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.type==='distributeur'&&p.actif!==false).length || c.dispatchDist||0;
      const z = (APP.zones||[]).find(x=>x.id===c.dispatchZoneId);
      const secteur = (APP.secteurs||[]).find(x=>x.id===c.secteurId);
      return `<tr id="com-row-${c.id}">
        <td><div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;overflow:hidden;flex-shrink:0">${c.photo?`<img src="${c.photo}" style="width:100%;height:100%;object-fit:cover">`:(c.prenom||'?').charAt(0).toUpperCase()}</div></td>
        <td class="editable" id="td-cnom-${c.id}" style="font-weight:700">${c.nom}</td>
        <td class="editable" id="td-cprenom-${c.id}">${c.prenom}</td>
        <td class="editable" id="td-cservice-${c.id}" style="font-size:12px;color:var(--text-2)">${c.service||'—'}</td>
        <td class="editable" id="td-ctel-${c.id}" style="font-size:12px;color:var(--text-2)">${c.tel||'—'}</td>
        <td style="font-weight:700;color:${color}">${displayPDV} <span style="font-size:10px;font-weight:400;color:var(--text-2)">PDV</span></td>
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
        c[f.key]=v; auditLog('edit','commercial',c.id,{[f.key]:old},{[f.key]:v}); saveDB();
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
      <div class="form-group"><label>Service</label><input id="com-service" value="${c?.service||''}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="com-email" value="${c?.email||''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Téléphone</label><input id="com-tel" value="${c?.tel||''}"></div>
      <div class="form-group"><label>PDV total (si pas saisi manuellement)</label><input type="number" id="com-nbclients" value="${c?.nbClients||0}" min="0"></div>
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
        <div class="form-group"><label>Boulangeries</label><input type="number" id="com-dboul" value="${c?.dispatchBoul||Math.round((c?.nbClients||0)*0.65)}" min="0"></div>
        <div class="form-group"><label>Distributeurs</label><input type="number" id="com-ddist" value="${c?.dispatchDist||Math.round((c?.nbClients||0)*0.35)}" min="0"></div>
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
    </div>`,
  ()=>saveCommercial(id), 'modal-lg');
}

function saveCommercial(existingId) {
  const prenom = document.getElementById('com-prenom').value.trim();
  const nom = document.getElementById('com-nom').value.trim();
  if(!prenom||!nom){notify('Prénom et nom requis','danger');return;}
  const photo = document.getElementById('com-photo-data').value;
  const fields = {
    prenom, nom,
    service: document.getElementById('com-service').value,
    email: document.getElementById('com-email').value,
    tel: document.getElementById('com-tel').value,
    nbClients: parseInt(document.getElementById('com-nbclients').value)||0,
    dispatchBoul: parseInt(document.getElementById('com-dboul').value)||0,
    dispatchDist: parseInt(document.getElementById('com-ddist').value)||0,
    dispatchZoneId: document.getElementById('com-dzone').value||'',
    secteurId: document.getElementById('com-secteur-id').value||'',
  };
  if(existingId) {
    const c = APP.commerciaux.find(x=>x.id===existingId);
    const old = {...c};
    Object.assign(c, fields);
    if(photo) c.photo = photo;
    auditLog('edit','commercial',c.id,old,c);
    notify('Commercial mis à jour ✓','success');
  } else {
    const nc = {id:generateId(),...fields,dispatchCustomRate:null,dispatchRateLocked:false,photo:photo||'',createdAt:Date.now(),_version:1};
    APP.commerciaux.push(nc);
    auditLog('create','commercial',nc.id,null,nc);
    notify('Commercial ajouté ✓','success');
  }
  saveDB(); closeModal(); renderCommerciaux();
  const saved = APP.commerciaux.find(x=>x.prenom===prenom&&x.nom===nom);
  if(saved) dInitCommercialDispatchFields(saved);
}

function deleteCommercial(id) {
  if(!confirm('Supprimer ce commercial ? Les PDV associés seront désassignés.')) return;
  (APP.pdv||[]).forEach(p=>{ if(p.commercialId===id) p.commercialId=''; });
  const idx = APP.commerciaux.findIndex(c=>c.id===id); if(idx<0) return;
  auditLog('delete','commercial',id,APP.commerciaux[idx],null);
  APP.commerciaux.splice(idx,1); saveDB(); renderCommerciaux();
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
  let pdv = (APP.pdv||[]).filter(p => {
    if(!showInactif && p.actif===false) return false;
    if(_pdvSearch && !p.nom?.toLowerCase().includes(_pdvSearch.toLowerCase()) && !p.adresse?.toLowerCase().includes(_pdvSearch.toLowerCase())) return false;
    if(_pdvZone!=='all' && p.zoneId!==_pdvZone) return false;
    if(_pdvType!=='all' && p.type!==_pdvType) return false;
    if(_pdvCom!=='all' && p.commercialId!==_pdvCom) return false;
    return true;
  });
  const wrap = document.getElementById('pdv-table-wrap'); if(!wrap) return;
  if(!pdv.length){wrap.innerHTML='<div class="empty-state"><p>Aucun PDV trouvé</p></div>';return;}

  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr>
      <th>Nom du PDV</th><th>Type</th><th>Zone</th><th>Secteur</th><th>Commercial</th><th>Adresse</th><th>Contact</th><th>Statut</th><th>Actions</th>
    </tr></thead>
    <tbody>${pdv.map(p=>{
      const z = (APP.zones||[]).find(x=>x.id===p.zoneId);
      const s = (APP.secteurs||[]).find(x=>x.id===p.secteurId);
      const c = APP.commerciaux.find(x=>x.id===p.commercialId);
      const actif = p.actif!==false;
      return `<tr style="${actif?'':'opacity:.5'}">
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
  <div style="font-size:11px;color:var(--text-2);margin-top:8px">Affichage : ${pdv.length} PDV</div>`;
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
        f[fl.key]=v; auditLog('edit','fournisseur',f.id,{[fl.key]:old},{[fl.key]:v}); saveDB();
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
      auditLog('edit','fournisseur',f.id,old,f); notify('Fournisseur mis à jour','success');
    } else {
      const nf={id:generateId(),nom,entreprise,contact:document.getElementById('fn-contact').value,tel:document.getElementById('fn-tel').value,adresse:document.getElementById('fn-adresse').value,createdAt:Date.now()};
      APP.fournisseurs.push(nf); auditLog('create','fournisseur',nf.id,null,nf); notify('Fournisseur ajouté','success');
    }
    saveDB(); closeModal(); renderFournisseurs();
  });
}

function deleteFourn(id) {
  if(!confirm('Supprimer ce fournisseur ?')) return;
  const idx=APP.fournisseurs.findIndex(f=>f.id===id); if(idx<0) return;
  auditLog('delete','fournisseur',id,APP.fournisseurs[idx],null);
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
  auditLog('edit','article',art.id,{fournisseurId:null},{fournisseurId:fournId});
  saveDB(); notify(art.name+' assigné ✓','success');
  openFournArticlesModal(fournId);
}

function removeFournArticle(fournId, artId) {
  const art = APP.articles.find(a=>a.id===artId); if(!art) return;
  art.fournisseurId = null;
  auditLog('edit','article',art.id,{fournisseurId:fournId},{fournisseurId:null});
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
  { nom:'2BPUB',          contact:'',  tel:'27 21 35 84 93', adresse:'Côte d\'Ivoire' },
  { nom:'POUVOIR D\'ART', contact:'',  tel:'07 57 50 99 28', adresse:'Côte d\'Ivoire' },
  { nom:'TAGPLAST',        contact:'',  tel:'07 78 76 31 19', adresse:'Côte d\'Ivoire' },
];
const GMA_ARTICLES = [
  // INSTITUTIONNELS
  { name:'Chasubles GMA (Marron & Orange)',         code:'MY0A003', category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'Marron, Orange',  description:'Chasubles aux couleurs GMA' },
  { name:'Tabliers GMA (Marron & Orange)',           code:'MY0A005', category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'Marron, Orange',  description:'Tabliers aux couleurs GMA' },
  { name:'Seaux GMA',                                code:'MY0A125', category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'',               description:'Seaux GMA' },
  { name:'Pelons GMA',                               code:'MY0A058', category:'INSTITUTIONNELS',  fournisseur:'POUVOIR D\'ART',  colors:'',               description:'Pelons GMA' },
  { name:'Cahiers GMA',                              code:'MY0A136', category:'INSTITUTIONNELS',  fournisseur:'TAGPLAST',       colors:'',               description:'Cahiers GMA' },
  { name:'Pagnes GMA (Pièces)',                      code:'—',       category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'',               description:'Pagnes GMA à la pièce' },
  { name:'Parasols GMA',                             code:'—',       category:'INSTITUTIONNELS',  fournisseur:'2BPUB',          colors:'',               description:'Parasols GMA' },
  { name:'Tee-Shirt GMA (Marron, Orange et Blanc)',  code:'MY0A068', category:'INSTITUTIONNELS',  fournisseur:'TAGPLAST',       colors:'Marron, Orange, Blanc', description:'Tee-shirts GMA tricolore' },
  { name:'Casquette GMA (Beige & Blanc)',            code:'—',       category:'INSTITUTIONNELS',  fournisseur:'POUVOIR D\'ART',  colors:'Beige, Blanc',   description:'Casquettes GMA bicolore' },
  // SUPER-BEIGNETS
  { name:'Tee-shirts Super-Beignets',                code:'MY0A157', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Super-Beignets' },
  { name:'Tabliers Super-Beignets Plus',             code:'MY0A159', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Tabliers Super-Beignets Plus' },
  { name:'Seaux Super-Beignets',                     code:'MY0A161', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Seaux Super-Beignets' },
  { name:'Bassines Super-Beignets',                  code:'MY0A120', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Bassines Super-Beignets' },
  { name:'Tabliers Super-Beignets Simple',           code:'MY0A121', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',    colors:'',               description:'Tabliers Super-Beignets Simple' },
  { name:'Tee-shirt Super-Beignets Plus',            code:'MY0A117', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Super-Beignets Plus' },
  // 60 ANS
  { name:'Polos 60 ans',                             code:'MY0A201', category:'60 ANS',            fournisseur:'2BPUB',          colors:'',               description:'Polos édition 60 ans' },
  { name:'Tee-shirt beige 60 ans',                   code:'—',       category:'60 ANS',            fournisseur:'2BPUB',    colors:'Beige',          description:'Tee-shirts beige 60 ans' },
  // SOGO BALO PRO
  { name:'Tee-shirt Sogo Balo Pro',                  code:'MY0A066', category:'SOGO BALO PRO',     fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Sogo Balo Pro' },
  { name:'Seaux Sogo Balo Pro',                      code:'MY0A165', category:'SOGO BALO PRO',     fournisseur:'2BPUB',          colors:'',               description:'Seaux Sogo Balo Pro' },
];

// GMA logo storage key
const GMA_LOGO_KEY = 'gma_logo_b64';

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
    return; // STOP — la sauvegarde est la source de vérité, aucune modification
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
function renderGMACatalogue() {
  const logo = APP.settings.gmaLogo || localStorage.getItem(GMA_LOGO_KEY) || '';
  const cats = [...new Set(GMA_ARTICLES.map(a=>a.category))];
  document.getElementById('content').innerHTML = `
  <div class="gma-logo-banner anim-up">
    <div class="gma-logo-box" id="gma-logo-preview" onclick="document.getElementById('gma-logo-input').click()" title="Cliquez pour changer le logo" style="cursor:pointer">
      ${logo?`<img src="${logo}" alt="GMA Logo">`:'<span style="font-size:20px;font-weight:900;letter-spacing:-1px">GMA</span>'}
    </div>
    <input type="file" id="gma-logo-input" accept="image/*" style="display:none" onchange="saveGMALogo(this)">
    <div style="flex:1">
      <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em">Catalogue GMA</div>
      <div style="font-size:12px;color:var(--text-2);margin-top:2px">Gadgets institutionnels, goodies et gadgets GMA</div>
      <div style="font-size:11px;color:var(--accent);margin-top:4px">📸 Cliquez sur le logo pour le modifier · Cliquez sur un article pour ajouter une illustration</div>
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
  return `<div class="gma-art-card" style="animation-delay:${delay}s" onclick="openGMAArticleDetail('${a.id}')">
    <div class="gma-art-img">
      ${a.image?`<img src="${a.image}" alt="${a.name}">`:`<div class="gma-art-img-ph">📦</div>`}
      <div style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.5);border-radius:4px;padding:2px 6px;font-size:10px;color:white;font-weight:600">+Photo</div>
    </div>
    <div class="gma-art-body">
      <div class="gma-art-cat">${a.category}</div>
      <div class="gma-art-name">${a.name}</div>
      ${a.code&&a.code!=='—'?`<div class="gma-art-code">${a.code}</div>`:''}
      ${a.colors?`<div style="font-size:11px;color:var(--warning);margin-bottom:4px">🎨 ${a.colors}</div>`:''}
      <div class="gma-art-fourn">🏭 <strong>${a.fournisseur}</strong></div>
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
  const arts = APP.articles.filter(a=>a._gma && (cat==='all'||a.category===cat));
  document.getElementById('gma-grid').innerHTML = arts.map((a,i)=>renderGMACard(a,i)).join('');
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
      ${a.description?`<div style="font-size:12px;color:var(--text-2);line-height:1.6">${a.description}</div>`:''}
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
function calcCmdPct(cmd) {
  const totalCmd=(cmd.lignes||[]).reduce((s,l)=>s+(l.qteCommandee||0),0);
  const totalRecu=(cmd.lignes||[]).reduce((s,l)=>s+(l.qteRecue||0),0);
  return totalCmd>0?Math.round(totalRecu/totalCmd*100):0;
}
function calcCmdStatus(cmd) {
  const pct=calcCmdPct(cmd);
  if(pct===0)return'pending';if(pct===100)return'complete';if(cmd.status==='cancelled')return'cancelled';return'partial';
}
function getCmdStatusLabel(s){return{pending:'En attente',partial:'Partielle',complete:'Complète',cancelled:'Annulée'}[s]||s;}
function getCmdStatusClass(s){return{pending:'order-status-pending',partial:'order-status-partial',complete:'order-status-complete',cancelled:'order-status-cancelled'}[s]||'order-status-pending';}
function getCmdProgressColor(pct){if(pct===100)return'var(--success)';if(pct>=60)return'var(--accent)';if(pct>=30)return'var(--warning)';return'var(--accent3)';}

function renderFournDashboard() {
  const cmds=APP.commandesFourn||[];
  const pending=cmds.filter(c=>c.status==='pending').length;
  const partial=cmds.filter(c=>c.status==='partial').length;
  const complete=cmds.filter(c=>c.status==='complete').length;
  const totalValue=cmds.reduce((s,c)=>s+(c.lignes||[]).reduce((ls,l)=>ls+(l.qteCommandee||0)*(l.prixUnitaire||0),0),0);

  document.getElementById('content').innerHTML=`
  <div class="page-header">
    <div><div class="page-title">Suivi des livraisons</div><div class="page-sub">Commandes fournisseurs & réceptions</div></div>
    <button class="btn btn-primary" onclick="openNewCmdModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Nouvelle commande</button>
  </div>
  <div class="grid-4 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">En attente</span></div><div class="kpi-value" style="color:var(--warning)">${pending}</div><div class="kpi-change">commandes</div></div>
    <div class="card"><div class="card-header"><span class="card-title">En cours</span></div><div class="kpi-value" style="color:var(--accent)">${partial}</div><div class="kpi-change">livraisons partielles</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Complètes</span></div><div class="kpi-value" style="color:var(--success)">${complete}</div><div class="kpi-change">commandes</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Valeur totale</span></div><div class="kpi-value" style="color:var(--accent2);font-size:18px">${fmtCurrency(totalValue)}</div><div class="kpi-change">en commande</div></div>
  </div>
  <div id="fourn-cards-grid">
    ${APP.fournisseurs.length===0?'<div class="empty-state"><p>Aucun fournisseur — <button class="btn btn-sm btn-primary" onclick="showPage(\'fournisseurs\')">Ajouter</button></p></div>':
    APP.fournisseurs.map(f=>{
      const fCmds=cmds.filter(c=>c.fournisseurId===f.id);
      const fPending=fCmds.filter(c=>c.status==='pending'||c.status==='partial').length;
      const totalRecu=fCmds.reduce((s,c)=>s+calcCmdPct(c),0);
      const avgPct=fCmds.length?Math.round(totalRecu/fCmds.length):0;
      const circum=2*Math.PI*30;
      const dashOffset=circum*(1-avgPct/100);
      const focused=window._fournFocus===f.id;
      return `<div class="fourn-card${focused?' active':''}" id="fc-${f.id}" onclick="toggleFournOrders('${f.id}')">
        <div class="fourn-card-header">
          <div style="display:flex;align-items:center;gap:12px">
            <div class="fourn-avatar">${(f.nom||'?').charAt(0).toUpperCase()}</div>
            <div><div class="fourn-name">${f.nom}</div><div class="fourn-sub" style="color:var(--accent);font-weight:600">${f.entreprise||''}</div><div class="fourn-sub">${f.contact||f.adresse||''}</div></div>
          </div>
          <div style="display:flex;gap:6px">
            ${fPending>0?`<span class="badge badge-orange">⚡ ${fPending} en cours</span>`:''}
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation();openNewCmdModal('${f.id}')">+</button>
          </div>
        </div>
        <div class="gauge-wrap">
          <div class="gauge-circle">
            <svg viewBox="0 0 72 72" width="72" height="72">
              <circle class="gauge-circle-bg" cx="36" cy="36" r="30"/>
              <circle class="gauge-circle-fill" cx="36" cy="36" r="30" stroke="${getCmdProgressColor(avgPct)}" stroke-dasharray="${circum}" stroke-dashoffset="${dashOffset}"/>
            </svg>
            <div class="gauge-pct">${avgPct}%</div>
          </div>
          <div class="gauge-stats">
            ${['pending','partial','complete'].map(st=>`<div class="gauge-stat-row"><span class="gauge-stat-label">${getCmdStatusLabel(st)}</span><span class="gauge-stat-val">${fCmds.filter(c=>c.status===st).length}</span></div>`).join('')}
          </div>
        </div>
        <div id="forders-${f.id}" style="display:${focused?'block':'none'};margin-top:12px"></div>
      </div>`;
    }).join('')}
  </div>`;
  window._fournFocus=null;
  if(window._fournFocus) toggleFournOrders(window._fournFocus);
  // Auto-open if focused
  const focusId=APP.fournisseurs[0]?.id;
}

function toggleFournOrders(fournId) {
  const container=document.getElementById('forders-'+fournId);
  if(!container) return;
  const isOpen=container.style.display==='block';
  // Close all
  APP.fournisseurs.forEach(f=>{ const c=document.getElementById('forders-'+f.id); if(c)c.style.display='none'; });
  if(!isOpen) {
    container.style.display='block';
    const fCmds=(APP.commandesFourn||[]).filter(c=>c.fournisseurId===fournId).sort((a,b)=>b.createdAt-a.createdAt);
    if(!fCmds.length){container.innerHTML='<div class="empty-state" style="padding:16px"><p>Aucune commande pour ce fournisseur</p></div>';return;}
    container.innerHTML=fCmds.map(c=>{
      const pct=calcCmdPct(c);
      return renderOrderCard(c, pct);
    }).join('');
    // Attach inline save handlers after render
    fCmds.forEach(c=>attachOrderInlineEditors(c));
  }
}

function renderOrderCard(c, pct) {
  if(pct===undefined) pct=calcCmdPct(c);
  return `<div class="order-card" id="order-card-${c.id}">
    <div class="order-card-header">
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
        <span class="order-num" title="Double-cliquer pour modifier" id="onum-${c.id}" style="cursor:text">${c.numero}</span>
        <span class="order-status-badge ${getCmdStatusClass(c.status)}">${getCmdStatusLabel(c.status)}</span>
        ${c.dateLivraisonPrevue?`<span style="font-size:11px;color:var(--text-2)">📅 ${fmtDate(c.dateLivraisonPrevue)}</span>`:''}
      </div>
      <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
        <button class="btn btn-sm btn-secondary" onclick="openReceptionModal('${c.id}')">📥 Réceptionner</button>
        <button class="btn btn-sm btn-secondary" onclick="openFragLivModal('${c.id}')" title="Planifier livraisons fragmentées">📅 Planifier</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCmd('${c.id}')">🗑</button>
      </div>
    </div>
    <div style="font-size:11px;color:var(--text-2);margin-bottom:6px;padding:0 2px">✏️ Cliquez directement sur les valeurs pour les modifier</div>
    <div class="order-progress-wrap">
      <div class="order-progress-track"><div class="order-progress-fill" style="width:${pct}%;background:${getCmdProgressColor(pct)}"></div></div>
      <div class="order-progress-labels">
        <span>Commandé: ${(c.lignes||[]).reduce((s,l)=>s+(l.qteCommandee||0),0)} u.</span>
        <span style="color:var(--warning);font-weight:600">Restant: ${(c.lignes||[]).reduce((s,l)=>s+Math.max(0,(l.qteCommandee||0)-(l.qteRecue||0)),0)} u.</span>
        <span>${pct}% reçu</span>
      </div>
    </div>
    ${(c.livraisonsFragmentees&&c.livraisonsFragmentees.length)?`<div style="margin:8px 0;padding:8px 10px;background:rgba(61,127,255,0.08);border-radius:6px;border-left:3px solid var(--accent)"><div style="font-size:11px;font-weight:700;color:var(--accent);margin-bottom:4px">📅 Plan de livraisons fragmentées</div>${c.livraisonsFragmentees.map(lf=>`<div style="font-size:11px;color:var(--text-1);display:flex;justify-content:space-between;padding:2px 0"><span>${fmtDate(lf.date)}</span><span style="font-weight:600">${lf.qty} unités</span><span style="color:var(--text-2)">${lf.note||''}</span></div>`).join('')}</div>`:''} 
    <table class="order-lignes-table" style="table-layout:fixed">
      <thead><tr><th>Article</th><th style="width:100px">Commandé</th><th style="width:100px">Reçu</th><th style="width:90px">Restant</th><th style="width:90px">Prix unit.</th><th style="width:70px">Statut</th></tr></thead>
      <tbody>${(c.lignes||[]).map((l,i)=>`<tr id="ligne-tr-${c.id}-${i}">
        <td style="font-weight:500">${l.articleName}</td>
        <td><input class="inline-qty-cmd" type="number" min="0" value="${l.qteCommandee}" data-cmdid="${c.id}" data-idx="${i}" style="width:80px;padding:4px 8px;font-size:13px;font-weight:600;text-align:center"></td>
        <td><input class="inline-qty-rec" type="number" min="0" value="${l.qteRecue||0}" data-cmdid="${c.id}" data-idx="${i}" style="width:80px;padding:4px 8px;font-size:13px;font-weight:600;text-align:center;color:${(l.qteRecue||0)>=(l.qteCommandee||1)?'var(--success)':'var(--accent3)'}"></td>
        <td style="font-size:13px;font-weight:700;text-align:center;color:${(l.qteCommandee||0)-(l.qteRecue||0)>0?'var(--warning)':'var(--success)'}">${Math.max(0,(l.qteCommandee||0)-(l.qteRecue||0))}</td>
        <td><input class="inline-prix" type="number" min="0" step="0.01" value="${l.prixUnitaire||0}" data-cmdid="${c.id}" data-idx="${i}" style="width:70px;padding:4px 8px;font-size:12px;color:var(--text-2)"></td>
        <td style="text-align:center;font-size:11px">${(l.qteRecue||0)>=(l.qteCommandee||1)?'<span style="color:var(--success)">✓</span>':'<span style="color:var(--warning)">⏳</span>'}</td>
      </tr>`).join('')}</tbody>
    </table>
    ${c.note?`<div style="font-size:11px;color:var(--text-2);margin-top:8px;background:var(--bg-3);padding:6px 10px;border-radius:6px">📝 ${c.note}</div>`:''}
  </div>`;
}

function attachOrderInlineEditors(c) {
  // Inline edit: order number on dblclick
  const numEl = document.getElementById('onum-'+c.id);
  if(numEl) {
    numEl.ondblclick = () => {
      makeEditable(numEl, c.numero, 'text', null, (v)=>{
        if(v) { c.numero=v; auditLog('edit','commandeFourn',c.id,null,{numero:v}); saveDB(); refreshOrderCard(c); }
      });
    };
  }
  // Inline edit: quantities and price on change
  document.querySelectorAll(`.inline-qty-cmd[data-cmdid="${c.id}"]`).forEach(inp=>{
    inp.onchange = () => {
      const i=parseInt(inp.dataset.idx);
      const old=c.lignes[i].qteCommandee;
      c.lignes[i].qteCommandee=Math.max(0,parseInt(inp.value)||0);
      if(c.lignes[i].qteRecue>c.lignes[i].qteCommandee) c.lignes[i].qteRecue=c.lignes[i].qteCommandee;
      auditLog('edit','commandeFourn',c.id,{qteCommandee:old},{qteCommandee:c.lignes[i].qteCommandee});
      saveDB(); refreshOrderCard(c);
    };
  });
  document.querySelectorAll(`.inline-qty-rec[data-cmdid="${c.id}"]`).forEach(inp=>{
    inp.onchange = () => {
      const i=parseInt(inp.dataset.idx);
      const old=c.lignes[i].qteRecue||0;
      const newQte=Math.min(Math.max(0,parseInt(inp.value)||0), c.lignes[i].qteCommandee);
      const diff=newQte-old;
      if(diff>0){
        const art=APP.articles.find(a=>a.id===c.lignes[i].articleId);
        if(art){art.stock+=diff;APP.mouvements.push({id:generateId(),type:'entree',articleId:art.id,articleName:art.name,qty:diff,ts:Date.now(),fournisseurId:c.fournisseurId,note:'Inline réception '+c.numero});}
      }
      c.lignes[i].qteRecue=newQte;
      c.status=calcCmdStatus(c);
      auditLog('edit','commandeFourn',c.id,{qteRecue:old},{qteRecue:newQte});
      saveDB(); refreshOrderCard(c); updateAlertBadge();
      if(diff>0) notify(`+${diff} réceptionné pour "${c.lignes[i].articleName}"`, 'success');
    };
  });
  document.querySelectorAll(`.inline-prix[data-cmdid="${c.id}"]`).forEach(inp=>{
    inp.onchange = () => {
      const i=parseInt(inp.dataset.idx);
      c.lignes[i].prixUnitaire=parseFloat(inp.value)||0;
      saveDB();
    };
  });
}

function refreshOrderCard(c) {
  const card=document.getElementById('order-card-'+c.id);
  if(!card) return;
  card.outerHTML=renderOrderCard(c);
  attachOrderInlineEditors(c);
}

function openNewCmdModal(prefFournId, preselectedArts) {
  const fOptions=APP.fournisseurs.map(f=>`<option value="${f.id}" ${f.id===prefFournId?'selected':''}>${f.nom}${f.entreprise&&f.entreprise!==f.nom?' ('+f.entreprise+')':''}</option>`).join('');
  if(!APP.fournisseurs.length){notify('Ajoutez d\'abord un fournisseur','warning');return;}
  // Store artOptions globally for addCmdLigne
  window._artOptionsForCmd = [...APP.articles].sort((x,y)=>x.name.localeCompare(y.name,'fr')).map(a=>`<option value="${a.id}">${a.code&&a.code!=='—'?a.code+' — ':''}${a.name}${a.stock!==undefined?' (Stock: '+a.stock+')':''}</option>`).join('');
  const initialLines = (preselectedArts||[{artId:'',name:''}]).map(p=>`
    <div class="nc-ligne">
      <select class="nc-art">${window._artOptionsForCmd.replace(`value="${p.artId}"`,`value="${p.artId}" selected`)}</select>
      <input class="nc-qty" type="number" value="1" min="1" placeholder="Qté" title="Quantité">
      <input class="nc-prix" type="number" value="0" min="0" placeholder="Prix" title="Prix unitaire">
      <button class="btn btn-sm btn-danger" onclick="this.closest('.nc-ligne').remove()" title="Supprimer">✕</button>
    </div>`).join('');
  const body=`
  <div class="form-row">
    <div class="form-group"><label>Fournisseur *</label><select id="nc-fourn">${fOptions}</select></div>
    <div class="form-group"><label>N° Commande</label><input id="nc-num" value="${cmdOrderNum()}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Date commande</label><input type="date" id="nc-date" value="${new Date().toISOString().split('T')[0]}"></div>
    <div class="form-group"><label>Livraison prévue</label><input type="date" id="nc-dliv"></div>
  </div>
  <div class="form-group">
    <label>Gadgets commandés (vous pouvez en ajouter plusieurs)</label>
    <div style="font-size:11px;color:var(--text-2);margin-bottom:8px">Colonnes: Article · Quantité · Prix unitaire</div>
    <div id="nc-lignes">${initialLines}</div>
    <button class="add-ligne-btn" onclick="addCmdLigne()">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
      Ajouter un article
    </button>
  </div>
  <div class="form-group"><label>Note</label><textarea id="nc-note" style="min-height:60px"></textarea></div>`;
  openModal('new-cmd','Nouvelle commande fournisseur',body,()=>{
    const fournId=document.getElementById('nc-fourn').value;
    const fourn=APP.fournisseurs.find(f=>f.id===fournId);
    const lignes=[];
    document.querySelectorAll('#nc-lignes .nc-ligne').forEach(row=>{
      const artId=row.querySelector('.nc-art')?.value;
      const qty=parseInt(row.querySelector('.nc-qty')?.value)||1;
      const prix=parseFloat(row.querySelector('.nc-prix')?.value)||0;
      const art=APP.articles.find(a=>a.id===artId);
      if(art) lignes.push({articleId:art.id,articleName:art.name,qteCommandee:qty,qteRecue:0,prixUnitaire:prix});
    });
    if(!lignes.length){notify('Ajoutez au moins un gadget','danger');return;}
    const dateVal=document.getElementById('nc-date').value;
    const dlivVal=document.getElementById('nc-dliv').value;
    const cmd={id:generateId(),numero:document.getElementById('nc-num').value||cmdOrderNum(),fournisseurId:fournId,fournisseurNom:fourn?.nom||'',lignes,status:'pending',note:document.getElementById('nc-note').value,dateCommande:dateVal?new Date(dateVal).getTime():Date.now(),dateLivraisonPrevue:dlivVal?new Date(dlivVal).getTime():null,createdAt:Date.now()};
    if(!APP.commandesFourn) APP.commandesFourn=[];
    APP.commandesFourn.push(cmd);
    auditLog('create','commandeFourn',cmd.id,null,cmd);
    saveDB();closeModal();renderFournDashboard();updateAlertBadge();
    notify(`Commande créée avec ${lignes.length} gadget(s) ✓`,'success');
  },'modal-lg');
}

function addCmdLigne() {
  // Uses global _artOptionsForCmd set in openNewCmdModal
  const opts = window._artOptionsForCmd || APP.articles.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
  const div=document.createElement('div');
  div.className='nc-ligne';
  div.innerHTML=`<select class="nc-art">${opts}</select><input class="nc-qty" type="number" value="1" min="1" placeholder="Qté" title="Quantité"><input class="nc-prix" type="number" value="0" min="0" placeholder="Prix" title="Prix unitaire"><button class="btn btn-sm btn-danger" onclick="this.closest('.nc-ligne').remove()" title="Supprimer">✕</button>`;
  const container=document.getElementById('nc-lignes');
  if(container) container.appendChild(div);
}

function openReceptionModal(cmdId) {
  const c=(APP.commandesFourn||[]).find(x=>x.id===cmdId); if(!c) return;
  const pct=calcCmdPct(c);
  const body=`
  <div style="margin-bottom:16px">
    <div style="font-size:13px;font-weight:600;margin-bottom:4px">${c.numero} — ${c.fournisseurNom}</div><div style="font-size:11px;color:var(--accent);margin-bottom:4px">${(APP.fournisseurs.find(f=>f.id===c.fournisseurId)||{}).entreprise||''}</div>
    <div style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden;margin:8px 0"><div style="height:100%;width:${pct}%;background:${getCmdProgressColor(pct)};border-radius:3px"></div></div>
    <div style="font-size:11px;color:var(--text-2)">${pct}% reçu actuellement</div>
  </div>
  <div id="rec-lignes">
    ${(c.lignes||[]).map((l,i)=>`
    <div style="background:var(--bg-2);border-radius:var(--radius);padding:12px;margin-bottom:8px">
      <div style="font-size:13px;font-weight:600;margin-bottom:8px">${l.articleName}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:12px">
        <div><label style="font-size:10px">Commandé</label><input type="number" value="${l.qteCommandee}" disabled style="opacity:.6"></div>
        <div><label style="font-size:10px">Déjà reçu</label><input type="number" value="${l.qteRecue||0}" disabled style="opacity:.6"></div>
        <div><label style="font-size:10px">Total reçu maintenant ✏️</label><input class="rec-qty" type="number" value="${l.qteRecue||0}" min="0" max="${l.qteCommandee}" data-idx="${i}" data-max="${l.qteCommandee}"></div>
      </div>
    </div>`).join('')}
  </div>
  <div style="font-size:11px;color:var(--text-2);margin-top:8px">⚡ Entrez le total reçu. La différence sera ajoutée au stock automatiquement.</div>`;
  openModal('reception',`Réceptionner — ${c.numero}`,body,()=>{
    let anyChange=false;
    document.querySelectorAll('.rec-qty').forEach(inp=>{
      const idx=parseInt(inp.dataset.idx);
      const newQte=Math.min(parseInt(inp.value)||0,parseInt(inp.dataset.max)||0);
      const ligne=c.lignes[idx];
      const diff=newQte-(ligne.qteRecue||0);
      if(diff>0){
        const art=APP.articles.find(a=>a.id===ligne.articleId);
        if(art){art.stock+=diff;APP.mouvements.push({id:generateId(),type:'entree',articleId:art.id,articleName:art.name,qty:diff,ts:Date.now(),fournisseurId:c.fournisseurId,note:`Réception ${c.numero}`});}
        anyChange=true;
      }
      ligne.qteRecue=newQte;
    });
    c.status=calcCmdStatus(c);
    auditLog('edit','commandeFourn',c.id,null,{status:c.status});
    saveDB();closeModal();renderFournDashboard();updateAlertBadge();
    notify(anyChange?'Réception enregistrée, stock mis à jour ✓':'Aucun changement','success');
  });
}

function openFragLivModal(cmdId) {
  const cmd = (APP.commandesFourn||[]).find(c=>c.id===cmdId); if(!cmd) return;
  // Per-article delivery planner
  const rows = (cmd.articles||cmd.lignes||[]).map((a,i) => {
    const art = APP.articles.find(x=>x.id===a.articleId);
    const dDate = a.deliveryDate || cmd.dateLivraison || '';
    const dStatus = a.deliveryStatus || 'en_attente';
    const dQteRecue = a.qteRecue || 0;
    return '<tr><td style="font-weight:600">'+(art?art.name:a.name||'Article')+'</td><td style="text-align:center">'+a.qty+'</td><td style="text-align:center"><input type="number" class="frag-qte-recue" data-idx="'+i+'" value="'+dQteRecue+'" min="0" max="'+a.qty+'" style="width:70px;text-align:center"></td><td><input type="date" class="frag-date" data-idx="'+i+'" value="'+dDate+'" style="width:100%"></td><td><select class="frag-status" data-idx="'+i+'"><option value="en_attente" '+(dStatus==='en_attente'?'selected':'')+'>En attente</option><option value="en_cours" '+(dStatus==='en_cours'?'selected':'')+'>En cours</option><option value="livre" '+(dStatus==='livre'?'selected':'')+'>Livré</option><option value="annule" '+(dStatus==='annule'?'selected':'')+'>Annulé</option></select></td></tr>';
  }).join('');
  openModal('frag-liv','Planification livraison par article',`
    <div style="font-size:12px;color:var(--text-2);margin-bottom:8px">Commande: <strong>${cmd.ref||'CMD-'+cmd.id.slice(0,6)}</strong></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Article</th><th style="text-align:center">${t('qty_ordered')}</th><th style="text-align:center">${t('qty_received')}</th><th>${t('delivery_date')}</th><th>${t('delivery_status')}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `, () => saveFragLiv(cmdId), 'modal-lg');
}
function saveFragLiv(cmdId) {
  const cmd = (APP.commandesFourn||[]).find(c=>c.id===cmdId); if(!cmd) return;
  const arts = cmd.articles||cmd.lignes||[];
  document.querySelectorAll('.frag-qte-recue').forEach(el => {
    const i = parseInt(el.dataset.idx);
    if(arts[i]) arts[i].qteRecue = parseInt(el.value) || 0;
  });
  document.querySelectorAll('.frag-date').forEach(el => {
    const i = parseInt(el.dataset.idx);
    if(arts[i]) arts[i].deliveryDate = el.value;
  });
  document.querySelectorAll('.frag-status').forEach(el => {
    const i = parseInt(el.dataset.idx);
    if(arts[i]) arts[i].deliveryStatus = el.value;
  });
  saveDB(); closeModal();
  notify('Livraisons planifiées ✓','success');
  renderFournDashboard();
}
function _ORIGINAL_openFragLivModal(cmdId) {
  const c=(APP.commandesFourn||[]).find(x=>x.id===cmdId); if(!c) return;
  if(!c.livraisonsFragmentees) c.livraisonsFragmentees=[];
  const totalRestant=(c.lignes||[]).reduce((s,l)=>s+Math.max(0,(l.qteCommandee||0)-(l.qteRecue||0)),0);
  const existingRows=c.livraisonsFragmentees.map((lf,i)=>`
    <div style="display:grid;grid-template-columns:1fr 80px 1fr auto;gap:8px;margin-bottom:6px;align-items:center">
      <input type="date" class="frag-date" data-idx="${i}" value="${lf.date?new Date(lf.date).toISOString().split('T')[0]:''}">
      <input type="number" class="frag-qty" data-idx="${i}" value="${lf.qty}" min="1" placeholder="Qté">
      <input class="frag-note" data-idx="${i}" value="${lf.note||''}" placeholder="Note">
      <button class="btn btn-sm btn-danger" onclick="this.closest('[style]').remove()">✕</button>
    </div>`).join('');
  const body=`
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-1)">Commande: <strong>${c.numero}</strong> — Restant à recevoir: <strong style="color:var(--warning)">${totalRestant} unités</strong></div>
    <div id="frag-list">${existingRows}</div>
    <button class="btn btn-secondary btn-sm" onclick="addFragRow()" style="margin-top:4px">+ Ajouter livraison</button>
    <div style="font-size:11px;color:var(--text-2);margin-top:8px">💡 Planifiez les livraisons partielles avec dates et quantités</div>`;
  openModal('frag-liv','📅 Planifier livraisons fragmentées — '+c.numero,body,()=>{
    c.livraisonsFragmentees=[];
    document.querySelectorAll('#frag-list > div').forEach(row=>{
      const dateVal=row.querySelector('.frag-date')?.value;
      const qty=parseInt(row.querySelector('.frag-qty')?.value)||0;
      const note=row.querySelector('.frag-note')?.value||'';
      if(dateVal&&qty>0) c.livraisonsFragmentees.push({date:new Date(dateVal).getTime(),qty,note});
    });
    c.livraisonsFragmentees.sort((a,b)=>a.date-b.date);
    saveDB(); closeModal(); renderFournDashboard();
    notify('Plan de livraison enregistré ✓','success');
  },'modal-lg');
}

function addFragRow() {
  const div=document.createElement('div');
  div.style.cssText='display:grid;grid-template-columns:1fr 80px 1fr auto;gap:8px;margin-bottom:6px;align-items:center';
  div.innerHTML=`<input type="date" class="frag-date"><input type="number" class="frag-qty" min="1" placeholder="Qté"><input class="frag-note" placeholder="Note"><button class="btn btn-sm btn-danger" onclick="this.closest('[style]').remove()">✕</button>`;
  document.getElementById('frag-list')?.appendChild(div);
}

function openEditCmdModal(cmdId) {
  const c=(APP.commandesFourn||[]).find(x=>x.id===cmdId); if(!c) return;
  const body=`
  <div class="form-row">
    <div class="form-group"><label>N° Commande</label><input id="ec-num" value="${c.numero}"></div>
    <div class="form-group"><label>Statut</label><select id="ec-status"><option value="pending" ${c.status==='pending'?'selected':''}>En attente</option><option value="partial" ${c.status==='partial'?'selected':''}>Partielle</option><option value="complete" ${c.status==='complete'?'selected':''}>Complète</option><option value="cancelled" ${c.status==='cancelled'?'selected':''}>Annulée</option></select></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Date commande</label><input id="ec-date" type="date" value="${new Date(c.dateCommande).toISOString().split('T')[0]}"></div>
    <div class="form-group"><label>Livraison prévue</label><input id="ec-dliv" type="date" value="${c.dateLivraisonPrevue?new Date(c.dateLivraisonPrevue).toISOString().split('T')[0]:''}"></div>
  </div>
  <div id="ec-lignes">${(c.lignes||[]).map((l,i)=>`
    <div style="background:var(--bg-2);border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid var(--border)">
      <div style="display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;gap:10px;align-items:end">
        <div><label style="font-size:10px">Article</label><input value="${l.articleName}" disabled style="opacity:.7"></div>
        <div><label style="font-size:10px">Qté commandée</label><input class="ec-qteCmd" type="number" value="${l.qteCommandee}" data-idx="${i}" min="1"></div>
        <div><label style="font-size:10px">Qté reçue</label><input class="ec-qteRecu" type="number" value="${l.qteRecue||0}" data-idx="${i}" min="0"></div>
        <div><label style="font-size:10px">Prix unit.</label><input class="ec-prix" type="number" value="${l.prixUnitaire||0}" data-idx="${i}" min="0"></div>
      </div>
    </div>`).join('')}</div>
  <div class="form-group"><label>Note</label><textarea id="ec-note" style="min-height:60px">${c.note||''}</textarea></div>`;
  openModal('edit-cmd',`Modifier — ${c.numero}`,body,()=>{
    const old={...c};
    c.numero=document.getElementById('ec-num').value||c.numero;
    c.status=document.getElementById('ec-status').value;
    const dateVal=document.getElementById('ec-date').value; if(dateVal) c.dateCommande=new Date(dateVal).getTime();
    const dlivVal=document.getElementById('ec-dliv').value; c.dateLivraisonPrevue=dlivVal?new Date(dlivVal).getTime():null;
    c.note=document.getElementById('ec-note').value;
    document.querySelectorAll('.ec-qteCmd').forEach(inp=>{const i=parseInt(inp.dataset.idx);c.lignes[i].qteCommandee=parseInt(inp.value)||c.lignes[i].qteCommandee;});
    document.querySelectorAll('.ec-qteRecu').forEach(inp=>{const i=parseInt(inp.dataset.idx);c.lignes[i].qteRecue=Math.min(parseInt(inp.value)||0,c.lignes[i].qteCommandee);});
    document.querySelectorAll('.ec-prix').forEach(inp=>{const i=parseInt(inp.dataset.idx);c.lignes[i].prixUnitaire=parseFloat(inp.value)||0;});
    auditLog('edit','commandeFourn',c.id,old,c);
    saveDB();closeModal();renderFournDashboard();updateAlertBadge();
    notify('Commande modifiée','success');
  },'modal-lg');
}

function deleteCmd(cmdId) {
  if(!confirm('Supprimer cette commande ?')) return;
  const idx=(APP.commandesFourn||[]).findIndex(c=>c.id===cmdId); if(idx<0) return;
  auditLog('delete','commandeFourn',cmdId,APP.commandesFourn[idx],null);
  APP.commandesFourn.splice(idx,1);
  saveDB();renderFournDashboard();updateAlertBadge();
  notify('Commande supprimée','success');
}

// ============================================================
// ANALYTICS IA
// ============================================================
function detectFraud() {
  const frauds=[];
  const window30d=Date.now()-30*86400000;
  APP.commerciaux.forEach(com=>{
    const sorties=APP.mouvements.filter(m=>m.type==='sortie'&&m.commercialId===com.id&&m.ts>window30d);
    if(sorties.length<3) return;
    const artCount={};
    sorties.forEach(s=>{artCount[s.articleId]=(artCount[s.articleId]||[]).concat(s);});
    Object.entries(artCount).forEach(([artId,mvts])=>{
      if(mvts.length>=3){
        const totalQty=mvts.reduce((s,m)=>s+m.qty,0);
        const artName=mvts[0].articleName;
        const days=new Set(mvts.map(m=>new Date(m.ts).toDateString())).size;
        frauds.push({comId:com.id,comName:com.prenom+' '+com.nom,artId,artName,count:mvts.length,totalQty,days,level:mvts.length>=5?'high':'medium'});
      }
    });
    const last7d=sorties.filter(s=>s.ts>Date.now()-7*86400000);
    if(last7d.length>=5){
      if(!frauds.find(f=>f.comId===com.id&&f.type==='frequency'))
        frauds.push({comId:com.id,comName:com.prenom+' '+com.nom,type:'frequency',count:last7d.length,totalQty:last7d.reduce((s,m)=>s+m.qty,0),level:'high',note:'Fréquence élevée sur 7 jours'});
    }
  });
  return frauds;
}

function getTopArticles(limit=5) {
  const w30=Date.now()-30*86400000, artQty={};
  APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>w30).forEach(m=>{
    if(!artQty[m.articleId]) artQty[m.articleId]={id:m.articleId,name:m.articleName,qty:0,count:0};
    artQty[m.articleId].qty+=m.qty; artQty[m.articleId].count++;
  });
  return Object.values(artQty).sort((a,b)=>b.qty-a.qty).slice(0,limit);
}

function getActiveAgents(limit=5) {
  const w30=Date.now()-30*86400000, agentData={};
  APP.mouvements.filter(m=>m.type==='sortie'&&m.commercialId&&m.ts>w30).forEach(m=>{
    if(!agentData[m.commercialId]){const com=APP.commerciaux.find(c=>c.id===m.commercialId);agentData[m.commercialId]={id:m.commercialId,name:com?com.prenom+' '+com.nom:'Inconnu',qty:0,bons:0};}
    agentData[m.commercialId].qty+=m.qty;
  });
  APP.bons.filter(b=>b.commercialId&&b.createdAt>w30).forEach(b=>{
    if(agentData[b.commercialId]) agentData[b.commercialId].bons++;
    else{const com=APP.commerciaux.find(c=>c.id===b.commercialId);agentData[b.commercialId]={id:b.commercialId,name:com?com.prenom+' '+com.nom:'Inconnu',qty:0,bons:1};}
  });
  return Object.values(agentData).sort((a,b)=>b.qty-a.qty).slice(0,limit);
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
  const frauds=detectFraud(), topArts=getTopArticles(), agents=getActiveAgents();
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
  <div class="grid-2 mb-16">
    <div class="card">
      <div class="card-header"><span class="card-title">🚨 Détection de fraude</span>${frauds.length?`<span class="badge badge-red">${frauds.length} alerte${frauds.length>1?'s':''}</span>`:`<span class="badge badge-green">Aucune alerte</span>`}</div>
      ${frauds.length===0?'<div class="empty-state"><p>✅ Aucun comportement suspect détecté</p></div>':frauds.map(f=>`<div class="fraud-alert"><div class="fraud-alert-title">${f.level==='high'?'🔴':'🟡'} ${f.comName}</div><div class="fraud-alert-detail">${f.note||`<strong>${f.count} sorties</strong> de "${f.artName}" — total: ${f.totalQty} unités sur ${f.days||1} jour${(f.days||1)>1?'s':''}`}</div><div style="font-size:11px;color:var(--text-2);margin-top:4px">Risque: <strong style="color:${f.level==='high'?'var(--danger)':'var(--warning)'}">${f.level==='high'?'ÉLEVÉ':'MOYEN'}</strong></div></div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">👑 Agents les plus actifs</span><span style="font-size:11px;color:var(--text-2)">30 jours</span></div>
      ${agents.length===0?'<div class="empty-state"><p>Aucune activité</p></div>':agents.map((a,i)=>{const max=agents[0].qty||1;return`<div class="rank-item"><div class="rank-num ${i===0?'top':''}">${i+1}</div><div style="flex:1"><div style="font-size:13px;font-weight:600;margin-bottom:4px">${a.name}</div><div class="progress-bar"><div class="progress-fill" style="width:${a.qty/max*100}%;background:${i===0?'var(--warning)':'var(--accent)'}"></div></div></div><div class="text-right" style="margin-left:12px"><div style="font-weight:700;font-size:13px">${a.qty}</div><div style="font-size:11px;color:var(--text-2)">${a.bons} bons</div></div></div>`;}).join('')}
    </div>
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
  const search  = (document.getElementById('audit-search')?.value || '').toLowerCase();

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
    if(search) {
      const name = _auditEntityName(e.entity, e.entityId);
      const hay = [e.type, e.entity, e.entityId, name, e.oldVal, e.newVal].join(' ').toLowerCase();
      if(!hay.includes(search)) return false;
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
    const entityIcon = {article:'📦',bon:'📋',commercial:'👤',fournisseur:'🚛',zone:'🗺️',pdv:'🏪',bon:'📋'}[(e.entity||'').toLowerCase()] || '📝';
    return `
    <div class="audit-row" style="border-left:3px solid ${color}22;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:1">
          <span class="badge" style="background:${color}20;color:${color};white-space:nowrap">${label}</span>
          <span style="font-size:12px;font-weight:600">${entityIcon} ${e.entity||'—'}</span>
          <span style="font-size:12px;color:var(--accent);font-weight:600">${name}</span>
          ${e.entityId && e.entityId !== name ? `<span style="font-size:10px;color:var(--text-3);font-family:monospace">${e.entityId.slice(0,12)}</span>` : ''}
        </div>
        <div style="font-size:10px;color:var(--text-2);white-space:nowrap">${fmtDateTime(e.ts)}</div>
      </div>
      ${diff ? `<div style="margin-top:6px;padding:4px 8px;background:var(--bg-2);border-radius:4px;display:flex;flex-wrap:wrap;gap:4px">${diff}</div>` : ''}
    </div>`;
  }).join('');
}

function _buildAuditPrintHTML() {
  const logo = APP.settings.companyLogo || '';
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
  address:'Zone Industrielle de Vridi, 15 BP 917 Abidjan 15, C\u00f4te d\'Ivoire',
  tel:'+225 27 21 75 11 00',
  fax:'+225 27 21 75 11 01',
  email:'contact@gma-ci.com',
  colorPrimary:'#E8621A',
  colorSecondary:'#5C2E0A',
  colorAccent:'#FFFFFF',
  bonTitle:'BON DE SORTIE DE GADGETS',
  logo:'',
  minRows:8
};

function renderBonEditor() {
  const co=null;
  if(co){
    if(!bonEditorState.address&&co.address) bonEditorState.address=co.address;
    if(!bonEditorState.tel&&co.tel) bonEditorState.tel=co.tel;
    if(!bonEditorState.fax&&co.fax) bonEditorState.fax=co.fax;
    if(!bonEditorState.email&&co.email) bonEditorState.email=co.email;
    if(bonEditorState.colorPrimary==='#111111'&&co.colorPrimary) bonEditorState.colorPrimary=co.colorPrimary;
    if(bonEditorState.colorSecondary==='#333333'&&co.colorSecondary) bonEditorState.colorSecondary=co.colorSecondary;
    if(bonEditorState.colorAccent==='#999999'&&co.colorAccent) bonEditorState.colorAccent=co.colorAccent;
    if(!bonEditorState.logo&&co.logo) bonEditorState.logo=co.logo;
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
        <div class="form-group"><label>Nb lignes vides (min)</label><input type="number" id="be-rows" value="${s.minRows||8}" min="3" max="20" oninput="beLiveUpdate()"></div>
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
  s.minRows=parseInt(document.getElementById('be-rows')?.value)||8;
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
  let co=null;
  Object.assign(co,{name:s.name,shortName:s.shortName,address:s.address,tel:s.tel,fax:s.fax,email:s.email,colorPrimary:s.colorPrimary,colorSecondary:s.colorSecondary,colorAccent:s.colorAccent,colorLight:hexToLight(s.colorPrimary)});
  if(s.logo) co.logo=s.logo;
  APP.settings.companyAddress=s.address;
  APP.settings.companyTel=s.tel;
  APP.settings.companyFax=s.fax||'';
  APP.settings.companyEmail=s.email||'';
  saveDB(); updateCompanyPanel();
  notify('Paramètres GMA sauvegardés ✓','success');
  auditLog('UPDATE','company',co.id,null,{name:co.name,from:'boneditor'});
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
  document.getElementById('content').innerHTML=`
  <div class="page-title mb-16">${t('settings')}</div>
  <div class="grid-2" style="gap:16px">
    <div class="card">
      <div class="card-header"><span class="card-title">${t('company_settings')}</span></div>
      <div class="form-group"><label>Nom entreprise</label><input id="set-company" value="${s.companyName||'GMA - Les Grands Moulins d\'Abidjan'}"></div>
      <div class="form-row">
        <div class="form-group"><label>Téléphone</label><input id="set-tel" value="${s.companyTel||'+225 27 21 75 11 00'}"></div>
        <div class="form-group"><label>Fax</label><input id="set-fax" value="${s.companyFax||'+225 27 21 75 11 01'}"></div>
      </div>
      <div class="form-group"><label>Email</label><input id="set-email" value="${s.companyEmail||'gma@gma-ci.com'}"></div>
      <div class="form-group"><label>Adresse</label><input id="set-address" value="${s.companyAddress||'Zone Industrielle de Vridi, 15 BP 917 Abidjan 15'}"></div>
      <div class="form-group">
        <label>Logo entreprise</label>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <div id="set-logo-preview" onclick="document.getElementById('set-logo-file').click()"
            style="width:100px;height:100px;cursor:pointer;border-radius:10px;overflow:hidden;
                   border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;
                   background:var(--bg-2);flex-shrink:0" title="Cliquer pour changer le logo">
            ${s.companyLogo
              ? `<img src="${s.companyLogo}" style="width:100%;height:100%;object-fit:contain">`
              : `<span style="font-size:32px">🏢</span>`}
          </div>
          <input type="file" id="set-logo-file" accept="image/*" style="display:none"
            onchange="loadImgPreview('set-logo-file','set-logo-preview','set-logo-data')">
          <input type="hidden" id="set-logo-data" value="">
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('set-logo-file').click()">
              📂 Changer le logo
            </button>
            <button class="btn btn-secondary btn-sm" onclick="resetDefaultLogo()">
              ↺ Revenir au logo GMA
            </button>
            <span style="font-size:11px;color:var(--text-2)">PNG transparent recommandé · max 500KB</span>
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
          ${(APP.settings.theme==='picture')?`<div style="margin-top:10px;display:flex;gap:8px;align-items:center">
            <button class="btn btn-secondary btn-sm" onclick="uploadBgImage()">📂 Changer l'image de fond</button>
            ${APP.settings.bgImage?'<span style="font-size:11px;color:var(--text-2)">Image enregistrée ✓</span>':'<span style="font-size:11px;color:var(--text-2)">Aucune image</span>'}
          </div>`:'<div style="margin-top:8px"><button class="btn btn-secondary btn-sm" onclick="uploadBgImage()">🖼️ Thème Photo (image de fond)</button></div>'}
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
    <div class="card">
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
        <button class="btn btn-danger" onclick="resetAll()">⚠️ Reset données opérationnelles</button>
        <p style="font-size:11px;color:var(--text-2);margin-top:6px">Remet à zéro : stocks, bons, mouvements, audit, commandes, dispatch.<br>Conserve : gadgets, commerciaux, fournisseurs, zones, PDV, backups, paramètres.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">💾 Stockage Persistant</span></div>
      <div style="font-size:12px;color:var(--text-2);margin-bottom:10px">Vos données sont sauvegardées dans le dossier <strong>PSm Saves (Do Not Delete)</strong> sur votre PC — aucune dépendance au navigateur.</div>
      <div id="file-status-settings" style="font-size:12px;margin-bottom:12px;padding:10px 12px;border-radius:var(--radius);background:var(--bg-2);border:1px solid var(--border)">${_dirHandle?`✅ Dossier : <strong>${_dirHandle.name||'PSm Saves (Do Not Delete)'}</strong> — psm_data.json`:`⚠️ <strong>Aucun dossier configuré</strong>`}</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="pickSaveDirectory()">📂 Changer le dossier de sauvegarde</button>
        <button class="btn btn-secondary btn-sm" onclick="pickSaveDirectory()">📍 Utiliser un dossier existant (clé USB, OneDrive...)</button>
      </div>
    </div>
    ${_currentUser()?.role==='admin'?'<div class="card" id="user-mgmt-card"><div id="user-mgmt-content"></div></div>':''}
    <div class="card">
      <div class="card-header"><span class="card-title">🏷️ Catégories de gadgets</span><button class="btn btn-sm btn-primary" onclick="openAddCategoryModal()">+ Nouvelle catégorie</button></div>
      <div id="cat-list-settings" style="padding:4px 0"></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">🗺️ Gestion des Zones</span><button class="btn btn-sm btn-primary" onclick="openZoneModal()">+ Nouvelle zone</button></div>
      <div id="zones-list"></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">⏱ Sauvegardes automatiques</span></div>
      <div class="form-group">
        <label>Fréquence</label>
        <select id="set-backup-interval" style="margin-bottom:8px">
          <option value="0" ${(s.backupInterval||5)==0?'selected':''}>Désactivée</option>
          <option value="1" ${(s.backupInterval||5)==1?'selected':''}>1 minute</option>
          <option value="5" ${(s.backupInterval||5)==5?'selected':''}>5 minutes</option>
          <option value="15" ${(s.backupInterval||5)==15?'selected':''}>15 minutes</option>
          <option value="30" ${(s.backupInterval||5)==30?'selected':''}>30 minutes</option>
          <option value="60" ${(s.backupInterval||5)==60?'selected':''}>1 heure</option>
        </select>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="manualBackup()">💾 Sauvegarder maintenant</button> <button class="btn btn-secondary btn-sm" onclick="validateData()">🔎 Vérifier les données</button>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">📦 Backups (${APP.backups.length}/10)</span></div>
      ${APP.backups.length?APP.backups.slice().reverse().map(b=>`<div class="stat-row"><span class="stat-label">${fmtDateTime(b.ts)} · ${Math.round(b.size/1024)}KB</span><button class="btn btn-sm btn-secondary" onclick="restoreSpecificBackup('${b.id}')">Restaurer</button></div>`).join(''):'<div class="empty-state"><p>Aucun backup encore</p></div>'}
    </div>
  </div>
  <div class="card" style="margin-top:16px;background:linear-gradient(135deg,rgba(61,127,255,0.06),rgba(0,229,170,0.04));border-color:rgba(61,127,255,0.2)">
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden"><img src="data:image/png;base64,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" alt="Logo" style="width:36px;height:36px;object-fit:contain;"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:var(--text-0);margin-bottom:4px">Perfect's Stock Manager</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="badge badge-blue">Version Démo</span>
          <span style="font-size:12px;color:var(--text-2)">© Fassibiri Ibrahim Konate</span>
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
  setTimeout(()=>{ const ld=document.getElementById('set-logo-data'); if(ld) ld.value=APP.settings.companyLogo||''; const zl=document.getElementById('zones-list'); if(zl) zl.innerHTML=renderZonesList(); renderCatListSettings(); const um=document.getElementById('user-mgmt-content'); if(um) um.innerHTML=renderUserManagement(); },10);
}


// ─── Category management ────────────────────────────────────────────────────
const GMA_BUILTIN_CATS = ['INSTITUTIONNELS', 'SUPER-BEIGNETS', '60 ANS', 'SOGO BALO PRO'];

function getAllCategories() {
  const custom = APP.settings.categories || [];
  return [...new Set([...GMA_BUILTIN_CATS, ...custom])];
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
        ${!isBuiltin ? `<button class="btn btn-sm btn-secondary" onclick="deleteCategoryUI('${c}')">🗑️</button>` : ''}
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
  APP.settings.categories = (APP.settings.categories||[]).filter(c => c !== name);
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
  // Update custom list
  if(!GMA_BUILTIN_CATS.includes(oldName)) {
    APP.settings.categories = (APP.settings.categories||[]).map(c => c === oldName ? newName : c);
  } else {
    // Built-in: add new name to custom, we can't remove built-in
    if(!APP.settings.categories) APP.settings.categories = [];
    APP.settings.categories.push(newName);
  }
  // Update all articles using this category
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
  const logo = APP.settings.companyLogo || '';
  const name = APP.settings.companyName || 'Mon Entreprise';
  const addr = APP.settings.companyAddress || '';
  const tel  = APP.settings.companyTel || '';
  const comRows = APP.commerciaux.map(c => {
    const mvts = APP.mouvements.filter(m=>m.commercialId===c.id);
    const totalQty = mvts.filter(m=>m.type==='sortie').reduce((s,m)=>s+m.qty,0);
    const bons = APP.bons.filter(b=>b.commercialId===c.id);
    const zone = (APP.zones||[]).find(z=>z.id===(c.dispatchZoneId||c.zoneId));
    const pdv = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.actif!==false).length;
    // Per-article breakdown
    const artMap = {};
    mvts.filter(m=>m.type==='sortie').forEach(m => { artMap[m.articleName] = (artMap[m.articleName]||0) + m.qty; });
    const artDetail = Object.entries(artMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([n,q])=>n+': '+q).join(', ');
    return '<tr><td style="font-weight:600">'+c.prenom+' '+c.nom+'</td><td>'+(zone?zone.label:'\u2014')+'</td><td style="text-align:center">'+pdv+'</td><td style="text-align:center">'+bons.length+'</td><td style="text-align:center;font-weight:700;color:#cc4400">'+totalQty+'</td><td style="font-size:10px;color:#666">'+artDetail+'</td></tr>';
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
  var logo = APP.settings.companyLogo || '';
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

function saveSettings() {
  APP.settings.companyName=document.getElementById('set-company').value;
  APP.settings.companyTel=document.getElementById('set-tel')?.value||APP.settings.companyTel||'';
  APP.settings.companyFax=document.getElementById('set-fax')?.value||APP.settings.companyFax||'';
  APP.settings.companyEmail=document.getElementById('set-email')?.value||APP.settings.companyEmail||'';
  APP.settings.companyAddress=document.getElementById('set-address')?.value||APP.settings.companyAddress||'';
  const logo=document.getElementById('set-logo-data').value; if(logo) { APP.settings.companyLogo=logo; _imagesDirty=true; }
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
  notify('Paramètres enregistrés ✓','success');
  auditLog('UPDATE','settings',null,null,{...APP.settings,companyLogo:'[omitted]'});
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
  const c1=prompt('Tapez "RESET" pour confirmer la réinitialisation des données opérationnelles:');
  if(c1!=='RESET') return;
  const c2=prompt('Confirmation 2/2 — Tapez "OUI":');
  if(c2!=='OUI') return;
  autoBackup(true);
  // Reset operational data only — keep articles (structure), commerciaux, fournisseurs, zones, secteurs, PDV, backups, settings
  APP.articles.forEach(a => { a.stock = 0; });
  APP.bons = [];
  APP.mouvements = [];
  APP.audit = [];
  APP.commandesFourn = [];
  APP.dispatch = { besoins:{}, entities:[], weights:{pdv:50,zone:20,history:30}, zonePriority:{}, rules:{respectMin:true,respectMax:true}, history:[] };
  APP.dispatchHistory = [];
  APP.recentlyViewed = [];
  auditLog('RESET','operational',null,null,{ts:Date.now(),note:'Structural data preserved'});
  saveDB();notify('Données opérationnelles réinitialisées (gadgets, commerciaux, fournisseurs, zones, PDV, backups conservés)','success');renderSettings();renderSidebar();
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
  APP.bons.forEach(b=>{if(fuzzyMatch(b.numero,q)||fuzzyMatch(b.commercialName||'',q)||fuzzyMatch(b.recipiendaire||'',q)){results.push({type:'bon',icon:'📋',color:'#ffa502',title:b.numero,sub:`${b.recipiendaire||'—'} · ${fmtDate(b.createdAt)} · ${b.status}`,action:()=>{closeSmartSearch();showPage('bons');}});}});
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
  if(fuzzyMatch('fraude',q)||fuzzyMatch('analytique',q)||fuzzyMatch('analyse',q)) results.push({type:'page',icon:'🧠',color:'#9b59b6',title:'Analytique',sub:'Fraude, prédictions, top gadgets',action:()=>{closeSmartSearch();showPage('analytics');}});
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
  const u = userId ? (APP.users||[]).find(x=>x.id===userId) : null;
  const permHtml = ALL_PAGES_PERMS.map(p => {
    const vChecked = u?.permissions?.[p.id]?.view ? 'checked' : (!userId || u?.role==='admin' ? 'checked' : '');
    const eChecked = u?.permissions?.[p.id]?.edit ? 'checked' : (!userId || u?.role==='admin' ? 'checked' : '');
    return `<tr>
      <td style="font-size:12px;padding:3px 6px">${p.label}</td>
      <td style="text-align:center;padding:3px 6px"><input type="checkbox" ${vChecked} id="perm-v-${p.id}"></td>
      <td style="text-align:center;padding:3px 6px"><input type="checkbox" ${eChecked} id="perm-e-${p.id}"></td>
    </tr>`;
  }).join('');

  openModal(userId ? 'Modifier utilisateur' : 'Nouvel utilisateur', `
    <div class="form-row">
      <div class="form-group"><label>Nom *</label><input id="um-name" value="${u?.name||''}"></div>
      <div class="form-group"><label>Email</label><input id="um-email" value="${u?.email||''}" type="email"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Mot de passe ${userId ? '<span style="font-size:10px;color:var(--text-3)">(laisser vide = inchang\u00e9)</span>' : '<span style="font-size:10px;color:var(--danger)">* obligatoire</span>'}</label><input id="um-pass" type="text" placeholder="${userId ? 'Laisser vide = inchang\u00e9' : 'Min. 6 caract\u00e8res'}" value="" autocomplete="off">${userId && u ? '<div style="font-size:10px;color:var(--text-3);margin-top:2px">\u2705 Mot de passe d\u00e9j\u00e0 d\u00e9fini</div>' : ''}</div>
      <div class="form-group"><label>R\u00f4le</label><select id="um-role" onchange="_onRoleChange(this.value)">
        ${typeof ROLE_TEMPLATES!=='undefined' ? Object.keys(ROLE_TEMPLATES).map(function(k){ return '<option value="'+k+'" '+(u&&u.role===k?'selected':'')+'>'+ROLE_TEMPLATES[k].label+'</option>'; }).join('') : '<option value="user">Utilisateur</option><option value="admin">Administrateur</option>'}
      </select></div>
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
    <div class="form-group" id="um-sig-section">
      <label>Signature digitalis\u00e9e (optionnel)</label>
      <div style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap">
        <div id="um-sig-preview" style="width:120px;height:50px;background:var(--bg-2);border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;border-radius:6px;overflow:hidden">
          ${u?.signature?`<img src="${u.signature}" style="max-width:120px;max-height:50px;object-fit:contain">`: '<span style="font-size:11px;color:var(--text-3)">Aucune</span>'}
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('um-sig-input').click()">\uD83D\uDCC1 Importer image</button>
          <button class="btn btn-secondary btn-sm" onclick="openSigDrawCanvas()">\u270D\uFE0F Dessiner signature</button>
        </div>
        <input type="file" id="um-sig-input" accept="image/*" style="display:none" onchange="previewUserSignature(this)">
        <input type="hidden" id="um-sig-data" value="${u?.signature||''}">
      </div>
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
  const prev = document.getElementById('um-sig-preview');
  if(prev) prev.innerHTML = '<img src="' + dataUrl + '" style="max-width:120px;max-height:50px;object-fit:contain">';
  document.getElementById('um-sig-canvas-wrap').style.display = 'none';
  notify('Signature captur\u00e9e \u2713', 'success');
}

async function saveUserModal(userId) {
  if(_currentUser()?.role !== 'admin') { notify('\u26d4 Action r\u00e9serv\u00e9e', 'warning'); return; }
  const name  = document.getElementById('um-name')?.value?.trim();
  const email = document.getElementById('um-email')?.value?.trim();
  const pass  = document.getElementById('um-pass')?.value?.trim() || null;
  const role  = document.getElementById('um-role')?.value || 'viewer';
  const photo = document.getElementById('um-photo-data')?.value || null;
  const sig   = document.getElementById('um-sig-data')?.value || null;
  if(!name) { notify('Le nom est obligatoire', 'warning'); return; }
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
  }

  if(!APP.users) APP.users = [];

  try {
    if(userId) {
      // ── EDIT existing user ──
      const u = APP.users.find(x => x.id === userId);
      if(u) {
        u.name = name; u.email = email; u.role = role; u.permissions = permissions;
        if(photo) u.photo = photo;
        if(sig) u.signature = sig;
        u._version = (u._version||1) + 1;
      }
      // Update Supabase profile
      if(typeof _adminUpdateProfile === 'function' && _firebaseDB && _cloudUser) {
        try { await _adminUpdateProfile(email, name, role, permissions, true); } catch(e) { console.warn('[PSM] profile update:', e); }
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
        APP.users.push({ id: generateId(), name: name, email: email, password: null, role: role, photo: photo||null, signature: sig||null, permissions: permissions, createdAt: Date.now(), _version: 1 });
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
  var userEmail = user ? user.email : null;
  APP.users = (APP.users||[]).filter(u => u.id !== userId);
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
    } catch(e) { console.warn('[PSM] Firebase profile delete error:', e); }
    if(typeof logActivity === 'function') logActivity('admin_delete_user', 'Suppression: ' + userEmail);
  }

  saveDB();
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

function renderAdminPage() {
  var u = _currentUser();
  if (!u || u.role !== 'admin') return '<div class="empty-state"><p>\u26d4 R\u00e9serv\u00e9 aux administrateurs</p></div>';

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
      + '<div style="font-weight:700;font-size:14px">' + uu.name + (uu.id === u.id ? ' <span style="font-size:10px;color:var(--accent)">(vous)</span>' : '') + '</div>'
      + '<div style="font-size:12px;color:var(--text-2)">' + (uu.email || '\u2014') + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">'
      + '<span style="font-size:10px;background:' + roleMeta.color + '22;color:' + roleMeta.color + ';padding:2px 8px;border-radius:99px;border:1px solid ' + roleMeta.color + '44">' + roleMeta.label + '</span>'
      + (uu.signature ? '<span style="font-size:10px;color:var(--success)">\u2713 Signature</span>' : '<span style="font-size:10px;color:var(--text-3)">Pas de signature</span>')
      + '</div>'
      + lastActivity
      + '</div>'
      + '<div style="display:flex;gap:6px">'
      + '<button class="btn btn-sm btn-secondary" onclick="openUserModal(\'' + uu.id + '\')" title="Modifier">\u270f</button>'
      + (uu.role !== 'admin' ? '<button class="btn btn-sm btn-secondary" onclick="_confirmDeleteUser(\'' + uu.id + '\')" title="Supprimer" style="color:var(--danger)">\u2716</button>' : '')
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
    + '<button class="btn btn-secondary" onclick="_adminCreateSupabaseAccount()">\u2601 Cr\u00e9er compte en ligne</button>'
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
        profiles.forEach(function(p) { if (typeof _syncProfileToLocal === 'function') _syncProfileToLocal(p); });
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

function _confirmDeleteUser(uid) {
  var user = (APP.users || []).find(function(u) { return u.id === uid; });
  if (!user) return;
  if (confirm('Supprimer "' + user.name + '" ? Cette action est irr\u00e9versible.')) {
    APP.users = APP.users.filter(function(u) { return u.id !== uid; });
    saveDB();
    notify('Utilisateur supprim\u00e9', 'success');
    showPage('administration');
  }
}

function _showActivityLog() {
  var logs = (APP._activityLog || []).slice().reverse();
  var html = '<div style="max-height:60vh;overflow-y:auto">';
  if (logs.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-3)">Aucune activit\u00e9 enregistr\u00e9e</div>';
  } else {
    html += '<table style="width:100%;border-collapse:collapse;font-size:12px">'
      + '<thead><tr><th style="text-align:left;padding:6px">Date</th><th style="text-align:left;padding:6px">Utilisateur</th><th style="text-align:left;padding:6px">Action</th><th style="text-align:left;padding:6px">D\u00e9tails</th></tr></thead><tbody>';
    logs.slice(0, 100).forEach(function(l) {
      html += '<tr style="border-top:1px solid var(--border)">'
        + '<td style="padding:6px;white-space:nowrap">' + fmtDateTime(l.ts) + '</td>'
        + '<td style="padding:6px">' + (l.user || l.email || '\u2014') + '</td>'
        + '<td style="padding:6px"><span class="badge">' + l.action + '</span></td>'
        + '<td style="padding:6px;color:var(--text-2)">' + (l.details || '') + '</td></tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  openModal('Journal d\'activit\u00e9', html, [
    { label: 'Fermer', cls: 'btn-secondary', onclick: 'closeModal()' }
  ]);

  if (typeof _firebaseDB !== 'undefined' && _firebaseDB && typeof _cloudUser !== 'undefined' && _cloudUser && typeof _adminGetActivityLog === 'function') {
    _adminGetActivityLog(100).then(function(cloudLogs) {
      if (cloudLogs && cloudLogs.length > 0) {
        var tbody = document.querySelector('#modal .modal-body tbody');
        if (tbody) {
          cloudLogs.forEach(function(l) {
            var row = document.createElement('tr');
            row.style.borderTop = '1px solid var(--border)';
            row.innerHTML = '<td style="padding:6px;white-space:nowrap">' + (l.created_at ? new Date(l.created_at).toLocaleString('fr') : '') + '</td>'
              + '<td style="padding:6px">' + (l.user_email || '') + '</td>'
              + '<td style="padding:6px"><span class="badge">' + l.action + '</span></td>'
              + '<td style="padding:6px;color:var(--text-2)">' + (l.details || '') + '</td>';
            tbody.appendChild(row);
          });
        }
      }
    }).catch(function() {});
  }
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

function _ensureDispatch() {
  if (!APP.dispatch) APP.dispatch = {};
  const D = APP.dispatch;
  if (!D.besoins) D.besoins = {};
  if (!D.entities) D.entities = [];
  if (!D.weights) D.weights = { pdv: 50, zone: 20, history: 30 };
  if (!D.zonePriority) D.zonePriority = {};
  if (!D.rules) D.rules = { respectMin: true, respectMax: true, roundMethod: 'largest-remainder' };
  if (!D.history) D.history = [];
  return D;
}

function _dispArticles() {
  return APP.articles.filter(a => a.stock > 0);
}

function dispGetBesoin(recipientId, articleId) {
  _ensureDispatch();
  const key = recipientId + '::' + articleId;
  return APP.dispatch.besoins[key] || { min: 0, cible: 0, max: 999 };
}

function dispSetBesoin(recipientId, articleId, min, cible, max) {
  _ensureDispatch();
  const key = recipientId + '::' + articleId;
  APP.dispatch.besoins[key] = { min: Math.max(0, min), cible: Math.max(0, cible), max: Math.max(0, max) };
  saveDB();
}

function dispGetArticleBesoin(articleId) {
  _ensureDispatch();
  const result = {};
  const prefix = '::' + articleId;
  for (const k in APP.dispatch.besoins) {
    if (k.endsWith(prefix)) {
      const rid = k.split('::')[0];
      result[rid] = APP.dispatch.besoins[k];
    }
  }
  return result;
}

function dispAddEntity(name, type) {
  _ensureDispatch();
  const id = 'ent_' + generateId();
  APP.dispatch.entities.push({ id, name, type: type || 'autre', active: true });
  saveDB();
  return id;
}

function dispRemoveEntity(id) {
  _ensureDispatch();
  APP.dispatch.entities = APP.dispatch.entities.filter(e => e.id !== id);
  const keysToRemove = Object.keys(APP.dispatch.besoins).filter(k => k.startsWith(id + '::'));
  keysToRemove.forEach(k => delete APP.dispatch.besoins[k]);
  saveDB();
}

function _dispAllRecipients() {
  _ensureDispatch();
  const list = [];
  (APP.commerciaux||[]).forEach(c => {
    if (c.actif !== false) {
      const zone = APP.zones ? APP.zones.find(z => z.id === (c.dispatchZoneId || c.zoneId)) : null;
      const fullName = ((c.prenom||'') + ' ' + (c.nom||'')).trim() || c.name || c.id;
      const pdv = c.nbClients || c.pdvCount || 0;
      list.push({ id: c.id, name: fullName, type: 'commercial', pdvCount: pdv, zoneId: c.dispatchZoneId || c.zoneId || '', zoneName: zone ? (zone.label||zone.id) : '', isEntity: false });
    }
  });
  (APP.dispatch.entities || []).forEach(e => {
    if (e.active !== false) {
      list.push({ id: e.id, name: e.name, type: e.type || 'autre', pdvCount: 0, zoneId: '', zoneName: '', isEntity: true });
    }
  });
  return list;
}

function dispSuggestBesoins(articleId) {
  const recipients = _dispAllRecipients();
  const totalPdv = recipients.reduce((s, r) => s + (r.pdvCount || 0), 0) || 1;
  const suggestions = {};
  recipients.forEach(r => {
    const ratio = (r.pdvCount || 1) / totalPdv;
    const cible = Math.max(1, Math.round(ratio * 100));
    suggestions[r.id] = { min: Math.round(cible * 0.3), cible, max: Math.round(cible * 2) };
  });
  return suggestions;
}

function dispComputeAllocation(articleId, totalToDispatch) {
  _ensureDispatch();
  const D = APP.dispatch;
  const recipients = _dispAllRecipients();
  if (recipients.length === 0 || totalToDispatch <= 0) return [];
  const w = D.weights || { pdv: 50, zone: 20, history: 30 };
  const wSum = (w.pdv + w.zone + w.history) || 100;
  const wPdv = w.pdv / wSum, wZone = w.zone / wSum, wHist = w.history / wSum;
  const totalPdv = recipients.reduce((s, r) => s + (r.pdvCount || 0), 0) || 1;
  const histTotals = {};
  (APP.mouvements || []).forEach(m => {
    if (m.type === 'sortie' && m.articleId === articleId && m.commercialId) {
      histTotals[m.commercialId] = (histTotals[m.commercialId] || 0) + (m.qty || 0);
    }
  });
  const totalHist = Object.values(histTotals).reduce((a, b) => a + b, 0) || 1;

  const alloc = recipients.map(r => {
    const b = dispGetBesoin(r.id, articleId);
    const pdvScore = (r.pdvCount || 0) / totalPdv;
    const zonePri = D.zonePriority[r.zoneId] || 1;
    const zoneScore = zonePri / (Object.values(D.zonePriority).reduce((a, b) => a + b, 0) || 1);
    const histScore = (histTotals[r.id] || 0) / totalHist;
    const weight = wPdv * pdvScore + wZone * zoneScore + wHist * histScore;
    return { recipientId: r.id, name: r.name, type: r.type, min: b.min, cible: b.cible, max: b.max, weight, qty: 0 };
  });

  // Pass 1: meet minimums
  let remaining = totalToDispatch;
  alloc.forEach(a => {
    if (D.rules.respectMin && a.min > 0) {
      const give = Math.min(a.min, remaining);
      a.qty = give;
      remaining -= give;
    }
  });

  // Pass 2: distribute toward targets using weights
  if (remaining > 0) {
    const eligible = alloc.filter(a => a.qty < a.cible);
    const totalW = eligible.reduce((s, a) => s + a.weight, 0) || 1;
    const raw = eligible.map(a => {
      const need = a.cible - a.qty;
      const share = (a.weight / totalW) * remaining;
      return { a, ideal: Math.min(need, share) };
    });
    const totalIdeal = raw.reduce((s, r) => s + r.ideal, 0);
    const scale = totalIdeal > 0 ? Math.min(remaining / totalIdeal, 1) : 0;
    // Largest-remainder method
    const scaled = raw.map(r => {
      const v = r.ideal * scale;
      return { a: r.a, floor: Math.floor(v), remainder: v - Math.floor(v) };
    });
    scaled.forEach(s => { s.a.qty += s.floor; remaining -= s.floor; });
    scaled.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < scaled.length && remaining > 0; i++) {
      if (scaled[i].a.qty < scaled[i].a.cible) { scaled[i].a.qty++; remaining--; }
    }
  }

  // Pass 3: enforce caps, redistribute excess
  if (D.rules.respectMax) {
    let excess = 0;
    alloc.forEach(a => {
      if (a.qty > a.max) { excess += a.qty - a.max; a.qty = a.max; }
    });
    if (excess > 0) {
      const uncapped = alloc.filter(a => a.qty < a.max);
      uncapped.sort((a, b) => b.weight - a.weight);
      for (const u of uncapped) {
        const give = Math.min(excess, u.max - u.qty);
        u.qty += give; excess -= give;
        if (excess <= 0) break;
      }
    }
  }

  return alloc;
}

function openBesoinsModal(articleId) {
  const art = APP.articles.find(a => a.id === articleId);
  if (!art) return;
  const recipients = _dispAllRecipients();
  let rows = '';
  recipients.forEach(r => {
    const b = dispGetBesoin(r.id, articleId);
    rows += '<tr><td>' + r.name + '</td><td><span class="badge" style="font-size:0.7em">' + r.type + '</span></td>'
      + '<td><input type="number" class="besoin-min" data-rid="' + r.id + '" value="' + b.min + '" min="0" style="width:60px;text-align:center"></td>'
      + '<td><input type="number" class="besoin-cible" data-rid="' + r.id + '" value="' + b.cible + '" min="0" style="width:60px;text-align:center"></td>'
      + '<td><input type="number" class="besoin-max" data-rid="' + r.id + '" value="' + b.max + '" min="0" style="width:60px;text-align:center"></td></tr>';
  });
  const html = '<div style="max-height:60vh;overflow:auto"><table class="table" style="font-size:0.85em"><thead><tr>'
    + '<th>' + t('name') + '</th><th>Type</th><th>Min</th><th>' + t('target') + '</th><th>Max</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
    + '<div style="margin-top:10px;text-align:right"><button class="btn btn-sm" onclick="dispAutoSuggestBesoins(\'' + articleId + '\')" style="margin-right:8px">' + t('autoSuggest') + '</button>'
    + '<button class="btn btn-primary btn-sm" onclick="saveBesoinsModal(\'' + articleId + '\')">' + t('save') + '</button></div>';
  openGenericModal(t('needsMatrix') + ' — ' + art.name, html);
}

function saveBesoinsModal(articleId) {
  document.querySelectorAll('.besoin-min').forEach(el => {
    const rid = el.dataset.rid;
    const min = parseInt(el.value) || 0;
    const cible = parseInt(el.closest('tr').querySelector('.besoin-cible').value) || 0;
    const max = parseInt(el.closest('tr').querySelector('.besoin-max').value) || 999;
    dispSetBesoin(rid, articleId, min, cible, max);
  });
  closeModal();
  notify(t('needsSaved'), 'success');
  if (typeof renderDispatchPage === 'function') renderDispatchPage();
}

function dispAutoSuggestBesoins(articleId) {
  const suggestions = dispSuggestBesoins(articleId);
  document.querySelectorAll('.besoin-min').forEach(el => {
    const rid = el.dataset.rid;
    if (suggestions[rid]) {
      el.value = suggestions[rid].min;
      el.closest('tr').querySelector('.besoin-cible').value = suggestions[rid].cible;
      el.closest('tr').querySelector('.besoin-max').value = suggestions[rid].max;
    }
  });
  notify(t('autoSuggestApplied'), 'success');
}

function openEntityManagerModal() {
  _ensureDispatch();
  const ents = APP.dispatch.entities || [];
  let rows = '';
  ents.forEach(e => {
    rows += '<tr><td>' + e.name + '</td><td>' + (e.type || 'autre') + '</td><td>' + (e.active !== false ? '\u2705' : '\u274c') + '</td>'
      + '<td><button class="btn btn-sm btn-danger" onclick="dispRemoveEntity(\'' + e.id + '\');openEntityManagerModal()">\u00d7</button></td></tr>';
  });
  const html = '<table class="table" style="font-size:0.85em"><thead><tr><th>' + t('name') + '</th><th>Type</th><th>' + t('status') + '</th><th></th></tr></thead><tbody>'
    + rows + '</tbody></table>'
    + '<div style="margin-top:10px;display:flex;gap:8px;align-items:center">'
    + '<input id="newEntName" placeholder="' + t('name') + '" style="flex:1;padding:4px">'
    + '<select id="newEntType" style="padding:4px"><option value="direction">Direction</option><option value="export">Export</option><option value="technique">Technique</option><option value="autre">Autre</option></select>'
    + '<button class="btn btn-primary btn-sm" onclick="const n=document.getElementById(\'newEntName\').value.trim();if(n){dispAddEntity(n,document.getElementById(\'newEntType\').value);openEntityManagerModal()}">' + t('add') + '</button></div>';
  openGenericModal(t('entityManager'), html);
}

function openDispWeightsModal() {
  _ensureDispatch();
  const w = APP.dispatch.weights;
  const zones = APP.zones || [];
  let zoneRows = '';
  zones.forEach(z => {
    const pri = APP.dispatch.zonePriority[z.id] || 1;
    zoneRows += '<tr><td>' + (z.label||z.id) + '</td><td><input type="number" class="zone-pri" data-zid="' + z.id + '" value="' + pri + '" min="0" max="10" step="0.1" style="width:60px;text-align:center"></td></tr>';
  });
  const html = '<div style="margin-bottom:15px"><h4 style="margin:0 0 8px">' + t('allocWeights') + '</h4>'
    + '<div style="display:flex;gap:12px;flex-wrap:wrap">'
    + '<label>PDV <input type="number" id="wPdv" value="' + w.pdv + '" min="0" max="100" style="width:60px;text-align:center"></label>'
    + '<label>Zone <input type="number" id="wZone" value="' + w.zone + '" min="0" max="100" style="width:60px;text-align:center"></label>'
    + '<label>' + t('history') + ' <input type="number" id="wHist" value="' + w.history + '" min="0" max="100" style="width:60px;text-align:center"></label>'
    + '</div></div>'
    + '<div><h4 style="margin:0 0 8px">' + t('zonePriority') + '</h4><table class="table" style="font-size:0.85em"><thead><tr><th>Zone</th><th>' + t('priority') + '</th></tr></thead><tbody>' + zoneRows + '</tbody></table></div>'
    + '<div style="margin-top:10px;text-align:right"><button class="btn btn-primary btn-sm" onclick="saveDispWeights()">' + t('save') + '</button></div>';
  openGenericModal(t('dispatchSettings'), html);
}

function saveDispWeights() {
  _ensureDispatch();
  APP.dispatch.weights.pdv = parseInt(document.getElementById('wPdv').value) || 50;
  APP.dispatch.weights.zone = parseInt(document.getElementById('wZone').value) || 20;
  APP.dispatch.weights.history = parseInt(document.getElementById('wHist').value) || 30;
  document.querySelectorAll('.zone-pri').forEach(el => {
    APP.dispatch.zonePriority[el.dataset.zid] = parseFloat(el.value) || 1;
  });
  saveDB();
  closeModal();
  notify(t('settingsSaved'), 'success');
}

function renderDispatchPage() {
  _ensureDispatch();
  const articles = _dispArticles();
  const activeTab = document.querySelector('.disp-tab-btn.active')?.dataset?.tab || 'repartition';
  let tabBtns = '<div style="display:flex;gap:4px;margin-bottom:15px;flex-wrap:wrap">';
  [{id:'repartition',label:t('allocation')},{id:'besoins',label:t('needsMatrix')},{id:'gadgets',label:t('summary')},{id:'historique',label:t('history')}].forEach(tb => {
    tabBtns += '<button class="btn btn-sm disp-tab-btn' + (tb.id === activeTab ? ' btn-primary active' : '') + '" data-tab="' + tb.id + '" onclick="document.querySelectorAll(\'.disp-tab-btn\').forEach(b=>{b.classList.remove(\'active\',\'btn-primary\')});this.classList.add(\'active\',\'btn-primary\');document.querySelectorAll(\'.disp-tab-content\').forEach(d=>d.style.display=\'none\');document.getElementById(\'disp-tab-\'+this.dataset.tab).style.display=\'block\'">' + tb.label + '</button>';
  });
  tabBtns += '<button class="btn btn-sm" onclick="openEntityManagerModal()" style="margin-left:auto">' + t('entities') + '</button>';
  tabBtns += '<button class="btn btn-sm" onclick="openDispWeightsModal()" style="margin-left:4px">\u2699 ' + t('settings') + '</button>';
  tabBtns += '</div>';

  let content = tabBtns;
  content += '<div id="disp-tab-repartition" class="disp-tab-content" style="display:' + (activeTab === 'repartition' ? 'block' : 'none') + '">';
  if (articles.length === 0) {
    content += '<p style="color:#888">' + t('noArticlesInStock') + '</p>';
  } else {
    articles.forEach(a => { content += _renderDispArticleCard(a); });
  }
  content += '</div>';
  content += '<div id="disp-tab-besoins" class="disp-tab-content" style="display:' + (activeTab === 'besoins' ? 'block' : 'none') + '">' + _renderDispTabBesoins(articles) + '</div>';
  content += '<div id="disp-tab-gadgets" class="disp-tab-content" style="display:' + (activeTab === 'gadgets' ? 'block' : 'none') + '">' + _renderDispTabGadgets(articles) + '</div>';
  content += '<div id="disp-tab-historique" class="disp-tab-content" style="display:' + (activeTab === 'historique' ? 'block' : 'none') + '">' + _renderDispTabHistory() + '</div>';

  document.getElementById('content').innerHTML = '<h2>' + t('dispatch') + '</h2>' + content;
}

function _renderDispArticleCard(art) {
  const artId = art.id;
  const cardId = 'disp-card-' + artId;
  let html = '<div class="card" id="' + cardId + '" style="margin-bottom:12px;padding:12px">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
  html += '<strong>' + art.name + '</strong><span class="badge">Stock: ' + art.stock + '</span>';
  html += '</div>';
  html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">';
  html += '<label>' + t('qtyToDispatch') + ': <input type="number" id="disp-qty-' + artId + '" value="' + art.stock + '" min="0" max="' + art.stock + '" style="width:80px;text-align:center"></label>';
  html += '<button class="btn btn-primary btn-sm" onclick="computeAndShowAlloc(\'' + artId + '\')">' + t('calculate') + '</button>';
  html += '<button class="btn btn-sm" onclick="openBesoinsModal(\'' + artId + '\')">' + t('editNeeds') + '</button>';
  html += '</div>';
  html += '<div id="disp-result-' + artId + '"></div>';
  html += '</div>';
  return html;
}

function computeAndShowAlloc(articleId) {
  const qty = parseInt(document.getElementById('disp-qty-' + articleId)?.value) || 0;
  if (qty <= 0) { notify(t('enterQty'), 'error'); return; }
  const alloc = dispComputeAllocation(articleId, qty);
  let html = '<table class="table" style="font-size:0.85em"><thead><tr><th>' + t('recipient') + '</th><th>Type</th><th>Min</th><th>' + t('target') + '</th><th>Max</th><th>' + t('allocated') + '</th><th>%</th></tr></thead><tbody>';
  const total = alloc.reduce((s, a) => s + a.qty, 0);
  alloc.forEach(a => {
    const pct = total > 0 ? ((a.qty / total) * 100).toFixed(1) : '0';
    const warn = a.qty < a.min ? 'style="color:red"' : (a.qty >= a.max ? 'style="color:orange"' : '');
    html += '<tr ' + warn + '><td>' + a.name + '</td><td>' + a.type + '</td><td>' + a.min + '</td><td>' + a.cible + '</td><td>' + a.max + '</td><td><strong>' + a.qty + '</strong></td><td>' + pct + '%</td></tr>';
  });
  html += '<tr style="font-weight:bold;border-top:2px solid #333"><td colspan="5">' + t('total') + '</td><td>' + total + '</td><td>100%</td></tr>';
  html += '</tbody></table>';
  html += '<div style="margin-top:8px;text-align:right"><button class="btn btn-primary btn-sm" onclick="validateDispatch(\'' + articleId + '\',' + qty + ')">' + t('validateDispatch') + '</button></div>';
  document.getElementById('disp-result-' + articleId).innerHTML = html;
}

function validateDispatch(articleId, totalQty) {
  _ensureDispatch();
  const alloc = dispComputeAllocation(articleId, totalQty);
  const art = APP.articles.find(a => a.id === articleId);
  if (!art) return;
  if (totalQty > art.stock) { notify(t('insufficientStock'), 'error'); return; }
  alloc.forEach(a => {
    if (a.qty > 0) {
      APP.mouvements.unshift({ id: generateId(), type: 'sortie', ts: Date.now(), articleId: art.id, articleName: art.name, qty: a.qty, note: 'Dispatch \u2192 ' + a.name, commercialId: a.recipientId });
    }
  });
  art.stock -= totalQty;
  APP.dispatch.history.unshift({ ts: Date.now(), articleId, articleName: art.name, totalQty, alloc: alloc.map(a => ({ id: a.recipientId, name: a.name, qty: a.qty })) });
  saveDB();
  auditLog('DISPATCH', 'dispatch', art.name + ' x' + totalQty + ' \u2192 ' + alloc.filter(a => a.qty > 0).length + ' recipients');
  notify(t('dispatchValidated'), 'success');
  renderDispatchPage();
}

function _renderDispTabBesoins(articles) {
  if (articles.length === 0) return '<p style="color:#888">' + t('noArticlesInStock') + '</p>';
  let html = '<div style="display:flex;flex-wrap:wrap;gap:8px">';
  articles.forEach(a => {
    const besoins = dispGetArticleBesoin(a.id);
    const count = Object.keys(besoins).length;
    html += '<div class="card" style="padding:10px;min-width:200px;cursor:pointer" onclick="openBesoinsModal(\'' + a.id + '\')">';
    html += '<strong>' + a.name + '</strong><br><span style="font-size:0.85em;color:#888">' + count + ' ' + t('configured') + '</span>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function _renderDispTabGadgets(articles) {
  const recipients = _dispAllRecipients();
  if (recipients.length === 0) return '<p style="color:#888">' + t('noRecipients') + '</p>';
  let html = '<div style="overflow-x:auto"><table class="table" style="font-size:0.8em"><thead><tr><th>' + t('recipient') + '</th><th>Type</th>';
  articles.forEach(a => { html += '<th style="writing-mode:vertical-lr;text-align:center;padding:4px">' + a.name + '</th>'; });
  html += '</tr></thead><tbody>';
  recipients.forEach(r => {
    html += '<tr><td>' + r.name + '</td><td>' + r.type + '</td>';
    articles.forEach(a => {
      const b = dispGetBesoin(r.id, a.id);
      html += '<td style="text-align:center;font-size:0.85em">' + b.min + '/' + b.cible + '/' + b.max + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function _renderDispTabHistory() {
  _ensureDispatch();
  var hist = APP.dispatch.history || [];
  if (hist.length === 0) return '<p style="color:#888">' + t('noHistory') + '</p>';
  var html = '<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">';
  html += '<label style="font-size:0.85em">Du <input type="date" id="disp-hist-from" style="padding:4px"></label>';
  html += '<label style="font-size:0.85em">Au <input type="date" id="disp-hist-to" style="padding:4px"></label>';
  html += '<button class="btn btn-sm" onclick="_filterDispHistory()">Filtrer</button>';
  html += '<button class="btn btn-sm" onclick="_resetDispHistFilter()">Tout</button>';
  html += '</div>';
  html += '<div id="disp-hist-list">' + _buildDispHistRows(hist) + '</div>';
  return html;
}

function _buildDispHistRows(list) {
  var html = '<table class="table" style="font-size:0.85em"><thead><tr><th>Date</th><th>Article</th><th>' + t('total') + '</th><th>' + t('details') + '</th><th>Actions</th></tr></thead><tbody>';
  var fullHist = APP.dispatch.history || [];
  list.forEach(function(h) {
    var realIdx = fullHist.indexOf(h);
    var details = (h.alloc || []).filter(function(a){return a.qty > 0}).map(function(a){return a.name + ':' + a.qty}).join(', ');
    html += '<tr><td>' + new Date(h.ts).toLocaleString('fr-FR') + '</td><td>' + (h.articleName || '') + '</td><td>' + h.totalQty + '</td><td style="font-size:0.85em">' + details + '</td>';
    html += '<td><button class="btn btn-sm" onclick="printDispatchReport(' + realIdx + ')" title="Imprimer">🖨</button> ';
    html += '<button class="btn btn-sm" style="color:var(--danger)" onclick="undoDispatch(' + realIdx + ')" title="Annuler">\u21A9</button></td></tr>';
  });
  html += '</tbody></table>';
  return html;
}

function _filterDispHistory() {
  var fromEl = document.getElementById('disp-hist-from');
  var toEl = document.getElementById('disp-hist-to');
  var from = fromEl && fromEl.value ? new Date(fromEl.value).getTime() : 0;
  var to = toEl && toEl.value ? new Date(toEl.value).setHours(23,59,59,999) : Infinity;
  var hist = (APP.dispatch.history || []).filter(function(h) { return h.ts >= from && h.ts <= to; });
  var el = document.getElementById('disp-hist-list');
  if(el) el.innerHTML = _buildDispHistRows(hist);
}

function _resetDispHistFilter() {
  var fromEl = document.getElementById('disp-hist-from');
  var toEl = document.getElementById('disp-hist-to');
  if(fromEl) fromEl.value = '';
  if(toEl) toEl.value = '';
  var el = document.getElementById('disp-hist-list');
  if(el) el.innerHTML = _buildDispHistRows(APP.dispatch.history || []);
}

function dInitCommercialDispatchFields(c) {
  if(c.dispatchZoneId === undefined) c.dispatchZoneId = c.zoneId || '';
}


// ============================================================
function undoDispatch(histIdx) {
  _ensureDispatch();
  var hist = APP.dispatch.history || [];
  if(histIdx < 0 || histIdx >= hist.length) return;
  var snap = hist[histIdx];
  if(!confirm('Annuler le dispatch de ' + snap.articleName + ' (' + snap.totalQty + ' unit\u00e9s) du ' + new Date(snap.ts).toLocaleString('fr-FR') + ' ?\n\nLe stock sera restaur\u00e9 et les mouvements associ\u00e9s supprim\u00e9s.')) return;
  var art = APP.articles.find(function(a){return a.id===snap.articleId});
  if(art) art.stock += snap.totalQty;
  // Supprimer les mouvements de sortie correspondants
  var snapTs = snap.ts;
  var removedIds = {};
  (snap.alloc||[]).forEach(function(a){
    if(a.qty > 0) removedIds[a.id || a.recipientId || a.name] = a.qty;
  });
  // Remove matching mouvements (same article, same timestamp range +/- 2s)
  APP.mouvements = APP.mouvements.filter(function(m) {
    if(m.type !== 'sortie' || m.articleId !== snap.articleId) return true;
    if(Math.abs(m.ts - snapTs) > 2000) return true;
    return false;
  });
  hist.splice(histIdx, 1);
  saveDB();
  auditLog('UNDO', 'dispatch', snap.articleName + ' x' + snap.totalQty);
  notify('Dispatch annul\u00e9 \u2014 stock restaur\u00e9 ✓', 'success');
  renderDispatchPage();
}

function undoMouvement(mvtId) {
  var idx = APP.mouvements.findIndex(function(m){return m.id===mvtId});
  if(idx < 0) { notify('Mouvement introuvable','error'); return; }
  var m = APP.mouvements[idx];
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

// ── Storage: File System Persistence ── (moved to storage.js)


initApp();
