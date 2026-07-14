import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { generateUpcomingEvents, groupEventsByDate } from "../calendar";

type ViewMode = "list" | "week" | "month";

function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);
  const weekday = date.toLocaleDateString("de-DE", { weekday: "long" });
  const full = date.toLocaleDateString("de-DE", { day: "2-digit", month: "long" });
  if (diffDays === 0) return `Heute · ${full}`;
  if (diffDays === 1) return `Morgen · ${full}`;
  if (diffDays < 0) return `Überfällig · ${weekday}, ${full}`;
  return `${weekday}, ${full}`;
}

function ListView({ events }: { events: any[] }) {
  const grouped = groupEventsByDate(events);
  const days = Array.from(grouped.keys());

  if (days.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📅</div>
        <p>Noch keine Termine.<br />Lege Pflanzen mit Gieß-Intervall und Wochenplan an, dann erscheinen hier automatisch die nächsten Gieß-/Dünge-Termine.</p>
      </div>
    );
  }

  return (
    <>
      {days.map((day) => (
        <div className="day-group" key={day}>
          <div className="day-label">{formatDayLabel(day)}</div>
          <div className="card" style={{ marginBottom: 0 }}>
            {grouped.get(day)!.map((event, i) => (
              <div className="event-row" key={i}>
                <span>{event.label}</span>
                <span className="tent-tag">{event.tentName}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function WeekView({ events }: { events: any[] }) {
  const [weekOffset, setWeekOffset] = useState(0);
  
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Montag
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const grouped = groupEventsByDate(events);

  const navigateWeek = (direction: number) => {
    setWeekOffset(weekOffset + direction);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button className="btn btn-secondary" onClick={() => navigateWeek(-1)}>← Vorherige Woche</button>
        <button className="btn btn-secondary" onClick={() => setWeekOffset(0)}>Diese Woche</button>
        <button className="btn btn-secondary" onClick={() => navigateWeek(1)}>Nächste Woche →</button>
      </div>

      <div className="week-grid">
        {weekDays.map((day) => {
          const dayEvents = grouped.get(day) || [];
          const date = new Date(day);
          const isToday = day === today.toISOString().split('T')[0];
          const weekday = date.toLocaleDateString("de-DE", { weekday: "short" });
          const dayNum = date.getDate();

          return (
            <div key={day} className={`week-day ${isToday ? "today" : ""}`}>
              <div className="week-day-header">
                <div className="weekday">{weekday}</div>
                <div className="day-number">{dayNum}</div>
              </div>
              <div className="week-day-events">
                {dayEvents.length === 0 ? (
                  <div className="no-events">Keine Termine</div>
                ) : (
                  dayEvents.map((event, i) => (
                    <div key={i} className="week-event" title={event.label}>
                      <span className="event-icon">{event.type === "water" ? "💧" : "🌱"}</span>
                      <span className="event-text">{event.plantName}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthView({ events }: { events: any[] }) {
  const [monthOffset, setMonthOffset] = useState(0);
  
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  
  const firstDayOfMonth = new Date(currentMonth);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  
  // Start from Monday
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  
  const monthDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
    return date.toISOString().split('T')[0];
  });

  const grouped = groupEventsByDate(events);

  const navigateMonth = (direction: number) => {
    setMonthOffset(monthOffset + direction);
  };

  const monthName = currentMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button className="btn btn-secondary" onClick={() => navigateMonth(-1)}>← Vorheriger Monat</button>
        <button className="btn btn-secondary" onClick={() => setMonthOffset(0)}>Dieser Monat</button>
        <button className="btn btn-secondary" onClick={() => navigateMonth(1)}>Nächster Monat →</button>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>{monthName}</h2>

      <div className="month-grid">
        <div className="month-weekday">Mo</div>
        <div className="month-weekday">Di</div>
        <div className="month-weekday">Mi</div>
        <div className="month-weekday">Do</div>
        <div className="month-weekday">Fr</div>
        <div className="month-weekday">Sa</div>
        <div className="month-weekday">So</div>

        {monthDays.map((day, i) => {
          if (!day) {
            return <div key={i} className="month-day empty"></div>;
          }

          const dayEvents = grouped.get(day) || [];
          const date = new Date(day);
          const isToday = day === today.toISOString().split('T')[0];
          const dayNum = date.getDate();

          return (
            <div key={i} className={`month-day ${isToday ? "today" : ""}`}>
              <div className="month-day-number">{dayNum}</div>
              {dayEvents.length > 0 && (
                <div className="month-day-events">
                  {dayEvents.slice(0, 3).map((event, j) => (
                    <div key={j} className="month-event" title={event.label}>
                      {event.type === "water" ? "💧" : "🌱"}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="month-event-more">+{dayEvents.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  const plans = useLiveQuery(() => db.weekPlans.toArray(), []);
  const logs = useLiveQuery(() => db.logs.toArray(), []);

  const ready = plants && tents && plans && logs;
  const events = ready ? generateUpcomingEvents(plants, tents, plans, logs, 60) : [];

  return (
    <div>
      <div className="app-header">
        <h1>📅 Kalender</h1>
        <div className="view-switcher">
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            Liste
          </button>
          <button
            className={`view-btn ${viewMode === "week" ? "active" : ""}`}
            onClick={() => setViewMode("week")}
          >
            Woche
          </button>
          <button
            className={`view-btn ${viewMode === "month" ? "active" : ""}`}
            onClick={() => setViewMode("month")}
          >
            Monat
          </button>
        </div>
      </div>
      <div className="app-main">
        {!ready ? (
          <div className="empty-state">
            <div className="icon">⏳</div>
            <p>Lade Daten...</p>
          </div>
        ) : viewMode === "list" ? (
          <ListView events={events} />
        ) : viewMode === "week" ? (
          <WeekView events={events} />
        ) : (
          <MonthView events={events} />
        )}
      </div>
    </div>
  );
}
