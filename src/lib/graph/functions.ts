import type { Edge, GraphConfig, GraphInterface, VertexMap } from "./types";
import type { NumericVector } from "../math/types";
import { createFilledArray, createVector, toVector } from "../math";
import { getPairIndex, getPairsCount } from "../math/helpers";
import { Graph } from "./models";

export function createGraph(config: GraphConfig): Graph {
  return new Graph(config);
}

export function createEdge(lhsId: number, rhsId: number): Edge {
  const lhsItemId = lhsId < rhsId ? lhsId : rhsId;
  const rhsItemId = lhsId < rhsId ? rhsId : lhsId;
  return { lhsId: lhsItemId, rhsId: rhsItemId };
}

export function getEdgeId(edge: Edge): string {
  return `${edge.lhsId}-${edge.rhsId}`;
}

export function createVertexMap(graph: GraphConfig): VertexMap {
  const result: VertexMap = {};
  for (const vertex of graph.vertexes) {
    result[vertex.id] = vertex;
  }
  return result;
}

export function countVertexesGroupedByType(graph: GraphInterface): NumericVector {
  const result = createVector(createFilledArray(graph.typesCount, 0));
  for (const vertex of graph.vertexes) {
    result[vertex.type]++;
  }
  return result;
}

export function countEdgesGroupedByVertexTypes(graph: GraphInterface): NumericVector {
  const vertexMap = graph.vertexMap;
  const result = createVector(createFilledArray(getPairsCount(graph.typesCount), 0));
  for (const edge of graph.edges) {
    const index = getPairIndex([vertexMap[edge.lhsId].type, vertexMap[edge.rhsId].type], graph.typesCount)
    result[index]++;
  }
  return result;
}

export function calcDistanceBetweenGraphsByVertexTypes(lhs: GraphInterface, rhs: GraphInterface): number {
  return toVector(countVertexesGroupedByType(lhs)).sub(countVertexesGroupedByType(rhs)).abs;
}

export function calcDistanceBetweenGraphsByEdgeTypes(lhs: GraphInterface, rhs: GraphInterface): number {
  return toVector(countEdgesGroupedByVertexTypes(lhs)).sub(countEdgesGroupedByVertexTypes(rhs)).abs;
}

export function calcDistanceBetweenGraphsByTypesCombined(lhs: GraphInterface, rhs: GraphInterface): number {
  const lhsVector = toVector(countVertexesGroupedByType(lhs)).concat(countEdgesGroupedByVertexTypes(lhs));
  const rhsVector = toVector(countVertexesGroupedByType(rhs)).concat(countEdgesGroupedByVertexTypes(rhs));

  return lhsVector.sub(rhsVector).abs;
}
