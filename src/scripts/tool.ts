import { Simulation } from '@/lib/simulation';
import { Runner } from '@/lib/runner';
import { create2dBaseInitialConfig } from '@/lib/config/initial';
import { createPhysicModel } from '@/lib/utils/functions';
import { create2dRandomDistribution } from '@/lib/config/atoms';
import { createBaseWorldConfig } from '@/lib/config/world';
import { createBaseTypesConfig } from '@/lib/config/types';
import { createDummyDrawer } from '@/lib/drawer/dummy';
import { CompoundsAnalyzer } from '@/lib/analysis/compounds';
import { Router } from '@/scripts/lib/router';

const router = new Router();

router.onBeforeRun((action) => {
  console.log('');
  console.log('***********************');
  console.log('** COMMAND LINE TOOL **');
  console.log('***********************');
  console.log('');
  console.log(`Action to run: "${action}"`);
  console.log('');
})

router.add('test', (...args: string[]) => {
  console.log('[START] test action', args);

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

  console.log(sim.summary);

  const compounds = new CompoundsAnalyzer(sim.exportCompounds(), sim.atoms);
  console.log(compounds.lengthByTypes);
  console.log(compounds.itemLengthSummary);
  console.log(compounds.itemLengthByTypesSummary);

  console.log('[FINISH]');
});

router.run(process.argv.slice(2));
