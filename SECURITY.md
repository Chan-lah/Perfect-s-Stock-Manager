# PSM — Notes de sécurité

## Firebase Realtime DB
Les règles sont dans `database.rules.json`. Pour les appliquer :
1. Firebase Console → Realtime Database → Rules
2. Copier/coller le contenu de `database.rules.json`
3. Publier

Schéma appliqué :
- `profiles/{uid}` : lecture pour users auth ; écriture par le propriétaire ou admin ; `role`/`permissions`/`is_active` modifiables par admin uniquement
- `app_data` : lecture pour users actifs ; écriture pour non-viewer
- `activity_log` : lecture admin uniquement ; écriture append-only

## Vercel
`vercel.json` applique : CSP stricte, X-Frame-Options DENY, HSTS, Referrer-Policy, Permissions-Policy.

## Supabase
Supprimé du projet (avril 2026). Backend = Firebase uniquement.

## À faire côté code
- Ajouter `escapeHtml()` systématique sur les champs utilisateur injectés en `innerHTML` (101 occurrences dans app.js).
- Réduire les logs console en production (email/role/id exposés).
