import { createHeadless2dSimulationRunner } from "@/lib/genetic/helpers";
import { getWorldConfig } from "@/scripts/lib/genetic/io";
import { createDefaultRandomTypesConfig, createRandomTypesConfig } from "@/lib/config/atom-types";

export const actionTestRunSingle = async () => {
  const initialConfig = {
    "ATOMS_COUNT": 2000,
    "MIN_POSITION": [0, 0],
    "MAX_POSITION": [2500, 2500]
  };
  const worldConfig = getWorldConfig('default-world-config', initialConfig);
  const randomTypesConfig = createDefaultRandomTypesConfig(8);
  const typesConfig = createRandomTypesConfig(randomTypesConfig);
  const runner = createHeadless2dSimulationRunner(worldConfig, typesConfig);

  for (let i=0; i<100; i++) {
    const ts = Date.now();
    runner.runSteps(100);
    console.log(`Step ${i+1} time elapsed: ${Date.now() - ts} ms`);
  }
}
