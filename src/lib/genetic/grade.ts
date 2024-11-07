import type { TypesConfig, WorldConfig } from '../types/config';
import { gradeCompoundClusters, scoreCompoundClustersSummary } from '../analysis/utils';
import { CompoundsAnalyzer } from '../analysis/compounds';
import type { TotalSummary } from '../types/analysis';
import { averageMatrixColumns } from '../math/operations';
import { convertTotalSummaryToSummaryMatrixRow, createHeadless2dSimulationRunner } from './helpers';

export function runSimulationForComplexGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[]): number[] {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    runner.runSteps(stepsCount);

    const clusterizationWeights = {
      minCompoundSize: 5,
      relativeFilteredCountWeight: 1,
      relativeClusteredCountWeight: 1,
      vertexesCountWeight: 1,
      edgesCountWeight: 1,
      uniqueTypesCountWeight: 2,
      symmetryWeight: 1,
      differenceWeight: 1,
      radiusWeight: 1/3,
    };

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

export function repeatRunSimulationForComplexGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[], repeats: number): number[] {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(runSimulationForComplexGrade(worldConfig, typesConfig, checkpoints));
  }
  return averageMatrixColumns(result);
}

export function runSimulationForClusterGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[]): number[] {
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  const sim = runner.simulation;
  const summaryMatrix: number[][] = [];

  for (const stepsCount of checkpoints) {
    runner.runSteps(stepsCount);

    const weights = {
      minCompoundSize: 5,
      relativeFilteredCountWeight: 1,
      relativeClusteredCountWeight: 1,
      vertexesCountWeight: 1,
      edgesCountWeight: 1,
      uniqueTypesCountWeight: 2,
      symmetryWeight: 1,
      differenceWeight: 1,
      radiusWeight: 1/3,
    };

    const compounds = sim.exportCompounds();
    const clustersSummary = gradeCompoundClusters(
      compounds,
      typesConfig.FREQUENCIES.length,
      weights.minCompoundSize,
    );
    const clustersScore = scoreCompoundClustersSummary(clustersSummary, weights);
    const rawMatrix = [clustersScore];
    summaryMatrix.push(rawMatrix);
  }

  return averageMatrixColumns(summaryMatrix);
}

export function repeatRunSimulationForClusterGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[], repeats: number): number[] {
  const result = [];
  for (let i=0; i<repeats; i++) {
    result.push(runSimulationForClusterGrade(worldConfig, typesConfig, checkpoints));
  }
  return averageMatrixColumns(result);
}
