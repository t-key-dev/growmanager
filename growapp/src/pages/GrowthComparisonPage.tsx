import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function GrowthComparisonPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const photos = useLiveQuery(() => db.photos.toArray(), []);
  
  const [selectedPlantIds, setSelectedPlantIds] = useState<number[]>([]);

  const togglePlant = (id: number) => {
    setSelectedPlantIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const getPlantPhotos = (plantId: number) => {
    return photos
      ?.filter(p => p.plantId === plantId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  };

  const maxPhotos = Math.max(...selectedPlantIds.map(id => getPlantPhotos(id).length), 0);

  return (
    <div className="page">
      <h1>📸 Wachstumsvergleich</h1>

      <div className="card">
        <h3>Pflanzen auswählen</h3>
        <div className="checkbox-list">
          {plants?.map(plant => (
            <label key={plant.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedPlantIds.includes(plant.id!)}
                onChange={() => togglePlant(plant.id!)}
              />
              <span>{plant.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedPlantIds.length > 0 && (
        <div className="comparison-grid">
          {selectedPlantIds.map(plantId => {
            const plant = plants?.find(p => p.id === plantId);
            const plantPhotos = getPlantPhotos(plantId);
            
            return (
              <div key={plantId} className="comparison-column">
                <h3>{plant?.name}</h3>
                <div className="photo-timeline">
                  {Array.from({ length: maxPhotos }).map((_, idx) => {
                    const photo = plantPhotos[idx];
                    return (
                      <div key={idx} className="photo-slot">
                        {photo ? (
                          <>
                            <img src={photo.dataUrl} alt={`Woche ${photo.week || idx + 1}`} />
                            <div className="photo-label">
                              Woche {photo.week || idx + 1}
                              <br />
                              {new Date(photo.date).toLocaleDateString('de-DE')}
                            </div>
                          </>
                        ) : (
                          <div className="photo-empty">Kein Foto</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPlantIds.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>Wähle mindestens 2 Pflanzen zum Vergleichen aus</p>
          </div>
        </div>
      )}
    </div>
  );
}
