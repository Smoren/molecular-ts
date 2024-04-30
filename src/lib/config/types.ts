import type { ColorVector, RandomTypesConfig, TypesConfig } from '../types/config';
import {
  createRandomFloat,
  createRandomInteger,
  createDistributedLinkFactorDistance,
  getRandomColor,
  randomizeMatrix,
} from '../helpers';
import { setMatrixMainDiagonal, setTensorMainDiagonal } from '../math';

export function createColors(count: number): Array<ColorVector> {
  const predefined: Array<ColorVector> = [
    [250, 20, 20],
    [200, 140, 100],
    [80, 170, 140],
    [180, 180, 80],
    [70, 120, 250],
    [250, 100, 250],
    [206, 255, 182],
    [157, 68, 216],
    [61, 192, 249],
    [121, 242, 52],
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
  const linkFactorDistance = [
    [1, 1, 1, 1, 0.7, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1.1, 0.7, 1, 1, 1],
    [0.8, 1, 1, 1, 1, 0.5],
    [1, 1, 1, 0.7, 0.3, 1],
  ];

  return {
    RADIUS: [1, 1, 1, 1, 1, 1],
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
    LINK_FACTOR_DISTANCE: linkFactorDistance,
    LINK_FACTOR_DISTANCE_EXTENDED: createDistributedLinkFactorDistance(linkFactorDistance),
    LINK_FACTOR_DISTANCE_USE_EXTENDED: false,
    FREQUENCIES: [1, 1, 1, 1, 1, 0.05],
    COLORS: createColors(6),
  };
}

export function createRandomTypesConfig({
  TYPES_COUNT,
  RADIUS_BOUNDS,
  FREQUENCY_BOUNDS,
  GRAVITY_BOUNDS,
  LINK_GRAVITY_BOUNDS,
  LINK_TYPE_BOUNDS,
  LINK_BOUNDS,
  LINK_FACTOR_DISTANCE_BOUNDS,
  GRAVITY_MATRIX_SYMMETRIC,
  LINK_GRAVITY_MATRIX_SYMMETRIC,
  LINK_TYPE_MATRIX_SYMMETRIC,
  LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC,
  LINK_FACTOR_DISTANCE_EXTENDED,
  LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE,
}: RandomTypesConfig): TypesConfig {
  const precision = 8;

  const radius: number[] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    radius.push(createRandomFloat(RADIUS_BOUNDS, precision));
  }

  const gravity = randomizeMatrix(
    TYPES_COUNT,
    GRAVITY_BOUNDS,
    createRandomFloat,
    GRAVITY_MATRIX_SYMMETRIC,
    precision,
  );

  const frequencies: number[] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    frequencies.push(createRandomFloat(FREQUENCY_BOUNDS, precision));
  }

  const linkGravity = randomizeMatrix(
    TYPES_COUNT,
    LINK_GRAVITY_BOUNDS,
    createRandomFloat,
    LINK_GRAVITY_MATRIX_SYMMETRIC,
    precision,
  );

  const links: number[] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    links.push(createRandomInteger(LINK_BOUNDS));
  }

  const typeLinks = randomizeMatrix(
    TYPES_COUNT,
    LINK_TYPE_BOUNDS,
    createRandomInteger,
    LINK_TYPE_MATRIX_SYMMETRIC,
    precision,
  );

  const linkFactorDistance = randomizeMatrix(
    TYPES_COUNT,
    LINK_FACTOR_DISTANCE_BOUNDS,
    createRandomFloat,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC,
    precision,
  );

  if (LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE) {
    setMatrixMainDiagonal(linkFactorDistance, 1);
  }

  let linkFactorDistanceExtended: number[][][] | undefined;

  if (LINK_FACTOR_DISTANCE_EXTENDED) {
    linkFactorDistanceExtended = [];
    for (let i=0; i<TYPES_COUNT; ++i) {
      linkFactorDistanceExtended.push(randomizeMatrix(
        TYPES_COUNT,
        LINK_FACTOR_DISTANCE_BOUNDS,
        createRandomFloat,
        LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC,
        precision,
      ));
    }

    if (LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE) {
      setTensorMainDiagonal(linkFactorDistanceExtended, 1);
    }
  }

  return {
    RADIUS: radius,
    GRAVITY: gravity,
    FREQUENCIES: frequencies,
    LINK_GRAVITY: linkGravity,
    LINKS: links,
    TYPE_LINKS: typeLinks,
    LINK_FACTOR_DISTANCE: linkFactorDistance,
    LINK_FACTOR_DISTANCE_EXTENDED: linkFactorDistanceExtended ?? createDistributedLinkFactorDistance(linkFactorDistance),
    LINK_FACTOR_DISTANCE_USE_EXTENDED: LINK_FACTOR_DISTANCE_EXTENDED,
    COLORS: createColors(TYPES_COUNT),
  };
}

export function createDefaultRandomTypesConfig(typesCount: number): RandomTypesConfig {
  return {
    TYPES_COUNT: typesCount,

    USE_RADIUS_BOUNDS: false,
    USE_FREQUENCY_BOUNDS: false,
    USE_GRAVITY_BOUNDS: true,
    USE_LINK_GRAVITY_BOUNDS: true,
    USE_LINK_BOUNDS: true,
    USE_LINK_TYPE_BOUNDS: true,
    USE_LINK_FACTOR_DISTANCE_BOUNDS: true,

    RADIUS_BOUNDS: [0.8, 1.3, 1, 0.1],
    FREQUENCY_BOUNDS: [0.1, 1, 0.5, 0.1],
    GRAVITY_BOUNDS: [-2, 1, -1, 0.1],
    LINK_GRAVITY_BOUNDS: [-5, 1, -1, 0.1],
    LINK_BOUNDS: [1, 3, 2],
    LINK_TYPE_BOUNDS: [0, 3, 2],
    LINK_FACTOR_DISTANCE_BOUNDS: [0.7, 1.2, 1, 0.1],

    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_EXTENDED: true,
    LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE: true,
  };
}
