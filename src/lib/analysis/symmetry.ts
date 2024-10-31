import { infinite, single } from "itertools-ts";
import type { LineCoefficients, NumericVector, VectorInterface } from "../math/types";
import type { GraphInterface } from "../graph/types";
import { createVector, toVector } from "../math";
import {
  calcDistanceBetweenGraphsByTypesCombined,
  findFarthestVertexPair,
  getGraphAverageRadius,
  getGraphCentroid,
  getVertexAzimuth,
  getVertexesSortedByAzimuth,
  splitGraphByLine,
} from "../graph/utils";
import { findOrthogonalLine, getLineByPoints } from "../math/geometry";

// TODO parametrize type+edges_count
// TODO parametrize type+linked_types
// TODO взвешенный поиск центра, когда более удаленные точки вносят меньший вклад

type ScoreSymmetryAxisFunctionArguments = {
  graph: GraphInterface;
  axis: LineCoefficients;
  centroid: NumericVector;
  radius: number;
  magic: number;
}

type ScoreSymmetryFunctionArguments = {
  graph: GraphInterface;
  scoreAxisFunction: ScoreSymmetryAxisFunction;
  magic?: number;
  eps?: number;
  normCoefficient?: number;
}

type ScoreSymmetryAxisFunction = (params: ScoreSymmetryAxisFunctionArguments) => number;

export function normSymmetryScore(x: number, normCoefficient: number = 0.5): number {
  return 1 / (1 + Math.abs(x)*normCoefficient);
}

export function scoreSymmetryAxis({
  graph,
  axis,
  radius,
  magic,
}: ScoreSymmetryAxisFunctionArguments): number {
  // Если расстояние от точки (вершина) до прямой (ось-кандидат с коэффициентом k) не превышает R * MAGIC,
  // где MAGIC — некая экспериментально подобранная константа, считаем, что эта вершина лежит на оси симметрии
  // minDistance = R * MAGIC
  const [lhsGraph, rhsGraph] = splitGraphByLine(graph, axis, radius*magic);

  return -calcDistanceBetweenGraphsByTypesCombined(lhsGraph, rhsGraph);
}

export function scoreSymmetryAxisByQuartering({
  graph,
  axis,
  centroid,
  radius,
  magic,
}: ScoreSymmetryAxisFunctionArguments): number {
  const [lhsGraph, rhsGraph] = splitGraphByLine(graph, axis, radius*magic);

  const orthogonalAxis = findOrthogonalLine(axis, centroid[0]);

  const [lhsLhsGraph, rhsLhsGraph] = splitGraphByLine(lhsGraph, orthogonalAxis, radius*magic);
  const [lhsRhsGraph, rhsRhsGraph] = splitGraphByLine(rhsGraph, orthogonalAxis, radius*magic);

  return -calcDistanceBetweenGraphsByTypesCombined(lhsGraph, rhsGraph) +
    -calcDistanceBetweenGraphsByTypesCombined(lhsLhsGraph, lhsRhsGraph) +
    -calcDistanceBetweenGraphsByTypesCombined(rhsLhsGraph, rhsRhsGraph);
}

export function scoreBilateralSymmetry({
  graph,
  scoreAxisFunction,
  magic = 0.3,
  eps = 1e-10,
  normCoefficient = 0.5,
}: ScoreSymmetryFunctionArguments): [number, LineCoefficients] {
  // Найдем точку M — центр масс графа. Если граф действительно симметричен, ось симметрии будет проходить через M —
  // нам остаётся найти ее угловой коэффициент.
  const centroid = createVector(getGraphCentroid(graph));

  // Вычислим R = avg([dist(v, M) for v in vertexes]), где avg(arr) — среднее арифметическое.
  const radius = getGraphAverageRadius(graph, centroid);

  // Вычислим reordered = sorted(vertexes, key=azimuth).
  const sortedVertexes = getVertexesSortedByAzimuth(graph.vertexes, centroid);

  // Переберем соседние пары вершин (a = reordered[i]; b = reordered[(i + 1) % N])
  const cycledVertexes = [...single.limit(infinite.cycle(sortedVertexes), sortedVertexes.length+1)];

  let bestScore: number = -Infinity;
  let bestAxis: LineCoefficients = [0, 0];

  const farthestVertexPair = findFarthestVertexPair(graph.vertexes);
  if (farthestVertexPair[0] !== farthestVertexPair[1]) {
    const axis = getLineByPoints(farthestVertexPair[0].position, farthestVertexPair[1].position);
    const score = scoreAxisFunction({
      graph,
      axis,
      centroid,
      radius,
      magic,
    });

    if (score > bestScore) {
      bestScore = score;
      bestAxis = axis;
    }
  }

  for (const [lhs, rhs] of single.pairwise(cycledVertexes)) {
    const candidates: VectorInterface[] = [];

    // Проверим ось симметрии через точки M и a
    const candidate1 = createVector(lhs.position);
    if (!centroid.isEqual(candidate1)) {
      candidates.push(candidate1);
    }

    // Проверим ось симметрии через точку M и середину между точками a и b
    const candidate2 = createVector(lhs.position).add(rhs.position).div(2);
    if (!centroid.isEqual(candidate2)) {
      candidates.push(candidate2);
    }

    for (const vertex of farthestVertexPair) {
      const candidate3 = createVector(vertex.position);
      if (!centroid.isEqual(candidate3)) {
        candidates.push(candidate3);
      }
    }

    for (const candidate of candidates) {
      if (centroid[0] === candidate[0]) {
        candidate.add([eps, 0]);
      }

      const axis = getLineByPoints(centroid, candidate);
      const score = scoreAxisFunction({
        graph,
        axis,
        centroid,
        radius,
        magic,
      });

      if (score > bestScore) {
        bestScore = score;
        bestAxis = axis;
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

  return [normSymmetryScore(bestScore, normCoefficient), bestAxis];
}
