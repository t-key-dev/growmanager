import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../db";
import type { Plant, PlantType, Stage } from "../types";
import { PLANT_TYPE_LABELS, STAGE_LABELS, STAGES } from "../types";
import { currentStageFor, currentWeekFor, startDateFromPhase } from "../planHelpers";

type StartMode = "date" | "phase";

function PlantForm({ tentId, onClose, existing }: { tentId: number; onClose: () => void; existing?: Plant }) {
  const [name, setName] = useState(existing?.name ?? "");
  const [strain, setStrain] = useState(existing?.strain ?? "");
  const [type, setType] = useState<PlantType>(existing?.type ?? "photo");
  const [startMode, setStartMode] = useState<StartMode>("date");
  const [startDate, setStartDate] = useState(existing?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [phaseStage, setPhaseStage] = useState<Stage>("vegetative");
  const [phaseWeek, setPhaseWeek] = useState("1");
  const [waterIntervalDays, setWaterIntervalDays] = useState(existing?.waterIntervalDays?.toString() ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  const computedStartDate =
    startMode === "phase"
      ? startDateFromPhase(phaseStage, Number(phaseWeek) || 1)
      : new Date(startDate);

  async function save() {
    if (!name.trim()) return;
    const payload: Plant = {
      tentId,
      name: name.trim(),
      strain: strain || undefined,
      type,
      startDate: computedStartDate.toISOString(),
      waterIntervalDays: waterIntervalDays ? Number(waterIntervalDays) : undefined,
      notes: notes || undefined,
      archived: existing?.archived ?? false,
    };
    if (existing?.id) {
      await db.plants.update(existing.id, payload);
    } else {
      await db.plants.add(payload);
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{existing ? "Pflanze bearbeiten" : "Neue Pflanze"}</h2>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Pflanze #1" autoFocus />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Sorte / Strain</label>
            <input value={strain} onChange={(e) => setStrain(e.target.value)} placeholder="z.B. White Widow" />
          </div>
          <div className="form-group">
            <label>Typ</label>
            <select value={type} onChange={(e) => setType(e.target.value as PlantType)}>
              <option value="photo">{PLANT_TYPE_LABELS.photo}</option>
              <option value="auto">{PLANT_TYPE_LABELS.auto}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Wo steht die Pflanze aktuell?</label>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className={`chip${startMode === "date" ? " stage-vegetative" : ""}`}
              onClick={() => setStartMode("date")}
              style={{ flex: 1 }}
            >
              📅 Keimdatum bekannt
            </button>
            <button
              type="button"
              className={`chip${startMode === "phase" ? " stage-vegetative" : ""}`}
              onClick={() => setStartMode("phase")}
              style={{ flex: 1 }}
            >
              🌿 Ist schon in einer Phase
            </button>
          </div>
        </div>

        {startMode === "date" ? (
          <div className="form-group">
            <label>Startdatum (Keimung)</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        ) : (
          <div className="form-row">
            <div className="form-group">
              <label>Aktuelle Phase</label>
              <select value={phaseStage} onChange={(e) => setPhaseStage(e.target.value as Stage)}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Woche in dieser Phase</label>
              <input
                type="number"
                min={1}
                value={phaseWeek}
                onChange={(e) => setPhaseWeek(e.target.value)}
                placeholder="z.B. 3"
              />
            </div>
          </div>
        )}
        {startMode === "phase" && (
          <div className="muted" style={{ marginTop: -6, marginBottom: 10 }}>
            Der Plan startet dann automatisch ab {STAGE_LABELS[phaseStage]}, Woche {phaseWeek || 1} — errechnetes Keimdatum: {computedStartDate.toLocaleDateString("de-DE")}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Gieß-Intervall (Tage)</label>
            <input type="number" value={waterIntervalDays} onChange={(e) => setWaterIntervalDays(e.target.value)} placeholder="z.B. 3" />
          </div>
        </div>
        <div className="form-group">
          <label>Notizen</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={save}>Speichern</button>
        </div>
      </div>
    </div>
  );
}

function MoveTentModal({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  const [targetId, setTargetId] = useState<number | undefined>(undefined);

  async function move() {
    if (!targetId || !plant.id) return;
    await db.plants.update(plant.id, { tentId: targetId });
    await db.logs.add({ plantId: plant.id, type: "move", date: new Date().toISOString(), note: `Umgezogen in anderes Zelt` });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{plant.name} umziehen</h2>
        <div className="form-group">
          <label>Zielzelt</label>
          <select value={targetId ?? ""} onChange={(e) => setTargetId(Number(e.target.value))}>
            <option value="" disabled>Zelt wählen…</option>
            {tents?.filter((t) => t.id !== plant.tentId).map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={move} disabled={!targetId}>Umziehen</button>
        </div>
      </div>
    </div>
  );
}

export default function TentDetailPage() {
  const { tentId } = useParams();
  const id = Number(tentId);
  const navigate = useNavigate();
  const tent = useLiveQuery(() => db.tents.get(id), [id]);
  const plants = useLiveQuery(() => db.plants.where("tentId").equals(id).toArray(), [id]);
  const plans = useLiveQuery(() => db.weekPlans.toArray(), []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plant | undefined>(undefined);
  const [movingPlant, setMovingPlant] = useState<Plant | undefined>(undefined);

  async function deleteTent() {
    if (!confirm("Zelt und alle zugehörigen Pflanzen/Pläne löschen?")) return;
    const relatedPlants = await db.plants.where("tentId").equals(id).toArray();
    for (const p of relatedPlants) {
      if (p.id) {
        await db.weekPlans.where("plantId").equals(p.id).delete();
        await db.logs.where("plantId").equals(p.id).delete();
      }
    }
    await db.plants.where("tentId").equals(id).delete();
    await db.tents.delete(id);
    navigate("/tents");
  }

  if (!tent) return null;

  return (
    <div>
      <div className="app-header">
        <h1>🏕️ {tent.name}</h1>
      </div>
      <div className="app-main">
        <div className="card">
          <div className="card-title">
            Zeltdaten
            <button className="icon-btn danger" onClick={deleteTent}>🗑️</button>
          </div>
          <div className="muted">
            {tent.widthCm && tent.depthCm && tent.heightCm
              ? `${tent.widthCm}×${tent.depthCm}×${tent.heightCm} cm`
              : "Keine Maße hinterlegt"}
          </div>
          {tent.lightType && <div className="muted">{tent.lightType} {tent.lightWattage ? `· ${tent.lightWattage}W` : ""}{tent.lightCycle ? ` · ${tent.lightCycle}` : ""}</div>}
          {tent.climateNotes && <div className="muted">{tent.climateNotes}</div>}
          <div style={{ marginTop: 10 }}>
            <Link to="/vpd" className="chip">💧 VPD-Rechner öffnen</Link>
          </div>
        </div>

        <h3 style={{ marginTop: 20 }}>🌿 Pflanzen in diesem Zelt</h3>
        {plants && plants.length === 0 && (
          <div className="empty-state">
            <div className="icon">🌱</div>
            <p>Noch keine Pflanze zugeordnet.</p>
          </div>
        )}
        {plants?.map((plant) => {
          const week = currentWeekFor(plant);
          const stage = plans ? currentStageFor(plant, plans) : undefined;
          return (
            <div className="card" key={plant.id}>
              <div className="card-title">
                <Link to={`/plants/${plant.id}`} style={{ color: "inherit" }}>{plant.name}</Link>
                <span className="chip">{plant.type ? PLANT_TYPE_LABELS[plant.type] : "—"}</span>
              </div>
              {plant.strain && <div className="muted">{plant.strain}</div>}
              <div className="muted">
                Woche {week}{stage ? ` · ${STAGE_LABELS[stage]}` : ""} · seit {new Date(plant.startDate).toLocaleDateString("de-DE")}
              </div>
              <div style={{ marginTop: 8 }}>
                <button className="btn secondary" onClick={() => setMovingPlant(plant)}>↔️ Zelt wechseln</button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn btn-fab" onClick={() => { setEditing(undefined); setShowForm(true); }}>＋</button>
      {showForm && <PlantForm tentId={id} existing={editing} onClose={() => setShowForm(false)} />}
      {movingPlant && <MoveTentModal plant={movingPlant} onClose={() => setMovingPlant(undefined)} />}
    </div>
  );
}
