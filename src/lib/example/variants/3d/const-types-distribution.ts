import type {
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { createBaseTypesConfig } from "../../../config/types";
import { createBaseWorldConfig } from "../../../config/world";
import { create3dRandomDistribution } from "../../../config/atoms";
import { Simulation } from "../../../simulation";
import { create3dDrawer } from "../../../drawer/3d";
import { PhysicModelV1 } from "../../../physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();

export function create3dSimulationWithConstTypes() {
  return new Simulation({
    viewMode: '3d',
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create3dRandomDistribution,
    drawer: create3dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
