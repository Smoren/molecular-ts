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
  TYPES_COUNT: 4,
  GRAVITY_BOUNDS: [-1, 0.5],
  LINK_GRAVITY_BOUNDS: [-1, 0.5],
  LINK_BOUNDS: [1, 3],
  LINK_TYPE_BOUNDS: [0, 3],
  LINK_FACTOR_DISTANCE_BOUNDS: [0.5, 1.5],
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
