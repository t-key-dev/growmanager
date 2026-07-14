import { useMemo, useState } from "react";
import { DIAGNOSIS_CATEGORY_LABELS, DIAGNOSIS_ENTRIES, type DiagnosisEntry } from "../diagnosisData";

const CATEGORIES: DiagnosisEntry["category"][] = ["mangel", "krankheit", "schaedling"];

export default function DiagnosisPage() {
  const [filter, setFilter] = useState<DiagnosisEntry["category"] | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DiagnosisEntry | undefined>(undefined);

  const filtered = useMemo(() => {
    return DIAGNOSIS_ENTRIES.filter((e) => {
      if (filter !== "all" && e.category !== filter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return e.symptom.toLowerCase().includes(q) || e.cause.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filter, query]);

  return (
    <div>
      <div className="app-header">
        <h1>🩺 Diagnose</h1>
      </div>
      <div className="app-main">
        <div className="form-group">
          <input
            placeholder="Symptom suchen… (z.B. gelb, Sprenkel, Schimmel)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <button className={`chip${filter === "all" ? " stage-vegetative" : ""}`} onClick={() => setFilter("all")}>
            Alle
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip${filter === c ? " stage-vegetative" : ""}`} onClick={() => setFilter(c)}>
              {DIAGNOSIS_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {filtered.length === 0 && <div className="muted">Kein Treffer für diese Suche.</div>}

        {filtered.map((entry) => (
          <div className="card" key={entry.id} onClick={() => setSelected(entry)} style={{ cursor: "pointer", display: "flex", gap: 12 }}>
            {entry.image && (
              <img
                src={entry.image}
                alt={entry.symptom}
                style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                loading="lazy"
              />
            )}
            <div>
              <div className="card-title" style={{ marginBottom: 2 }}>{entry.symptom}</div>
              <div className="muted">{entry.cause}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(undefined)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            {selected.image && (
              <img
                src={selected.image}
                alt={selected.symptom}
                style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, marginBottom: 12 }}
              />
            )}
            <h2>{selected.symptom}</h2>
            <div className="muted" style={{ marginBottom: 8 }}>
              <strong>Ursache:</strong> {selected.cause}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Was tun:</strong> {selected.advice}
            </div>
            <button className="btn secondary" style={{ width: "100%" }} onClick={() => setSelected(undefined)}>
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
