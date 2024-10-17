import type { Edge, Graph, Vertex } from "../types/graph";
import type { AtomInterface } from "../types/atomic";
import { createFilledArray, createVector } from "../math";
import { getPairIndex, getPairsCount } from "../math/helpers";
import type { NumericVector } from "../math/types";

export function createEdge(lhsId: number, rhsId: number): Edge {
  const lhsItemId = lhsId < rhsId ? lhsId : rhsId;
  const rhsItemId = lhsId < rhsId ? rhsId : lhsId;
  return { lhsId: lhsItemId, rhsId: rhsItemId };
}

export function getEdgeId(edge: Edge): string {
  return `${edge.lhsId}-${edge.rhsId}`;
}

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

export function createVertexMap(graph: Graph): Record<number, Vertex> {
  const result: Record<number, Vertex> = {};
  for (const vertex of graph.vertexes) {
    result[vertex.id] = vertex;
  }
  return result;
}

export function countVertexesGroupedByType(graph: Graph): NumericVector {
  const result = createVector(createFilledArray(graph.typesCount, 0));
  for (const vertex of graph.vertexes) {
    result[vertex.type]++;
  }
  return result;
}

export function countEdgesGroupedByVertexTypes(graph: Graph): NumericVector {
  const vertexMap = createVertexMap(graph);
  const result = createVector(createFilledArray(getPairsCount(graph.typesCount), 0));
  for (const edge of graph.edges) {
    result[getPairIndex([vertexMap[edge.lhsId].type, vertexMap[edge.rhsId].type], graph.typesCount)]++;
  }
  return result;
}
