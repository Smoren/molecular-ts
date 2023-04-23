import { NumericVector } from '../vector/types';

type GravityConfig = number[][];
type LinksConfig = number[];
type TypeLinksConfig = number[][];
type ColorsConfig = string[];
export type TypesConfig = {
  GRAVITY: GravityConfig;
  LINKS: LinksConfig;
  TYPE_LINKS: TypeLinksConfig;
  COLORS: ColorsConfig;
};
export type WorldConfig = {
  ATOM_RADIUS: number;
  MAX_INTERACTION_RADIUS: number;
  INERTIAL_MULTIPLIER: number;
  SPEED: number;
  MAX_POSITION: NumericVector;
};
export type InitialConfig = {
  ATOMS_COUNT: number;
};
