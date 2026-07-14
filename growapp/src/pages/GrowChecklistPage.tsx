import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface ChecklistItem {
  id: string;
  text: string;
  category: 'daily' | 'weekly' | 'as-needed';
  completed: boolean;
}

export default function GrowChecklistPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Pflanzen gießen', category: 'daily', completed: false },
    { id: '2', text: 'Temperatur prüfen', category: 'daily', completed: false },
    { id: '3', text: 'Luftfeuchtigkeit prüfen', category: 'daily', completed: false },
    { id: '4', text: 'EC-Wert messen', category: 'daily', completed: false },
    { id: '5', text: 'pH-Wert messen', category: 'daily', completed: false },
    { id: '6', text: 'Lüftung kontrollieren', category: 'daily', completed: false },
    { id: '7', text: 'Pflanzen auf Schädlinge prüfen', category: 'weekly', completed: false },
    { id: '8', text: 'Tote Blätter entfernen', category: 'weekly', completed: false },
    { id: '9', text: 'Nährstoffe nachfüllen', category: 'weekly', completed: false },
    { id: '10', text: 'Wassertank reinigen', category: 'weekly', completed: false },
    { id: '11', text: 'Filter reinigen', category: 'weekly', completed: false },
    { id: '12', text: 'Pflanzen zurückschneiden', category: 'as-needed', completed: false },
    { id: '13', text: 'Stützstäbe anbringen', category: 'as-needed', completed: false },
    { id: '14', text: 'Blüten ernten', category: 'as-needed', completed: false },
  ]);

  const selectedPlant = plants?.find(p => p.id === selectedPlantId);
  void selectedPlant; // Used for future plant-specific checklists

  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const resetChecklist = () => {
    setChecklist(checklist.map(item => ({ ...item, completed: false })));
  };

  const dailyItems = checklist.filter(i => i.category === 'daily');
  const weeklyItems = checklist.filter(i => i.category === 'weekly');
  const asNeededItems = checklist.filter(i => i.category === 'as-needed');

  const completedCount = checklist.filter(i => i.completed).length;
  const totalCount = checklist.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="page">
      <h1>✅ Grow-Checkliste</h1>
      <p className="subtitle">Tägliche/wöchentliche Checklisten für optimale Pflege</p>

      <div className="card">
        <h3>Pflanze auswählen (optional)</h3>
        <select
          value={selectedPlantId || ''}
          onChange={e => setSelectedPlantId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Alle Pflanzen</option>
          {plants?.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="checklist-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            {completedCount} / {totalCount} erledigt ({Math.round(progress)}%)
          </div>
        </div>

        <button className="btn btn-secondary" onClick={resetChecklist}>
          🔄 Checkliste zurücksetzen
        </button>
      </div>

      <div className="card">
        <h3>📅 Täglich</h3>
        <div className="checklist-section">
          {dailyItems.map(item => (
            <label key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.completed ? 'completed' : ''}>{item.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>📆 Wöchentlich</h3>
        <div className="checklist-section">
          {weeklyItems.map(item => (
            <label key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.completed ? 'completed' : ''}>{item.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>🎯 Nach Bedarf</h3>
        <div className="checklist-section">
          {asNeededItems.map(item => (
            <label key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.completed ? 'completed' : ''}>{item.text}</span>
            </label>
          ))}
        </div>
      </div>

      {completedCount === totalCount && (
        <div className="card success-card">
          <div className="success-icon">🎉</div>
          <h3>Alle Aufgaben erledigt!</h3>
          <p>Großartige Arbeit! Deine Pflanzen werden es dir danken.</p>
        </div>
      )}
    </div>
  );
}
