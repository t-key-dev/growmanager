import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function DragDropSortPage() {
  const plants = useLiveQuery(() => db.plants.toArray(), []);
  const tents = useLiveQuery(() => db.tents.toArray(), []);
  
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverItem, setDragOverItem] = useState<any>(null);

  const handleDragStart = (item: any) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, item: any) => {
    e.preventDefault();
    setDragOverItem(item);
  };

  const handleDragEnd = async () => {
    if (!draggedItem || !dragOverItem || draggedItem.id === dragOverItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    if (draggedItem.type === 'plant' && plants) {
      const items = [...plants];
      const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
      const targetIndex = items.findIndex(i => i.id === dragOverItem.id);

      const [removed] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, removed);

      for (let i = 0; i < items.length; i++) {
        await db.plants.update(items[i].id!, { sortOrder: i });
      }
    } else if (draggedItem.type === 'tent' && tents) {
      const items = [...tents];
      const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
      const targetIndex = items.findIndex(i => i.id === dragOverItem.id);

      const [removed] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, removed);

      for (let i = 0; i < items.length; i++) {
        await db.tents.update(items[i].id!, { sortOrder: i });
      }
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const sortedPlants = [...(plants || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const sortedTents = [...(tents || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="page">
      <h1>🔀 Drag & Drop Sortierung</h1>
      <p className="subtitle">Pflanzen und Zelte per Drag sortieren</p>

      <div className="card">
        <h3>Zelte</h3>
        <div className="drag-list">
          {sortedTents.map(tent => (
            <div
              key={tent.id}
              className={`drag-item ${draggedItem?.id === tent.id ? 'dragging' : ''} ${dragOverItem?.id === tent.id ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart({ ...tent, type: 'tent' })}
              onDragOver={(e) => handleDragOver(e, { ...tent, type: 'tent' })}
              onDragEnd={handleDragEnd}
            >
              <span className="drag-handle">⋮⋮</span>
              <span className="drag-content">{tent.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Pflanzen</h3>
        <div className="drag-list">
          {sortedPlants.map(plant => (
            <div
              key={plant.id}
              className={`drag-item ${draggedItem?.id === plant.id ? 'dragging' : ''} ${dragOverItem?.id === plant.id ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart({ ...plant, type: 'plant' })}
              onDragOver={(e) => handleDragOver(e, { ...plant, type: 'plant' })}
              onDragEnd={handleDragEnd}
            >
              <span className="drag-handle">⋮⋮</span>
              <span className="drag-content">{plant.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>💡 Hinweis</h3>
        <p>
          Ziehe Elemente mit dem Griff (⋮⋮) an eine neue Position. 
          Die Sortierung wird automatisch gespeichert.
        </p>
      </div>
    </div>
  );
}
