import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function GrowRoomsPage() {
  const rooms = useLiveQuery(() => db.rooms.toArray(), []);
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({ name: '', location: '', size: '', notes: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Bitte Name eingeben');
      return;
    }

    if (editing?.id) {
      await db.rooms.update(editing.id, formData);
    } else {
      await db.rooms.add({ ...formData, createdAt: new Date().toISOString() });
    }

    resetForm();
  };

  const handleEdit = (room: any) => {
    setEditing(room);
    setFormData({
      name: room.name,
      location: room.location || '',
      size: room.size || '',
      notes: room.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Raum wirklich löschen?')) {
      await db.rooms.delete(id);
    }
  };

  const getTentsForRoom = (roomId: number) => {
    return tents?.filter(t => t.roomId === roomId) || [];
  };

  return (
    <div className="page">
      <h1>🏠 Mehrere Grow-Räume</h1>
      <p className="subtitle">Verwaltung von verschiedenen Räumen/Standorten</p>

      {showForm && (
        <div className="card">
          <h3>{editing ? 'Raum bearbeiten' : 'Neuer Raum'}</h3>
          
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Keller, Dachboden, Garage"
            />
          </div>

          <div className="form-group">
            <label>Standort</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="z.B. Untergeschoss"
            />
          </div>

          <div className="form-group">
            <label>Größe</label>
            <input
              type="text"
              value={formData.size}
              onChange={e => setFormData({ ...formData, size: e.target.value })}
              placeholder="z.B. 3x4m"
            />
          </div>

          <div className="form-group">
            <label>Notizen</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Besonderheiten, Ausstattung, etc."
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
          + Neuer Raum
        </button>
      )}

      {rooms?.map(room => {
        const roomTents = getTentsForRoom(room.id!);
        
        return (
          <div key={room.id} className="card">
            <div className="room-header">
              <h3>{room.name}</h3>
              <div className="room-actions">
                <button className="btn-icon" onClick={() => handleEdit(room)}>✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(room.id!)}>🗑️</button>
              </div>
            </div>
            
            {room.location && (
              <div className="room-info">📍 {room.location}</div>
            )}
            {room.size && (
              <div className="room-info">📐 {room.size}</div>
            )}
            {room.notes && (
              <div className="room-notes">{room.notes}</div>
            )}

            <div className="room-tents">
              <h4>Zelte in diesem Raum ({roomTents.length})</h4>
              {roomTents.length > 0 ? (
                <div className="tent-list">
                  {roomTents.map(tent => (
                    <div key={tent.id} className="tent-item">
                      <span className="tent-name">{tent.name}</span>
                      <span className="tent-size">{tent.size}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-tents">Keine Zelte in diesem Raum</p>
              )}
            </div>
          </div>
        );
      })}

      {rooms?.length === 0 && !showForm && (
        <div className="card">
          <div className="empty-state">
            <p>Keine Räume vorhanden</p>
            <p>Erstelle deinen ersten Grow-Raum</p>
          </div>
        </div>
      )}
    </div>
  );
}
