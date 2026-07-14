import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function GrowthCurvesPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const photos = useLiveQuery(() => db.photos.toArray(), []);
  const measurements = useLiveQuery(() => db.measurements.toArray(), []);
  
  const [selectedPlantIds, setSelectedPlantIds] = useState<number[]>([]);

  const togglePlant = (id: number) => {
    setSelectedPlantIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const getPlantData = (plantId: number) => {
    const plantPhotos = photos
      ?.filter(p => p.plantId === plantId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
    
    const plantMeasurements = measurements
      ?.filter(m => m.plantId === plantId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

    return { photos: plantPhotos, measurements: plantMeasurements };
  };

  return (
    <div className="page">
      <h1>📈 Wachstumskurven</h1>
      <p className="subtitle">Visuelle Darstellung der Pflanzenentwicklung</p>

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
        <div className="card">
          <h3>Wachstumsdaten</h3>
          {selectedPlantIds.map(plantId => {
            const plant = plants?.find(p => p.id === plantId);
            const { photos, measurements } = getPlantData(plantId);
            
            return (
              <div key={plantId} className="plant-growth-section">
                <h4>{plant?.name}</h4>
                
                {measurements.length > 0 && (
                  <div className="growth-chart">
                    <div className="chart-header">
                      <span>Höhe (cm)</span>
                    </div>
                    <div className="chart-container">
                      {measurements.map((m, idx) => (
                        <div key={idx} className="chart-point">
                          <div 
                            className="chart-bar"
                            style={{ height: `${(m.height || 0) / 2}%` }}
                          />
                          <div className="chart-label">
                            {new Date(m.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="growth-stats">
                  <div className="stat-box">
                    <span className="stat-value">{photos.length}</span>
                    <span className="stat-label">Fotos</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{measurements.length}</span>
                    <span className="stat-label">Messungen</span>
                  </div>
                  {measurements.length > 0 && (
                    <div className="stat-box">
                      <span className="stat-value">
                        {measurements[measurements.length - 1].height || 0} cm
                      </span>
                      <span className="stat-label">Aktuelle Höhe</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPlantIds.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>Wähle Pflanzen aus, um Wachstumskurven zu sehen</p>
          </div>
        </div>
      )}
    </div>
  );
}
