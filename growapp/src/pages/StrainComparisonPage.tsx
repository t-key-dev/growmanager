import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function StrainComparisonPage() {
  const strains = useLiveQuery(() => db.strains.toArray(), []);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleStrain = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const selectedStrains = strains?.filter(s => selectedIds.includes(s.id!)) || [];

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'leicht': return 'green';
      case 'mittel': return 'orange';
      case 'schwer': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="page">
      <h1>🔬 Strain-Vergleich</h1>
      <p className="subtitle">Vergleiche bis zu 4 Strains</p>

      <div className="card">
        <h3>Strains auswählen ({selectedIds.length}/4)</h3>
        <div className="checkbox-list">
          {strains?.map(strain => (
            <label key={strain.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedIds.includes(strain.id!)}
                onChange={() => toggleStrain(strain.id!)}
                disabled={!selectedIds.includes(strain.id!) && selectedIds.length >= 4}
              />
              <span>{strain.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedStrains.length > 0 && (
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="comparison-label">Eigenschaft</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-column">
                <strong>{s.name}</strong>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Typ</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.type}</div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Genetik</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.genetics || '-'}</div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Pflanzentyp</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">
                {s.plantType === 'auto' ? 'Autoflower' : s.plantType === 'photo' ? 'Photoperiod' : '-'}
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Blütezeit</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">
                {s.floweringDays ? `${s.floweringDays} Tage` : '-'}
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Schwierigkeit</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">
                <span style={{ color: getDifficultyColor(s.difficulty) }}>
                  {s.difficulty || '-'}
                </span>
              </div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Ertrag Indoor</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.yieldIndoor || '-'}</div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">THC</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.thc || '-'}</div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">CBD</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.cbd || '-'}</div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Aroma</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.aroma || '-'}</div>
            ))}
          </div>

          <div className="comparison-row">
            <div className="comparison-label">Wirkung</div>
            {selectedStrains.map(s => (
              <div key={s.id} className="comparison-value">{s.effect || '-'}</div>
            ))}
          </div>
        </div>
      )}

      {selectedStrains.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>Wähle mindestens 2 Strains zum Vergleichen aus</p>
          </div>
        </div>
      )}
    </div>
  );
}
