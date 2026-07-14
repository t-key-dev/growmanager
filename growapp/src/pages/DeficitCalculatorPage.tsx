import { useState } from 'react';

export default function DeficitCalculatorPage() {
  const [currentEC, setCurrentEC] = useState(0);
  const [targetEC, setTargetEC] = useState(0);
  const [waterVolume, setWaterVolume] = useState(10);
  const [fertilizerEC, setFertilizerEC] = useState(1.5);

  // Berechne fehlende Menge
  const deficit = Math.max(0, targetEC - currentEC);
  const fertilizerNeeded = deficit > 0 ? (deficit * waterVolume) / fertilizerEC : 0;
  const waterNeeded = deficit < 0 ? Math.abs(deficit) * waterVolume : 0;

  return (
    <div className="page">
      <h1>💧 Defizit-Rechner</h1>
      <p className="subtitle">Berechne fehlenden Dünger oder Wasser</p>

      <div className="card">
        <h3>Aktuelle Werte</h3>
        
        <div className="form-group">
          <label>Aktueller EC-Wert (mS/cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={currentEC}
            onChange={e => setCurrentEC(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Ziel-EC-Wert (mS/cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={targetEC}
            onChange={e => setTargetEC(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Wasservolumen (Liter)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={waterVolume}
            onChange={e => setWaterVolume(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Dünger EC pro ml/L (mS/cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={fertilizerEC}
            onChange={e => setFertilizerEC(parseFloat(e.target.value) || 0)}
          />
          <small className="form-hint">Typisch: 1.0-2.0 mS/cm pro ml/L</small>
        </div>
      </div>

      <div className="card result-card">
        <h3>Ergebnis</h3>
        
        {deficit > 0 ? (
          <div className="result">
            <div className="result-item large">
              <span className="label">Fehlender EC:</span>
              <span className="value highlight">{deficit.toFixed(2)} mS/cm</span>
            </div>
            <div className="result-item">
              <span className="label">Benötigter Dünger:</span>
              <span className="value">{fertilizerNeeded.toFixed(1)} ml</span>
            </div>
            <div className="result-item">
              <span className="label">Dünger pro Liter:</span>
              <span className="value">{(fertilizerNeeded / waterVolume).toFixed(2)} ml/L</span>
            </div>
          </div>
        ) : deficit < 0 ? (
          <div className="result">
            <div className="result-item large">
              <span className="label">EC zu hoch:</span>
              <span className="value highlight">{Math.abs(deficit).toFixed(2)} mS/cm</span>
            </div>
            <div className="result-item">
              <span className="label">Benötigtes Wasser zum Verdünnen:</span>
              <span className="value">{waterNeeded.toFixed(1)} L</span>
            </div>
            <div className="result-item">
              <span className="label">Oder换新水:</span>
              <span className="value">{waterVolume.toFixed(1)} L</span>
            </div>
          </div>
        ) : (
          <div className="result">
            <div className="result-item large">
              <span className="label">✅ Perfekt!</span>
              <span className="value highlight">EC-Wert ist optimal</span>
            </div>
          </div>
        )}

        <div className="info-box">
          <strong>💡 EC-Richtwerte pro Phase:</strong>
          <ul>
            <li>Keimling: 0.2-0.4 mS/cm</li>
            <li>Vegetation: 0.8-1.2 mS/cm</li>
            <li>Frühe Blüte: 1.2-1.6 mS/cm</li>
            <li>Späte Blüte: 1.4-1.8 mS/cm</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
