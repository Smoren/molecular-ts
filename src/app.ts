import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from './types/config';
import { createAtom, LinkManager, RulesHelper } from './helpers';
import { InteractionManager } from './components';
import { Drawer } from './drawer';
import { AtomInterface } from './types/atomic';
import { createBaseTypesConfig } from './config/types';

const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();

const WORLD_CONFIG: WorldConfig = {
  ATOM_RADIUS: 5,
  MAX_INTERACTION_RADIUS: 100,
  MAX_LINK_RADIUS: 60,
  GRAVITY_FORCE_MULTIPLIER: 1,
  LINK_FORCE_MULTIPLIER: 0.015,
  BOUNCE_FORCE_MULTIPLIER: 2,
  INERTIAL_MULTIPLIER: 0.98,
  SPEED: 12,
  PLAYBACK_SPEED: 4,
  MAX_POSITION: [1800, 800],
};
const INITIAL_CONFIG: InitialConfig = {
  ATOMS_COUNT: 800,
};
console.log(INITIAL_CONFIG);

const atoms: AtomInterface[] = [];

// atoms.push(createAtom(0, [300, 300]));
// atoms.push(createAtom(1, [320, 300]));

// atoms.push(createAtom(0, [300, 300]));
// atoms.push(createAtom(1, [310, 310]));
// atoms.push(createAtom(2, [300, 320]));
// atoms.push(createAtom(0, [290, 330]));
// atoms.push(createAtom(0, [330, 300]));
// atoms.push(createAtom(1, [320, 310]));
// atoms.push(createAtom(2, [330, 320]));
// atoms.push(createAtom(0, [340, 330]));

for (let i=0; i<INITIAL_CONFIG.ATOMS_COUNT; ++i) {
  const type = Math.round(Math.random()*(TYPES_CONFIG.COLORS.length-1));
  const position = [
    Math.random()*WORLD_CONFIG.MAX_POSITION[0],
    Math.random()*WORLD_CONFIG.MAX_POSITION[1],
  ];
  atoms.push(createAtom(type, position));
}

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
  for (let i=0; i<WORLD_CONFIG.PLAYBACK_SPEED; ++i) {
    for (const atom of atoms) {
      // atom.speed[0] += 0.01;
      interactionManager.moveAtom(atom);
    }
    for (const link of linkManager) {
      interactionManager.interactLink(link);
    }
    for (const atom of atoms) {
      interactionManager.interactAtom(atom, atoms);
    }
  }
  drawer.clear();
  drawer.draw(atoms, linkManager);
  setTimeout(tick, 0);
};

tick();
