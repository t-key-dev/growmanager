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
  useCase?: string; // Wofür wird er genutzt?
  problems?: string[]; // Gegen welche Probleme hilft er?
}

const fertilizerDatabase: FertilizerProduct[] = [
  // Plagron Terra-Serie (100% TERRA - mineralisch)
  {
    id: 100,
    name: 'Plagron Terra Grow',
    brand: 'Plagron',
    type: 'grow',
    npk: { n: 3, p: 1, k: 3 },
    price: 14.99,
    volume: 1000,
    notes: 'Mineralischer Basisdünger für die Wachstumsphase',
    useCase: 'Basisdünger für Erde. Versorgung während der gesamten Wachstumsphase. Für alle Erdmischungen geeignet.',
    problems: [
      'Stickstoffmangel (gelbe Blätter)',
      'Kümmerschaft im Vegi',
      'Langsames Wachstum'
    ],
  },
  {
    id: 101,
    name: 'Plagron Terra Bloom',
    brand: 'Plagron',
    type: 'bloom',
    npk: { n: 2, p: 2, k: 4 },
    price: 14.99,
    volume: 1000,
    notes: 'Mineralischer Basisdünger für die Blütephase',
    useCase: 'Basisdünger für Erde. Versorgung während der gesamten Blütephase. Bildet die Grundlage für schwere Blüten.',
    problems: [
      'Phosphor/Kalium-Mangel in Blüte',
      'Kleine, luftige Blüten',
      'Blütenbildung verzögert'
    ],
  },
  // Plagron Alga-Serie (100% NATURAL - biologisch)
  {
    id: 102,
    name: 'Plagron Alga Grow',
    brand: 'Plagron',
    type: 'grow',
    npk: { n: 4, p: 2, k: 4 },
    price: 12.99,
    volume: 1000,
    notes: 'Biologischer Dünger auf Algenbasis für Wachstum',
    useCase: 'Bio-Basisdünger für Erde. Algenextrakte fördern Bodenleben. Kein pH/EC-Messen nötig. Ideal für organischen Anbau.',
    problems: [
      'Stickstoffmangel (gelbe Blätter)',
      'Schwaches Bodenleben',
      'Mangelnde Bodenstruktur'
    ],
  },
  {
    id: 103,
    name: 'Plagron Alga Bloom',
    brand: 'Plagron',
    type: 'bloom',
    npk: { n: 3, p: 2, k: 5 },
    price: 12.99,
    volume: 1000,
    notes: 'Biologischer Dünger auf Algenbasis für Blüte',
    useCase: 'Bio-Blütedünger für Erde. Verbessert Bodenstruktur und fördert natürliche Blütenbildung. Für Bio-Grows ohne Messgeräte.',
    problems: [
      'Schwache Blüte bei Bio-Anbau',
      'Mangelnde Bodenaktivität',
      'Geringer Ertrag'
    ],
  },
  // Plagron Cocos-Serie
  {
    id: 104,
    name: 'Plagron Cocos A',
    brand: 'Plagron',
    type: 'grow',
    npk: { n: 4, p: 0, k: 4 },
    price: 15.99,
    volume: 1000,
    notes: 'Basisdünger A für Kokos-Substrate',
    useCase: 'Teil A des 2-Komponenten-Systems für Cocos. Immer zusammen mit Cocos B verwenden. Calcium-optimiert für Cocos-Buffer.',
    problems: [
      'Calcium-Mangel auf Cocos',
      'Nährstoffungleichgewicht auf Kokos',
      'Schwaches Wachstum auf Cocos'
    ],
  },
  {
    id: 105,
    name: 'Plagron Cocos B',
    brand: 'Plagron',
    type: 'grow',
    npk: { n: 0, p: 4, k: 6 },
    price: 15.99,
    volume: 1000,
    notes: 'Basisdünger B für Kokos-Substrate',
    useCase: 'Teil B des 2-Komponenten-Systems für Cocos. Immer zusammen mit Cocos A verwenden. Phosphor/Kalium-Fokus für Blüte.',
    problems: [
      'Kalium-Mangel auf Cocos',
      'Schwache Blüten auf Kokos',
      'Mangelnde Pufferkapazität'
    ],
  },
  // Plagron Hydro-Serie
  {
    id: 106,
    name: 'Plagron Hydro A',
    brand: 'Plagron',
    type: 'grow',
    npk: { n: 5, p: 0, k: 5 },
    price: 16.99,
    volume: 1000,
    notes: 'Basisdünger A für Hydro-Systeme',
    useCase: 'Teil A für Hydro-Systeme (DWC, Ebb&Flow, NFT). Maximale Kontrolle über Nährstoffe. Nur für erfahrene Grower.',
    problems: [
      'Stickstoffmangel in Hydro',
      'Unklare Nährstoffzusammensetzung',
      'Schwaches Wachstum in Hydro-Systemen'
    ],
  },
  {
    id: 107,
    name: 'Plagron Hydro B',
    brand: 'Plagron',
    type: 'grow',
    npk: { n: 0, p: 5, k: 7 },
    price: 16.99,
    volume: 1000,
    notes: 'Basisdünger B für Hydro-Systeme',
    useCase: 'Teil B für Hydro-Systeme. Immer zusammen mit Hydro A verwenden. Hoher PK-Anteil für Hydro-Blüte.',
    problems: [
      'Phosphor/Kalium-Mangel in Hydro',
      'Schwache Blüten in Hydro',
      'Nährstoffausfälle im Recirculating-System'
    ],
  },
  // Plagron Additive & Booster
  {
    id: 108,
    name: 'Plagron Green Sensation',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 0, p: 8, k: 9 },
    price: 24.99,
    volume: 250,
    notes: '4-in-1 Blüte-Booster: schwerere, kompaktere Blüten',
    useCase: 'Premium-Blüte-Booster ab Woche 4. Ersetzt PK 13-14, Green Power und weitere Booster. Carbon-Molekül für bessere Photosynthese.',
    problems: [
      'Leichte, luftige Blüten',
      'Geringes Blütengewicht',
      'Schwache Resistenz in Spätblüte',
      'Mangelnde Nährstoffaufnahme'
    ],
  },
  {
    id: 109,
    name: 'Plagron Power Roots',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 0, p: 0, k: 2 },
    price: 11.99,
    volume: 250,
    notes: 'Wurzelstimulator mit Vitaminen und Huminsäuren',
    useCase: 'Wurzelbooster für Stecklinge und junge Pflanzen. Enthält Vitamin B1, C, E, Huminsäuren und Myo-Inositol. Ab der 1. Woche.',
    problems: [
      'Schwaches Wurzelwerk',
      'Langsames Anwachsen von Stecklingen',
      'Transplantationsstress',
      'Schlechte Nährstoffaufnahme durch Wurzeln'
    ],
  },
  {
    id: 110,
    name: 'Plagron Pure Zym',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 0, p: 0, k: 0 },
    price: 13.99,
    volume: 500,
    notes: 'Enzyme für bessere Nährstoffaufnahme und Wurzelgesundheit',
    useCase: 'Enzym-Additiv baut tote Wurzelzellen ab und macht Nährstoffe verfügbar. Verbessert Bodenstruktur und Wurzelgesundheit.',
    problems: [
      'Wurzelablagerungen im Substrat',
      'Schlechte Nährstoffverfügbarkeit',
      'Überdüngung / Salzablagerungen',
      'Wurzelfäule-Vorbeugung'
    ],
  },
  {
    id: 111,
    name: 'Plagron Sugar Royal',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 9, p: 0, k: 0 },
    price: 14.99,
    volume: 250,
    notes: 'Aminosäuren-Booster für mehr Terpene und Geschmack',
    useCase: '18 Aminosäuren aktivieren Terpen-Produktion. Für mehr Geschmack und Geruch. Während der gesamten Kultivierung.',
    problems: [
      'Mangelnder Geschmack/Geruch',
      'Geringe Terpen-Produktion',
      'Blasses Blütenprofil',
      'Fehlende Aminosäuren'
    ],
  },
  {
    id: 112,
    name: 'Plagron Vita Race',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 0, p: 5, k: 8 },
    price: 13.99,
    volume: 250,
    notes: 'Blüte-Booster für intensivere Blüten',
    useCase: 'PK-Booster mit Eisen für intensive Blüte. Ab der 3. Blütewoche. Fördert Blütenbildung und Festigkeit.',
    problems: [
      'Eisenmangel in Blüte (Chlorose)',
      'Schwache Blütenbildung',
      'Phosphor/Kalium-Mangel',
      'Vorzeitiges Vergilben der Blätter'
    ],
  },
  {
    id: 113,
    name: 'Plagron PK 13-14',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 0, p: 13, k: 14 },
    price: 12.99,
    volume: 250,
    notes: 'PK-Booster für maximale Blütenbildung',
    useCase: 'Klassischer PK-Booster ab Woche 4 der Blüte. Extrem hohe P- und K-Werte für maximalen Ertrag. Max 2ml/L.',
    problems: [
      'Phosphor-Mangel (dunkle Blätter, rote Stängel)',
      'Kalium-Mangel (braune Blattspitzen)',
      'Geringer Ertrag',
      'Kleine Blütenstände'
    ],
  },
  {
    id: 114,
    name: 'Plagron Power Buds',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 0, p: 8, k: 10 },
    price: 19.99,
    volume: 500,
    notes: 'Blüten-Booster für dichtere und schwerere Buds',
    useCase: 'Organischer Blüte-Booster für dichtere Blüten. Natürliche Wirkstoffe für kompakte Buds. Alternative zu Green Sensation.',
    problems: [
      'Lockere, luftige Blüten',
      'Geringes Bud-Gewicht',
      'Fehlende Dichte in Spätblüte',
      'Schwache Blütenstruktur'
    ],
  },
  {
    id: 115,
    name: 'Plagron Start Up',
    brand: 'Plagron',
    type: 'additive',
    npk: { n: 2, p: 2, k: 2 },
    price: 10.99,
    volume: 250,
    notes: 'Nährstofflösung für Keimlinge und Stecklinge',
    useCase: 'Milde Nährstofflösung für die allererste Phase. Für Keimlinge, Stecklinge und junge Pflanzen. Verhindert Überdüngung.',
    problems: [
      'Überdüngung bei Keimlingen',
      'Schwache Stecklingsentwicklung',
      'Langsames Anwachsen',
      'Mangelnde Startkraft'
    ],
  },
  // Andere Marken
  {
    id: 1,
    name: 'Terra Aquatica TriPart Grow',
    brand: 'Terra Aquatica',
    type: 'grow',
    npk: { n: 5, p: 0, k: 8 },
    price: 12.99,
    volume: 500,
    notes: 'Beliebter 3-Teile-Dünger',
    useCase: 'Wachstumsphase im 3-Teile-System. Immer mit Micro und Bloom kombinieren. Für alle Substrate geeignet.',
    problems: [
      'Stickstoffmangel',
      'Kümmerschaft im Vegi',
      'Unklare Nährstoffmischung'
    ],
  },
  {
    id: 2,
    name: 'Terra Aquatica TriPart Micro',
    brand: 'Terra Aquatica',
    type: 'micro',
    npk: { n: 5, p: 3, k: 5 },
    price: 12.99,
    volume: 500,
    useCase: 'Mikronährstoffe und Spurenelemente im 3-Teile-System. Basis für alle Phasen. Immer mit Grow und Bloom kombinieren.',
    problems: [
      'Spurenelement-Mangel',
      'Eisen/Mangan/Zink-Mangel',
      'Unvollständige Ernährung'
    ],
  },
  {
    id: 3,
    name: 'Terra Aquatica TriPart Bloom',
    brand: 'Terra Aquatica',
    type: 'bloom',
    npk: { n: 1, p: 4, k: 5 },
    price: 12.99,
    volume: 500,
    useCase: 'Blütephase im 3-Teile-System. Hoher PK-Anteil für schwere Blüten. Immer mit Grow und Micro kombinieren.',
    problems: [
      'Phosphor/Kalium-Mangel in Blüte',
      'Kleine Blüten',
      'Geringer Ertrag'
    ],
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
    useCase: 'Premium-Blüte-Booster für größere Blüten. Enthält Aminosäuren und Vitamine. Für maximale Erträge.',
    problems: [
      'Kleine Blütenstände',
      'Geringes Bud-Gewicht',
      'Schwache Blüteentwicklung'
    ],
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
    useCase: 'Kompletter Basisdünger für Erde. Hoher Stickstoffanteil für starkes Wachstum. Für alle Erdmischungen.',
    problems: [
      'Stickstoffmangel',
      'Langsames Wachstum',
      'Gelbe Blätter'
    ],
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
    useCase: 'Biologischer Wachstumsdünger auf Fisch- und Zuckerrübenbasis. Für organischen Anbau. Fördert Bodenleben.',
    problems: [
      'Stickstoffmangel im Bio-Anbau',
      'Schwaches Bodenleben',
      'Mangelnde Bodenaktivität'
    ],
  },
  {
    id: 7,
    name: 'Biobizz Bio-Bloom',
    brand: 'Biobizz',
    type: 'bloom',
    npk: { n: 2, p: 7, k: 4 },
    price: 9.99,
    volume: 500,
    useCase: 'Biologischer Blütedünger. Hoher Phosphor-Anteil für natürliche Blütenbildung. Für organischen Anbau.',
    problems: [
      'Schwache Bio-Blüte',
      'Phosphor-Mangel im Bio-Anbau',
      'Geringer Bio-Ertrag'
    ],
  },
  {
    id: 8,
    name: 'General Hydroponics FloraSeries Micro',
    brand: 'General Hydroponics',
    type: 'micro',
    npk: { n: 5, p: 0, k: 1 },
    price: 14.99,
    volume: 500,
    useCase: 'Mikronährstoffe für das FloraSeries-System. Basis für alle Phasen. Immer mit FloraGro und FloraBloom kombinieren.',
    problems: [
      'Spurenelement-Mangel',
      'Unvollständige FloraSeries-Ernährung',
      'Mikronährstoff-Defizite'
    ],
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

              {fert.useCase && (
                <div className="fertilizer-usecase">
                  <strong>📋 Einsatz:</strong> {fert.useCase}
                </div>
              )}

              {fert.problems && fert.problems.length > 0 && (
                <div className="fertilizer-problems">
                  <strong>🔧 Hilft bei:</strong>
                  <ul>
                    {fert.problems.map((problem, idx) => (
                      <li key={idx}>{problem}</li>
                    ))}
                  </ul>
                </div>
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
