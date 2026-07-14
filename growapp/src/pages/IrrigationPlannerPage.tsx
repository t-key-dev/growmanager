import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function IrrigationPlannerPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [irrigationType, setIrrigationType] = useState<'manual' | 'drip' | 'flood' | 'aeroponic'>('manual');
  const [frequency, setFrequency] = useState(2);
  const [duration, setDuration] = useState(5);
  const [startTime, setStartTime] = useState('08:00');

  const selectedPlant = plants?.find(p => p.id === selectedPlantId);

  return (
    <div className="page">
      <h1>💧 Bewässerungs-Planer</h1>
      <p className="subtitle">Automatische Bewässerungspläne erstellen</p>

      <div className="card">
        <h3>Pflanze auswählen</h3>
        <select
          value={selectedPlantId || ''}
          onChange={e => setSelectedPlantId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Bitte wählen...</option>
          {plants?.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedPlant && (
        <>
          <div className="card">
            <h3>Bewässerungs-Einstellungen</h3>
            
            <div className="form-group">
              <label>Bewässerungs-System</label>
              <select
                value={irrigationType}
                onChange={e => setIrrigationType(e.target.value as any)}
              >
                <option value="manual">Manuell</option>
                <option value="drip">Tropfbewässerung</option>
                <option value="flood">Ebbe-Flut</option>
                <option value="aeroponic">Aeroponik</option>
              </select>
            </div>

            <div className="form-group">
              <label>Häufigkeit (pro Tag)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="10"
                value={frequency}
                onChange={e => setFrequency(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="form-group">
              <label>Dauer pro Bewässerung (Minuten)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="60"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="form-group">
              <label>Startzeit</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="card result-card">
            <h3>Bewässerungsplan für {selectedPlant.name}</h3>
            <div className="result">
              <div className="result-item">
                <span className="label">System:</span>
                <span className="value">
                  {irrigationType === 'manual' ? 'Manuell' : 
                   irrigationType === 'drip' ? 'Tropfbewässerung' :
                   irrigationType === 'flood' ? 'Ebbe-Flut' : 'Aeroponik'}
                </span>
              </div>
              <div className="result-item">
                <span className="label">Häufigkeit:</span>
                <span className="value">{frequency}x pro Tag</span>
              </div>
              <div className="result-item">
                <span className="label">Dauer:</span>
                <span className="value">{duration} Minuten</span>
              </div>
              <div className="result-item">
                <span className="label">Gesamt pro Tag:</span>
                <span className="value">{frequency * duration} Minuten</span>
              </div>
              <div className="result-item">
                <span className="label">Erste Bewässerung:</span>
                <span className="value">{startTime} Uhr</span>
              </div>
            </div>

            <div className="info-box">
              <strong>💡 Bewässerungs-Tipps:</strong>
              <ul>
                <li>Tropfbewässerung: Gleichmäßig, wassersparend</li>
                <li>Ebbe-Flut: Gut für größere Pflanzen</li>
                <li>Aeroponik: Maximale Sauerstoffversorgung</li>
                <li>Immer auf Überwässerung achten!</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
