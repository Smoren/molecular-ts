import { reduce } from "itertools-ts";
import type { Population } from "genetic-search";
import { arraySum, round } from "@/lib/math";
import type { SimulationGenome } from "@/lib/genetic/types";

export function getScoresSummary(losses: number[], precision: number = 4): [number, number, number, number, number] {
  const best = round(losses[0], precision);
  const second = round(losses[1], precision);
  const mean = round(losses.reduce((a, b) => a + b, 0) / losses.length, precision);
  const median = round(losses[round(losses.length/2, 0)], precision);
  const worst = round(losses[losses.length-1], precision);

  return [best, second, mean, median, worst];
}

export function getPopulationSummary(population: Population<SimulationGenome>, precision: number = 4): [number, number, number, number, number, number] {
  const initial = population.filter(genome => genome.stats!.origin === 'initial');
  const mutated = population.filter(genome => genome.stats!.origin === 'mutation');
  const crossed = population.filter(genome => genome.stats!.origin === 'crossover');

  const initialCount = initial.length;
  const mutatedCount = mutated.length;
  const crossedCount = crossed.length;

  const initialScores = initial.map((genome) => genome.stats!.fitness);
  const mutatedScores = mutated.map((genome) => genome.stats!.fitness);
  const crossedScores = crossed.map((genome) => genome.stats!.fitness);

  const initialScore = initialScores.length ? round(arraySum(initialScores) / initialScores.length, precision) : 0;
  const mutatedScore = mutatedScores.length ? round(arraySum(mutatedScores) / mutatedScores.length, precision) : 0;
  const crossedScore = crossedScores.length ? round(arraySum(crossedScores) / crossedScores.length, precision) : 0;

  return [initialCount, mutatedCount, crossedCount, initialScore, mutatedScore, crossedScore];
}

export function getAgeSummary(population: Population<SimulationGenome>, precision: number = 4): [number, number, number] {
  const meanAge = round(reduce.toAverage(population.map(genome => genome.stats!.age)) ?? 0, precision);
  const [minAge, maxAge] = reduce.toMinMax(population.map(genome => genome.stats!.age));

  return [minAge ?? 0, meanAge, maxAge ?? 0];
}
