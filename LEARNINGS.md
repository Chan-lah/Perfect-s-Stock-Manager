# PSM — Learnings log

Journal append-only des corrections, patterns validés, findings et décisions
écartées. Chaque entrée a une date absolue. À lire (20 dernières) au début de
chaque session pour calibrer le comportement.

**Format** :
```
## YYYY-MM-DD — [titre court]
- **Type**: correction | validated-pattern | finding | discard
- **Trigger**: ce qui a déclenché
- **Règle**: ce qu'il faut faire / ne plus faire
- **Pourquoi**: la raison (critique pour juger les cas limites)
- **Contexte**: tâche / commit / fichier
```

Si une entrée devient obsolète → la laisser en place mais préfixer le titre
avec `[OUTDATED YYYY-MM-DD]` et expliquer en une ligne pourquoi.

---

## 2026-04-21 — Propose before coding sur app.js et fichiers porteurs
- **Type**: correction
- **Trigger**: incident annuaire rollback (plusieurs semaines de bug silencieux)
- **Règle**: toute modif d'app.js / storage.js / auth.js / firebase-config.js doit être annoncée avec diff prévu AVANT d'écrire, même si la règle globale dit "commit après chaque change"
- **Pourquoi**: un script Python qui applique 7 patches d'un coup sans review = régression silencieuse impossible à isoler. L'utilisateur a besoin de voir ce qui change.
- **Contexte**: commits 0b9db68, a6f0c67

## 2026-04-21 — _SYNC_SECTIONS whitelist strict
- **Type**: finding
- **Trigger**: enquête bug annuaire
- **Règle**: toute nouvelle clé `APP.<section>` éditable DOIT être ajoutée à `_SYNC_SECTIONS` dans storage.js. Vérifier après toute modif de schéma APP.
- **Pourquoi**: sans ça, les edits de cette section seule produisent un diff vide → cloud save skipped → rollback au reload. Safety net ajouté (hash global) mais ne remplace pas la whitelist.
- **Contexte**: commit 0b9db68, a6f0c67, storage.js:107-113

## 2026-04-21 — Pas de sugarcoating
- **Type**: validated-pattern
- **Trigger**: utilisateur a explicitement validé "pas de sucre" + "refus du destructif sans autorisation"
- **Règle**: pushback direct, court, factuel. Pas de formules d'adoucissement type "c'est une bonne idée mais". Refus obligatoire pour tout destructif en prod sans autorisation explicite datée.
- **Pourquoi**: l'utilisateur préfère savoir franchement qu'une approche casse quelque chose plutôt que de se retrouver avec un problème après.
- **Contexte**: CLAUDE.md projet, commit 07f8a77

## 2026-04-21 — Guard centralisé via helper plutôt que N guards dispersés
- **Type**: validated-pattern
- **Trigger**: implémentation bons rétroactifs — 4 fonctions (validateBon, cancelBon, reactivateBon, inline dropdown) appelaient toutes `_handleBonStatusStockChange`
- **Règle**: quand plusieurs sites partagent un helper, ajouter la garde (early-return) DANS le helper, pas dans chaque appelant. Réduit les oublis et centralise la sémantique.
- **Pourquoi**: un seul `if (b._retroactif) return true;` en tête de `_handleBonStatusStockChange` couvre 4 chemins. Ajouter 4 guards séparés = 4 risques d'oubli + divergence sémantique si la règle évolue.
- **Contexte**: commit 8274ec8, app.js:3358

## 2026-04-21 — Immutabilité via UI disabled plutôt que validation runtime
- **Type**: validated-pattern
- **Trigger**: choix 4b (bon rétroactif immutable après création) — fallait choisir entre bloquer côté serveur/code OU côté UI
- **Règle**: pour un flag qui doit être immutable post-création, utiliser `<input disabled ${bon?'disabled':''}>` côté UI + lire la valeur uniquement sur le chemin create. Sur edit path, ignorer le DOM et utiliser `bon._retroactif` (source of truth = données stockées).
- **Pourquoi**: simple, visuel (grisé = "pas modifiable"), zéro code de validation runtime. Les attributs disabled html sont respectés par tous les navigateurs. Si quelqu'un force via DevTools, seul son UI est affecté car saveBon n'écoute pas le checkbox en edit path.
- **Contexte**: commit 8274ec8, app.js:3505-3510 (form) + 3657 (`var _retroactif` lu 1x mais utilisé uniquement en create)

## 2026-04-21 — Match Python patch : vérifier le count AVANT d'écrire
- **Type**: finding
- **Trigger**: 2 échecs successifs pendant patch bons rétroactifs (`_version:1};` trouvé 2× au lieu de 1, et `'brouillon'))}` pas trouvé — 1 paren de trop)
- **Règle**: quand un substring patch échoue, faire un `grep` rapide sur le pattern (pas une regex) pour voir toutes les occurrences réelles et choisir un contexte plus spécifique. Ne jamais deviner.
- **Pourquoi**: les fichiers de ~10k lignes répètent beaucoup de patterns (`createdAt:Date.now()`, `_version:1`, etc.). Une regex vague matche souvent 2-3 sites et casse silencieusement si on ne vérifie pas. L'assertion du script sauve mais coûte 1 itération chaque fois.
- **Contexte**: C:/tmp/bons_retroactif.py, 2 retries avant succès

