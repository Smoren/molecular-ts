import { Drawer } from './drawer';
import { InteractionManager, LinkManager } from './interaction';
import { AtomInterface, CommonConfig, TypesConfig } from './types';
import { Atom } from './atom';

const commonConfig: CommonConfig = {
  atomRadius: 10,
  interactionRadius: 1000,
  linkRadius: 50,
  unlinkRadius: 80,
  gravConst: 50,
  bounceAddConst: 0.01,
  bounceDivConst: 1.1,
};
const typesConfig: TypesConfig = {
  1: {
    color: '0000ff',
    interactions: {
      1: {
        mode: 1,
        linksCount: 0,
      },
    },
    maxLinksCount: 0,
  },
};
const linkManager = new LinkManager(typesConfig);
const interactionManager = new InteractionManager(commonConfig, typesConfig, linkManager);

const drawer = new Drawer({
  domElement: document.getElementById('canvas') as HTMLCanvasElement,
  viewConfig: {
    offset: [0, 0],
    scale: [1, 1],
  },
  commonConfig,
  typesConfig,
});

const atoms: AtomInterface[] = [
  new Atom(1, [100, 100], [0, 0]),
  new Atom(1, [200, 100], [0, 0]),
  new Atom(1, [200, 200], [0, 0]),
];

drawer.initEventHandlers(() => atoms);

setInterval(() => {
  for (const atom of atoms) {
    atom.position.add(atom.speed);
  }
  for (const atom of atoms) {
    interactionManager.interact(atom, atoms);
  }
  drawer.clear();
  drawer.draw(atoms);
}, 30);
