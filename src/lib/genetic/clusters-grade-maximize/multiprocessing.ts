import { BaseMultiprocessingPhenomeStrategy } from "genetic-search-multiprocess";
import type {
  ClusterizationParams,
  SimulationGenome,
  SimulationMultiprocessingPhenomeStrategyConfig,
} from "../types";
import type { ClustersGradeMaximizeTaskConfig } from "./types";

export class ClusterizationMultiprocessingPhenomeStrategy extends BaseMultiprocessingPhenomeStrategy<SimulationGenome, SimulationMultiprocessingPhenomeStrategyConfig<ClustersGradeMaximizeTaskConfig>, ClustersGradeMaximizeTaskConfig> {
  private readonly params: ClusterizationParams;

  constructor(config: SimulationMultiprocessingPhenomeStrategyConfig<ClustersGradeMaximizeTaskConfig>, params: ClusterizationParams) {
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

  let { calcPhenomeForClustersGradeMaximize } = await import(`${dirName}/lib/genetic/clusters-grade-maximize/phenome`);
  if (calcPhenomeForClustersGradeMaximize === undefined) {
    // For compatibility with node 23+
    const imported = await import(`${dirName}/lib/genetic/clusters-grade-maximize/phenome`);
    calcPhenomeForClustersGradeMaximize = imported.default.calcPhenomeForClustersGradeMaximize;
  }

  return calcPhenomeForClustersGradeMaximize([
    _,
    worldConfig,
    typesConfig,
    clusterizationParams,
    checkpoints,
    repeats,
  ]);
}
