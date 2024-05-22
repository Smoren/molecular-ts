import { createBaseWorldConfig } from '@/lib/config/world';
import { creatDefaultTypesConfig } from '@/lib/config/types';
import { createPhysicModel } from '@/lib/utils/functions';
import { create2dRandomDistribution } from '@/lib/config/atoms';
import { createDummyDrawer } from '@/lib/drawer/dummy';
import { Simulation } from '@/lib/simulation';
import { Runner } from '@/lib/runner';
import { CompoundsAnalyzer } from '@/lib/analysis/compounds';

export const actionTestSimulation = (...args: string[]) => {
  console.log('[START] test simulation action', args);

  const worldConfig = createBaseWorldConfig();
  const typesConfig = creatDefaultTypesConfig();

  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  const runner = new Runner(sim);
  runner.runSteps(500);

  console.log(sim.summary);

  const compounds = new CompoundsAnalyzer(sim.exportCompounds(), sim.atoms, typesConfig.FREQUENCIES.length);
  console.log(compounds.sizeByTypes);
  console.log(compounds.itemLengthSummary);
  console.log(compounds.itemLengthByTypesSummary);

  console.log('[FINISH]');
}
