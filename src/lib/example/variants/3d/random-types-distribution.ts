import type {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { createRandomTypesConfig } from "@/lib/config/types";
import { createBaseWorldConfig } from "@/lib/config/world";
import { create3dBaseInitialConfig } from "@/lib/config/initial";
import { create3dRandomDistribution } from "@/lib/config/atoms";
import { Simulation } from "../../../simulation";
import { create3dDrawer } from "../../../drawer/3d";
import { PhysicModelV1 } from "../../../physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createRandomTypesConfig({
  TYPES_COUNT: 4,

  USE_RADIUS_BOUNDS: false,
  USE_FREQUENCY_BOUNDS: false,
  USE_GRAVITY_BOUNDS: true,
  USE_LINK_GRAVITY_BOUNDS: true,
  USE_LINK_BOUNDS: true,
  USE_LINK_TYPE_BOUNDS: true,
  USE_LINK_FACTOR_DISTANCE_BOUNDS: true,

  RADIUS_BOUNDS: [0.5, 1.5],
  FREQUENCY_BOUNDS: [0.1, 1, 0.5, 0.1],
  GRAVITY_BOUNDS: [-1, 0.5],
  LINK_GRAVITY_BOUNDS: [-1, 0.5],
  LINK_BOUNDS: [1, 3],
  LINK_TYPE_BOUNDS: [0, 3],
  LINK_FACTOR_DISTANCE_BOUNDS: [0.5, 1.5],

  GRAVITY_MATRIX_SYMMETRIC: false,
  LINK_GRAVITY_MATRIX_SYMMETRIC: false,
  LINK_TYPE_MATRIX_SYMMETRIC: false,
  LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
  LINK_FACTOR_DISTANCE_EXTENDED: false,
});
const INITIAL_CONFIG: InitialConfig = create3dBaseInitialConfig();

export function create3dSimulationWithRandomTypes() {
  return new Simulation({
    viewMode: '3d',
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create3dRandomDistribution,
    drawer: create3dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
