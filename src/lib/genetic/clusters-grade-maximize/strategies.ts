import type {
  FitnessStrategyInterface,
  GenerationFitnessColumn,
  GenerationPhenotypeMatrix,
} from "genetic-search";
import type {
  ClusterizationParams,
  ClusterizationWeights,
  SimulationGenome,
  SimulationPhenotypeStrategyConfig
} from "../types";
import type { ClustersGradeMaximizeTaskConfig } from "./types";
import { BasePhenotypeStrategy } from "genetic-search";
import { clustersGradeMaximizeFitnessMul } from "./fitness";

export class ClustersGradeMaximizePhenotypeStrategy extends BasePhenotypeStrategy<SimulationGenome, SimulationPhenotypeStrategyConfig<ClustersGradeMaximizeTaskConfig>, ClustersGradeMaximizeTaskConfig> {
  private readonly params: ClusterizationParams;

  constructor(config: SimulationPhenotypeStrategyConfig<ClustersGradeMaximizeTaskConfig>, params: ClusterizationParams) {
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

  score(results: GenerationPhenotypeMatrix): GenerationFitnessColumn {
    return results.map((result) => clustersGradeMaximizeFitnessMul(result, this.weights));
  }
}
