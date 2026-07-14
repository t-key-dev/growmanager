import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { Clone } from '../types';

export default function ClonesPage() {
  const clones = useLiveQuery(() => db.clones.toArray(), []);
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Clone | null>(null);

  const [formData, setFormData] = useState({
    motherPlantId: 0,
    name: '',
    cutDate: new Date().toISOString().split('T')[0],
    rootedDate: '',
    notes: '',
    success: false,
  });

  const resetForm = () => {
    setFormData({
      motherPlantId: 0,
      name: '',
      cutDate: new Date().toISOString().split('T')[0],
      rootedDate: '',
      notes: '',
      success: false,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.motherPlantId || !formData.name) {
      alert('Bitte Mutterpflanze und Name auswählen');
      return;
    }

    const cloneData: Omit<Clone, 'id'> = {
      motherPlantId: formData.motherPlantId,
      name: formData.name,
      cutDate: formData.cutDate,
      rootedDate: formData.rootedDate || undefined,
      notes: formData.notes || undefined,
      success: formData.success || undefined,
    };

    if (editing?.id) {
      await db.clones.update(editing.id, cloneData);
    } else {
      await db.clones.add({ ...cloneData } as Clone);
    }

    resetForm();
  };

  const handleEdit = (clone: Clone) => {
    setEditing(clone);
    setFormData({
      motherPlantId: clone.motherPlantId,
      name: clone.name,
      cutDate: clone.cutDate,
      rootedDate: clone.rootedDate || '',
      notes: clone.notes || '',
      success: clone.success || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Steckling wirklich löschen?')) {
      await db.clones.delete(id);
    }
  };

  const getPlantName = (id: number) => {
    return plants?.find(p => p.id === id)?.name || 'Unbekannt';
  };

  const activeClones = clones?.filter(c => !c.success || !c.rootedDate) || [];
  const rootedClones = clones?.filter(c => c.success && c.rootedDate) || [];

  return (
    <div className="page">
      <h1>🌱 Stecklinge</h1>

      {showForm && (
        <div className="card">
          <h3>{editing ? 'Steckling bearbeiten' : 'Neuer Steckling'}</h3>

          <div className="form-group">
            <label>Mutterpflanze *</label>
            <select
              value={formData.motherPlantId}
              onChange={e => setFormData({ ...formData, motherPlantId: Number(e.target.value) })}
            >
              <option value={0}>Bitte wählen...</option>
              {plants?.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Clone #1"
            />
          </div>

          <div className="form-group">
            <label>Schnitt-Datum *</label>
            <input
              type="date"
              value={formData.cutDate}
              onChange={e => setFormData({ ...formData, cutDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Bewurzelt am</label>
            <input
              type="date"
              value={formData.rootedDate}
              onChange={e => setFormData({ ...formData, rootedDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.success}
                onChange={e => setFormData({ ...formData, success: e.target.checked })}
              />
              {' '}Erfolgreich bewurzelt
            </label>
          </div>

          <div className="form-group">
            <label>Notizen</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
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
          + Neuer Steckling
        </button>
      )}

      {activeClones.length > 0 && (
        <div className="card">
          <h3>🌱 Aktive Stecklinge</h3>
          {activeClones.map(clone => (
            <div key={clone.id} className="event-item">
              <div className="event-header">
                <strong>{clone.name}</strong>
                <span className="badge">In Bewurzelung</span>
              </div>
              <div className="event-details">
                <span>Von: {getPlantName(clone.motherPlantId)}</span>
                <span>Schnitt: {new Date(clone.cutDate).toLocaleDateString('de-DE')}</span>
              </div>
              {clone.notes && <p className="event-notes">{clone.notes}</p>}
              <div className="event-actions">
                <button className="btn-icon" onClick={() => handleEdit(clone)}>✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(clone.id!)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rootedClones.length > 0 && (
        <div className="card">
          <h3>✅ Bewurzelte Stecklinge</h3>
          {rootedClones.map(clone => (
            <div key={clone.id} className="event-item past">
              <div className="event-header">
                <strong>{clone.name}</strong>
                <span className="badge success">Bewurzelt</span>
              </div>
              <div className="event-details">
                <span>Von: {getPlantName(clone.motherPlantId)}</span>
                <span>Bewurzelt: {clone.rootedDate ? new Date(clone.rootedDate).toLocaleDateString('de-DE') : '-'}</span>
              </div>
              <div className="event-actions">
                <button className="btn-icon" onClick={() => handleEdit(clone)}>✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(clone.id!)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {clones?.length === 0 && !showForm && (
        <div className="card">
          <div className="empty-state">
            <p>Keine Stecklinge vorhanden</p>
          </div>
        </div>
      )}
    </div>
  );
}
