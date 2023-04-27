import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from '../../../types/config';
import { createRandomTypesConfig } from '../../../config/types';
import { createBaseWorldConfig } from '../../../config/world';
import { create3dBaseInitialConfig } from '../../../config/initial';
import { create3dRandomDistribution } from '../../../config/atoms';
import { Simulation } from '../../../simulation';
import { create3dDrawer } from '../../../drawer/3d';

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createRandomTypesConfig({
  TYPES_COUNT: 7,
  GRAVITY_BOUNDS: [-1, 1],
  LINK_BOUNDS: [1, 5],
  LINK_TYPE_BOUNDS: [0, 4],
});
const INITIAL_CONFIG: InitialConfig = create3dBaseInitialConfig();

export function create3dSimulationWithRandomTypes() {
  return new Simulation({
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    atomsFactory: create3dRandomDistribution,
    drawer: create3dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
