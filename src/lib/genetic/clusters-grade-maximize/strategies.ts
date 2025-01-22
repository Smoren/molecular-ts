import type {
  FitnessStrategyInterface,
  GenerationFitnessColumn,
  GenerationPhenomeMatrix,
} from "genetic-search";
import type {
  ClusterizationParams,
  ClusterizationWeights,
  SimulationGenome,
  SimulationPhenomeStrategyConfig
} from "../types";
import type { ClustersGradeMaximizeTaskConfig } from "./types";
import { BasePhenomeStrategy } from "genetic-search";
import { batchNormalizedClustersGradeMaximizeFitnessMul, clustersGradeMaximizeFitnessMul } from "./fitness";

export class ClustersGradeMaximizePhenomeStrategy extends BasePhenomeStrategy<SimulationGenome, SimulationPhenomeStrategyConfig<ClustersGradeMaximizeTaskConfig>, ClustersGradeMaximizeTaskConfig> {
  private readonly params: ClusterizationParams;

  constructor(config: SimulationPhenomeStrategyConfig<ClustersGradeMaximizeTaskConfig>, params: ClusterizationParams) {
    super(config);
    this.params = params;
  }

  protected createTaskInput(genome: SimulationGenome): ClustersGradeMaximizeTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.params, this.config.checkpoints, this.config.repeats];
  }
}

export class ClustersGradeMaximizeFitnessStrategy implements FitnessStrategyInterface {
  private readonly weights: ClusterizationWeights;

  constructor(weights: ClusterizationWeights) {
    this.weights = weights;
  }

  score(results: GenerationPhenomeMatrix): GenerationFitnessColumn {
    return results.map((result) => clustersGradeMaximizeFitnessMul(result, this.weights));
  }
}

export class ClustersGradeMaximizeNormalizedFitnessStrategy implements FitnessStrategyInterface {
  private readonly weights: ClusterizationWeights;

  constructor(weights: ClusterizationWeights) {
    this.weights = weights;
  }

  score(results: GenerationPhenomeMatrix): GenerationFitnessColumn {
    return batchNormalizedClustersGradeMaximizeFitnessMul(results, this.weights);
  }
}
