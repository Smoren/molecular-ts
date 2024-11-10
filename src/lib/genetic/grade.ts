import type { TypesConfig, WorldConfig } from '../types/config';
import {
  createDefaultClusterizationWeightsConfig,
  gradeCompoundClusters,
  scoreCompoundClustersSummary,
} from '../analysis/utils';
import { CompoundsAnalyzer } from '../analysis/compounds';
import type { TotalSummary } from '../types/analysis';
import { arraySum, averageMatrixColumns } from '../math/operations';
import { convertTotalSummaryToSummaryMatrixRow, createHeadless2dSimulationRunner } from './helpers';
import type { ClusterizationWeightsConfig } from '../types/genetic';

export function runSimulationForReferenceGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[]): number[] {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    runner.runSteps(stepsCount);

    const clusterizationWeights = createDefaultClusterizationWeightsConfig();
    const compounds = sim.exportCompounds();
    const clustersSummary = gradeCompoundClusters(
      compounds,
      typesConfig.FREQUENCIES.length,
      clusterizationWeights.minCompoundSize,
    );
    const clustersScore = scoreCompoundClustersSummary(clustersSummary, clusterizationWeights);

    const compoundsAnalyzer = new CompoundsAnalyzer(compounds, sim.atoms, typesConfig.FREQUENCIES.length);
    const totalSummary: TotalSummary = {
      WORLD: sim.summary,
      COMPOUNDS: compoundsAnalyzer.summary,
      CLUSTERS: clustersScore,
    };
    const rawMatrix = convertTotalSummaryToSummaryMatrixRow(totalSummary);
    summaryMatrix.push(rawMatrix);
  }

  return averageMatrixColumns(summaryMatrix);
}

export function repeatRunSimulationForReferenceGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[], repeats: number): number[] {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(runSimulationForReferenceGrade(worldConfig, typesConfig, checkpoints));
  }
  return averageMatrixColumns(result);
}

export function runSimulationForClustersGrade(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  weights: ClusterizationWeightsConfig,
  checkpoints: number[],
): number[] {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    runner.runSteps(stepsCount);

    const compounds = sim.exportCompounds();
    const relativeCompoundedAtomsCount = arraySum(compounds.map((compound) => compound.size)) / sim.atoms.length;
    const relativeLinksCount = sim.links.length / sim.atoms.length;
    const clustersSummary = gradeCompoundClusters(
      compounds,
      typesConfig.FREQUENCIES.length,
      weights.minCompoundSize,
    );
    const clustersScore = scoreCompoundClustersSummary(clustersSummary, weights);
    const rawMatrix = [
      clustersScore,
      relativeCompoundedAtomsCount ** weights.relativeCompoundedAtomsCountWeight,
      relativeLinksCount ** weights.relativeLinksCountWeight,
    ];
    summaryMatrix.push(rawMatrix);
  }

  return averageMatrixColumns(summaryMatrix);
}

export function repeatRunSimulationForClustersGrade(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  weights: ClusterizationWeightsConfig,
  checkpoints: number[],
  repeats: number,
): number[] {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(runSimulationForClustersGrade(worldConfig, typesConfig, weights, checkpoints));
  }
  return averageMatrixColumns(result);
}
