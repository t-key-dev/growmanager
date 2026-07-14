import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { differenceInDays, parseISO } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  plantId?: number;
}

export default function NotificationsPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const logs = useLiveQuery(() => db.logs.toArray(), []);
  const weekPlans = useLiveQuery(() => db.weekPlans.toArray(), []);
  const harvests = useLiveQuery(() => db.harvests.toArray(), []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (!plants || !logs || !weekPlans || !harvests) return;

    const newNotifications: Notification[] = [];
    const today = new Date();

    plants.forEach(plant => {
      if (plant.archived) return;

      const currentWeek = Math.floor(differenceInDays(today, parseISO(plant.startDate)) / 7) + 1;
      const weekPlan = weekPlans.find(wp => wp.plantId === plant.id && wp.week === currentWeek);
      
      if (weekPlan?.stage === 'late_flower' || weekPlan?.stage === 'flush') {
        newNotifications.push({
          id: `harvest-${plant.id}`,
          type: 'info',
          title: 'Ernte nähert sich',
          message: `${plant.name} ist in der späten Blütephase und könnte bald erntereif sein.`,
          timestamp: today.getTime(),
          read: false,
          plantId: plant.id,
        });
      }

      const lastWatering = logs
        .filter(l => l.plantId === plant.id && l.type === 'water')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (lastWatering && plant.waterIntervalDays) {
        const daysSinceWatering = differenceInDays(today, parseISO(lastWatering.date));
        if (daysSinceWatering >= plant.waterIntervalDays) {
          newNotifications.push({
            id: `water-${plant.id}`,
            type: 'warning',
            title: 'Gießen fällig',
            message: `${plant.name} sollte gegossen werden (seit ${daysSinceWatering} Tagen nicht gegossen).`,
            timestamp: today.getTime(),
            read: false,
            plantId: plant.id,
          });
        }
      }

      const daysInCurrentWeek = differenceInDays(today, parseISO(plant.startDate)) % 7;
      if (daysInCurrentWeek === 0 && currentWeek > 1) {
        newNotifications.push({
          id: `week-${plant.id}-${currentWeek}`,
          type: 'success',
          title: `Woche ${currentWeek} erreicht`,
          message: `${plant.name} hat Woche ${currentWeek} erreicht. Prüfe den Wochenplan für diese Woche.`,
          timestamp: today.getTime(),
          read: false,
          plantId: plant.id,
        });
      }
    });

    const recentHarvests = harvests.filter(h => {
      const daysSinceHarvest = differenceInDays(today, parseISO(h.date));
      return daysSinceHarvest <= 7 && daysSinceHarvest >= 0;
    });

    recentHarvests.forEach(harvest => {
      const plant = plants.find(p => p.id === harvest.plantId);
      if (plant) {
        newNotifications.push({
          id: `harvested-${harvest.id}`,
          type: 'success',
          title: 'Kürzlich geerntet',
          message: `${plant.name} wurde am ${new Date(harvest.date).toLocaleDateString('de-DE')} geerntet (${harvest.dryWeightG || 0}g trocken).`,
          timestamp: parseISO(harvest.date).getTime(),
          read: false,
          plantId: plant.id,
        });
      }
    });

    newNotifications.sort((a, b) => b.timestamp - a.timestamp);
    setNotifications(newNotifications);
  }, [plants, logs, weekPlans, harvests]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `vor ${minutes} Minuten`;
    if (hours < 24) return `vor ${hours} Stunden`;
    return `vor ${days} Tagen`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔔 Benachrichtigungen</h1>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={markAllAsRead}>
            Alle als gelesen markieren
          </button>
        )}
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle ({notifications.length})
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Ungelesen ({unreadCount})
        </button>
        <button
          className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Gelesen ({notifications.length - unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔕</div>
            <p>Keine Benachrichtigungen</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">{getIcon(notification.type)}</div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{getTimeAgo(notification.timestamp)}</div>
              </div>
              {!notification.read && <div className="notification-badge"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
