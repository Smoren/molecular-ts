import type { Edge, EdgeMap, GraphConfig, GraphInterface, Vertex, VertexMap } from "./types";
import { createEdgeMap, createVertexMap } from "./functions";

export class Graph implements GraphInterface {
  public readonly config: GraphConfig;
  public readonly vertexMap: VertexMap;
  public readonly edgeMap: EdgeMap;

  constructor(config: GraphConfig) {
    this.config = config;
    this.vertexMap = createVertexMap(config);
    this.edgeMap = createEdgeMap(config);
  }

  get vertexes(): Vertex[] {
    return this.config.vertexes;
  }

  get edges(): Edge[] {
    return this.config.edges;
  }

  get typesCount(): number {
    return this.config.typesCount;
  }

  public hasEdge(lhsId: number, rhsId: number): boolean {
    return this.edgeMap[lhsId]?.[rhsId] !== undefined;
  }

  public getEdge(lhsId: number, rhsId: number): Edge {
    if (!this.hasEdge(lhsId, rhsId)) {
      throw new Error(`There is no edge between vertexes ${lhsId} and ${rhsId}`);
    }
    return this.edgeMap[lhsId][rhsId];
  }
}
