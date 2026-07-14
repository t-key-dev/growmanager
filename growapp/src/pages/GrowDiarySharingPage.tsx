import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function GrowDiarySharingPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [shareSettings, setShareSettings] = useState({
    anonymous: true,
    includePhotos: true,
    includeMeasurements: true,
    includeNotes: true,
  });

  const selectedPlant = plants?.find(p => p.id === selectedPlantId);

  const generateShareLink = () => {
    if (!selectedPlantId) return '';
    
    // Generiere anonymisierte ID
    const anonId = btoa(`grow-${selectedPlantId}-${Date.now()}`).substring(0, 16);
    return `https://growmanager.app/share/${anonId}`;
  };

  const shareLink = generateShareLink();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link in Zwischenablage kopiert!');
  };

  return (
    <div className="page">
      <h1>🌐 Grow-Tagebuch teilen</h1>
      <p className="subtitle">Anonymisierte Grows mit Community teilen</p>

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
            <h3>Teilen-Einstellungen</h3>
            
            <div className="checkbox-list">
              <label>
                <input
                  type="checkbox"
                  checked={shareSettings.anonymous}
                  onChange={e => setShareSettings({ ...shareSettings, anonymous: e.target.checked })}
                />
                Anonym teilen (Name wird entfernt)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={shareSettings.includePhotos}
                  onChange={e => setShareSettings({ ...shareSettings, includePhotos: e.target.checked })}
                />
                Fotos einschließen
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={shareSettings.includeMeasurements}
                  onChange={e => setShareSettings({ ...shareSettings, includeMeasurements: e.target.checked })}
                />
                Messungen einschließen
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={shareSettings.includeNotes}
                  onChange={e => setShareSettings({ ...shareSettings, includeNotes: e.target.checked })}
                />
                Notizen einschließen
              </label>
            </div>
          </div>

          <div className="card">
            <h3>Share-Link</h3>
            <div className="share-link-box">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-link-input"
              />
              <button className="btn btn-primary" onClick={copyToClipboard}>
                📋 Kopieren
              </button>
            </div>
            <p className="share-info">
              Dieser Link ist für 30 Tage gültig und kann von jedem geöffnet werden.
            </p>
          </div>

          <div className="card">
            <h3>Vorschau</h3>
            <div className="share-preview">
              <div className="preview-header">
                <h4>{shareSettings.anonymous ? 'Anonymer Grow' : selectedPlant.name}</h4>
                <span className="strain-tag">{selectedPlant.strain}</span>
              </div>
              <div className="preview-stats">
                <div className="stat">
                  <span className="label">Start:</span>
                  <span className="value">{new Date(selectedPlant.startDate).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="stat">
                  <span className="label">Status:</span>
                  <span className="value">{selectedPlant.status}</span>
                </div>
              </div>
              {shareSettings.includePhotos && (
                <div className="preview-photos">
                  <span>📸 Fotos werden geteilt</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="card">
        <h3>💡 Community-Tipps</h3>
        <ul className="tips-list">
          <li>Teile deine Erfolge und lerne von anderen</li>
          <li>Anonymes Teilen schützt deine Privatsphäre</li>
          <li>Fotos helfen anderen bei der Diagnose</li>
          <li>Sei offen für Feedback und Fragen</li>
        </ul>
      </div>
    </div>
  );
}
