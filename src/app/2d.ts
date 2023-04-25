import {
  InitialConfig,
  TypesConfig,
  WorldConfig,
} from '../types/config';
import { LinkManager, RulesHelper } from '../helpers';
import { InteractionManager } from '../components';
import { Drawer } from '../drawer';
import { createBaseTypesConfig } from '../config/types';
import { createBaseWorldConfig } from '../config/world';
import { createBaseInitialConfig } from '../config/initial';
import { create2dRandomDistribution } from '../config/atoms';

const TYPES_CONFIG: TypesConfig = createBaseTypesConfig();
const WORLD_CONFIG: WorldConfig = createBaseWorldConfig();
const INITIAL_CONFIG: InitialConfig = createBaseInitialConfig();

const atoms = create2dRandomDistribution(WORLD_CONFIG, TYPES_CONFIG, INITIAL_CONFIG);

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
  setTimeout(tick, 10);
};

export function start() {
  tick();
}
