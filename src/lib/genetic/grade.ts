import type { TypesConfig, WorldConfig } from '../config/types';
import {
  createDefaultClusterizationWeightsConfig,
  gradeCompoundClusters,
  calcMetricsForCompoundClustersSummary, weighCompoundClustersSummaryMetrics,
} from '../analysis/utils';
import { CompoundsAnalyzer } from '../analysis/compounds';
import type { TotalSummary } from '../analysis/types';
import { arrayBinaryOperation, arraySum, averageMatrixColumns } from '../math/operations';
import { convertTotalSummaryToSummaryMatrixRow, createHeadless2dSimulationRunner } from './helpers';
import type { ClusterizationTaskConfig, ClusterizationWeightsConfig } from './types';
import { sleep } from "./utils";

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
    const clustersMetrics = calcMetricsForCompoundClustersSummary(clustersSummary, clusterizationWeights);
    const clustersScore = weighCompoundClustersSummaryMetrics(clustersMetrics, clusterizationWeights);

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
    const clustersSummary = gradeCompoundClusters(
      compounds,
      typesConfig.FREQUENCIES.length,
      weights.minCompoundSize,
    );
    const clustersMetrics = calcMetricsForCompoundClustersSummary(clustersSummary, weights);
    const [clustersScore, clusterSize, clustersCount, relativeClustered, relativeFiltered] = clustersMetrics;

    const linksCreatedVector = sim.summary.LINKS_TYPE_CREATED;
    const clusteredTypesVector = clustersSummary.clusteredTypesVector;

    if (linksCreatedVector.length !== clusteredTypesVector.length) {
      throw new Error(`linksCreatedVector.length (${linksCreatedVector.length}) !== clusteredTypesVector.length (${clusteredTypesVector.length})`);
    }

    const linksCreated = clustersSummary.clusteredCount < 1 ? 0 : arraySum(arrayBinaryOperation(
      linksCreatedVector,
      clusteredTypesVector,
      (a, b) => a * b / clustersSummary.clusteredCount,
    ));

    const rawMatrix = [
      clustersScore,
      clusterSize ** weights.clusterSizeWeight,
      clustersCount ** weights.clustersCountWeight,
      relativeClustered ** weights.relativeClusteredCountWeight,
      relativeFiltered ** weights.relativeFilteredCountWeight,
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
