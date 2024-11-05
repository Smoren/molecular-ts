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

    const compounds = sim.exportCompounds();
    const clustersSummary = gradeCompoundClusters(
      compounds,
      typesConfig.FREQUENCIES.length,
      5,
    );
    const clustersScore = scoreCompoundClustersSummary(clustersSummary);

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

    const compounds = sim.exportCompounds();
    const clustersSummary = gradeCompoundClusters(
      compounds,
      typesConfig.FREQUENCIES.length,
      5,
    );
    const clustersScore = scoreCompoundClustersSummary(clustersSummary);
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
