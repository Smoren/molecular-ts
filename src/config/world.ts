import { WorldConfig } from '../types/config';

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
    PLAYBACK_SPEED: 2,
  };
}
