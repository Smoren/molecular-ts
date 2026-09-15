import { describe, expect, it } from '@jest/globals';
import type { RandomTypesConfig, TypesConfig } from '../../src/lib/config/types';
import {
  clearInactiveParams,
  concatTypesConfigs,
  copyIndexInTypesConfig,
  createDefaultRandomTypesConfig,
  createDefaultTypesConfig,
  createRandomIntTypesConfig,
  createRandomTypesConfig,
  createSingleTypeConfig,
  createTransparentTypesConfig,
  crossTypesConfigs,
  crossTypesConfigsByIndexes,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
  removeIndexFromTypesConfig,
} from '../../src/lib/config/atom-types';

const TYPES_COUNT = 4;

const MATRIX_KEYS = ['GRAVITY', 'LINK_GRAVITY', 'TYPE_LINKS', 'TYPE_LINK_WEIGHTS'] as const;
const TENSOR_KEYS = ['LINK_FACTOR_DISTANCE', 'LINK_FACTOR_ELASTIC', 'LINK_FACTOR_GRAVITY'] as const;

// Нейтральные элементы операций: мультипликативные тензоры — 1, аддитивный — 0
const TENSOR_NEUTRAL: Record<(typeof TENSOR_KEYS)[number], number> = {
  LINK_FACTOR_DISTANCE: 1,
  LINK_FACTOR_ELASTIC: 1,
  LINK_FACTOR_GRAVITY: 0,
};

function expectValidShape(config: TypesConfig): void {
  const n = config.FREQUENCIES.length;
  expect(config.RADIUS).toHaveLength(n);
  expect(config.LINKS).toHaveLength(n);
  for (const key of MATRIX_KEYS) {
    expect(config[key]).toHaveLength(n);
    for (const row of config[key]) {
      expect(row).toHaveLength(n);
    }
  }
  for (const key of TENSOR_KEYS) {
    expect(config[key]).toHaveLength(n);
    for (const matrix of config[key]) {
      expect(matrix).toHaveLength(n);
      for (const row of matrix) {
        expect(row).toHaveLength(n);
      }
    }
  }
}

// Симметрия тензора по семантике makeTensorSymmetric: каждая матрица
// tensor[a] симметрична (tensor[a][b][c] === tensor[a][c][b])
function isTensorSymmetric(tensor: number[][][]): boolean {
  const n = tensor.length;
  for (let a = 0; a < n; ++a) {
    for (let b = 0; b < n; ++b) {
      for (let c = 0; c < n; ++c) {
        if (tensor[a][b][c] !== tensor[a][c][b]) {
          return false;
        }
      }
    }
  }
  return true;
}

// Диагональ куба по семантике setTensorMainDiagonal: tensor[i][i][i]
function hasNeutralMainDiagonal(tensor: number[][][], neutral: number): boolean {
  for (let i = 0; i < tensor.length; ++i) {
    if (tensor[i][i][i] !== neutral) {
      return false;
    }
  }
  return true;
}

function createRandomizeConfig(overrides: Partial<RandomTypesConfig> = {}): RandomTypesConfig {
  return {
    ...createDefaultRandomTypesConfig(TYPES_COUNT),
    // Фиксируем генератор детерминированными границами
    GRAVITY_BOUNDS: [-1, 1],
    LINK_GRAVITY_BOUNDS: [-1, 1],
    LINK_TYPE_WEIGHT_BOUNDS: [0.5, 2],
    LINK_FACTOR_DISTANCE_BOUNDS: [0.7, 1.2],
    LINK_FACTOR_ELASTIC_BOUNDS: [0.5, 1],
    LINK_FACTOR_GRAVITY_BOUNDS: [-1, 1],
    ...overrides,
  };
}

describe('types config factories', () => {
  it.each([
    ['default', () => createDefaultTypesConfig()],
    ['transparent', () => createTransparentTypesConfig(TYPES_COUNT)],
    ['single', () => createSingleTypeConfig()],
    ['random', () => createRandomTypesConfig(createRandomizeConfig())],
    ['random int', () => createRandomIntTypesConfig(createRandomizeConfig())],
  ])('%s config has valid shape', (_name, factory) => {
    expectValidShape(factory());
  });

  it('transparent config is neutral', () => {
    const config = createTransparentTypesConfig(TYPES_COUNT);
    for (const key of TENSOR_KEYS) {
      for (const matrix of config[key]) {
        for (const row of matrix) {
          expect(row.every((x) => x === TENSOR_NEUTRAL[key])).toBe(true);
        }
      }
    }
  });

  it('single type config is neutral', () => {
    const config = createSingleTypeConfig();
    for (const key of TENSOR_KEYS) {
      expect(config[key]).toEqual([[[TENSOR_NEUTRAL[key]]]]);
    }
  });
});

