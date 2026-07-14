import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { getPermissionState, requestPermission, scheduleNotificationChecks } from "../notifications";

export default function NotificationSettings() {
  const [perm, setPerm] = useState(getPermissionState());
  const plants = useLiveQuery(() => db.plants.filter((p) => !p.archived).toArray(), []);

  useEffect(() => {
    if (perm === "granted") {
      scheduleNotificationChecks();
    }
  }, [perm]);

  if (!plants || plants.length === 0) return null;
  if (perm === "unsupported") return null;
  if (perm === "granted") return null; // Already enabled, no banner needed

  async function handleEnable() {
    const result = await requestPermission();
    setPerm(result);
  }

  return (
    <div className="notification-banner">
      <span>🔔</span>
      <span style={{ fontSize: "0.85rem" }}>Erinnerungen aktivieren?</span>
      <button className="btn" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleEnable}>
        Aktivieren
      </button>
    </div>
  );
}
