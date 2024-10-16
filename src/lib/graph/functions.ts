import type { Edge, Graph } from "../types/graph";
import type { AtomInterface } from "../types/atomic";

export function createEdge(lhsId: number, rhsId: number): Edge {
  const lhsItemId = lhsId < rhsId ? lhsId : rhsId;
  const rhsItemId = lhsId < rhsId ? rhsId : lhsId;
  return { lhsId: lhsItemId, rhsId: rhsItemId };
}

export function getEdgeId(edge: Edge): string {
  return `${edge.lhsId}-${edge.rhsId}`;
}

export function createCompoundGraph(atom: AtomInterface): Graph {
  const atoms: Set<AtomInterface> = new Set();
  const edgeMap: Record<string, Edge> = {};

  const atomsToHandle = [atom];

  while (atomsToHandle.length > 0) {
    const lhsAtom = atomsToHandle.pop()!;
    atoms.add(lhsAtom);

    for (const rhsAtom of Object.values(lhsAtom.bonds.getStorage())) {
      if (!atoms.has(rhsAtom)) {
        atomsToHandle.push(rhsAtom);
      }
      const edge = createEdge(lhsAtom.id, rhsAtom.id);
      edgeMap[getEdgeId(edge)] = edge;
    }
  }

  const vertexes = Array.from(atoms).map((atom) => ({ id: atom.id, type: atom.type }));
  const edges = Object.values(edgeMap);
  return { vertexes, edges };
}
