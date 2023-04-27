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
    ATOMS_COUNT: 2000,
    MIN_POSITION: [-300, -300, -300],
    MAX_POSITION: [300, 300, 300],
  };
}
