import { useState } from 'react';

export default function SensorIntegrationPage() {
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Temperatur', value: 24.5, unit: '°C', min: 18, max: 28 },
    { id: 2, name: 'Luftfeuchtigkeit', value: 65, unit: '%', min: 40, max: 70 },
    { id: 3, name: 'Bodenfeuchtigkeit', value: 45, unit: '%', min: 30, max: 60 },
    { id: 4, name: 'EC-Wert', value: 1.2, unit: 'mS/cm', min: 0.8, max: 1.8 },
    { id: 5, name: 'pH-Wert', value: 6.2, unit: '', min: 5.8, max: 6.8 },
  ]);

  const getStatus = (sensor: typeof sensors[0]) => {
    if (sensor.value < sensor.min) return { status: 'low', icon: '⚠️', color: '#f59e0b' };
    if (sensor.value > sensor.max) return { status: 'high', icon: '⚠️', color: '#ef4444' };
    return { status: 'ok', icon: '✅', color: '#10b981' };
  };

  const updateSensorValue = (id: number, value: number) => {
    setSensors(sensors.map(s => s.id === id ? { ...s, value } : s));
  };

  return (
    <div className="page">
      <h1>📡 Sensor-Integration</h1>
      <p className="subtitle">Überwache deine Grow-Umgebung in Echtzeit</p>

      <div className="card">
        <h3>Aktuelle Sensorwerte</h3>
        <div className="sensor-grid">
          {sensors.map(sensor => {
            const { icon, color } = getStatus(sensor);
            const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
            
            return (
              <div key={sensor.id} className="sensor-card">
                <div className="sensor-header">
                  <span className="sensor-name">{sensor.name}</span>
                  <span className="sensor-icon">{icon}</span>
                </div>
                <div className="sensor-value" style={{ color }}>
                  {sensor.value} {sensor.unit}
                </div>
                <div className="sensor-bar">
                  <div 
                    className="sensor-bar-fill" 
                    style={{ 
                      width: `${Math.max(0, Math.min(100, percentage))}%`,
                      backgroundColor: color 
                    }}
                  />
                </div>
                <div className="sensor-range">
                  {sensor.min} - {sensor.max} {sensor.unit}
                </div>
                <input
                  type="range"
                  min={sensor.min * 0.5}
                  max={sensor.max * 1.5}
                  step="0.1"
                  value={sensor.value}
                  onChange={e => updateSensorValue(sensor.id, parseFloat(e.target.value))}
                  className="sensor-slider"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3>Bluetooth-Sensoren verbinden</h3>
        <div className="info-box">
          <strong>📱 Unterstützte Sensoren:</strong>
          <ul>
            <li>Xiaomi Mi Flora</li>
            <li>Blumat Tropfenzähler</li>
            <li>Atlas Scientific EZO</li>
            <li>Airthings Wave Plus</li>
          </ul>
          <p style={{ marginTop: '1rem' }}>
            <strong>Hinweis:</strong> Bluetooth-Verbindung erfordert Browser-Unterstützung 
            und Berechtigungen. Funktioniert am besten auf Android mit Chrome.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Alarm-Einstellungen</h3>
        <div className="checkbox-list">
          <label>
            <input type="checkbox" defaultChecked />
            Benachrichtigung bei kritischen Werten
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Täglicher Zusammenfassungs-Bericht
          </label>
          <label>
            <input type="checkbox" />
            Wöchentliche Statistiken
          </label>
        </div>
      </div>
    </div>
  );
}
