import { create2dSimulationButterfly } from './variants/2d/butterfly';
import { create2dSimulationWithConstTypes } from './variants/2d/const-types-distribution';
import { create2dSimulationWithRandomTypes } from './variants/2d/random-types-distribution';
import { create3dSimulationButterfly } from './variants/3d/butterfly';
import { create3dSimulationWithConstTypes } from './variants/3d/const-types-distribution';
import { create3dSimulationWithRandomTypes } from './variants/3d/random-types-distribution';
import type { Simulation } from '../simulation/simulation';
import { MODE } from '../config/initial';

export function create2dSimulation(mode: number): Simulation {
  if (mode === MODE.BUTTERFLY) {
    return create2dSimulationButterfly();
  } else if (mode === MODE.CONST_TYPES) {
    return create2dSimulationWithConstTypes();
  } else if (MODE.RANDOM_TYPES) {
    return create2dSimulationWithRandomTypes();
  } else {
    throw new Error('unknown mode');
  }
}

export function create3dSimulation(mode: number): Simulation {
  if (mode === MODE.BUTTERFLY) {
    return create3dSimulationButterfly();
  } else if (mode === MODE.CONST_TYPES) {
    return create3dSimulationWithConstTypes();
  } else if (MODE.RANDOM_TYPES) {
    return create3dSimulationWithRandomTypes();
  } else {
    throw new Error('unknown mode');
  }
}

export function startSimulation(dimensions: number, mode: number) {
  let sim: Simulation;

  if (dimensions === 2) {
    sim = create2dSimulation(mode);
  } else {
    sim = create3dSimulation(mode);
  }

  setTimeout(() => sim.start(), 100);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.sim = sim;
}
