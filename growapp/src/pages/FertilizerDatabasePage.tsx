import { useState } from 'react';

interface FertilizerProduct {
  id: number;
  name: string;
  brand: string;
  type: 'grow' | 'bloom' | 'micro' | 'additive';
  npk: { n: number; p: number; k: number };
  price: number;
  volume: number; // ml
  notes?: string;
}

const fertilizerDatabase: FertilizerProduct[] = [
  {
    id: 1,
    name: 'Terra Aquatica TriPart Grow',
    brand: 'Terra Aquatica',
    type: 'grow',
    npk: { n: 5, p: 0, k: 8 },
    price: 12.99,
    volume: 500,
    notes: 'Beliebter 3-Teile-Dünger',
  },
  {
    id: 2,
    name: 'Terra Aquatica TriPart Micro',
    brand: 'Terra Aquatica',
    type: 'micro',
    npk: { n: 5, p: 3, k: 5 },
    price: 12.99,
    volume: 500,
  },
  {
    id: 3,
    name: 'Terra Aquatica TriPart Bloom',
    brand: 'Terra Aquatica',
    type: 'bloom',
    npk: { n: 1, p: 4, k: 5 },
    price: 12.99,
    volume: 500,
  },
  {
    id: 4,
    name: 'Advanced Nutrients Big Bud',
    brand: 'Advanced Nutrients',
    type: 'bloom',
    npk: { n: 0, p: 1, k: 2 },
    price: 24.99,
    volume: 1000,
    notes: 'Blüten-Booster',
  },
  {
    id: 5,
    name: 'Canna Terra Professional Plus',
    brand: 'Canna',
    type: 'grow',
    npk: { n: 7, p: 3, k: 5 },
    price: 15.99,
    volume: 1000,
    notes: 'Kompletter Erde-Dünger',
  },
  {
    id: 6,
    name: 'Biobizz Bio-Grow',
    brand: 'Biobizz',
    type: 'grow',
    npk: { n: 4, p: 3, k: 6 },
    price: 9.99,
    volume: 500,
    notes: 'Organischer Dünger',
  },
  {
    id: 7,
    name: 'Biobizz Bio-Bloom',
    brand: 'Biobizz',
    type: 'bloom',
    npk: { n: 2, p: 7, k: 4 },
    price: 9.99,
    volume: 500,
  },
  {
    id: 8,
    name: 'General Hydroponics FloraSeries Micro',
    brand: 'General Hydroponics',
    type: 'micro',
    npk: { n: 5, p: 0, k: 1 },
    price: 14.99,
    volume: 500,
  },
];

export default function FertilizerDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'npk'>('name');

  const filteredFertilizers = fertilizerDatabase
    .filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           f.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || f.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'npk') return (b.npk.n + b.npk.p + b.npk.k) - (a.npk.n + a.npk.p + a.npk.k);
      return a.name.localeCompare(b.name);
    });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'grow': return '🌱 Vegetation';
      case 'bloom': return '🌸 Blüte';
      case 'micro': return '🔬 Mikro';
      case 'additive': return '✨ Additiv';
      default: return type;
    }
  };

  return (
    <div className="page">
      <h1>🧪 Dünger-Datenbank</h1>
      <p className="subtitle">Vergleiche Nährwerttabellen für gängige Dünger</p>

      <div className="card">
        <input
          type="text"
          placeholder="Suche nach Dünger oder Marke..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="filter-row">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">Alle Typen</option>
            <option value="grow">Vegetation</option>
            <option value="bloom">Blüte</option>
            <option value="micro">Mikro</option>
            <option value="additive">Additiv</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="name">Sortieren: Name</option>
            <option value="price">Sortieren: Preis</option>
            <option value="npk">Sortieren: NPK</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h3>{filteredFertilizers.length} Dünger gefunden</h3>
        <div className="fertilizer-list">
          {filteredFertilizers.map(fert => (
            <div key={fert.id} className="fertilizer-card">
              <div className="fertilizer-header">
                <strong>{fert.name}</strong>
                <span className="fertilizer-type">{getTypeLabel(fert.type)}</span>
              </div>
              <div className="fertilizer-brand">{fert.brand}</div>
              
              <div className="npk-display">
                <div className="npk-bar">
                  <div className="npk-segment n" style={{ width: `${fert.npk.n * 10}%` }}>
                    N: {fert.npk.n}
                  </div>
                  <div className="npk-segment p" style={{ width: `${fert.npk.p * 10}%` }}>
                    P: {fert.npk.p}
                  </div>
                  <div className="npk-segment k" style={{ width: `${fert.npk.k * 10}%` }}>
                    K: {fert.npk.k}
                  </div>
                </div>
              </div>

              <div className="fertilizer-details">
                <span className="price">{fert.price.toFixed(2)} €</span>
                <span className="volume">{fert.volume} ml</span>
                <span className="price-per-ml">
                  {(fert.price / fert.volume * 1000).toFixed(2)} €/L
                </span>
              </div>

              {fert.notes && (
                <div className="fertilizer-notes">{fert.notes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>💡 NPK-Erklärung</h3>
        <div className="info-box">
          <ul>
            <li><strong>N (Stickstoff):</strong> Wichtig für Blattwachstum</li>
            <li><strong>P (Phosphor):</strong> Wichtig für Wurzel- und Blütenbildung</li>
            <li><strong>K (Kalium):</strong> Wichtig für allgemeine Pflanzengesundheit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
