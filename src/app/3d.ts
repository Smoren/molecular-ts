import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from '../types/config';
import { create2dDrawer } from '../drawer/2d';
import { createBaseTypesConfig } from '../config/types';
import { createBaseWorldConfig } from '../config/world';
import { create3dBaseInitialConfig } from '../config/initial';
import { create3dRandomDistribution } from '../config/atoms';
import { Simulation } from '../simulation';

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();
const INITIAL_CONFIG: InitialConfig = create3dBaseInitialConfig();

export function create2dSimulation() {
  return new Simulation({
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    // atomsFactory: create2dButterfly,
    atomsFactory: create3dRandomDistribution,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
