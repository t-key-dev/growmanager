import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function GrowProtocolsPage() {
  const strains = useLiveQuery(() => db.strains.toArray(), []);
  const [selectedStrainId, setSelectedStrainId] = useState<number | null>(null);
  
  // Beispiel-Protokolle für verschiedene Strain-Typen
  const protocols = [
    {
      id: 1,
      name: 'Indica Standard',
      strainType: 'indica',
      description: 'Bewährtes Protokoll für Indica-dominante Strains',
      phases: [
        { name: 'Keimung', duration: '3-5 Tage', temp: '22-25°C', humidity: '70-80%', light: '18/6', ec: '0.2-0.4' },
        { name: 'Sämling', duration: '7-10 Tage', temp: '22-25°C', humidity: '65-70%', light: '18/6', ec: '0.4-0.8' },
        { name: 'Vegetation', duration: '3-4 Wochen', temp: '20-26°C', humidity: '50-70%', light: '18/6', ec: '0.8-1.2' },
        { name: 'Blüte', duration: '8-10 Wochen', temp: '18-24°C', humidity: '40-60%', light: '12/12', ec: '1.2-1.6' },
        { name: 'Spülung', duration: '7-14 Tage', temp: '18-22°C', humidity: '40-50%', light: '12/12', ec: '0.0' },
      ],
    },
    {
      id: 2,
      name: 'Sativa Standard',
      strainType: 'sativa',
      description: 'Optimiert für Sativa-dominante Strains',
      phases: [
        { name: 'Keimung', duration: '3-5 Tage', temp: '22-25°C', humidity: '70-80%', light: '18/6', ec: '0.2-0.4' },
        { name: 'Sämling', duration: '10-14 Tage', temp: '22-26°C', humidity: '65-70%', light: '18/6', ec: '0.4-0.8' },
        { name: 'Vegetation', duration: '4-6 Wochen', temp: '22-28°C', humidity: '50-70%', light: '18/6', ec: '0.8-1.4' },
        { name: 'Blüte', duration: '10-14 Wochen', temp: '20-26°C', humidity: '40-60%', light: '12/12', ec: '1.4-1.8' },
        { name: 'Spülung', duration: '7-14 Tage', temp: '18-24°C', humidity: '40-50%', light: '12/12', ec: '0.0' },
      ],
    },
    {
      id: 3,
      name: 'Autoflower Schnell',
      strainType: 'autoflower',
      description: 'Schnelles Protokoll für Autoflowers',
      phases: [
        { name: 'Keimung', duration: '2-3 Tage', temp: '22-25°C', humidity: '70-80%', light: '18/6', ec: '0.2-0.4' },
        { name: 'Sämling', duration: '7-10 Tage', temp: '22-25°C', humidity: '65-70%', light: '18/6', ec: '0.4-0.8' },
        { name: 'Vegetation', duration: '2-3 Wochen', temp: '20-26°C', humidity: '50-70%', light: '18/6', ec: '0.8-1.2' },
        { name: 'Blüte', duration: '7-9 Wochen', temp: '18-24°C', humidity: '40-60%', light: '18/6', ec: '1.2-1.6' },
        { name: 'Spülung', duration: '5-7 Tage', temp: '18-22°C', humidity: '40-50%', light: '18/6', ec: '0.0' },
      ],
    },
  ];

  const selectedStrain = strains?.find(s => s.id === selectedStrainId);
  
  // Automatische Protokoll-Auswahl basierend auf Strain-Typ
  const recommendedProtocol = selectedStrain 
    ? protocols.find(p => p.strainType === selectedStrain.type) || protocols[0]
    : null;

  return (
    <div className="page">
      <h1>📋 Grow-Protokoll-Vorlagen</h1>
      <p className="subtitle">Vorgefertigte Pläne für bekannte Strains</p>

      <div className="card">
        <h3>Strain auswählen (optional)</h3>
        <select
          value={selectedStrainId || ''}
          onChange={e => setSelectedStrainId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Manuell auswählen</option>
          {strains?.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
          ))}
        </select>
        {selectedStrain && recommendedProtocol && (
          <div className="recommendation">
            ✅ Empfohlenes Protokoll: <strong>{recommendedProtocol.name}</strong>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Verfügbare Protokolle</h3>
        <div className="protocol-list">
          {protocols.map(protocol => (
            <div key={protocol.id} className="protocol-item">
              <div className="protocol-header">
                <strong>{protocol.name}</strong>
                <span className="strain-type">{protocol.strainType}</span>
              </div>
              <p className="protocol-description">{protocol.description}</p>
              
              <div className="protocol-phases">
                {protocol.phases.map((phase, idx) => (
                  <div key={idx} className="phase-card">
                    <div className="phase-name">{phase.name}</div>
                    <div className="phase-duration">{phase.duration}</div>
                    <div className="phase-details">
                      <div className="detail">
                        <span className="label">🌡️ Temp:</span>
                        <span className="value">{phase.temp}</span>
                      </div>
                      <div className="detail">
                        <span className="label">💧 Feuchte:</span>
                        <span className="value">{phase.humidity}</span>
                      </div>
                      <div className="detail">
                        <span className="label">💡 Licht:</span>
                        <span className="value">{phase.light}</span>
                      </div>
                      <div className="detail">
                        <span className="label">🧪 EC:</span>
                        <span className="value">{phase.ec}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>💡 Protokoll-Tipps</h3>
        <ul className="tips-list">
          <li>Passe Protokolle an deine spezifischen Bedingungen an</li>
          <li>Beobachte deine Pflanzen und reagiere auf Veränderungen</li>
          <li>Dokumentiere Abweichungen für zukünftige Grows</li>
          <li>Experimentiere mit verschiedenen Protokollen</li>
        </ul>
      </div>
    </div>
  );
}