describe('types config randomization invariants', () => {
  it('respects matrix symmetric flags', () => {
    const config = createRandomTypesConfig(createRandomizeConfig({
      GRAVITY_MATRIX_SYMMETRIC: true,
      LINK_GRAVITY_MATRIX_SYMMETRIC: true,
      LINK_TYPE_MATRIX_SYMMETRIC: true,
      LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC: true,
      LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: true,
      LINK_FACTOR_ELASTIC_MATRIX_SYMMETRIC: true,
      LINK_FACTOR_GRAVITY_MATRIX_SYMMETRIC: true,
    }));

    expect(config.GRAVITY).toEqual(config.GRAVITY.map((_, i) => config.GRAVITY.map((row) => row[i])));
    expect(config.LINK_GRAVITY).toEqual(config.LINK_GRAVITY.map((_, i) => config.LINK_GRAVITY.map((row) => row[i])));
    expect(config.TYPE_LINKS).toEqual(config.TYPE_LINKS.map((_, i) => config.TYPE_LINKS.map((row) => row[i])));
    expect(config.TYPE_LINK_WEIGHTS).toEqual(config.TYPE_LINK_WEIGHTS.map((_, i) => config.TYPE_LINK_WEIGHTS.map((row) => row[i])));
    expect(isTensorSymmetric(config.LINK_FACTOR_DISTANCE)).toBe(true);
    expect(isTensorSymmetric(config.LINK_FACTOR_ELASTIC)).toBe(true);
    expect(isTensorSymmetric(config.LINK_FACTOR_GRAVITY)).toBe(true);
  });

  it.each(TENSOR_KEYS)('respects ignore self type flag for %s', (key) => {
    const config = createRandomTypesConfig(createRandomizeConfig({
      [`${key}_IGNORE_SELF_TYPE` as const]: true,
    }));

    expect(hasNeutralMainDiagonal(config[key], TENSOR_NEUTRAL[key])).toBe(true);
  });

  it('keeps values on disabled bounds', () => {
    const oldConfig = createDefaultTypesConfig();
    oldConfig.LINK_FACTOR_GRAVITY[0][1][2] = 42;

    const newConfig = randomizeTypesConfig(createRandomizeConfig({
      USE_LINK_FACTOR_GRAVITY_BOUNDS: false,
    }), oldConfig);

    expect(newConfig.LINK_FACTOR_GRAVITY[0][1][2]).toBe(42);
  });

  it('produces valid shape with skip submatrices boundary index', () => {
    const oldConfig = createDefaultTypesConfig();
    const newConfig = randomizeTypesConfig(createRandomizeConfig(), oldConfig, 2);

    expectValidShape(newConfig);
  });
});

describe('types config operations invariants', () => {
  it.each([
    ['concat', (lhs: TypesConfig, rhs: TypesConfig) => concatTypesConfigs(lhs, rhs)],
    ['cross', (lhs: TypesConfig, rhs: TypesConfig) => crossTypesConfigs(lhs, rhs, 2)],
    ['random cross', (lhs: TypesConfig, rhs: TypesConfig) => randomCrossTypesConfigs(lhs, rhs, 0.5)],
    ['cross by indexes', (lhs: TypesConfig, rhs: TypesConfig) => crossTypesConfigsByIndexes(lhs, rhs, [0, 2])],
  ])('%s keeps valid shape', (_name, operation) => {
    // Обе стороны одного размера: операции кроссовера предполагают одинаковый typesCount
    const lhs = createDefaultTypesConfig();
    const rhs = createTransparentTypesConfig(lhs.FREQUENCIES.length);

    expectValidShape(operation(lhs, rhs));
  });

  it('concat fills new type pairs with neutral values', () => {
    const lhs = createTransparentTypesConfig(2);
    const rhs = createTransparentTypesConfig(2);
    const result = concatTypesConfigs(lhs, rhs);

    expect(result.FREQUENCIES).toHaveLength(4);
    for (const key of TENSOR_KEYS) {
      expect(result[key]).toHaveLength(4);
      // Весь тензор из transparent-конфигов остаётся нейтральным
      for (const matrix of result[key]) {
        for (const row of matrix) {
          expect(row.every((x) => x === TENSOR_NEUTRAL[key])).toBe(true);
        }
      }
    }
  });

  it('remove index keeps valid shape', () => {
    const config = createDefaultTypesConfig();
    const result = removeIndexFromTypesConfig(config, 1);

    expect(result.FREQUENCIES).toHaveLength(config.FREQUENCIES.length - 1);
    expectValidShape(result);
  });

  it('copy index keeps valid shape', () => {
    const config = createDefaultTypesConfig();
    const result = copyIndexInTypesConfig(config, 0, 1);

    expectValidShape(result);
    // Столбец целевого типа в каждой незатронутой матрице — копия столбца исходного типа
    for (const key of TENSOR_KEYS) {
      for (let i = 0; i < result[key].length; ++i) {
        if (i === 1) {
          continue;
        }
        for (let j = 0; j < result[key][i].length; ++j) {
          if (j === 1) {
            continue;
          }
          expect(result[key][i][j][1]).toBe(config[key][i][j][0]);
        }
      }
    }
  });

  it('clearInactiveParams neutralizes unreachable type pairs', () => {
    const config = createTransparentTypesConfig(3);
    config.TYPE_LINKS[0][1] = 0;
    config.LINK_GRAVITY[0][1] = 7;
    config.LINK_FACTOR_DISTANCE[0][1][2] = 5;
    config.LINK_FACTOR_ELASTIC[0][1][2] = 5;
    config.LINK_FACTOR_GRAVITY[0][1][2] = 5;

    clearInactiveParams(config);

    expect(config.LINK_GRAVITY[0][1]).toBe(0);
    expect(config.LINK_FACTOR_DISTANCE[0][1][2]).toBe(1);
    expect(config.LINK_FACTOR_ELASTIC[0][1][2]).toBe(1);
    expect(config.LINK_FACTOR_GRAVITY[0][1][2]).toBe(0);
  });
});
