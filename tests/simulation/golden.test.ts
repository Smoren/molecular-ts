import { describe, expect, it } from '@jest/globals';
import type { AtomInterface } from '../../src/lib/simulation/types/atomic';
import type { TypesConfig, WorldConfig } from '../../src/lib/config/types';
import { Simulation } from '../../src/lib/simulation/simulation';
import { createPhysicModel, createAtom } from '../../src/lib/utils/functions';
import { createDummyDrawer } from '../../src/lib/drawer/dummy';
import { createDefaultTypesConfig } from '../../src/lib/config/atom-types';
import { createBaseWorldConfig } from '../../src/lib/config/world';

// Golden-тест: детерминированная симуляция без источников случайности.
// Любое изменение поведения ядра при нейтральном новом тензоре
// (LINK_FACTOR_GRAVITY из нулей) должно менять снапшот осознанно.
const ATOMS_COUNT = 80;
const STEPS = 300;

function createFixedAtoms(_worldConfig: WorldConfig, _typesConfig: TypesConfig): AtomInterface[] {
  const atoms: AtomInterface[] = [];
  const cols = 10;
  for (let i = 0; i < ATOMS_COUNT; ++i) {
    const type = i % 5;
    const x = 200 + (i % cols) * 40;
    const y = 200 + Math.floor(i / cols) * 40;
    atoms.push(createAtom(
      type,
      [x, y],
      [((i % 5) - 2) * 0.3, ((Math.floor(i / 5) % 5) - 2) * 0.3],
    ));
  }
  return atoms;
}

function createGoldenState(physicModel: 'v1' | 'v2') {
  const worldConfig = createBaseWorldConfig();
  worldConfig.VIEW_MODE = '2d';
  worldConfig.PHYSIC_MODEL = physicModel;
  worldConfig.TEMPERATURE_MULTIPLIER = 0;
  worldConfig.CONFIG_2D.BOUNDS.MIN_POSITION = [0, 0];
  worldConfig.CONFIG_2D.BOUNDS.MAX_POSITION = [1000, 1000];

  const sim = new Simulation({
    viewMode: '2d',
    worldConfig,
    typesConfig: createDefaultTypesConfig(),
    physicModel: createPhysicModel(worldConfig, createDefaultTypesConfig()),
    atomsFactory: createFixedAtoms,
    drawer: createDummyDrawer(),
  });

  for (let i = 0; i < STEPS; ++i) {
    sim.step();
  }

  return {
    atoms: sim.atoms.map((atom) => atom.exportState()),
    links: [...sim.links].map((link) => link.exportState()),
  };
}

// Нормализация ID: глобальный IdGenerator инкрементируется между симуляциями,
// поэтому детерминизм сравниваем по относительным индексам атомов
function normalizeState(state: ReturnType<typeof createGoldenState>): string {
  const idToIndex = new Map<number, number>();
  state.atoms.forEach((atom, index) => idToIndex.set(atom.id as number, index));

  return JSON.stringify({
    atoms: state.atoms.map((atom) => ({
      type: atom.type,
      position: atom.position,
      speed: atom.speed,
    })),
    links: [...state.links]
      .map(([lhs, rhs]) => [idToIndex.get(lhs), idToIndex.get(rhs)])
      .sort((a, b) => (a[0] as number) - (b[0] as number) || (a[1] as number) - (b[1] as number)),
  });
}

describe('simulation golden state', () => {
  it.each(['v1', 'v2'] as const)('matches golden snapshot with %s', (physicModel) => {
    const state = createGoldenState(physicModel);

    // Округление до 6 знаков: защита от платформенных различий float,
    // поведение при этом фиксируется с запасом точности
    const rounded = JSON.parse(JSON.stringify(state, (key, value) => (
      typeof value === 'number' ? Math.round(value * 1e6) / 1e6 : value
    )));

    expect(rounded).toMatchSnapshot();
  });

  it('is deterministic across runs', () => {
    const first = normalizeState(createGoldenState('v2'));
    const second = normalizeState(createGoldenState('v2'));

    expect(first).toBe(second);
  });
});
