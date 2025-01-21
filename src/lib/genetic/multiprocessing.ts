import type {
  ClustersGradeMaximizeTaskConfig,
  ClusterizationParams,
  SimulationGenome,
  SimulationMultiprocessingPhenotypeStrategyConfig,
} from "./types";
import { BaseMultiprocessingPhenotypeStrategy } from "genetic-search-multiprocess";

export class ClusterizationMultiprocessingPhenotypeStrategy extends BaseMultiprocessingPhenotypeStrategy<SimulationGenome, SimulationMultiprocessingPhenotypeStrategyConfig<ClustersGradeMaximizeTaskConfig>, ClustersGradeMaximizeTaskConfig> {
  private readonly params: ClusterizationParams;

  constructor(config: SimulationMultiprocessingPhenotypeStrategyConfig<ClustersGradeMaximizeTaskConfig>, params: ClusterizationParams) {
    super(config);
    this.params = params;
  }

  protected createTaskInput(genome: SimulationGenome): ClustersGradeMaximizeTaskConfig {
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
]: ClustersGradeMaximizeTaskConfig): Promise<number[]> => {
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
