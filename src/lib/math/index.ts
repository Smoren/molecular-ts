import { Vector, createVector, toVector } from './vector';
import { isEqual, getEpsilon, changeEpsilon } from './helpers';
import {
  arrayUnaryOperation,
  arrayBinaryOperation,
  concatArrays,
  concatMatrices,
  concatTensors,
  setMatrixMainDiagonal,
  setTensorMainDiagonal,
} from './operations';

export {
  Vector,
  createVector,
  toVector,
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
};
