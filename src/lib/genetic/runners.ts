import type { TypesConfig, WorldConfig } from '../config/types';
import { calcCompoundsClusterizationSummary, calcCompoundsClusterizationScore } from '../analysis/calc';
import { averageMatrixColumns } from '../math/operations';
import type { ClusterizationTaskConfig, ClusterizationWeightsConfig } from './types';
import { sleep, createHeadless2dSimulationRunner } from "./utils";
import { convertCompoundsClusterizationScoreToMetricsRow } from "./converters";

export async function runSimulationForClustersGrade(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  weights: ClusterizationWeightsConfig,
  checkpoints: number[],
  timeout?: number,
): Promise<number[]> {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    if (timeout) {
      await runner.runStepsWithTimeout(stepsCount, timeout);
    } else {
      runner.runSteps(stepsCount);
    }

    const compounds = sim.exportCompounds();

    const clusterizationSummary = calcCompoundsClusterizationSummary(compounds, typesConfig.FREQUENCIES.length, weights.minCompoundSize);
    const clusterizationScore = calcCompoundsClusterizationScore(clusterizationSummary, compounds, sim);
    const clusterizationMetrics = convertCompoundsClusterizationScoreToMetricsRow(clusterizationScore);

    summaryMatrix.push(clusterizationMetrics);

    if (timeout) {
      await sleep(timeout);
    }
  }

  return averageMatrixColumns(summaryMatrix);
}

export async function repeatRunSimulationForClustersGrade([
  _,
  worldConfig,
  typesConfig,
  weights,
  checkpoints,
  repeats,
]: ClusterizationTaskConfig): Promise<number[]> {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(await runSimulationForClustersGrade(worldConfig, typesConfig, weights, checkpoints));
  }
  return averageMatrixColumns(result);
}

export async function repeatRunSimulationForClustersGradeWithTimeout([
  _,
  worldConfig,
  typesConfig,
  weights,
  checkpoints,
  repeats,
]: ClusterizationTaskConfig): Promise<number[]> {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(await runSimulationForClustersGrade(worldConfig, typesConfig, weights, checkpoints, 1));
  }
  return averageMatrixColumns(result);
}
