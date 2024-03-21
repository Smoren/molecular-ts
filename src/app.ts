import { MODE } from './config/initial';
import { create2dSimulation, create3dSimulation } from './app/choice';
import { Simulation } from './simulation';

function startSimulation(dimensions: number, mode: number) {
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

const DIMENSIONS = 3;
const CURRENT_MODE = MODE.CONST_TYPES;

startSimulation(DIMENSIONS, CURRENT_MODE);
