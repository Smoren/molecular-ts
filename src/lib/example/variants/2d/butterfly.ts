import type {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { create2dDrawer } from "../../../drawer/2d";
import { createBaseTypesConfig } from "@/lib/config/types";
import { createBaseWorldConfig } from "@/lib/config/world";
import { create2dBaseInitialConfig } from "@/lib/config/initial";
import { create2dButterfly } from "@/lib/config/atoms";
import { Simulation } from "../../../simulation";
import { PhysicModelV1 } from "@/lib/physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();
const INITIAL_CONFIG: InitialConfig = create2dBaseInitialConfig();

export function create2dSimulationButterfly() {
  return new Simulation({
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    physicModel: new PhysicModelV1(WORLD_CONFIG, TYPES_CONFIG),
    atomsFactory: create2dButterfly,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
