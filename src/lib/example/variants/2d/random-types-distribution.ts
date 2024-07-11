import type {
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { create2dDrawer } from "../../../drawer/2d";
import { createRandomTypesConfig } from "../../../config/types";
import { createBaseWorldConfig } from "../../../config/world";
import { create2dRandomDistribution } from "../../../config/atoms";
import { Simulation } from "../../../simulation";
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
  USE_LINK_TYPE_WEIGHT_BOUNDS: true,
  USE_LINK_FACTOR_DISTANCE_BOUNDS: true,

  RADIUS_BOUNDS: [0.5, 1.5],
  FREQUENCY_BOUNDS: [0.1, 1, 0.5, 0.1],
  GRAVITY_BOUNDS: [-1, 0.5],
  LINK_GRAVITY_BOUNDS: [-1, 0.5],
  LINK_BOUNDS: [1, 3],
  LINK_TYPE_BOUNDS: [0, 4],
  LINK_TYPE_WEIGHT_BOUNDS: [1, 2],
  LINK_FACTOR_DISTANCE_BOUNDS: [0.5, 1.5],

  GRAVITY_MATRIX_SYMMETRIC: false,
  LINK_GRAVITY_MATRIX_SYMMETRIC: false,
  LINK_TYPE_MATRIX_SYMMETRIC: false,
  LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC: false,
  LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
  LINK_FACTOR_DISTANCE_EXTENDED: true,
  LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE: true,
});

export function create2dSimulationWithRandomTypes() {
  return new Simulation({
    viewMode: '2d',
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create2dRandomDistribution,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
