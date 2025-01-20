import type {
  ClusterizationTaskConfig,
  ClusterizationParams,
  SimulationGenome,
  SimulationMultiprocessingMetricsStrategyConfig,
} from "./types";
import { BaseMultiprocessingPhenotypeStrategy } from "genetic-search-multiprocess";

export class ClusterizationMultiprocessingPhenotypeStrategy extends BaseMultiprocessingPhenotypeStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, ClusterizationTaskConfig> {
  private readonly params: ClusterizationParams;

  constructor(config: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, params: ClusterizationParams) {
    super(config);
    this.params = params;
  }

  protected createTaskInput(genome: SimulationGenome): ClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.params, this.config.checkpoints, this.config.repeats];
  }
}

export const clusterizationGradeMultiprocessingTask = async ([
  _,
  worldConfig,
  typesConfig,
  clusterizationParams,
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
    clusterizationParams,
    checkpoints,
    repeats,
  ]);
}
