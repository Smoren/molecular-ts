import os from 'os';
import { Pool } from "multiprocess-pool";
import type { TypesConfig, WorldConfig } from '@/lib/types/config';
import { createBaseWorldConfig } from '@/lib/config/world';
import { createBaseTypesConfig } from '@/lib/config/types';

export const simulationTask = async (
  [id, worldConfig, typesConfig, steps]: [number, WorldConfig, TypesConfig, number],
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

  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  const runner = new Runner(sim);
  runner.runSteps(steps);

  const compounds = new CompoundsAnalyzer(sim.exportCompounds(), sim.atoms);

  console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);

  return {
    world: sim.summary,
    compounds: compounds.summary,
  };
}

export const actionTestSimulationParallel = async (...args: string[]) => {
  console.log('[START] test parallel simulation action', args);
  const ts = Date.now();

  const worldConfig = createBaseWorldConfig();
  const typesConfig = createBaseTypesConfig();

  const stepsCount = 300;
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
  for (let i = 0; i < 100; i++) {
    inputs.push([i+1, worldConfig, typesConfig, stepsCount]);
  }

  const cpuCount = os.cpus().length;
  console.log('CPUs:', cpuCount);

  const pool = new Pool(cpuCount);
  const result = await pool.map(inputs, simulationTask);
  console.log(result);

  pool.close();

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}
