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
export type EdgeMap = Record<number, Record<number, Edge>>;

export interface GraphInterface extends GraphConfig {
  readonly vertexMap: VertexMap;
  readonly edgeMap: EdgeMap;
  readonly config: GraphConfig;
  hasVertex(id: number): boolean;
  getVertex(id: number): Vertex;
  addVertex(vertex: Vertex): void;
  hasEdge(lhsId: number, rhsId: number): boolean;
  getEdge(lhsId: number, rhsId: number): Edge;
  getEdges(vertexId: number): Edge[];
  addEdge(edge: Edge): void;
}
