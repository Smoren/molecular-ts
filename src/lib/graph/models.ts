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

  public hasVertex(id: number): boolean {
    return this.vertexMap[id] !== undefined;
  }

  public getVertex(id: number): Vertex {
    if (!this.hasVertex(id)) {
      throw new Error(`There is no vertex with id ${id}`);
    }
    return this.vertexMap[id];
  }

  public hasEdge(lhsVertexId: number, rhsVertexId: number): boolean {
    return this.edgeMap[lhsVertexId]?.[rhsVertexId] !== undefined;
  }

  public getEdge(lhsVertexId: number, rhsVertexId: number): Edge {
    if (!this.hasEdge(lhsVertexId, rhsVertexId)) {
      throw new Error(`There is no edge between vertexes ${lhsVertexId} and ${rhsVertexId}`);
    }
    return this.edgeMap[lhsVertexId][rhsVertexId];
  }

  public getEdges(vertexId: number): Edge[] {
    if (this.edgeMap[vertexId] === undefined) {
      throw new Error(`There is no vertex with id ${vertexId}`);
    }
    return Object.keys(this.edgeMap[vertexId]).map((id) => this.edgeMap[vertexId][Number(id)]);
  }
}
