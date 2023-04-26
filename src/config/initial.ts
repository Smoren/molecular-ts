import { InitialConfig } from '../types/config';

export function create2dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 5000,
    MAX_POSITION: [4800, 2800],
  };
}

export function create3dBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 1,
    MAX_POSITION: [1000, 1000, 1000],
  };
}
