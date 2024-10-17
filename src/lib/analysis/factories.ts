import type { AtomInterface } from "../types/atomic";
import type { Edge, Graph } from "../types/graph";
import { createEdge, getEdgeId } from "../graph/functions";

export function createCompoundGraph(atom: AtomInterface, typesCount: number): Graph {
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
  return { typesCount, vertexes, edges };
}
