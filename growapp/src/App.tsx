import { NavLink, Route, Routes } from "react-router-dom";
import TentsPage from "./pages/TentsPage";
import TentDetailPage from "./pages/TentDetailPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import CalendarPage from "./pages/CalendarPage";
import VpdPage from "./pages/VpdPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import DashboardPage from "./pages/DashboardPage";
import StrainsPage from "./pages/StrainsPage";
import CostsPage from "./pages/CostsPage";
import TimelinePage from "./pages/TimelinePage";
import EcConverterPage from "./pages/EcConverterPage";
import PhCalculatorPage from "./pages/PhCalculatorPage";
import FertilizerCalculatorPage from "./pages/FertilizerCalculatorPage";
import VolumeCalculatorPage from "./pages/VolumeCalculatorPage";
import AirExchangeCalculatorPage from "./pages/AirExchangeCalculatorPage";
import SettingsPage from "./pages/SettingsPage";
import StatisticsPage from "./pages/StatisticsPage";
import StrainComparisonPage from "./pages/StrainComparisonPage";
import ClonesPage from "./pages/ClonesPage";
import GrowthComparisonPage from "./pages/GrowthComparisonPage";
import YieldEstimationPage from "./pages/YieldEstimationPage";
import NoteTemplatesPage from "./pages/NoteTemplatesPage";
import LightCyclePlannerPage from "./pages/LightCyclePlannerPage";
import ProblemReporterPage from "./pages/ProblemReporterPage";
import WeatherPage from "./pages/WeatherPage";
import StrainGenealogyPage from "./pages/StrainGenealogyPage";
import NotificationsPage from "./pages/NotificationsPage";
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
import { useEffect, useState } from "react";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} end>
        <span className="icon">📊</span>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/tents" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <span className="icon">🏕️</span>
        <span>Zelte</span>
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <span className="icon">📅</span>
        <span>Kalender</span>
      </NavLink>
      <NavLink to="/tools" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <span className="icon">🔧</span>
        <span>Tools</span>
      </NavLink>
      <NavLink to="/more" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <span className="icon">⋯</span>
        <span>Mehr</span>
      </NavLink>
    </nav>
  );
}

