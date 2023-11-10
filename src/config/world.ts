import { WorldConfig } from '../types/config';

export function createBaseWorldConfig(): WorldConfig {
  return {
    ATOM_RADIUS: 5,
    MAX_INTERACTION_RADIUS: 100,
    MAX_LINK_RADIUS: 60,
    GRAVITY_FORCE_MULTIPLIER: 1,
    BOUNCE_FORCE_MULTIPLIER: 0.01,
    INERTIAL_MULTIPLIER: 0.98,
    SPEED: 5,
    PLAYBACK_SPEED: 2,
    SIMPLIFIED_VIEW_MODE: true,
    TEMPERATURE_MULTIPLIER: 0,
    MAX_POSITION: [1500, 1500],
    TEMPERATURE_FUNCTION: () => 0,
  };
}
