export type Vertex = {
  id: number;
  type: number;
};

export type Edge = {
  lhsId: number;
  rhsId: number;
};

export type Graph = {
  vertexes: Vertex[];
  edges: Edge[];
};
