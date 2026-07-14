import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { differenceInDays, parseISO } from 'date-fns';

export default function YieldEstimationPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const harvests = useLiveQuery(() => db.harvests.toArray(), []);

  if (!plants || !harvests) return null;

  const activePlants = plants.filter(p => !p.archived);
  const today = new Date();

  // Calculate estimations for active plants
  const estimations = activePlants.map(plant => {
    const daysSinceStart = differenceInDays(today, parseISO(plant.startDate));
    const currentWeek = Math.floor(daysSinceStart / 7) + 1;
    
    // Find similar harvests (same strain)
    const similarHarvests = harvests.filter(h => {
      const harvestedPlant = plants.find(p => p.id === h.plantId);
      return harvestedPlant?.strain === plant.strain;
    });

    // Calculate average yield from similar harvests
    const avgYield = similarHarvests.length > 0
      ? similarHarvests.reduce((sum, h) => sum + (h.dryWeightG || 0), 0) / similarHarvests.length
      : null;

    // Estimate based on growth progress (simple model)
    // Assume 60% of final yield at week 8, 80% at week 10, 100% at week 12+
    let progressFactor = 0;
    if (currentWeek <= 6) progressFactor = 0.2;
    else if (currentWeek <= 8) progressFactor = 0.6;
    else if (currentWeek <= 10) progressFactor = 0.8;
    else progressFactor = 1.0;

    const estimatedYield = avgYield ? avgYield * progressFactor : null;

    return {
      plant,
      currentWeek,
      daysSinceStart,
      avgYield,
      estimatedYield,
      similarHarvests: similarHarvests.length,
    };
  });

  return (
    <div className="page">
      <h1>📈 Ertragsprognose</h1>

      {estimations.length > 0 ? (
        estimations.map(est => (
          <div key={est.plant.id} className="card">
            <h3>{est.plant.name}</h3>
            {est.plant.strain && <div className="muted">🧬 {est.plant.strain}</div>}
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">Woche {est.currentWeek}</div>
                <div className="stat-label">{est.daysSinceStart} Tage</div>
              </div>
              
              {est.similarHarvests > 0 && (
                <>
                  <div className="stat-item">
                    <div className="stat-value">{Math.round(est.avgYield || 0)}g</div>
                    <div className="stat-label">⌀ historische Ernte</div>
                  </div>
                  
                  <div className="stat-item large">
                    <div className="stat-value">{Math.round(est.estimatedYield || 0)}g</div>
                    <div className="stat-label">Geschätzter Ertrag</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-value">{est.similarHarvests}</div>
                    <div className="stat-label">Vergleichbare Ernten</div>
                  </div>
                </>
              )}
              
              {est.similarHarvests === 0 && (
                <div className="stat-item large">
                  <div className="stat-value">-</div>
                  <div className="stat-label">Keine historischen Daten für {est.plant.strain || 'diesen Strain'}</div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <div className="empty-state">
            <p>Keine aktiven Pflanzen vorhanden</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>ℹ️ Wie funktioniert die Prognose?</h3>
        <ul className="info-list">
          <li>Die Prognose basiert auf historischen Ernten mit demselben Strain</li>
          <li>Je mehr vergleichbare Ernten, desto genauer die Schätzung</li>
          <li>Der Wachstumsfortschritt wird berücksichtigt (20% → 60% → 80% → 100%)</li>
          <li>Ohne historische Daten ist keine Prognose möglich</li>
        </ul>
      </div>
    </div>
  );
}
