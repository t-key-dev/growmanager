import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { db } from "./db.ts";
import { SEED_STRAINS } from "./strainDatabase.ts";

// Neue Feature-Imports
import DeficitCalculatorPage from "./pages/DeficitCalculatorPage";
import MixingRatioCalculatorPage from "./pages/MixingRatioCalculatorPage";
import RootSpaceCalculatorPage from "./pages/RootSpaceCalculatorPage";
import LightIntensityCalculatorPage from "./pages/LightIntensityCalculatorPage";
import IrrigationPlannerPage from "./pages/IrrigationPlannerPage";
import SensorIntegrationPage from "./pages/SensorIntegrationPage";
import TimelapsePage from "./pages/TimelapsePage";
import PestDetectionPage from "./pages/PestDetectionPage";
import FertilizerDatabasePage from "./pages/FertilizerDatabasePage";
import GrowChecklistPage from "./pages/GrowChecklistPage";
import GrowthCurvesPage from "./pages/GrowthCurvesPage";
import CostBenefitAnalysisPage from "./pages/CostBenefitAnalysisPage";
import PowerConsumptionTrackerPage from "./pages/PowerConsumptionTrackerPage";
import NutrientConsumptionAnalysisPage from "./pages/NutrientConsumptionAnalysisPage";
import GrowProtocolsPage from "./pages/GrowProtocolsPage";
import GrowRoomsPage from "./pages/GrowRoomsPage";
import SeasonalPlanningPage from "./pages/SeasonalPlanningPage";
import HarvestCountdownPage from "./pages/HarvestCountdownPage";
import DragDropSortPage from "./pages/DragDropSortPage";
import VoiceNotesPage from "./pages/VoiceNotesPage";
import QuickPhotoModePage from "./pages/QuickPhotoModePage";
import GrowDiarySharingPage from "./pages/GrowDiarySharingPage";
import StrainReviewsPage from "./pages/StrainReviewsPage";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tools/deficit-calculator" element={<DeficitCalculatorPage />} />
          <Route path="/tools/mixing-ratio-calculator" element={<MixingRatioCalculatorPage />} />
          <Route path="/tools/root-space-calculator" element={<RootSpaceCalculatorPage />} />
          <Route path="/tools/light-intensity-calculator" element={<LightIntensityCalculatorPage />} />
          <Route path="/tools/irrigation-planner" element={<IrrigationPlannerPage />} />
          <Route path="/tools/sensor-integration" element={<SensorIntegrationPage />} />
          <Route path="/tools/timelapse" element={<TimelapsePage />} />
          <Route path="/tools/pest-detection" element={<PestDetectionPage />} />
          <Route path="/tools/fertilizer-database" element={<FertilizerDatabasePage />} />
          <Route path="/tools/grow-checklist" element={<GrowChecklistPage />} />
          <Route path="/analysis/growth-curves" element={<GrowthCurvesPage />} />
          <Route path="/analysis/cost-benefit" element={<CostBenefitAnalysisPage />} />
          <Route path="/analysis/power-consumption" element={<PowerConsumptionTrackerPage />} />
          <Route path="/analysis/nutrient-consumption" element={<NutrientConsumptionAnalysisPage />} />
          <Route path="/planning/grow-protocols" element={<GrowProtocolsPage />} />
          <Route path="/planning/grow-rooms" element={<GrowRoomsPage />} />
          <Route path="/planning/seasonal-planning" element={<SeasonalPlanningPage />} />
          <Route path="/planning/harvest-countdown" element={<HarvestCountdownPage />} />
          <Route path="/ux/drag-drop-sort" element={<DragDropSortPage />} />
          <Route path="/ux/voice-notes" element={<VoiceNotesPage />} />
          <Route path="/ux/quick-photo-mode" element={<QuickPhotoModePage />} />
          <Route path="/community/grow-diary-sharing" element={<GrowDiarySharingPage />} />
          <Route path="/community/strain-reviews" element={<StrainReviewsPage />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
});
