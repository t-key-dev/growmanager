export type Stage =
  | "germination"
  | "seedling"
  | "vegetative"
  | "early_flower"
  | "mid_flower"
  | "late_flower"
  | "flush";

export const STAGE_LABELS: Record<Stage, string> = {
  germination: "Keimung",
  seedling: "Sämling",
  vegetative: "Vegetation",
  early_flower: "Frühe Blüte",
  mid_flower: "Mittlere Blüte",
  late_flower: "Späte Blüte",
  flush: "Reife/Spülen",
};

export const STAGES: Stage[] = [
  "germination",
  "seedling",
  "vegetative",
  "early_flower",
  "mid_flower",
  "late_flower",
  "flush",
];

/**
 * Typische Gesamtwoche (seit Keimung), in der eine Phase üblicherweise beginnt.
 * Nur ein Startwert zur Umrechnung "Phase + Woche in Phase" -> Gesamtwoche/Startdatum.
 * Kann je Pflanze durch manuelles Anpassen des Startdatums oder eigene Wochenpläne
 * überschrieben werden.
 */
export const PHASE_DEFAULT_START_WEEK: Record<Stage, number> = {
  germination: 1,
  seedling: 2,
  vegetative: 3,
  early_flower: 7,
  mid_flower: 9,
  late_flower: 12,
  flush: 16,
};

export type PlantType = "auto" | "photo";

export const PLANT_TYPE_LABELS: Record<PlantType, string> = {
  auto: "Autoflower",
  photo: "Photoperiod",
};

export interface Tent {
  id?: number;
  name: string;
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
  lightType?: string;
  lightWattage?: number;
  lightCycle?: string; // e.g. "18/6", "12/12"
  climateNotes?: string; // e.g. "2x Befeuchter, 1x Entfeuchter"
  createdAt: string;
  sortOrder?: number;
  roomId?: number;
  size?: string;
}

export interface Plant {
  id?: number;
  tentId: number;
  name: string;
  strain?: string;
  type?: PlantType;
  startDate: string;
  waterIntervalDays?: number; // optional reminder interval for calendar
  notes?: string;
  archived?: boolean;
  harvestDate?: string; // set when harvested
  sortOrder?: number; // for drag & drop sorting
  status?: 'planned' | 'growing' | 'flowering' | 'harvested' | 'archived';
  expectedHarvest?: string; // expected harvest date
}

export interface FertilizerDose {
  name: string;
  doseMlPerL?: number;
}

export interface WeekPlan {
  id?: number;
  plantId: number;
  week: number; // 1-based week number since plant start
  stage: Stage;
  tempDayMin?: number;
  tempDayMax?: number;
  tempNightMin?: number;
  tempNightMax?: number;
  humidityMin?: number;
  humidityMax?: number;
  lightPercent?: number;
  lightDistanceCm?: number;
  lightHoursOn?: number;
  ecMin?: number;
  ecMax?: number;
  phMin?: number;
  phMax?: number;
  fertilizers: FertilizerDose[];
  waterNote?: string;
}

export type LogType = "water" | "fertilize" | "move" | "note" | "photo" | "harvest";

export interface LogEntry {
  id?: number;
  plantId: number;
  type: LogType;
  date: string; // ISO date
  note?: string;
}

// ─── Photo Log ───────────────────────────────────────────────────────────────

export interface PhotoEntry {
  id?: number;
  plantId: number;
  dataUrl: string; // base64 data URL
  caption?: string;
  date: string; // ISO date
  week?: number; // week number at time of photo
}

// ─── Cost Tracker ────────────────────────────────────────────────────────────

export type CostCategory =
  | "strom"
  | "duenger"
  | "erde"
  | "samen"
  | "equipment"
  | "sonstiges";

export const COST_CATEGORY_LABELS: Record<CostCategory, string> = {
  strom: "⚡ Strom",
  duenger: "🧪 Dünger",
  erde: "🪴 Erde/Substrat",
  samen: "🌱 Samen/Stecklinge",
  equipment: "🔧 Equipment",
  sonstiges: "📦 Sonstiges",
};

export const COST_CATEGORIES: CostCategory[] = [
  "strom",
  "duenger",
  "erde",
  "samen",
  "equipment",
  "sonstiges",
];

export interface CostEntry {
  id?: number;
  category: CostCategory;
  description: string;
  amount: number; // EUR
  date: string; // ISO date
  plantId?: number; // optional: link to specific plant
  recurring?: boolean; // monthly recurring (e.g. electricity)
}

