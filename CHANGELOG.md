# Changelog

Format [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

## [1.0.0] — 2026-04-15

### Added
- Versionnage SemVer (`APP_VERSION`, `APP_BUILD_DATE`) affiché dans les paramètres
- Gestionnaires d'erreurs globaux (`window.error` + `unhandledrejection`)
- Fonction `logError()` avec push vers Firebase `error_log` + hook Sentry prêt à activer
- Résumé audit dans Mouvements (totaux par article)
- Synchronisation automatique Administration → Annuaire (avec badge "Auto")
- Règles Firebase durcies (`database.rules.json`)
- Headers de sécurité Vercel (`vercel.json` : CSP, HSTS, X-Frame-Options)

### Changed
- Split `Nom` → `Prénom` + `Nom` dans Administration (rétro-compatible)
- Thème : fallback automatique vers `light` si thème supprimé/inconnu
- Tag Annuaire forcé à `Mixte` par défaut
- `_isMatriculeUnique` : support email + `_fromUserId` comme critère d'ignore

### Removed
- Thèmes : Guardian, Heritage (christian), Emerald (muslim), Rosé, Sunset
- CSS dupliqué pour rose/sunset/midnight/ocean
- Badge "Version Démo"
- Backend Supabase (`supabase-config.js`)

### Fixed
- `stockBefore`/`stockAfter` capturés AVANT mutation dans `openNewMvtModal`
- Faux positif "Matricule déjà utilisé" lors de la modification d'un user existant

### Security
- Supabase retiré du projet
- `.gitignore` étendu (`.env*`, `*.key`, `serviceAccount*.json`, `.vercel/`)
- Clé API Google Cloud restreinte par domaine + APIs
