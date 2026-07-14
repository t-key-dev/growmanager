import { useState } from 'react';

export default function LightIntensityCalculatorPage() {
  const [lightWattage, setLightWattage] = useState(400);
  const [lightType, setLightType] = useState<'led' | 'hps' | 'cmh'>('led');
  const [distance, setDistance] = useState(45);
  const [coverageArea, setCoverageArea] = useState(1.2);

  // Berechne PPFD (Photosynthetic Photon Flux Density)
  const getPPFD = () => {
    let efficiency = 0;
    switch (lightType) {
      case 'led': efficiency = 2.5; break; // µmol/J
      case 'hps': efficiency = 1.7; break;
      case 'cmh': efficiency = 2.2; break;
    }

    const totalPPF = lightWattage * efficiency; // µmol/s
    const areaM2 = coverageArea * coverageArea;
    const ppfd = totalPPF / areaM2; // µmol/m²/s
    
    // Abstandsanpassung (inverse square law approximation)
    const distanceFactor = Math.pow(30 / distance, 2);
    return ppfd * distanceFactor;
  };

  const ppfd = getPPFD();
  const dli = ppfd * 0.0864; // Daily Light Integral (mol/m²/d)

  // Empfehlungen basierend auf Phase
  const getRecommendation = () => {
    if (ppfd < 200) return { level: 'low', text: 'Zu niedrig für die meisten Phasen' };
    if (ppfd < 400) return { level: 'medium', text: 'Gut für Vegetation' };
    if (ppfd < 800) return { level: 'high', text: 'Ideal für Blüte' };
    return { level: 'very_high', text: 'Sehr hoch - Risiko von Light Burn' };
  };

  const recommendation = getRecommendation();

  return (
    <div className="page">
      <h1>💡 Lichtintensitäts-Rechner</h1>
      <p className="subtitle">PPFD/PAR-Werte berechnen für verschiedene Lampen</p>

      <div className="card">
        <h3>Lampen-Daten</h3>
        
        <div className="form-group">
          <label>Leistung (Watt)</label>
          <input
            type="number"
            step="10"
            min="0"
            value={lightWattage}
            onChange={e => setLightWattage(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Lampen-Typ</label>
          <select
            value={lightType}
            onChange={e => setLightType(e.target.value as any)}
          >
            <option value="led">LED (2.5 µmol/J)</option>
            <option value="hps">Natriumdampf/HPS (1.7 µmol/J)</option>
            <option value="cmh">CMH/LEC (2.2 µmol/J)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Abstand zur Pflanze (cm)</label>
          <input
            type="number"
            step="5"
            min="10"
            value={distance}
            onChange={e => setDistance(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Abdeckungsfläche (m × m)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={coverageArea}
            onChange={e => setCoverageArea(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="card result-card">
        <h3>Berechnete Werte</h3>
        <div className="result">
          <div className="result-item large">
            <span className="label">PPFD:</span>
            <span className="value highlight">{Math.round(ppfd)} µmol/m²/s</span>
          </div>
          <div className="result-item">
            <span className="label">DLI (Tageslicht-Integral):</span>
            <span className="value">{dli.toFixed(1)} mol/m²/d</span>
          </div>
          <div className="result-item">
            <span className="label">Empfehlung:</span>
            <span className="value">{recommendation.text}</span>
          </div>
        </div>

        <div className="info-box">
          <strong>💡 PPFD-Richtwerte pro Phase:</strong>
          <ul>
            <li>Keimling: 100-300 µmol/m²/s</li>
            <li>Vegetation: 300-600 µmol/m²/s</li>
            <li>Frühe Blüte: 600-900 µmol/m²/s</li>
            <li>Späte Blüte: 800-1200 µmol/m²/s</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
