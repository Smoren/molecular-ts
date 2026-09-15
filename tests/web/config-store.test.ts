import { beforeEach, describe, expect, it } from '@jest/globals';
import { createPinia, setActivePinia } from 'pinia';
import type { RandomTypesConfig } from '../../src/lib/config/types';
import { createDefaultRandomTypesConfig } from '../../src/lib/config/atom-types';
import { useConfigStore } from '../../src/web/store/config';

// Регресс бага: setSymmetricTypesConfig читал флаг LINK_FACTOR_ELASTIC_MATRIX_SYMMETRIC
// под условием USE_LINK_FACTOR_DISTANCE_BOUNDS, а applySymmetricTypesConfig
// не симметризовал LINK_FACTOR_ELASTIC вовсе.
// Обе функции внутренние: проверяем через публичный randomizeTypesConfig.
function isTensorMatrixSymmetric(tensor: number[][][]): boolean {
  return tensor.every((matrix) => matrix.every(
    (row, i) => row.every((value, j) => value === matrix[j][i]),
  ));
}

function createRandomizeConfig(overrides: Partial<RandomTypesConfig> = {}): RandomTypesConfig {
  return {
    ...createDefaultRandomTypesConfig(3),
    ...overrides,
  };
}

describe('config store symmetric config', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('symmetrizes elastic tensor when only elastic bounds are used', () => {
    const store = useConfigStore();
    store.setRandomTypesConfig(createRandomizeConfig({
      USE_LINK_FACTOR_DISTANCE_BOUNDS: false,
      USE_LINK_FACTOR_ELASTIC_BOUNDS: true,
      LINK_FACTOR_ELASTIC_MATRIX_SYMMETRIC: true,
    }));

    store.randomizeTypesConfig();

    // При баге: флаг elastic не выставлялся (условие по distance) и тензор
    // не симметризовался вовсе
    expect(store.typesSymmetricConfig.LINK_FACTOR_ELASTIC_MATRIX_SYMMETRIC).toBe(true);
    expect(isTensorMatrixSymmetric(store.typesConfig.LINK_FACTOR_ELASTIC)).toBe(true);
  });

  it('symmetrizes gravity tensor when gravity symmetric flag is set', () => {
    const store = useConfigStore();
    store.setRandomTypesConfig(createRandomizeConfig({
      USE_LINK_FACTOR_GRAVITY_BOUNDS: true,
      LINK_FACTOR_GRAVITY_MATRIX_SYMMETRIC: true,
    }));

    store.randomizeTypesConfig();

    expect(store.typesSymmetricConfig.LINK_FACTOR_GRAVITY_MATRIX_SYMMETRIC).toBe(true);
    expect(isTensorMatrixSymmetric(store.typesConfig.LINK_FACTOR_GRAVITY)).toBe(true);
  });
});
