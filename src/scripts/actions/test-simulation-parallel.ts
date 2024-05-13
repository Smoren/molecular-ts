import { Pool } from "multiprocess-pool";

export const simulationTask = async (id: number) => {
  console.log(`-> task ${id} started`);
  const ts = Date.now();

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { createBaseWorldConfig } = await import(`${dirName}/lib/config/world`);
  const { createBaseTypesConfig } = await import(`${dirName}/lib/config/types`);
  const { create2dBaseInitialConfig } = await import(`${dirName}/lib/config/initial`);
  const { createPhysicModel } = await import(`${dirName}/lib/utils/functions`);
  const { create2dRandomDistribution } = await import(`${dirName}/lib/config/atoms`);
  const { createDummyDrawer } = await import(`${dirName}/lib/drawer/dummy`);
  const { Simulation } = await import(`${dirName}/lib/simulation`);
  const { Runner } = await import(`${dirName}/lib/runner`);
  const { CompoundsAnalyzer } = await import(`${dirName}/lib/analysis/compounds`);

  const worldConfig = createBaseWorldConfig();
  const typesConfig = createBaseTypesConfig();
  const initialConfig = create2dBaseInitialConfig();

  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    initialConfig: initialConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  const runner = new Runner(sim);
  runner.runSteps(500);

  // console.log(sim.summary);

  const compounds = new CompoundsAnalyzer(sim.exportCompounds(), sim.atoms);
  // console.log(compounds.lengthByTypes);
  // console.log(compounds.itemLengthSummary);
  // console.log(compounds.itemLengthByTypesSummary);

  console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);

  return compounds.lengthByTypes;
}

export const actionTestParallelSimulation = async (...args: string[]) => {
  console.log('[START] test parallel simulation action', args);
  const ts = Date.now();

  const inputs = [1, 2, 3, 4, 5, 6, 7, 8];

  const pool = new Pool(20);
  const result = await pool.map(inputs, simulationTask);
  console.log(result);

  pool.close();

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}
