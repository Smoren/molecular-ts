import os from 'os';
import { Pool } from "multiprocess-pool";
import type { TypesConfig, WorldConfig } from '@/lib/types/config';
import { createWorldConfig2d } from '@/lib/config/world';
import { creatDefaultTypesConfig } from '@/lib/config/types';
import {
  convertWeightsToSummaryMatrixRow,
  createTransparentWeights,
  normalizeSummaryMatrix,
} from "@/lib/genetic/helpers";

export const simulationTask = async (
  [id, worldConfig, typesConfig, steps]: [number, WorldConfig, TypesConfig, number[]],
) => {
  console.log(`-> task ${id} started`);
  const ts = Date.now();

  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { testSimulation } = await import(`${dirName}/lib/analysis/helpers`);

  const result = testSimulation(worldConfig, typesConfig, steps);

  console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);

  return result;
}

export const actionTestSimulationParallel = async (...args: string[]) => {
  console.log('[START] test parallel simulation action', args);
  const ts = Date.now();

  const stepsCount = [300, 5, 5, 5, 5];
  const atomsCount = 500;
  const minPosition = [0, 0];
  const maxPosition = [1000, 1000];

  const initialConfig = {
    ATOMS_COUNT: atomsCount,
    MIN_POSITION: minPosition,
    MAX_POSITION: maxPosition,
  };

  const worldConfig = createWorldConfig2d(initialConfig);
  const typesConfig = creatDefaultTypesConfig();
  const typesCount = typesConfig.FREQUENCIES.length;

  const inputs = [];
  for (let i = 0; i < 10; i++) {
    inputs.push([i+1, worldConfig, typesConfig, stepsCount]);
  }

  const cpuCount = os.cpus().length;
  console.log('CPUs:', cpuCount);

  const pool = new Pool(cpuCount);
  const summaries: number[][] = await pool.map(inputs, simulationTask);
  pool.close();

  // const normalizedMatrix = normalizeSummaryMatrix(summaries, typesCount);
  const weights = convertWeightsToSummaryMatrixRow(createTransparentWeights(), typesCount);

  // console.log(normalizedMatrix);

  console.log(summaries[0].length);
  console.log(weights.length);

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}
