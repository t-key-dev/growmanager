import { differenceInCalendarDays, parseISO, startOfDay, subDays } from "date-fns";
import { PHASE_DEFAULT_START_WEEK } from "./types";
import type { Plant, Stage, WeekPlan } from "./types";

export function currentWeekFor(plant: Plant, at: Date = new Date()): number {
  const days = differenceInCalendarDays(startOfDay(at), startOfDay(parseISO(plant.startDate)));
  return Math.max(1, Math.floor(days / 7) + 1);
}

/** Findet den Wochenplan für eine bestimmte Woche, fällt auf den letzten vorherigen Plan zurück. */
export function weekPlanFor(plans: WeekPlan[], plantId: number, week: number): WeekPlan | undefined {
  const forPlant = plans.filter((p) => p.plantId === plantId).sort((a, b) => a.week - b.week);
  if (!forPlant.length) return undefined;
  const exact = forPlant.find((p) => p.week === week);
  if (exact) return exact;
  const earlier = forPlant.filter((p) => p.week <= week);
  return earlier[earlier.length - 1] ?? forPlant[0];
}

export function currentStageFor(plant: Plant, plans: WeekPlan[]): Stage | undefined {
  const week = currentWeekFor(plant);
  return weekPlanFor(plans, plant.id ?? -1, week)?.stage;
}

/**
 * Rechnet aus "aktuell in Phase X, dort Woche Y" ein passendes Startdatum (Keimung) zurück,
 * damit der Wochenplan ab jetzt korrekt weiterläuft. `at` ist standardmäßig heute.
 */
export function startDateFromPhase(stage: Stage, weekInPhase: number, at: Date = new Date()): Date {
  const totalWeek = PHASE_DEFAULT_START_WEEK[stage] + Math.max(1, weekInPhase) - 1;
  const daysSinceStart = (totalWeek - 1) * 7;
  return startOfDay(subDays(at, daysSinceStart));
}
