import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function SeasonalPlanningPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    strainId: 0,
    startDate: '',
    expectedHarvest: '',
    notes: '',
  });

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const resetForm = () => {
    setFormData({
      name: '',
      strainId: 0,
      startDate: '',
      expectedHarvest: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.startDate) {
      alert('Bitte Name und Startdatum eingeben');
      return;
    }

    await db.plants.add({
      name: formData.name,
      tentId: 0, // Will be assigned later
      startDate: formData.startDate,
      expectedHarvest: formData.expectedHarvest || undefined,
      notes: formData.notes || undefined,
      status: 'planned',
    });

    resetForm();
  };

  const getPlantsForYear = () => {
    return plants?.filter(p => {
      const startDate = new Date(p.startDate);
      return startDate.getFullYear() === selectedYear;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];
  };

  const plantsForYear = getPlantsForYear();

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    return months[month];
  };

  return (
    <div className="page">
      <h1>📅 Saisonale Planung</h1>
      <p className="subtitle">Plane mehrere Grows im Voraus</p>

      <div className="card">
        <div className="year-selector">
          {years.map(year => (
            <button
              key={year}
              className={`year-btn ${year === selectedYear ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>Neuer Grow planen</h3>
          
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Sommer Grow 2024"
            />
          </div>

          <div className="form-group">
            <label>Startdatum *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Erwartete Ernte</label>
            <input
              type="date"
              value={formData.expectedHarvest}
              onChange={e => setFormData({ ...formData, expectedHarvest: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Notizen</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Ziele, Besonderheiten, etc."
            />
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Plan erstellen
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Grow planen
        </button>
      )}

      <div className="card">
        <h3>Grows in {selectedYear}</h3>
        
        {plantsForYear.length > 0 ? (
          <div className="timeline">
            {plantsForYear.map((plant, idx) => {
              const startDate = new Date(plant.startDate);
              const harvestDate = plant.expectedHarvest ? new Date(plant.expectedHarvest) : null;
              
              return (
                <div key={plant.id} className="timeline-item">
                  <div className="timeline-marker">{idx + 1}</div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{plant.name}</strong>
                      <span className="timeline-date">
                        {startDate.toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    {harvestDate && (
                      <div className="timeline-harvest">
                        🌾 Ernte: {harvestDate.toLocaleDateString('de-DE')}
                      </div>
                    )}
                    {plant.notes && (
                      <div className="timeline-notes">{plant.notes}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>Keine Grows für {selectedYear} geplant</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Jahresübersicht</h3>
        <div className="year-overview">
          {Array.from({ length: 12 }, (_, monthIdx) => {
            const monthPlants = plantsForYear.filter(p => {
              const startDate = new Date(p.startDate);
              return startDate.getMonth() === monthIdx;
            });
            
            return (
              <div key={monthIdx} className="month-box">
                <div className="month-name">{getMonthName(monthIdx)}</div>
                <div className="month-count">{monthPlants.length} Grows</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
