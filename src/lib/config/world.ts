import type { InitialConfig, WorldConfig } from '../types/config';
import type { NumericVector } from '../math/types';

export function createBaseWorldConfig(): WorldConfig {
  return {
    VIEW_MODE: '3d',
    PHYSIC_MODEL: 'v2',
    ATOM_RADIUS: 5,
    MAX_INTERACTION_RADIUS: 100,
    MAX_LINK_RADIUS: 60,
    MAX_FORCE: 0.4,
    GRAVITY_FORCE_MULTIPLIER: 1,
    LINK_FORCE_MULTIPLIER: 0.015,
    BOUNCE_FORCE_MULTIPLIER: 2,
    BOUNDS_FORCE_MULTIPLIER: 0.01,
    INERTIAL_MULTIPLIER: 0.96,
    SPEED: 25,
    PLAYBACK_SPEED: 1,
    SIMPLIFIED_VIEW_MODE: false,
    TEMPERATURE_MULTIPLIER: 0,
    CONFIG_2D: {
      BOUNDS: {
        MIN_POSITION: [0, 0],
        MAX_POSITION: [2500, 2500],
      },
      INITIAL: {
        ATOMS_COUNT: 2000,
        MIN_POSITION: [0, 0],
        MAX_POSITION: [2500, 2000],
      },
    },
    CONFIG_3D: {
      BOUNDS: {
        MIN_POSITION: [0, 0, 0],
        MAX_POSITION: [500, 500, 500],
      },
      INITIAL: {
        ATOMS_COUNT: 1000,
        MIN_POSITION: [0, 0, 0],
        MAX_POSITION: [500, 500, 500],
      },
    },
    TEMPERATURE_FUNCTION: (c: NumericVector, t: number) => {
      return 1;
    },
  };
}

export function createWorldConfig2d(initialConfig: InitialConfig): WorldConfig {
  return {
    ...createBaseWorldConfig(),
    VIEW_MODE: '2d',
    CONFIG_2D: {
      ...createBaseWorldConfig().CONFIG_2D,
      INITIAL: initialConfig,
      BOUNDS: {
        MIN_POSITION: initialConfig.MIN_POSITION,
        MAX_POSITION: initialConfig.MAX_POSITION,
      },
    },
  };
}


export function createWorldConfig3d(initialConfig: InitialConfig): WorldConfig {
  return {
    ...createBaseWorldConfig(),
    VIEW_MODE: '3d',
    CONFIG_3D: {
      ...createBaseWorldConfig().CONFIG_3D,
      INITIAL: initialConfig,
      BOUNDS: {
        MIN_POSITION: initialConfig.MIN_POSITION,
        MAX_POSITION: initialConfig.MAX_POSITION,
      },
    },
  };
}
