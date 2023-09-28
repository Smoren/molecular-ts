import { InitialConfig } from '../types/config';

export function create2dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 2500,
    MIN_POSITION: [0, 0],
    MAX_POSITION: [2500, 2500],
  };
}

export function create3dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 2000,
    MIN_POSITION: [-300, -300, -300],
    MAX_POSITION: [300, 300, 300],
  };
}

export const MODE = {
  BUTTERFLY: 1,
  CONST_TYPES: 2,
  RANDOM_TYPES: 3,
};
