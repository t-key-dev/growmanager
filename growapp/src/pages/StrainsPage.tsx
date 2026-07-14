import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import type { Strain, StrainType, PlantType, Difficulty } from "../types";
import { STRAIN_TYPE_LABELS, DIFFICULTY_LABELS, PLANT_TYPE_LABELS } from "../types";
import { SEED_STRAINS } from "../strainDatabase";

function StrainForm({ existing, onClose }: { existing?: Strain; onClose: () => void }) {
  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState<StrainType>(existing?.type ?? "hybrid");
  const [genetics, setGenetics] = useState(existing?.genetics ?? "");
  const [plantType, setPlantType] = useState<PlantType>(existing?.plantType ?? "photo");
  const [floweringDays, setFloweringDays] = useState(existing?.floweringDays?.toString() ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? "mittel");
  const [yieldIndoor, setYieldIndoor] = useState(existing?.yieldIndoor ?? "");
  const [thc, setThc] = useState(existing?.thc ?? "");
  const [cbd, setCbd] = useState(existing?.cbd ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [aroma, setAroma] = useState(existing?.aroma ?? "");
  const [effect, setEffect] = useState(existing?.effect ?? "");

  async function save() {
    if (!name.trim()) return;
    const payload: Strain = {
      name: name.trim(),
      type,
      genetics: genetics || undefined,
      plantType,
      floweringDays: floweringDays ? Number(floweringDays) : undefined,
      difficulty,
      yieldIndoor: yieldIndoor || undefined,
      thc: thc || undefined,
      cbd: cbd || undefined,
      description: description || undefined,
      aroma: aroma || undefined,
      effect: effect || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    if (existing?.id) {
      await db.strains.update(existing.id, payload);
    } else {
      await db.strains.add(payload);
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{existing ? "Strain bearbeiten" : "Neuer Strain"}</h2>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. White Widow" autoFocus />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Typ</label>
            <select value={type} onChange={(e) => setType(e.target.value as StrainType)}>
              <option value="indica">Indica</option>
              <option value="sativa">Sativa</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-group">
            <label>Pflanzentyp</label>
            <select value={plantType} onChange={(e) => setPlantType(e.target.value as PlantType)}>
              <option value="photo">{PLANT_TYPE_LABELS.photo}</option>
              <option value="auto">{PLANT_TYPE_LABELS.auto}</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Genetik</label>
          <input value={genetics} onChange={(e) => setGenetics(e.target.value)} placeholder="z.B. 60% Indica / 40% Sativa" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Blütetage</label>
            <input type="number" value={floweringDays} onChange={(e) => setFloweringDays(e.target.value)} placeholder="z.B. 60" />
          </div>
          <div className="form-group">
            <label>Schwierigkeit</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
              <option value="leicht">🟢 Leicht</option>
              <option value="mittel">🟡 Mittel</option>
              <option value="schwer">🔴 Schwer</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Ertrag Indoor</label>
            <input value={yieldIndoor} onChange={(e) => setYieldIndoor(e.target.value)} placeholder="z.B. 400-500g/m²" />
          </div>
          <div className="form-group">
            <label>THC</label>
            <input value={thc} onChange={(e) => setThc(e.target.value)} placeholder="z.B. 18-22%" />
          </div>
        </div>
        <div className="form-group">
          <label>CBD</label>
          <input value={cbd} onChange={(e) => setCbd(e.target.value)} placeholder="z.B. <1%" />
        </div>
        <div className="form-group">
          <label>Beschreibung</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Kurze Beschreibung..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Aroma</label>
            <input value={aroma} onChange={(e) => setAroma(e.target.value)} placeholder="z.B. erdig, citrus" />
          </div>
          <div className="form-group">
            <label>Effekt</label>
            <input value={effect} onChange={(e) => setEffect(e.target.value)} placeholder="z.B. entspannend" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={save}>Speichern</button>
        </div>
      </div>
    </div>
  );
}

export default function StrainsPage() {
  const dbStrains = useLiveQuery(() => db.strains.toArray(), []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Strain | undefined>(undefined);
  const [filter, setFilter] = useState<StrainType | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Strain | undefined>(undefined);
  const [seeded, setSeeded] = useState(false);

  // Seed built-in strains on first visit or when database is outdated
  useEffect(() => {
    if (seeded) return;
    (async () => {
      const count = await db.strains.count();
      // Re-seed if empty OR if we have fewer strains than the new database
      if (count === 0 || count < SEED_STRAINS.length) {
        // Clear old strains and add all new ones
        await db.strains.clear();
        const toAdd = SEED_STRAINS.map((s) => ({ ...s, createdAt: new Date().toISOString() }));
        await db.strains.bulkAdd(toAdd);
      }
      setSeeded(true);
    })();
  }, [seeded]);

  const allStrains = dbStrains ?? [];
  const filtered = allStrains.filter((s) => {
    if (filter !== "all" && s.type !== filter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.aroma ?? "").toLowerCase().includes(q) ||
        (s.effect ?? "").toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function deleteStrain(id: number) {
    if (!confirm("Strain aus der Datenbank löschen?")) return;
    await db.strains.delete(id);
    setSelected(undefined);
  }

  const typeColor = (t: StrainType) => {
    if (t === "indica") return "#a78bfa";
    if (t === "sativa") return "#fbbf24";
    return "#4ade80";
  };

  return (
    <div>
      <div className="app-header">
        <h1>🌱 Strain-Datenbank</h1>
      </div>
      <div className="app-main">
        <div className="form-group">
          <input
            placeholder="Strain suchen… (Name, Aroma, Effekt)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {(["all", "indica", "sativa", "hybrid"] as const).map((t) => (
            <button
              key={t}
              className={`chip${filter === t ? " stage-vegetative" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t === "all" ? "Alle" : STRAIN_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="icon">🌱</div>
            <p>Keine Strains gefunden.</p>
          </div>
        )}

        {filtered.map((strain) => (
          <div
            className="card"
            key={strain.id}
            onClick={() => setSelected(strain)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-title">
              <span>{strain.name}</span>
              <span className="chip" style={{ color: typeColor(strain.type) }}>
                {STRAIN_TYPE_LABELS[strain.type]}
              </span>
            </div>
            <div className="muted">
              {strain.plantType === "auto" ? "🔄 Auto" : "📸 Photo"}
              {strain.floweringDays ? ` · 🌸 ${strain.floweringDays} Tage` : ""}
              {strain.difficulty ? ` · ${DIFFICULTY_LABELS[strain.difficulty]}` : ""}
            </div>
            {strain.aroma && <div className="muted">👃 {strain.aroma}</div>}
          </div>
        ))}
      </div>

      <button className="btn btn-fab" onClick={() => { setEditing(undefined); setShowForm(true); }}>＋</button>

      {showForm && (
        <StrainForm existing={editing} onClose={() => setShowForm(false)} />
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(undefined)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.name}</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span className="chip" style={{ color: typeColor(selected.type) }}>
                {STRAIN_TYPE_LABELS[selected.type]}
              </span>
              {selected.plantType && (
                <span className="chip">{selected.plantType === "auto" ? "🔄 Auto" : "📸 Photo"}</span>
              )}
              {selected.difficulty && <span className="chip">{DIFFICULTY_LABELS[selected.difficulty]}</span>}
            </div>
            {selected.genetics && <div className="muted">🧬 {selected.genetics}</div>}
            {selected.floweringDays && <div className="muted">🌸 Blüte: ~{selected.floweringDays} Tage</div>}
            {selected.yieldIndoor && <div className="muted">📦 Ertrag: {selected.yieldIndoor}</div>}
            {selected.thc && <div className="muted">🧪 THC: {selected.thc}</div>}
            {selected.cbd && <div className="muted">💊 CBD: {selected.cbd}</div>}
            {selected.description && <p style={{ marginTop: 12 }}>{selected.description}</p>}
            {selected.aroma && <div style={{ marginTop: 8 }}><strong>👃 Aroma:</strong> {selected.aroma}</div>}
            {selected.effect && <div><strong>✨ Effekt:</strong> {selected.effect}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                className="btn secondary"
                style={{ flex: 1 }}
                onClick={() => { setEditing(selected); setShowForm(true); setSelected(undefined); }}
              >
                ✏️ Bearbeiten
              </button>
              <button
                className="btn danger"
                style={{ flex: 1 }}
                onClick={() => deleteStrain(selected.id!)}
              >
                🗑️ Löschen
              </button>
            </div>
            <a
              href={`https://en.seedfinder.eu/search.html?search=${encodeURIComponent(selected.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn secondary"
              style={{ width: "100%", marginTop: 8, textAlign: "center", display: "block" }}
            >
              🔍 Auf Seedfinder.eu suchen
            </a>
            <button
              className="btn secondary"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setSelected(undefined)}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
