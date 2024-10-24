import { infinite, single } from "itertools-ts";
import type { GraphInterface, Vertex } from "../../graph/types";
import type { NumericVector, VectorInterface } from "../../math/types";
import { createVector } from "../../math";
import { splitGraphByLine } from "../../graph/utils";

export function getCentroid(graph: GraphInterface): NumericVector {
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

export function getAverageRadius(graph: GraphInterface, centroid: NumericVector): number {
  // Вычислим R = avg([dist(v, M) for v in vertexes]), где avg(arr) — среднее арифметическое.
  if (graph.vertexes.length === 0) {
    return 0;
  }

  const radiusSum = graph.vertexes
    .map((v) => createVector(v.position).sub(centroid).abs)
    .reduce((acc, x) => acc + x, 0);

  return radiusSum / graph.vertexes.length;
}

export function getAzimuth(vertex: Vertex, centroid: NumericVector): number {
  // Определим функцию azimuth(v) = atan2(v.y - M.y, v.x - M.x) % PI.
  // (Смысл взятия по модулю — спроецировать все точки в верхнюю полуплоскость относительно точки M.)
  return Math.atan2(
    ...createVector(vertex.position).sub(centroid).reverse() as [number, number]
  ) % Math.PI;
}

export function getSortedVertexes(vertexes: Vertex[], centroid: NumericVector): Vertex[] {
  // reordered = sorted(vertexes, key=azimuth)
  return [...vertexes].sort(
    (lhs, rhs) => getAzimuth(lhs, centroid) - getAzimuth(rhs, centroid)
  );
}



export function checkSymmetryAxis(graph: GraphInterface, k: number, b: number, radius: number, magic: number) {
  // Если расстояние от точки (вершина) до прямой (ось-кандидат с коэффициентом k) не превышает R * MAGIC,
  // где MAGIC — некая экспериментально подобранная константа, считаем, что эта вершина лежит на оси симметрии
  // minDistance = R * MAGIC
  const [lhsGraph, rhsGraph] = splitGraphByLine(graph, k, b, radius*magic);
}

// TODO rename function
export function iterateSortedVertexes(graph: GraphInterface): void {
  // Найдем точку M — центр масс графа. Если граф действительно симметричен, ось симметрии будет проходить через M —
  // нам остаётся найти ее угловой коэффициент.
  const centroid = getCentroid(graph);

  // Вычислим R = avg([dist(v, M) for v in vertexes]), где avg(arr) — среднее арифметическое.
  const radius = getAverageRadius(graph, centroid);

  // Вычислим reordered = sorted(vertexes, key=azimuth).
  const sortedVertexes = getSortedVertexes(graph.vertexes, centroid);

  // Переберем соседние пары вершин (a = reordered[i]; b = reordered[(i + 1) % N])
  const iter = single.limit(infinite.cycle(sortedVertexes), sortedVertexes.length+1);

  single.map(single.pairwise(iter), ([lhs, rhs]) => {
    // Проверим ось симметрии с угловым коэффициентом tan(azimuth(a)) — пытаемся провести прямую через точку a.
    const k1 = Math.tan(getAzimuth(lhs, centroid));
    const p1 = lhs.position;
    const b1 = p1[1] - k1 * p1[0]; // y = kx + b => b = y - kx
    checkSymmetryAxis(graph, k1, b1, radius, 0.5);

    // Проверим ось симметрии с угловым коэффициентом tan((azimuth(a) + azimuth(b)) * 0.5) — пытаемся провести
    // посередине между a и b (собственно, ради этого и затевалась сортировка по азимутам).
    const k2 = Math.tan(getAzimuth(lhs, centroid) + getAzimuth(rhs, centroid)) * 0.5;
    const p2 = createVector(lhs.position).add(rhs.position).div(2);
    const b2 = p2[1] - k2 * p2[0]; // y = kx + b => b = y - kx
    checkSymmetryAxis(graph, k2, b2, radius, 0.5);
  });
}
