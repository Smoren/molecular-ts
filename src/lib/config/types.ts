import type { ColorVector, RandomTypesConfig, TypesConfig } from '../types/config';
import {
  createDistributedLinkFactorDistance,
  getRandomColor,
  fullCopyObject,
} from '../utils/functions';
import {
  concatArrays,
  concatMatrices,
  concatTensors,
  createFilledMatrix,
  createFilledArray,
  createRandomFloat,
  createRandomInteger,
  crossArrays,
  crossMatrices,
  crossTensors,
  randomCrossArrays,
  randomCrossMatrices,
  randomCrossTensors,
  randomizeMatrix,
  setMatrixMainDiagonal,
  setTensorMainDiagonal,
  createFilledTensor,
} from '../math';
import { makeMatrixSymmetric, makeTensorSymmetric } from '../math/operations';

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

export function creatDefaultTypesConfig(): TypesConfig {
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
    LINK_FACTOR_DISTANCE_USE_EXTENDED: true,
    FREQUENCIES: [1, 1, 1, 1, 1, 0.05],
    COLORS: createColors(6),
  };
}

export function createTransparentTypesConfig(typesCount: number): TypesConfig {
  return {
    RADIUS: createFilledArray(typesCount, 1),
    GRAVITY: createFilledMatrix(typesCount, typesCount, 0),
    LINK_GRAVITY: createFilledMatrix(typesCount, typesCount, 0),
    LINKS: createFilledArray(typesCount, 0),
    TYPE_LINKS: createFilledMatrix(typesCount, typesCount, 0),
    LINK_FACTOR_DISTANCE: createFilledMatrix(typesCount, typesCount, 0),
    LINK_FACTOR_DISTANCE_EXTENDED: createFilledTensor(typesCount, typesCount, typesCount, 0),
    LINK_FACTOR_DISTANCE_USE_EXTENDED: true,
    FREQUENCIES: createFilledArray(typesCount, 1),
    COLORS: createColors(typesCount),
  }
}

export function createSingleTypeConfig(): TypesConfig {
  return {
    RADIUS: [1],
    FREQUENCIES: [1],
    COLORS: createColors(1),
    GRAVITY: [[0]],
    LINK_GRAVITY: [[0]],
    LINKS: [0],
    TYPE_LINKS: [[0]],
    LINK_FACTOR_DISTANCE: [[1]],
    LINK_FACTOR_DISTANCE_EXTENDED: [[[1]]],
    LINK_FACTOR_DISTANCE_USE_EXTENDED: true,
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
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: true,
    LINK_FACTOR_DISTANCE_EXTENDED: true,
    LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE: true,
  };
}

export function createWideRandomTypesConfig(typesCount: number): RandomTypesConfig {
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
    GRAVITY_BOUNDS: [-10, 1, -1, 0.1],
    LINK_GRAVITY_BOUNDS: [-15, 1, -1, 0.1],
    LINK_BOUNDS: [1, 6, 3],
    LINK_TYPE_BOUNDS: [0, 5, 2],
    LINK_FACTOR_DISTANCE_BOUNDS: [0.2, 1.2, 1, 0.1],

    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: true,
    LINK_FACTOR_DISTANCE_EXTENDED: true,
    LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE: true,
  };
}

export function copyConfigListValue(copyFrom: unknown[], copyTo: unknown[], defaultValue: number) {
  for (const i in copyTo as Array<unknown>) {
    copyTo[i] = copyFrom[i] ?? defaultValue;
  }
}

export function copyConfigMatrixValue(
  copyFrom: unknown[][],
  copyTo: unknown[][],
  defaultValue: number,
  skipSubMatricesBoundaryIndex?: number,
) {
  for (let i=0; i<copyTo.length; ++i) {
    for (let j=0; j<copyTo[i].length; ++j) {
      if (skipSubMatricesBoundaryIndex !== undefined) {
        if (i < skipSubMatricesBoundaryIndex && j >= skipSubMatricesBoundaryIndex) continue;
        if (i >= skipSubMatricesBoundaryIndex && j < skipSubMatricesBoundaryIndex) continue;
      }

      if (copyFrom[i] === undefined) {
        copyTo[i][j] = defaultValue;
      } else {
        copyTo[i][j] = copyFrom[i][j] ?? defaultValue;
      }
    }
  }
}

