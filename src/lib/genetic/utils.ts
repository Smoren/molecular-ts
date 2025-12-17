import type { RandomTypesConfig, TypesConfig, WorldConfig } from "../config/types";
import { Runner } from "../simulation/runner";
import { Simulation } from "../simulation/simulation";
import { createPhysicModel } from "../utils/functions";
import { create2dRandomDistribution, create3dRandomDistribution } from "../config/atoms";
import { createDummyDrawer } from "../drawer/dummy";

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

export function createHeadless3dSimulationRunner(worldConfig: WorldConfig, typesConfig: TypesConfig): Runner {
  const sim = new Simulation({
    viewMode: '3d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create3dRandomDistribution,
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
