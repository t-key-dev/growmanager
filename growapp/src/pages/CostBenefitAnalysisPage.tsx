import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function CostBenefitAnalysisPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const costs = useLiveQuery(() => db.costs.toArray(), []);
  const harvests = useLiveQuery(() => db.harvests.toArray(), []);

  if (!plants || !costs || !harvests) return null;

  // Berechne Gesamtkosten
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  
  // Berechne Gesamtertrag
  const totalHarvest = harvests.reduce((sum, h) => sum + (h.dryWeightG || 0), 0);
  
  // Berechne ROI
  const marketPricePerGram = 8; // Durchschnittlicher Marktpreis pro Gramm
  const totalRevenue = totalHarvest * marketPricePerGram;
  const profit = totalRevenue - totalCosts;
  const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : 0;

  // Kosten pro Pflanze
  const plantCosts = plants.map(plant => {
    const plantCosts = costs
      .filter(c => c.plantId === plant.id)
      .reduce((sum, c) => sum + c.amount, 0);
    
    const plantHarvest = harvests.find(h => h.plantId === plant.id);
    const yield_ = plantHarvest?.dryWeightG || 0;
    const revenue = yield_ * marketPricePerGram;
    const plantProfit = revenue - plantCosts;
    
    return {
      plant,
      costs: plantCosts,
      yield: yield_,
      revenue,
      profit: plantProfit,
      roi: plantCosts > 0 ? (plantProfit / plantCosts) * 100 : 0,
    };
  });

  // Kosten nach Kategorie
  const costsByCategory = costs.reduce((acc, cost) => {
    if (!acc[cost.category]) {
      acc[cost.category] = 0;
    }
    acc[cost.category] += cost.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="page">
      <h1>💰 Kosten-Nutzen-Analyse</h1>
      <p className="subtitle">ROI-Berechnung pro Strain und Pflanze</p>

      <div className="card">
        <h3>Gesamtübersicht</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-value">{totalCosts.toFixed(2)} €</span>
            <span className="stat-label">Gesamtkosten</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{totalHarvest} g</span>
            <span className="stat-label">Gesamtertrag</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{totalRevenue.toFixed(2)} €</span>
            <span className="stat-label">Geschätzter Wert</span>
          </div>
          <div className="stat-box">
            <span className={`stat-value ${profit >= 0 ? 'positive' : 'negative'}`}>
              {profit.toFixed(2)} €
            </span>
            <span className="stat-label">Gewinn/Verlust</span>
          </div>
          <div className="stat-box large">
            <span className={`stat-value ${roi >= 0 ? 'positive' : 'negative'}`}>
              {roi.toFixed(1)}%
            </span>
            <span className="stat-label">ROI (Return on Investment)</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Kosten nach Kategorie</h3>
        <div className="category-breakdown">
          {Object.entries(costsByCategory).map(([category, amount]) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <div className="category-bar">
                <div 
                  className="category-fill"
                  style={{ width: `${(amount / totalCosts) * 100}%` }}
                />
              </div>
              <span className="category-amount">{amount.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Analyse pro Pflanze</h3>
        <div className="plant-analysis">
          {plantCosts.map(({ plant, costs, yield: plantYield, revenue, profit, roi }) => (
            <div key={plant.id} className="plant-analysis-item">
              <div className="plant-header">
                <strong>{plant.name}</strong>
                {plant.strain && <span className="strain-tag">{plant.strain}</span>}
              </div>
              <div className="plant-stats">
                <div className="stat">
                  <span className="label">Kosten:</span>
                  <span className="value">{costs.toFixed(2)} €</span>
                </div>
                <div className="stat">
                  <span className="label">Ertrag:</span>
                  <span className="value">{plantYield} g</span>
                </div>
                <div className="stat">
                  <span className="label">Wert:</span>
                  <span className="value">{revenue.toFixed(2)} €</span>
                </div>
                <div className="stat">
                  <span className="label">Gewinn:</span>
                  <span className={`value ${profit >= 0 ? 'positive' : 'negative'}`}>
                    {profit.toFixed(2)} €
                  </span>
                </div>
                <div className="stat">
                  <span className="label">ROI:</span>
                  <span className={`value ${roi >= 0 ? 'positive' : 'negative'}`}>
                    {roi.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>💡 Optimierungstipps</h3>
        <ul className="tips-list">
          <li>Reduziere Stromkosten durch effizientere Beleuchtung</li>
          <li>Optimiere Düngemitteleinsatz basierend auf Pflanzenbedarf</li>
          <li>Fokussiere dich auf Strains mit hohem ROI</li>
          <li>Verbessere Erträge durch optimierte Umweltbedingungen</li>
        </ul>
      </div>
    </div>
  );
}
