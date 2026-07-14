import { db } from '../db';

export async function exportData(): Promise<string> {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    tents: await db.tents.toArray(),
    plants: await db.plants.toArray(),
    weekPlans: await db.weekPlans.toArray(),
    logs: await db.logs.toArray(),
    photos: await db.photos.toArray(),
    costs: await db.costs.toArray(),
    harvests: await db.harvests.toArray(),
    strains: await db.strains.toArray(),
    clones: await db.clones.toArray(),
    noteTemplates: await db.noteTemplates.toArray(),
    lightCycleEvents: await db.lightCycleEvents.toArray(),
  };

  return JSON.stringify(data, null, 2);
}

export async function exportAllData(): Promise<string> {
  return exportData();
}

export function downloadBackup(jsonString: string, filename: string): void {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readBackupFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);

  if (data.version !== 1) {
    throw new Error('Unsupported export version');
  }

  // Clear existing data
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

  // Import data
  if (data.tents?.length) await db.tents.bulkAdd(data.tents);
  if (data.plants?.length) await db.plants.bulkAdd(data.plants);
  if (data.weekPlans?.length) await db.weekPlans.bulkAdd(data.weekPlans);
  if (data.logs?.length) await db.logs.bulkAdd(data.logs);
  if (data.photos?.length) await db.photos.bulkAdd(data.photos);
  if (data.costs?.length) await db.costs.bulkAdd(data.costs);
  if (data.harvests?.length) await db.harvests.bulkAdd(data.harvests);
  if (data.strains?.length) await db.strains.bulkAdd(data.strains);
  if (data.clones?.length) await db.clones.bulkAdd(data.clones);
  if (data.noteTemplates?.length) await db.noteTemplates.bulkAdd(data.noteTemplates);
  if (data.lightCycleEvents?.length) await db.lightCycleEvents.bulkAdd(data.lightCycleEvents);
}
