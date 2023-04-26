import { InitialConfig } from '../types/config';

export function createBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 5000,
    MAX_POSITION: [4800, 2800],
  };
}
