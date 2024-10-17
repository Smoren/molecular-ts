import type { Edge, Graph, VertexMap } from "../types/graph";
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

export function createVertexMap(graph: Graph): VertexMap {
  const result: VertexMap = {};
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

export function countEdgesGroupedByVertexTypes(graph: Graph, vertexMap?: VertexMap): NumericVector {
  vertexMap = vertexMap ?? createVertexMap(graph);
  const result = createVector(createFilledArray(getPairsCount(graph.typesCount), 0));
  for (const edge of graph.edges) {
    result[getPairIndex([vertexMap[edge.lhsId].type, vertexMap[edge.rhsId].type], graph.typesCount)]++;
  }
  return result;
}