## 2026-04-21 — Grandfather rule pour ownership rétroactif
- **Type**: validated-pattern
- **Trigger**: H1 — ajout d'`createdBy` sur les bons. Problème : les bons existants n'ont pas ce champ, comment gérer leur suppression ?
- **Règle**: quand on introduit un champ de propriété (ex: `createdBy`, `ownerId`) rétroactivement, les entités legacy (sans ce champ) doivent tomber dans le path le plus restrictif (admin only). Pas de "fallback permissif" type "si pas de champ, tout le monde peut".
- **Pourquoi**: rétro-attribuer la propriété est risqué (faux positifs, perte d'audit). Mieux vaut une frustration temporaire (admin doit cleaner les vieux bons) qu'un trou permanent. Visible dès le 1er test : l'UI affiche "Bon ancien — réservé admin" qui est explicite.
- **Contexte**: commit ce7dd99, app.js:3740 (deleteBon)

## 2026-04-21 — Firebase .on('value') initial fire = pas de logique de 1er passage
- **Type**: finding
- **Trigger**: C3 — profile listener devait force-logout sur change de rôle, sans se déclencher au premier fire
- **Règle**: Firebase `.on('value')` fire immédiatement avec la valeur courante quand on attache. Pour détecter un "change" et pas juste "lecture initiale", capturer la valeur AVANT d'attacher dans une var locale (ici `_initialRole`), puis comparer dans le callback. Le 1er fire passera naturellement (valeur identique).
- **Pourquoi**: sans ce pattern, il faut un flag `_firstFire=true` qui embrouille le code. La capture pré-attach est plus simple et ne rajoute pas de branche conditionnelle.
- **Contexte**: commit 86ab4f3, auth.js:74-87

## 2026-04-21 — Force-logout avec garde de réentrance obligatoire
- **Type**: validated-pattern
- **Trigger**: C3 — un listener qui appelle logoutUser() peut re-fire pendant le logout et boucler
- **Règle**: toute fonction de "force-action-destructive-déclenchée-par-observer" (force logout, force reload, force modal) doit avoir un flag de réentrance global (`window._psmForcingLogout`) testé en entrée ET reset en fin d'action. setTimeout(..., 400) pour laisser le logout terminer avant de rouvrir la garde.
- **Pourquoi**: un listener Firebase peut fire 2-3 fois pendant une transition (detach, auth.signOut, etc.). Sans garde → double notif, double logActivity, double signOut → erreur console + UX cassée.
- **Contexte**: commit 86ab4f3, auth.js:97-102 (_forceLogout)

## 2026-05-19 — Firebase .set() au parent EFFACE les nœuds frères
- **Type**: correction
- **Trigger**: bug perte de 427 entrées d'archives (bons/mvts/audit) après sweep réussi. Diagnostic : `_doSaveToCloud` faisait `ref('app_data').set({data, updated_at})` qui wipait silencieusement `app_data/archives/...` à chaque save.
- **Règle**: pour des saves partielles d'un parent Firebase qui contient des nœuds frères, **toujours utiliser `.update()`** au lieu de `.set()`. `set()` au parent remplace tout l'enfant; `update()` merge au 1er niveau et préserve les frères.
- **Pourquoi**: Firebase RTDB `.set()` est destructif par design. Tout cadre qui co-écrit dans un même parent (ici archiveSweep écrit `app_data/archives` et _doSaveToCloud écrit `app_data/data`) est à risque dès qu'un `set` au parent partage la racine.
- **Contexte**: commit 1a802a5, storage.js:232

## 2026-05-19 — Single-session via currentSessionId + Firebase listener
- **Type**: validated-pattern
- **Trigger**: demande explicite d'empêcher 2 connexions simultanées sur le même compte (PSM admin)
- **Règle**: au login, écrire `profiles/{uid}/currentSessionId = newSessionId` puis attacher un `on('value')` qui force `_signOut()` si la valeur diverge du sessionId local. Grace de 2s pour éviter la race au F5 (le rafraîchissement régénère un sessionId et triggerait un faux kick). Cleanup au logout : détacher le listener + remove le field si encore le nôtre.
- **Pourquoi**: alternative au check au login (qui ne couvre pas le cas "user déjà connecté qui devrait être éjecté"). Le listener temps réel garantit que le PC1 est notifié instantanément quand PC2 prend le contrôle.
- **Contexte**: commit 8cdcc23, auth.js:381-403 (F10 setup) + auth.js:803-817 (F10 cleanup)

## 2026-05-19 — index.html chargeait des .min.js obsolètes en prod
- **Type**: finding
- **Trigger**: découverte que tous les commits récents (Sprints A/B/dispatch v2) n'étaient PAS en prod parce que index.html chargeait `app.min.js`/`auth.min.js`/`storage.min.js` jamais régénérés.
- **Règle**: si un projet a des sources non-minifiées (`app.js`) ET des minifiées (`app.min.js`), **toujours vérifier ce que index.html charge avant de croire qu'un commit est en prod**. Pour PSM (petit groupe d'users internes), bascule sur sources non-minifiées = plus jamais ce piège.
- **Pourquoi**: pas de pipeline de build (Vercel sert direct le repo). Si la minification est manuelle, elle finit oubliée. Mieux vaut accepter +30% de poids initial que risquer des commits inactifs en prod.
- **Contexte**: commit 3ed8598, index.html:173-175 (bascule .min → .js + suppression des 3 .min.js)

