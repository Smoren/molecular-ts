import { InitialConfig } from '../types/config';

export function createBaseInitialConfig(): InitialConfig {
  return {
    ATOMS_COUNT: 10000,
    MAX_POSITION: [4800, 2800],
  };
}
