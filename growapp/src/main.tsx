import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { db } from "./db.ts";
import { SEED_STRAINS } from "./strainDatabase.ts";

// GitHub Pages: HashRouter verwenden, da statisches Hosting kein SPA-Routing bietet

// Seed strain database on first launch
async function seedStrains() {
  const count = await db.strains.count();
  if (count < SEED_STRAINS.length) {
    await db.strains.clear();
    await db.strains.bulkAdd(SEED_STRAINS);
    console.log(`✅ ${SEED_STRAINS.length} strains seeded`);
  }
}

seedStrains().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
});
