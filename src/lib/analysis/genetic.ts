import type { RandomTypesConfig, TypesConfig, WorldConfig } from '../types/config';
import { randomizeTypesConfig } from "@/lib/config/types";
import { normalizeSummaryMatrix } from "@/lib/analysis/helpers";
import { multi, single, transform } from "itertools-ts";
import { arrayBinaryOperation, arraySum } from "@/lib/math";

type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  mutationRate: number;
  reference: number[];
  weights: number[];
  worldConfig: WorldConfig;
  randomTypesConfig: RandomTypesConfig;
};

type PopulationItem = {
  typesConfig: TypesConfig;
}

type Population = PopulationItem[];

export class GeneticSearch {
  private config: GeneticSearchConfig;
  private population: Population;

  constructor(config: GeneticSearchConfig) {
    this.config = config;
    this.population = this.createPopulation(config.populationSize);
  }

  private createPopulation(size: number): Population {
    const population = [];
    for (let i = 0; i < size; i++) {
      population.push({ typesConfig: randomizeTypesConfig(this.config.randomTypesConfig) });
    }
    return population;
  }

  private normalizeResults(results: number[][]): number[][] {
    return normalizeSummaryMatrix([...results, this.config.reference], this.config.randomTypesConfig.TYPES_COUNT);
  }

  private weighResults(results: number[][]): number[][] {
    return results.map(
      (result) => arrayBinaryOperation(result, this.config.weights, (x, y) => x * y)
    );
  }

  private rankPopulation(results: number[][]): Population {
    const iter = single.sort(
      multi.zip(results, this.population),
      (lhs, rhs) => arraySum(lhs[0]) - arraySum(rhs[0]),
    )
    return transform.toArray(single.map(iter, (x) => x[1]));
  }
}
