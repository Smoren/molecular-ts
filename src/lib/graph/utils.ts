import type { GraphInterface, Vertex } from "./types";
import { createGraph } from "./functions";
import { distanceToLine } from "../math/geometry";

export function splitVertexesByLine(vertexes: Vertex[], k: number, b: number, minDistance: number): [Vertex[], Vertex[], Vertex[]] {
  // Сгруппируем вершины по положению относительно прямой
  const vertexesAbove: Vertex[] = [];
  const vertexesBelow: Vertex[] = [];
  const vertexesMiddle: Vertex[] = [];

  // Перебираем все вершины:
  for (const vertex of vertexes) {
    const dist = distanceToLine(vertex.position, k, b);

    if (dist < minDistance) {
      vertexesMiddle.push(vertex);
      continue;
    }

    const [x, y] = vertex.position;
    const position = k * x - y + b;
    if (position > 0) {
      vertexesBelow.push(vertex);
    } else if (position < 0) {
      vertexesAbove.push(vertex);
    }
  }

  return [vertexesAbove, vertexesBelow, vertexesMiddle];
}

export function splitGraphByLine(graph: GraphInterface, k: number, b: number, minDistance: number): [GraphInterface, GraphInterface] {
  const [
    vertexesAbove,
    vertexesBelow,
    vertexesMiddle,
  ] = splitVertexesByLine(graph.vertexes, k, b, minDistance);

  const lhsGraph = createGraph({
    typesCount: graph.typesCount,
    vertexes: [...vertexesAbove, ...vertexesMiddle],
    edges: [],
  });

  const rhsGraph = createGraph({
    typesCount: graph.typesCount,
    vertexes: [...vertexesBelow, ...vertexesMiddle],
    edges: [],
  });

  for (const edge of graph.edges) {
    if (lhsGraph.hasVertex(edge.lhsId) && rhsGraph.hasVertex(edge.rhsId)) {
      lhsGraph.addEdge(edge);
    }
    if (lhsGraph.hasVertex(edge.rhsId) && rhsGraph.hasVertex(edge.lhsId)) {
      rhsGraph.addEdge(edge);
    }
  }

  return [lhsGraph, rhsGraph];
}
