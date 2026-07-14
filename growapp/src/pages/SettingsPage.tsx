import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { exportAllData, importData, downloadBackup, readBackupFile } from '../utils/export';

export default function SettingsPage() {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const stats = useLiveQuery(async () => {
    const [tents, plants, logs, photos, costs, harvests, strains] = await Promise.all([
      db.tents.count(),
      db.plants.count(),
      db.logs.count(),
      db.photos.count(),
      db.costs.count(),
      db.harvests.count(),
      db.strains.count(),
    ]);

    return { tents, plants, logs, photos, costs, harvests, strains };
  }, []);

  const handleExport = async () => {
    try {
      const jsonString = await exportAllData();
      const date = new Date().toISOString().split('T')[0];
      downloadBackup(jsonString, `growmanager-backup-${date}.json`);
      setMessage({ type: 'success', text: 'Backup erfolgreich erstellt!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Erstellen des Backups' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);

    try {
      const jsonString = await readBackupFile(file);
      await importData(jsonString);
      setMessage({ type: 'success', text: 'Daten erfolgreich importiert!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Importieren der Daten' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Wirklich ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden!')) {
      return;
    }

    if (!confirm('Bist du WIRKLICH sicher? Alle Daten werden gelöscht!')) {
      return;
    }

    try {
      await db.tents.clear();
      await db.plants.clear();
      await db.weekPlans.clear();
      await db.logs.clear();
      await db.photos.clear();
      await db.costs.clear();
      await db.harvests.clear();
      await db.strains.clear();
      await db.clones.clear();
      await db.noteTemplates.clear();
      await db.lightCycleEvents.clear();
      setMessage({ type: 'success', text: 'Alle Daten wurden gelöscht' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Löschen der Daten' });
    }
  };

  return (
    <div className="page">
      <h1>Einstellungen</h1>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h3>📊 Datenbank-Statistiken</h3>
        {stats && (
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.tents}</span>
              <span className="stat-label">Zelte</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.plants}</span>
              <span className="stat-label">Pflanzen</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.logs}</span>
              <span className="stat-label">Logs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.photos}</span>
              <span className="stat-label">Fotos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.costs}</span>
              <span className="stat-label">Kosten</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.harvests}</span>
              <span className="stat-label">Ernten</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.strains}</span>
              <span className="stat-label">Strains</span>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>💾 Backup & Wiederherstellung</h3>
        <p className="card-description">
          Exportiere alle deine Daten als Backup oder importiere ein bestehendes Backup.
        </p>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleExport}>
            📥 Backup erstellen
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            📤 Backup importieren
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {importing && <p className="loading">Importiere Daten...</p>}
      </div>

      <div className="card danger-zone">
        <h3>⚠️ Gefahrenzone</h3>
        <p className="card-description">
          Lösche alle Daten aus der Datenbank. Dies kann nicht rückgängig gemacht werden!
        </p>

        <button className="btn btn-danger" onClick={handleClearAll}>
          🗑️ Alle Daten löschen
        </button>
      </div>

      <div className="card">
        <h3>ℹ️ Über GrowManager</h3>
        <p className="card-description">
          Version 1.0.0<br />
          GrowManager ist eine Open-Source PWA für Cannabis-Anbauer.
        </p>
        <p className="card-description">
          Alle Daten werden lokal in deinem Browser gespeichert (IndexedDB).
          Es werden keine Daten an externe Server gesendet.
        </p>
      </div>
    </div>
  );
}
