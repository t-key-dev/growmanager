import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function TimelapsePage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const photos = useLiveQuery(() => db.photos.toArray(), []);
  
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [interval, setInterval] = useState(7); // Tage zwischen Fotos
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const selectedPlant = plants?.find(p => p.id === selectedPlantId);
  const plantPhotos = photos
    ?.filter(p => p.plantId === selectedPlantId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  const timelapsePhotos = plantPhotos.filter((_, index) => index % interval === 0);

  const playTimelapse = () => {
    setIsPlaying(true);
    setCurrentFrame(0);
    
    const timer = window.setInterval(() => {
      setCurrentFrame(prev => {
        if (prev >= timelapsePhotos.length - 1) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 500); // 500ms pro Frame
  };

  return (
    <div className="page">
      <h1>🎬 Zeitraffer-Funktion</h1>
      <p className="subtitle">Erstelle Zeitraffer-Videos aus deinen Pflanzenfotos</p>

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

      {selectedPlant && plantPhotos.length > 0 && (
        <>
          <div className="card">
            <h3>Zeitraffer-Einstellungen</h3>
            
            <div className="form-group">
              <label>Intervall: Alle {interval} Tage ein Foto</label>
              <input
                type="range"
                min="1"
                max="14"
                value={interval}
                onChange={e => setInterval(parseInt(e.target.value))}
              />
              <div className="range-labels">
                <span>1 Tag</span>
                <span>14 Tage</span>
              </div>
            </div>

            <div className="info-box">
              <strong>📊 Statistik:</strong>
              <ul>
                <li>Gesamte Fotos: {plantPhotos.length}</li>
                <li>Zeitraffer-Fotos: {timelapsePhotos.length}</li>
                <li>Geschätzte Dauer: {(timelapsePhotos.length * 0.5).toFixed(1)} Sekunden</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h3>Zeitraffer-Vorschau</h3>
            <div className="timelapse-preview">
              {timelapsePhotos.length > 0 ? (
                <>
                  <img 
                    src={timelapsePhotos[currentFrame]?.dataUrl} 
                    alt={`Frame ${currentFrame + 1}`}
                    className="timelapse-image"
                  />
                  <div className="timelapse-controls">
                    <button 
                      className="btn btn-primary"
                      onClick={playTimelapse}
                      disabled={isPlaying}
                    >
                      {isPlaying ? '▶️ Abspielen...' : '▶️ Abspielen'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max={timelapsePhotos.length - 1}
                      value={currentFrame}
                      onChange={e => {
                        setCurrentFrame(parseInt(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="timelapse-slider"
                    />
                    <div className="frame-counter">
                      Frame {currentFrame + 1} / {timelapsePhotos.length}
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <p>Nicht genügend Fotos für Zeitraffer</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3>Alle Zeitraffer-Fotos</h3>
            <div className="photo-grid">
              {timelapsePhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`photo-thumb ${index === currentFrame ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentFrame(index);
                    setIsPlaying(false);
                  }}
                >
                  <img src={photo.dataUrl} alt={`Foto ${index + 1}`} />
                  <div className="photo-label">
                    Tag {index * interval + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedPlant && plantPhotos.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>Keine Fotos für diese Pflanze vorhanden</p>
            <p>Füge Fotos über die Pflanzen-Detailseite hinzu</p>
          </div>
        </div>
      )}
    </div>
  );
}
