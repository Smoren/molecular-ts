import type { NumericVector } from "../math/types";

export type Vertex = {
  id: number;
  type: number;
  position: NumericVector;
};

export type Edge = {
  lhsId: number;
  rhsId: number;
};

export type GraphConfig = {
  readonly typesCount: number;
  readonly vertexes: Vertex[];
  readonly edges: Edge[];
};

export type VertexMap = Record<number, Vertex>;

export interface GraphInterface extends GraphConfig {
  readonly vertexMap: VertexMap;
  readonly config: GraphConfig;
}
