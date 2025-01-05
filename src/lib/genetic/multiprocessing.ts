import type {
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  ReferenceTaskConfig,
  SimulationGenome,
  SimulationMultiprocessingMetricsStrategyConfig,
} from "./types";
import { BaseMultiprocessingMetricsStrategy } from "genetic-search-multiprocess";
import { repeatRunSimulationForReferenceGrade } from "./grade";

export class ReferenceMultiprocessingMetricsStrategy extends BaseMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ReferenceTaskConfig>, ReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): ReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class ClusterizationMultiprocessingMetricsStrategy extends BaseMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, ClusterizationTaskConfig> {
  private weights: ClusterizationWeightsConfig;

  constructor(config: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, weights: ClusterizationWeightsConfig) {
    super(config);
    this.weights = weights;
  }

  protected createTaskInput(genome: SimulationGenome): ClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.weights, this.config.checkpoints, this.config.repeats];
  }
}

export const referenceGradeMultiprocessingTask = async ([
  _,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: ReferenceTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocessor/lib', '/src');
  const { repeatRunSimulationForReferenceGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatRunSimulationForReferenceGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const referenceGradeTask = async ([
  _,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: ReferenceTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return repeatRunSimulationForReferenceGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const clusterizationGradeMultiprocessingTask = async ([
  _,
  worldConfig,
  typesConfig,
  weights,
  checkpoints,
  repeats,
]: ClusterizationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocessor/lib', '/src');
  const { repeatRunSimulationForClustersGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatRunSimulationForClustersGrade([
    _,
    worldConfig,
    typesConfig,
    weights,
    checkpoints,
    repeats,
  ]);
}
