import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from './types/config';
import { createAtom, LinkManager, RulesHelper } from './helpers';
import { InteractionManager } from './components';
import { Drawer } from './drawer';
import { AtomInterface } from './types/atomic';

const TYPES_CONFIG: TypesConfig = {
  GRAVITY: [
    [-1, -1, 1],
    [-1, -1, -1],
    [-1, -1, -1],
  ],
  LINKS: [1, 3, 2],
  TYPE_LINKS: [
    [0, 1, 1],
    [1, 2, 1],
    [1, 1, 2],
  ],
  COLORS: [
    'rgb(250, 20, 20)',
    'rgb(200, 140, 100)',
    'rgb(80, 170, 140)',
  ],
};

const WORLD_CONFIG: WorldConfig = {
  ATOM_RADIUS: 5,
  MAX_INTERACTION_RADIUS: 100,
  INERTIAL_MULTIPLIER: 0.98,
  SPEED: 8,
  MAX_POSITION: [1000, 800],
};
const INITIAL_CONFIG: InitialConfig = {
  ATOMS_COUNT: 100,
};
console.log(INITIAL_CONFIG);

const atoms: AtomInterface[] = [];

atoms.push(createAtom(0, [300, 300]));
atoms.push(createAtom(1, [310, 310]));
atoms.push(createAtom(2, [300, 320]));
atoms.push(createAtom(0, [290, 330]));
atoms.push(createAtom(0, [330, 300]));
atoms.push(createAtom(1, [320, 310]));
atoms.push(createAtom(2, [330, 320]));
atoms.push(createAtom(0, [340, 330]));
// for (let i=0; i<INITIAL_CONFIG.ATOMS_COUNT; ++i) {
//   const type = Math.round(Math.random()*(TYPES_CONFIG.COLORS.length-1));
//   const position = [
//     Math.round(Math.random()*WORLD_CONFIG.MAX_POSITION[0]),
//     Math.round(Math.random()*WORLD_CONFIG.MAX_POSITION[1]),
//   ];
//   atoms.push(createAtom(type, position));
// }

const linkManager = new LinkManager();

const interactionManager = new InteractionManager(
  WORLD_CONFIG,
  TYPES_CONFIG,
  linkManager,
  new RulesHelper(TYPES_CONFIG, WORLD_CONFIG),
);

const drawer = new Drawer({
  domElement: document.getElementById('canvas') as HTMLCanvasElement,
  viewConfig: {
    offset: [0, 0],
    scale: [1, 1],
  },
  worldConfig: WORLD_CONFIG,
  typesConfig: TYPES_CONFIG,
});

drawer.initEventHandlers(() => atoms, () => linkManager);

const tick = () => {
  for (const atom of atoms) {
    interactionManager.moveAtom(atom);
  }
  for (const link of linkManager) {
    interactionManager.interactLink(link);
  }
  for (const atom of atoms) {
    interactionManager.interactAtom(atom, atoms);
  }
  drawer.clear();
  drawer.draw(atoms, linkManager);
  setTimeout(tick, 0);
};

tick();
