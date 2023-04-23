import { Drawer } from './drawer';
import { InteractionManager, LinkManager } from './interaction';
import { CommonConfig, TypesConfig } from './types';
import { Atom } from './atom';
// import { createTypes } from './factory';

const commonConfig: CommonConfig = {
  speed: 8,
  atomRadius: 5,
  maxInteractionRadius: 100,
  minLinkRadius: 100,
  maxUnlinkRadius: 100,
  inertialMultiplier: 0.98,
  gravityForce: 50,
  linkForce: 0.015,
  maxPosition: [1000, 800],
};
const typesConfig: TypesConfig = {
  1: {
    color: 'rgb(250, 20, 20)',
    interactions: {
      1: {
        mode: -1,
        linksCount: 0,
      },
      2: {
        mode: -1,
        linksCount: 1,
      },
      3: {
        mode: 1,
        linksCount: 1,
      },
    },
    maxLinksCount: 1,
  },
  2: {
    color: 'rgb(200, 140, 100)',
    interactions: {
      1: {
        mode: -1,
        linksCount: 1,
      },
      2: {
        mode: -1,
        linksCount: 2,
      },
      3: {
        mode: -1,
        linksCount: 1,
      },
    },
    maxLinksCount: 3,
  },
  3: {
    color: 'rgb(80, 170, 140',
    interactions: {
      1: {
        mode: -1,
        linksCount: 1,
      },
      2: {
        mode: -1,
        linksCount: 1,
      },
      3: {
        mode: -1,
        linksCount: 2,
      },
    },
    maxLinksCount: 2,
  },
};
// const typesConfig: TypesConfig = createTypes(3);
console.log(typesConfig);
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

const atoms: Atom[] = [];

// for (let i=0; i<300; ++i) {
//   const type = Math.round(Math.random()*2) + 1;
//   const position = [
//     Math.round(Math.random()*commonConfig.maxPosition[0]),
//     Math.round(Math.random()*commonConfig.maxPosition[1]),
//   ];
//   const speed = [0, 0];
//   atoms.push(new Atom(type, position, speed));
// }

atoms.push(new Atom(1, [300, 300], [0, 0]));
atoms.push(new Atom(2, [310, 310], [0, 0]));
atoms.push(new Atom(3, [300, 320], [0, 0]));
atoms.push(new Atom(1, [290, 330], [0, 0]));
atoms.push(new Atom(1, [330, 300], [0, 0]));
atoms.push(new Atom(2, [320, 310], [0, 0]));
atoms.push(new Atom(3, [330, 320], [0, 0]));
atoms.push(new Atom(1, [340, 330], [0, 0]));

drawer.initEventHandlers(() => atoms, () => linkManager.map);

const tick = () => {
  for (const atom of atoms) {
    interactionManager.moveAtom(atom);
  }
  for (const [, link] of linkManager.map) {
    interactionManager.interactLink(link);
  }
  for (const atom of atoms) {
    interactionManager.interactAtom(atom, atoms);
  }
  drawer.clear();
  drawer.draw(atoms, linkManager.map);
  setTimeout(tick, 0);
};

tick();