export function copyConfigTensorValue(
  copyFrom: unknown[][][],
  copyTo: unknown[][][],
  defaultValue: number,
  skipSubMatricesBoundaryIndex?: number,
) {
  for (let i=0; i<copyTo.length; ++i) {
    for (let j=0; j<copyTo[i].length; ++j) {
      for (let k=0; k<copyTo[i][j].length; ++k) {
        if (
          skipSubMatricesBoundaryIndex !== undefined &&
          !(i < skipSubMatricesBoundaryIndex && j < skipSubMatricesBoundaryIndex && k < skipSubMatricesBoundaryIndex) &&
          !(i >= skipSubMatricesBoundaryIndex && j >= skipSubMatricesBoundaryIndex && k >= skipSubMatricesBoundaryIndex)
        ) continue;
        if (copyFrom[i] === undefined || copyFrom[i][j] === undefined) {
          copyTo[i][j][k] = defaultValue;
        } else {
          copyTo[i][j][k] = copyFrom[i][j][k] ?? defaultValue;
        }
      }
    }
  }
}

export function randomizeTypesConfig(
  randomTypesConfig: RandomTypesConfig,
  oldConfig?: TypesConfig,
  skipSubMatricesBoundaryIndex?: number,
) {
  oldConfig = oldConfig ?? createRandomTypesConfig(randomTypesConfig);
  const newConfig = createRandomTypesConfig(randomTypesConfig);

  if (!randomTypesConfig.USE_FREQUENCY_BOUNDS || skipSubMatricesBoundaryIndex !== undefined) {
    copyConfigListValue(oldConfig.FREQUENCIES, newConfig.FREQUENCIES, 1);
  }

  if (!randomTypesConfig.USE_RADIUS_BOUNDS || skipSubMatricesBoundaryIndex !== undefined) {
    copyConfigListValue(oldConfig.RADIUS, newConfig.RADIUS, 1);
  }

  if (!randomTypesConfig.USE_LINK_BOUNDS || skipSubMatricesBoundaryIndex !== undefined) {
    copyConfigListValue(oldConfig.LINKS, newConfig.LINKS, 0);
  }

  if (!randomTypesConfig.USE_GRAVITY_BOUNDS) {
    copyConfigMatrixValue(oldConfig.GRAVITY, newConfig.GRAVITY, 0);
  } else {
    if (randomTypesConfig.GRAVITY_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(newConfig.GRAVITY);
    }
    if (skipSubMatricesBoundaryIndex !== undefined) {
      copyConfigMatrixValue(oldConfig.GRAVITY, newConfig.GRAVITY, 0, skipSubMatricesBoundaryIndex);
    }
  }

  if (!randomTypesConfig.USE_LINK_GRAVITY_BOUNDS) {
    copyConfigMatrixValue(oldConfig.LINK_GRAVITY, newConfig.LINK_GRAVITY, 0);
  } else {
    if (randomTypesConfig.LINK_GRAVITY_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(newConfig.LINK_GRAVITY);
    }
    if (skipSubMatricesBoundaryIndex !== undefined) {
      copyConfigMatrixValue(oldConfig.LINK_GRAVITY, newConfig.LINK_GRAVITY, 0, skipSubMatricesBoundaryIndex);
    }
  }

  if (!randomTypesConfig.USE_LINK_TYPE_BOUNDS) {
    copyConfigMatrixValue(oldConfig.TYPE_LINKS, newConfig.TYPE_LINKS, 0);
  } else {
    if (randomTypesConfig.LINK_TYPE_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(newConfig.TYPE_LINKS);
    }
    if (skipSubMatricesBoundaryIndex !== undefined) {
      copyConfigMatrixValue(oldConfig.TYPE_LINKS, newConfig.TYPE_LINKS, 0, skipSubMatricesBoundaryIndex);
    }
  }

  if (!randomTypesConfig.USE_LINK_FACTOR_DISTANCE_BOUNDS) {
    copyConfigMatrixValue(oldConfig.LINK_FACTOR_DISTANCE, newConfig.LINK_FACTOR_DISTANCE, 1);
    copyConfigTensorValue(oldConfig.LINK_FACTOR_DISTANCE_EXTENDED, newConfig.LINK_FACTOR_DISTANCE_EXTENDED, 1);
    newConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED = oldConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED;
  } else {
    if (randomTypesConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(newConfig.LINK_FACTOR_DISTANCE);
      makeTensorSymmetric(newConfig.LINK_FACTOR_DISTANCE_EXTENDED);
    }
    if (skipSubMatricesBoundaryIndex !== undefined) {
      copyConfigMatrixValue(
        oldConfig.LINK_FACTOR_DISTANCE,
        newConfig.LINK_FACTOR_DISTANCE,
        1,
        skipSubMatricesBoundaryIndex,
      );
      copyConfigTensorValue(
        oldConfig.LINK_FACTOR_DISTANCE_EXTENDED,
        newConfig.LINK_FACTOR_DISTANCE_EXTENDED,
        1,
        skipSubMatricesBoundaryIndex,
      );
    }
  }

  return newConfig;
}

