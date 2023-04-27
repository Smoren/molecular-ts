import { WorldConfig } from '../types/config';
import { NumericVector } from '../vector/types';

export function createBaseWorldConfig(): WorldConfig {
  return {
    ATOM_RADIUS: 5,
    MAX_INTERACTION_RADIUS: 100,
    MAX_LINK_RADIUS: 60,
    GRAVITY_FORCE_MULTIPLIER: 1,
    LINK_FORCE_MULTIPLIER: 0.015,
    BOUNCE_FORCE_MULTIPLIER: 2,
    INERTIAL_MULTIPLIER: 0.98,
    SPEED: 12,
    PLAYBACK_SPEED: 1,
    TEMPERATION_MULTIPLIER: 0.1,
    TEMPERATURE_FUNCTION: (c: NumericVector, t: number) => {
      return (Math.cos(c[0]/100) + Math.cos(c[1]/100) + Math.cos(c[2]/100)) + t*0;
    },
  };
}
