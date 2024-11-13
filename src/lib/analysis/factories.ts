import type { AtomInterface } from "../types/atomic";
import type { Edge, GraphInterface } from "../graph/types";
import { createEdge, createGraph, getEdgeId } from "../graph/factories";
import type { Compound } from './types';

export function createCompoundByAtom(atom: AtomInterface): Compound {
  const compound: Compound = new Set();
  const atomsToHandle = [atom];

  while (atomsToHandle.length > 0) {
    const lhsAtom = atomsToHandle.pop()!;
    compound.add(lhsAtom);

    for (const rhsAtom of Object.values(lhsAtom.bonds.getStorage())) {
      if (!compound.has(rhsAtom)) {
        atomsToHandle.push(rhsAtom);
      }
    }
  }

  return compound;
}

export function createCompoundGraphByAtom(atom: AtomInterface, typesCount: number): GraphInterface {
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

  const vertexes = [...atoms].map((atom) => ({
    id: atom.id,
    type: atom.type,
    position: atom.position,
    speed: atom.speed,
  }));
  const edges = Object.values(edgeMap);
  return createGraph({ typesCount, vertexes, edges });
}

export function createCompoundGraph(compound: Compound, typesCount: number): GraphInterface {
  if (compound.size === 0) {
    return createGraph({ typesCount, vertexes: [], edges: [] });
  }

  const firstAtom = [...compound][0];
  return createCompoundGraphByAtom(firstAtom, typesCount);
}
