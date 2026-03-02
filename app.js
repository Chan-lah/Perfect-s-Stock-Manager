(function(){
  var progress = 0;
  var labels = ["Chargement des données…","Initialisation…","Préparation de l'interface…","Presque prêt…"];
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
    if(label) label.textContent = 'Prêt !';
    setTimeout(function(){
      if(splash) splash.classList.add('splash-out');
      if(app) app.classList.remove('splash-hidden');
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
// DATA STORE
// ============================================================
const GMA_DEFAULT_LOGO = 'data:image/png;base64,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';

let APP = {
  // ── GADGETS / ARTICLES ───────────────────────────────────────
  articles: [
    {id:'g1', name:'Tee-shirts GMA',   code:'TSH-GMA',  category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:2500,  image:'', dispatchAllocMax:3000, actif:true,  createdAt:0, _version:1},
    {id:'g2', name:'Tee-shirts SBPro', code:'TSH-SBP',  category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:2500,  image:'', dispatchAllocMax:150,  actif:true,  createdAt:0, _version:1},
    {id:'g3', name:'Chasubles',        code:'CHAS',     category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:3200,  image:'', dispatchAllocMax:2000, actif:true,  createdAt:0, _version:1},
    {id:'g4', name:'Tabliers',         code:'TABL',     category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:2750,  image:'', dispatchAllocMax:1320, actif:true,  createdAt:0, _version:1},
    {id:'g5', name:'Seaux GMA',        code:'SEA-GMA',  category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:1600,  image:'', dispatchAllocMax:600,  actif:true,  createdAt:0, _version:1},
    {id:'g6', name:'Seaux SBP',        code:'SEA-SBP',  category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:1600,  image:'', dispatchAllocMax:500,  actif:true,  createdAt:0, _version:1},
    {id:'g7', name:'Pelons',           code:'PELO',     category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:1000,  image:'', dispatchAllocMax:1000, actif:true,  createdAt:0, _version:1},
    {id:'g8', name:'Cahiers',          code:'CAHI',     category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:2200,  image:'', dispatchAllocMax:250,  actif:true,  createdAt:0, _version:1},
    {id:'g9', name:'Bassines',         code:'BASS',     category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:2000,  image:'', dispatchAllocMax:0,    actif:false, createdAt:0, _version:1},
    {id:'g10',name:'Polos / Maillots', code:'POLO',     category:'Gadgets', fournisseurId:'', stock:0, stockMin:5, unit:'unité', price:10000, image:'', dispatchAllocMax:0,    actif:false, createdAt:0, _version:1}
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
    {id:'fiv1', nom:'IVA COM',  contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0},
    {id:'fwc1', nom:'WERE COM', contact:'', tel:'', email:'', adresse:'', actif:true, createdAt:0}
  ],
  commandesFourn: [],
  companies: [],
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
  dispatch: {
    weights: { pdv:60, agents:25, zones:15 },
    dotations: [
      {id:'d1', label:'UCAB / EXPORT',              qty:{g1:100,g2:0,g3:50, g4:50, g5:10,g6:0,g7:25,g8:10,g9:0,g10:0}},
      {id:'d2', label:'UCAB / Techboul',            qty:{g1:50, g2:0,g3:50, g4:50, g5:0, g6:0,g7:30,g8:5, g9:0,g10:0}},
      {id:'d3', label:'Chef de ventes / Gd compte', qty:{g1:200,g2:0,g3:100,g4:100,g5:0, g6:0,g7:25,g8:25,g9:0,g10:0}},
      {id:'d4', label:'Lagassina KOULIBALY',        qty:{g1:20, g2:0,g3:20, g4:20, g5:0, g6:0,g7:0, g8:5, g9:0,g10:0}},
      {id:'d5', label:'Daniel ABOUA',               qty:{g1:20, g2:0,g3:20, g4:20, g5:0, g6:0,g7:0, g8:5, g9:0,g10:0}},
      {id:'d6', label:'Sévérin NGUESSAN',           qty:{g1:20, g2:0,g3:20, g4:20, g5:0, g6:0,g7:0, g8:5, g9:0,g10:0}},
      {id:'d7', label:'Fabrice KOCOLA',             qty:{g1:20, g2:0,g3:20, g4:20, g5:0, g6:0,g7:0, g8:5, g9:0,g10:0}},
      {id:'d8', label:'Autre sorties',              qty:{g1:250,g2:0,g3:100,g4:100,g5:50,g6:0,g7:14,g8:50,g9:0,g10:0}}
    ],
    specialOrders: [
      {id:'s1', label:'T-Shirts Beignets',       qty:{g1:1000,g2:0,g3:0,   g4:0,   g5:0,   g6:0,   g7:0,g8:0,g9:0,   g10:0}},
      {id:'s2', label:'Tabliers Beignets',       qty:{g1:0,   g2:0,g3:0,   g4:1000,g5:0,   g6:0,   g7:0,g8:0,g9:0,   g10:0}},
      {id:'s3', label:'Seaux Beignets GMA',      qty:{g1:0,   g2:0,g3:0,   g4:0,   g5:2000,g6:0,   g7:0,g8:0,g9:0,   g10:0}},
      {id:'s4', label:'Seaux Beignets SBP',      qty:{g1:0,   g2:0,g3:0,   g4:0,   g5:0,   g6:1000,g7:0,g8:0,g9:0,   g10:0}},
      {id:'s5', label:'Bassines Beignets',       qty:{g1:0,   g2:0,g3:0,   g4:0,   g5:0,   g6:0,   g7:0,g8:0,g9:2000,g10:0}},
      {id:'s6', label:'Chasubles Sogo Balo Pro', qty:{g1:0,   g2:0,g3:1000,g4:0,   g5:0,   g6:0,   g7:0,g8:0,g9:0,   g10:0}},
      {id:'s7', label:'Polos récompenses',       qty:{g1:0,   g2:0,g3:0,   g4:0,   g5:0,   g6:0,   g7:0,g8:0,g9:0,   g10:60}}
    ],
    suppliers: [
      {id:'sf1', fournisseur:'IVA COM',  article:'CHASUBLES',   commande:2000, statut:'LIVRÉ'},
      {id:'sf2', fournisseur:'IVA COM',  article:'TABLIERS',    commande:1500, statut:'LIVRÉ'},
      {id:'sf3', fournisseur:'WERE COM', article:'TEE-SHIRT',   commande:2000, statut:'EN ATTENTE'},
      {id:'sf4', fournisseur:'WERE COM', article:'TABLIERS',    commande:1333, statut:'EN ATTENTE'},
      {id:'sf5', fournisseur:'',         article:'TABLIERS SB', commande:1000, statut:'EN ATTENTE'},
      {id:'sf6', fournisseur:'',         article:'CHASUBLE',    commande:3200, statut:'EN ATTENTE'}
    ]
    /* customRates and rateLocked stored on commerciaux as .dispatchCustomRate / .dispatchRateLocked */
  },
  settings: { companyName: 'GMA - Les Grands Moulins d\'Abidjan', theme: 'dark', currency: 'XOF', companyLogo: GMA_DEFAULT_LOGO, backupInterval: 5, companyAddress: 'Zone Industrielle de Vridi, 15 BP 917 Abidjan 15', companyTel: '+225 27 21 75 11 00', companyFax: '+225 27 21 75 11 01', companyEmail: 'gma@gma-ci.com' }
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2,6); }
function fmtDate(ts) { return new Date(ts).toLocaleDateString('fr-FR'); }
function fmtDateTime(ts) { return new Date(ts).toLocaleString('fr-FR'); }
function fmtCurrency(v, cur) {
  cur = cur || APP.settings.currency || 'XOF';
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency:cur, minimumFractionDigits:0 }).format(v||0);
}
function bonNumber() { return 'BS-' + new Date().getFullYear() + '-' + String(APP.bons.length+1).padStart(4,'0'); }
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

// ============================================================
// PERSISTENCE
// ============================================================
function saveDB() {
  try { localStorage.setItem('psm_pro_db', JSON.stringify(APP)); } catch(e) {}
}
function loadDB() {
  try {
    const d = localStorage.getItem('psm_pro_db');
    if(d) {
      const p = JSON.parse(d);
      // Ne restaurer depuis localStorage que si des données réelles existent
      // (évite d'écraser les données pré-remplies par un localStorage vide)
      if(p && (p.commerciaux?.length || p.articles?.length || p.zones?.length)) {
        Object.assign(APP, p);
      }
    }
  } catch(e) {}
}

// ============================================================
// AUDIT LOG
// ============================================================
function auditLog(type, entity, entityId, oldVal, newVal) {
  APP.audit.unshift({ id:generateId(), ts:Date.now(), type, entity, entityId, oldVal:JSON.stringify(oldVal), newVal:JSON.stringify(newVal) });
  if(APP.audit.length > 500) APP.audit = APP.audit.slice(0,500);
  saveDB();
}

// ============================================================
// BACKUP SCHEDULER
// ============================================================
let _backupTimer = null;
function startBackupScheduler() {
  if(_backupTimer) clearInterval(_backupTimer);
  const min = parseInt(APP.settings.backupInterval)||5;
  if(min > 0) _backupTimer = setInterval(() => autoBackup(true), min * 60000);
}
function autoBackup(silent) {
  if(!APP.backups) APP.backups = [];
  const bk = { id:generateId(), ts:Date.now(), data:JSON.stringify(APP), size:JSON.stringify(APP).length };
  APP.backups.unshift(bk);
  if(APP.backups.length > 10) APP.backups = APP.backups.slice(0,10);
  saveDB();
  if(!silent) notify('Backup automatique créé ✓','success');
}

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
  { id:'analytics',       label:'Analytique IA',      icon:'brain',     section:'INTELLIGENCE' },
  { id:'dispatch',        label:'Dispatch Gadgets',   icon:'dispatch',  section:'DISPATCH' },
  { id:'audit',           label:'Audit Trail',        icon:'shield',    section:'OUTILS' },
  { id:'boneditor',       label:'Éditeur de Bon',     icon:'edit',      section:null },
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
  edit:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  settings:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  dispatch:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4m0 0l-5 6m5-6l5 6"/></svg>',
  map:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  store:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  star:'<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
};

let currentPage = 'dashboard';

function initApp() {
  loadDB();
  if(!APP.commandesFourn) APP.commandesFourn = [];
  if(!APP.companies) APP.companies = [];
  if(!APP.backups) APP.backups = [];
  if(!APP.zones) APP.zones = [];
  if(!APP.secteurs) APP.secteurs = [];
  if(!APP.pdv) APP.pdv = [];
  if(!APP.dispatch) APP.dispatch = { weights:{pdv:60,agents:25,zones:15}, dotations:[], specialOrders:[], suppliers:[] };
  if(!APP.dispatch.dotations) APP.dispatch.dotations = [];
  if(!APP.dispatch.specialOrders) APP.dispatch.specialOrders = [];
  if(!APP.dispatch.suppliers) APP.dispatch.suppliers = [];
  // ── Logo GMA intégré par défaut via GMA_DEFAULT_LOGO ───────
  // Le logo par défaut est codé dans la constante GMA_DEFAULT_LOGO.
  // L'utilisateur peut le remplacer via Paramètres (bouton "Changer le logo").
  // Le bouton "↺ Logo par défaut" permet de revenir à GMA_DEFAULT_LOGO.
  initGMAData(); // Charge les données GMA
  // Init dispatch fields on all commerciaux
  APP.commerciaux.forEach(c => dInitCommercialDispatchFields(c));
  // Set dispatchAllocMax on GMA articles based on known stock if not yet set
  APP.articles.forEach(a => { if(a.dispatchAllocMax === undefined) a.dispatchAllocMax = a.stock > 0 ? a.stock : 0; });
  renderSidebar();
  updateCompanyPanel();
  startClock();
  showPage('dashboard');
  updateAlertBadge();
  document.documentElement.dataset.theme = APP.settings.theme || 'dark';
  startBackupScheduler();
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  let lastSection = null;
  PAGES.forEach(p => {
    if(p.section && p.section !== lastSection) {
      const sec = document.createElement('div'); sec.className = 'sb-section'; sec.textContent = p.section;
      nav.appendChild(sec); lastSection = p.section;
    }
    const item = document.createElement('div');
    item.className = 'sb-item' + (p.id === currentPage ? ' active' : '');
    item.dataset.page = p.id;
    item.innerHTML = `${ICONS[p.icon]||''}<span>${p.label}</span>`;
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
    item.onclick = () => showPage(p.id);
    nav.appendChild(item);
  });
}

