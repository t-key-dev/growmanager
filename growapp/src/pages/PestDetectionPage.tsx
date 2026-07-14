import { useState } from 'react';

interface PestIssue {
  id: string;
  name: string;
  icon: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

const pestDatabase: PestIssue[] = [
  {
    id: 'spider-mites',
    name: 'Spinnmilben',
    icon: '🕷️',
    description: 'Kleine Spinnentiere, die Pflanzensäfte saugen',
    symptoms: [
      'Gelbe/sprenkelte Blätter',
      'Feine Spinnweben an Blattunterseiten',
      'Blätter fallen vorzeitig ab',
    ],
    treatment: [
      'Pflanzen mit Wasser abbrausen',
      'Neemöl-Spray (2-3 ml/L)',
      'Raubmilben einsetzen',
      'Befallene Blätter entfernen',
    ],
    prevention: [
      'Regelmäßig besprühen',
      'Luftfeuchtigkeit > 50%',
      'Neue Pflanzen quarantänieren',
    ],
  },
  {
    id: 'thrips',
    name: 'Thripse',
    icon: '🐛',
    description: 'Kleine Insekten, die Blattzellen aussaugen',
    symptoms: [
      'Silbrige/gestreifte Blätter',
      'Schwarze Punkte (Kot)',
      'Verkrümmte Triebspitzen',
    ],
    treatment: [
      'Gelbtafeln aufstellen',
      'Neemöl-Spray',
      'Florfliegen oder Raubmilben',
      'Befallene Teile abschneiden',
    ],
    prevention: [
      'Gelbsticker zur Früherkennung',
      'Regelmäßige Kontrolle',
      'Pflanzenabstände einhalten',
    ],
  },
  {
    id: 'fungus-gnats',
    name: 'Trauermücken',
    icon: '🦟',
    description: 'Kleine Fliegen, deren Larven Wurzeln schädigen',
    symptoms: [
      'Kleine schwarze Fliegen',
      'Langsames Wachstum',
      'Welke trotz Bewässerung',
    ],
    treatment: [
      'Gelbtafeln aufstellen',
      'Boden trockener halten',
      'Nematoden einsetzen',
      'BTI (Bacillus thuringiensis)',
    ],
    prevention: [
      'Boden zwischen Gießzyklen trocknen lassen',
      'Oberste Bodenschicht austauschen',
      'Klebrige Fallen',
    ],
  },
  {
    id: 'powdery-mildew',
    name: 'Mehltau',
    icon: '🦠',
    description: 'Pilzkrankheit mit weißem Belag',
    symptoms: [
      'Weißer Puder auf Blättern',
      'Gelbe Flecken',
      'Blätter sterben ab',
    ],
    treatment: [
      'Befallene Blätter entfernen',
      'Backpulver-Spray (1 TL/L)',
      'Milch-Wasser-Mischung (1:9)',
      'Schwefel-Präparate',
    ],
    prevention: [
      'Gute Luftzirkulation',
      'Luftfeuchtigkeit < 60%',
      'Ausreichend Abstand zwischen Pflanzen',
    ],
  },
  {
    id: 'botrytis',
    name: 'Grauschimmel',
    icon: '🍄',
    description: 'Pilzbefall an Blüten und Blättern',
    symptoms: [
      'Grauer, pelziger Belag',
      'Braune, weiche Stellen',
      'Faulende Blüten',
    ],
    treatment: [
      'Befallene Teile sofort entfernen',
      'Luftfeuchtigkeit senken',
      'Fungizide einsetzen',
      'Pflanze isolieren',
    ],
    prevention: [
      'Luftfeuchtigkeit kontrollieren',
      'Gute Belüftung',
      'Tote Pflanzenteile entfernen',
    ],
  },
];

export default function PestDetectionPage() {
  const [selectedPest, setSelectedPest] = useState<PestIssue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPests = pestDatabase.filter(pest =>
    pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page">
      <h1>🔍 Schädlingserkennung</h1>
      <p className="subtitle">Identifiziere und bekämpfe Schädlinge und Krankheiten</p>

      <div className="card">
        <input
          type="text"
          placeholder="Suche nach Schädling oder Krankheit..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {!selectedPest ? (
        <div className="card">
          <h3>Häufige Probleme</h3>
          <div className="pest-list">
            {filteredPests.map(pest => (
              <div
                key={pest.id}
                className="pest-item"
                onClick={() => setSelectedPest(pest)}
              >
                <span className="pest-icon">{pest.icon}</span>
                <div className="pest-info">
                  <strong>{pest.name}</strong>
                  <p>{pest.description}</p>
                </div>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedPest(null)}
            >
              ← Zurück
            </button>
            
            <div className="pest-detail">
              <div className="pest-header">
                <span className="pest-icon-large">{selectedPest.icon}</span>
                <h2>{selectedPest.name}</h2>
              </div>
              <p className="pest-description">{selectedPest.description}</p>
            </div>
          </div>

          <div className="card">
            <h3>⚠️ Symptome</h3>
            <ul className="symptom-list">
              {selectedPest.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>💊 Behandlung</h3>
            <ul className="treatment-list">
              {selectedPest.treatment.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>🛡️ Vorbeugung</h3>
            <ul className="prevention-list">
              {selectedPest.prevention.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