function TopBar() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("growmanager-dark");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", !dark);
    localStorage.setItem("growmanager-dark", String(dark));
  }, [dark]);

  return (
    <div className="top-bar">
      <span className="top-bar-title">🌿 GrowManager</span>
      <div style={{ display: "flex", gap: "8px" }}>
        <NavLink to="/notifications" className="icon-btn" title="Benachrichtigungen">
          🔔
        </NavLink>
        <button
          className="icon-btn"
          onClick={() => setDark(!dark)}
          title={dark ? "Light Mode" : "Dark Mode"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}

function ToolsPage() {
  return (
    <div>
      <div className="app-header">
        <h1>🔧 Tools & Rechner</h1>
      </div>
      <div className="app-main">
        <h3>💧 Bewässerung & Nährstoffe</h3>
        <div className="tools-grid">
          <NavLink to="/vpd" className="tool-card">
            <span className="tool-icon">💧</span>
            <span className="tool-name">VPD-Rechner</span>
            <span className="tool-desc">Dampfdruck-Defizit</span>
          </NavLink>
          <NavLink to="/ph-calculator" className="tool-card">
            <span className="tool-icon">⚗️</span>
            <span className="tool-name">pH-Rechner</span>
            <span className="tool-desc">Säure/Base</span>
          </NavLink>
          <NavLink to="/fertilizer-calculator" className="tool-card">
            <span className="tool-icon">🧪</span>
            <span className="tool-name">Dünger-Mischer</span>
            <span className="tool-desc">NPK-Mischung</span>
          </NavLink>
          <NavLink to="/deficit-calculator" className="tool-card">
            <span className="tool-icon">💧</span>
            <span className="tool-name">Defizit-Rechner</span>
            <span className="tool-desc">Fehlender Dünger</span>
          </NavLink>
          <NavLink to="/mixing-ratio-calculator" className="tool-card">
            <span className="tool-icon">🧪</span>
            <span className="tool-name">Misch-Verhältnis</span>
            <span className="tool-desc">Dünger-Ratios</span>
          </NavLink>
          <NavLink to="/irrigation-planner" className="tool-card">
            <span className="tool-icon">💧</span>
            <span className="tool-name">Bewässerung</span>
            <span className="tool-desc">Automatische Pläne</span>
          </NavLink>
        </div>

        <h3>📐 Berechnungen</h3>
        <div className="tools-grid">
          <NavLink to="/ec-converter" className="tool-card">
            <span className="tool-icon">🔬</span>
            <span className="tool-name">EC/ppm</span>
            <span className="tool-desc">EC-Werte umrechnen</span>
          </NavLink>
          <NavLink to="/volume-calculator" className="tool-card">
            <span className="tool-icon">📐</span>
            <span className="tool-name">Volumenrechner</span>
            <span className="tool-desc">Topf, Wasser</span>
          </NavLink>
          <NavLink to="/root-space-calculator" className="tool-card">
            <span className="tool-icon">🌱</span>
            <span className="tool-name">Wurzelraum</span>
            <span className="tool-desc">Optimale Topfgröße</span>
          </NavLink>
          <NavLink to="/light-intensity-calculator" className="tool-card">
            <span className="tool-icon">💡</span>
            <span className="tool-name">Lichtintensität</span>
            <span className="tool-desc">PPFD/PAR-Werte</span>
          </NavLink>
          <NavLink to="/air-exchange" className="tool-card">
            <span className="tool-icon">💨</span>
            <span className="tool-name">Luftaustausch</span>
            <span className="tool-desc">Lüfterleistung</span>
          </NavLink>
        </div>

        <h3>🔍 Überwachung & Erkennung</h3>
        <div className="tools-grid">
          <NavLink to="/sensor-integration" className="tool-card">
            <span className="tool-icon">📡</span>
            <span className="tool-name">Sensoren</span>
            <span className="tool-desc">Umgebungsüberwachung</span>
          </NavLink>
          <NavLink to="/pest-detection" className="tool-card">
            <span className="tool-icon">🔍</span>
            <span className="tool-name">Schädlinge</span>
            <span className="tool-desc">Erkennung & Hilfe</span>
          </NavLink>
          <NavLink to="/fertilizer-database" className="tool-card">
            <span className="tool-icon">🧪</span>
            <span className="tool-name">Dünger-DB</span>
            <span className="tool-desc">Produkte vergleichen</span>
          </NavLink>
          <NavLink to="/grow-checklist" className="tool-card">
            <span className="tool-icon">✅</span>
            <span className="tool-name">Checkliste</span>
            <span className="tool-desc">Tägliche Aufgaben</span>
          </NavLink>
          <NavLink to="/timelapse" className="tool-card">
            <span className="tool-icon">🎬</span>
            <span className="tool-name">Zeitraffer</span>
            <span className="tool-desc">Wachstumsvideos</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

function MorePage() {
  return (
    <div>
      <div className="app-header">
        <h1>⋯ Mehr</h1>
      </div>
      <div className="app-main">
        <h3>📊 Analyse & Insights</h3>
        <div className="menu-list">
          <NavLink to="/statistics" className="menu-item">
            <span className="menu-icon">📊</span>
            <span>Statistiken</span>
          </NavLink>
          <NavLink to="/growth-curves" className="menu-item">
            <span className="menu-icon">📈</span>
            <span>Wachstumskurven</span>
          </NavLink>
          <NavLink to="/cost-benefit-analysis" className="menu-item">
            <span className="menu-icon">💰</span>
            <span>Kosten-Nutzen-Analyse</span>
          </NavLink>
          <NavLink to="/power-consumption-tracker" className="menu-item">
            <span className="menu-icon">⚡</span>
            <span>Stromverbrauchs-Tracker</span>
          </NavLink>
          <NavLink to="/nutrient-consumption-analysis" className="menu-item">
            <span className="menu-icon">🧪</span>
            <span>Nährstoffverbrauch</span>
          </NavLink>
          <NavLink to="/yield-estimation" className="menu-item">
            <span className="menu-icon">📈</span>
            <span>Ertragsprognose</span>
          </NavLink>
          <NavLink to="/strain-comparison" className="menu-item">
            <span className="menu-icon">🔬</span>
            <span>Strain-Vergleich</span>
          </NavLink>
          <NavLink to="/strain-genealogy" className="menu-item">
            <span className="menu-icon">🧬</span>
            <span>Strain-Genealogie</span>
          </NavLink>
        </div>

        <h3>📅 Planung & Automatisierung</h3>
        <div className="menu-list">
          <NavLink to="/grow-protocols" className="menu-item">
            <span className="menu-icon">📋</span>
            <span>Grow-Protokolle</span>
          </NavLink>
          <NavLink to="/grow-rooms" className="menu-item">
            <span className="menu-icon">🏠</span>
            <span>Mehrere Grow-Räume</span>
          </NavLink>
          <NavLink to="/seasonal-planning" className="menu-item">
            <span className="menu-icon">📆</span>
            <span>Saisonale Planung</span>
          </NavLink>
          <NavLink to="/harvest-countdown" className="menu-item">
            <span className="menu-icon">⏰</span>
            <span>Ernte-Countdown</span>
          </NavLink>
          <NavLink to="/light-cycle" className="menu-item">
            <span className="menu-icon">☀️</span>
            <span>Lichtzyklus-Planer</span>
          </NavLink>
          <NavLink to="/note-templates" className="menu-item">
            <span className="menu-icon">📝</span>
            <span>Notiz-Templates</span>
          </NavLink>
        </div>

        <h3>🎨 UX & Bedienung</h3>
        <div className="menu-list">
          <NavLink to="/drag-drop-sort" className="menu-item">
            <span className="menu-icon">🔀</span>
            <span>Drag & Drop Sortierung</span>
          </NavLink>
          <NavLink to="/voice-notes" className="menu-item">
            <span className="menu-icon">🎤</span>
            <span>Voice Notes</span>
          </NavLink>
          <NavLink to="/quick-photo-mode" className="menu-item">
            <span className="menu-icon">📸</span>
            <span>Schnellfoto-Modus</span>
          </NavLink>
        </div>

        <h3>🌐 Community & Teilen</h3>
        <div className="menu-list">
          <NavLink to="/grow-diary-sharing" className="menu-item">
            <span className="menu-icon">🌐</span>
            <span>Grow-Tagebuch teilen</span>
          </NavLink>
          <NavLink to="/strain-reviews" className="menu-item">
            <span className="menu-icon">⭐</span>
            <span>Strain-Bewertungen</span>
          </NavLink>
        </div>

        <h3>🌱 Pflanzen</h3>
        <div className="menu-list">
          <NavLink to="/clones" className="menu-item">
            <span className="menu-icon">🌱</span>
            <span>Stecklinge</span>
          </NavLink>
          <NavLink to="/growth-comparison" className="menu-item">
            <span className="menu-icon">📸</span>
            <span>Wachstumsvergleich</span>
          </NavLink>
          <NavLink to="/problem-reporter" className="menu-item">
            <span className="menu-icon">⚠️</span>
            <span>Problemmelder</span>
          </NavLink>
        </div>

        <h3>🌍 Sonstiges</h3>
        <div className="menu-list">
          <NavLink to="/weather" className="menu-item">
            <span className="menu-icon">🌤️</span>
            <span>Wetter</span>
          </NavLink>
          <NavLink to="/strains" className="menu-item">
            <span className="menu-icon">🌱</span>
            <span>Strain-Datenbank</span>
          </NavLink>
          <NavLink to="/costs" className="menu-item">
            <span className="menu-icon">💰</span>
            <span>Kosten-Tracker</span>
          </NavLink>
          <NavLink to="/diagnosis" className="menu-item">
            <span className="menu-icon">🩺</span>
            <span>Diagnose</span>
          </NavLink>
          <NavLink to="/settings" className="menu-item">
            <span className="menu-icon">⚙️</span>
            <span>Einstellungen</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tents" element={<TentsPage />} />
        <Route path="/tents/:tentId" element={<TentDetailPage />} />
        <Route path="/plants/:plantId" element={<PlantDetailPage />} />
        <Route path="/plants/:plantId/timeline" element={<TimelinePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/vpd" element={<VpdPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/strains" element={<StrainsPage />} />
        <Route path="/costs" element={<CostsPage />} />
        <Route path="/ec-converter" element={<EcConverterPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/ph-calculator" element={<PhCalculatorPage />} />
        <Route path="/fertilizer-calculator" element={<FertilizerCalculatorPage />} />
        <Route path="/volume-calculator" element={<VolumeCalculatorPage />} />
        <Route path="/air-exchange" element={<AirExchangeCalculatorPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/strain-comparison" element={<StrainComparisonPage />} />
        <Route path="/clones" element={<ClonesPage />} />
        <Route path="/growth-comparison" element={<GrowthComparisonPage />} />
        <Route path="/yield-estimation" element={<YieldEstimationPage />} />
        <Route path="/note-templates" element={<NoteTemplatesPage />} />
        <Route path="/light-cycle" element={<LightCyclePlannerPage />} />
        <Route path="/problem-reporter" element={<ProblemReporterPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/strain-genealogy" element={<StrainGenealogyPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/deficit-calculator" element={<DeficitCalculatorPage />} />
        <Route path="/mixing-ratio-calculator" element={<MixingRatioCalculatorPage />} />
        <Route path="/root-space-calculator" element={<RootSpaceCalculatorPage />} />
        <Route path="/light-intensity-calculator" element={<LightIntensityCalculatorPage />} />
        <Route path="/irrigation-planner" element={<IrrigationPlannerPage />} />
        <Route path="/sensor-integration" element={<SensorIntegrationPage />} />
        <Route path="/timelapse" element={<TimelapsePage />} />
        <Route path="/pest-detection" element={<PestDetectionPage />} />
        <Route path="/fertilizer-database" element={<FertilizerDatabasePage />} />
        <Route path="/grow-checklist" element={<GrowChecklistPage />} />
        <Route path="/growth-curves" element={<GrowthCurvesPage />} />
        <Route path="/cost-benefit-analysis" element={<CostBenefitAnalysisPage />} />
        <Route path="/power-consumption-tracker" element={<PowerConsumptionTrackerPage />} />
        <Route path="/nutrient-consumption-analysis" element={<NutrientConsumptionAnalysisPage />} />
        <Route path="/grow-protocols" element={<GrowProtocolsPage />} />
        <Route path="/grow-rooms" element={<GrowRoomsPage />} />
        <Route path="/seasonal-planning" element={<SeasonalPlanningPage />} />
        <Route path="/harvest-countdown" element={<HarvestCountdownPage />} />
        <Route path="/drag-drop-sort" element={<DragDropSortPage />} />
        <Route path="/voice-notes" element={<VoiceNotesPage />} />
        <Route path="/quick-photo-mode" element={<QuickPhotoModePage />} />
        <Route path="/grow-diary-sharing" element={<GrowDiarySharingPage />} />
        <Route path="/strain-reviews" element={<StrainReviewsPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
