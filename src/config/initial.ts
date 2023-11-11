import { InitialConfig } from '../types/config';

export function create2dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 2500,
    MIN_POSITION: [0, 0],
    MAX_POSITION: [1500, 1500],
  };
}

export function create3dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 2000,
    MIN_POSITION: [0, 0, 0],
    MAX_POSITION: [600, 600, 600],
  };
}

export const MODE = {
  BUTTERFLY: 1,
  CONST_TYPES: 2,
  RANDOM_TYPES: 3,
};
