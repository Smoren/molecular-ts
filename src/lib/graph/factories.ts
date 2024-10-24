import type { Edge, EdgeMap, GraphConfig, GraphInterface, VertexMap } from "./types";
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

export function createEdgeMap(graph: GraphConfig): EdgeMap {
  const result: EdgeMap = {};
  for (const edge of graph.edges) {
    if (result[edge.lhsId] === undefined) {
      result[edge.lhsId] = {};
    }
    result[edge.lhsId][edge.rhsId] = edge;
    if (result[edge.rhsId] === undefined) {
      result[edge.rhsId] = {};
    }
    result[edge.rhsId][edge.lhsId] = edge;
  }
  return result;
}
