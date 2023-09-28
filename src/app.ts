import { MODE } from './config/initial';
import { create2dSimulation, create3dSimulation } from './app/choice';
import { Simulation } from './simulation';

function startSimulation(dimensions: number, mode: number) {
  let sim: Simulation;

  if (dimensions === 3) {
    sim = create2dSimulation(mode);
  } else {
    sim = create3dSimulation(mode);
  }

  setTimeout(() => sim.start(), 100);
}

const DIMENSIONS = 3;
const CURRENT_MODE = MODE.RANDOM_TYPES;

startSimulation(DIMENSIONS, CURRENT_MODE);
