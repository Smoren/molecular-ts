import type { GraphInterface } from "../graph/types";
import type { NumericVector, VectorInterface } from "../math/types";
import { createVector } from "../math";

function getCentroid(graph: GraphInterface): NumericVector {
  return graph.vertexes.reduce<VectorInterface>(
    (acc, v) => acc.add(v.position),
    createVector([0, 0]),
  ).div(graph.vertexes.length);
}
