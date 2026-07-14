import { addDays, differenceInCalendarDays, formatISO, parseISO, startOfDay } from "date-fns";
import type { LogEntry, Plant, Tent, WeekPlan } from "./types";
import { STAGE_LABELS } from "./types";

export interface CalendarEvent {
  date: string; // ISO yyyy-MM-dd
  plantId: number;
  plantName: string;
  tentName: string;
  type: "water";
  label: string;
}

function weekNumberFor(plant: Plant, date: Date): number {
  const days = differenceInCalendarDays(startOfDay(date), startOfDay(parseISO(plant.startDate)));
  return Math.max(1, Math.floor(days / 7) + 1);
}

function findWeekPlan(plans: WeekPlan[], plantId: number, week: number): WeekPlan | undefined {
  const forPlant = plans.filter((p) => p.plantId === plantId).sort((a, b) => a.week - b.week);
  if (!forPlant.length) return undefined;
  const exact = forPlant.find((p) => p.week === week);
  if (exact) return exact;
  // fall back to the closest earlier week's plan (feeding schedules carry forward)
  const earlier = forPlant.filter((p) => p.week <= week);
  return earlier[earlier.length - 1] ?? forPlant[0];
}

function feedLabel(plan?: WeekPlan): string {
  if (!plan || !plan.fertilizers?.length) return "nur Wasser";
  return plan.fertilizers
    .filter((f) => f.name)
    .map((f) => (f.doseMlPerL ? `${f.name} ${f.doseMlPerL}ml/L` : f.name))
    .join(", ");
}

/**
 * Berechnet kommende Gieß-/Dünge-Termine. Ein Termin fasst Gießen + die für die
 * aktuelle Woche des Grow-Plans hinterlegten Düngerprodukte zusammen (so wie es
 * in der Praxis üblich ist: gedüngt wird beim Gießen nach Wochenplan).
 */
export function generateUpcomingEvents(
  plants: Plant[],
  tents: Tent[],
  plans: WeekPlan[],
  logs: LogEntry[],
  daysAhead: number = 30,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = startOfDay(new Date());
  const tentMap = new Map(tents.map((t) => [t.id, t]));

  for (const plant of plants) {
    if (plant.archived) continue;
    const intervalDays = plant.waterIntervalDays;
    if (!intervalDays || intervalDays <= 0) continue;
    const tent = tentMap.get(plant.tentId);
    const tentName = tent?.name ?? "Unbekanntes Zelt";

    const relevantLogs = logs
      .filter((l) => l.plantId === plant.id && l.type === "water")
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    const lastDate = relevantLogs[0]
      ? startOfDay(parseISO(relevantLogs[0].date))
      : startOfDay(parseISO(plant.startDate));

    let next = addDays(lastDate, intervalDays);
    if (differenceInCalendarDays(next, today) < 0) {
      next = today;
    }

    let cursor = next;
    const horizon = addDays(today, daysAhead);
    while (differenceInCalendarDays(cursor, horizon) <= 0) {
      const week = weekNumberFor(plant, cursor);
      const plan = findWeekPlan(plans, plant.id!, week);
      const stageLabel = plan ? STAGE_LABELS[plan.stage] : "";
      const feed = feedLabel(plan);
      events.push({
        date: formatISO(cursor, { representation: "date" }),
        plantId: plant.id!,
        plantName: plant.name,
        tentName,
        type: "water",
        label: `💧 ${plant.name} – Wo ${week}${stageLabel ? ` (${stageLabel})` : ""}: ${feed}`,
      });
      cursor = addDays(cursor, intervalDays);
    }
  }

  return events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }
  return map;
}
