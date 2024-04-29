import type { NumericVector } from '../vector/types';

export type ColorVector = [number, number, number];
export type PhysicModelName = 'v1' | 'v2';
export type ViewMode = '2d' | '3d';

export type RadiusConfig = number[];
export type GravityConfig = number[][];
export type LinksConfig = number[];
export type TypeLinksConfig = number[][];
export type LinkFactorDistanceConfig = number[][];
export type LinkFactorDistanceExtendedConfig = number[][][];
export type FrequenciesConfig = number[];
export type ColorsConfig = Array<ColorVector>;
export type BoundsConfig = {
  MIN_POSITION: NumericVector;
  MAX_POSITION: NumericVector;
};
export type InitialConfig = {
  ATOMS_COUNT: number;
  MIN_POSITION: NumericVector;
  MAX_POSITION: NumericVector;
};
export type ViewModeConfig = {
  BOUNDS: BoundsConfig;
  INITIAL: InitialConfig;
};
export type TypesConfig = {
  RADIUS: RadiusConfig;
  GRAVITY: GravityConfig;
  LINK_GRAVITY: GravityConfig;
  LINKS: LinksConfig;
  TYPE_LINKS: TypeLinksConfig;
  LINK_FACTOR_DISTANCE: LinkFactorDistanceConfig;
  LINK_FACTOR_DISTANCE_EXTENDED: LinkFactorDistanceExtendedConfig;
  LINK_FACTOR_DISTANCE_USE_EXTENDED: boolean;
  FREQUENCIES: FrequenciesConfig;
  COLORS: ColorsConfig;
};
export type WorldConfig = {
  VIEW_MODE: ViewMode;
  PHYSIC_MODEL: PhysicModelName;
  ATOM_RADIUS: number;
  MAX_INTERACTION_RADIUS: number;
  MAX_LINK_RADIUS: number;
  MAX_FORCE: number,
  GRAVITY_FORCE_MULTIPLIER: number;
  LINK_FORCE_MULTIPLIER: number;
  BOUNCE_FORCE_MULTIPLIER: number;
  BOUNDS_FORCE_MULTIPLIER: number;
  INERTIAL_MULTIPLIER: number;
  PLAYBACK_SPEED: number;
  SIMPLIFIED_VIEW_MODE: boolean;
  SPEED: number;
  TEMPERATURE_MULTIPLIER: number;
  TEMPERATURE_FUNCTION: (p: NumericVector, t: number) => number;
  CONFIG_2D: ViewModeConfig;
  CONFIG_3D: ViewModeConfig;
};
export type RandomTypesConfig = {
  TYPES_COUNT: number;

  USE_RADIUS_BOUNDS: boolean;
  USE_FREQUENCY_BOUNDS: boolean;
  USE_GRAVITY_BOUNDS: boolean;
  USE_LINK_GRAVITY_BOUNDS: boolean;
  USE_LINK_BOUNDS: boolean;
  USE_LINK_TYPE_BOUNDS: boolean;
  USE_LINK_FACTOR_DISTANCE_BOUNDS: boolean;

  RADIUS_BOUNDS: [number, number, number?, number?];
  FREQUENCY_BOUNDS: [number, number, number?, number?];
  GRAVITY_BOUNDS: [number, number, number?, number?];
  LINK_GRAVITY_BOUNDS: [number, number, number?, number?];
  LINK_BOUNDS: [number, number, number?];
  LINK_TYPE_BOUNDS: [number, number, number?];
  LINK_FACTOR_DISTANCE_BOUNDS: [number, number, number?, number?];

  GRAVITY_MATRIX_SYMMETRIC: boolean;
  LINK_GRAVITY_MATRIX_SYMMETRIC: boolean;
  LINK_TYPE_MATRIX_SYMMETRIC: boolean;
  LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: boolean;
  LINK_FACTOR_DISTANCE_EXTENDED: boolean;
};
export type TypesSymmetricConfig = {
  GRAVITY_MATRIX_SYMMETRIC: boolean;
  LINK_GRAVITY_MATRIX_SYMMETRIC: boolean;
  LINK_TYPE_MATRIX_SYMMETRIC: boolean;
  LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: boolean;
}
