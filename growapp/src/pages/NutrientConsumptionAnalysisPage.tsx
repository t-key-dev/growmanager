import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function NutrientConsumptionAnalysisPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const fertilizations = useLiveQuery(() => db.fertilizations.toArray(), []);
  const fertilizers = useLiveQuery(() => db.fertilizers.toArray(), []);

  if (!plants || !fertilizations || !fertilizers) return null;

  // Berechne Verbrauch pro Dünger
  const fertilizerConsumption = fertilizers.map(fert => {
    const usage = fertilizations.filter(f => f.fertilizerId === fert.id);
    const totalMl = usage.reduce((sum, f) => sum + (f.amountMl || 0), 0);
    const totalLiters = usage.reduce((sum, f) => sum + (f.waterLiters || 0), 0);
    const avgDose = usage.length > 0 ? totalMl / usage.length : 0;
    
    return {
      fertilizer: fert,
      totalMl,
      totalLiters,
      usageCount: usage.length,
      avgDose: avgDose.toFixed(2),
      remaining: (fert.volumeMl || 0) - totalMl,
    };
  });

  // Verbrauch pro Pflanze
  const plantConsumption = plants.map(plant => {
    const plantFertilizations = fertilizations.filter(f => f.plantId === plant.id);
    const totalMl = plantFertilizations.reduce((sum, f) => sum + (f.amountMl || 0), 0);
    const totalLiters = plantFertilizations.reduce((sum, f) => sum + (f.waterLiters || 0), 0);
    
    return {
      plant,
      totalMl,
      totalLiters,
      fertilizationCount: plantFertilizations.length,
      avgDose: plantFertilizations.length > 0 ? (totalMl / plantFertilizations.length).toFixed(2) : '0',
    };
  });

  // Verbrauch nach Wachstumsphase
  const phaseConsumption = fertilizations.reduce((acc, fert) => {
    const phase = fert.growthPhase || 'unknown';
    if (!acc[phase]) {
      acc[phase] = { count: 0, totalMl: 0, totalLiters: 0 };
    }
    acc[phase].count++;
    acc[phase].totalMl += fert.amountMl || 0;
    acc[phase].totalLiters += fert.waterLiters || 0;
    return acc;
  }, {} as Record<string, { count: number; totalMl: number; totalLiters: number }>);

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'seedling': return '🌱 Keimling';
      case 'vegetative': return '🌿 Vegetation';
      case 'flowering': return '🌸 Blüte';
      case 'ripening': return '🍂 Reifung';
      default: return phase;
    }
  };

  return (
    <div className="page">
      <h1>🧪 Nährstoffverbrauch-Analyse</h1>
      <p className="subtitle">Welche Dünger werden wann verbraucht?</p>

      <div className="card">
        <h3>Verbrauch pro Dünger</h3>
        <div className="fertilizer-consumption">
          {fertilizerConsumption.map(({ fertilizer, totalMl, totalLiters, usageCount, avgDose, remaining }) => (
            <div key={fertilizer.id} className="consumption-item">
              <div className="consumption-header">
                <strong>{fertilizer.name}</strong>
                <span className="brand">{fertilizer.brand}</span>
              </div>
              <div className="consumption-stats">
                <div className="stat">
                  <span className="label">Verbraucht:</span>
                  <span className="value">{totalMl.toFixed(0)} ml</span>
                </div>
                <div className="stat">
                  <span className="label">Wasser:</span>
                  <span className="value">{totalLiters.toFixed(1)} L</span>
                </div>
                <div className="stat">
                  <span className="label">Ø Dosis:</span>
                  <span className="value">{avgDose} ml</span>
                </div>
                <div className="stat">
                  <span className="label">Anwendungen:</span>
                  <span className="value">{usageCount}x</span>
                </div>
              </div>
              <div className="consumption-bar">
                <div className="bar-label">
                  Verbleibend: {remaining.toFixed(0)} ml / {fertilizer.volumeMl || 0} ml
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ width: `${((fertilizer.volumeMl || 0) - totalMl) / (fertilizer.volumeMl || 1) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Verbrauch pro Pflanze</h3>
        <div className="plant-consumption">
          {plantConsumption.map(({ plant, totalMl, totalLiters, fertilizationCount, avgDose }) => (
            <div key={plant.id} className="plant-item">
              <div className="plant-header">
                <strong>{plant.name}</strong>
                {plant.strain && <span className="strain-tag">{plant.strain}</span>}
              </div>
              <div className="plant-stats">
                <div className="stat">
                  <span className="label">Gesamt:</span>
                  <span className="value">{totalMl.toFixed(0)} ml</span>
                </div>
                <div className="stat">
                  <span className="label">Wasser:</span>
                  <span className="value">{totalLiters.toFixed(1)} L</span>
                </div>
                <div className="stat">
                  <span className="label">Ø Dosis:</span>
                  <span className="value">{avgDose} ml</span>
                </div>
                <div className="stat">
                  <span className="label">Düngungen:</span>
                  <span className="value">{fertilizationCount}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Verbrauch nach Wachstumsphase</h3>
        <div className="phase-consumption">
          {Object.entries(phaseConsumption).map(([phase, data]) => (
            <div key={phase} className="phase-item">
              <div className="phase-header">
                <span className="phase-label">{getPhaseLabel(phase)}</span>
                <span className="phase-count">{data.count} Düngungen</span>
              </div>
              <div className="phase-stats">
                <div className="stat">
                  <span className="label">Dünger:</span>
                  <span className="value">{data.totalMl.toFixed(0)} ml</span>
                </div>
                <div className="stat">
                  <span className="label">Wasser:</span>
                  <span className="value">{data.totalLiters.toFixed(1)} L</span>
                </div>
                <div className="stat">
                  <span className="label">Ø pro Düngung:</span>
                  <span className="value">{(data.totalMl / data.count).toFixed(2)} ml</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>💡 Optimierungstipps</h3>
        <ul className="tips-list">
          <li>Passe Düngerdosis an Wachstumsphase an</li>
          <li>Überdüngung vermeiden - weniger ist oft mehr</li>
          <li>Regelmäßig EC-Wert messen und anpassen</li>
          <li>Dünger nach Herstellerempfehlung dosieren</li>
        </ul>
      </div>
    </div>
  );
}
