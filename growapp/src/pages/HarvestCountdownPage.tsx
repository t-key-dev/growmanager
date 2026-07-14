import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { differenceInDays, parseISO } from 'date-fns';

export default function HarvestCountdownPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const strains = useLiveQuery(() => db.strains.toArray(), []);

  if (!plants || !strains) return null;

  const activePlants = plants.filter(p => !p.archived && (!p.status || p.status === 'growing' || p.status === 'flowering'));

  const getCountdown = (plant: any) => {
    const strain = strains.find(s => s.name === plant.strain);
    if (!strain || !plant.startDate) return null;

    const startDate = parseISO(plant.startDate);
    const today = new Date();
    const daysSinceStart = differenceInDays(today, startDate);
    
    // Geschätzte Blütezeit basierend auf Strain
    const floweringDays = strain.floweringDays || 56; // Default 8 Wochen
    const vegetativeDays = 30; // Annahme: 4 Wochen Vegetation
    const totalDays = vegetativeDays + floweringDays;
    
    const daysUntilHarvest = totalDays - daysSinceStart;
    const progress = Math.min(100, (daysSinceStart / totalDays) * 100);
    
    return {
      daysUntilHarvest,
      progress,
      daysSinceStart,
      totalDays,
      estimatedHarvestDate: new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000),
    };
  };

  return (
    <div className="page">
      <h1>⏰ Ernte-Countdown</h1>
      <p className="subtitle">Visueller Countdown bis zur erwarteten Ernte</p>

      {activePlants.length > 0 ? (
        activePlants.map(plant => {
          const countdown = getCountdown(plant);
          
          if (!countdown) return null;

          return (
            <div key={plant.id} className="card">
              <div className="countdown-header">
                <h3>{plant.name}</h3>
                {plant.strain && <span className="strain-tag">{plant.strain}</span>}
              </div>

              <div className="countdown-display">
                <div className="countdown-number">
                  {countdown.daysUntilHarvest > 0 ? (
                    <>
                      <span className="number">{countdown.daysUntilHarvest}</span>
                      <span className="label">Tage bis zur Ernte</span>
                    </>
                  ) : (
                    <>
                      <span className="number">🌾</span>
                      <span className="label">Erntereif!</span>
                    </>
                  )}
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${countdown.progress}%` }}
                />
              </div>
              <div className="progress-label">
                {countdown.progress.toFixed(1)}% abgeschlossen
              </div>

              <div className="countdown-details">
                <div className="detail">
                  <span className="label">Start:</span>
                  <span className="value">
                    {new Date(plant.startDate).toLocaleDateString('de-DE')}
                  </span>
                </div>
                <div className="detail">
                  <span className="label">Vergangen:</span>
                  <span className="value">{countdown.daysSinceStart} Tage</span>
                </div>
                <div className="detail">
                  <span className="label">Geschätzte Ernte:</span>
                  <span className="value">
                    {countdown.estimatedHarvestDate.toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>

              {countdown.daysUntilHarvest <= 7 && countdown.daysUntilHarvest > 0 && (
                <div className="countdown-warning">
                  ⚠️ Ernte nähert sich! Beginne mit der Spülung.
                </div>
              )}

              {countdown.daysUntilHarvest <= 0 && (
                <div className="countdown-ready">
                  🎉 Die Pflanze ist bereit für die Ernte!
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="card">
          <div className="empty-state">
            <p>Keine aktiven Pflanzen vorhanden</p>
            <p>Ernte-Countdown wird für wachsende Pflanzen angezeigt</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>💡 Ernte-Tipps</h3>
        <ul className="tips-list">
          <li>Beobachte die Trichome mit einer Lupe</li>
          <li>Ernte wenn 70-80% der Trichome milchig/bernsteinfarben sind</li>
          <li>Spüle 7-14 Tage vor der Ernte mit reinem Wasser</li>
          <li>Ernte morgens für maximale Terpen-Produktion</li>
        </ul>
      </div>
    </div>
  );
}
