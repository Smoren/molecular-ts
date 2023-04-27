import { NumericVector } from '../vector/types';
import { createRandomTypesConfig } from "../config/types";

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
  SIMPLIFIED_VIEW_MODE: boolean;
  SPEED: number;
  TEMPERATURE_MULTIPLIER: number;
  TEMPERATURE_FUNCTION: (p: NumericVector, t: number) => number;
};
export type InitialConfig = {
  ATOMS_COUNT: number;
  MIN_POSITION: NumericVector;
  MAX_POSITION: NumericVector;
};
export type RandomTypesConfig = {
  TYPES_COUNT: number;
  GRAVITY_BOUNDS: [number, number];
  LINK_BOUNDS: [number, number];
  LINK_TYPE_BOUNDS: [number, number];
};

