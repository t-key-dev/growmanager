import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function QuickPhotoModePage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPlant = plants?.find(p => p.id === selectedPlantId);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const savePhoto = async () => {
    if (!capturedPhoto || !selectedPlantId) return;

    await db.photos.add({
      plantId: selectedPlantId,
      dataUrl: capturedPhoto,
      caption: caption || undefined,
      date: new Date().toISOString(),
      week: Math.floor((Date.now() - new Date(selectedPlant!.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
    });

    // Reset
    setCapturedPhoto(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page">
      <h1>📸 Schnellfoto-Modus</h1>
      <p className="subtitle">Ein-Tap-Foto mit automatischem Datum/Week-Tag</p>

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
            <h3>Foto aufnehmen</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="photo-input"
            />
            
            {capturedPhoto && (
              <div className="photo-preview">
                <img src={capturedPhoto} alt="Vorschau" />
                <div className="photo-info">
                  <span>📅 {new Date().toLocaleDateString('de-DE')}</span>
                  <span>📆 Woche {Math.floor((Date.now() - new Date(selectedPlant.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}</span>
                </div>
                <div className="form-group">
                  <label>Beschriftung (optional)</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="z.B. Neue Blätter, Trichome sichtbar..."
                  />
                </div>
                <div className="button-group">
                  <button className="btn btn-primary" onClick={savePhoto}>
                    💾 Speichern
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setCapturedPhoto(null);
                      setCaption('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ❌ Verwerfen
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3>💡 Schnellfoto-Tipps</h3>
            <ul className="tips-list">
              <li>Mache Fotos immer aus ähnlichen Perspektiven</li>
              <li>Gute Beleuchtung für beste Qualität</li>
              <li>Fotografiere beide Blattseiten</li>
              <li>Nahaufnahmen von Besonderheiten machen</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
