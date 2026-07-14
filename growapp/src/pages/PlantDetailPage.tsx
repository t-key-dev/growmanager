import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../db";
import type { FertilizerDose, Stage, WeekPlan, QualityRating } from "../types";
import { PLANT_TYPE_LABELS, STAGE_LABELS, STAGES } from "../types";
import { calculateVPD, classifyVpd } from "../vpd";
import { currentWeekFor } from "../planHelpers";

function emptyFertilizer(): FertilizerDose {
  return { name: "", doseMlPerL: undefined };
}

function WeekPlanForm({
  plantId,
  existing,
  defaultWeek,
  onClose,
}: {
  plantId: number;
  existing?: WeekPlan;
  defaultWeek: number;
  onClose: () => void;
}) {
  const [week, setWeek] = useState(existing?.week ?? defaultWeek);
  const [stage, setStage] = useState<Stage>(existing?.stage ?? "vegetative");
  const [tempDayMin, setTempDayMin] = useState(existing?.tempDayMin?.toString() ?? "");
  const [tempDayMax, setTempDayMax] = useState(existing?.tempDayMax?.toString() ?? "");
  const [tempNightMin, setTempNightMin] = useState(existing?.tempNightMin?.toString() ?? "");
  const [tempNightMax, setTempNightMax] = useState(existing?.tempNightMax?.toString() ?? "");
  const [humidityMin, setHumidityMin] = useState(existing?.humidityMin?.toString() ?? "");
  const [humidityMax, setHumidityMax] = useState(existing?.humidityMax?.toString() ?? "");
  const [lightPercent, setLightPercent] = useState(existing?.lightPercent?.toString() ?? "");
  const [lightDistanceCm, setLightDistanceCm] = useState(existing?.lightDistanceCm?.toString() ?? "");
  const [lightHoursOn, setLightHoursOn] = useState(existing?.lightHoursOn?.toString() ?? "");
  const [ecMin, setEcMin] = useState(existing?.ecMin?.toString() ?? "");
  const [ecMax, setEcMax] = useState(existing?.ecMax?.toString() ?? "");
  const [phMin, setPhMin] = useState(existing?.phMin?.toString() ?? "");
  const [phMax, setPhMax] = useState(existing?.phMax?.toString() ?? "");
  const [waterNote, setWaterNote] = useState(existing?.waterNote ?? "");
  const [fertilizers, setFertilizers] = useState<FertilizerDose[]>(
    existing?.fertilizers?.length ? existing.fertilizers : [emptyFertilizer()],
  );

  function updateFert(idx: number, patch: Partial<FertilizerDose>) {
    setFertilizers((list) => list.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }
  function addFert() {
    setFertilizers((list) => [...list, emptyFertilizer()]);
  }
  function removeFert(idx: number) {
    setFertilizers((list) => list.filter((_, i) => i !== idx));
  }

  async function save() {
    const payload: WeekPlan = {
      plantId,
      week: Number(week),
      stage,
      tempDayMin: tempDayMin ? Number(tempDayMin) : undefined,
      tempDayMax: tempDayMax ? Number(tempDayMax) : undefined,
      tempNightMin: tempNightMin ? Number(tempNightMin) : undefined,
      tempNightMax: tempNightMax ? Number(tempNightMax) : undefined,
      humidityMin: humidityMin ? Number(humidityMin) : undefined,
      humidityMax: humidityMax ? Number(humidityMax) : undefined,
      lightPercent: lightPercent ? Number(lightPercent) : undefined,
      lightDistanceCm: lightDistanceCm ? Number(lightDistanceCm) : undefined,
      lightHoursOn: lightHoursOn ? Number(lightHoursOn) : undefined,
      ecMin: ecMin ? Number(ecMin) : undefined,
      ecMax: ecMax ? Number(ecMax) : undefined,
      phMin: phMin ? Number(phMin) : undefined,
      phMax: phMax ? Number(phMax) : undefined,
      waterNote: waterNote || undefined,
      fertilizers: fertilizers.filter((f) => f.name.trim()),
    };
    if (existing?.id) {
      await db.weekPlans.put({ ...payload, id: existing.id });
    } else {
      await db.weekPlans.add(payload);
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{existing ? `Woche ${existing.week} bearbeiten` : "Neue Woche"}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Woche</label>
            <input type="number" min={1} value={week} onChange={(e) => setWeek(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Phase</label>
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
              {STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="muted" style={{ margin: "8px 0 4px" }}>Temperatur Tag (°C)</div>
        <div className="form-row">
          <div className="form-group">
            <label>Min</label>
            <input type="number" value={tempDayMin} onChange={(e) => setTempDayMin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max</label>
            <input type="number" value={tempDayMax} onChange={(e) => setTempDayMax(e.target.value)} />
          </div>
        </div>
        <div className="muted" style={{ margin: "8px 0 4px" }}>Temperatur Nacht (°C)</div>
        <div className="form-row">
          <div className="form-group">
            <label>Min</label>
            <input type="number" value={tempNightMin} onChange={(e) => setTempNightMin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max</label>
            <input type="number" value={tempNightMax} onChange={(e) => setTempNightMax(e.target.value)} />
          </div>
        </div>
        <div className="muted" style={{ margin: "8px 0 4px" }}>Luftfeuchtigkeit (%)</div>
        <div className="form-row">
          <div className="form-group">
            <label>Min</label>
            <input type="number" value={humidityMin} onChange={(e) => setHumidityMin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max</label>
            <input type="number" value={humidityMax} onChange={(e) => setHumidityMax(e.target.value)} />
          </div>
        </div>

        {tempDayMin && tempDayMax && humidityMin && humidityMax && (
          <VpdPreview
            tempMin={Number(tempDayMin)}
            tempMax={Number(tempDayMax)}
            humidityMin={Number(humidityMin)}
            humidityMax={Number(humidityMax)}
            stage={stage}
          />
        )}

        <div className="muted" style={{ margin: "8px 0 4px" }}>Licht</div>
        <div className="form-row">
          <div className="form-group">
            <label>Leistung (%)</label>
            <input type="number" value={lightPercent} onChange={(e) => setLightPercent(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Abstand (cm)</label>
            <input type="number" value={lightDistanceCm} onChange={(e) => setLightDistanceCm(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Std./Tag</label>
            <input type="number" value={lightHoursOn} onChange={(e) => setLightHoursOn(e.target.value)} />
          </div>
        </div>

        <div className="muted" style={{ margin: "8px 0 4px" }}>EC</div>
        <div className="form-row">
          <div className="form-group">
            <label>Min</label>
            <input type="number" step="0.1" value={ecMin} onChange={(e) => setEcMin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max</label>
            <input type="number" step="0.1" value={ecMax} onChange={(e) => setEcMax(e.target.value)} />
          </div>
        </div>
        <div className="muted" style={{ margin: "8px 0 4px" }}>pH</div>
        <div className="form-row">
          <div className="form-group">
            <label>Min</label>
            <input type="number" step="0.1" value={phMin} onChange={(e) => setPhMin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max</label>
            <input type="number" step="0.1" value={phMax} onChange={(e) => setPhMax(e.target.value)} />
          </div>
        </div>

        <div className="muted" style={{ margin: "12px 0 4px" }}>🧪 Dünger dieser Woche</div>
        {fertilizers.map((f, idx) => (
          <div className="form-row" key={idx} style={{ alignItems: "center" }}>
            <div className="form-group" style={{ flex: 2 }}>
              <input
                placeholder="Produktname (z.B. Bloom)"
                value={f.name}
                onChange={(e) => updateFert(idx, { name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <input
                type="number"
                step="0.1"
                placeholder="ml/L"
                value={f.doseMlPerL ?? ""}
                onChange={(e) => updateFert(idx, { doseMlPerL: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <button className="icon-btn danger" onClick={() => removeFert(idx)} style={{ marginTop: -4 }}>✕</button>
          </div>
        ))}
        <button className="btn secondary" onClick={addFert} style={{ marginBottom: 12 }}>＋ Dünger hinzufügen</button>

        <div className="form-group">
          <label>Notiz zum Gießen</label>
          <input value={waterNote} onChange={(e) => setWaterNote(e.target.value)} placeholder="z.B. nur Wasser, Spülen" />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={save}>Speichern</button>
        </div>
      </div>
    </div>
  );
}

function VpdPreview({ tempMin, tempMax, humidityMin, humidityMax, stage }: { tempMin: number; tempMax: number; humidityMin: number; humidityMax: number; stage: string }) {
  const avgTemp = (tempMin + tempMax) / 2;
  const avgHum = (humidityMin + humidityMax) / 2;
  const result = calculateVPD(avgTemp, avgHum);
  const cls = classifyVpd(result.vpdKpa, stage);
  return (
    <div className="muted" style={{ marginBottom: 8 }}>
      Ø VPD (Tag) bei diesen Werten: <strong style={{ color: cls.color }}>{result.vpdKpa.toFixed(2)} kPa</strong> – {cls.label}
    </div>
  );
}

function fertSummary(plan: WeekPlan): string {
  if (!plan.fertilizers?.length) return plan.waterNote || "nur Wasser";
  return plan.fertilizers.map((f) => (f.doseMlPerL ? `${f.name} ${f.doseMlPerL}ml/L` : f.name)).join(" · ");
}

// ─── Photo Upload ────────────────────────────────────────────────────────────

function PhotoUpload({ plantId, onClose }: { plantId: number; onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      // Resize to max 1200px width to save storage
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxW) {
          h = Math.round((h * maxW) / w);
          w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        setPreview(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!preview) return;
    const week = currentWeekFor({ id: plantId, startDate: new Date().toISOString() } as any);
    await db.photos.add({
      plantId,
      dataUrl: preview,
      caption: caption || undefined,
      date: new Date().toISOString(),
      week,
    });
    await db.logs.add({
      plantId,
      type: "photo",
      date: new Date().toISOString(),
      note: caption || "Foto aufgenommen",
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>📸 Foto aufnehmen</h2>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {!preview ? (
          <button
            className="btn secondary"
            style={{ width: "100%", padding: 20, fontSize: "1.1rem" }}
            onClick={() => fileRef.current?.click()}
          >
            📷 Kamera öffnen / Bild wählen
          </button>
        ) : (
          <>
            <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: 12, marginBottom: 12 }} />
            <div className="form-group">
              <label>Beschriftung (optional)</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="z.B. Woche 5, erste Pistile" />
            </div>
          </>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          {preview && <button className="btn" style={{ flex: 1 }} onClick={save}>💾 Speichern</button>}
        </div>
      </div>
    </div>
  );
}

// ─── Harvest Form ────────────────────────────────────────────────────────────

function HarvestForm({ plantId, onClose }: { plantId: number; onClose: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [wetWeightG, setWetWeightG] = useState("");
  const [dryWeightG, setDryWeightG] = useState("");
  const [quality, setQuality] = useState<QualityRating | undefined>(undefined);
  const [aroma, setAroma] = useState("");
  const [effect, setEffect] = useState("");
  const [notes, setNotes] = useState("");

  async function save() {
    await db.harvests.add({
      plantId,
      date: new Date(date).toISOString(),
      wetWeightG: wetWeightG ? Number(wetWeightG) : undefined,
      dryWeightG: dryWeightG ? Number(dryWeightG) : undefined,
      quality,
      aroma: aroma || undefined,
      effect: effect || undefined,
      notes: notes || undefined,
    });
    // Mark plant as harvested
    await db.plants.update(plantId, { harvestDate: new Date(date).toISOString() });
    await db.logs.add({
      plantId,
      type: "harvest",
      date: new Date(date).toISOString(),
      note: `Geerntet${dryWeightG ? ` – ${dryWeightG}g trocken` : ""}`,
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h2>✂️ Ernte erfassen</h2>
        <div className="form-group">
          <label>Erntedatum</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Nassgewicht (g)</label>
            <input type="number" value={wetWeightG} onChange={(e) => setWetWeightG(e.target.value)} placeholder="z.B. 350" />
          </div>
          <div className="form-group">
            <label>Trockengewicht (g)</label>
            <input type="number" value={dryWeightG} onChange={(e) => setDryWeightG(e.target.value)} placeholder="z.B. 120" />
          </div>
        </div>
        <div className="form-group">
          <label>Qualität</label>
          <div style={{ display: "flex", gap: 8 }}>
            {([1, 2, 3, 4, 5] as QualityRating[]).map((q) => (
              <button
                key={q}
                className={`chip${quality === q ? " stage-vegetative" : ""}`}
                onClick={() => setQuality(q)}
                style={{ flex: 1, justifyContent: "center", fontSize: "1rem" }}
              >
                {"⭐".repeat(q)}
              </button>
            ))}
          </div>
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
        <div className="form-group">
          <label>Notizen</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Trimmaufwand, Besonderheiten..." />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>Abbrechen</button>
          <button className="btn" style={{ flex: 1 }} onClick={save}>💾 Speichern</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PlantDetailPage() {
  const { plantId } = useParams();
  const id = Number(plantId);
  const navigate = useNavigate();
  const plant = useLiveQuery(() => db.plants.get(id), [id]);
  const plans = useLiveQuery(() => db.weekPlans.where("plantId").equals(id).sortBy("week"), [id]);
  const logs = useLiveQuery(() => db.logs.where("plantId").equals(id).reverse().sortBy("date"), [id]);
  const photos = useLiveQuery(() => db.photos.where("plantId").equals(id).reverse().sortBy("date"), [id]);
  const harvests = useLiveQuery(() => db.harvests.where("plantId").equals(id).toArray(), [id]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WeekPlan | undefined>(undefined);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  async function logAction(type: "water" | "fertilize") {
    await db.logs.add({ plantId: id, type, date: new Date().toISOString() });
  }

  async function deletePlant() {
    if (!confirm("Pflanze und ihren Grow-Plan löschen?")) return;
    await db.weekPlans.where("plantId").equals(id).delete();
    await db.logs.where("plantId").equals(id).delete();
    await db.photos.where("plantId").equals(id).delete();
    await db.harvests.where("plantId").equals(id).delete();
    await db.plants.delete(id);
    navigate(-1);
  }

  async function deleteWeekPlan(planId?: number) {
    if (!planId) return;
    if (!confirm("Diese Woche aus dem Plan löschen?")) return;
    await db.weekPlans.delete(planId);
  }

  async function deletePhoto(photoId?: number) {
    if (!photoId) return;
    if (!confirm("Foto löschen?")) return;
    await db.photos.delete(photoId);
    setPhotoIndex(null);
  }

  if (!plant) return null;

  const week = currentWeekFor(plant);
  const nextWeekNumber = (plans?.[plans.length - 1]?.week ?? 0) + 1;
  const isHarvested = !!plant.harvestDate;

  return (
    <div>
      <div className="app-header">
        <h1>🌿 {plant.name}</h1>
      </div>
      <div className="app-main">
        <div className="card">
          <div className="card-title">
            Übersicht
            <button className="icon-btn danger" onClick={deletePlant}>🗑️</button>
          </div>
          {plant.strain && <div className="muted">Sorte: {plant.strain}</div>}
          <div className="muted">Typ: {plant.type ? PLANT_TYPE_LABELS[plant.type] : "—"}</div>
          <div className="muted">
            {isHarvested
              ? `✂️ Geerntet am ${new Date(plant.harvestDate!).toLocaleDateString("de-DE")}`
              : `Aktuell: Woche ${week}`
            }
          </div>
          <div className="muted">Seit {new Date(plant.startDate).toLocaleDateString("de-DE")}</div>
          {plant.notes && <div className="muted" style={{ marginTop: 6 }}>{plant.notes}</div>}
          {!isHarvested && (
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => logAction("water")}>💧 Gegossen</button>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => logAction("fertilize")}>🌱 Gedüngt</button>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <button className="btn secondary" style={{ flex: 1 }} onClick={() => setShowPhoto(true)}>📸 Foto</button>
            {!isHarvested && (
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => setShowHarvest(true)}>✂️ Ernte</button>
            )}
            <Link to={`/plants/${id}/timeline`} className="btn secondary" style={{ flex: 1, textAlign: "center" }}>📝 Tagebuch</Link>
          </div>
        </div>

        {/* Photos Gallery */}
        {photos && photos.length > 0 && (
          <>
            <h3 style={{ marginTop: 16 }}>📸 Fotos ({photos.length})</h3>
            <div className="photo-grid">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="photo-thumb"
                  onClick={() => setPhotoIndex(idx)}
                >
                  <img src={photo.dataUrl} alt={photo.caption ?? "Grow"} loading="lazy" />
                  <div className="photo-thumb-label">
                    W{photo.week ?? "?"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Harvests */}
        {harvests && harvests.length > 0 && (
          <>
            <h3 style={{ marginTop: 16 }}>✂️ Ernten</h3>
            {harvests.map((h) => (
              <div className="card" key={h.id}>
                <div className="card-title">
                  {new Date(h.date).toLocaleDateString("de-DE")}
                  {h.quality && <span>{"⭐".repeat(h.quality)}</span>}
                </div>
                <div className="muted">
                  {h.wetWeightG ? `${h.wetWeightG}g nass` : ""}
                  {h.wetWeightG && h.dryWeightG ? " → " : ""}
                  {h.dryWeightG ? `${h.dryWeightG}g trocken` : ""}
                </div>
                {h.aroma && <div className="muted">👃 {h.aroma}</div>}
                {h.effect && <div className="muted">✨ {h.effect}</div>}
                {h.notes && <div className="muted" style={{ marginTop: 4 }}>{h.notes}</div>}
              </div>
            ))}
          </>
        )}

        <div className="card-title" style={{ marginTop: 20 }}>
          📋 Wochenplan
          <button className="btn secondary" onClick={() => { setEditing(undefined); setShowForm(true); }}>＋ Woche</button>
        </div>
        {(!plans || plans.length === 0) && (
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>Noch kein Wochenplan angelegt.<br />Leg für jede Woche Temperatur, Feuchte, Licht, EC/pH und Dünger fest.</p>
          </div>
        )}
        {plans?.map((plan) => (
          <div className="card" key={plan.id}>
            <div className="card-title">
              Woche {plan.week} · {STAGE_LABELS[plan.stage]}
              {plan.week === week && <span className="chip stage-vegetative">aktuell</span>}
            </div>
            <div className="muted">
              {plan.tempDayMin != null && plan.tempDayMax != null ? `☀️ ${plan.tempDayMin}–${plan.tempDayMax}°C` : ""}
              {plan.tempNightMin != null && plan.tempNightMax != null ? ` · 🌙 ${plan.tempNightMin}–${plan.tempNightMax}°C` : ""}
              {plan.humidityMin != null && plan.humidityMax != null ? ` · 💦 ${plan.humidityMin}–${plan.humidityMax}%` : ""}
            </div>
            <div className="muted">
              {plan.lightPercent != null ? `💡 ${plan.lightPercent}%` : ""}
              {plan.lightDistanceCm != null ? ` @ ${plan.lightDistanceCm}cm` : ""}
              {plan.lightHoursOn != null ? ` · ${plan.lightHoursOn}h/Tag` : ""}
            </div>
            <div className="muted">
              {plan.ecMin != null && plan.ecMax != null ? `EC ${plan.ecMin}–${plan.ecMax}` : ""}
              {plan.phMin != null && plan.phMax != null ? ` · pH ${plan.phMin}–${plan.phMax}` : ""}
            </div>
            <div style={{ marginTop: 6 }}>🧪 {fertSummary(plan)}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => { setEditing(plan); setShowForm(true); }}>✏️ Bearbeiten</button>
              <button className="icon-btn danger" onClick={() => deleteWeekPlan(plan.id)}>🗑️</button>
            </div>
          </div>
        ))}

        <h3 style={{ marginTop: 20 }}>📜 Verlauf</h3>
        {(!logs || logs.length === 0) && <div className="muted">Noch keine Einträge.</div>}
        {logs?.slice(0, 20).map((log) => (
          <div className="event-row" key={log.id}>
            <span>
              {log.type === "water" ? "💧 Gegossen" : log.type === "fertilize" ? "🌱 Gedüngt" : log.type === "move" ? `↔️ ${log.note ?? "Umgezogen"}` : log.type === "photo" ? "📸 Foto" : log.type === "harvest" ? "✂️ Geerntet" : log.note}
            </span>
            <span className="muted">{new Date(log.date).toLocaleString("de-DE")}</span>
          </div>
        ))}
      </div>
      {showForm && (
        <WeekPlanForm plantId={id} existing={editing} defaultWeek={nextWeekNumber} onClose={() => setShowForm(false)} />
      )}
      {showPhoto && (
        <PhotoUpload plantId={id} onClose={() => setShowPhoto(false)} />
      )}
      {showHarvest && (
        <HarvestForm plantId={id} onClose={() => setShowHarvest(false)} />
      )}

      {/* Photo Lightbox */}
      {photoIndex !== null && photos && photos[photoIndex] && (
        <div className="modal-backdrop" onClick={() => setPhotoIndex(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "95vh" }}>
            <img
              src={photos[photoIndex].dataUrl}
              alt={photos[photoIndex].caption ?? "Grow"}
              style={{ width: "100%", borderRadius: 12 }}
            />
            <div className="muted" style={{ marginTop: 8, textAlign: "center" }}>
              Woche {photos[photoIndex].week ?? "?"} · {new Date(photos[photoIndex].date).toLocaleString("de-DE")}
            </div>
            {photos[photoIndex].caption && (
              <div style={{ textAlign: "center", marginTop: 4 }}>{photos[photoIndex].caption}</div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {photoIndex > 0 && (
                <button className="btn secondary" style={{ flex: 1 }} onClick={() => setPhotoIndex(photoIndex - 1)}>← Vorheriges</button>
              )}
              {photoIndex < photos.length - 1 && (
                <button className="btn secondary" style={{ flex: 1 }} onClick={() => setPhotoIndex(photoIndex + 1)}>Nächstes →</button>
              )}
              <button className="btn danger" onClick={() => deletePhoto(photos[photoIndex].id)}>🗑️</button>
            </div>
            <button className="btn secondary" style={{ width: "100%", marginTop: 8 }} onClick={() => setPhotoIndex(null)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
}
