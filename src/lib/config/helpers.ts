import { createColors, createRandomTypesConfig } from './types';
import type { RandomTypesConfig, TypesConfig } from '../types/config';
import {
  concatArrays,
  concatMatrices,
  concatTensors,
  makeMatrixSymmetric,
  makeTensorSymmetric,
} from '../math/operations';
import { fullCopyObject } from '@/helpers/utils';

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
