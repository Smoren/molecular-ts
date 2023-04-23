import { NumericVector } from '../vector/types';

export type GravityConfig = number[][];
export type LinksConfig = number[];
export type TypeLinksConfig = number[][];
export type WorldConfig = {
  ATOM_RADIUS: number;
  MAX_INTERACTION_RADIUS: number;
  INERTIAL_MULTIPLIER: number;
  SPEED: number;
  MAX_POSITION: NumericVector;
};