## 2026-05-19 — Hook self-review : créer le marker AVANT le git commit
- **Type**: correction
- **Trigger**: première tentative `mkdir .claude && touch .claude/.review-done && git commit -m ...` échouée — le PreToolUse hook s'exécute AVANT la commande bash, donc le `touch` n'a pas encore créé le marker quand le hook check.
- **Règle**: toujours faire le `touch .claude/.review-done` dans une **commande Bash séparée** AVANT le `git commit`, jamais dans la même chaîne. Le hook PreToolUse lit le filesystem AVANT que la commande bash tourne.
- **Pourquoi**: chain `&&` n'exécute pas les opérandes dans l'ordre pour les hooks externes. Le hook bloque tant que le fichier n'existe pas physiquement à son moment de vérification.
- **Contexte**: cette session, observable via .claude/hooks/pre-commit-review.sh:19-22

## 2026-05-19 — Dispatch v2 : retirer une ligne ≠ supprimer le bon
- **Type**: validated-pattern
- **Trigger**: l'utilisateur voulait "retirer 1 article d'un dispatch" sans annuler les 14 bons. Le code d'origine supprimait les bons entiers même quand ils contenaient d'autres articles du même dispatch.
- **Règle**: quand un dispatch génère N bons multi-lignes, l'action "annuler 1 article" doit **filter les lignes** du bon (`b.lignes = b.lignes.filter(...)`) et supprimer le bon **uniquement si toutes ses lignes disparaissent**. Pas tout-ou-rien.
- **Pourquoi**: granularité = élégance UX. Le user n'a pas à recréer 13 bons après retrait d'un article. Aussi : verrou 14j sur toute modif (impossibilité de réécrire le passé comptable).
- **Contexte**: commit 95c2d24, app.js:12446-12516 (undoDispatch + cancelDispatchByTs)

## 2026-05-19 — 2 systèmes d'archivage distincts, ne pas les confondre
- **Type**: finding
- **Trigger**: confusion entre "📦 Archiver maintenant" (système métier : bons/mvts/audit, configurable) et "🔄 Lancer manuellement" (système logs Firebase : audit_log/activity_log/sessions, hardcodé)
- **Règle**: PSM a 2 archivages séparés. Métier = `archiveSweep` lit `APP.*`, configurable via `archiveRetentionMonths`. Logs Firebase = `archiveSweepLogs` lit `audit_log`/`activity_log`/`sessions` côté Firebase, seuil unifié sur le même setting depuis commit 1a802a5. Les 2 écrivent dans `app_data/archives/<sous-type>/<year>` mais ne touchent pas aux mêmes sous-types.
- **Pourquoi**: si on ne le distingue pas, on lance le mauvais bouton et on conclut à tort qu'il y a un bug ("0 archivé" semble être un échec alors que c'est normal pour un système avec peu de données anciennes).
- **Contexte**: app.js:1238 (archiveSweepLogs), app.js:847 (archiveSweep)

## 2026-05-19 — Backups locaux ≠ archives Firebase
- **Type**: finding
- **Trigger**: hypothèse erronée que les backups JSON locaux incluaient les archives Firebase. Vérification : `autoBackup` fait `JSON.stringify(APP)` (hot data seulement), pas de fetch sur `app_data/archives/*`.
- **Règle**: les backups locaux PSM couvrent uniquement le hot data (`APP.*`). Les archives Firebase (`app_data/archives/*`) sont **indépendantes** — si on perd Firebase, on perd les archives. Statu quo accepté côté projet (Google rarement down + Firebase a son propre backup) mais à savoir.
- **Pourquoi**: inclure les archives dans les backups locaux n'est pas viable à long terme — la projection 10 ans monte à ~140 MB, ce qui dépasse localStorage (5 MB) et le snapshot cloud Firebase (100 MB rule). Soit on accepte le risque, soit on fait un export annuel séparé.
- **Contexte**: storage.js:582 (autoBackup), discussion 2026-05-19 sur scalabilité 10 ans