function updateCompanyPanel() {
  const name = APP.settings.companyName || (APP.companies[0]?.name) || 'GMA — Les Grands Moulins d\'Abidjan';
  const logo = APP.settings.companyLogo || APP.companies[0]?.logo;
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
  currentPage = id;
  document.querySelectorAll('.sb-item').forEach(i => i.classList.toggle('active', i.dataset.page === id));
  const titles = {
    dashboard:'Tableau de bord', articles:'Gadgets & Stocks', bons:'Bons de sortie',
    mouvements:'Mouvements de stock', commerciaux:'Commerciaux', territoire:'🗺 Zones & Secteurs',
    pdv:'🏪 Points de Vente', fournisseurs:'Fournisseurs',
    'fourn-dashboard':'Suivi des livraisons', 'gma-catalogue':'⭐ Catalogue GMA',
    analytics:'🧠 Analytique IA', dispatch:'⚙️ Dispatch Gadgets',
    audit:'Audit Trail', boneditor:'🎨 Éditeur de Bon', settings:'Paramètres'
  };
  const titleEl = document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent = titles[id] || id;
  const renders = {
    dashboard:renderDashboard, articles:renderArticles, bons:renderBons, mouvements:renderMouvements,
    commerciaux:renderCommerciaux, territoire:renderTerritoire, pdv:renderPDV,
    fournisseurs:renderFournisseurs, 'fourn-dashboard':renderFournDashboard,
    'gma-catalogue':renderGMACatalogue,
    analytics:renderAnalytics, dispatch:renderDispatchPage, audit:renderAudit, boneditor:renderBonEditor, settings:renderSettings
  };
  document.getElementById('content').innerHTML = '';
  if(renders[id]) renders[id]();
}

function startClock() {
  const el = document.getElementById('clock');
  const tick = () => { if(el) el.textContent = new Date().toLocaleTimeString('fr-FR'); };
  tick(); setInterval(tick, 1000);
}

function toggleTheme() {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  APP.settings.theme = t; saveDB();
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
}

// ============================================================
// NOTIFY
// ============================================================
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
  closeModal();
  const overlay = document.createElement('div');
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

// ============================================================
// INLINE EDITING ENGINE
// ============================================================
function makeEditable(td, value, type, options, onSave) {
  if(td.dataset.editing === 'true') return;
  td.dataset.editing = 'true';
  const original = td.innerHTML;
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
    td.dataset.editing = 'false';
    const newVal = input.value;
    if(newVal != value) { onSave(newVal); notify('Modifié avec succès','success'); }
    else { td.innerHTML = original; td.dataset.editing = 'false'; }
  };
  const cancel = () => { td.innerHTML = original; td.dataset.editing = 'false'; };
  input.onblur = save;
  input.onkeydown = e => {
    if(e.key === 'Enter') { e.preventDefault(); save(); }
    if(e.key === 'Escape') { e.preventDefault(); cancel(); }
  };
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
      <select id="dash-period" onchange="toggleCustomPeriod()" style="width:auto;font-size:12px">
        <option value="7">7 derniers jours</option>
        <option value="30" selected>30 derniers jours</option>
        <option value="90">3 derniers mois</option>
        <option value="365">Cette année</option>
        <option value="custom">📅 Période personnalisée</option>
      </select>
      <span id="dash-custom-wrap" style="display:none;align-items:center;gap:4px">
        <input type="date" id="dash-from" style="width:auto;font-size:12px" title="Date début" onchange="refreshDashboard(false)">
        <span style="font-size:12px;color:var(--text-2)">→</span>
        <input type="date" id="dash-to" style="width:auto;font-size:12px" title="Date fin" onchange="refreshDashboard(false)">
      </span>
      <span id="dash-refresh-status" style="font-size:11px;color:var(--text-2)"></span>
      <button class="btn btn-secondary btn-sm" onclick="refreshDashboard(true)">🔄 Actualiser</button>
      <button class="btn btn-secondary btn-sm" onclick="printDashboard()">🖨 Imprimer</button>
    </div>
  </div>
  <div class="grid-4 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">Stock Total</span><div class="kpi-icon" style="background:rgba(61,127,255,.15);color:var(--accent)">${ICONS.box}</div></div><div class="kpi-value" id="kv-stock" style="color:var(--accent)">—</div><div class="kpi-change" id="ks-stock">—</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Alertes</span><div class="kpi-icon" style="background:rgba(255,71,87,.15);color:var(--danger)">⚠️</div></div><div class="kpi-value" id="kv-alerts">—</div><div class="kpi-change">Gadgets sous seuil</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Sorties / 30j</span><div class="kpi-icon" style="background:rgba(255,107,53,.15);color:var(--accent3)">📤</div></div><div class="kpi-value" id="kv-sorties" style="color:var(--accent3)">—</div><div class="kpi-change">Unités sorties</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Bons / 30j</span><div class="kpi-icon" style="background:rgba(0,229,170,.15);color:var(--accent2)">📋</div></div><div class="kpi-value" id="kv-bons" style="color:var(--accent2)">—</div><div class="kpi-change">Bons émis</div></div>
  </div>
  <!-- Dispatch summary bar -->
  <div class="card mb-16" style="border-left:3px solid var(--accent);cursor:pointer" onclick="showPage('dispatch')">
    <div class="card-header"><span class="card-title">⚙️ Dispatch Gadgets — aperçu rapide</span><button class="btn btn-secondary btn-sm">Ouvrir →</button></div>
    <div id="dash-dispatch-preview" style="display:flex;gap:16px;flex-wrap:wrap;padding:0 4px 4px">
      <span style="font-size:12px;color:var(--text-2)">Chargement...</span>
    </div>
  </div>
  <div class="grid-2 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">Stock par catégorie</span></div><div class="chart-container"><canvas id="chartCat"></canvas></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Mouvements 7 jours</span></div><div class="chart-container"><canvas id="chartMvt"></canvas></div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">⚠️ Gadgets en alerte</span><button class="btn btn-sm btn-secondary" onclick="showPage('articles')">Voir tout</button></div><div id="dash-alerts"></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Activité récente</span></div><div id="dash-activity"></div></div>
  </div>`;
  refreshDashboard(false);
  drawChartCat(); drawChartMvt();
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
  const cmdsP     = (APP.commandesFourn||[]).filter(c=>c.createdAt>=tFrom&&c.createdAt<=tTo).length;
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
      <td style="text-align:center">${a.stockMin}</td>
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
    <thead><tr><th>Code</th><th>Désignation</th><th style="text-align:center">Stock actuel</th><th style="text-align:center">Seuil min</th><th style="text-align:center">Entrées</th><th style="text-align:center">Sorties</th><th style="text-align:center">Prix unitaire</th><th style="text-align:center">Statut</th></tr></thead>
    <tbody>${stockRows}</tbody>
  </table>

  ${movsP.length > 0 ? `
  <div class="section-title">Mouvements sur la période (${movsP.length})</div>
  <table>
    <thead><tr><th>Date</th><th>Type</th><th>Gadget</th><th style="text-align:center">Qté</th><th>Commercial / Fournisseur</th><th>Observations</th></tr></thead>
    <tbody>${movsP.slice(0,50).map(m=>{
      const who = m.commercialId ? APP.commerciaux.find(c=>c.id===m.commercialId) : m.fournisseurId ? APP.fournisseurs.find(f=>f.id===m.fournisseurId) : null;
      const whoLabel = who ? (who.prenom ? who.prenom+' '+who.nom : who.nom) : '—';
      return `<tr><td>${new Date(m.ts).toLocaleDateString('fr-FR')}</td><td style="color:${m.type==='entree'?'#007700':'#cc4400'};font-weight:700">${m.type==='entree'?'ENTRÉE':'SORTIE'}</td><td>${m.articleName||'—'}</td><td style="text-align:center;font-weight:700">${m.type==='entree'?'+':'−'}${m.qty}</td><td>${whoLabel}</td><td style="color:#666;font-style:italic">${m.obs||''}</td></tr>`;
    }).join('')}
    ${movsP.length>50?`<tr><td colspan="6" style="text-align:center;color:#888;font-style:italic">… ${movsP.length-50} mouvement(s) supplémentaire(s) non affichés</td></tr>`:''}
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

function refreshDashboard(showNotif) {
  const {tFrom, tTo, label} = getDashPeriod();
  const totalQte = APP.articles.reduce((s,a) => s + (a.stock||0), 0);
  const alerts = APP.articles.filter(a => a.stock <= a.stockMin);
  const t30 = tFrom;
  const sortiesMonth = APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>=tFrom&&m.ts<=tTo).reduce((s,m)=>s+m.qty,0);
  const bonsMonth = APP.bons.filter(b=>b.createdAt>=tFrom&&b.createdAt<=tTo).length;
  animateNumber(document.getElementById('kv-stock'), totalQte);
  const ae = document.getElementById('kv-alerts');
  if(ae) { ae.style.color = alerts.length>0?'var(--danger)':'var(--success)'; animateNumber(ae, alerts.length); }
  animateNumber(document.getElementById('kv-sorties'), sortiesMonth);
  animateNumber(document.getElementById('kv-bons'), bonsMonth);
  const ss = document.getElementById('ks-stock'); if(ss) ss.textContent = APP.articles.length + ' gadgets référencés';
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
    const totalR = dTotalEffectiveRates();
    const budget = dCalcBudget();
    const agents = dAgents();
    const zones = dZones();
    dpv.innerHTML = [
      `<span class="chip">${agents.length} commerciaux</span>`,
      `<span class="chip">${zones.length} zones</span>`,
      `<span class="chip">${dActiveGadgets().length} gadgets actifs</span>`,
      `<span class="chip" style="color:${Math.abs(totalR-1)<0.01?'var(--success)':'var(--warning)'}">Σ taux = ${(totalR*100).toFixed(1)}%</span>`,
      `<span class="chip" style="color:var(--warning)">Budget sem. = ${dFmt(budget._total)} 000 FCFA</span>`,
    ].join('');
  }
}

function drawChartCat() {
  const canvas = document.getElementById('chartCat'); if(!canvas) return;
  canvas.width = canvas.offsetWidth||300; canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const cats = {}; APP.articles.forEach(a => { cats[a.category] = (cats[a.category]||0) + a.stock; });
  const labels = Object.keys(cats), values = Object.values(cats);
  if(!labels.length) { ctx.fillStyle='var(--text-2)'; ctx.font='13px sans-serif'; ctx.textAlign='center'; ctx.fillText('Aucun article',canvas.width/2,90); return; }
  const colors = ['#3d7fff','#00e5aa','#ff6b35','#ffa502','#ff4757'];
  const total = values.reduce((s,v)=>s+v,0)||1;
  let angle = -Math.PI/2;
  const cx=canvas.width/2, cy=90, r=70;
  labels.forEach((l,i) => { const slice=(values[i]/total)*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,angle+slice); ctx.closePath(); ctx.fillStyle=colors[i%colors.length]; ctx.fill(); angle+=slice; });
  ctx.beginPath(); ctx.arc(cx,cy,35,0,Math.PI*2);
  ctx.fillStyle=document.documentElement.dataset.theme==='light'?'#ffffff':'#161920'; ctx.fill();
  let ly=18;
  labels.forEach((l,i) => { ctx.fillStyle=colors[i%colors.length]; ctx.fillRect(canvas.width-90,ly-8,10,10); ctx.fillStyle=document.documentElement.dataset.theme==='light'?'#374151':'#b8bdd4'; ctx.font='11px sans-serif'; ctx.textAlign='left'; ctx.fillText(`${l} (${values[i]})`,canvas.width-76,ly); ly+=20; });
}

function drawChartMvt() {
  const canvas = document.getElementById('chartMvt'); if(!canvas) return;
  canvas.width = canvas.offsetWidth||300; canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const days=7, labels=[], entrees=[], sorties=[];
  for(let i=days-1;i>=0;i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    labels.push(d.toLocaleDateString('fr-FR',{weekday:'short'}));
    const s=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(), e=s+86400000;
    entrees.push(APP.mouvements.filter(m=>m.type==='entree'&&m.ts>=s&&m.ts<e).reduce((x,m)=>x+m.qty,0));
    sorties.push(APP.mouvements.filter(m=>m.type==='sortie'&&m.ts>=s&&m.ts<e).reduce((x,m)=>x+m.qty,0));
  }
  const W=canvas.width,H=canvas.height,padL=30,padB=25,padT=10,padR=10;
  const chartW=W-padL-padR,chartH=H-padB-padT,maxVal=Math.max(...entrees,...sorties,1),barW=chartW/days*0.35;
  ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){ const y=padT+chartH-(i/4)*chartH; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(W-padR,y); ctx.stroke(); ctx.fillStyle='#6b7280'; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.fillText(Math.round((i/4)*maxVal),2,y+4); }
  labels.forEach((l,i) => {
    const x=padL+(i/days)*chartW+chartW/(days*2);
    const he=(entrees[i]/maxVal)*chartH; ctx.fillStyle='rgba(0,229,170,0.8)'; ctx.fillRect(x-barW-1,padT+chartH-he,barW,he);
    const hs=(sorties[i]/maxVal)*chartH; ctx.fillStyle='rgba(255,107,53,0.8)'; ctx.fillRect(x+1,padT+chartH-hs,barW,hs);
    ctx.fillStyle='#6b7280'; ctx.font='10px sans-serif'; ctx.textAlign='center'; ctx.fillText(l,x,H-5);
  });
  ctx.fillStyle='rgba(0,229,170,0.8)'; ctx.fillRect(padL,5,10,8); ctx.fillStyle='#b8bdd4'; ctx.font='11px sans-serif'; ctx.textAlign='left'; ctx.fillText('Entrées',padL+14,13);
  ctx.fillStyle='rgba(255,107,53,0.8)'; ctx.fillRect(padL+80,5,10,8); ctx.fillStyle='#b8bdd4'; ctx.fillText('Sorties',padL+94,13);
}

