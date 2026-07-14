import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast?: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    description: string;
    icon: string;
  }>;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          // Fallback to Berlin
          setLocation({ lat: 52.52, lon: 13.41 });
        }
      );
    } else {
      setLocation({ lat: 52.52, lon: 13.41 });
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7`
        );

        if (!response.ok) throw new Error('Weather API error');

        const data = await response.json();

        const weatherCodeToDescription = (code: number): string => {
          const codes: Record<number, string> = {
            0: 'Klar',
            1: 'Überwiegend klar',
            2: 'Teilweise bewölkt',
            3: 'Bewölkt',
            45: 'Nebel',
            48: 'Nebel',
            51: 'Leichter Nieselregen',
            53: 'Nieselregen',
            55: 'Starker Nieselregen',
            61: 'Leichter Regen',
            63: 'Regen',
            65: 'Starker Regen',
            71: 'Leichter Schneefall',
            73: 'Schneefall',
            75: 'Starker Schneefall',
            80: 'Leichte Schauer',
            81: 'Schauer',
            82: 'Starke Schauer',
            95: 'Gewitter',
            96: 'Gewitter mit Hagel',
            99: 'Starkes Gewitter',
          };
          return codes[code] || 'Unbekannt';
        };

        const weatherCodeToIcon = (code: number): string => {
          if (code === 0) return '☀️';
          if (code <= 2) return '⛅';
          if (code === 3) return '☁️';
          if (code <= 48) return '🌫️';
          if (code <= 67) return '🌧️';
          if (code <= 77) return '🌨️';
          if (code <= 82) return '🌦️';
          return '⛈️';
        };

        const currentWeather: WeatherData = {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          description: weatherCodeToDescription(data.current.weather_code),
          icon: weatherCodeToIcon(data.current.weather_code),
          forecast: data.daily.time.map((date: string, i: number) => ({
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            precipitation: data.daily.precipitation_sum[i],
            description: weatherCodeToDescription(data.daily.weather_code[i]),
            icon: weatherCodeToIcon(data.daily.weather_code[i]),
          })),
        };

        setWeather(currentWeather);
        setError(null);
      } catch (err) {
        setError('Fehler beim Laden der Wetterdaten');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getGrowAdvice = (weather: WeatherData): string[] => {
    const advice: string[] = [];

    if (weather.temperature > 30) {
      advice.push('⚠️ Sehr heiß! Lüftung intensivieren und Pflanzen beschatten.');
    } else if (weather.temperature > 28) {
      advice.push('🌡️ Warm - Lüftung prüfen und ggf. erhöhen.');
    } else if (weather.temperature < 18) {
      advice.push('🥶 Kühl - Heizung prüfen oder Pflanzen wärmer stellen.');
    }

    if (weather.humidity > 70) {
      advice.push('💧 Hohe Luftfeuchtigkeit - Entfeuchter einsetzen, Schimmelgefahr!');
    } else if (weather.humidity < 40) {
      advice.push('🏜️ Niedrige Luftfeuchtigkeit - Befeuchter einsetzen.');
    }

    if (weather.windSpeed > 30) {
      advice.push('💨 Starker Wind - Pflanzen schützen und Fenster schließen.');
    }

    if (weather.forecast) {
      const nextRain = weather.forecast.find(f => f.precipitation > 5);
      if (nextRain) {
        const daysUntil = Math.ceil((new Date(nextRain.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 2) {
          advice.push(`🌧️ Regen in ${daysUntil} Tag${daysUntil === 1 ? '' : 'en'} erwartet - Outdoor-Pflanzen schützen.`);
        }
      }
    }

    if (advice.length === 0) {
      advice.push('✅ Gute Bedingungen für den Grow!');
    }

    return advice;
  };

  if (loading) {
    return (
      <div className="page">
        <h1>🌤️ Wetter</h1>
        <div className="card">
          <p>Lade Wetterdaten...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="page">
        <h1>🌤️ Wetter</h1>
        <div className="card">
          <p className="error">{error || 'Keine Daten verfügbar'}</p>
        </div>
      </div>
    );
  }

  const advice = getGrowAdvice(weather);

  return (
    <div className="page">
      <h1>🌤️ Wetter</h1>

      <div className="card weather-current">
        <div className="weather-icon">{weather.icon}</div>
        <div className="weather-info">
          <div className="weather-temp">{weather.temperature}°C</div>
          <div className="weather-desc">{weather.description}</div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span className="label">Luftfeuchtigkeit</span>
            <span className="value">{weather.humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="label">Wind</span>
            <span className="value">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>💡 Grow-Empfehlungen</h3>
        <ul className="advice-list">
          {advice.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {weather.forecast && (
        <div className="card">
          <h3>📅 7-Tage-Vorhersage</h3>
          <div className="forecast-list">
            {weather.forecast.map((day, i) => (
              <div key={i} className="forecast-item">
                <div className="forecast-date">
                  {new Date(day.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                </div>
                <div className="forecast-icon">{day.icon}</div>
                <div className="forecast-temp">
                  <span className="temp-max">{day.tempMax}°</span>
                  <span className="temp-min">{day.tempMin}°</span>
                </div>
                <div className="forecast-rain">
                  {day.precipitation > 0 ? `${day.precipitation}mm` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3>ℹ️ Optimale Grow-Bedingungen</h3>
        <ul className="info-list">
          <li>Temperatur: 20-28°C (Tag), 18-24°C (Nacht)</li>
          <li>Luftfeuchtigkeit: 40-60% (Vegetation), 40-50% (Blüte)</li>
          <li>Wind: Sanfte Brise stärkt die Pflanzen</li>
          <li>Regen: Outdoor-Pflanzen vor starkem Regen schützen</li>
        </ul>
      </div>
    </div>
  );
}
