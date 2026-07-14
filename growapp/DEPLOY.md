# Deployment Notes – GrowManager

- Hosted via surge.sh (static PWA build)
- Live URL: https://growmanager-kilo.surge.sh
- Surge account: growmanager-1783969367@mailinator.com (created for this deploy; password stored in memory/2026-07-13.md, not here)
- To redeploy after changes:
  ```bash
  cd /root/.openclaw/workspace/growapp
  npm run build
  npx surge dist --domain growmanager-kilo.surge.sh
  ```
  (will prompt for surge login on first use in a new shell; credentials in memory)
- Data storage: fully client-side IndexedDB (Dexie) — no backend, no login for end users.
- PWA: installable on mobile home screen ("Add to Home Screen" / "Zum Home-Bildschirm").
