import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { differenceInDays, parseISO } from 'date-fns';

export default function StatisticsPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const harvests = useLiveQuery(() => db.harvests.toArray(), []);
  const costs = useLiveQuery(() => db.costs.toArray(), []);
  const logs = useLiveQuery(() => db.logs.toArray(), []);

  if (!plants || !harvests || !costs || !logs) return null;

  // Total stats
  const totalPlants = plants.length;
  const activePlants = plants.filter(p => !p.archived).length;
  const totalHarvests = harvests.length;
  const totalDryWeight = harvests.reduce((sum, h) => sum + (h.dryWeightG || 0), 0);
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const avgYieldPerPlant = totalHarvests > 0 ? totalDryWeight / totalHarvests : 0;
  const costPerGram = totalDryWeight > 0 ? totalCosts / totalDryWeight : 0;

  // Yield by strain
  const yieldByStrain = harvests.reduce((acc, h) => {
    const plant = plants.find(p => p.id === h.plantId);
    const strain = plant?.strain || 'Unbekannt';
    if (!acc[strain]) {
      acc[strain] = { total: 0, count: 0 };
    }
    acc[strain].total += h.dryWeightG || 0;
    acc[strain].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const strainRanking = Object.entries(yieldByStrain)
    .map(([strain, data]) => ({
      strain,
      avgYield: data.total / data.count,
      totalYield: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.avgYield - a.avgYield);

  // Growth duration stats
  const growthDurations = plants
    .filter(p => p.harvestDate)
    .map(p => differenceInDays(parseISO(p.harvestDate!), parseISO(p.startDate)));
  
  const avgGrowthDuration = growthDurations.length > 0
    ? growthDurations.reduce((sum, d) => sum + d, 0) / growthDurations.length
    : 0;

  // Monthly harvests
  const monthlyHarvests = harvests.reduce((acc, h) => {
    const month = h.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = 0;
    acc[month] += h.dryWeightG || 0;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyHarvests)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6);

  const maxMonthly = Math.max(...monthlyData.map(([, v]) => v), 1);

  return (
    <div className="page">
      <h1>📊 Statistiken</h1>

      <div className="card">
        <h3>🌱 Pflanzen</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{totalPlants}</div>
            <div className="stat-label">Gesamt</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{activePlants}</div>
            <div className="stat-label">Aktiv</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{avgGrowthDuration > 0 ? Math.round(avgGrowthDuration) : '-'}</div>
            <div className="stat-label">⌀ Tage (Keimung→Ernte)</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>🌾 Erträge</h3>
        <div className="stats-grid">
          <div className="stat-item large">
            <div className="stat-value">{totalDryWeight > 0 ? `${(totalDryWeight / 1000).toFixed(2)}kg` : '-'}</div>
            <div className="stat-label">Gesamtertrag (trocken)</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalHarvests}</div>
            <div className="stat-label">Ernten</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{avgYieldPerPlant > 0 ? `${Math.round(avgYieldPerPlant)}g` : '-'}</div>
            <div className="stat-label">⌀ pro Pflanze</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>💰 Kosten</h3>
        <div className="stats-grid">
          <div className="stat-item large">
            <div className="stat-value">{totalCosts.toFixed(2)} €</div>
            <div className="stat-label">Gesamtkosten</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{costPerGram > 0 ? `${costPerGram.toFixed(2)} €` : '-'}</div>
            <div className="stat-label">Kosten pro Gramm</div>
          </div>
        </div>
      </div>

      {monthlyData.length > 0 && (
        <div className="card">
          <h3>📈 Monatliche Erträge (letzte 6 Monate)</h3>
          <div className="chart-container">
            {monthlyData.map(([month, weight]) => (
              <div key={month} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${(weight / maxMonthly) * 100}%` }}
                  >
                    <div className="chart-bar-value">{weight}g</div>
                  </div>
                </div>
                <div className="chart-label">{month.substring(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {strainRanking.length > 0 && (
        <div className="card">
          <h3>🏆 Strain-Ranking (nach Ertrag)</h3>
          <div className="strain-ranking">
            {strainRanking.map((item, idx) => (
              <div key={item.strain} className="rank-item">
                <div className="rank-number">#{idx + 1}</div>
                <div className="rank-info">
                  <span className="rank-name">{item.strain}</span>
                  <span className="rank-details">
                    ⌀ {Math.round(item.avgYield)}g · {item.count}x geerntet · Gesamt: {item.totalYield}g
                  </span>
                </div>
                <div className="rank-yield">{Math.round(item.avgYield)}g</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalHarvests === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>Noch keine Ernten vorhanden. Statistiken werden nach der ersten Ernte angezeigt.</p>
          </div>
        </div>
      )}
    </div>
  );
}
