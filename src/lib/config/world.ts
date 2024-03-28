import type { WorldConfig } from '../types/config';
import type { NumericVector } from '../vector/types';

export function createBaseWorldConfig(): WorldConfig {
  return {
    PHYSIC_MODEL: 'v1',
    ATOM_RADIUS: 5,
    MAX_INTERACTION_RADIUS: 100,
    MAX_LINK_RADIUS: 60,
    MAX_FORCE: 10,
    GRAVITY_FORCE_MULTIPLIER: 1,
    LINK_FORCE_MULTIPLIER: 0.015,
    BOUNCE_FORCE_MULTIPLIER: 2,
    BOUNDS_FORCE_MULTIPLIER: 0.01,
    INERTIAL_MULTIPLIER: 0.96,
    SPEED: 25,
    PLAYBACK_SPEED: 1,
    SIMPLIFIED_VIEW_MODE: false,
    TEMPERATURE_MULTIPLIER: 0,
    MIN_POSITION: [0, 0, 0],
    MAX_POSITION: [2500, 2500, 2500],
    TEMPERATURE_FUNCTION: (c: NumericVector, t: number) => {
      return 1;
    },
  };
}
