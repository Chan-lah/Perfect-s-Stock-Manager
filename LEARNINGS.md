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
