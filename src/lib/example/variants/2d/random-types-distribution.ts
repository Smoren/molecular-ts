import type {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { create2dDrawer } from "../../../drawer/2d";
import { createRandomTypesConfig } from "@/lib/config/types";
import { createBaseWorldConfig } from "@/lib/config/world";
import { create2dBaseInitialConfig } from "@/lib/config/initial";
import { create2dRandomDistribution } from "@/lib/config/atoms";
import { Simulation } from "../../../simulation";
import { PhysicModelV1 } from "@/lib/physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createRandomTypesConfig({
  TYPES_COUNT: 4,
  RADIUS_BOUNDS: [0.5, 1.5],
  GRAVITY_BOUNDS: [-1, 0.5],
  LINK_GRAVITY_BOUNDS: [-1, 0.5],
  LINK_BOUNDS: [1, 3],
  LINK_TYPE_BOUNDS: [0, 4],
  LINK_FACTOR_DISTANCE_BOUNDS: [0.5, 1.5],
  GRAVITY_MATRIX_SYMMETRIC: false,
  LINK_GRAVITY_MATRIX_SYMMETRIC: false,
  LINK_TYPE_MATRIX_SYMMETRIC: false,
  LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
  LINK_FACTOR_DISTANCE_EXTENDED: false,
});
const INITIAL_CONFIG: InitialConfig = create2dBaseInitialConfig();

export function create2dSimulationWithRandomTypes() {
  return new Simulation({
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create2dRandomDistribution,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
