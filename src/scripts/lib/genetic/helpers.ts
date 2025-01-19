import type { GeneticSearchConfig, PopulationSummary } from "genetic-search";
import type { SimulationGenome } from "@/lib/genetic/types";
import { convertToTable } from '@/scripts/lib/helpers';

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

export function modifyMacroConfig(
  config: GeneticSearchConfig,
  populationSize: number | undefined,
  survivalRate: number | undefined,
  crossoverRate: number | undefined,
): void {
  if (populationSize !== undefined) {
    config.populationSize = populationSize;
  }
  if (survivalRate !== undefined) {
    config.survivalRate = survivalRate;
  }
  if (crossoverRate !== undefined) {
    config.crossoverRate = crossoverRate;
  }
}
