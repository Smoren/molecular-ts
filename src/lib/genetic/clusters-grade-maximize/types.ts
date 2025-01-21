import type { GeneticSearchConfig } from "genetic-search";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from "../../config/types";
import type {
  ClusterizationConfig,
  ClusterizationParams,
  MutationStrategyConfig,
  SimulationMultiprocessingPhenotypeStrategyConfig,
} from "../types";

export type ClustersGradeMaximizeTaskConfig = [number, WorldConfig, TypesConfig, ClusterizationParams, number[], number];

export type ClusterGradeMaximizeConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingPhenotypeStrategyConfig<ClustersGradeMaximizeTaskConfig>;
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfigCollection: RandomTypesConfig[];
  mutationRandomizeConfigCollection: RandomTypesConfig[];
  crossoverRandomizeConfigCollection: RandomTypesConfig[];
  randomizeStartPopulation: boolean;
  worldConfig: WorldConfig;
  clusterizationConfig: ClusterizationConfig;
  typesCount: number;
  useCache: boolean;
  useComposedAlgo: boolean;
  composedFinalPopulation: number;
  genomeAgeWeight: number;
}

export type ClusterGradeMaximizeGeneticMainConfig<TTaskConfig> = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  metrics: SimulationMultiprocessingPhenotypeStrategyConfig<TTaskConfig>;
  mutation: MutationStrategyConfig;
}
