import type {
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  SimulationGenome,
  SimulationMultiprocessingMetricsStrategyConfig,
} from "./types";
import { BaseMultiprocessingPhenotypeStrategy } from "genetic-search-multiprocess";

export class ClusterizationMultiprocessingPhenotypeStrategy extends BaseMultiprocessingPhenotypeStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, ClusterizationTaskConfig> {
  private readonly weights: ClusterizationWeightsConfig;

  constructor(config: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, weights: ClusterizationWeightsConfig) {
    super(config);
    this.weights = weights;
  }

  protected createTaskInput(genome: SimulationGenome): ClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.weights, this.config.checkpoints, this.config.repeats];
  }
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
  const { repeatRunSimulationForClustersGrade } = await import(`${dirName}/lib/genetic/runners`);

  return repeatRunSimulationForClustersGrade([
    _,
    worldConfig,
    typesConfig,
    weights,
    checkpoints,
    repeats,
  ]);
}
