import type { TypesConfig, WorldConfig } from '@/lib/types/config';
import { Simulation } from '@/lib/simulation';
import { createPhysicModel } from '@/lib/utils/functions';
import { create2dRandomDistribution } from '@/lib/config/atoms';
import { createDummyDrawer } from '@/lib/drawer/dummy';
import { Runner } from '@/lib/runner';
import { gradeCompoundClusters, scoreCompoundClustersSummary } from '@/lib/analysis/utils';
import { CompoundsAnalyzer } from '@/lib/analysis/compounds';
import type { TotalSummary } from '@/lib/types/analysis';
import { averageMatrixColumns } from '@/lib/math/operations';
import { convertTotalSummaryToSummaryMatrixRow } from '@/lib/genetic/helpers';

export function runSimulationForComplexGrade(worldConfig: WorldConfig, typesConfig: TypesConfig, checkpoints: number[]): number[] {
  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  const runner = new Runner(sim);
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
