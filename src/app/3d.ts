import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from '../types/config';
import { createBaseTypesConfig } from '../config/types';
import { createBaseWorldConfig } from '../config/world';
import { create3dBaseInitialConfig } from '../config/initial';
// import { create3Butterfly } from '../config/atoms';
import { create3dRandomDistribution } from '../config/atoms';
import { Simulation } from '../simulation';
import { create3dDrawer } from '../drawer/3d';

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();
const INITIAL_CONFIG: InitialConfig = create3dBaseInitialConfig();

export function create3dSimulation() {
  return new Simulation({
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    // atomsFactory: create3Butterfly,
    atomsFactory: create3dRandomDistribution,
    drawer: create3dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
