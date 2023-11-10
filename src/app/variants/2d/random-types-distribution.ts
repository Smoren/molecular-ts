import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from '../../../types/config';
import { create2dDrawer } from '../../../drawer/2d';
import { createRandomTypesConfig } from '../../../config/types';
import { createBaseWorldConfig } from '../../../config/world';
import { create2dBaseInitialConfig } from '../../../config/initial';
import { create2dRandomDistribution } from '../../../config/atoms';
import { Simulation } from '../../../simulation';

const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const TYPES_CONFIG: TypesConfig = createRandomTypesConfig({
  TYPES_COUNT: 4,
  GRAVITY_BOUNDS: [-1, 1],
  LINK_BOUNDS: [1, 3],
  LINK_TYPE_BOUNDS: [0, 4],
});
const INITIAL_CONFIG: InitialConfig = create2dBaseInitialConfig();

export function create2dSimulationWithRandomTypes() {
  return new Simulation({
    worldConfig: WORLD_CONFIG,
    typesConfig: TYPES_CONFIG,
    initialConfig: INITIAL_CONFIG,
    atomsFactory: create2dRandomDistribution,
    drawer: create2dDrawer('canvas', WORLD_CONFIG, TYPES_CONFIG),
  });
}
