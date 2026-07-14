import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { NoteTemplate } from '../types';

export default function NoteTemplatesPage() {
  const templates = useLiveQuery(() => db.noteTemplates.toArray(), []);
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NoteTemplate | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    category: 'general' as NoteTemplate['category'],
  });

  const resetForm = () => {
    setFormData({ name: '', text: '', category: 'general' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.text) {
      alert('Bitte Name und Text eingeben');
      return;
    }

    const templateData: Omit<NoteTemplate, 'id'> = {
      name: formData.name,
      text: formData.text,
      category: formData.category,
    };

    if (editing?.id) {
      await db.noteTemplates.update(editing.id, templateData);
    } else {
      await db.noteTemplates.add({ ...templateData } as NoteTemplate);
    }

    resetForm();
  };

  const handleEdit = (template: NoteTemplate) => {
    setEditing(template);
    setFormData({
      name: template.name,
      text: template.text,
      category: template.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Template wirklich löschen?')) {
      await db.noteTemplates.delete(id);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'water': return '💧';
      case 'fertilize': return '🧪';
      case 'note': return '📝';
      default: return '📋';
    }
  };

  const grouped = templates?.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, NoteTemplate[]>) || {};

  return (
    <div className="page">
      <h1>📝 Notiz-Templates</h1>

      {showForm && (
        <div className="card">
          <h3>{editing ? 'Template bearbeiten' : 'Neues Template'}</h3>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Standard Gießen"
            />
          </div>

          <div className="form-group">
            <label>Kategorie</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as NoteTemplate['category'] })}
            >
              <option value="general">📋 Allgemein</option>
              <option value="water">💧 Gießen</option>
              <option value="fertilize">🧪 Düngen</option>
              <option value="note">📝 Notiz</option>
            </select>
          </div>

          <div className="form-group">
            <label>Text *</label>
            <textarea
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              rows={5}
              placeholder="Template-Text..."
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
          + Neues Template
        </button>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="card">
          <h3>{getCategoryIcon(category)} {category === 'water' ? 'Gießen' : category === 'fertilize' ? 'Düngen' : category === 'note' ? 'Notiz' : 'Allgemein'}</h3>
          {items.map(template => (
            <div key={template.id} className="template-item">
              <div className="template-header">
                <strong>{template.name}</strong>
              </div>
              <p className="template-text">{template.text}</p>
              <div className="event-actions">
                <button className="btn-icon" onClick={() => handleEdit(template)}>✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(template.id!)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {templates?.length === 0 && !showForm && (
        <div className="card">
          <div className="empty-state">
            <p>Keine Templates vorhanden</p>
          </div>
        </div>
      )}
    </div>
  );
}
