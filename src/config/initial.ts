import { InitialConfig } from '../types/config';

export function create2dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 5000,
    MIN_POSITION: [0, 0],
    MAX_POSITION: [4800, 2800],
  };
}

export function create3dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 1000,
    MIN_POSITION: [-500, -500, -500],
    MAX_POSITION: [500, 500, 500],
  };
}
