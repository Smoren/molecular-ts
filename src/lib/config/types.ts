import type { ColorVector, RandomTypesConfig, TypesConfig } from '../types/config';
import { createRandomFloat, createRandomInteger, getRandomColor } from "@/lib/helpers";

function createColors(count: number): Array<ColorVector> {
  const predefined: Array<ColorVector> = [
    [250, 20, 20],
    [200, 140, 100],
    [80, 170, 140],
    [180, 180, 80],
    [70, 120, 250],
    [250, 100, 250],
  ].reverse() as Array<ColorVector>;
  const result: Array<ColorVector> = [];
  for (let i=0; i<count; ++i) {
    if (predefined.length) {
      result.push(predefined.pop() as ColorVector);
    } else {
      result.push(getRandomColor());
    }
  }
  return result;
}

export function createBaseTypesConfig(): TypesConfig {
  return {
    GRAVITY: [
      [-1, -1, -1, -1, 0.1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [1, 1, 1, 1, -1, -1],
      [1, -1, 1, -1, -0.5, -1],
      [0, 0, -1, 1, 1, 0],
    ],
    LINK_GRAVITY: [
      [-1, -1, 1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
    ],
    LINKS: [1, 3, 2, 3, 2, 1],
    TYPE_LINKS: [
      [0, 1, 1, 1, 0, 0],
      [1, 2, 1, 0, 0, 0],
      [1, 1, 2, 0, 0, 0],
      [1, 0, 0, 2, 1, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1],
    ],
    LINK_FACTOR_DISTANCE: [
      [1, 1, 1, 1, 0.7, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1.1, 0.7, 1, 1, 1],
      [0.8, 1, 1, 1, 1, 0.5],
      [1, 1, 1, 0.7, 0.3, 1],
    ],
    FREQUENCIES: [1, 1, 1, 1, 1, 0.05],
    COLORS: createColors(6),
  };
}

export function createRandomTypesConfig({
  TYPES_COUNT,
  GRAVITY_BOUNDS,
  LINK_GRAVITY_BOUNDS,
  LINK_TYPE_BOUNDS,
  LINK_BOUNDS,
  LINK_FACTOR_DISTANCE_BOUNDS,
}: RandomTypesConfig): TypesConfig {
  const precision = 8;

  const gravity: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    gravity.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      gravity[i].push(createRandomFloat(GRAVITY_BOUNDS, precision));
    }
  }

  const linkGravity: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    linkGravity.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      linkGravity[i].push(createRandomFloat(LINK_GRAVITY_BOUNDS, precision));
    }
  }

  const links: number[] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    links.push(createRandomInteger(LINK_BOUNDS));
  }

  const typeLinks: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    typeLinks.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      if (i > j) {
        typeLinks[i].push(typeLinks[j][i]);
      } else {
        typeLinks[i].push(createRandomInteger(LINK_TYPE_BOUNDS));
      }
    }
  }

  const linkFactorDistance: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    linkFactorDistance.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      linkFactorDistance[i].push(createRandomFloat(LINK_FACTOR_DISTANCE_BOUNDS, precision));
    }
  }

  const frequencies: number[] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    frequencies.push(Math.random());
  }

  return {
    GRAVITY: gravity,
    LINK_GRAVITY: linkGravity,
    LINKS: links,
    TYPE_LINKS: typeLinks,
    LINK_FACTOR_DISTANCE: linkFactorDistance,
    FREQUENCIES: frequencies,
    COLORS: createColors(TYPES_COUNT),
  };
}

export function createDefaultRandomTypesConfig(typesCount: number): RandomTypesConfig {
  return {
    TYPES_COUNT: typesCount,
    GRAVITY_BOUNDS: [-1, 0.5, 0.01],
    LINK_GRAVITY_BOUNDS: [-1, 0.5, 0.01],
    LINK_BOUNDS: [1, 3],
    LINK_TYPE_BOUNDS: [0, 3],
    LINK_FACTOR_DISTANCE_BOUNDS: [0.5, 1.5, 0.01],
    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
  };
}
