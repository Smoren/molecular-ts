export type Vertex = {
  id: number;
  type: number;
};

export type Edge = {
  lhsId: number;
  rhsId: number;
};

export type Graph = {
  typesCount: number;
  vertexes: Vertex[];
  edges: Edge[];
};
