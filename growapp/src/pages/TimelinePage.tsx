import { useLiveQuery } from "dexie-react-hooks";
import { Link, useParams } from "react-router-dom";
import { db } from "../db";

export default function TimelinePage() {
  const { plantId } = useParams();
  const id = Number(plantId);
  const plant = useLiveQuery(() => db.plants.get(id), [id]);
  const logs = useLiveQuery(() => db.logs.where("plantId").equals(id).reverse().sortBy("date"), [id]);
  const photos = useLiveQuery(() => db.photos.where("plantId").equals(id).reverse().sortBy("date"), [id]);
  const harvests = useLiveQuery(() => db.harvests.where("plantId").equals(id).toArray(), [id]);

  if (!plant) return null;

  // Merge all events into a single timeline
  type TimelineItem = {
    date: string;
    type: string;
    icon: string;
    label: string;
    detail?: string;
    photoUrl?: string;
  };

  const items: TimelineItem[] = [];

  // Add logs
  logs?.forEach((log) => {
    const icons: Record<string, string> = {
      water: "💧",
      fertilize: "🌱",
      move: "↔️",
      note: "📝",
      photo: "📸",
      harvest: "✂️",
    };
    const labels: Record<string, string> = {
      water: "Gegossen",
      fertilize: "Gedüngt",
      move: log.note ?? "Umgezogen",
      note: log.note ?? "Notiz",
      photo: "Foto aufgenommen",
      harvest: "Geerntet",
    };
    items.push({
      date: log.date,
      type: log.type,
      icon: icons[log.type] ?? "📌",
      label: labels[log.type] ?? log.type,
      detail: log.note && log.type !== "move" && log.type !== "note" ? log.note : undefined,
    });
  });

  // Add photos (that aren't already in logs)
  photos?.forEach((photo) => {
    const alreadyInLogs = logs?.some((l) => l.type === "photo" && l.date === photo.date);
    if (!alreadyInLogs) {
      items.push({
        date: photo.date,
        type: "photo",
        icon: "📸",
        label: photo.caption ?? "Foto",
        photoUrl: photo.dataUrl,
      });
    }
  });

  // Add harvests
  harvests?.forEach((h) => {
    items.push({
      date: h.date,
      type: "harvest",
      icon: "✂️",
      label: `Geerntet${h.dryWeightG ? ` – ${h.dryWeightG}g trocken` : ""}`,
      detail: [
        h.wetWeightG ? `${h.wetWeightG}g nass` : "",
        h.quality ? `${"⭐".repeat(h.quality)}` : "",
        h.aroma ? `Aroma: ${h.aroma}` : "",
        h.effect ? `Effekt: ${h.effect}` : "",
        h.notes ?? "",
      ].filter(Boolean).join(" · "),
    });
  });

  // Sort by date descending
  items.sort((a, b) => (a.date < b.date ? 1 : -1));

  // Group by week
  const startDate = new Date(plant.startDate);
  const getWeek = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.floor((d.getTime() - startDate.getTime()) / (7 * 86400000));
    return Math.max(1, diff + 1);
  };

  return (
    <div>
      <div className="app-header">
        <h1>📝 {plant.name} – Tagebuch</h1>
      </div>
      <div className="app-main">
        {items.length === 0 && (
          <div className="empty-state">
            <div className="icon">📝</div>
            <p>Noch keine Einträge im Tagebuch.<br />Füge Fotos, Notizen oder Logs hinzu!</p>
            <Link to={`/plants/${plant.id}`} className="btn" style={{ marginTop: 12 }}>← Zurück zur Pflanze</Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="timeline">
            {items.map((item, i) => {
              const week = getWeek(item.date);
              const showWeekHeader = i === 0 || getWeek(items[i - 1].date) !== week;
              return (
                <div key={i}>
                  {showWeekHeader && (
                    <div className="timeline-week-header">
                      Woche {week}
                    </div>
                  )}
                  <div className="timeline-item">
                    <div className="timeline-icon">{item.icon}</div>
                    <div className="timeline-content">
                      <div className="timeline-label">{item.label}</div>
                      {item.detail && <div className="muted">{item.detail}</div>}
                      {item.photoUrl && (
                        <img
                          src={item.photoUrl}
                          alt="Grow"
                          className="timeline-photo"
                          loading="lazy"
                        />
                      )}
                      <div className="muted" style={{ fontSize: "0.75rem", marginTop: 2 }}>
                        {new Date(item.date).toLocaleString("de-DE")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link to={`/plants/${plant.id}`} className="btn secondary" style={{ marginTop: 16, display: "block", textAlign: "center" }}>
          ← Zurück zur Pflanze
        </Link>
      </div>
    </div>
  );
}
