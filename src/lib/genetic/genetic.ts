import { multi, single } from 'itertools-ts';
import type {
  GeneticSearchConfig,
  StrategyConfig,
  GeneticSearchInterface,
  GenerationCallback,
  GenerationScores,
  Population,
  BaseGenome,
} from '../types/genetic';
import { createNextIdGenerator } from './helpers';
import { getRandomArrayItem } from '../math/random';

export class GeneticSearch<TGenome extends BaseGenome> implements GeneticSearchInterface<TGenome> {
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

  public async fit(generationsCount: number, afterStep: GenerationCallback): Promise<void> {
    for (let i=0; i<generationsCount; i++) {
      afterStep(i, await this.step());
    }
  }

  public async step(): Promise<GenerationScores> {
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
    return this.strategy.populate.populate(size, this.nextId);
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
      const crossedGenome = this.strategy.crossover.cross(lhs, rhs, this.nextId());
      newPopulation.push(crossedGenome);
    }

    return newPopulation;
  }

  protected clone(genomes: Population<TGenome>, count: number): Population<TGenome> {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(genomes);
      const mutatedGenome = this.strategy.mutation.mutate(genome, this.nextId());
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

export class ComposedGeneticSearch<TGenome extends BaseGenome> implements GeneticSearchInterface<TGenome> {
  private readonly eliminators: GeneticSearchInterface<TGenome>[];
  private readonly final: GeneticSearchInterface<TGenome>;

  constructor(eliminators: GeneticSearchInterface<TGenome>[], final: GeneticSearchInterface<TGenome>) {
    this.eliminators = eliminators;
    this.final = final;
  }

  public getPopulation(): Population<TGenome> {
    const result: Population<TGenome> = [];
    for (const eliminators of this.eliminators) {
      result.push(...eliminators.getPopulation());
    }
    return result;
  }

  public setPopulation(population: Population<TGenome>): void {
    for (const eliminator of this.eliminators) {
      eliminator.setPopulation(population.slice(0, eliminator.getPopulation().length));
      population = population.slice(eliminator.getPopulation().length);
    }
  }

  public async fit(generationsCount: number, afterStep: GenerationCallback): Promise<void> {
    for (let i=0; i<generationsCount; i++) {
      afterStep(i, await this.step());
    }
  }

  public async step(): Promise<GenerationScores> {
    for (const eliminators of this.eliminators) {
      await eliminators.step();
    }
    this.final.setPopulation(this.getBestGenomes());
    return await this.final.step();
  }

  public getBestGenome(): TGenome {
    return this.final.getBestGenome();
  }

  private getBestGenomes(): Population<TGenome> {
    return this.eliminators.map((eliminators) => eliminators.getBestGenome());
  }
}
