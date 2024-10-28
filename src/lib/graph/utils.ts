import type { GraphInterface, Vertex } from "./types";
import type { LineCoefficients, NumericVector, VectorInterface } from "../math/types";
import { createGraph } from "./factories";
import { distanceToLine } from "../math/geometry";
import { createFilledArray, createVector, toVector } from "../math";
import { getPairIndex, getPairsCount } from "../math/helpers";

export function getGraphCentroid(graph: GraphInterface): NumericVector {
  // Найдем точку M — центр масс графа.
  if (graph.vertexes.length === 0) {
    // FIXME maybe throw exception?
    return [0, 0];
  }

  return graph.vertexes.reduce<VectorInterface>(
    (acc, v) => acc.add(v.position),
    createVector([0, 0]),
  ).div(graph.vertexes.length);
}

export function getGraphAverageRadius(graph: GraphInterface, centroid: NumericVector): number {
  // Вычислим R = avg([dist(v, M) for v in vertexes]), где avg(arr) — среднее арифметическое.
  if (graph.vertexes.length === 0) {
    return 0;
  }

  const radiusSum = graph.vertexes
    .map((v) => createVector(v.position).sub(centroid).abs)
    .reduce((acc, x) => acc + x, 0);

  return radiusSum / graph.vertexes.length;
}

export function getVertexAzimuth(vertex: Vertex, centroid: NumericVector): number {
  // Определим функцию azimuth(v) = atan2(v.y - M.y, v.x - M.x) % PI.
  // (Смысл взятия по модулю — спроецировать все точки в верхнюю полуплоскость относительно точки M.)
  return Math.atan2(
    ...createVector(vertex.position).sub(centroid).reverse() as [number, number]
  ) % Math.PI;
}

export function getVertexesSortedByAzimuth(vertexes: Vertex[], centroid: NumericVector): Vertex[] {
  // reordered = sorted(vertexes, key=azimuth)
  return [...vertexes].sort(
    (lhs, rhs) => getVertexAzimuth(lhs, centroid) - getVertexAzimuth(rhs, centroid)
  );
}

export function splitVertexesByLine(vertexes: Vertex[], line: LineCoefficients, minDistance: number): [Vertex[], Vertex[], Vertex[]] {
  const [k, b] = line;

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

export function splitGraphByLine(graph: GraphInterface, line: LineCoefficients, minDistance: number): [GraphInterface, GraphInterface] {
  const [
    vertexesAbove,
    vertexesBelow,
    vertexesMiddle,
  ] = splitVertexesByLine(graph.vertexes, line, minDistance);

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
    if (lhsGraph.hasVertex(edge.lhsId) && lhsGraph.hasVertex(edge.rhsId)) {
      lhsGraph.addEdge(edge);
    }
    if (rhsGraph.hasVertex(edge.rhsId) && rhsGraph.hasVertex(edge.lhsId)) {
      rhsGraph.addEdge(edge);
    }
  }

  return [lhsGraph, rhsGraph];
}

export function hasBreaks(graph: GraphInterface): boolean {
  const { vertexes, edgeMap } = graph;

  if (vertexes.length === 0) {
    return false;
  }

  const visited: Set<number> = new Set();
  const queue: number[] = [];

  const startVertex = vertexes[0].id;
  queue.push(startVertex);
  visited.add(startVertex);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = edgeMap[current];

    if (neighbors) {
      for (const neighborId in neighbors) {
        const neighbor = Number(neighborId);
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  return visited.size !== vertexes.length;
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

export function calcGraphParametricPosition(graph: GraphInterface): VectorInterface {
  return toVector(countVertexesGroupedByType(graph)).concat(countEdgesGroupedByVertexTypes(graph));
}

export function calcDistanceBetweenGraphsByVertexTypes(lhs: GraphInterface, rhs: GraphInterface): number {
  return toVector(countVertexesGroupedByType(lhs)).sub(countVertexesGroupedByType(rhs)).abs;
}

export function calcDistanceBetweenGraphsByEdgeTypes(lhs: GraphInterface, rhs: GraphInterface): number {
  return toVector(countEdgesGroupedByVertexTypes(lhs)).sub(countEdgesGroupedByVertexTypes(rhs)).abs;
}

export function calcDistanceBetweenGraphsByTypesCombined(lhs: GraphInterface, rhs: GraphInterface): number {
  return calcGraphParametricPosition(lhs).sub(calcGraphParametricPosition(rhs)).abs;
}