// ─── Harvest Tracking ────────────────────────────────────────────────────────

export type QualityRating = 1 | 2 | 3 | 4 | 5;

export interface HarvestEntry {
  id?: number;
  plantId: number;
  date: string; // ISO date
  wetWeightG?: number; // grams wet after chop
  dryWeightG?: number; // grams after drying/curing
  quality?: QualityRating; // 1-5 stars
  notes?: string;
  aroma?: string; // e.g. "erdig, citrus"
  effect?: string; // e.g. "entspannend, kreativ"
}

// ─── Strain Database ─────────────────────────────────────────────────────────

export type StrainType = "indica" | "sativa" | "hybrid";
export type Difficulty = "leicht" | "mittel" | "schwer";

export const STRAIN_TYPE_LABELS: Record<StrainType, string> = {
  indica: "Indica",
  sativa: "Sativa",
  hybrid: "Hybrid",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  leicht: "🟢 Leicht",
  mittel: "🟡 Mittel",
  schwer: "🔴 Schwer",
};

export interface Strain {
  id?: number;
  name: string;
  type: StrainType;
  genetics?: string; // e.g. "60% Indica / 40% Sativa"
  plantType?: PlantType; // auto or photo
  floweringDays?: number; // typical flowering time in days
  difficulty?: Difficulty;
  yieldIndoor?: string; // e.g. "400-500g/m²"
  thc?: string; // e.g. "18-22%"
  cbd?: string; // e.g. "<1%"
  description?: string;
  aroma?: string; // e.g. "erdig, pine, citrus"
  effect?: string; // e.g. "relaxing, creative"
  createdAt?: string;
}

// ─── Clones / Cuttings ───────────────────────────────────────────────────────

export interface Clone {
  id?: number;
  motherPlantId: number;
  name: string;
  cutDate: string; // ISO date
  rootedDate?: string;
  notes?: string;
  success?: boolean; // did it root?
}

// ─── Note Templates ──────────────────────────────────────────────────────────

export interface NoteTemplate {
  id?: number;
  name: string;
  text: string;
  category: "water" | "fertilize" | "note" | "general";
}

// ─── Light Cycle Events ──────────────────────────────────────────────────────

export interface LightCycleEvent {
  id?: number;
  plantId: number;
  fromCycle: string; // e.g. "18/6"
  toCycle: string; // e.g. "12/12"
  switchDate: string; // ISO date
  notes?: string;
}

// ─── Strain Genealogy ────────────────────────────────────────────────────────

export interface StrainParent {
  strainName: string;
  percentage: number; // e.g. 60 for 60%
}

// Add parents field to Strain interface
export interface StrainWithParents extends Strain {
  parents?: StrainParent[];
}

// Seed strains are now in strainDatabase.ts

// ─── Measurements ────────────────────────────────────────────────────────────

export interface Measurement {
  id?: number;
  plantId: number;
  date: string;
  height?: number; // cm
  stemDiameter?: number; // mm
  nodeCount?: number;
  notes?: string;
}

// ─── Rooms ───────────────────────────────────────────────────────────────────

export interface Room {
  id?: number;
  name: string;
  location?: string;
  size?: string;
  notes?: string;
  createdAt: string;
}

// ─── Fertilizations ──────────────────────────────────────────────────────────

export interface Fertilization {
  id?: number;
  plantId: number;
  fertilizerId: number;
  date: string;
  amountMl?: number;
  waterLiters?: number;
  growthPhase?: 'seedling' | 'vegetative' | 'flowering' | 'ripening';
  notes?: string;
}

// ─── Fertilizers ─────────────────────────────────────────────────────────────

export interface Fertilizer {
  id?: number;
  name: string;
  brand?: string;
  type?: 'grow' | 'bloom' | 'micro' | 'additive';
  npk?: { n: number; p: number; k: number };
  price?: number;
  volumeMl?: number;
  notes?: string;
}

// ─── Voice Notes ─────────────────────────────────────────────────────────────

export interface VoiceNote {
  id?: number;
  plantId: number;
  audioData: string; // base64
  duration: number; // seconds
  createdAt: string;
}

// ─── Strain Reviews ──────────────────────────────────────────────────────────

export interface StrainReview {
  id?: number;
  strainId: number;
  rating: number; // 1-5
  yield: number; // 1-5
  difficulty: number; // 1-5
  taste: number; // 1-5
  effect: number; // 1-5
  smell: number; // 1-5
  comment?: string;
  createdAt: string;
}
