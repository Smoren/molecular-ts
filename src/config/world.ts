import { WorldConfig } from '../types/config';
import { NumericVector } from '../vector/types';

export function createBaseWorldConfig(): WorldConfig {
  return {
    ATOM_RADIUS: 5,
    MAX_INTERACTION_RADIUS: 100,
    MAX_LINK_RADIUS: 60,
    MAX_FORCE: 0.5,
    GRAVITY_FORCE_MULTIPLIER: 1,
    LINK_FORCE_MULTIPLIER: 0.015,
    BOUNCE_FORCE_MULTIPLIER: 2,
    INERTIAL_MULTIPLIER: 0.98,
    SPEED: 22,
    PLAYBACK_SPEED: 1,
    SIMPLIFIED_VIEW_MODE: false,
    TEMPERATURE_MULTIPLIER: 0.2,
    MAX_POSITION: [2500, 2500, 2500],
    TEMPERATURE_FUNCTION: (c: NumericVector, t: number) => {
      let sum = 0;
      for (let i=0; i<c.length; ++i) {
        sum += (Math.PI/2-Math.abs(Math.atan(c[i]/100)))/Math.PI*2;
      }
      return sum/c.length * (0.5 - Math.cos(t/100)/2);
    },
  };
}
