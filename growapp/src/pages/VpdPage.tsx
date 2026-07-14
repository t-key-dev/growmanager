import { useState } from "react";
import { calculateVPD, classifyVpd, VPD_TARGETS } from "../vpd";
import { STAGE_LABELS, STAGES, type Stage } from "../types";

export default function VpdPage() {
  const [temp, setTemp] = useState(24);
  const [humidity, setHumidity] = useState(55);
  const [leafOffset, setLeafOffset] = useState(-2);
  const [stage, setStage] = useState<Stage>("vegetative");

  const result = calculateVPD(temp, humidity, leafOffset);
  const cls = classifyVpd(result.vpdKpa, stage);
  const target = VPD_TARGETS[stage];

  return (
    <div>
      <div className="app-header">
        <h1>💧 VPD-Rechner</h1>
      </div>
      <div className="app-main">
        <div className="card">
          <div className="vpd-gauge">
            <div className="vpd-value" style={{ color: cls.color }}>
              {result.vpdKpa.toFixed(2)}
              <span className="vpd-unit"> kPa</span>
            </div>
            <div className="muted" style={{ marginTop: 4, textAlign: "center" }}>{cls.label}</div>
          </div>
          <div className="muted" style={{ textAlign: "center" }}>
            Zielbereich ({STAGE_LABELS[stage]}): {target.min}–{target.max} kPa
          </div>
        </div>

        <div className="card">
          <div className="form-group">
            <label>Wachstumsphase</label>
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
              {STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]} ({VPD_TARGETS[s].min}–{VPD_TARGETS[s].max} kPa)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Lufttemperatur: {temp} °C</label>
            <input type="range" min={10} max={40} step={0.5} value={temp} onChange={(e) => setTemp(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Relative Luftfeuchtigkeit: {humidity} %</label>
            <input type="range" min={10} max={100} step={1} value={humidity} onChange={(e) => setHumidity(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Blatttemperatur-Offset: {leafOffset} °C</label>
            <input type="range" min={-5} max={2} step={0.5} value={leafOffset} onChange={(e) => setLeafOffset(Number(e.target.value))} />
            <div className="muted">Blätter sind meist etwas kühler als die Luft (typisch: -2 °C bei aktiver Beleuchtung).</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Details</div>
          <div className="grid-2">
            <div className="stat-box">
              <div className="num">{result.svpAirKpa.toFixed(2)}</div>
              <div className="lbl">SVP Luft (kPa)</div>
            </div>
            <div className="stat-box">
              <div className="num">{result.svpLeafKpa.toFixed(2)}</div>
              <div className="lbl">SVP Blatt (kPa)</div>
            </div>
            <div className="stat-box">
              <div className="num">{result.avpKpa.toFixed(2)}</div>
              <div className="lbl">Tatsächlicher Dampfdruck (kPa)</div>
            </div>
            <div className="stat-box">
              <div className="num">{result.vpdKpa.toFixed(2)}</div>
              <div className="lbl">VPD (kPa)</div>
            </div>
          </div>
        </div>

        <div className="card muted">
          <strong>Richtwerte je Phase:</strong>
          <ul style={{ paddingLeft: 18, marginTop: 8 }}>
            {STAGES.map((s) => (
              <li key={s}>{STAGE_LABELS[s]}: {VPD_TARGETS[s].min}–{VPD_TARGETS[s].max} kPa</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
