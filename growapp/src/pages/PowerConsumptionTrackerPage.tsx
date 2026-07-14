import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function PowerConsumptionTrackerPage() {
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  const [selectedTentId, setSelectedTentId] = useState<number | null>(null);
  
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Grow Light', wattage: 400, hoursPerDay: 18 },
    { id: 2, name: 'Ventilation Fan', wattage: 80, hoursPerDay: 24 },
    { id: 3, name: 'Carbon Filter', wattage: 30, hoursPerDay: 24 },
    { id: 4, name: 'Humidifier', wattage: 50, hoursPerDay: 12 },
    { id: 5, name: 'Dehumidifier', wattage: 150, hoursPerDay: 8 },
  ]);

  const electricityPrice = 0.35; // €/kWh

  const selectedTent = tents?.find(t => t.id === selectedTentId);
  void selectedTent; // Reserved for future tent-specific calculations

  const totalDailyWattHours = equipment.reduce((sum, e) => {
    return sum + (e.wattage * e.hoursPerDay);
  }, 0);

  const dailyKWh = totalDailyWattHours / 1000;
  const monthlyKWh = dailyKWh * 30;
  const dailyCost = dailyKWh * electricityPrice;
  const monthlyCost = monthlyKWh * electricityPrice;
  const yearlyCost = monthlyCost * 12;

  const addEquipment = () => {
    const newId = Math.max(...equipment.map(e => e.id), 0) + 1;
    setEquipment([...equipment, { id: newId, name: 'Neues Gerät', wattage: 100, hoursPerDay: 12 }]);
  };

  const removeEquipment = (id: number) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  const updateEquipment = (id: number, field: string, value: string | number) => {
    setEquipment(equipment.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  return (
    <div className="page">
      <h1>⚡ Stromverbrauchs-Tracker</h1>
      <p className="subtitle">Energiekosten pro Zelt berechnen</p>

      <div className="card">
        <h3>Zelt auswählen (optional)</h3>
        <select
          value={selectedTentId || ''}
          onChange={e => setSelectedTentId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Alle Zelte</option>
          {tents?.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <h3>Geräte</h3>
        {equipment.map(device => (
          <div key={device.id} className="equipment-item">
            <div className="equipment-header">
              <input
                type="text"
                value={device.name}
                onChange={e => updateEquipment(device.id, 'name', e.target.value)}
                className="equipment-name"
              />
              <button 
                className="btn-icon danger" 
                onClick={() => removeEquipment(device.id)}
              >
                ✕
              </button>
            </div>
            <div className="equipment-details">
              <div className="input-group">
                <label>Watt</label>
                <input
                  type="number"
                  value={device.wattage}
                  onChange={e => updateEquipment(device.id, 'wattage', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Std/Tag</label>
                <input
                  type="number"
                  value={device.hoursPerDay}
                  onChange={e => updateEquipment(device.id, 'hoursPerDay', parseInt(e.target.value) || 0)}
                  min="0"
                  max="24"
                />
              </div>
            </div>
            <div className="equipment-consumption">
              {((device.wattage * device.hoursPerDay) / 1000).toFixed(2)} kWh/Tag
            </div>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={addEquipment}>
          + Gerät hinzufügen
        </button>
      </div>

      <div className="card">
        <h3>Strompreis (€/kWh)</h3>
        <input
          type="number"
          step="0.01"
          value={electricityPrice}
          onChange={() => {/* This would need state management */}}
          className="price-input"
        />
      </div>

      <div className="card result-card">
        <h3>Verbrauchsübersicht</h3>
        <div className="result">
          <div className="result-item">
            <span className="label">Täglicher Verbrauch:</span>
            <span className="value">{dailyKWh.toFixed(2)} kWh</span>
          </div>
          <div className="result-item">
            <span className="label">Monatlicher Verbrauch:</span>
            <span className="value">{monthlyKWh.toFixed(1)} kWh</span>
          </div>
          <div className="result-divider"></div>
          <div className="result-item">
            <span className="label">Tägliche Kosten:</span>
            <span className="value">{dailyCost.toFixed(2)} €</span>
          </div>
          <div className="result-item">
            <span className="label">Monatliche Kosten:</span>
            <span className="value highlight">{monthlyCost.toFixed(2)} €</span>
          </div>
          <div className="result-item">
            <span className="label">Jährliche Kosten:</span>
            <span className="value">{yearlyCost.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>💡 Energiespar-Tipps</h3>
        <ul className="tips-list">
          <li>Nutze LED-Beleuchtung statt HPS (bis zu 60% Ersparnis)</li>
          <li>Verwende Zeitschaltuhren für optimale Lichtzyklen</li>
          <li>Optimiere Belüftung für effizienteren Luftaustausch</li>
          <li>Nutze energieeffiziente Geräte (A++ Klasse)</li>
        </ul>
      </div>
    </div>
  );
}
