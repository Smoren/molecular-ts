import type { IdGeneratorInterface, PopulateStrategyInterface, Population } from "genetic-search";
import type { CompositeSimulationGenome } from "./types";
import type { RandomTypesConfig, TransformationConfig } from "../../config/types";
import { getRandomArrayItem } from "../../math/random";
import { createRandomCompositeGenome, createTransparentCompositeGenome } from "./utils";
import type { SimulationGenome } from "@/lib/genetic/types";
import { createTransparentTypesConfig } from "@/lib/config/atom-types";

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

export class CompositeGenomeZeroValuesPopulateStrategy implements PopulateStrategyInterface<CompositeSimulationGenome> {
  private readonly chromosomesCount: number;
  private readonly typesCount: number;
  private readonly transformationConfig: TransformationConfig;

  constructor(chromosomesCount: number, typesCount: number, transformationConfig?: TransformationConfig) {
    this.chromosomesCount = chromosomesCount;
    this.typesCount = typesCount;
    this.transformationConfig = transformationConfig ?? {};
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<CompositeSimulationGenome>): Population<CompositeSimulationGenome> {
    const population: Population<CompositeSimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const genome = createTransparentCompositeGenome(idGenerator.nextId(), this.typesCount, this.chromosomesCount);
      for (const chromosome of genome.chromosomes) {
        chromosome.TRANSFORMATION = this.transformationConfig;
      }
      population.push(genome);
    }
    return population;
  }
}
