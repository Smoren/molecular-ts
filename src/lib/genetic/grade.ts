import type { TypesConfig, WorldConfig } from '../config/types';
import {
  createDefaultClusterizationWeightsConfig,
  calcCompoundsClusterizationSummary,
  calcCompoundsClusterizationScore,
} from '../analysis/utils';
import { CompoundsAnalyzer } from '../analysis/compounds';
import type { TotalSummary } from '../analysis/types';
import { arrayBinaryOperation, arraySum, averageMatrixColumns } from '../math/operations';
import { convertTotalSummaryToSummaryMatrixRow, createHeadless2dSimulationRunner } from './helpers';
import type { ClusterizationTaskConfig, ClusterizationWeightsConfig } from './types';
import { sleep } from "./utils";
import {
  convertCompoundsClusterizationScoreToMetricsRow,
  weighCompoundClusterizationMetricsRow,
} from "./converters";

export function runSimulationForReferenceGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[]): number[] {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    runner.runSteps(stepsCount);

    const clusterizationWeights = createDefaultClusterizationWeightsConfig();
    const compounds = sim.exportCompounds();
    const clusterizationSummary = calcCompoundsClusterizationSummary(
      compounds,
      typesConfig.FREQUENCIES.length,
      clusterizationWeights.minCompoundSize,
    );
    const clusterizationScore = calcCompoundsClusterizationScore(clusterizationSummary);
    const clusterizationMetrics = convertCompoundsClusterizationScoreToMetricsRow(clusterizationScore);
    const clusterizationScoreValue = weighCompoundClusterizationMetricsRow(clusterizationMetrics, clusterizationWeights);

    const compoundsAnalyzer = new CompoundsAnalyzer(compounds, sim.atoms, typesConfig.FREQUENCIES.length);
    const totalSummary: TotalSummary = {
      WORLD: sim.summary,
      COMPOUNDS: compoundsAnalyzer.summary,
      CLUSTERS: clusterizationScoreValue,
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
    const relativeCompoundedAtomsCount = arraySum(compounds.map((compound) => compound.size)) / sim.atoms.length;
    const relativeLinksCount = sim.links.length / sim.atoms.length;

    const clusterizationSummary = calcCompoundsClusterizationSummary(
      compounds,
      typesConfig.FREQUENCIES.length,
      weights.minCompoundSize,
    );
    const clusterizationScore = calcCompoundsClusterizationScore(clusterizationSummary);

    const linksCreatedVector = sim.summary.LINKS_TYPE_CREATED;
    const clusteredTypesVector = clusterizationSummary.clusteredTypesVector;

    if (linksCreatedVector.length !== clusteredTypesVector.length) {
      throw new Error(`linksCreatedVector.length (${linksCreatedVector.length}) !== clusteredTypesVector.length (${clusteredTypesVector.length})`);
    }

    const linksCreated = clusterizationSummary.clusteredCount < 1 ? 0 : arraySum(arrayBinaryOperation(
      linksCreatedVector,
      clusteredTypesVector,
      (a, b) => a * b / clusterizationSummary.clusteredCount,
    ));

    const rawMatrix = [
      clusterizationScore.averageVertexesCount ** weights.vertexesCountWeight,
      clusterizationScore.averageEdgesCount ** weights.edgesCountWeight,
      clusterizationScore.averageUniqueTypesCount ** weights.uniqueTypesCountWeight,
      clusterizationScore.symmetryGrade ** weights.symmetryWeight,
      clusterizationScore.averageRadius ** weights.radiusWeight,
      clusterizationScore.averageSpeed ** weights.speedWeight,
      clusterizationScore.averageDifference ** weights.differenceWeight,
      clusterizationScore.averageClusterSize ** weights.averageClusterSizeWeight,
      clusterizationScore.clustersCount ** weights.clustersCountWeight,
      clusterizationScore.relativeClustered ** weights.relativeClusteredCountWeight,
      clusterizationScore.relativeFiltered ** weights.relativeFilteredCountWeight,

      // TODO move to calcCompoundsClusterizationScore()
      relativeCompoundedAtomsCount ** weights.relativeCompoundedAtomsCountWeight,
      relativeLinksCount ** weights.relativeLinksCountWeight,
      linksCreated ** weights.linksCreatedWeight,
    ];
    summaryMatrix.push(rawMatrix);

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
