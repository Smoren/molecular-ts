import type { MutationStrategyConfig } from "./types";
import type { RandomTypesConfig } from "../config/types";
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
