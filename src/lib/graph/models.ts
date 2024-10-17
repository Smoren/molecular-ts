import type { Edge, GraphConfig, GraphInterface, Vertex, VertexMap } from "./types";
import { createVertexMap } from "./functions";

export class Graph implements GraphInterface {
  private readonly _config: GraphConfig;
  private _vertexMap: VertexMap | undefined;

  constructor(config: GraphConfig) {
    this._config = config;
    this._vertexMap = createVertexMap(config);
  }

  get vertexes(): Vertex[] {
    return this._config.vertexes;
  }

  get edges(): Edge[] {
    return this._config.edges;
  }

  get typesCount(): number {
    return this._config.typesCount;
  }

  get vertexMap(): VertexMap {
    if (this._vertexMap === undefined) {
      this._vertexMap = createVertexMap(this._config);
    }
    return this._vertexMap;
  }

  get config(): GraphConfig {
    return this._config;
  }
}
