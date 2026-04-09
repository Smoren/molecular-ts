import type { BaseGenome, IdGeneratorInterface, PopulateStrategyInterface, Population } from "genetic-search";
import type { CompositeGenomeConfig, CompositeSimulationGenome } from "./types";
import type { RandomTypesConfig, TransformationConfig } from "../../config/types";
import { RandomPopulateStrategy } from "../strategies";

export class CompositeGenomeRandomPopulateStrategy implements PopulateStrategyInterface<CompositeSimulationGenome> {
  private readonly compositeGenomeConfig: CompositeGenomeConfig;
  private readonly strategy: RandomPopulateStrategy;

  constructor(compositeGenomeConfig: CompositeGenomeConfig, randomizeConfigCollection: RandomTypesConfig[], transformationConfig?: TransformationConfig) {
    this.compositeGenomeConfig = compositeGenomeConfig;
    this.strategy = new RandomPopulateStrategy(randomizeConfigCollection, transformationConfig);
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<BaseGenome>): Population<CompositeSimulationGenome> {
    const chromosomeBatches = []
    for (let i = 0; i < this.compositeGenomeConfig.chromosomesCount; i++) {
      chromosomeBatches.push(this.strategy.populate(size, idGenerator));
    }
    const population: Population<CompositeSimulationGenome> = [];
    return population;
  }
}
