import type {
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { creatDefaultTypesConfig } from "../../../config/types";
import { createBaseWorldConfig } from "../../../config/world";
import { create3dButterfly } from "../../../config/atoms";
import { Simulation } from "../../../simulation";
import { create3dDrawer } from "../../../drawer/3d";
import { PhysicModelV1 } from "../../../physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = creatDefaultTypesConfig();

export function create3dSimulationButterfly() {
  return new Simulation({
    viewMode: '3d',
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create3dButterfly,
    drawer: create3dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
