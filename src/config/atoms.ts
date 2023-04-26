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

export function create2dRandomDistribution(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
  initialConfig: InitialConfig,
): AtomInterface[] {
  const atoms: AtomInterface[] = [];

  for (let i = 0; i < initialConfig.ATOMS_COUNT; ++i) {
    const type = Math.round(Math.random() * (typesConfig.COLORS.length - 1));
    const position = [
      Math.random() * initialConfig.MAX_POSITION[0],
      Math.random() * initialConfig.MAX_POSITION[1],
    ];
    atoms.push(createAtom(type, position));
  }

  return atoms;
}
