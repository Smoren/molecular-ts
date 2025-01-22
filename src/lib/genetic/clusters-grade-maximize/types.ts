import type { GeneticSearchConfig, PhenomeRow } from "genetic-search";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from "../../config/types";
import type {
  ClusterizationConfig,
  ClusterizationParams,
  ClusterizationWeights,
  MutationStrategyConfig,
  SimulationMultiprocessingPhenomeStrategyConfig,
} from "../types";

export type ClustersGradeMaximizeTaskConfig = [number, WorldConfig, TypesConfig, ClusterizationParams, number[], number];

export type ClusterGradeMaximizeConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  phenomeStrategyConfig: SimulationMultiprocessingPhenomeStrategyConfig<ClustersGradeMaximizeTaskConfig>;
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
  phenome: SimulationMultiprocessingPhenomeStrategyConfig<TTaskConfig>;
  mutation: MutationStrategyConfig;
}

export type ClustersGradeMaximizeFitnessParams = {
  phenome: PhenomeRow;
  weights: ClusterizationWeights;
  weigher: (value: number, weight: number) => number;
  debug: boolean;
}
