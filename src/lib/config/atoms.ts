import type { AtomInterface } from '../types/atomic';
import { createAtom, getIndexByFrequencies } from '../helpers';
import type { TypesConfig, WorldConfig } from '../types/config';

export function create2dButterfly(): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  atoms.push(createAtom(0, [300+500, 300+500]));
  atoms.push(createAtom(1, [310+500, 310+500]));
  atoms.push(createAtom(2, [300+500, 320+500]));
  atoms.push(createAtom(0, [290+500, 330+500]));
  atoms.push(createAtom(0, [330+500, 300+500]));
  atoms.push(createAtom(1, [320+500, 310+500]));
  atoms.push(createAtom(2, [330+500, 320+500]));
  atoms.push(createAtom(0, [340+500, 330+500]));

  return atoms;
}

export function create3dButterfly(): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  atoms.push(createAtom(0, [300, 300, -200]));
  atoms.push(createAtom(1, [310, 310, -210]));
  atoms.push(createAtom(2, [300, 320, -220]));
  atoms.push(createAtom(0, [290, 330, -230]));
  atoms.push(createAtom(0, [330, 300, -200]));
  atoms.push(createAtom(1, [320, 310, -210]));
  atoms.push(createAtom(2, [330, 320, -220]));
  atoms.push(createAtom(0, [340, 330, -230]));

  return atoms;
}

export function create2dRandomDistribution(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  for (let i = 0; i < worldConfig.CONFIG_2D.INITIAL.ATOMS_COUNT; ++i) {
    const type = getIndexByFrequencies(typesConfig.FREQUENCIES);
    const minPos = worldConfig.CONFIG_2D.INITIAL.MIN_POSITION;
    const maxPos = worldConfig.CONFIG_2D.INITIAL.MAX_POSITION;

    const position = [
      minPos[0] + Math.random() * (maxPos[0] - minPos[0]),
      minPos[1] + Math.random() * (maxPos[1] - minPos[1]),
    ];
    atoms.push(createAtom(type, position));
  }

  return atoms;
}

export function create3dRandomDistribution(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  for (let i = 0; i < worldConfig.CONFIG_3D.INITIAL.ATOMS_COUNT; ++i) {
    const type = getIndexByFrequencies(typesConfig.FREQUENCIES);
    const minPos = worldConfig.CONFIG_3D.INITIAL.MIN_POSITION;
    const maxPos = worldConfig.CONFIG_3D.INITIAL.MAX_POSITION;

    const position = [
      minPos[0] + Math.random() * (maxPos[0] - minPos[0]),
      minPos[1] + Math.random() * (maxPos[1] - minPos[1]),
      minPos[2] + Math.random() * (maxPos[2] - minPos[2]),
    ];
    atoms.push(createAtom(type, position));
  }

  return atoms;
}
