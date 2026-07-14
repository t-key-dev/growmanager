import { useState } from "react";

export default function VolumeCalculatorPage() {
  const [potDiameter, setPotDiameter] = useState(25); // cm
  const [potHeight, setPotHeight] = useState(25); // cm
  const [potShape, setPotShape] = useState<"round" | "square">("round");
  const [soilMoisture, setSoilMoisture] = useState(30); // % (field capacity)

  // Calculate pot volume in liters
  const calculatePotVolume = () => {
    if (potShape === "round") {
      const radius = potDiameter / 2;
      return (Math.PI * radius * radius * potHeight) / 1000; // cm³ to liters
    } else {
      return (potDiameter * potDiameter * potHeight) / 1000;
    }
  };

  const potVolume = calculatePotVolume();
  
  // Water needed to saturate soil (assuming 30% air space in soil)
  const airSpace = 0.3;
  const waterToSaturate = potVolume * (1 - airSpace) * (soilMoisture / 100);
  
  // Typical watering is 10-20% of pot volume
  const water10Percent = potVolume * 0.1;
  const water20Percent = potVolume * 0.2;

  // Fertilizer calculations (typical doses)
  const growDose = 3; // ml/L
  const bloomDose = 2.5; // ml/L
  
  const growFertilizer = water20Percent * growDose;
  const bloomFertilizer = water20Percent * bloomDose;

  return (
    <div className="page">
      <h1>Volumenrechner</h1>
      <p className="subtitle">Berechne Topfvolumen, Wassermenge und Düngerdosis</p>

      <div className="card">
        <div className="form-group">
          <label>Topfform</label>
          <select
            value={potShape}
            onChange={(e) => setPotShape(e.target.value as "round" | "square")}
          >
            <option value="round">Rund</option>
            <option value="square">Eckig</option>
          </select>
        </div>

        <div className="form-group">
          <label>{potShape === "round" ? "Durchmesser" : "Breite"} (cm)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={potDiameter}
            onChange={(e) => setPotDiameter(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Höhe (cm)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={potHeight}
            onChange={(e) => setPotHeight(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Bodenfeuchte (% Feldkapazität)</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
          />
          <span className="range-value">{soilMoisture}%</span>
        </div>
      </div>

      <div className="card result-card">
        <h3>Topfvolumen</h3>
        <div className="result">
          <div className="result-item large">
            <span className="value highlight">{potVolume.toFixed(1)} Liter</span>
          </div>
        </div>
      </div>

      <div className="card result-card">
        <h3>Wassermenge</h3>
        <div className="result">
          <div className="result-item">
            <span className="label">Zum Sättigen:</span>
            <span className="value">{waterToSaturate.toFixed(2)} L</span>
          </div>
          <div className="result-item">
            <span className="label">10% Gießmenge:</span>
            <span className="value">{water10Percent.toFixed(2)} L</span>
          </div>
          <div className="result-item">
            <span className="label">20% Gießmenge:</span>
            <span className="value highlight">{water20Percent.toFixed(2)} L</span>
          </div>
        </div>

        <div className="info-box">
          <strong>💡 Tipp:</strong> Gieße immer so viel, dass 10-20% Drainage entstehen. 
          Das verhindert Salzablagerungen und sorgt für gesunde Wurzeln.
        </div>
      </div>

      <div className="card result-card">
        <h3>Dünger-Dosis (bei 20% Gießmenge)</h3>
        <div className="result">
          <div className="result-item">
            <span className="label">Grow-Dünger (3 ml/L):</span>
            <span className="value">{growFertilizer.toFixed(2)} ml</span>
          </div>
          <div className="result-item">
            <span className="label">Bloom-Dünger (2.5 ml/L):</span>
            <span className="value">{bloomFertilizer.toFixed(2)} ml</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📊 Typische Topfgrößen</h3>
        <table className="info-table">
          <thead>
            <tr>
              <th>Topf</th>
              <th>Volumen</th>
              <th>Pflanzengröße</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>7L</td>
              <td>Autoflower klein</td>
              <td>40-60cm</td>
            </tr>
            <tr>
              <td>11L</td>
              <td>Autoflower / Photo klein</td>
              <td>60-80cm</td>
            </tr>
            <tr>
              <td>15L</td>
              <td>Photo mittel</td>
              <td>80-120cm</td>
            </tr>
            <tr>
              <td>20L</td>
              <td>Photo groß</td>
              <td>120-150cm</td>
            </tr>
            <tr>
              <td>25L+</td>
              <td>Photo sehr groß</td>
              <td>150cm+</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
