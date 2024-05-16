import os from 'os';
import { Pool } from "multiprocess-pool";
import type { TypesConfig, WorldConfig } from '@/lib/types/config';
import { createBaseWorldConfig } from '@/lib/config/world';
import { createBaseTypesConfig } from '@/lib/config/types';
import type { TotalSummary } from "@/lib/types/analysis";
import {
  convertWeightsToSummaryMatrixRow,
  createTransparentWeights,
  getSummaryMatrixGroupIndexes,
  normalizeSummaryMatrix,
} from "@/lib/analysis/helpers";

export const simulationTask = async (
  [id, worldConfig, typesConfig, steps]: [number, WorldConfig, TypesConfig, number[]],
) => {
  console.log(`-> task ${id} started`);
  const ts = Date.now();

  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { createPhysicModel } = await import(`${dirName}/lib/utils/functions`);
  const { create2dRandomDistribution } = await import(`${dirName}/lib/config/atoms`);
  const { createDummyDrawer } = await import(`${dirName}/lib/drawer/dummy`);
  const { Simulation } = await import(`${dirName}/lib/simulation`);
  const { Runner } = await import(`${dirName}/lib/runner`);
  const { CompoundsAnalyzer } = await import(`${dirName}/lib/analysis/compounds`);
  const { convertSummaryToSummaryMatrixRow } = await import(`${dirName}/lib/analysis/helpers`);
  const { averageMatrixColumns } = await import(`${dirName}/lib/math/operations`);

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

  for (const stepsCount of steps) {
    runner.runSteps(stepsCount);

    const compounds = new CompoundsAnalyzer(sim.exportCompounds(), sim.atoms, typesConfig.FREQUENCIES.length);
    const totalSummary: TotalSummary = {
      WORLD: sim.summary,
      COMPOUNDS: compounds.summary,
    };
    const rawMatrix = convertSummaryToSummaryMatrixRow(totalSummary);
    summaryMatrix.push(rawMatrix);
  }

  console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);

  return averageMatrixColumns(summaryMatrix);
}

export const actionTestSimulationParallel = async (...args: string[]) => {
  console.log('[START] test parallel simulation action', args);
  const ts = Date.now();

  const worldConfig = createBaseWorldConfig();
  const typesConfig = createBaseTypesConfig();
  const typesCount = typesConfig.FREQUENCIES.length;

  const stepsCount = [300, 5, 5, 5, 5];
  const atomsCount = 500;
  const minPosition = [0, 0];
  const maxPosition = [1000, 1000];

  worldConfig.CONFIG_2D.INITIAL = {
    ATOMS_COUNT: atomsCount,
    MIN_POSITION: minPosition,
    MAX_POSITION: maxPosition,
  };

  worldConfig.CONFIG_2D.BOUNDS = {
    MIN_POSITION: minPosition,
    MAX_POSITION: maxPosition,
  };

  const inputs = [];
  for (let i = 0; i < 10; i++) {
    inputs.push([i+1, worldConfig, typesConfig, stepsCount]);
  }

  const cpuCount = os.cpus().length;
  console.log('CPUs:', cpuCount);

  const pool = new Pool(cpuCount);
  const summaries: number[][] = await pool.map(inputs, simulationTask);
  pool.close();

  const normalizedMatrix = normalizeSummaryMatrix(summaries, typesCount);
  const indexes = getSummaryMatrixGroupIndexes(typesCount);
  const weights = convertWeightsToSummaryMatrixRow(createTransparentWeights(), typesCount);

  console.log(normalizedMatrix);

  console.log(summaries[0].length);
  console.log(weights.length);
  console.log(indexes.flat(1).length);

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}
