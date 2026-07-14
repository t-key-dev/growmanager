import Dexie, { type Table } from "dexie";
import type { 
  Tent, Plant, WeekPlan, LogEntry, PhotoEntry, CostEntry, HarvestEntry, Strain,
  Clone, NoteTemplate, LightCycleEvent, Measurement, Room, Fertilization, 
  Fertilizer, VoiceNote, StrainReview
} from "./types";

export type { Tent, Plant, WeekPlan, LogEntry, PhotoEntry, CostEntry, HarvestEntry, Strain, Clone, NoteTemplate, LightCycleEvent, Measurement, Room, Fertilization, Fertilizer, VoiceNote, StrainReview };

export class GrowDB extends Dexie {
  tents!: Table<Tent, number>;
  plants!: Table<Plant, number>;
  weekPlans!: Table<WeekPlan, number>;
  logs!: Table<LogEntry, number>;
  photos!: Table<PhotoEntry, number>;
  costs!: Table<CostEntry, number>;
  harvests!: Table<HarvestEntry, number>;
  strains!: Table<Strain, number>;
  clones!: Table<Clone, number>;
  noteTemplates!: Table<NoteTemplate, number>;
  lightCycleEvents!: Table<LightCycleEvent, number>;
  measurements!: Table<Measurement, number>;
  rooms!: Table<Room, number>;
  fertilizations!: Table<Fertilization, number>;
  fertilizers!: Table<Fertilizer, number>;
  voiceNotes!: Table<VoiceNote, number>;
  strainReviews!: Table<StrainReview, number>;

  constructor() {
    super("growapp-db");
    this.version(1).stores({
      tents: "++id, name",
      plants: "++id, tentId, stage, archived",
      growPlans: "++id, plantId, stage",
      logs: "++id, plantId, type, date",
    });
    // v2: replace single-stage growPlans with week-based plans supporting
    // multiple fertilizers, day/night temps, EC/pH ranges, light %.
    this.version(2)
      .stores({
        tents: "++id, name",
        plants: "++id, tentId, type, archived",
        growPlans: null,
        weekPlans: "++id, plantId, week, stage",
        logs: "++id, plantId, type, date",
      })
      .upgrade(async (tx) => {
        // Best-effort migration: old growPlans (one per stage) become week 1 entries.
        const old = await tx.table("growPlans").toArray();
        if (!old.length) return;
        const mapped = old.map((p: Record<string, unknown>) => ({
          plantId: p.plantId,
          week: 1,
          stage: p.stage ?? "vegetative",
          humidityMin: p.humidityMin,
          humidityMax: p.humidityMax,
          tempDayMin: p.tempMin,
          tempDayMax: p.tempMax,
          lightDistanceCm: p.lightDistanceCm,
          lightHoursOn: p.lightHoursOn,
          phMin: p.phMin,
          phMax: p.phMax,
          ecMin: p.ecTarget,
          ecMax: p.ecTarget,
          fertilizers: p.fertilizerName
            ? [{ name: p.fertilizerName as string, doseMlPerL: undefined }]
            : [],
        }));
        await tx.table("weekPlans").bulkAdd(mapped);
      });
    // v3: add photos, costs, harvests, strains tables + harvestDate on plants
    this.version(3)
      .stores({
        tents: "++id, name",
        plants: "++id, tentId, type, archived",
        weekPlans: "++id, plantId, week, stage",
        logs: "++id, plantId, type, date",
        photos: "++id, plantId, date",
        costs: "++id, category, date, plantId",
        harvests: "++id, plantId, date",
        strains: "++id, name, type",
      });
    // v4: add clones, noteTemplates, lightCycleEvents
    this.version(4)
      .stores({
        tents: "++id, name",
        plants: "++id, tentId, type, archived",
        weekPlans: "++id, plantId, week, stage",
        logs: "++id, plantId, type, date",
        photos: "++id, plantId, date",
        costs: "++id, category, date, plantId",
        harvests: "++id, plantId, date",
        strains: "++id, name, type",
        clones: "++id, motherPlantId, cutDate",
        noteTemplates: "++id, category, name",
        lightCycleEvents: "++id, plantId, switchDate",
      });
    // v5: add measurements, rooms, fertilizations, fertilizers, voiceNotes, strainReviews
    this.version(5)
      .stores({
        tents: "++id, name, roomId",
        plants: "++id, tentId, type, archived, sortOrder",
        weekPlans: "++id, plantId, week, stage",
        logs: "++id, plantId, type, date",
        photos: "++id, plantId, date",
        costs: "++id, category, date, plantId",
        harvests: "++id, plantId, date",
        strains: "++id, name, type",
        clones: "++id, motherPlantId, cutDate",
        noteTemplates: "++id, category, name",
        lightCycleEvents: "++id, plantId, switchDate",
        measurements: "++id, plantId, date",
        rooms: "++id, name",
        fertilizations: "++id, plantId, fertilizerId, date",
        fertilizers: "++id, name, brand",
        voiceNotes: "++id, plantId, createdAt",
        strainReviews: "++id, strainId, createdAt",
      });
  }
}

export const db = new GrowDB();
