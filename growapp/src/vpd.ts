// VPD (Vapor Pressure Deficit) Berechnung
// SVP (Sättigungsdampfdruck) nach Tetens-Formel in kPa
export function saturationVaporPressure(tempC: number): number {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

export interface VpdResult {
  svpAirKpa: number;
  svpLeafKpa: number;
  avpKpa: number;
  vpdKpa: number;
}

/**
 * Berechnet den VPD-Wert.
 * @param airTempC Lufttemperatur in °C
 * @param humidityPercent relative Luftfeuchtigkeit in %
 * @param leafTempOffsetC Blatttemperatur-Offset in °C (meist -2 bis 0, Blätter sind kühler als Luft)
 */
export function calculateVPD(
  airTempC: number,
  humidityPercent: number,
  leafTempOffsetC: number = -2,
): VpdResult {
  const svpAirKpa = saturationVaporPressure(airTempC);
  const leafTempC = airTempC + leafTempOffsetC;
  const svpLeafKpa = saturationVaporPressure(leafTempC);
  const avpKpa = svpAirKpa * (humidityPercent / 100);
  const vpdKpa = svpLeafKpa - avpKpa;
  return { svpAirKpa, svpLeafKpa, avpKpa, vpdKpa: Math.max(0, vpdKpa) };
}

export type VpdZone = "zu-niedrig" | "vegetativ" | "optimal-bluete" | "zu-hoch";

export interface VpdRange {
  zone: VpdZone;
  label: string;
  min: number;
  max: number;
  color: string;
}

// Richtwerte für Cannabis nach Wachstumsphase (kPa)
export const VPD_TARGETS: Record<string, { min: number; max: number; label: string }> = {
  germination: { min: 0.4, max: 0.7, label: "Keimung" },
  seedling: { min: 0.6, max: 0.9, label: "Sämling" },
  vegetative: { min: 0.8, max: 1.2, label: "Vegetation" },
  early_flower: { min: 1.0, max: 1.3, label: "Frühe Blüte" },
  mid_flower: { min: 1.2, max: 1.4, label: "Mittlere Blüte" },
  late_flower: { min: 1.3, max: 1.5, label: "Späte Blüte" },
  flush: { min: 1.4, max: 1.6, label: "Reife/Spülen" },
};

export function classifyVpd(vpd: number, stage?: string): { zone: VpdZone; label: string; color: string } {
  const target = stage ? VPD_TARGETS[stage] : undefined;
  if (target) {
    if (vpd < target.min) return { zone: "zu-niedrig", label: "Unter Zielbereich – Schimmelrisiko ↑, Transpiration ↓", color: "#3b82f6" };
    if (vpd > target.max) return { zone: "zu-hoch", label: "Über Zielbereich – Stressrisiko, Pflanze verdunstet zu stark", color: "#ef4444" };
    return { zone: "optimal-bluete", label: "Im optimalen Bereich für diese Phase", color: "#22c55e" };
  }
  if (vpd < 0.4) return { zone: "zu-niedrig", label: "Sehr niedrig – Risiko für Schimmel/Pilze", color: "#3b82f6" };
  if (vpd > 1.6) return { zone: "zu-hoch", label: "Sehr hoch – Stressrisiko", color: "#ef4444" };
  return { zone: "vegetativ", label: "Normalbereich", color: "#22c55e" };
}