// ============================================================
// ARTICLES (INLINE EDITING)
// ============================================================
let artSearch='', artCat='all', artStk='all';
function renderArticles() {
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">Gadgets & Stock</div>
    <div class="flex-center gap-8">
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
    <thead><tr><th style="width:50px">Image</th><th>Code</th><th>Nom</th><th>Catégorie</th><th>Stock</th><th>Min</th><th>Unité</th><th>Prix</th><th>Statut</th><th>Actions</th></tr></thead>
    <tbody id="art-tbody">${arts.map(a=>renderArticleRow(a)).join('')}</tbody>
  </table></div>`;
  arts.forEach(a=>attachArticleEditors(a));
}

function renderArticleRow(a) {
  const isAlert=a.stock<=a.stockMin;
  return `<tr id="art-row-${a.id}">
    <td><div class="item-thumb" onclick="openGMAArticleDetail('${a.id}')" style="cursor:pointer" title="Voir / modifier l'illustration">${a.image?`<img src="${a.image}" alt="">`:'<span style="font-size:18px;opacity:0.25">📷</span>'}</div></td>
    <td><span class="font-mono">${a.code}</span></td>
    <td class="editable" id="td-name-${a.id}">${a.name}</td>
    <td class="editable" id="td-cat-${a.id}">${a.category}</td>
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
        const row=document.getElementById('art-row-'+a.id);
        if(row){row.outerHTML=renderArticleRow(a);attachArticleEditors(a);}
      });
    };
  });
}