export function concatTypesConfigs(lhs: TypesConfig, rhs: TypesConfig): TypesConfig {
  const result = fullCopyObject(lhs);

  result.COLORS = createColors(lhs.COLORS.length + rhs.COLORS.length);
  result.RADIUS = concatArrays(lhs.RADIUS, rhs.RADIUS);
  result.FREQUENCIES = concatArrays(lhs.FREQUENCIES, rhs.FREQUENCIES);

  result.GRAVITY = concatMatrices(lhs.GRAVITY, rhs.GRAVITY);
  result.LINK_GRAVITY = concatMatrices(lhs.LINK_GRAVITY, rhs.LINK_GRAVITY);

  result.LINKS = concatArrays(lhs.LINKS, rhs.LINKS);
  result.TYPE_LINKS = concatMatrices(lhs.TYPE_LINKS, rhs.TYPE_LINKS);

  result.LINK_FACTOR_DISTANCE = concatMatrices(
    lhs.LINK_FACTOR_DISTANCE,
    rhs.LINK_FACTOR_DISTANCE,
    1,
  );
  result.LINK_FACTOR_DISTANCE_EXTENDED = concatTensors(
    lhs.LINK_FACTOR_DISTANCE_EXTENDED,
    rhs.LINK_FACTOR_DISTANCE_EXTENDED,
    1,
  );

  return result;
}

export function crossTypesConfigs(lhs: TypesConfig, rhs: TypesConfig, separator: number): TypesConfig {
  const result = fullCopyObject(lhs);

  result.COLORS = createColors(lhs.COLORS.length);
  result.RADIUS = crossArrays(lhs.RADIUS, rhs.RADIUS, separator);
  result.FREQUENCIES = crossArrays(lhs.FREQUENCIES, rhs.FREQUENCIES, separator);

  result.GRAVITY = crossMatrices(lhs.GRAVITY, rhs.GRAVITY, separator);
  result.LINK_GRAVITY = crossMatrices(lhs.LINK_GRAVITY, rhs.LINK_GRAVITY, separator);

  result.LINKS = crossArrays(lhs.LINKS, rhs.LINKS, separator);
  result.TYPE_LINKS = crossMatrices(lhs.TYPE_LINKS, rhs.TYPE_LINKS, separator);

  result.LINK_FACTOR_DISTANCE = crossMatrices(
    lhs.LINK_FACTOR_DISTANCE,
    rhs.LINK_FACTOR_DISTANCE,
    separator,
  );
  result.LINK_FACTOR_DISTANCE_EXTENDED = crossTensors(
    lhs.LINK_FACTOR_DISTANCE_EXTENDED,
    rhs.LINK_FACTOR_DISTANCE_EXTENDED,
    separator,
  );

  return result;
}

export function randomCrossTypesConfigs(lhs: TypesConfig, rhs: TypesConfig, separator: number): TypesConfig {
  const result = fullCopyObject(lhs);

  result.COLORS = createColors(lhs.COLORS.length);
  result.RADIUS = randomCrossArrays(lhs.RADIUS, rhs.RADIUS, separator);
  result.FREQUENCIES = randomCrossArrays(lhs.FREQUENCIES, rhs.FREQUENCIES, separator);

  result.GRAVITY = randomCrossMatrices(lhs.GRAVITY, rhs.GRAVITY, separator);
  result.LINK_GRAVITY = randomCrossMatrices(lhs.LINK_GRAVITY, rhs.LINK_GRAVITY, separator);

  result.LINKS = randomCrossArrays(lhs.LINKS, rhs.LINKS, separator);
  result.TYPE_LINKS = randomCrossMatrices(lhs.TYPE_LINKS, rhs.TYPE_LINKS, separator);

  result.LINK_FACTOR_DISTANCE = randomCrossMatrices(
    lhs.LINK_FACTOR_DISTANCE,
    rhs.LINK_FACTOR_DISTANCE,
    separator,
  );
  result.LINK_FACTOR_DISTANCE_EXTENDED = randomCrossTensors(
    lhs.LINK_FACTOR_DISTANCE_EXTENDED,
    rhs.LINK_FACTOR_DISTANCE_EXTENDED,
    separator,
  );

  return result;
}
