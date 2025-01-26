import type { SelectionStrategyInterface } from "genetic-search";
import type {
  MutationStrategyConfig,
  SelectionStrategyFactoryConfig,
  SelectionStrategyType,
  SimulationGenome
} from "./types";
import type { RandomTypesConfig } from "../config/types";
import {
  RandomSelectionStrategy,
  TruncationSelectionStrategy,
  ProportionalSelectionStrategy,
  TournamentSelectionStrategy,
} from "genetic-search";
import {
  ComposedMutationStrategy,
  CopyTypeMutationStrategy,
  DynamicProbabilityMutationStrategy,
} from "./strategies";

export function createComposedMutationStrategy(
  config: MutationStrategyConfig,
  randomTypesConfigCollection: RandomTypesConfig[],
): ComposedMutationStrategy {
  return new ComposedMutationStrategy([
    new DynamicProbabilityMutationStrategy(config.dynamicProbabilities, randomTypesConfigCollection),
    new CopyTypeMutationStrategy(),
  ], config.composedProbabilities)
}

export function createSelectionStrategy({
  type,
  crossoverParentsCount = 2,
  truncationSliceThresholdRate = 0.5,
  tournamentSize = 5,
}: SelectionStrategyFactoryConfig): SelectionStrategyInterface<SimulationGenome> {
  switch (type) {
    case 'random':
      return new RandomSelectionStrategy(crossoverParentsCount);
    case 'truncation':
      return new TruncationSelectionStrategy(crossoverParentsCount, tournamentSize);
    case 'proportional':
      return new ProportionalSelectionStrategy(crossoverParentsCount);
    case 'tournament':
      return new TournamentSelectionStrategy(crossoverParentsCount, truncationSliceThresholdRate);
  }

  throw new Error(`Unknown selection strategy type: ${type}`);
}
