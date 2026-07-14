import { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import type { CostEntry, CostCategory } from "../types";
import { COST_CATEGORY_LABELS, COST_CATEGORIES } from "../types";

function CostForm({ existing, plantNames, onClose }: { existing?: CostEntry; plantNames: { id: number; name: string }[]; onClose: () => void }) {
  const [category, setCategory] = useState<CostCategory>(existing?.category ?? "duenger");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [amount, setAmount] = useState(existing?.amount?.toString() ?? "");
  const [date, setDate] = useState(existing?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [plantId, setPlantId] = useState<number | undefined>(existing?.plantId);
  const [recurring, setRecurring] = useState(existing?.recurring ?? false);

  async function save() {
    if (!amount || Number(amount) <= 0) return;
    const payload: CostEntry = {
      category,
      description: description || COST_CATEGORY_LABELS[category],
      amount: Number(amount),
      date: new Date(date).toISOString(),
      plantId: plantId || undefined,
      recurring,
    };
    if (existing?.id) {
      await db.costs.update(existing.id, payload);
    } else {
      await db.costs.add(payload);
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{existing ? "Kosten bearbeiten" : "Neue Kosten"}</h2>
        <div className="form-group">
          <label>Kategorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as CostCategory)}>
            {COST_CATEGORIES.map((c) => (
              <option key={c} value={c}>{COST_CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Beschreibung</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="z.B. Advanced Nutrients Bloom" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Betrag (€)</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="z.B. 29.99" autoFocus />
          </div>
          <div className="form-group">
            <label>Datum</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Pflanze (optional)</label>
          <select value={plantId ?? ""} onChange={(e) => setPlantId(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">— Allgemein —</option>
            {plantNames.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} style={{ width: "auto" }} />
            Monatlich wiederkehrend (z.B. Strom)
          </label>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={save}>Speichern</button>
        </div>
      </div>
    </div>
  );
}

export default function CostsPage() {
  const costs = useLiveQuery(() => db.costs.reverse().sortBy("date"), []);
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CostEntry | undefined>(undefined);
  const [filterCat, setFilterCat] = useState<CostCategory | "all">("all");

  const plantNames = useMemo(
    () => plants?.map((p) => ({ id: p.id!, name: p.name })) ?? [],
    [plants],
  );

  const filtered = useMemo(() => {
    if (!costs) return [];
    if (filterCat === "all") return costs;
    return costs.filter((c) => c.category === filterCat);
  }, [costs, filterCat]);

  const totalFiltered = filtered.reduce((sum, c) => sum + c.amount, 0);
  const totalAll = costs?.reduce((sum, c) => sum + c.amount, 0) ?? 0;

  // Category breakdown
  const breakdown = useMemo(() => {
    if (!costs) return {};
    const map: Record<string, number> = {};
    for (const c of costs) {
      map[c.category] = (map[c.category] ?? 0) + c.amount;
    }
    return map;
  }, [costs]);

  async function deleteCost(id: number) {
    if (!confirm("Diesen Kosten-Eintrag löschen?")) return;
    await db.costs.delete(id);
  }

  return (
    <div>
      <div className="app-header">
        <h1>💰 Kosten-Tracker</h1>
      </div>
      <div className="app-main">
        {/* Summary */}
        <div className="card">
          <div className="card-title">Gesamtübersicht</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, textAlign: "center", padding: "8px 0" }}>
            {totalAll.toFixed(2)} €
          </div>
          {Object.keys(breakdown).length > 0 && (
            <div style={{ marginTop: 8 }}>
              {COST_CATEGORIES.filter((c) => breakdown[c]).map((c) => (
                <div className="event-row" key={c}>
                  <span>{COST_CATEGORY_LABELS[c]}</span>
                  <span style={{ fontWeight: 600 }}>{(breakdown[c] ?? 0).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            className={`chip${filterCat === "all" ? " stage-vegetative" : ""}`}
            onClick={() => setFilterCat("all")}
          >
            Alle
          </button>
          {COST_CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip${filterCat === c ? " stage-vegetative" : ""}`}
              onClick={() => setFilterCat(c)}
            >
              {COST_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="muted" style={{ marginBottom: 8 }}>
          {filtered.length} Einträge · {totalFiltered.toFixed(2)} €
        </div>

        {/* Entries */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="icon">💰</div>
            <p>Noch keine Kosten erfasst.</p>
          </div>
        )}

        {filtered.map((cost) => (
          <div className="card" key={cost.id}>
            <div className="card-title">
              <span>{cost.description}</span>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{cost.amount.toFixed(2)} €</span>
            </div>
            <div className="muted">
              {COST_CATEGORY_LABELS[cost.category]}
              {cost.recurring ? " · 🔄 monatlich" : ""}
              {" · "}{new Date(cost.date).toLocaleDateString("de-DE")}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => { setEditing(cost); setShowForm(true); }}>✏️</button>
              <button className="btn danger" onClick={() => deleteCost(cost.id!)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-fab" onClick={() => { setEditing(undefined); setShowForm(true); }}>＋</button>

      {showForm && (
        <CostForm existing={editing} plantNames={plantNames} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
