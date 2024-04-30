import { Vector } from './vector';
import {
  isEqual,
  getEpsilon,
  changeEpsilon,
  round,
  roundWithStep,
} from './helpers';
import {
  arrayUnaryOperation,
  arrayBinaryOperation,
  concatArrays,
  concatMatrices,
  concatTensors,
  setMatrixMainDiagonal,
  setTensorMainDiagonal,
} from './operations';
import {
  createVector,
  toVector,
  createEmptyMatrix,
  createEmptyTensor,
} from './factories';
import {
  createRandomInteger,
  createRandomFloat,
  randomizeMatrix,
  getIndexByFrequencies,
} from './random';

export {
  Vector,
  createVector,
  toVector,
  createEmptyMatrix,
  createEmptyTensor,
  createRandomInteger,
  createRandomFloat,
  randomizeMatrix,
  getIndexByFrequencies,
  isEqual,
  getEpsilon,
  changeEpsilon,
  arrayUnaryOperation,
  arrayBinaryOperation,
  concatArrays,
  concatMatrices,
  concatTensors,
  setMatrixMainDiagonal,
  setTensorMainDiagonal,
  round,
  roundWithStep,
};
