import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { db } from "../db";
import type { Tent } from "../types";

function TentForm({ onClose, existing }: { onClose: () => void; existing?: Tent }) {
  const [name, setName] = useState(existing?.name ?? "");
  const [widthCm, setWidthCm] = useState(existing?.widthCm?.toString() ?? "");
  const [depthCm, setDepthCm] = useState(existing?.depthCm?.toString() ?? "");
  const [heightCm, setHeightCm] = useState(existing?.heightCm?.toString() ?? "");
  const [lightType, setLightType] = useState(existing?.lightType ?? "");
  const [lightWattage, setLightWattage] = useState(existing?.lightWattage?.toString() ?? "");
  const [lightCycle, setLightCycle] = useState(existing?.lightCycle ?? "");
  const [climateNotes, setClimateNotes] = useState(existing?.climateNotes ?? "");

  async function save() {
    if (!name.trim()) return;
    const payload: Tent = {
      name: name.trim(),
      widthCm: widthCm ? Number(widthCm) : undefined,
      depthCm: depthCm ? Number(depthCm) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      lightType: lightType || undefined,
      lightWattage: lightWattage ? Number(lightWattage) : undefined,
      lightCycle: lightCycle || undefined,
      climateNotes: climateNotes || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    if (existing?.id) {
      await db.tents.update(existing.id, payload);
    } else {
      await db.tents.add(payload);
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{existing ? "Zelt bearbeiten" : "Neues Zelt"}</h2>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Zelt 1 - Blüte" autoFocus />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Breite (cm)</label>
            <input type="number" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tiefe (cm)</label>
            <input type="number" value={depthCm} onChange={(e) => setDepthCm(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Höhe (cm)</label>
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Lampentyp</label>
            <input value={lightType} onChange={(e) => setLightType(e.target.value)} placeholder="z.B. LED Vollspektrum" />
          </div>
          <div className="form-group">
            <label>Leistung (W)</label>
            <input type="number" value={lightWattage} onChange={(e) => setLightWattage(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Lichtzyklus</label>
            <input value={lightCycle} onChange={(e) => setLightCycle(e.target.value)} placeholder="z.B. 18/6 oder 12/12" />
          </div>
        </div>
        <div className="form-group">
          <label>Klimageräte / Notizen</label>
          <textarea value={climateNotes} onChange={(e) => setClimateNotes(e.target.value)} rows={2} placeholder="z.B. 2x Befeuchter, 1x Entfeuchter" />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={save}>Speichern</button>
        </div>
      </div>
    </div>
  );
}

export default function TentsPage() {
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tent | undefined>(undefined);

  const plantCountFor = (tentId?: number) => plants?.filter((p) => p.tentId === tentId && !p.archived).length ?? 0;

  return (
    <div>
      <div className="app-header">
        <h1>🏕️ Zelte</h1>
      </div>
      <div className="app-main">
        {tents && tents.length === 0 && (
          <div className="empty-state">
            <div className="icon">🏕️</div>
            <p>Noch keine Zelte angelegt.<br />Leg dein erstes Growzelt an!</p>
          </div>
        )}
        {tents?.map((tent) => (
          <div className="card" key={tent.id}>
            <div className="card-title">
              <Link to={`/tents/${tent.id}`} style={{ color: "inherit" }}>{tent.name}</Link>
              <button className="icon-btn" onClick={() => { setEditing(tent); setShowForm(true); }}>✏️</button>
            </div>
            <div className="muted">
              {tent.widthCm && tent.depthCm && tent.heightCm
                ? `${tent.widthCm}×${tent.depthCm}×${tent.heightCm} cm`
                : "Keine Maße hinterlegt"}
              {tent.lightType ? ` · ${tent.lightType}${tent.lightWattage ? ` (${tent.lightWattage}W)` : ""}` : ""}
              {tent.lightCycle ? ` · ${tent.lightCycle}` : ""}
            </div>
            <div style={{ marginTop: 8 }}>
              <Link to={`/tents/${tent.id}`} className="chip">🌿 {plantCountFor(tent.id)} Pflanze(n)</Link>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-fab" onClick={() => { setEditing(undefined); setShowForm(true); }}>＋</button>
      {showForm && <TentForm existing={editing} onClose={() => setShowForm(false)} />}
    </div>
  );
}
