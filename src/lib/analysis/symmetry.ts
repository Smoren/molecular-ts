import { infinite, single } from "itertools-ts";
import type { LineCoefficients } from "../math/types";
import type { GraphInterface } from "../graph/types";
import { createVector, toVector } from "../math";
import {
  calcDistanceBetweenGraphsByTypesCombined,
  getGraphAverageRadius,
  getGraphCentroid,
  getVertexAzimuth,
  getVertexesSortedByAzimuth,
  splitGraphByLine,
} from "../graph/utils";
import { getLineByPoints } from "../math/geometry";

// TODO parametrize type+edges_count
// TODO parametrize type+linked_types
// TODO bilateral: perpendicular axis for another check

export function scoreSymmetryAxis(
  graph: GraphInterface,
  line: LineCoefficients,
  radius: number,
  magic: number,
): number {
  // Если расстояние от точки (вершина) до прямой (ось-кандидат с коэффициентом k) не превышает R * MAGIC,
  // где MAGIC — некая экспериментально подобранная константа, считаем, что эта вершина лежит на оси симметрии
  // minDistance = R * MAGIC
  const [lhsGraph, rhsGraph] = splitGraphByLine(graph, line, radius*magic);

  return -calcDistanceBetweenGraphsByTypesCombined(lhsGraph, rhsGraph);
}

export function scoreBilateralSymmetry(graph: GraphInterface, magic: number = 0.1): [number, LineCoefficients] {
  // Найдем точку M — центр масс графа. Если граф действительно симметричен, ось симметрии будет проходить через M —
  // нам остаётся найти ее угловой коэффициент.
  const centroid = createVector(getGraphCentroid(graph));

  // Вычислим R = avg([dist(v, M) for v in vertexes]), где avg(arr) — среднее арифметическое.
  const radius = getGraphAverageRadius(graph, centroid);
  const eps = radius * 1e-10;

  // Вычислим reordered = sorted(vertexes, key=azimuth).
  const sortedVertexes = getVertexesSortedByAzimuth(graph.vertexes, centroid);

  // Переберем соседние пары вершин (a = reordered[i]; b = reordered[(i + 1) % N])
  const iter = single.limit(infinite.cycle(sortedVertexes), sortedVertexes.length+1);

  let bestScore: number = -Infinity;
  let bestAxis: LineCoefficients = [0, 0];

  for (const [lhs, rhs] of single.pairwise(iter)) {
    // Проверим ось симметрии через точки M и a
    const candidate1 = createVector(lhs.position);
    if (!centroid.isEqual(candidate1)) {
      if (centroid[0] === candidate1[0]) {
        candidate1.add([eps, 0]);
      }

      const axis1 = getLineByPoints(centroid, candidate1);
      const score = scoreSymmetryAxis(graph, axis1, radius, magic);

      if (score > bestScore) {
        bestScore = score;
        bestAxis = axis1;
      }
    }

    // Проверим ось симметрии через точку M и посередине между точками a и b
    const candidate2 = createVector(lhs.position).add(rhs.position).div(2);
    if (!centroid.isEqual(candidate2)) {
      if (centroid[0] === candidate2[0]) {
        candidate2.add([eps, 0]);
      }

      const axis2 = getLineByPoints(centroid, candidate2);
      const score = scoreSymmetryAxis(graph, axis2, radius, magic);

      if (score > bestScore) {
        bestScore = score;
        bestAxis = axis2;
      }
    }

    // // Проверим ось симметрии с угловым коэффициентом tan(azimuth(a)) — пытаемся провести прямую через точку a.
    // const k1 = Math.tan(getVertexAzimuth(lhs, centroid));
    // const p1 = lhs.position;
    // const b1 = p1[1] - k1 * p1[0]; // y = kx + b => b = y - kx
    // checkSymmetryAxis(graph, [k1, b1], radius, 0.5);
    //
    // // Проверим ось симметрии с угловым коэффициентом tan((azimuth(a) + azimuth(b)) * 0.5) — пытаемся провести
    // // посередине между a и b (собственно, ради этого и затевалась сортировка по азимутам).
    // const k2 = Math.tan(getVertexAzimuth(lhs, centroid) + getVertexAzimuth(rhs, centroid)) * 0.5;
    // const p2 = createVector(lhs.position).add(rhs.position).div(2);
    // const b2 = p2[1] - k2 * p2[0]; // y = kx + b => b = y - kx
    // checkSymmetryAxis(graph, [k2, b2], radius, 0.5);
  }

  return [bestScore, bestAxis];
}
