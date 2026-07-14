import { useState } from "react";
import { STAGE_LABELS, STAGES, PHASE_DEFAULT_START_WEEK, type Stage } from "../types";

// Conversion factors
// EC (mS/cm) to ppm (NaCl scale): ppm = EC * 500
// EC (mS/cm) to ppm (442 scale): ppm = EC * 700
// EC (mS/cm) to TDS ppm: ppm = EC * 640

export default function EcConverterPage() {
  const [ecValue, setEcValue] = useState("1.2");
  const [ppmValue, setPpmValue] = useState("600");
  const [ppmScale, setPpmScale] = useState<"500" | "640" | "700">("500");
  const [stage, setStage] = useState<Stage>("vegetative");
  const [inputMode, setInputMode] = useState<"ec" | "ppm">("ec");

  const scaleFactors: Record<string, { label: string; factor: number }> = {
    "500": { label: "NaCl (×500)", factor: 500 },
    "640": { label: "TDS (×640)", factor: 640 },
    "700": { label: "442 (×700)", factor: 700 },
  };

  function handleEcChange(val: string) {
    setEcValue(val);
    setInputMode("ec");
  }

  function handlePpmChange(val: string) {
    setPpmValue(val);
    setInputMode("ppm");
  }

  const ec = Number(ecValue) || 0;
  const factor = scaleFactors[ppmScale].factor;
  const computedPpm = ec * factor;
  const computedEc = (Number(ppmValue) || 0) / factor;

  const displayEc = inputMode === "ec" ? ec : computedEc;
  const displayPpm = inputMode === "ppm" ? (Number(ppmValue) || 0) : computedPpm;

  // Stage EC guidelines

  // EC guidelines per stage (general recommendations)
  const ecGuidelines: Record<Stage, { min: number; max: number }> = {
    germination: { min: 0.2, max: 0.4 },
    seedling: { min: 0.4, max: 0.7 },
    vegetative: { min: 0.8, max: 1.4 },
    early_flower: { min: 1.0, max: 1.6 },
    mid_flower: { min: 1.2, max: 1.8 },
    late_flower: { min: 1.4, max: 2.0 },
    flush: { min: 0.0, max: 0.4 },
  };

  const guideline = ecGuidelines[stage];
  const ecInRange = displayEc >= guideline.min && displayEc <= guideline.max;

  return (
    <div>
      <div className="app-header">
        <h1>🔬 EC/ppm-Umrechner</h1>
      </div>
      <div className="app-main">
        {/* EC Input */}
        <div className="card">
          <div className="card-title">Umrechnung</div>

          <div className="form-group">
            <label>EC-Wert (mS/cm)</label>
            <input
              type="number"
              step="0.01"
              value={ecValue}
              onChange={(e) => handleEcChange(e.target.value)}
              placeholder="z.B. 1.2"
              style={{ fontSize: "1.2rem", textAlign: "center" }}
            />
          </div>

          <div className="form-group">
            <label>PPM-Skala</label>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.entries(scaleFactors).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`chip${ppmScale === key ? " stage-vegetative" : ""}`}
                  onClick={() => setPpmScale(key as "500" | "640" | "700")}
                  style={{ flex: 1 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>PPM-Wert</label>
            <input
              type="number"
              step="1"
              value={ppmValue}
              onChange={(e) => handlePpmChange(e.target.value)}
              placeholder="z.B. 600"
              style={{ fontSize: "1.2rem", textAlign: "center" }}
            />
          </div>

          <div className="muted" style={{ textAlign: "center", marginTop: 4 }}>
            {displayEc.toFixed(2)} mS/cm = {Math.round(displayPpm)} ppm ({scaleFactors[ppmScale].label})
          </div>
        </div>

        {/* Stage Guidelines */}
        <div className="card">
          <div className="card-title">📋 EC-Richtwerte nach Phase</div>
          <div className="form-group">
            <label>Aktuelle Phase</label>
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
              {STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="stat-box">
              <div className="num" style={{ color: ecInRange ? "var(--accent-2)" : "var(--warn)" }}>
                {guideline.min.toFixed(1)}–{guideline.max.toFixed(1)}
              </div>
              <div className="lbl">EC-Bereich (mS/cm)</div>
            </div>
            <div className="stat-box">
              <div className="num" style={{ color: ecInRange ? "var(--accent-2)" : "var(--warn)" }}>
                {Math.round(guideline.min * factor)}–{Math.round(guideline.max * factor)}
              </div>
              <div className="lbl">PPM ({scaleFactors[ppmScale].label})</div>
            </div>
          </div>

          {displayEc > 0 && (
            <div style={{
              marginTop: 12,
              padding: "8px 12px",
              borderRadius: 10,
              background: ecInRange ? "rgba(76, 175, 111, 0.15)" : "rgba(217, 154, 61, 0.15)",
              textAlign: "center",
            }}>
              {ecInRange
                ? "✅ EC-Wert ist im empfohlenen Bereich"
                : displayEc < guideline.min
                  ? "⬇️ EC-Wert ist unter dem empfohlenen Bereich"
                  : "⬆️ EC-Wert ist über dem empfohlenen Bereich"
              }
            </div>
          )}
        </div>

        {/* All stages reference */}
        <div className="card">
          <div className="card-title">📊 Alle Phasen im Überblick</div>
          <div className="muted" style={{ marginBottom: 8, fontSize: "0.75rem" }}>
            Wochenangaben sind theoretische Richtwerte seit Keimung
          </div>
          {STAGES.map((s) => {
            const g = ecGuidelines[s];
            const weekStart = PHASE_DEFAULT_START_WEEK[s];
            const weekEnd = s === "flush" ? "18+" : String(PHASE_DEFAULT_START_WEEK[STAGES[STAGES.indexOf(s) + 1]] - 1);
            return (
              <div className="event-row" key={s}>
                <div>
                  <div>{STAGE_LABELS[s]}</div>
                  <div className="muted" style={{ fontSize: "0.7rem" }}>Woche {weekStart}–{weekEnd}</div>
                </div>
                <span className="muted">
                  {g.min.toFixed(1)}–{g.max.toFixed(1)} mS/cm
                  {" · "}
                  {Math.round(g.min * factor)}–{Math.round(g.max * factor)} ppm
                </span>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="card muted">
          <strong>💡 Hinweis zu PPM-Skalen:</strong>
          <ul style={{ paddingLeft: 18, marginTop: 8 }}>
            <li><strong>NaCl (×500):</strong> Wird oft bei günstigen TDS-Metern verwendet</li>
            <li><strong>TDS (×640):</strong> Häufig bei Hanna-Messgeräten</li>
            <li><strong>442 (×700):</strong> Wird bei professionellen EC-Metern verwendet</li>
          </ul>
          <p style={{ marginTop: 8 }}>
            Prüfe welches Skalierung dein Messgerät verwendet – die Werte können je nach Faktor bis zu 40% abweichen!
          </p>
        </div>
      </div>
    </div>
  );
}
