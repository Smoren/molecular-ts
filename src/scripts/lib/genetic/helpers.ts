import { arraySum, round } from "@/lib/math";
import type { Population } from "genetic-search";
import type { SimulationGenome } from "@/lib/genetic/types";

export function getScoresSummary(losses: number[], precision: number = 4): [number, number, number, number, number] {
  const best = round(losses[0], precision);
  const second = round(losses[1], precision);
  const mean = round(losses.reduce((a, b) => a + b, 0) / losses.length, precision);
  const median = round(losses[round(losses.length/2, 0)], precision);
  const worst = round(losses[losses.length-1], precision);

  return [best, second, mean, median, worst];
}

export function getPopulationSummary(population: Population<SimulationGenome>, precision: number = 4): [number, number, number, number] {
  const averageAge = round(arraySum(population.map(genome => genome.stats!.age)) / population.length, precision);
  const initialCount = population.filter(genome => genome.stats!.origin === 'initial').length;
  const mutatedCount = population.filter(genome => genome.stats!.origin === 'mutation').length;
  const crossedCount = population.filter(genome => genome.stats!.origin === 'crossover').length;

  return [averageAge, initialCount, mutatedCount, crossedCount];
}
