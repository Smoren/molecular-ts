import { InitialConfig } from '../types/config';

export function create2dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 3000,
    MIN_POSITION: [0, 0],
    MAX_POSITION: [2000, 2000],
  };
}

export function create3dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 1500,
    MIN_POSITION: [0, 0, 0],
    MAX_POSITION: [500, 500, 500],
  };
}

export const MODE = {
  BUTTERFLY: 1,
  CONST_TYPES: 2,
  RANDOM_TYPES: 3,
};