function openArticleModal(id) {
  const a=id?APP.articles.find(x=>x.id===id):null;
  const cats=[...new Set(APP.articles.map(x=>x.category).filter(Boolean))];
  const defaultCats=['Goodies','PDR','Matériel','Autres'];
  const allCats=[...new Set([...defaultCats,...cats])];
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
      Object.assign(a,{name,code:document.getElementById('f-code').value,category:document.getElementById('f-cat').value,unit:document.getElementById('f-unit').value,stock:parseFloat(document.getElementById('f-stock').value)||0,stockMin:parseFloat(document.getElementById('f-min').value)||0,price:parseFloat(document.getElementById('f-price').value)||0,description:document.getElementById('f-desc').value,image:imgData||a.image||''});
      auditLog('edit','article',a.id,old,a);
    } else {
      const newA={id:generateId(),name,code:document.getElementById('f-code').value,category:document.getElementById('f-cat').value,unit:document.getElementById('f-unit').value,stock:parseFloat(document.getElementById('f-stock').value)||0,stockMin:parseFloat(document.getElementById('f-min').value)||0,price:parseFloat(document.getElementById('f-price').value)||0,description:document.getElementById('f-desc').value,image:imgData,createdAt:Date.now(),_version:1,_versions:[]};
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
function renderBons() {
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">Bons de sortie</div>
    <div class="flex-center gap-8">
      <button class="btn btn-secondary btn-sm" onclick="exportBonsJSON()">📥 Export</button>
      <button class="btn btn-primary" onclick="openBonModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Nouveau bon</button>
    </div>
  </div>
  <div style="font-size:11px;color:var(--text-2);margin-bottom:12px">💡 <strong>Double-cliquez</strong> sur Statut ou Note pour modifier directement</div>
  <div class="table-wrap"><table>
    <thead><tr><th>N° Bon</th><th>Entreprise</th><th>Récipendaire</th><th>Gadgets</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
    <tbody>${APP.bons.length===0?`<tr><td colspan="7"><div class="empty-state"><p>Aucun bon de sortie</p></div></td></tr>`:APP.bons.slice().sort((a,b)=>b.createdAt-a.createdAt).map(b=>renderBonRow(b)).join('')}</tbody>
  </table></div>`;
  APP.bons.forEach(b=>attachBonEditors(b));
}

function renderBonRow(b) {
  const co=b.companyId?APP.companies.find(c=>c.id===b.companyId):APP.companies[0];
  const statusColor=b.status==='validé'?'badge-green':b.status==='annulé'?'badge-red':'badge-yellow';
  return `<tr id="bon-row-${b.id}">
    <td style="font-family:monospace;font-weight:700;color:var(--accent)">${b.numero}</td>
    <td style="font-size:12px;color:var(--text-2)">${co?.shortName||co?.name||'—'}</td>
    <td style="font-size:13px">${b.recipiendaire||'—'}</td>
    <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${(b.lignes||[]).map(l=>`${l.qty}× ${l.name||l.articleName}`).join(', ')}</td>
    <td style="font-size:12px;color:var(--text-2)">${fmtDate(b.createdAt)}</td>
    <td class="editable" id="td-bstat-${b.id}"><span class="badge ${statusColor}">${b.status||'brouillon'}</span></td>
    <td><div style="display:flex;gap:4px">
      <button class="btn btn-sm btn-secondary" onclick="previewBon('${b.id}')">👁</button>
      <button class="btn btn-sm btn-secondary" onclick="printBon('${b.id}')">🖨</button>
      <button class="btn btn-sm btn-secondary" onclick="openBonModal('${b.id}')">✏️</button>
      <button class="btn btn-sm btn-danger" onclick="deleteBon('${b.id}')">🗑</button>
    </div></td>
  </tr>`;
}

function attachBonEditors(b) {
  const stTd=document.getElementById('td-bstat-'+b.id);
  if(stTd) stTd.ondblclick=()=>{
    makeEditable(stTd,b.status||'brouillon','select',['brouillon','validé','annulé'],(v)=>{
      const old=b.status; b.status=v;
      auditLog('edit','bon',b.id,{status:old},{status:v}); saveDB();
      const row=document.getElementById('bon-row-'+b.id);
      if(row){row.outerHTML=renderBonRow(b);attachBonEditors(b);}
    });
  };
}

function openBonModal(bonId) {
  const bon = bonId ? APP.bons.find(b=>b.id===bonId) : null;
  const coOptions=APP.companies.map(c=>`<option value="${c.id}" ${bon?.companyId===c.id?'selected':''}>${c.name}</option>`).join('');
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
    ${APP.companies.length>0?`<div class="form-group"><label>Entreprise</label><select id="bon-company">${coOptions}</select></div>`:'<div></div>'}
    <div class="form-group"><label>Statut</label><select id="bon-status"><option value="brouillon" ${bon?.status==='brouillon'?'selected':''}>Brouillon</option><option value="validé" ${!bon||bon?.status==='validé'?'selected':''}>Validé</option><option value="annulé" ${bon?.status==='annulé'?'selected':''}>Annulé</option></select></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>Récipendaire *</label><input id="bon-recip" value="${bon?.recipiendaire||''}"></div>
    <div class="form-group"><label>Commercial</label><select id="bon-commercial"><option value="">— Aucun —</option>${comOptions}</select></div>
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
  const coId=document.getElementById('bon-company')?.value||(APP.companies[0]?.id||null);

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
function generateBonHTML(bon, overrides) {
  const co=(bon.companyId?APP.companies.find(c=>c.id===bon.companyId):null)||APP.companies[0]||null;
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
  const qrSvg=generateQRSVG(bon.numero,cPrimary);
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
        <strong>NOM DU DEMANDEUR :</strong> <span style="display:inline-block;width:400px;border-bottom:1px dotted #555;padding-left:8px;font-weight:400">${bon.recipiendaire||''}${commercial?' — '+commercial.prenom+' '+commercial.nom:''}</span>
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
          <div style="font-size:11px;font-weight:700;color:#111;text-align:center;margin-bottom:8px">Sce Demandeur</div>
          ${bon.sigDemandeur?`<img src="${bon.sigDemandeur}" style="max-height:45px;display:block;margin:0 auto">`:''}
        </td>
        <td style="width:34%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px">Magasin</div>
        </td>
        <td style="width:33%;padding:12px 14px;border:1px solid #555;vertical-align:top;height:90px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">Date et Signature</div>
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px">Réceptionnaire</div>
        </td>
      </tr>
    </table>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px">
      <div style="font-size:9px;color:#777;line-height:1.6">Document généré le ${fmtDateTime(bon.createdAt)}<br>Bon valable ${bon.validite||'1 mois'}</div>
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
  document.getElementById('content').innerHTML = `
  <div class="flex-between mb-16">
    <div class="page-title">Mouvements de stock</div>
    <div class="flex-center gap-8">
      <button class="btn btn-success btn-sm" onclick="openNewMvtModal('entree')">+ Entrée stock</button>
      <button class="btn btn-danger btn-sm" onclick="openNewMvtModal('sortie')">− Sortie stock</button>
      <button class="btn btn-secondary btn-sm" onclick="exportMvtCSV()">📥 CSV</button>
    </div>
  </div>
  <div class="filters">
    <select id="mvt-type-filter" onchange="filterMvt()" style="width:auto"><option value="all">Tous types</option><option value="entree">Entrées</option><option value="sortie">Sorties</option></select>
    <input type="date" id="mvt-date-from" onchange="filterMvt()" style="width:auto">
    <input type="date" id="mvt-date-to" onchange="filterMvt()" style="width:auto">
    <div class="search-bar" style="flex:1;max-width:250px">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="mvt-search" placeholder="Rechercher..." oninput="filterMvt()">
    </div>
  </div>
  <div id="mvt-table-wrap"></div>`;
  filterMvt();
}

function filterMvt() {
  const type=document.getElementById('mvt-type-filter')?.value||'all';
  const from=document.getElementById('mvt-date-from')?.value;
  const to=document.getElementById('mvt-date-to')?.value;
  const search=document.getElementById('mvt-search')?.value.toLowerCase()||'';
  const mvts=APP.mouvements.filter(m=>{
    if(type!=='all'&&m.type!==type) return false;
    if(from&&m.ts<new Date(from).getTime()) return false;
    if(to&&m.ts>new Date(to).getTime()+86399999) return false;
    if(search&&!m.articleName.toLowerCase().includes(search)) return false;
    return true;
  }).sort((a,b)=>b.ts-a.ts);
  const wrap=document.getElementById('mvt-table-wrap'); if(!wrap) return;
  wrap.innerHTML=`<div class="table-wrap"><table>
    <thead><tr><th>Date/Heure</th><th>Type</th><th>Article</th><th>Quantité</th><th>Agent / Source</th><th>Observation</th></tr></thead>
    <tbody>${mvts.length?mvts.map(m=>{
      const isE=m.type==='entree';
      const who=m.commercialId?(APP.commerciaux.find(c=>c.id===m.commercialId)||null):null;
      const fourn=m.fournisseurId?(APP.fournisseurs.find(f=>f.id===m.fournisseurId)||null):null;
      return `<tr>
        <td class="font-mono" style="font-size:11px">${fmtDateTime(m.ts)}</td>
        <td><span class="badge ${isE?'badge-green':'badge-orange'}">${isE?'↑ Entrée':'↓ Sortie'}</span></td>
        <td style="font-weight:600">${m.articleName}</td>
        <td style="font-size:15px;font-weight:700;color:${isE?'var(--success)':'var(--accent3)'}">${isE?'+':'-'}${m.qty}</td>
        <td>${who?who.prenom+' '+who.nom:fourn?fourn.nom:'<span style="color:var(--text-2)">—</span>'}</td>
        <td style="color:var(--text-2)">${m.obs||m.note||'—'}</td>
      </tr>`;
    }).join(''):'<tr><td colspan="6"><div class="empty-state"><p>Aucun mouvement</p></div></td></tr>'}</tbody>
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

function renderComRow(c) { return ''; } // kept for compat

function attachComEditors(c) {
  const fields=[{id:'td-cnom-'+c.id,key:'nom'},{id:'td-cprenom-'+c.id,key:'prenom'},{id:'td-cservice-'+c.id,key:'service'},{id:'td-ctel-'+c.id,key:'tel'}];
  fields.forEach(f=>{
    const td=document.getElementById(f.id); if(!td) return;
    td.ondblclick=()=>{
      const old=c[f.key];
      makeEditable(td,c[f.key]||'','text',null,(v)=>{
        c[f.key]=v; auditLog('edit','commercial',c.id,{[f.key]:old},{[f.key]:v}); saveDB();
        notify('Modifié','success');
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
        <td style="font-weight:600">${p.nom||'—'}</td>
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
    <div class="form-group"><label>Observations</label><textarea id="pdv-obs" rows="2">${p?.obs||''}</textarea></div>`,
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
      obs: document.getElementById('pdv-obs').value,
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
    <div class="page-title">Fournisseurs</div>
    <button class="btn btn-primary" onclick="openFournModal()"><svg width="13" height="13" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Ajouter</button>
  </div>
  <div style="font-size:11px;color:var(--text-2);margin-bottom:12px">💡 <strong>Double-cliquez</strong> sur une cellule pour modifier directement</div>
  <div class="table-wrap"><table>
    <thead><tr><th>Nom du contact</th><th>Entreprise</th><th>Email / Contact</th><th>Téléphone</th><th>Adresse</th><th>Commandes</th><th>Actions</th></tr></thead>
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
        const row=document.getElementById('fourn-row-'+f.id);
        if(row){row.outerHTML=renderFournRow(f);attachFournEditors(f);}
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

function viewFournDetail(fournId) {
  window._fournFocus = fournId; showPage('fourn-dashboard');
}

// ============================================================
// GMA DATA — Articles & Fournisseurs (données permanentes)
// ============================================================
const GMA_FOURNISSEURS = [
  { nom:'2BPUB',        contact:'',  tel:'27 21 35 84 93', adresse:'Côte d\'Ivoire' },
  { nom:'POUVOIR D\'ART', contact:'', tel:'07 57 50 99 28', adresse:'Côte d\'Ivoire' },
  { nom:'TAGPLAST',     contact:'',  tel:'07 78 76 31 19', adresse:'Côte d\'Ivoire' },
  { nom:'ANNONAFRICA',  contact:'',  tel:'07 08 75 70 13', adresse:'Côte d\'Ivoire' },
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
  { name:'Tabliers Super-Beignets Plus',             code:'MY0A159', category:'SUPER-BEIGNETS',   fournisseur:'ANNONAFRICA',    colors:'',               description:'Tabliers Super-Beignets Plus' },
  { name:'Seaux Super-Beignets',                     code:'MY0A161', category:'SUPER-BEIGNETS',   fournisseur:'ANNONAFRICA',    colors:'',               description:'Seaux Super-Beignets' },
  { name:'Bassines Super-Beignets',                  code:'MY0A120', category:'SUPER-BEIGNETS',   fournisseur:'ANNONAFRICA',    colors:'',               description:'Bassines Super-Beignets' },
  { name:'Tabliers Super-Beignets Simple',           code:'MY0A121', category:'SUPER-BEIGNETS',   fournisseur:'ANNONAFRICA',    colors:'',               description:'Tabliers Super-Beignets Simple' },
  { name:'Tee-shirt Super-Beignets Plus',            code:'MY0A117', category:'SUPER-BEIGNETS',   fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Super-Beignets Plus' },
  // 60 ANS
  { name:'Polos 60 ans',                             code:'MY0A201', category:'60 ANS',            fournisseur:'2BPUB',          colors:'',               description:'Polos édition 60 ans' },
  { name:'Tee-shirt beige 60 ans',                   code:'—',       category:'60 ANS',            fournisseur:'ANNONAFRICA',    colors:'Beige',          description:'Tee-shirts beige 60 ans' },
  // SOGO BALO PRO
  { name:'Tee-shirt Sogo Balo Pro',                  code:'MY0A066', category:'SOGO BALO PRO',     fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts Sogo Balo Pro' },
  { name:'Seaux Sogo Balo Pro',                      code:'MY0A165', category:'SOGO BALO PRO',     fournisseur:'2BPUB',          colors:'',               description:'Seaux Sogo Balo Pro' },
  // CAN 23
  { name:'Tee-shirts CAN 23',                        code:'—',       category:'CAN 23',            fournisseur:'2BPUB',          colors:'',               description:'Tee-shirts édition CAN 23' },
  // TP TPP
  { name:'Panneau publicitaire TOP PAIN',            code:'MY0A018', category:'TP TPP',            fournisseur:'2BPUB',          colors:'',               description:'Panneaux publicitaires TOP PAIN' },
];

// GMA logo storage key
const GMA_LOGO_KEY = 'gma_logo_b64';

function initGMAData() {
  // Init fournisseurs GMA si pas encore présents
  GMA_FOURNISSEURS.forEach(gf => {
    const exists = APP.fournisseurs.find(f => f.nom === gf.nom);
    if(!exists) {
      APP.fournisseurs.push({ id:generateId(), nom:gf.nom, entreprise:gf.nom, contact:gf.contact, tel:gf.tel, adresse:gf.adresse, createdAt:Date.now(), _gma:true });
    }
  });
  // Init gadgets GMA avec stock=0 si pas encore présents
  GMA_ARTICLES.forEach(ga => {
    const exists = APP.articles.find(a => a.code === ga.code && ga.code !== '—') || APP.articles.find(a => a.name === ga.name);
    if(!exists) {
      const fournObj = APP.fournisseurs.find(f => f.nom === ga.fournisseur);
      APP.articles.push({ id:generateId(), name:ga.name, code:ga.code==='—'?'ART-GMA-'+generateId().slice(0,6):ga.code, category:ga.category, fournisseur:ga.fournisseur, fournisseurId:fournObj?.id||null, colors:ga.colors, description:ga.description, unit:'pcs', stock:0, stockMin:5, price:0, image:'', createdAt:Date.now(), _gma:true });
    }
  });
  saveDB();
}

// ============================================================
// CATALOGUE GMA
// ============================================================
function renderGMACatalogue() {
  const logo = localStorage.getItem(GMA_LOGO_KEY)||'';
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
    localStorage.setItem(GMA_LOGO_KEY, e.target.result);
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
    a.image = e.target.result;
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
    <div><div class="page-title">🧠 Analytique IA</div><div class="page-sub">Insights intelligents — prévisions basées sur l'historique, fréquence et moyenne des sorties</div></div>
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
    <div class="card-header"><span class="card-title">🛒 Commandes suggérées</span>${suggestions.length?`<button class="btn btn-sm btn-primary" onclick="exportSuggestions()">📥 Exporter</button>`:''}</div>
    ${suggestions.length===0?'<div class="empty-state"><p>✅ Aucune commande urgente nécessaire</p></div>':suggestions.map(s=>`<div class="suggestion-card"><div><div class="art-name">${s.article.name} <span class="badge badge-blue">${s.article.code}</span></div><div class="art-detail">Stock: ${s.article.stock} — Seuil: ${s.article.stockMin} — Rate: ${s.dailyRate}/j</div></div><div class="text-right"><div style="font-size:20px;font-weight:700;color:var(--accent)">${s.suggestQty}</div><div style="font-size:11px;color:var(--text-2)">unités à commander</div><div style="font-size:11px;color:${s.urgency==='critical'?'var(--danger)':'var(--warning)'}">${s.daysLeft===0?'⚡ Urgent!':s.daysLeft+' jours'}</div></div></div>`).join('')}
  </div>`;
}

function exportSuggestions() {
  const suggestions=getSuggestions();
  const rows=[['Article','Code','Stock actuel','Stock min','À commander','Délai (jours)','Priorité']];
  suggestions.forEach(s=>rows.push([s.article.name,s.article.code,s.article.stock,s.article.stockMin,s.suggestQty,s.daysLeft,s.urgency]));
  downloadFile(rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n'),'commandes-suggerees.csv','text/csv');
}

// ============================================================
// AUDIT TRAIL
// ============================================================
function renderAudit() {
  document.getElementById('content').innerHTML=`
  <div class="flex-between mb-16">
    <div class="page-title">Audit Trail</div>
    <button class="btn btn-secondary btn-sm" onclick="exportAuditJSON()">Export JSON</button>
  </div>
  <div class="filters">
    <select id="audit-type-filter" onchange="filterAudit()" style="width:auto"><option value="all">Tous types</option>${[...new Set(APP.audit.map(a=>a.type))].map(t=>`<option value="${t}">${t}</option>`).join('')}</select>
    <input type="date" id="audit-date-from" onchange="filterAudit()" style="width:auto">
    <input type="date" id="audit-date-to" onchange="filterAudit()" style="width:auto">
  </div>
  <div id="audit-list"></div>`;
  filterAudit();
}

function filterAudit() {
  const typeF=document.getElementById('audit-type-filter')?.value||'all';
  const from=document.getElementById('audit-date-from')?.value;
  const to=document.getElementById('audit-date-to')?.value;
  const entries=APP.audit.filter(a=>{
    if(typeF!=='all'&&a.type!==typeF) return false;
    if(from&&a.ts<new Date(from).getTime()) return false;
    if(to&&a.ts>new Date(to).getTime()+86399999) return false;
    return true;
  }).sort((a,b)=>b.ts-a.ts).slice(0,200);
  const typeColors={CREATE:'var(--success)',UPDATE:'var(--accent)',DELETE:'var(--danger)',EXPORT:'var(--warning)',PRINT:'var(--text-2)',STOCK_OUT:'var(--accent3)',STOCK_ENTREE:'var(--success)',STOCK_SORTIE:'var(--accent3)',IMPORT:'var(--accent2)',RESET:'var(--danger)',create:'var(--success)',edit:'var(--accent)',delete:'var(--danger)',entree:'var(--success)',sortie:'var(--accent3)'};
  const list=document.getElementById('audit-list'); if(!list) return;
  list.innerHTML=entries.length?entries.map(e=>`
    <div class="audit-row">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge" style="background:${typeColors[e.type]||'var(--text-3)'}22;color:${typeColors[e.type]||'var(--text-2)'}">${e.type}</span>
          <span style="font-size:11px;color:var(--text-1)">${e.entity}${e.entityId?' · '+e.entityId:''}</span>
        </div>
        <div style="font-size:10px;color:var(--text-2)">${fmtDateTime(e.ts)}</div>
      </div>
    </div>`).join(''):'<div class="empty-state"><p>Aucune entrée d\'audit</p></div>';
}

function exportAuditJSON() {
  downloadFile(JSON.stringify(APP.audit,null,2),'audit-trail-'+Date.now()+'.json','application/json');
  notify('Audit exporté','success');
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
    ${APP.companies.map(co=>renderCompanyCard(co)).join('')}
    ${APP.companies.length===0?'<div class="empty-state"><p>Aucune entreprise configurée. Ajoutez votre première entreprise pour pouvoir émettre des bons.</p></div>':''}
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
      ${APP.companies.length>1?`<button class="btn btn-danger btn-sm" onclick="deleteCompany('${co.id}')">🗑</button>`:''}
    </div>
  </div>`;
}

function openCompanyModal(id) {
  const co=id?APP.companies.find(c=>c.id===id):null;
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
    const co=APP.companies.find(c=>c.id===existingId); if(!logo&&co.logo) data.logo=co.logo;
    Object.assign(co,data); auditLog('UPDATE','company',co.id,null,{name:co.name}); notify('Entreprise mise à jour ✓','success');
  } else {
    const nc={id:generateId(),...data,logo:logo||'',createdAt:Date.now()};
    APP.companies.push(nc); auditLog('CREATE','company',nc.id,null,{name:nc.name}); notify('Entreprise créée ✓','success');
  }
  saveDB();closeModal();renderCompanies();updateCompanyPanel();
}

function deleteCompany(id) {
  if(APP.companies.length<=1){notify('Impossible de supprimer la dernière entreprise','error');return;}
  if(!confirm('Supprimer cette entreprise ?')) return;
  APP.companies=APP.companies.filter(c=>c.id!==id); saveDB(); renderCompanies();
  notify('Entreprise supprimée','warning');
}

function previewCompanyBon(coId) {
  const co=APP.companies.find(c=>c.id===coId); if(!co) return;
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
  const co=APP.companies[0];
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
  let co=APP.companies[0];
  if(!co){co={id:generateId(),name:s.name,createdAt:Date.now()};APP.companies.push(co);}
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
  <div class="page-title mb-16">Paramètres</div>
  <div class="grid-2" style="gap:16px">
    <div class="card">
      <div class="card-header"><span class="card-title">Entreprise</span></div>
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
        <div class="form-group"><label>Thème</label><select id="set-theme"><option value="dark" ${document.documentElement.dataset.theme==='dark'?'selected':''}>Sombre</option><option value="light" ${document.documentElement.dataset.theme==='light'?'selected':''}>Clair</option></select></div>
        <div class="form-group"><label>Devise</label><select id="set-currency"><option value="XOF" ${s.currency==='XOF'?'selected':''}>XOF (CFA)</option><option value="EUR" ${s.currency==='EUR'?'selected':''}>EUR (€)</option><option value="USD" ${s.currency==='USD'?'selected':''}>USD ($)</option></select></div>
      </div>
      <button class="btn btn-primary" onclick="saveSettings()">💾 Enregistrer</button>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Données</span></div>
      <div class="stat-row"><span class="stat-label">Gadgets</span><span class="stat-val">${APP.articles.length}</span></div>
      <div class="stat-row"><span class="stat-label">Bons émis</span><span class="stat-val">${APP.bons.length}</span></div>
      <div class="stat-row"><span class="stat-label">Mouvements</span><span class="stat-val">${APP.mouvements.length}</span></div>
      <div class="stat-row"><span class="stat-label">Commerciaux</span><span class="stat-val">${APP.commerciaux.length}</span></div>
      <div class="stat-row"><span class="stat-label">Fournisseurs</span><span class="stat-val">${APP.fournisseurs.length}</span></div>
      <div class="stat-row"><span class="stat-label">Entrées audit</span><span class="stat-val">${APP.audit.length}</span></div>
      <div class="stat-row"><span class="stat-label">Backups auto</span><span class="stat-val">${APP.backups.length}/10</span></div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
        <button class="btn btn-secondary" onclick="exportAllJSON()">⬇ Export global JSON</button>
        <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">⬆ Import JSON</button>
        <input type="file" id="import-file" accept=".json" style="display:none" onchange="importJSON(this)">
        <button class="btn btn-danger" onclick="resetAll()">⚠️ Reset complet</button>
      </div>
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
      <button class="btn btn-secondary btn-sm" onclick="manualBackup()">💾 Sauvegarder maintenant</button>
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
  setTimeout(()=>{ const ld=document.getElementById('set-logo-data'); if(ld) ld.value=APP.settings.companyLogo||''; const zl=document.getElementById('zones-list'); if(zl) zl.innerHTML=renderZonesList(); },10);
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
  const logo=document.getElementById('set-logo-data').value; if(logo) APP.settings.companyLogo=logo;
  APP.settings.theme=document.getElementById('set-theme').value;
  APP.settings.currency=document.getElementById('set-currency').value;
  const newInterval=parseInt(document.getElementById('set-backup-interval').value);
  const intervalChanged=newInterval!==APP.settings.backupInterval;
  APP.settings.backupInterval=newInterval;
  document.documentElement.dataset.theme=APP.settings.theme;
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
      ['articles','fournisseurs','commerciaux','mouvements','bons','audit','backups','companies','commandesFourn'].forEach(k=>{if(Array.isArray(data[k])) APP[k]=data[k];});
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
  const c1=prompt('Tapez "RESET" pour confirmer la suppression totale:');
  if(c1!=='RESET') return;
  const c2=prompt('Confirmation 2/2 — Tapez "OUI":');
  if(c2!=='OUI') return;
  autoBackup(true);
  APP.articles=[];APP.bons=[];APP.mouvements=[];APP.fournisseurs=[];APP.commerciaux=[];APP.audit=[];APP.commandesFourn=[];APP.companies=[];
  auditLog('RESET','all',null,null,{ts:Date.now()});
  saveDB();notify('Données réinitialisées','warning');renderSettings();renderSidebar();
}

function manualBackup() { autoBackup(false); renderSettings(); }

// ============================================================
// SMART SEARCH ENGINE
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
  APP.companies.forEach(co=>{if(fuzzyMatch(co.name,q)||fuzzyMatch(co.shortName||'',q)){results.push({type:'entreprise',icon:'🏢',color:'#9b59b6',title:co.name,sub:co.address||'',action:()=>{closeSmartSearch();showPage('companies');}});}});
  if(fuzzyMatch('fraude',q)||fuzzyMatch('analytique',q)||fuzzyMatch('analyse',q)) results.push({type:'page',icon:'🧠',color:'#9b59b6',title:'Analytique IA',sub:'Fraude, prédictions, top gadgets',action:()=>{closeSmartSearch();showPage('analytics');}});
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
  if(e.key==='Escape') closeSmartSearch();
});

// ============================================================
// ██████╗ ██╗███████╗██████╗  █████╗ ████████╗ ██████╗██╗  ██╗
// ██╔══██╗██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██║  ██║
// ██║  ██║██║███████╗██████╔╝███████║   ██║   ██║     ███████║
// ██║  ██║██║╚════██║██╔═══╝ ██╔══██║   ██║   ██║     ██╔══██║
// ██████╔╝██║███████║██║     ██║  ██║   ██║   ╚██████╗██║  ██║
// DISPATCH ENGINE — bidirectional sync with APP.commerciaux / APP.articles / APP.zones
// ============================================================

// ── GETTERS that proxy APP data into dispatch-compatible format ──
function dAgents() {
  return APP.commerciaux.map(c => {
    // PDV réels depuis APP.pdv si disponibles, sinon utiliser dispatchBoul/Dist ou nbClients
    const realBoul = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.type==='boulangerie'&&p.actif!==false).length;
    const realDist = (APP.pdv||[]).filter(p=>p.commercialId===c.id&&p.type==='distributeur'&&p.actif!==false).length;
    const boul = realBoul > 0 ? realBoul : (c.dispatchBoul || Math.max(0, Math.round((c.nbClients||0)*0.65)));
    const dist = realDist > 0 ? realDist : (c.dispatchDist || Math.max(0, Math.round((c.nbClients||0)*0.35)));
    return {
      id: c.id,
      name: c.prenom + ' ' + c.nom,
      zone: (APP.zones||[]).find(z=>z.id===c.dispatchZoneId)?.label || c.secteur || '',
      zoneId: c.dispatchZoneId || (APP.zones?.[0]?.id || ''),
      boul, dist,
      customRate: c.dispatchCustomRate !== undefined ? c.dispatchCustomRate : null,
      rateLocked: c.dispatchRateLocked || false,
      color: (APP.zones||[]).find(z=>z.id===c.dispatchZoneId)?.color || null
    };
  });
}

function dGadgets() {
  return APP.articles.filter(a => a.dispatchActive !== false && a.dispatchAllocMax > 0).map(a => ({
    id: a.id,
    label: a.name,
    unit: a.unit || 'unité',
    allocMax: a.dispatchAllocMax || 0,
    price: a.price || 0,
    active: a.dispatchActive !== false,
    stock: a.stock || 0
  }));
}

function dZones() {
  if (!APP.zones || !APP.zones.length) return [];
  return APP.zones.map(z => ({ id: z.id, label: z.label || z.nom || z.id, color: z.color || '#4da3ff' }));
}

function dWeights() { return APP.dispatch?.weights || { pdv:60, agents:25, zones:15 }; }
function dDotations() { return APP.dispatch?.dotations || []; }
function dSpecialOrders() { return APP.dispatch?.specialOrders || []; }
function dSuppliers() { return APP.dispatch?.suppliers || []; }

// ── Write-back helpers ──
function dSetAgentField(agentId, field, val) {
  const c = APP.commerciaux.find(x => x.id === agentId); if(!c) return;
  c[field] = val; saveDB();
}
function dSetGadgetField(artId, field, val) {
  const a = APP.articles.find(x => x.id === artId); if(!a) return;
  a[field] = val; saveDB(); updateAlertBadge();
}

// ── CORE ENGINE (mirrors dispatch_v5) ──
const dN = v => parseFloat(v) || 0;
const dEsc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const dFmt = (v,d) => { const x=parseFloat(v); if(isNaN(x)) return '–'; return d!==undefined?x.toFixed(d):Math.round(x).toLocaleString('fr-FR'); };
const dFmtPct = v => (v*100).toFixed(2)+'%';
const dFmtPctS = v => (v*100).toFixed(1)+'%';

function dAgentPDV(a) { return dN(a.boul) + dN(a.dist); }
function dGrandTotalPDV() { return dAgents().reduce((s,a) => s + dAgentPDV(a), 0); }
function dActiveGadgets() { return dGadgets().filter(g => g.active && g.allocMax > 0); }
function dZoneAgents(zid) { return dAgents().filter(a => a.zoneId === zid); }
function dZonePDV(zid) { return dZoneAgents(zid).reduce((s,a) => s + dAgentPDV(a), 0); }

function dZoneWeight(zid) {
  const w = dWeights();
  const wTotal = w.pdv + w.agents + w.zones;
  const wp = w.pdv/wTotal, wa = w.agents/wTotal, wz = w.zones/wTotal;
  const gtPDV = dGrandTotalPDV() || 1;
  const totalAgents = dAgents().length || 1;
  const nbZones = dZones().length || 1;
  return wp*(dZonePDV(zid)/gtPDV) + wa*(dZoneAgents(zid).length/totalAgents) + wz*(1/nbZones);
}
function dNormalizedZoneWeights() {
  const raw = {}; dZones().forEach(z => { raw[z.id] = dZoneWeight(z.id); });
  const total = Object.values(raw).reduce((s,v) => s+v, 0) || 1;
  const norm = {}; dZones().forEach(z => { norm[z.id] = raw[z.id]/total; });
  return norm;
}
function dAgentZoneShare(agent) {
  const zPDV = dZonePDV(agent.zoneId) || 1;
  return dAgentPDV(agent) / zPDV;
}
function dAutoRate(agent) {
  const zw = dNormalizedZoneWeights();
  return (zw[agent.zoneId] || 0) * dAgentZoneShare(agent);
}
function dEffectiveRate(agent) {
  return agent.customRate !== null ? dN(agent.customRate) : dAutoRate(agent);
}
function dTotalEffectiveRates() { return dAgents().reduce((s,a) => s + dEffectiveRate(a), 0); }

function dAgentGadgetAlloc(agent, gadget) {
  if(!gadget.active || gadget.allocMax <= 0) return 0;
  return gadget.allocMax * dEffectiveRate(agent);
}
function dAgentAllocs(agent) {
  const r = {}; dGadgets().forEach(g => r[g.id] = dAgentGadgetAlloc(agent, g)); return r;
}
function dZoneTotals(zid) {
  const agents = dZoneAgents(zid);
  const t = {pdv:0, part:0}; dGadgets().forEach(g => t[g.id] = 0);
  agents.forEach(a => {
    t.pdv += dAgentPDV(a); t.part += dEffectiveRate(a);
    const al = dAgentAllocs(a); dGadgets().forEach(g => t[g.id] += al[g.id]);
  });
  return t;
}
function dGrandTotals() {
  const t = {pdv: dGrandTotalPDV()}; dGadgets().forEach(g => t[g.id] = 0);
  dAgents().forEach(a => { const al = dAgentAllocs(a); dGadgets().forEach(g => t[g.id] += al[g.id]); });
  return t;
}
function dDotationTotals() {
  const r = {}; dGadgets().forEach(g => r[g.id] = 0);
  dDotations().forEach(d => dGadgets().forEach(g => r[g.id] += dN(d.qty[g.id]))); return r;
}
function dMonthlyNeed() {
  const gt = dGrandTotals(), dt = dDotationTotals(), r = {};
  dGadgets().forEach(g => r[g.id] = gt[g.id] + dt[g.id]); return r;
}
function dSpecialTotals() {
  const r = {}; dGadgets().forEach(g => r[g.id] = 0);
  dSpecialOrders().forEach(s => dGadgets().forEach(g => r[g.id] += dN(s.qty[g.id]))); return r;
}
function dTotalToOrder() {
  const mn = dMonthlyNeed(), sp = dSpecialTotals(), r = {};
  dGadgets().forEach(g => r[g.id] = mn[g.id]*6 + sp[g.id]); return r;
}
function dCalcBudget() {
  const to = dTotalToOrder(); let total = 0; const r = {};
  dGadgets().forEach(g => { const v = (to[g.id] * dN(g.price)) / 1000; r[g.id] = v; total += v; });
  r._total = total; return r;
}

// ── RATE MUTATIONS ──
function dSetAgentRate(agentId, pctVal) {
  const c = APP.commerciaux.find(a => a.id === agentId); if(!c) return;
  c.dispatchCustomRate = parseFloat(pctVal) / 100;
  const warns = dValidateRates(agentId);
  saveDB();
  if(currentPage === 'dispatch') renderDispatchPage();
  const totalR = dTotalEffectiveRates();
  if(warns.length && Math.abs(totalR - 1) > 0.02) dShowConflictBanner(agentId, warns);
  else { dHideConflictBanner(); if(warns.length) notify(warns[0].title, 'warning'); }
}
function dResetAgentRate(agentId) {
  const c = APP.commerciaux.find(a => a.id === agentId); if(!c) return;
  c.dispatchCustomRate = null; c.dispatchRateLocked = false;
  saveDB(); dHideConflictBanner();
  if(currentPage === 'dispatch') renderDispatchPage();
  notify('Taux remis en Auto', 'success');
}
function dToggleLock(agentId) {
  const c = APP.commerciaux.find(a => a.id === agentId); if(!c) return;
  const agent = dAgents().find(a => a.id === agentId);
  if(!agent) return;
  if(c.dispatchCustomRate === null || c.dispatchCustomRate === undefined) {
    c.dispatchCustomRate = dAutoRate(agent); c.dispatchRateLocked = true;
  } else { c.dispatchRateLocked = !c.dispatchRateLocked; }
  saveDB();
  if(currentPage === 'dispatch') renderDispatchPage();
}
function dResetAllRates() {
  if(!confirm('Remettre tous les taux en mode automatique ?')) return;
  APP.commerciaux.forEach(c => { c.dispatchCustomRate = null; c.dispatchRateLocked = false; });
  saveDB(); dHideConflictBanner();
  if(currentPage === 'dispatch') renderDispatchPage();
  notify('Tous les taux réinitialisés', 'success');
}
function dSyncWeightLabels() {
  const p = dN(document.getElementById('dw-pdv')?.value) || 0;
  const a = dN(document.getElementById('dw-agents')?.value) || 0;
  const z = dN(document.getElementById('dw-zones')?.value) || 0;
  APP.dispatch.weights = {pdv:p, agents:a, zones:z};
  const el = document.getElementById('dw-total-label');
  if(el) { const total=p+a+z; el.textContent=`Somme : ${total}% ${total===100?'✓':'(normalisé auto)'}`; el.style.color=total===100?'var(--success)':'var(--text-2)'; }
  saveDB();
}

// ── VALIDATION ──
function dValidateRates(agentId) {
  const warnings = [];
  const totalR = dTotalEffectiveRates();
  const agent = dAgents().find(a => a.id === agentId);
  if(!agent) return warnings;
  const eff = dEffectiveRate(agent), auto = dAutoRate(agent);
  const diff = Math.abs(totalR - 1.0);
  if(diff > 0.02) {
    const over = totalR > 1;
    warnings.push({ level: over?'error':'warn', title: over?`Surallocation (${(totalR*100).toFixed(1)}%)`:`Sous-allocation (${(totalR*100).toFixed(1)}%)`,
      body: over ? `Somme des taux : <strong>${(totalR*100).toFixed(2)}%</strong>. Surallocation de <strong>${((totalR-1)*100).toFixed(1)}%</strong>.`
                 : `Somme des taux : <strong>${(totalR*100).toFixed(2)}%</strong>. Sous-allocation de <strong>${((1-totalR)*100).toFixed(1)}%</strong>.` });
  }
  if(auto > 0) {
    const ratio = eff/auto;
    if(ratio > 2.5) warnings.push({ level:'warn', title:`Taux élevé — ${agent.name}`, body:`Taux manuel <strong>${(eff*100).toFixed(2)}%</strong> vs auto <strong>${(auto*100).toFixed(2)}%</strong> (ratio ${ratio.toFixed(1)}×).` });
    if(ratio < 0.35 && eff > 0) warnings.push({ level:'info', title:`Taux bas — ${agent.name}`, body:`Taux manuel <strong>${(eff*100).toFixed(2)}%</strong> vs auto <strong>${(auto*100).toFixed(2)}%</strong>.` });
  }
  if(eff <= 0 && agent.customRate !== null) warnings.push({ level:'warn', title:`Taux nul — ${agent.name}`, body:`Cet agent ne recevra aucun gadget.` });
  return warnings;
}

// ── CONFLICT BANNER ──
let _dConflictAgentId = null;
function dShowConflictBanner(agentId, warns) {
  _dConflictAgentId = agentId;
  const w = warns[0];
  const el = document.getElementById('dispatch-conflict-banner');
  if(!el) return;
  document.getElementById('dcb-title').textContent = w.title;
  document.getElementById('dcb-body').innerHTML = w.body;
  el.style.display = 'block';
}
function dHideConflictBanner() {
  const el = document.getElementById('dispatch-conflict-banner');
  if(el) el.style.display = 'none';
  _dConflictAgentId = null;
}
function dConflictOpt1() { dHideConflictBanner(); notify('Modification conservée telle quelle', 'info'); }
function dConflictOpt2() {
  const totalR = dTotalEffectiveRates();
  const agents = dAgents();
  const frozenSum = agents.filter(a => a.rateLocked || a.id === _dConflictAgentId).reduce((s,a) => s + dEffectiveRate(a), 0);
  const free = agents.filter(a => !a.rateLocked && a.id !== _dConflictAgentId);
  const freeAutoSum = free.reduce((s,a) => s + dAutoRate(a), 0);
  const target = 1 - frozenSum;
  if(target <= 0 || freeAutoSum <= 0) { notify('Redistribution impossible — ajustez manuellement', 'warning'); dHideConflictBanner(); return; }
  const ratio = target / freeAutoSum;
  free.forEach(a => {
    const c = APP.commerciaux.find(x => x.id === a.id); if(!c) return;
    c.dispatchCustomRate = dAutoRate(a) * ratio;
  });
  saveDB();
  if(currentPage === 'dispatch') renderDispatchPage();
  dHideConflictBanner();
  notify('Agents redistribués — total ≈ 100%', 'success');
}
function dConflictOpt3() {
  APP.commerciaux.forEach(c => { c.dispatchCustomRate = null; c.dispatchRateLocked = false; });
  saveDB();
  if(currentPage === 'dispatch') renderDispatchPage();
  dHideConflictBanner();
  notify('Taux automatiques rétablis', 'success');
}

// ── MAIN DISPATCH PAGE RENDERER ──
let _dTab = 'algo';
function renderDispatchPage() {
  // Ensure dispatch object exists
  if(!APP.dispatch) APP.dispatch = { weights:{pdv:60,agents:25,zones:15}, dotations:[], specialOrders:[], suppliers:[] };
  if(!APP.dispatch.dotations) APP.dispatch.dotations = [];
  if(!APP.dispatch.specialOrders) APP.dispatch.specialOrders = [];
  if(!APP.dispatch.suppliers) APP.dispatch.suppliers = [];

  const ag = dActiveGadgets();
  const zones = dZones();
  const agents = dAgents();
  const totalR = dTotalEffectiveRates();
  const rOk = Math.abs(totalR - 1) < 0.01;
  const rColor = rOk ? 'var(--success)' : totalR > 1 ? 'var(--danger)' : 'var(--warning)';
  const w = dWeights();
  const zw = dNormalizedZoneWeights();
  const budget = dCalcBudget();
  const to = dTotalToOrder();
  const mn = dMonthlyNeed();

  document.getElementById('content').innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
    <div>
      <div class="page-title">⚙️ Dispatch Gadgets</div>
      <div style="font-size:12px;color:var(--text-2);margin-top:2px">${agents.length} commerciaux · ${zones.length} zones · ${ag.length} gadgets actifs</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="showPage('commerciaux')">👥 Gérer commerciaux</button>
      <button class="btn btn-secondary btn-sm" onclick="showPage('articles')">📦 Gérer gadgets</button>
      <button class="btn btn-primary btn-sm" onclick="dExportJSON()">⬇ Export JSON</button>
    </div>
  </div>

  <!-- KPI bar -->
  <div class="grid-4 mb-16">
    <div class="card"><div class="card-header"><span class="card-title">Commerciaux</span></div><div class="kpi-value" style="color:var(--accent)">${agents.length}</div><div class="kpi-change">${zones.length} zones</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Total PDV</span></div><div class="kpi-value" style="color:var(--accent2)">${dGrandTotalPDV().toLocaleString('fr-FR')}</div><div class="kpi-change">Boulangeries + Distributeurs</div></div>
    <div class="card" style="border-color:${rOk?'var(--success)':'var(--warning)'}"><div class="card-header"><span class="card-title">Somme taux</span></div><div class="kpi-value" style="color:${rColor}">${(totalR*100).toFixed(1)}%</div><div class="kpi-change">${rOk?'✓ 100% distribué':'⚠ Vérifier'}</div></div>
    <div class="card"><div class="card-header"><span class="card-title">Budget sem.</span></div><div class="kpi-value" style="font-size:20px;color:var(--warning)">${dFmt(budget._total)}</div><div class="kpi-change">000 FCFA</div></div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar" style="margin-bottom:16px">
    <button class="tab-btn${_dTab==='algo'?' active':''}" onclick="_dTab='algo';renderDispatchPage()">⚙ Algorithme</button>
    <button class="tab-btn${_dTab==='taux'?' active':''}" onclick="_dTab='taux';renderDispatchPage()">📐 Taux par agent</button>
    <button class="tab-btn${_dTab==='repartition'?' active':''}" onclick="_dTab='repartition';renderDispatchPage()">📦 Répartition finale</button>
    <button class="tab-btn${_dTab==='budget'?' active':''}" onclick="_dTab='budget';renderDispatchPage()">💰 Budget</button>
    <button class="tab-btn${_dTab==='gadgets'?' active':''}" onclick="_dTab='gadgets';renderDispatchPage()">🎁 Gadgets dispatch</button>
  </div>

  <!-- Conflict banner (always rendered, hidden by default) -->
  <div id="dispatch-conflict-banner" style="display:none;background:var(--bg-card);border:2px solid var(--warning);border-radius:var(--radius-lg);padding:14px 16px;margin-bottom:16px">
    <div style="font-size:13px;font-weight:700;color:var(--warning);margin-bottom:4px">⚠ <span id="dcb-title"></span></div>
    <div style="font-size:12px;color:var(--text-1);margin-bottom:12px" id="dcb-body"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button onclick="dConflictOpt1()" style="flex:1;min-width:150px;padding:10px 12px;border-radius:8px;border:1.5px solid rgba(255,71,87,0.4);background:rgba(255,71,87,0.06);cursor:pointer;text-align:left;font-family:inherit;transition:.15s">
        <div style="font-size:10px;font-weight:800;background:rgba(255,71,87,.15);color:var(--danger);width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:5px">1</div>
        <div style="font-size:12px;font-weight:700;color:var(--text-0);margin-bottom:2px">Laisser tel quel</div>
        <div style="font-size:11px;color:var(--text-2)">Appliquer sans ajustement — je gère moi-même les autres taux.</div>
      </button>
      <button onclick="dConflictOpt2()" style="flex:1;min-width:150px;padding:10px 12px;border-radius:8px;border:1.5px solid rgba(61,127,255,0.4);background:rgba(61,127,255,0.06);cursor:pointer;text-align:left;font-family:inherit;transition:.15s">
        <div style="font-size:10px;font-weight:800;background:rgba(61,127,255,.15);color:var(--accent);width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:5px">2</div>
        <div style="font-size:12px;font-weight:700;color:var(--text-0);margin-bottom:2px">Redistribuer les autres</div>
        <div style="font-size:11px;color:var(--text-2)">Conserver ma valeur et recalculer les autres agents proportionnellement.</div>
      </button>
      <button onclick="dConflictOpt3()" style="flex:1;min-width:150px;padding:10px 12px;border-radius:8px;border:1.5px solid rgba(46,213,115,0.4);background:rgba(46,213,115,0.06);cursor:pointer;text-align:left;font-family:inherit;transition:.15s">
        <div style="font-size:10px;font-weight:800;background:rgba(46,213,115,.15);color:var(--success);width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:5px">3</div>
        <div style="font-size:12px;font-weight:700;color:var(--text-0);margin-bottom:2px">Rétablir l'auto</div>
        <div style="font-size:11px;color:var(--text-2)">Remettre tous les taux en automatique.</div>
      </button>
    </div>
  </div>

  <div id="dispatch-tab-content">${renderDispatchTabContent()}</div>`;
}

function renderDispatchTabContent() {
  if(_dTab === 'algo') return renderDTabAlgo();
  if(_dTab === 'taux') return renderDTabTaux();
  if(_dTab === 'repartition') return renderDTabRepartition();
  if(_dTab === 'budget') return renderDTabBudget();
  if(_dTab === 'gadgets') return renderDTabGadgets();
  return '';
}

function renderDTabAlgo() {
  const w = dWeights();
  const zones = dZones();
  const zw = dNormalizedZoneWeights();
  const agents = dAgents();
  const ag = dActiveGadgets();
  return `
  <div class="card mb-16">
    <div class="card-header"><span class="card-title">⚙ Algorithme de dispatch automatique — 3 niveaux</span></div>
    <div class="card-body" style="padding:16px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0;border:1px solid var(--border);border-radius:var(--radius)">
        ${['Stock → Zones','Quota zone → Agents','Arrondis & Restes'].map((t,i)=>`<div style="padding:14px 16px;border-right:1px solid var(--border)${i===2?';border-right:none':''}">
          <div style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:white;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:6px">${i+1}</div>
          <div style="font-size:12px;font-weight:700;margin-bottom:3px">${t}</div>
          <div style="font-size:11px;color:var(--text-2)">${['Stock réparti par zones via poids PDV + nb agents + équité zones','Part du quota zone × PDV relatif de l\'agent dans sa zone','Arrondis à l\'entier, restes aux plus grands décimaux'][i]}</div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--accent);background:rgba(61,127,255,.1);padding:3px 6px;border-radius:4px;margin-top:6px;display:inline-block">${['QuotaZone = Stock × PoidsZone','AllocAgent = QuotaZone × (PDV_a/PDV_z)','Σ = Stock exact'][i]}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card mb-16">
    <div class="card-header">
      <span class="card-title">Pondération des zones</span>
      <button class="btn btn-secondary btn-sm" onclick="dResetWeights()">↺ Réinitialiser</button>
    </div>
    <div class="card-body" style="padding:16px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:12px">
        ${[{key:'pdv',label:'Poids PDV',desc:'Favorise les agents avec plus de PDV',id:'dw-pdv'},
           {key:'agents',label:'Poids Commerciaux',desc:'Favorise les zones avec plus de commerciaux',id:'dw-agents'},
           {key:'zones',label:'Poids Zones',desc:'Répartition équitable entre zones',id:'dw-zones'}].map(wc=>`
          <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-2)">
              <span>${wc.label}</span><span id="dwval-${wc.key}" style="font-family:var(--font-mono);color:var(--accent)">${w[wc.key]}%</span>
            </div>
            <div style="font-size:10px;color:var(--text-2);margin-bottom:8px">${wc.desc}</div>
            <input type="range" id="${wc.id}" min="0" max="100" step="5" value="${w[wc.key]}"
              style="width:100%;accent-color:var(--accent)"
              oninput="document.getElementById('dwval-${wc.key}').textContent=this.value+'%';dSyncWeightLabels();renderDispatchTabContent2()">
          </div>`).join('')}
      </div>
      <div id="dw-total-label" style="font-size:11px;color:var(--text-2)">Somme : ${w.pdv+w.agents+w.zones}%</div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title">Résultat dispatch automatique</span>
    </div>
    <div class="card-body" style="padding:16px">
      ${zones.length === 0 ? '<div class="empty-state"><p>Aucune zone définie — <button class="btn btn-primary btn-sm" onclick="dOpenAddZone()">+ Créer une zone</button></p></div>'
      : zones.map(z => {
        const zagents = dZoneAgents(z.id);
        const zShare = (zw[z.id]*100).toFixed(1);
        return `<div style="margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
            <div style="width:8px;height:8px;border-radius:50%;background:${z.color};flex-shrink:0"></div>
            <span style="font-size:13px;font-weight:700;color:${z.color};text-transform:uppercase">${dEsc(z.label)}</span>
            <span class="badge badge-blue">Quote-part : ${zShare}%</span>
            <span style="font-size:11px;color:var(--text-2)">${zagents.length} agents · ${dFmt(dZonePDV(z.id))} PDV</span>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>Commercial</th><th>PDV</th><th>Part dans zone</th><th>Taux auto</th>${ag.map(g=>`<th>${dEsc(g.label.slice(0,10))}<br><span style="font-size:9px;color:var(--text-2)">${dFmt(g.allocMax)} max</span></th>`).join('')}</tr></thead>
            <tbody>
            ${zagents.map(a => {
              const pdv = dAgentPDV(a), zPDV = dZonePDV(z.id)||1, aRate = dAutoRate(a);
              return `<tr>
                <td style="font-weight:600">${dEsc(a.name)}<br><span style="font-size:11px;color:var(--text-2)">${dEsc(a.zone)}</span></td>
                <td style="font-family:var(--font-mono)">${dFmt(pdv)}</td>
                <td style="font-family:var(--font-mono);color:var(--text-2)">${dFmtPctS(pdv/(zPDV||1))}</td>
                <td style="font-family:var(--font-mono);color:var(--success);font-weight:700">${dFmtPct(aRate)}</td>
                ${ag.map(g=>`<td style="font-family:var(--font-mono);color:var(--accent)">${dFmt(Math.round(g.allocMax*aRate))}</td>`).join('')}
              </tr>`;
            }).join('')}
            </tbody>
          </table></div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderDispatchTabContent2() {
  const el = document.getElementById('dispatch-tab-content');
  if(el && _dTab === 'algo') el.innerHTML = renderDTabAlgo();
}

function renderDTabTaux() {
  const agents = dAgents();
  const totalR = dTotalEffectiveRates();
  const rOk = Math.abs(totalR-1) < 0.005;
  const rColor = rOk ? 'var(--success)' : totalR > 1 ? 'var(--danger)' : 'var(--warning)';
  const zones = dZones();
  const zColors = {};  zones.forEach(z => zColors[z.id] = z.color);

  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">Taux par commercial</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" onclick="dResetAllRates()">↺ Tout remettre en Auto</button>
      </div>
    </div>
    <div class="card-body" style="padding:16px">
      <!-- Distribution bar -->
      <div style="height:12px;border-radius:6px;overflow:hidden;display:flex;gap:1px;margin-bottom:12px">
        ${agents.map(a => `<div title="${dEsc(a.name)}: ${(dEffectiveRate(a)*100).toFixed(2)}%" style="width:${(dEffectiveRate(a)*100).toFixed(2)}%;height:100%;min-width:2px;background:${zColors[a.zoneId]||'var(--accent)'}${a.customRate!==null?';opacity:0.7':''}"></div>`).join('')}
      </div>
      <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;font-size:11px">
        ${zones.map(z => { const r = dZoneAgents(z.id).reduce((s,a)=>s+dEffectiveRate(a),0); return `<span style="color:${z.color}">■ ${dEsc(z.label.split(' ')[0])} ${(r*100).toFixed(1)}%</span>`; }).join('')}
        <span style="margin-left:auto;color:${rColor};font-weight:700">Σ = ${(totalR*100).toFixed(2)}% ${rOk?'✓':''}</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Commercial</th><th>Zone</th><th>PDV</th>
          <th>Taux Auto<br><span style="font-size:9px;font-weight:400">3 niveaux</span></th>
          <th>Taux effectif<br><span style="font-size:9px;font-weight:400">Modifiez ici</span></th>
          <th>Mode</th><th>Δ vs Auto</th><th>Actions</th>
        </tr></thead>
        <tbody>
        ${agents.map(a => {
          const auto = dAutoRate(a), eff = dEffectiveRate(a), isC = a.customRate !== null;
          const delta = eff - auto;
          const z = zones.find(z => z.id === a.zoneId);
          return `<tr>
            <td style="font-weight:600">${dEsc(a.name)}<br><span style="font-size:11px;color:var(--text-2)">${dEsc(a.zone)}</span></td>
            <td><span class="badge" style="background:${z?z.color+'22':'var(--bg-3)'};color:${z?z.color:'var(--text-2)'}">${dEsc(z?z.label:'—')}</span></td>
            <td style="font-family:var(--font-mono)">${dFmt(dAgentPDV(a))}</td>
            <td style="font-family:var(--font-mono);color:var(--success)">${dFmtPct(auto)}</td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <input type="number" min="0" max="100" step="0.001"
                  value="${(eff*100).toFixed(3)}"
                  style="width:80px;padding:5px 8px;border-radius:6px;border:1.5px solid ${isC?'rgba(61,127,255,.5)':'var(--border)'};background:${isC?'rgba(61,127,255,.06)':'var(--bg-3)'};color:${isC?'var(--accent)':'var(--success)'};font-family:var(--font-mono);font-size:12px;font-weight:700;text-align:center;outline:none"
                  onchange="dSetAgentRate('${a.id}',this.value)"
                  onfocus="this.select()">
                <span style="font-size:11px;color:var(--text-2)">%</span>
              </div>
            </td>
            <td>${isC?`<span class="badge badge-blue">✎ Manuel${a.rateLocked?' 🔒':''}</span>`:`<span class="badge badge-green">⚡ Auto</span>`}</td>
            <td style="font-family:var(--font-mono);font-size:12px;color:${Math.abs(delta)>0.001?(delta>0?'var(--warning)':'var(--accent)'):'var(--text-2)'}">
              ${isC?(delta>=0?'+':'')+( delta*100).toFixed(2)+'%':'–'}
            </td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn btn-secondary btn-sm" onclick="dToggleLock('${a.id}')" title="${a.rateLocked?'Déverrouiller':'Verrouiller'}">${a.rateLocked?'🔒':'🔓'}</button>
                ${isC?`<button class="btn btn-warning btn-sm" onclick="dResetAgentRate('${a.id}')">↺ Auto</button>`:''}
              </div>
            </td>
          </tr>`;
        }).join('')}
        </tbody>
        <tfoot><tr style="background:var(--bg-2);font-weight:700">
          <td colspan="2">TOTAL</td>
          <td style="font-family:var(--font-mono)">${dFmt(dGrandTotalPDV())}</td>
          <td style="font-family:var(--font-mono)">100.00%</td>
          <td style="font-family:var(--font-mono);color:${rColor}">${(totalR*100).toFixed(2)}%</td>
          <td colspan="3"></td>
        </tr></tfoot>
      </table></div>
    </div>
  </div>`;
}

function renderDTabRepartition() {
  const ag = dActiveGadgets();
  const zones = dZones();
  const tot = dGrandTotals();
  const mn = dMonthlyNeed();
  const dt = dDotationTotals();

  return `
  ${zones.map(z => {
    const zagents = dZoneAgents(z.id);
    const zt = dZoneTotals(z.id);
    return `<div class="card mb-16" style="border-top:3px solid ${z.color}">
      <div class="card-header">
        <span class="card-title" style="color:${z.color}">${dEsc(z.label)}</span>
        <span style="font-size:12px;color:var(--text-2)">Taux cumulé : ${dFmtPct(zt.part)}</span>
      </div>
      <div class="card-body" style="padding:0"><div class="table-wrap"><table>
        <thead><tr><th>Commercial</th><th>PDV</th><th>Taux effectif</th>${ag.map(g=>`<th>${dEsc(g.label.slice(0,10))}</th>`).join('')}</tr></thead>
        <tbody>
        ${zagents.map(a => {
          const eff = dEffectiveRate(a), isC = a.customRate !== null, al = dAgentAllocs(a);
          return `<tr>
            <td style="font-weight:600">${dEsc(a.name)}<br><span style="font-size:11px;color:var(--text-2)">${dEsc(a.zone)}</span></td>
            <td style="font-family:var(--font-mono)">${dFmt(dAgentPDV(a))}</td>
            <td style="font-family:var(--font-mono);color:${isC?'var(--accent)':'var(--success)'}">${dFmtPct(eff)}${isC?' ✎':''}</td>
            ${ag.map(g=>`<td style="font-family:var(--font-mono);color:var(--accent-blue,#3d7fff)">${al[g.id]>0?dFmt(al[g.id],0):'–'}</td>`).join('')}
          </tr>`;
        }).join('')}
        <tr style="background:var(--bg-2);font-weight:700">
          <td>Total ${dEsc(z.label)}</td>
          <td style="font-family:var(--font-mono)">${dFmt(zt.pdv)}</td>
          <td style="font-family:var(--font-mono)">${dFmtPct(zt.part)}</td>
          ${ag.map(g=>`<td style="font-family:var(--font-mono)">${dFmt(zt[g.id],0)}</td>`).join('')}
        </tr>
        </tbody>
      </table></div></div>
    </div>`;
  }).join('')}

  <div class="card mb-16">
    <div class="card-header"><span class="card-title">Consolidation toutes zones</span></div>
    <div class="card-body" style="padding:0"><div class="table-wrap"><table>
      <thead><tr><th>Zone</th><th>PDV</th><th>Taux</th>${ag.map(g=>`<th>${dEsc(g.label.slice(0,10))}</th>`).join('')}</tr></thead>
      <tbody>
      ${zones.map(z => { const zt = dZoneTotals(z.id); return `<tr>
        <td style="font-weight:700;color:${z.color}">${dEsc(z.label)}</td>
        <td style="font-family:var(--font-mono)">${dFmt(zt.pdv)}</td>
        <td style="font-family:var(--font-mono)">${dFmtPct(zt.part)}</td>
        ${ag.map(g=>`<td style="font-family:var(--font-mono)">${dFmt(zt[g.id],0)}</td>`).join('')}
      </tr>`; }).join('')}
      <tr style="background:rgba(61,127,255,.08);font-weight:700;color:var(--accent)">
        <td>TOTAL</td><td style="font-family:var(--font-mono)">${dFmt(tot.pdv)}</td>
        <td style="font-family:var(--font-mono)">${dFmtPct(dTotalEffectiveRates())}</td>
        ${ag.map(g=>`<td style="font-family:var(--font-mono)">${dFmt(tot[g.id],0)}</td>`).join('')}
      </tr>
      </tbody>
    </table></div></div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title">Besoin global mensuel</span></div>
    <div class="card-body" style="padding:0"><div class="table-wrap"><table>
      <thead><tr><th>Poste</th>${ag.map(g=>`<th>${dEsc(g.label.slice(0,10))}</th>`).join('')}</tr></thead>
      <tbody>
      <tr><td>Allocation agents (PDV)</td>${ag.map(g=>`<td style="font-family:var(--font-mono);color:var(--accent)">${dFmt(tot[g.id],0)}</td>`).join('')}</tr>
      <tr><td>Dotations spéciales</td>${ag.map(g=>`<td style="font-family:var(--font-mono)">${dFmt(dt[g.id])}</td>`).join('')}</tr>
      <tr style="background:var(--bg-2);font-weight:700"><td>Besoin mensuel</td>${ag.map(g=>`<td style="font-family:var(--font-mono)">${dFmt(mn[g.id],0)}</td>`).join('')}</tr>
      <tr><td style="color:var(--accent)">× 6 mois</td>${ag.map(g=>`<td style="font-family:var(--font-mono);color:var(--accent)">${dFmt(mn[g.id]*6)}</td>`).join('')}</tr>
      </tbody>
    </table></div></div>
  </div>`;
}

function renderDTabBudget() {
  const budget = dCalcBudget();
  const to = dTotalToOrder();
  const mn = dMonthlyNeed();
  const sp = dSpecialTotals();
  const ag = dActiveGadgets();
  return `
  <div class="grid-3 mb-16">
    <div class="card" style="grid-column:span 2"><div class="card-header"><span class="card-title">Budget total semestre</span></div>
      <div class="kpi-value" style="color:var(--warning)">${dFmt(budget._total)} <span style="font-size:14px;font-weight:400">000 FCFA</span></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Total unités</span></div>
      <div class="kpi-value">${dFmt(Object.values(to).reduce((a,b)=>a+b,0))}</div>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">Détail par gadget</span></div>
    <div class="card-body" style="padding:0"><div class="table-wrap"><table>
      <thead><tr><th>Gadget</th><th>Besoin mensuel</th><th>×6 mois</th><th>Cmd spéc.</th><th>Total à commander</th><th>Prix (FCFA)</th><th>Montant (000 FCFA)</th></tr></thead>
      <tbody>
      ${ag.map(g=>`<tr>
        <td style="font-weight:600">${dEsc(g.label)}</td>
        <td style="font-family:var(--font-mono)">${dFmt(mn[g.id],0)}</td>
        <td style="font-family:var(--font-mono)">${dFmt(mn[g.id]*6)}</td>
        <td style="font-family:var(--font-mono);color:var(--accent)">${dFmt(sp[g.id])}</td>
        <td style="font-family:var(--font-mono);font-weight:700">${dFmt(to[g.id])}</td>
        <td style="font-family:var(--font-mono)">${dN(g.price).toLocaleString('fr-FR')}</td>
        <td style="font-family:var(--font-mono);color:var(--warning);font-weight:700">${dFmt(budget[g.id])}</td>
      </tr>`).join('')}
      </tbody>
      <tfoot><tr style="background:rgba(255,165,2,.08);font-weight:700;color:var(--warning)">
        <td>TOTAL</td><td></td><td></td><td></td>
        <td style="font-family:var(--font-mono)">${dFmt(Object.values(to).reduce((a,b)=>a+b,0))}</td>
        <td></td><td style="font-family:var(--font-mono)">${dFmt(budget._total)} 000</td>
      </tr></tfoot>
    </table></div></div>
  </div>`;
}

function renderDTabGadgets() {
  const gadgetsWithAlloc = APP.articles.filter(a => a._gma || a.dispatchAllocMax > 0);
  const dotations = dDotations();
  const ag = dActiveGadgets();

  return `
  <div class="card mb-16">
    <div class="card-header">
      <span class="card-title">Gadgets activés pour le dispatch</span>
      <span style="font-size:12px;color:var(--text-2)">Modifiez dispatchAllocMax sur les articles · <button class="btn btn-secondary btn-sm" onclick="showPage('articles')">→ Voir gadgets</button></span>
    </div>
    <div class="card-body" style="padding:0"><div class="table-wrap"><table>
      <thead><tr><th>Gadget</th><th>Stock dispo</th><th>Alloc max (dispatch)</th><th>Prix</th><th>Actif dispatch</th></tr></thead>
      <tbody>
      ${gadgetsWithAlloc.length === 0 ? '<tr><td colspan="5"><div class="empty-state"><p>Aucun gadget configuré — double-cliquez sur un article pour définir son allocMax dispatch</p></div></td></tr>'
      : gadgetsWithAlloc.map(a=>`<tr>
        <td style="font-weight:600">${dEsc(a.name)}</td>
        <td style="font-family:var(--font-mono);color:var(--success)">${a.stock}</td>
        <td>
          <input type="number" min="0" value="${a.dispatchAllocMax||0}" style="width:80px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-3);color:var(--text-0);font-size:12px"
            onchange="dSetGadgetField('${a.id}','dispatchAllocMax',+this.value);renderDispatchPage()">
        </td>
        <td style="font-family:var(--font-mono)">${(a.price||0).toLocaleString('fr-FR')} FCFA</td>
        <td>
          <input type="checkbox" ${a.dispatchActive!==false?'checked':''} style="cursor:pointer;width:16px;height:16px"
            onchange="dSetGadgetField('${a.id}','dispatchActive',this.checked);renderDispatchPage()">
        </td>
      </tr>`).join('')}
      </tbody>
    </table></div></div>
  </div>

  <div class="card mb-16">
    <div class="card-header">
      <span class="card-title">Dotations spéciales</span>
      <button class="btn btn-primary btn-sm" onclick="dAddDotation()">+ Ajouter</button>
    </div>
    <div class="card-body" style="padding:0"><div class="table-wrap"><table>
      <thead><tr><th>Bénéficiaire</th>${ag.map(g=>`<th>${dEsc(g.label.slice(0,9))}</th>`).join('')}<th>Actions</th></tr></thead>
      <tbody id="d-dot-tbody">
      ${dotations.length === 0 ? '<tr><td colspan="99"><div class="empty-state"><p>Aucune dotation</p></div></td></tr>'
      : dotations.map(d=>`<tr>
        <td style="font-weight:600">${dEsc(d.label)}</td>
        ${ag.map(g=>`<td><input type="number" min="0" value="${dN(d.qty[g.id])}" style="width:55px;padding:2px 6px;border:none;border-bottom:1px dashed var(--border);background:transparent;color:var(--text-0);font-size:12px;text-align:right" onchange="dUpdateDotation('${d.id}','${g.id}',+this.value)"></td>`).join('')}
        <td><button class="btn btn-danger btn-sm" onclick="dDeleteDotation('${d.id}')">✕</button></td>
      </tr>`).join('')}
      </tbody>
    </table></div></div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title">Commandes spéciales</span>
      <button class="btn btn-primary btn-sm" onclick="dAddSpecialOrder()">+ Ajouter</button>
    </div>
    <div class="card-body" style="padding:0"><div class="table-wrap"><table>
      <thead><tr><th>Libellé</th>${ag.map(g=>`<th>${dEsc(g.label.slice(0,9))}</th>`).join('')}<th>Actions</th></tr></thead>
      <tbody>
      ${dSpecialOrders().length === 0 ? '<tr><td colspan="99"><div class="empty-state"><p>Aucune commande spéciale</p></div></td></tr>'
      : dSpecialOrders().map(s=>`<tr>
        <td style="font-weight:600">${dEsc(s.label)}</td>
        ${ag.map(g=>`<td><input type="number" min="0" value="${dN(s.qty[g.id])}" style="width:55px;padding:2px 6px;border:none;border-bottom:1px dashed var(--border);background:transparent;color:var(--text-0);font-size:12px;text-align:right" onchange="dUpdateSpecialOrder('${s.id}','${g.id}',+this.value)"></td>`).join('')}
        <td><button class="btn btn-danger btn-sm" onclick="dDeleteSpecialOrder('${s.id}')">✕</button></td>
      </tr>`).join('')}
      </tbody>
    </table></div></div>
  </div>`;
}

// ── DISPATCH DATA MUTATIONS ──
function dResetWeights() {
  APP.dispatch.weights = {pdv:60, agents:25, zones:15};
  const pdvEl = document.getElementById('dw-pdv');
  const agEl = document.getElementById('dw-agents');
  const znEl = document.getElementById('dw-zones');
  if(pdvEl) pdvEl.value = 60;
  if(agEl) agEl.value = 25;
  if(znEl) znEl.value = 15;
  dSyncWeightLabels();
  renderDispatchPage();
  notify('Pondérations réinitialisées', 'success');
}
function dAddDotation() {
  openModal('ddot', 'Nouvelle Dotation', `<div class="form-group"><label>Bénéficiaire</label><input id="ddot-label" placeholder="ex: Commercial"></div>`, () => {
    const label = document.getElementById('ddot-label').value.trim();
    if(!label) { notify('Nom requis','danger'); return; }
    const nd = {id: generateId(), label, qty: {}};
    dGadgets().forEach(g => nd.qty[g.id] = 0);
    APP.dispatch.dotations.push(nd);
    saveDB(); closeModal(); renderDispatchPage();
    notify('Dotation ajoutée','success');
  });
}
function dUpdateDotation(id, gid, val) {
  const d = APP.dispatch.dotations.find(x => x.id === id); if(!d) return;
  if(!d.qty) d.qty = {};
  d.qty[gid] = val; saveDB();
}
function dDeleteDotation(id) {
  APP.dispatch.dotations = APP.dispatch.dotations.filter(d => d.id !== id);
  saveDB(); renderDispatchPage(); notify('Dotation supprimée', 'warning');
}
function dAddSpecialOrder() {
  openModal('dsp', 'Nouvelle Commande Spéciale', `<div class="form-group"><label>Libellé</label><input id="dsp-label" placeholder="ex: Événement"></div>`, () => {
    const label = document.getElementById('dsp-label').value.trim();
    if(!label) { notify('Requis','danger'); return; }
    const ns = {id: generateId(), label, qty: {}};
    dGadgets().forEach(g => ns.qty[g.id] = 0);
    APP.dispatch.specialOrders.push(ns);
    saveDB(); closeModal(); renderDispatchPage();
    notify('Commande ajoutée','success');
  });
}
function dUpdateSpecialOrder(id, gid, val) {
  const s = APP.dispatch.specialOrders.find(x => x.id === id); if(!s) return;
  if(!s.qty) s.qty = {};
  s.qty[gid] = val; saveDB();
}
function dDeleteSpecialOrder(id) {
  APP.dispatch.specialOrders = APP.dispatch.specialOrders.filter(s => s.id !== id);
  saveDB(); renderDispatchPage(); notify('Commande supprimée', 'warning');
}
function dSetGadgetField(artId, field, val) {
  const a = APP.articles.find(x => x.id === artId); if(!a) return;
  a[field] = val; saveDB(); updateAlertBadge();
}

// ── ZONE MANAGEMENT — delegates to shared openZoneModal ──
function dOpenAddZone() { openZoneModal(); }

// ── DISPATCH EXPORT ──
function dExportJSON() {
  const payload = {
    meta: { title:'DISPATCH GADGETS', generated: new Date().toISOString() },
    config: { weights: dWeights() },
    zones: dZones(),
    agents: dAgents(),
    gadgets: dActiveGadgets(),
    dotations: dDotations(),
    specialOrders: dSpecialOrders(),
    computed: {
      grandTotalPDV: dGrandTotalPDV(),
      totalEffectiveRates: dTotalEffectiveRates(),
      monthlyNeed: dMonthlyNeed(),
      totalToOrder: dTotalToOrder(),
      budget: dCalcBudget(),
    }
  };
  downloadFile(JSON.stringify(payload, null, 2), 'dispatch-gadgets-' + Date.now() + '.json', 'application/json');
  auditLog('EXPORT','dispatch',null,null,{ts:Date.now()});
  notify('Export Dispatch téléchargé ✓','success');
}

// ── SYNC: when a commercial is saved, also sync their dispatch fields if needed ──
function dInitCommercialDispatchFields(c) {
  if(c.dispatchZoneId === undefined || c.dispatchZoneId === null) {
    // Try to auto-assign zone based on secteurId → zoneId
    const sect = (APP.secteurs||[]).find(s=>s.id===c.secteurId);
    c.dispatchZoneId = sect?.zoneId || (APP.zones?.[0]?.id || '');
  }
  if(c.dispatchBoul === undefined) c.dispatchBoul = Math.max(0, Math.round((c.nbClients||0) * 0.65));
  if(c.dispatchDist === undefined) c.dispatchDist = Math.max(0, Math.round((c.nbClients||0) * 0.35));
  if(c.dispatchCustomRate === undefined) c.dispatchCustomRate = null;
  if(c.dispatchRateLocked === undefined) c.dispatchRateLocked = false;
}

// ── HOOK into saveCommercial to init dispatch fields ──
const _origSaveCommercial = typeof saveCommercial !== 'undefined' ? null : null; // placeholder — patched below

// ============================================================
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

initApp();
