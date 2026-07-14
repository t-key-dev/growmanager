import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { db } from "../db";
import { currentStageFor, currentWeekFor } from "../planHelpers";
import { STAGE_LABELS, PLANT_TYPE_LABELS } from "../types";
import { generateUpcomingEvents } from "../calendar";
import NotificationSettings from "./NotificationSettings";

export default function DashboardPage() {
  const plants = useLiveQuery(() => db.plants.filter((p) => !p.archived).toArray(), []);
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  const plans = useLiveQuery(() => db.weekPlans.toArray(), []);
  const logs = useLiveQuery(() => db.logs.toArray(), []);
  const harvests = useLiveQuery(() => db.harvests.toArray(), []);
  const costs = useLiveQuery(() => db.costs.toArray(), []);

  if (!plants || !tents || !plans || !logs) return null;

  const today = startOfDay(new Date());
  const tentMap = new Map(tents.map((t) => [t.id, t.name]));

  // Upcoming events (next 7 days)
  const upcoming = generateUpcomingEvents(plants, tents, plans, logs, 7);
  const todayIso = today.toISOString().slice(0, 10);
  const tomorrowIso = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
  const overdue = upcoming.filter((e) => e.date < todayIso);
  const todayEvents = upcoming.filter((e) => e.date === todayIso);
  const tomorrowEvents = upcoming.filter((e) => e.date === tomorrowIso);

  // Total costs
  const totalCosts = costs?.reduce((sum, c) => sum + c.amount, 0) ?? 0;
  const totalHarvests = harvests?.length ?? 0;
  const totalDryWeight = harvests?.reduce((sum, h) => sum + (h.dryWeightG ?? 0), 0) ?? 0;

  return (
    <div>
      <div className="app-header">
        <h1>📊 Dashboard</h1>
      </div>
      <div className="app-main">
        <NotificationSettings />
        
        {/* Quick Stats */}
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="stat-box">
            <div className="num">{plants.length}</div>
            <div className="lbl">Aktive Pflanzen</div>
          </div>
          <div className="stat-box">
            <div className="num">{tents.length}</div>
            <div className="lbl">Zelte</div>
          </div>
          <div className="stat-box">
            <div className="num">{totalHarvests}</div>
            <div className="lbl">Ernten</div>
          </div>
          <div className="stat-box">
            <div className="num">{totalDryWeight > 0 ? `${(totalDryWeight / 1000).toFixed(1)}kg` : "—"}</div>
            <div className="lbl">Gesamtertrag (trocken)</div>
          </div>
        </div>

        {/* Overdue */}
        {overdue.length > 0 && (
          <div className="card dashboard-alert">
            <div className="card-title">⚠️ Überfällig</div>
            {overdue.map((e, i) => (
              <div className="event-row" key={i}>
                <span>{e.label}</span>
                <Link to={`/plants/${e.plantId}`} className="chip">→ Pflanze</Link>
              </div>
            ))}
          </div>
        )}

        {/* Today */}
        {todayEvents.length > 0 && (
          <div className="card">
            <div className="card-title">📅 Heute</div>
            {todayEvents.map((e, i) => (
              <div className="event-row" key={i}>
                <span>{e.label}</span>
                <Link to={`/plants/${e.plantId}`} className="chip">→ Pflanze</Link>
              </div>
            ))}
          </div>
        )}

        {/* Tomorrow */}
        {tomorrowEvents.length > 0 && (
          <div className="card">
            <div className="card-title">📅 Morgen</div>
            {tomorrowEvents.map((e, i) => (
              <div className="event-row" key={i}>
                <span>{e.label}</span>
                <Link to={`/plants/${e.plantId}`} className="chip">→ Pflanze</Link>
              </div>
            ))}
          </div>
        )}

        {plants.length === 0 && (
          <div className="empty-state">
            <div className="icon">🌱</div>
            <p>Noch keine aktiven Pflanzen.<br />Lege ein Zelt an und füge deine erste Pflanze hinzu!</p>
            <Link to="/tents" className="btn" style={{ marginTop: 12 }}>🏕️ Zelte verwalten</Link>
          </div>
        )}

        {/* Plant Overview */}
        {plants.length > 0 && (
          <>
            <h3 style={{ marginTop: 16 }}>🌿 Deine Pflanzen</h3>
            {plants.map((plant) => {
              const week = currentWeekFor(plant);
              const stage = currentStageFor(plant, plans);
              const daysSinceStart = differenceInCalendarDays(today, startOfDay(parseISO(plant.startDate)));
              const tentName = tentMap.get(plant.tentId) ?? "?";
              return (
                <div className="card" key={plant.id}>
                  <div className="card-title">
                    <Link to={`/plants/${plant.id}`} style={{ color: "inherit" }}>{plant.name}</Link>
                    {plant.type && <span className="chip">{PLANT_TYPE_LABELS[plant.type]}</span>}
                  </div>
                  {plant.strain && <div className="muted">🧬 {plant.strain}</div>}
                  <div className="muted">
                    📍 {tentName} · Woche {week}
                    {stage ? ` · ${STAGE_LABELS[stage]}` : ""}
                  </div>
                  <div className="muted">
                    📆 {daysSinceStart} Tage seit Keimung · seit {new Date(plant.startDate).toLocaleDateString("de-DE")}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Cost Summary */}
        {totalCosts > 0 && (
          <div className="card" style={{ marginTop: 8 }}>
            <div className="card-title">
              💰 Kostenübersicht
              <Link to="/costs" className="chip">Details →</Link>
            </div>
            <div className="muted">
              Gesamt: <strong style={{ color: "var(--text)" }}>{totalCosts.toFixed(2)} €</strong>
            </div>
            {plants.length > 0 && (
              <div className="muted">
                Pro Pflanze: <strong style={{ color: "var(--text)" }}>{(totalCosts / plants.length).toFixed(2)} €</strong>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-title">⚡ Quick Actions</div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => {
              plants.forEach(async (p) => {
                await db.logs.add({ plantId: p.id!, type: "water", date: new Date().toISOString() });
              });
              alert(`💧 ${plants.length} Pflanze(n) gegossen!`);
            }}>
              <span>💧</span>
              <span>Alle gießen</span>
            </button>
            <Link to="/problem-reporter" className="quick-action-btn">
              <span>⚠️</span>
              <span>Problem melden</span>
            </Link>
            <Link to="/tools" className="quick-action-btn">
              <span>🔧</span>
              <span>Tools</span>
            </Link>
            <Link to="/weather" className="quick-action-btn">
              <span>🌤️</span>
              <span>Wetter</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-title">⚡ Schnellzugriff</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            <Link to="/vpd" className="chip">💧 VPD</Link>
            <Link to="/ec-converter" className="chip">🔬 EC/ppm</Link>
            <Link to="/ph-calculator" className="chip">⚗️ pH</Link>
            <Link to="/diagnosis" className="chip">🩺 Diagnose</Link>
            <Link to="/strains" className="chip">🌱 Strains</Link>
            <Link to="/costs" className="chip">💰 Kosten</Link>
            <Link to="/statistics" className="chip">📊 Stats</Link>
            <Link to="/clones" className="chip">🌱 Klone</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
