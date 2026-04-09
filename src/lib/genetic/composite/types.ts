import type { BaseGenome } from "genetic-search";
import type { TypesConfig } from "../../config/types";

// TODO попробовать такой вариант
export type CompositeSimulationGenome = BaseGenome & {
  id: number;
  expressionIndices: TypesConfig; // индексы доминантных генов
  chromosomes: TypesConfig[];     // много разных вариантов генома, из которых происходит выборочная экспрессия
}

export type CompositeGenomeConfig = {
  chromosomesCount: number;
}
