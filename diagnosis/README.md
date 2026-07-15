# Diagnose-Datenbank

## Umfang
42 Einträge in `growapp/src/diagnosisData.ts`, alle mit Bild.

## Kategorien
- **mangel** (Nährstoffmängel & Stress): 15 Einträge – N, P, K, Ca, Mg, S, Fe, Zn, Mn, B, Cu, Lichtbrand, Über-/Unterwässerung
- **krankheit** (Pilze/Krankheiten): 8 Einträge – Botrytis, Echter Mehltau, Wurzelfäule, Umfallkrankheit, Fusarium, Septoria, Rost, Bud Rot
- **schaedling** (Schädlinge): 10 Einträge – Spinnmilben, Trauermücken, Thripse, Blattläuse, Weiße Fliege, Wollläuse, Schildläuse, Raupen, Minierfliegen, Springschwänze
- **sonstiges** (Umwelt/Stress): 9 Einträge – Hitze, Kälte, RH niedrig/hoch, pH-Drift, Topf zu klein, Lichtstress, langer Sämling, Hermaphrodit, Nährstoff-Lockout

## Bilder
- 9 alte JPGs (nicht alle gut, aber funktional): botrytis, eagle-claws, fe, fungus-gnats, mg, n, powdery-mildew, root-rot, spider-mites
- 33 selbst generierte SVGs (klein, skalierbar, kein Copyright-Problem)

## Datei
`growapp/scripts/gen-diagnosis-svgs.mjs` – SVG-Generator für alle SVGs.

## Lessons Learned
- Wikimedia-URLs werden serverseitig mit User-Agent geblockt (2014-Byte-Fehlerseite). 
  Direkter Download klappt nur über API/AUTH-mw-Endpoint, was kompliziert ist.
- Lösung: SVG-Icons selbst generieren – klein, scharf, kein Copyright.
- `k-deficiency.jpg` und `p-deficiency.jpg` waren identische 9277-Byte-Dateien (md5 gleich) → jetzt SVGs.
