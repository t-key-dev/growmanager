import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { Strain } from '../types';

interface StrainNode {
  strain: Strain;
  children: StrainNode[];
}

export default function StrainGenealogyPage() {
  const strains = useLiveQuery(() => db.strains.toArray(), []);

  if (!strains) return null;

  // Build simple tree based on strain names containing parent names
  const buildTree = (): StrainNode[] => {
    const roots: StrainNode[] = [];
    const nodeMap = new Map<number, StrainNode>();

    // Create nodes
    strains.forEach(s => {
      nodeMap.set(s.id!, { strain: s, children: [] });
    });

    // Find children (simple heuristic: strain name contains parent name)
    strains.forEach(child => {
      const parents = strains.filter(parent => 
        parent.id !== child.id && 
        child.name.toLowerCase().includes(parent.name.toLowerCase())
      );

      if (parents.length === 0) {
        // This is a root strain
        const node = nodeMap.get(child.id!);
        if (node) roots.push(node);
      } else {
        // Add to first parent
        const parentNode = nodeMap.get(parents[0].id!);
        const childNode = nodeMap.get(child.id!);
        if (parentNode && childNode) {
          parentNode.children.push(childNode);
        }
      }
    });

    return roots;
  };

  const tree = buildTree();

  const renderNode = (node: StrainNode, depth: number = 0) => {
    return (
      <div key={node.strain.id} className="genealogy-node" style={{ marginLeft: depth * 20 }}>
        <div className="genealogy-card">
          <div className="genealogy-header">
            <strong>{node.strain.name}</strong>
            <span className="badge">{node.strain.type}</span>
          </div>
          {node.strain.genetics && (
            <div className="genealogy-details">{node.strain.genetics}</div>
          )}
          {node.strain.thc && (
            <div className="genealogy-details">THC: {node.strain.thc}</div>
          )}
        </div>
        {node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="page">
      <h1>🧬 Strain-Genealogie</h1>
      <p className="subtitle">Abstammungslinien deiner Strains</p>

      {tree.length > 0 ? (
        <div className="genealogy-tree">
          {tree.map(node => renderNode(node))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <p>Keine Genealogie-Daten vorhanden</p>
            <p className="muted">Die Genealogie wird automatisch aus den Strain-Namen abgeleitet.</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>ℹ️ Info</h3>
        <p className="muted">
          Die Genealogie wird basierend auf Strain-Namen erstellt. Wenn ein Strain-Name den Namen eines anderen 
          Strains enthält, wird er als Nachkomme angezeigt.
        </p>
      </div>
    </div>
  );
}
