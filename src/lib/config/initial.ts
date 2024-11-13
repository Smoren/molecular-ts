import type { InitialConfig } from './types';

export function create2dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 2000,
    MIN_POSITION: [0, 0],
    MAX_POSITION: [2500, 2000],
  };
}

export function create3dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 1000,
    MIN_POSITION: [0, 0, 0],
    MAX_POSITION: [500, 500, 500],
  };
}

export const MODE = {
  BUTTERFLY: 1,
  CONST_TYPES: 2,
  RANDOM_TYPES: 3,
};
