import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { LightCycleEvent } from '../types';

export default function LightCyclePlannerPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const lightEvents = useLiveQuery(() => db.lightCycleEvents.toArray(), []);
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LightCycleEvent | null>(null);

  const [formData, setFormData] = useState({
    plantId: 0,
    fromCycle: '18/6',
    toCycle: '12/12',
    switchDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      plantId: 0,
      fromCycle: '18/6',
      toCycle: '12/12',
      switchDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.plantId) {
      alert('Bitte Pflanze auswählen');
      return;
    }

    const eventData: Omit<LightCycleEvent, 'id'> = {
      plantId: formData.plantId,
      fromCycle: formData.fromCycle,
      toCycle: formData.toCycle,
      switchDate: formData.switchDate,
      notes: formData.notes || undefined,
    };

    if (editing?.id) {
      await db.lightCycleEvents.update(editing.id, eventData);
    } else {
      await db.lightCycleEvents.add({ ...eventData } as LightCycleEvent);
    }

    resetForm();
  };

  const handleEdit = (event: LightCycleEvent) => {
    setEditing(event);
    setFormData({
      plantId: event.plantId,
      fromCycle: event.fromCycle,
      toCycle: event.toCycle,
      switchDate: event.switchDate,
      notes: event.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Lichtzyklus-Event wirklich löschen?')) {
      await db.lightCycleEvents.delete(id);
    }
  };

  const getPlantName = (id: number) => {
    return plants?.find(p => p.id === id)?.name || 'Unbekannt';
  };

  const getDaysUntilSwitch = (switchDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const switchDay = new Date(switchDate);
    switchDay.setHours(0, 0, 0, 0);
    const diff = Math.ceil((switchDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const upcomingSwitches = lightEvents
    ?.filter(e => getDaysUntilSwitch(e.switchDate) >= 0)
    .sort((a, b) => new Date(a.switchDate).getTime() - new Date(b.switchDate).getTime()) || [];

  const pastSwitches = lightEvents
    ?.filter(e => getDaysUntilSwitch(e.switchDate) < 0)
    .sort((a, b) => new Date(b.switchDate).getTime() - new Date(a.switchDate).getTime()) || [];

  return (
    <div className="page">
      <h1>☀️ Lichtzyklus-Planer</h1>

      {showForm && (
        <div className="card">
          <h3>{editing ? 'Event bearbeiten' : 'Neues Event'}</h3>

          <div className="form-group">
            <label>Pflanze *</label>
            <select
              value={formData.plantId}
              onChange={e => setFormData({ ...formData, plantId: Number(e.target.value) })}
            >
              <option value={0}>Bitte wählen...</option>
              {plants?.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Von</label>
              <select
                value={formData.fromCycle}
                onChange={e => setFormData({ ...formData, fromCycle: e.target.value })}
              >
                <option value="18/6">18/6</option>
                <option value="20/4">20/4</option>
                <option value="24/0">24/0</option>
                <option value="12/12">12/12</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nach</label>
              <select
                value={formData.toCycle}
                onChange={e => setFormData({ ...formData, toCycle: e.target.value })}
              >
                <option value="12/12">12/12</option>
                <option value="18/6">18/6</option>
                <option value="20/4">20/4</option>
                <option value="24/0">24/0</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Wechsel-Datum *</label>
            <input
              type="date"
              value={formData.switchDate}
              onChange={e => setFormData({ ...formData, switchDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Notizen</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="z.B. Start Blütephase"
            />
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Aktualisieren' : 'Erstellen'}
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Neues Event
        </button>
      )}

      {upcomingSwitches.length > 0 && (
        <div className="card">
          <h3>⏰ Bevorstehende Wechsel</h3>
          {upcomingSwitches.map(event => {
            const days = getDaysUntilSwitch(event.switchDate);
            return (
              <div key={event.id} className="event-item">
                <div className="event-header">
                  <strong>{getPlantName(event.plantId)}</strong>
                  <span className={`badge ${days === 0 ? 'today' : days <= 3 ? 'soon' : ''}`}>
                    {days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `in ${days} Tagen`}
                  </span>
                </div>
                <div className="event-details">
                  <span className="cycle-change">
                    {event.fromCycle} → {event.toCycle}
                  </span>
                  <span className="event-date">
                    {new Date(event.switchDate).toLocaleDateString('de-DE')}
                  </span>
                </div>
                {event.notes && <p className="event-notes">{event.notes}</p>}
                <div className="event-actions">
                  <button className="btn-icon" onClick={() => handleEdit(event)}>✏️</button>
                  <button className="btn-icon danger" onClick={() => handleDelete(event.id!)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pastSwitches.length > 0 && (
        <div className="card">
          <h3>📅 Vergangene Wechsel</h3>
          {pastSwitches.slice(0, 10).map(event => (
            <div key={event.id} className="event-item past">
              <div className="event-header">
                <strong>{getPlantName(event.plantId)}</strong>
              </div>
              <div className="event-details">
                <span className="cycle-change">
                  {event.fromCycle} → {event.toCycle}
                </span>
                <span className="event-date">
                  {new Date(event.switchDate).toLocaleDateString('de-DE')}
                </span>
              </div>
              {event.notes && <p className="event-notes">{event.notes}</p>}
              <div className="event-actions">
                <button className="btn-icon" onClick={() => handleEdit(event)}>✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(event.id!)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightEvents?.length === 0 && !showForm && (
        <div className="card">
          <div className="empty-state">
            <p>Keine Lichtzyklus-Events vorhanden</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>💡 Tipps</h3>
        <ul className="info-list">
          <li>18/6 → 12/12: Wechsel für Blütephase bei photoperiodischen Pflanzen</li>
          <li>Autoflowers: Kein Wechsel nötig (bleiben auf 18/6 oder 20/4)</li>
          <li>Plane den Wechsel 1-2 Wochen im Voraus</li>
        </ul>
      </div>
    </div>
  );
}
