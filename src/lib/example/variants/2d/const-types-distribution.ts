import type {
  TypesConfig,
  WorldConfig,
} from "../../../config/types";
import { create2dDrawer, createDefaultShowConfig } from "../../../drawer/2d";
import { createDefaultTypesConfig } from "../../../config/atom-types";
import { createBaseWorldConfig } from "../../../config/world";
import { create2dRandomDistribution } from "../../../config/atoms";
import { Simulation } from "../../../simulation/simulation";
import { PhysicModelV1 } from "../../../physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createDefaultTypesConfig();

export function create2dSimulationWithConstTypes() {
  return new Simulation({
    viewMode: '2d',
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create2dRandomDistribution,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG, createDefaultShowConfig()),
  });
}
