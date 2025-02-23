import type { TypesConfig, WorldConfig } from '../../config/types';
import type { ClusterizationParams } from '../types';
import type { ClustersGradeMaximizeTaskConfig } from './types';
import { calcCompoundsClusterizationSummary, calcCompoundsClusterizationScore } from '../../analysis/calc';
import { averageMatrixColumns } from '../../math/operations';
import { sleep, createHeadless2dSimulationRunner } from "../utils";
import { convertCompoundsClusterizationScoreToPhenomeRow } from "../clusters-grade-maximize/converters";

// Used by dynamic import in multiprocessing
export function calcPhenomeForClustersGradeMaximize([
  _,
  worldConfig,
  typesConfig,
  clusterizationParams,
  checkpoints,
  repeats,
]: ClustersGradeMaximizeTaskConfig): number[] {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(runSimulationForClustersGrade(worldConfig, typesConfig, clusterizationParams, checkpoints));
  }
  return averageMatrixColumns(result);
}

export async function calcPhenomeForClustersGradeMaximizeAsync([
  _,
  worldConfig,
  typesConfig,
  clusterizationParams,
  checkpoints,
  repeats,
]: ClustersGradeMaximizeTaskConfig): Promise<number[]> {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(await runSimulationForClustersGradeAsync(worldConfig, typesConfig, clusterizationParams, checkpoints, 1));
  }
  return averageMatrixColumns(result);
}

function runSimulationForClustersGrade(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  clusterizationParams: ClusterizationParams,
  checkpoints: number[],
): number[] {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    runner.runSteps(stepsCount);

    const compounds = sim.exportCompounds();

    const clusterizationSummary = calcCompoundsClusterizationSummary(
      compounds,
      typesConfig.FREQUENCIES.length,
      clusterizationParams.minCompoundSize,
      clusterizationParams.minUniqueTypesCount,
    );
    const clusterizationScore = calcCompoundsClusterizationScore(clusterizationSummary, compounds, sim);
    const clusterizationPhenome = convertCompoundsClusterizationScoreToPhenomeRow(clusterizationScore);

    summaryMatrix.push(clusterizationPhenome);
  }

  return averageMatrixColumns(summaryMatrix);
}

async function runSimulationForClustersGradeAsync(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  clusterizationParams: ClusterizationParams,
  checkpoints: number[],
  timeout: number,
): Promise<number[]> {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    await runner.runStepsWithTimeout(stepsCount, timeout);

    const compounds = sim.exportCompounds();

    const clusterizationSummary = calcCompoundsClusterizationSummary(
      compounds,
      typesConfig.FREQUENCIES.length,
      clusterizationParams.minCompoundSize,
      clusterizationParams.minUniqueTypesCount,
    );
    const clusterizationScore = calcCompoundsClusterizationScore(clusterizationSummary, compounds, sim);
    const clusterizationPhenome = convertCompoundsClusterizationScoreToPhenomeRow(clusterizationScore);

    summaryMatrix.push(clusterizationPhenome);

    await sleep(timeout);
  }

  return averageMatrixColumns(summaryMatrix);
}
