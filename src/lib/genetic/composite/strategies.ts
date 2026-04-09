import type { IdGeneratorInterface, PopulateStrategyInterface, Population } from "genetic-search";
import type { CompositeSimulationGenome } from "./types";
import type { RandomTypesConfig, TransformationConfig } from "../../config/types";
import { getRandomArrayItem } from "../../math/random";
import { createRandomCompositeGenome } from "./utils";

export class CompositeGenomeRandomPopulateStrategy implements PopulateStrategyInterface<CompositeSimulationGenome> {
  private readonly chromosomesCount: number;
  private readonly randomizeConfigCollection: RandomTypesConfig[];
  private readonly transformationConfig: TransformationConfig;

  constructor(chromosomesCount: number, randomizeConfigCollection: RandomTypesConfig[], transformationConfig?: TransformationConfig) {
    this.chromosomesCount = chromosomesCount;
    this.randomizeConfigCollection = randomizeConfigCollection;
    this.transformationConfig = transformationConfig ?? {};
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<CompositeSimulationGenome>): Population<CompositeSimulationGenome> {
    const population: Population<CompositeSimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
      const genome = createRandomCompositeGenome(idGenerator.nextId(), this.chromosomesCount, randomizeConfig);
      for (const chromosome of genome.chromosomes) {
        chromosome.TRANSFORMATION = this.transformationConfig;
      }
      population.push(genome);
    }
    return population;
  }
}
