import type {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from "../../../types/config";
import { createBaseTypesConfig } from "@/lib/config/types";
import { createBaseWorldConfig } from "@/lib/config/world";
import { create3dBaseInitialConfig } from "@/lib/config/initial";
import { create3dRandomDistribution } from "@/lib/config/atoms";
import { Simulation } from "../../../simulation";
import { create3dDrawer } from "../../../drawer/3d";
import { PhysicModelV1 } from "@/lib/physics/v1";

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();
const INITIAL_CONFIG: InitialConfig = create3dBaseInitialConfig();

export function create3dSimulationWithConstTypes() {
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
