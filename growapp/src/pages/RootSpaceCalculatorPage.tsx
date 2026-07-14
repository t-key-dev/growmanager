import { useState } from 'react';

export default function RootSpaceCalculatorPage() {
  const [plantHeight, setPlantHeight] = useState(50);
  const [strainType, setStrainType] = useState<'indica' | 'sativa' | 'hybrid'>('hybrid');
  const [growthPhase, setGrowthPhase] = useState<'vegetative' | 'flowering'>('vegetative');

  // Berechne optimale Topfgröße
  const getRecommendedPotSize = () => {
    let baseSize = plantHeight * 0.4; // 40% der Pflanzenhöhe
    
    // Strain-Anpassung
    if (strainType === 'sativa') baseSize *= 1.2;
    else if (strainType === 'indica') baseSize *= 0.9;
    
    // Phase-Anpassung
    if (growthPhase === 'flowering') baseSize *= 1.3;
    
    return Math.round(baseSize);
  };

  const potSize = getRecommendedPotSize();
  const potVolume = Math.round((potSize * potSize * potSize) / 1000 * 0.5); // Approximation in Liter

  return (
    <div className="page">
      <h1>🌱 Wurzelraum-Rechner</h1>
      <p className="subtitle">Optimale Topfgröße basierend auf Pflanzenhöhe und Strain</p>

      <div className="card">
        <h3>Pflanzendaten</h3>
        
        <div className="form-group">
          <label>Pflanzenhöhe (cm)</label>
          <input
            type="number"
            step="1"
            min="0"
            value={plantHeight}
            onChange={e => setPlantHeight(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Strain-Typ</label>
          <select
            value={strainType}
            onChange={e => setStrainType(e.target.value as any)}
          >
            <option value="indica">Indica (kompakt)</option>
            <option value="hybrid">Hybrid (ausgewogen)</option>
            <option value="sativa">Sativa (ausladend)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Wachstumsphase</label>
          <select
            value={growthPhase}
            onChange={e => setGrowthPhase(e.target.value as any)}
          >
            <option value="vegetative">Vegetation</option>
            <option value="flowering">Blüte</option>
          </select>
        </div>
      </div>

      <div className="card result-card">
        <h3>Empfohlene Topfgröße</h3>
        <div className="result">
          <div className="result-item large">
            <span className="label">Topf-Durchmesser:</span>
            <span className="value highlight">{potSize} cm</span>
          </div>
          <div className="result-item">
            <span className="label">Topf-Volumen:</span>
            <span className="value">~{potVolume} Liter</span>
          </div>
          <div className="result-item">
            <span className="label">Topf-Tiefe:</span>
            <span className="value">~{Math.round(potSize * 0.8)} cm</span>
          </div>
        </div>

        <div className="info-box">
          <strong>💡 Richtwerte:</strong>
          <ul>
            <li>Indica: Kompaktes Wurzelwerk, kleinere Töpfe</li>
            <li>Sativa: Ausgedehntes Wurzelwerk, größere Töpfe</li>
            <li>Faustregel: Topf-Durchmesser = 40% der Pflanzenhöhe</li>
            <li>In der Blüte 30% mehr Wurzelraum einplanen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
