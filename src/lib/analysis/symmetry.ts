import type { GraphInterface, Vertex } from "../graph/types";
import type { NumericVector, VectorInterface } from "../math/types";
import { createVector } from "../math";
import { infinite, single } from "itertools-ts";

function getCentroid(graph: GraphInterface): NumericVector {
  return graph.vertexes.reduce<VectorInterface>(
    (acc, v) => acc.add(v.position),
    createVector([0, 0]),
  ).div(graph.vertexes.length);
}

function getAverageRadius(graph: GraphInterface, centroid: NumericVector): number {
  const radiusSum = graph.vertexes
    .map((v) => createVector(v.position).sub(centroid).abs)
    .reduce((acc, x) => acc + x, 0);

  return radiusSum / graph.vertexes.length;
}

function getAzimuth(vertex: Vertex, centroid: NumericVector): number {
  // atan2(v.y - M.y, v.x - M.x) % PI
  return Math.atan2(
    ...createVector(vertex.position).sub(centroid).reverse() as [number, number]
  ) % Math.PI;
}

function getSortedVertexes(vertexes: Vertex[], centroid: NumericVector): Vertex[] {
  // reordered = sorted(vertexes, key=azimuth)
  return [...vertexes].sort(
    (lhs, rhs) => getAzimuth(lhs, centroid) - getAzimuth(rhs, centroid)
  );
}

// TODO rename function
function iterateSortedVertexes(sortedVertexes: Vertex[], centroid: NumericVector): void {
  const iter = single.limit(infinite.cycle(sortedVertexes), sortedVertexes.length+1);

  single.map(single.pairwise(iter), ([lhs, rhs]) => {
    // Проверим ось симметрии с угловым коэффициентом tan(azimuth(a)) — пытаемся провести прямую через точку a.
    const slopeCoefficient1 = Math.tan(getAzimuth(lhs, centroid));

    // Проверим ось симметрии с угловым коэффициентом tan((azimuth(a) + azimuth(b)) * 0.5) — пытаемся провести
    // посередине между a и b (собственно, ради этого и затевалась сортировка по азимутам).
    const slopeCoefficient2 = Math.tan(getAzimuth(lhs, centroid) + getAzimuth(rhs, centroid)) * 0.5;
  });
}
