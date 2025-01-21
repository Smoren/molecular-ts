import type { TypesConfig, WorldConfig } from '../../config/types';
import type { ClusterizationParams } from '../types';
import type { ClustersGradeMaximizeTaskConfig } from './types';
import { calcCompoundsClusterizationSummary, calcCompoundsClusterizationScore } from '../../analysis/calc';
import { averageMatrixColumns } from '../../math/operations';
import { sleep, createHeadless2dSimulationRunner } from "../utils";
import { convertCompoundsClusterizationScoreToPhenotypeRow } from "../clusters-grade-maximize/converters";

// TODO rename run to calcPhenotype
export async function runSimulationForClustersGrade(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  clusterizationParams: ClusterizationParams,
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

    const clusterizationSummary = calcCompoundsClusterizationSummary(compounds, typesConfig.FREQUENCIES.length, clusterizationParams.minCompoundSize);
    const clusterizationScore = calcCompoundsClusterizationScore(clusterizationSummary, compounds, sim);
    const clusterizationPhenotype = convertCompoundsClusterizationScoreToPhenotypeRow(clusterizationScore);

    summaryMatrix.push(clusterizationPhenotype);

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
  clusterizationParams,
  checkpoints,
  repeats,
]: ClustersGradeMaximizeTaskConfig): Promise<number[]> {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(await runSimulationForClustersGrade(worldConfig, typesConfig, clusterizationParams, checkpoints));
  }
  return averageMatrixColumns(result);
}

export async function repeatRunSimulationForClustersGradeWithTimeout([
  _,
  worldConfig,
  typesConfig,
  clusterizationParams,
  checkpoints,
  repeats,
]: ClustersGradeMaximizeTaskConfig): Promise<number[]> {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(await runSimulationForClustersGrade(worldConfig, typesConfig, clusterizationParams, checkpoints, 1));
  }
  return averageMatrixColumns(result);
}
