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

export {
  Vector,
  createVector,
  toVector,
  createEmptyMatrix,
  createEmptyTensor,
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
