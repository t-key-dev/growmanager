import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function ProblemReporterPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [problemType, setProblemType] = useState<string>('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const problemTypes = [
    { id: 'yellowing', label: '🟡 Vergilbung', description: 'Blätter werden gelb' },
    { id: 'wilting', label: '🥀 Welken', description: 'Pflanze hängt schlaff' },
    { id: 'spots', label: '⚫ Flecken', description: 'Braune/schwarze Flecken' },
    { id: 'curling', label: '🌀 Kräuselung', description: 'Blätter kräuseln sich' },
    { id: 'burn', label: '🔥 Verbrennung', description: 'Blattränder verbrennen' },
    { id: 'stretching', label: '📏 Streckung', description: 'Pflanze wächst zu schnell in die Höhe' },
    { id: 'slow_growth', label: '🐌 Langsames Wachstum', description: 'Wachstum stagniert' },
    { id: 'pests', label: '🐛 Schädlinge', description: 'Insekten oder Spinnmilben' },
    { id: 'mold', label: '🦠 Schimmel', description: 'Grauschimmel oder Mehltau' },
    { id: 'nutrient', label: '🧪 Nährstoffmangel', description: 'Mangelerscheinungen' },
    { id: 'ph', label: '⚗️ pH-Problem', description: 'pH-Wert stimmt nicht' },
    { id: 'other', label: '❓ Sonstiges', description: 'Anderes Problem' },
  ];

  const handleSubmit = async () => {
    if (!selectedPlantId || !problemType) {
      alert('Bitte Pflanze und Problem auswählen');
      return;
    }

    // Create a log entry with problem information
    await db.logs.add({
      plantId: selectedPlantId,
      type: 'note',
      date: new Date().toISOString(),
      note: `[PROBLEM ${severity.toUpperCase()}] ${problemTypes.find(p => p.id === problemType)?.label}: ${notes}`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedPlantId(null);
      setProblemType('');
      setSeverity('medium');
      setNotes('');
    }, 2000);
  };

  const getSelectedPlant = () => {
    return plants?.find(p => p.id === selectedPlantId);
  };

  const selectedPlant = getSelectedPlant();

  return (
    <div className="page">
      <h1>⚠️ Problemmelder</h1>
      <p className="subtitle">Melde Probleme mit deinen Pflanzen schnell und einfach</p>

      {submitted ? (
        <div className="card success">
          <div className="success-icon">✅</div>
          <h3>Problem erfolgreich gemeldet!</h3>
          <p>Das Problem wurde im Logbuch der Pflanze vermerkt.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <h3>1. Pflanze auswählen</h3>
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
                <h3>2. Problem-Typ</h3>
                <div className="problem-grid">
                  {problemTypes.map(type => (
                    <button
                      key={type.id}
                      className={`problem-type-btn ${problemType === type.id ? 'selected' : ''}`}
                      onClick={() => setProblemType(type.id)}
                    >
                      <span className="problem-label">{type.label}</span>
                      <span className="problem-desc">{type.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {problemType && (
                <>
                  <div className="card">
                    <h3>3. Schweregrad</h3>
                    <div className="severity-selector">
                      <button
                        className={`severity-btn ${severity === 'low' ? 'selected low' : ''}`}
                        onClick={() => setSeverity('low')}
                      >
                        🟢 Leicht
                      </button>
                      <button
                        className={`severity-btn ${severity === 'medium' ? 'selected medium' : ''}`}
                        onClick={() => setSeverity('medium')}
                      >
                        🟡 Mittel
                      </button>
                      <button
                        className={`severity-btn ${severity === 'high' ? 'selected high' : ''}`}
                        onClick={() => setSeverity('high')}
                      >
                        🔴 Schwer
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <h3>4. Zusätzliche Informationen</h3>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Beschreibe das Problem genauer... (optional)"
                    />
                  </div>

                  <button className="btn btn-primary btn-large" onClick={handleSubmit}>
                    Problem melden
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}

      <div className="card">
        <h3>💡 Schnelle Hilfe</h3>
        <ul className="info-list">
          <li>🟡 <strong>Vergilbung:</strong> Prüfe pH-Wert und Nährstoffe</li>
          <li>🥀 <strong>Welken:</strong> Prüfe Bewässerung und Wurzelgesundheit</li>
          <li>🔥 <strong>Verbrennung:</strong> Prüfe Düngerdosis und Lampenabstand</li>
          <li>🐛 <strong>Schädlinge:</strong> Siehe Diagnose-Seite für Behandlung</li>
          <li>⚗️ <strong>pH-Problem:</strong> Nutze den pH-Rechner</li>
        </ul>
      </div>
    </div>
  );
}
