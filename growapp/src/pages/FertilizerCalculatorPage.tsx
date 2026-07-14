import { useState } from "react";

interface Fertilizer {
  id: number;
  name: string;
  n: number; // Nitrogen %
  p: number; // Phosphorus %
  k: number; // Potassium %
}

export default function FertilizerCalculatorPage() {
  const [waterVolume, setWaterVolume] = useState(10);
  
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([
    { id: 1, name: "Grow A", n: 7, p: 1, k: 4 },
    { id: 2, name: "Grow B", n: 0, p: 5, k: 6 },
    { id: 3, name: "Bloom", n: 1, p: 4, k: 7 },
  ]);

  const [doses, setDoses] = useState<Record<number, number>>({
    1: 3, // ml/L
    2: 2,
    3: 2.5,
  });

  // Calculate actual NPK based on doses
  // Formula: (percentage * dose_ml_per_liter * 10) = ppm
  const calculatePpm = (percentage: number, doseMlPerL: number) => {
    return percentage * doseMlPerL * 10;
  };

  const totalN = fertilizers.reduce((sum, f) => sum + calculatePpm(f.n, doses[f.id] || 0), 0);
  const totalP = fertilizers.reduce((sum, f) => sum + calculatePpm(f.p, doses[f.id] || 0), 0);
  const totalK = fertilizers.reduce((sum, f) => sum + calculatePpm(f.k, doses[f.id] || 0), 0);

  const totalMlPerL = Object.values(doses).reduce((sum, d) => sum + d, 0);
  const totalMl = totalMlPerL * waterVolume;

  const addFertilizer = () => {
    const newId = Math.max(...fertilizers.map(f => f.id), 0) + 1;
    setFertilizers([...fertilizers, { id: newId, name: `Produkt ${newId}`, n: 0, p: 0, k: 0 }]);
    setDoses({ ...doses, [newId]: 0 });
  };

  const removeFertilizer = (id: number) => {
    setFertilizers(fertilizers.filter(f => f.id !== id));
    const newDoses = { ...doses };
    delete newDoses[id];
    setDoses(newDoses);
  };

  const updateFertilizer = (id: number, field: keyof Fertilizer, value: string | number) => {
    setFertilizers(fertilizers.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const updateDose = (id: number, dose: number) => {
    setDoses({ ...doses, [id]: dose });
  };

  return (
    <div className="page">
      <h1>Dünger-Mischrechner</h1>
      <p className="subtitle">Berechne NPK-Werte und benötigte Mengen</p>

      <div className="card">
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
      </div>

      <div className="card">
        <h3>Deine Dünger</h3>
        
        {fertilizers.map((fert) => (
          <div key={fert.id} className="fertilizer-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={fert.name}
                onChange={(e) => updateFertilizer(fert.id, "name", e.target.value)}
              />
            </div>

            <div className="npk-inputs">
              <div className="form-group">
                <label>N (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={fert.n}
                  onChange={(e) => updateFertilizer(fert.id, "n", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="form-group">
                <label>P (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={fert.p}
                  onChange={(e) => updateFertilizer(fert.id, "p", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="form-group">
                <label>K (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={fert.k}
                  onChange={(e) => updateFertilizer(fert.id, "k", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dosis (ml/L)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={doses[fert.id] || 0}
                onChange={(e) => updateDose(fert.id, parseFloat(e.target.value) || 0)}
              />
            </div>

            <button 
              className="btn-icon danger" 
              onClick={() => removeFertilizer(fert.id)}
              title="Entfernen"
            >
              ✕
            </button>
          </div>
        ))}

        <button className="btn btn-secondary" onClick={addFertilizer}>
          + Dünger hinzufügen
        </button>
      </div>

      <div className="card result-card">
        <h3>Gesamt-NPK</h3>
        <div className="result">
          <div className="result-item">
            <span className="label">Stickstoff (N):</span>
            <span className="value">{totalN.toFixed(0)} ppm</span>
          </div>
          <div className="result-item">
            <span className="label">Phosphor (P):</span>
            <span className="value">{totalP.toFixed(0)} ppm</span>
          </div>
          <div className="result-item">
            <span className="label">Kalium (K):</span>
            <span className="value">{totalK.toFixed(0)} ppm</span>
          </div>
        </div>

        <div className="result-divider"></div>

        <div className="result">
          <div className="result-item">
            <span className="label">Gesamt pro Liter:</span>
            <span className="value">{totalMlPerL.toFixed(2)} ml/L</span>
          </div>
          <div className="result-item">
            <span className="label">Gesamt für {waterVolume}L:</span>
            <span className="value highlight">{totalMl.toFixed(2)} ml</span>
          </div>
        </div>

        <div className="info-box">
          <strong>📊 NPK-Richtwerte pro Phase:</strong>
          <ul>
            <li>Keimling: N 50-100, P 50-75, K 50-75 ppm</li>
            <li>Vegetation: N 150-250, P 100-150, K 150-200 ppm</li>
            <li>Blüte: N 100-150, P 150-200, K 200-300 ppm</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
