// import { create2dSimulation } from './app/2d';
//
// const sim = create2dSimulation();
// sim.start();
// import { testBabylon } from './drafts/babylon';
//
// testBabylon();
import { create3dSimulation } from './app/3d';

setTimeout(() => {
  const sim = create3dSimulation();
  sim.start();
}, 100);
