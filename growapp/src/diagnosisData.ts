export interface DiagnosisEntry {
  id: string;
  symptom: string;
  cause: string;
  advice: string;
  category: "mangel" | "schaedling" | "krankheit" | "sonstiges";
  image?: string; // path under /public
}

export const DIAGNOSIS_ENTRIES: DiagnosisEntry[] = [
  {
    id: "eagle-claws",
    symptom: "Adlerkrallen (Blätter krallen sich nach unten)",
    cause: "Überdüngung",
    advice: "EC senken, ggf. mit klarem Wasser (pH 6,0–6,5) durchspülen.",
    category: "mangel",
    image: "diagnosis/eagle-claws.jpg",
  },
  {
    id: "n-deficiency",
    symptom: "Gleichmäßig gelb, von alten zu neuen Blättern",
    cause: "Stickstoff(N)-Mangel oder pH zu hoch",
    advice: "Erst pH prüfen (Ziel 6,0–6,5), dann ggf. N-Dünger leicht erhöhen.",
    category: "mangel",
    image: "diagnosis/n-deficiency.jpg",
  },
  {
    id: "p-deficiency",
    symptom: "Lila/violette Stängel und Blattadern",
    cause: "Phosphor(P)-Mangel oder Kälte (<15°C)",
    advice: "Temperatur prüfen, bei Bedarf P-Dünger (z.B. PK 13-14) anpassen.",
    category: "mangel",
    image: "diagnosis/p-deficiency.jpg",
  },
  {
    id: "k-deficiency",
    symptom: "Braune, verbrannte Blattränder",
    cause: "Kalium(K)-Mangel oder Hitzeschaden",
    advice: "Abstand zur Lampe prüfen, K-Dünger nach Wochenplan anpassen.",
    category: "mangel",
    image: "diagnosis/k-deficiency.jpg",
  },
  {
    id: "mg-deficiency",
    symptom: "Fenster-Muster (Blattadern bleiben grün, Fläche vergilbt)",
    cause: "Magnesium(Mg)-Mangel",
    advice: "Bittersalz-Spray (Epsom-Salz, ca. 1 TL/L) oder Calmag ins Gießwasser.",
    category: "mangel",
    image: "diagnosis/mg-deficiency.jpg",
  },
  {
    id: "fe-deficiency",
    symptom: "Neue Blätter leuchtend gelb / fast weiß, Adern oft noch grün",
    cause: "Eisen(Fe)-Mangel, meist durch zu hohen pH ausgelöst",
    advice: "pH-Wert senken (Richtung 6,0), Eisen wird bei zu hohem pH nicht aufgenommen.",
    category: "mangel",
    image: "diagnosis/fe-deficiency.jpg",
  },
  {
    id: "root-rot",
    symptom: "Pflanze welk trotz feuchter Erde",
    cause: "Wurzelfäule (z.B. Pythium)",
    advice: "Zwischen den Gießgängen abtrocknen lassen, Perlite beimischen, ggf. H2O2 3% (10ml/L) ins Gießwasser.",
    category: "krankheit",
    image: "diagnosis/root-rot.jpg",
  },
  {
    id: "botrytis",
    symptom: "Grauer, wattiger Belag im Bud",
    cause: "Botrytis (Grauschimmel)",
    advice: "Befallene Stellen sofort mit Handschuhen entfernen und entsorgen, Luftfeuchtigkeit in der Spätblüte auf 40–50% senken, Luftzirkulation verbessern.",
    category: "krankheit",
    image: "diagnosis/botrytis.jpg",
  },
  {
    id: "powdery-mildew",
    symptom: "Weißer, puderartiger Belag auf Blättern",
    cause: "Echter Mehltau",
    advice: "Backpulver-Spray (5g + 1ml Spülmittel/L) oder Milch-Spray (30% Milch/70% Wasser), Luftzirkulation erhöhen.",
    category: "krankheit",
    image: "diagnosis/powdery-mildew.jpg",
  },
  {
    id: "spider-mites",
    symptom: "Feine helle Sprenkel auf Blättern + feine Gespinste",
    cause: "Spinnmilben",
    advice: "Luftfeuchtigkeit über 50% halten, Neem-Öl (3ml + 1ml Spülmittel/L) alle 3 Tage, alternativ Raubmilben einsetzen.",
    category: "schaedling",
    image: "diagnosis/spider-mites.jpg",
  },
  {
    id: "fungus-gnats",
    symptom: "Kleine schwarze Fliegen um den Topf",
    cause: "Trauermücken",
    advice: "Erdoberfläche zwischen den Gießgängen abtrocknen lassen, Nematoden (Steinernema feltiae) ins Gießwasser geben.",
    category: "schaedling",
    image: "diagnosis/fungus-gnats.jpg",
  },
];

export const DIAGNOSIS_CATEGORY_LABELS: Record<DiagnosisEntry["category"], string> = {
  mangel: "🍂 Nährstoffmangel",
  schaedling: "🐛 Schädlinge",
  krankheit: "🦠 Krankheiten/Pilze",
  sonstiges: "❓ Sonstiges",
};
