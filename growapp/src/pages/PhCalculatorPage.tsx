import { useState } from "react";

export default function PhCalculatorPage() {
  const [currentPh, setCurrentPh] = useState(7.0);
  const [targetPh, setTargetPh] = useState(6.2);
  const [waterVolume, setWaterVolume] = useState(10);
  const [productType, setProductType] = useState<"ph-down" | "ph-up">("ph-down");
  
  // Typical product concentrations (ml per liter to change pH by 0.1)
  const phDownFactor = 0.5; // ml/L per 0.1 pH change
  const phUpFactor = 0.6; // ml/L per 0.1 pH change

  const phDifference = Math.abs(currentPh - targetPh);
  const factor = productType === "ph-down" ? phDownFactor : phUpFactor;
  const productNeeded = (phDifference / 0.1) * factor * waterVolume;

  const isOptimal = targetPh >= 5.8 && targetPh <= 6.5;

  return (
    <div className="page">
      <h1>pH-Rechner</h1>
      <p className="subtitle">Berechne die benötigte Menge pH-Down oder pH-Up</p>

      <div className="card">
        <div className="form-group">
          <label>Aktueller pH-Wert</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            value={currentPh}
            onChange={(e) => setCurrentPh(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Ziel-pH-Wert</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            value={targetPh}
            onChange={(e) => setTargetPh(parseFloat(e.target.value) || 0)}
          />
          {!isOptimal && (
            <small className="warning">
              ⚠️ Optimaler Bereich für Cannabis: 5.8 - 6.5
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Wasservolumen (Liter)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={waterVolume}
            onChange={(e) => setWaterVolume(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Produkt</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as "ph-down" | "ph-up")}
          >
            <option value="ph-down">pH-Down (Säure)</option>
            <option value="ph-up">pH-Up (Base)</option>
          </select>
        </div>
      </div>

      <div className="card result-card">
        <h3>Ergebnis</h3>
        <div className="result">
          <div className="result-item">
            <span className="label">pH-Differenz:</span>
            <span className="value">{phDifference.toFixed(1)}</span>
          </div>
          <div className="result-item">
            <span className="label">Benötigte Menge:</span>
            <span className="value highlight">{productNeeded.toFixed(2)} ml</span>
          </div>
          <div className="result-item">
            <span className="label">Pro Liter:</span>
            <span className="value">{(productNeeded / waterVolume).toFixed(3)} ml/L</span>
          </div>
        </div>

        <div className="info-box">
          <strong>💡 Tipp:</strong> Beginne immer mit der Hälfte der berechneten Menge, 
          messe nach und füge den Rest hinzu. Lieber zu wenig als zu viel!
        </div>

        <div className="info-box">
          <strong>📊 Richtwerte:</strong>
          <ul>
            <li>Erde: pH 6.0 - 6.8</li>
            <li>Coco: pH 5.5 - 6.2</li>
            <li>Hydro: pH 5.5 - 6.0</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
