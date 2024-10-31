import { multi, single } from 'itertools-ts';
import type {
  GeneticSearchConfig,
  StrategyConfig,
  GeneticSearchInterface,
  GenerationCallback,
  GenerationScores,
  Population,
} from '../types/genetic';
import { createNextIdGenerator } from './helpers';
import { getRandomArrayItem } from '../math/random';

export class GeneticSearch<TGenome> implements GeneticSearchInterface<TGenome> {
  protected readonly strategy: StrategyConfig<TGenome>;
  protected readonly nextId: () => number;
  protected readonly config: GeneticSearchConfig;
  protected population: Population<TGenome>;

  constructor(config: GeneticSearchConfig, strategy: StrategyConfig<TGenome>) {
    this.config = config;
    this.strategy = strategy;
    this.nextId = createNextIdGenerator();

    this.population = this.createPopulation(this.config.populationSize);
  }

  public async run(generationsCount: number, afterStep: GenerationCallback): Promise<void> {
    for (let i=0; i<generationsCount; i++) {
      afterStep(i, await this.runGenerationStep());
    }
  }

  public async runGenerationStep(): Promise<GenerationScores> {
    const results = await this.strategy.runner.run(this.population);
    const scores = this.strategy.scoring.score(results);

    const [
      sortedPopulation,
      sortedNormalizedLosses,
    ] = this.sortPopulation(scores);

    this.refreshPopulation(sortedPopulation);

    return sortedNormalizedLosses;
  }

  public getBestGenome(): TGenome {
    return this.population[0];
  }

  public getPopulation(): Population<TGenome> {
    return this.population;
  }

  public setPopulation(population: Population<TGenome>) {
    this.population = population;
  }

  protected createPopulation(size: number): Population<TGenome> {
    return this.strategy.populate
      .populate(size)
      .map((x) => ({ ...x, id: this.nextId() }));
  }

  protected sortPopulation(scores: number[]): [Population<TGenome>, number[]] {
    const zipped = multi.zip(this.population, scores);
    const sorted = single.sort(zipped, (lhs, rhs) => rhs[1] - lhs[1]);
    const sortedArray = [...sorted];
    return [
      [...single.map(sortedArray, (x) => x[0])],
      [...single.map(sortedArray, (x) => x[1])],
    ];
  }

  protected crossover(genomes: Population<TGenome>, count: number): Population<TGenome> {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const lhs = getRandomArrayItem(genomes);
      const rhs = getRandomArrayItem(genomes);
      const crossedGenome = this.strategy.crossover.cross(this.nextId(), lhs, rhs);
      newPopulation.push(crossedGenome);
    }

    return newPopulation;
  }

  protected clone(genomes: Population<TGenome>, count: number): Population<TGenome> {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(genomes);
      const mutatedGenome = this.strategy.mutation.mutate(this.nextId(), genome);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  protected refreshPopulation(sortedPopulation: Population<TGenome>): void {
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
