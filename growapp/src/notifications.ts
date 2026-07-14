// Push Notification helpers for GrowManager PWA

export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export function getPermissionState(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isNotificationSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

export function sendLocalNotification(title: string, body: string, tag?: string): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;

  // Use Service Worker registration for persistent notifications if available
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: tag ?? `grow-${Date.now()}`,
        data: { url: "/" },
      } as NotificationOptions & { data: Record<string, string> });
    });
  } else {
    // Fallback to regular Notification API
    new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: tag ?? `grow-${Date.now()}`,
    });
  }
}

// Check and notify about upcoming tasks
export async function checkAndNotifyUpcomingTasks(): Promise<void> {
  if (getPermissionState() !== "granted") return;

  try {
    const { db } = await import("./db");
    const { generateUpcomingEvents } = await import("./calendar");

    const plants = await db.plants.filter((p) => !p.archived).toArray();
    const tents = await db.tents.toArray();
    const plans = await db.weekPlans.toArray();
    const logs = await db.logs.toArray();

    if (plants.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString().slice(0, 10);

    const events = generateUpcomingEvents(plants, tents, plans, logs, 1);
    const todayEvents = events.filter((e) => e.date === todayIso);

    if (todayEvents.length > 0) {
      const title = `🌿 ${todayEvents.length} Aufgabe${todayEvents.length > 1 ? "n" : ""} heute`;
      const body = todayEvents.map((e) => e.plantName).join(", ");
      sendLocalNotification(title, body, "daily-tasks");
    }
  } catch (err) {
    console.warn("Notification check failed:", err);
  }
}

// Schedule daily notification check
export function scheduleNotificationChecks(): void {
  if (getPermissionState() !== "granted") return;

  // Check immediately on app load
  checkAndNotifyUpcomingTasks();

  // Then check every 6 hours
  setInterval(checkAndNotifyUpcomingTasks, 6 * 60 * 60 * 1000);
}
