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
    TEMPERATURE_MULTIPLIER: 0,
    TEMPERATURE_FUNCTION: (c: NumericVector, t: number) => {
      let sum = 0;
      for (let i=0; i<c.length; ++i) {
        sum += Math.cos(c[i]/100);
      }
      return sum + t*0;
    },
  };
}
