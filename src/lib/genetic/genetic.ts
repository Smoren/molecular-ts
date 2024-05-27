import { multi, single, transform } from 'itertools-ts';
import type {
  GeneticSearchMacroConfig,
  GeneticSearchInputConfig,
  GeneticSearchConfig,
  StrategyConfig,
  GeneticSearchInterface,
  GenerationCallback,
  Genome,
  Population,
} from '../types/genetic';
import { createNextIdGenerator, normalizeSummaryMatrix } from './helpers';
import { arrayBinaryOperation, arraySum } from '../math';
import { getRandomArrayItem } from '../math/random';

export class GeneticSearch implements GeneticSearchInterface {
  private readonly config: GeneticSearchConfig;
  private readonly strategy: StrategyConfig;
  private readonly nextId: () => number;
  private population: Population;

  constructor(macroConfig: GeneticSearchMacroConfig, inputConfig: GeneticSearchInputConfig, strategy: StrategyConfig) {
    this.config = { ...macroConfig, ...inputConfig };
    this.strategy = strategy;
    this.nextId = createNextIdGenerator();

    this.population = this.createPopulation(this.config.populationSize);
  }

  public async run(generationsCount: number, afterStep: GenerationCallback): Promise<void> {
    for (let i=0; i<generationsCount; i++) {
      afterStep(i, await this.runGenerationStep());
    }
  }

  public async runGenerationStep(): Promise<[number[], number[]]> {
    const [countToSurvive, countToCross, countToClone] = this.getSizes();

    const results = await this.strategy.runner.run(this.population);
    const [normalizedLosses, absoluteLosses] = this.calcLosses(results);
    const [
      sortedPopulation,
      sortNormalizedLosses,
      sortAbsoluteLosses,
    ] = this.sortPopulation(normalizedLosses, absoluteLosses);

    const survivedPopulation = sortedPopulation.slice(0, countToSurvive);
    const crossedPopulation = this.crossover(survivedPopulation, countToCross);
    const mutatedPopulation = this.clone(survivedPopulation, countToClone);

    this.population = [...survivedPopulation, ...crossedPopulation, ...mutatedPopulation];
    // this.population = [...sortedPopulation];

    return [sortNormalizedLosses, sortAbsoluteLosses];
  }

  public getBestGenome(): Genome {
    return this.population[0];
  }

  public getPopulation(): Population {
    return this.population;
  }

  private createPopulation(size: number): Population {
    return this.strategy.populate
      .populate(size)
      .map((x) => ({ ...x, id: this.nextId() }));
  }

  private crossover(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const lhs = getRandomArrayItem(genomes);
      const rhs = getRandomArrayItem(genomes);
      const crossedGenome = this.strategy.crossover.cross(this.nextId(), lhs, rhs);
      newPopulation.push(crossedGenome);
    }

    return newPopulation;
  }

  private clone(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(genomes);
      // TODO mutationProbability to separate config
      const mutatedGenome = this.strategy.mutation.mutate(this.nextId(), genome);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
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
    return normalizeSummaryMatrix(results, this.config.reference).map((result) => this.weighRow(result));
  }

  private getAbsoluteLosses(results: number[][]): number[][] {
    const weightedReference = this.weighRow(this.config.reference);
    return results.map((result) => this.weighRow(result).map((x, i) => Math.abs(x - weightedReference[i])));
  }

  private weighRow(result: number[]): number[] {
    return arrayBinaryOperation(result, this.config.weights, (x, y) => x * y);
  }

  private getSizes(): number[] {
    const countToSurvive = Math.round(this.config.populationSize * this.config.survivalRate);
    const countToDie = this.config.populationSize - countToSurvive;

    const countToCross = Math.round(countToDie * this.config.crossoverRate);
    const countToClone = countToDie - countToCross;

    return [countToSurvive, countToCross, countToClone];
  }
}
