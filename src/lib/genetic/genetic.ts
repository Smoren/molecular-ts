import { multi, single, transform } from 'itertools-ts';
import type {
  GeneticSearchConfig,
  GeneticSearchReferenceConfig,
  StrategyConfig,
  GeneticSearchInterface,
  GenerationCallback,
  GenerationScores,
  Genome,
  Population,
} from '../types/genetic';
import { createNextIdGenerator, normalizeSummaryMatrix } from './helpers';
import { arrayBinaryOperation, arraySum } from '../math';
import { getRandomArrayItem } from '../math/random';

abstract class GeneticSearch implements GeneticSearchInterface {
  protected readonly strategy: StrategyConfig;
  protected readonly nextId: () => number;
  protected readonly config: GeneticSearchConfig;
  protected population: Population;

  protected constructor(config: GeneticSearchConfig, strategy: StrategyConfig) {
    this.config = config;
    this.strategy = strategy;
    this.nextId = createNextIdGenerator();

    this.population = this.createPopulation(this.config.populationSize);
  }

  public abstract runGenerationStep(): Promise<GenerationScores>;

  public async run(generationsCount: number, afterStep: GenerationCallback): Promise<void> {
    for (let i=0; i<generationsCount; i++) {
      afterStep(i, await this.runGenerationStep());
    }
  }

  public getBestGenome(): Genome {
    return this.population[0];
  }

  public getPopulation(): Population {
    return this.population;
  }

  public setPopulation(population: Population) {
    this.population = population;
  }

  protected createPopulation(size: number): Population {
    return this.strategy.populate
      .populate(size)
      .map((x) => ({ ...x, id: this.nextId() }));
  }

  protected crossover(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const lhs = getRandomArrayItem(genomes);
      const rhs = getRandomArrayItem(genomes);
      const crossedGenome = this.strategy.crossover.cross(this.nextId(), lhs, rhs);
      newPopulation.push(crossedGenome);
    }

    return newPopulation;
  }

  protected clone(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(genomes);
      const mutatedGenome = this.strategy.mutation.mutate(this.nextId(), genome);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  protected refreshPopulation(sortedPopulation: Population): void {
    const [countToSurvive, countToCross, countToClone] = this.getSizes();

    const survivedPopulation = sortedPopulation.slice(0, countToSurvive);
    const crossedPopulation = this.crossover(survivedPopulation, countToCross);
    const mutatedPopulation = this.clone(survivedPopulation, countToClone);

    this.population = [...survivedPopulation, ...crossedPopulation, ...mutatedPopulation];
  }

  protected getSizes(): number[] {
    const countToSurvive = Math.round(this.config.populationSize * this.config.survivalRate);
    const countToDie = this.config.populationSize - countToSurvive;

    const countToCross = Math.round(countToDie * this.config.crossoverRate);
    const countToClone = countToDie - countToCross;

    return [countToSurvive, countToCross, countToClone];
  }
}

export class ComposedGeneticSearch extends GeneticSearch implements GeneticSearchInterface {
  private referenceConfig: GeneticSearchReferenceConfig;

  constructor(config: GeneticSearchConfig, referenceConfig: GeneticSearchReferenceConfig, strategy: StrategyConfig) {
    super(config, strategy);
    this.referenceConfig = referenceConfig;
  }

  public async runGenerationStep(): Promise<GenerationScores> {
    const results = await this.strategy.runner.run(this.population);

    const [normalizedLosses, absoluteLosses] = this.calcLosses(results);
    const [
      sortedPopulation,
      sortedNormalizedLosses,
    ] = this.sortPopulation(normalizedLosses, absoluteLosses);

    this.refreshPopulation(sortedPopulation);

    return sortedNormalizedLosses;
  }

  private sortPopulation(normalizedLosses: number[], absoluteLosses: number[]): [Population, number[], number[]] {
    const zipped = multi.zip(this.population, normalizedLosses, absoluteLosses);
    const sorted = single.sort(zipped, (lhs, rhs) => lhs[1] - rhs[1]);
    const sortedArray = transform.toArray(sorted);
    return [
      transform.toArray(single.map(sortedArray, (x) => x[0])),
      transform.toArray(single.map(sortedArray, (x) => x[1])),
      transform.toArray(single.map(sortedArray, (x) => x[2])),
    ];
  }

  private calcLosses(results: number[][]): [number[], number[]] {
    const normalizedLosses = this.getNormalizedLosses(results);
    const absoluteLosses = this.getAbsoluteLosses(results);

    return [
      normalizedLosses.map((x) => arraySum(x)),
      absoluteLosses.map((x) => arraySum(x)),
    ];
  }

  private getNormalizedLosses(results: number[][]): number[][] {
    return normalizeSummaryMatrix(results, this.referenceConfig.reference).map((result) => this.weighRow(result));
  }

  private getAbsoluteLosses(results: number[][]): number[][] {
    const weightedReference = this.weighRow(this.referenceConfig.reference);
    return results.map((result) => this.weighRow(result).map((x, i) => Math.abs(x - weightedReference[i])));
  }

  private weighRow(result: number[]): number[] {
    return arrayBinaryOperation(result, this.referenceConfig.weights, (x, y) => x * y);
  }
}
