import { Pool } from 'multiprocess-pool';
import { createHeadless2dSimulationRunner } from "@/lib/genetic/helpers";
import { getWorldConfig } from "@/scripts/lib/genetic/io";
import { createDefaultRandomTypesConfig, createRandomTypesConfig } from "@/lib/config/atom-types";
import type { TypesConfig, WorldConfig } from "@/lib/config/types";
import os from "os";
import { infinite, multi, single } from "itertools-ts";

export const actionTestRunMultiprocess = async () => {
  const initialConfig = {
    "ATOMS_COUNT": 2000,
    "MIN_POSITION": [0, 0],
    "MAX_POSITION": [2500, 2500]
  };
  const worldConfig = getWorldConfig('default-world-config', initialConfig);
  const randomTypesConfig = createDefaultRandomTypesConfig(8);
  const typesConfig = createRandomTypesConfig(randomTypesConfig);

  const poolSize = os.cpus().length;
  const pool = new Pool(poolSize);
  console.log('POOL SIZE:', poolSize);

  const inputs = [...single.limit(multi.zip(
    infinite.repeat(worldConfig),
    infinite.repeat(typesConfig),
  ), 100)];

  const ts = Date.now();

  await pool.map(inputs, runMultiprocessingSimulation, {
    onResult: (result: [number, number], index: number) => console.log(
      `Index: ${index+1}. Only run: ${result[0]} ms. With import: ${result[1]} ms. Total: ${Date.now() - ts} ms`
    ),
  });
  pool.close();

  console.log('TOTAL TIME', Date.now() - ts);
}

export const runMultiprocessingSimulation = async ([
  worldConfig,
  typesConfig,
]: [WorldConfig, TypesConfig]): Promise<[number, number]> => {
  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { runSimulation } = await import(`${dirName}/scripts/actions/test-run-multiprocess`);

  const ts = Date.now();
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const runTime = runSimulation(worldConfig, typesConfig, 100);

  return [runTime, Date.now() - ts];
}

export const runSimulation = (worldConfig: WorldConfig, typesConfig: TypesConfig, steps: number) => {
  const ts = Date.now();
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);
  runner.runSteps(steps);
  return Date.now() - ts;
}
