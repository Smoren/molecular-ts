import type {
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { create2dDrawer } from "../../../drawer/2d";
import { creatDefaultTypesConfig } from "../../../config/types";
import { createBaseWorldConfig } from "../../../config/world";
import { create2dButterfly } from "../../../config/atoms";
import { Simulation } from "../../../simulation";
import { PhysicModelV1 } from "../../../physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = creatDefaultTypesConfig();

export function create2dSimulationButterfly() {
  return new Simulation({
    viewMode: '2d',
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create2dButterfly,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
