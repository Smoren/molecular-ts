import { AtomInterface } from '../types/atomic';
import { createAtom } from '../helpers';
import { InitialConfig, TypesConfig, WorldConfig } from '../types/config';

export function create2dButterfly(): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  atoms.push(createAtom(0, [300, 300]));
  atoms.push(createAtom(1, [310, 310]));
  atoms.push(createAtom(2, [300, 320]));
  atoms.push(createAtom(0, [290, 330]));
  atoms.push(createAtom(0, [330, 300]));
  atoms.push(createAtom(1, [320, 310]));
  atoms.push(createAtom(2, [330, 320]));
  atoms.push(createAtom(0, [340, 330]));

  return atoms;
}

export function create3Butterfly(): AtomInterface[] {
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
  initialConfig: InitialConfig,
): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  for (let i = 0; i < initialConfig.ATOMS_COUNT; ++i) {
    const type = Math.round(Math.random() * (typesConfig.COLORS.length - 1));
    const minPos = initialConfig.MIN_POSITION;
    const maxPos = initialConfig.MAX_POSITION;

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
  initialConfig: InitialConfig,
): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  for (let i = 0; i < initialConfig.ATOMS_COUNT; ++i) {
    const type = Math.round(Math.random() * (typesConfig.COLORS.length - 1));
    const minPos = initialConfig.MIN_POSITION;
    const maxPos = initialConfig.MAX_POSITION;

    const position = [
      minPos[0] + Math.random() * (maxPos[0] - minPos[0]),
      minPos[1] + Math.random() * (maxPos[1] - minPos[1]),
      minPos[2] + Math.random() * (maxPos[2] - minPos[2]),
    ];
    atoms.push(createAtom(type, position));
  }

  return atoms;
}
