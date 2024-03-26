import type { NumericVector } from '../vector/types';

export type ColorVector = [number, number, number];

type GravityConfig = number[][];
type LinksConfig = number[];
type TypeLinksConfig = number[][];
type LinkFactorDistanceConfig = number[][];
type FrequenciesConfig = number[];
type ColorsConfig = Array<ColorVector>;
export type TypesConfig = {
  GRAVITY: GravityConfig;
  LINK_GRAVITY: GravityConfig;
  LINKS: LinksConfig;
  TYPE_LINKS: TypeLinksConfig;
  LINK_FACTOR_DISTANCE: LinkFactorDistanceConfig;
  FREQUENCIES: FrequenciesConfig;
  COLORS: ColorsConfig;
};
export type WorldConfig = {
  ATOM_RADIUS: number;
  MAX_INTERACTION_RADIUS: number;
  MAX_LINK_RADIUS: number;
  MAX_FORCE: number,
  GRAVITY_FORCE_MULTIPLIER: number;
  LINK_FORCE_MULTIPLIER: number;
  BOUNCE_FORCE_MULTIPLIER: number;
  INERTIAL_MULTIPLIER: number;
  PLAYBACK_SPEED: number;
  SIMPLIFIED_VIEW_MODE: boolean;
  SPEED: number;
  TEMPERATURE_MULTIPLIER: number;
  TEMPERATURE_FUNCTION: (p: NumericVector, t: number) => number;
  MIN_POSITION: number[];
  MAX_POSITION: number[];
};
export type InitialConfig = {
  ATOMS_COUNT: number;
  MIN_POSITION: NumericVector;
  MAX_POSITION: NumericVector;
};
export type RandomTypesConfig = {
  TYPES_COUNT: number;
  GRAVITY_BOUNDS: [number, number, number?];
  LINK_GRAVITY_BOUNDS: [number, number, number?];
  LINK_BOUNDS: [number, number];
  LINK_TYPE_BOUNDS: [number, number];
  LINK_FACTOR_DISTANCE_BOUNDS: [number, number, number?];
};

