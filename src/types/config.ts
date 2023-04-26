import { NumericVector } from '../vector/types';

export type ColorVector = [number, number, number];

type GravityConfig = number[][];
type LinksConfig = number[];
type TypeLinksConfig = number[][];
type ColorsConfig = Array<ColorVector>;
export type TypesConfig = {
  GRAVITY: GravityConfig;
  LINKS: LinksConfig;
  TYPE_LINKS: TypeLinksConfig;
  COLORS: ColorsConfig;
};
export type WorldConfig = {
  ATOM_RADIUS: number;
  MAX_INTERACTION_RADIUS: number;
  MAX_LINK_RADIUS: number;
  GRAVITY_FORCE_MULTIPLIER: number;
  LINK_FORCE_MULTIPLIER: number;
  BOUNCE_FORCE_MULTIPLIER: number;
  INERTIAL_MULTIPLIER: number;
  PLAYBACK_SPEED: number;
  SPEED: number;
};
export type InitialConfig = {
  ATOMS_COUNT: number;
  MAX_POSITION: NumericVector;
};
