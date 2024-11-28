import { reduce } from "itertools-ts";
import type { Population, PopulationSummary } from "genetic-search";
import { arraySum, round } from "@/lib/math";
import type { SimulationGenome } from "@/lib/genetic/types";
import { convertToTable } from '@/scripts/lib/helpers';

export function getScoresSummary(losses: number[], precision: number = 4): [number, number, number, number, number] {
  const best = round(losses[0], precision);
  const second = round(losses[1], precision);
  const mean = round(losses.reduce((a, b) => a + b, 0) / losses.length, precision);
  const median = round(losses[round(losses.length/2, 0)], precision);
  const worst = round(losses[losses.length-1], precision);

  return [best, second, mean, median, worst];
}

export function printGenerationSummary(generation: number, bestGenome: SimulationGenome, summary: PopulationSummary): void {
  console.log(`\n[GENERATION ${generation}] best id=${bestGenome.id}`);

  const fitnessSummary = summary.fitnessSummary;
  const groupedFitnessSummary = summary.groupedFitnessSummary;
  const ageSummary = summary.ageSummary;

  const table = [
    ['scores:', `best=${fitnessSummary.best}`, `second=${fitnessSummary.second}`, `mean=${fitnessSummary.mean}`, `median=${fitnessSummary.median}`, `worst=${fitnessSummary.worst}`],
    ['population count:', `initial=${groupedFitnessSummary.initial.count}`, `mutated=${groupedFitnessSummary.mutation.count}`, `crossed=${groupedFitnessSummary.crossover.count}`],
    ['population scores:', `initial=${groupedFitnessSummary.initial.mean}`, `mutated=${groupedFitnessSummary.mutation.mean}`, `crossed=${groupedFitnessSummary.crossover.mean}`],
    ['population ages:', `min=${ageSummary.min}`, `mean=${ageSummary.mean}`, `max=${ageSummary.max}`],
  ];

  console.log(convertToTable(table, 3));
}
