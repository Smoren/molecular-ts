import { Drawer } from './drawer';
import { InteractionManager, LinkManager } from './interaction';
import { CommonConfig, TypesConfig } from './types';
import { Atom } from './atom';
import { createTypes } from './factory';

const commonConfig: CommonConfig = {
  atomRadius: 5,
  interactionRadius: 200,
  linkRadius: 40,
  unlinkRadius: 40,
  gravConst: 100,
  gravLinkConst: 0.7,
  bounceAddConst: 0.5,
  bounceDivConst: 1.1,
  bounds: [0, 0, 1000, 800],
  boundsBounceConst: 1,
};
// const typesConfig: TypesConfig = {
//   1: {
//     color: 'ff0000',
//     interactions: {
//       1: {
//         mode: -1,
//         linksCount: 0,
//       },
//       2: {
//         mode: -1,
//         linksCount: 1,
//       },
//       3: {
//         mode: 1,
//         linksCount: 1,
//       },
//       4: {
//         mode: 1,
//         linksCount: 1,
//       },
//     },
//     maxLinksCount: 1,
//   },
//   2: {
//     color: '00ff00',
//     interactions: {
//       1: {
//         mode: -1,
//         linksCount: 1,
//       },
//       2: {
//         mode: -1,
//         linksCount: 2,
//       },
//       3: {
//         mode: -1,
//         linksCount: 1,
//       },
//       4: {
//         mode: 1,
//         linksCount: 1,
//       },
//     },
//     maxLinksCount: 3,
//   },
//   3: {
//     color: '0000ff',
//     interactions: {
//       1: {
//         mode: -1,
//         linksCount: 0,
//       },
//       2: {
//         mode: -1,
//         linksCount: 1,
//       },
//       3: {
//         mode: -1,
//         linksCount: 2,
//       },
//       4: {
//         mode: 1,
//         linksCount: 0,
//       },
//     },
//     maxLinksCount: 2,
//   },
//   4: {
//     color: 'aa00aa',
//     interactions: {
//       1: {
//         mode: 1,
//         linksCount: 1,
//       },
//       2: {
//         mode: -1,
//         linksCount: 0,
//       },
//       3: {
//         mode: -1,
//         linksCount: 0,
//       },
//       4: {
//         mode: 1,
//         linksCount: 0,
//       },
//     },
//     maxLinksCount: 2,
//   },
// };
const typesConfig: TypesConfig = createTypes(3);
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

for (let i=0; i<300; ++i) {
  const type = Math.round(Math.random()*2) + 1;
  const position = [Math.round(Math.random()*1000), Math.round(Math.random()*800)];
  const speed = [0, 0];
  atoms.push(new Atom(type, position, speed));
}

drawer.initEventHandlers(() => atoms, () => linkManager.map);

setInterval(() => {
  for (const atom of atoms) {
    interactionManager.interact(atom, atoms);
  }
  for (const atom of atoms) {
    atom.position.add(atom.speed);
  }
  drawer.clear();
  drawer.draw(atoms, linkManager.map);
}, 30);
