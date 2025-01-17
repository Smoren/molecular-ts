import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/config/types";
import { Runner } from "@/lib/simulation/runner";
import { Simulation } from "@/lib/simulation/simulation";
import { createPhysicModel } from "@/lib/utils/functions";
import { create2dRandomDistribution } from "@/lib/config/atoms";
import { createDummyDrawer } from "@/lib/drawer/dummy";

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createHeadless2dSimulationRunner(worldConfig: WorldConfig, typesConfig: TypesConfig): Runner {
  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  return new Runner(sim);
}

export function setTypesCountToRandomizeConfigCollection(configs: RandomTypesConfig[], typesCount: number): RandomTypesConfig[] {
  return configs.map((config) => {
    config.TYPES_COUNT = typesCount;
    return config;
  });
}
