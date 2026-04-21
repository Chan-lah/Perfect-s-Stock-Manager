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
