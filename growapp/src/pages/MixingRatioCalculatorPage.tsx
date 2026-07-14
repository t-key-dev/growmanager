import { useState } from 'react';

interface Fertilizer {
  id: number;
  name: string;
  ratio: number; // Anteil in %
}

export default function MixingRatioCalculatorPage() {
  const [totalVolume, setTotalVolume] = useState(10);
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([
    { id: 1, name: 'Dünger A', ratio: 50 },
    { id: 2, name: 'Dünger B', ratio: 30 },
    { id: 3, name: 'Dünger C', ratio: 20 },
  ]);

  const totalRatio = fertilizers.reduce((sum, f) => sum + f.ratio, 0);
  const isValid = Math.abs(totalRatio - 100) < 0.1;

  const addFertilizer = () => {
    const newId = Math.max(...fertilizers.map(f => f.id), 0) + 1;
    setFertilizers([...fertilizers, { id: newId, name: `Dünger ${newId}`, ratio: 0 }]);
  };

  const removeFertilizer = (id: number) => {
    setFertilizers(fertilizers.filter(f => f.id !== id));
  };

  const updateFertilizer = (id: number, field: keyof Fertilizer, value: string | number) => {
    setFertilizers(fertilizers.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  return (
    <div className="page">
      <h1>🧪 Misch-Verhältnis-Rechner</h1>
      <p className="subtitle">Berechne Mischverhältnisse für Dünger-Kombinationen</p>

      <div className="card">
        <div className="form-group">
          <label>Gesamtvolumen (Liter)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={totalVolume}
            onChange={e => setTotalVolume(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="card">
        <h3>Dünger-Mischung</h3>
        
        {fertilizers.map(fert => (
          <div key={fert.id} className="mixing-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={fert.name}
                onChange={e => updateFertilizer(fert.id, 'name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Anteil (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={fert.ratio}
                onChange={e => updateFertilizer(fert.id, 'ratio', parseFloat(e.target.value) || 0)}
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

        <div className="ratio-summary">
          <strong>Gesamt: {totalRatio.toFixed(1)}%</strong>
          {!isValid && <span className="warning"> (Sollte 100% sein)</span>}
        </div>
      </div>

      {isValid && (
        <div className="card result-card">
          <h3>Mischverhältnis für {totalVolume}L</h3>
          <div className="result">
            {fertilizers.map(fert => {
              const volume = (fert.ratio / 100) * totalVolume;
              return (
                <div key={fert.id} className="result-item">
                  <span className="label">{fert.name}:</span>
                  <span className="value">{volume.toFixed(2)} L ({fert.ratio}%)</span>
                </div>
              );
            })}
          </div>

          <div className="info-box">
            <strong>💡 Tipp:</strong>
            <p>Mische zuerst die größeren Mengen, dann die kleineren für genauere Dosierung.</p>
          </div>
        </div>
      )}
    </div>
  );
}
