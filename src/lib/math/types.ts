/**
 * Simple multi-dimensional vector by array
 * @public
 */
export type NumericVector = Array<number>;

/**
 * Simple multi-dimensional immutable vector by array
 * @public
 */
export type ImmutableNumericVector = ReadonlyArray<number>;

type TensorItem<T> = T | TensorItem<T>[];

/**
 * Multi-dimensional tensor
 * @public
 */
export type Tensor<T> = TensorItem<T>[];

export type Operator = (...args: number[]) => number;
export type OperatorFactory = {
  arguments: string[];
  call: (...args: number[]) => Operator;
}

/**
 * Interface of vector
 */
export interface VectorInterface extends NumericVector {
  /**
   * Absolute length of the vector
   */
  abs: number;
  /**
   * Absolute length ^2 of the vector
   */
  get abs2(): number

  /**
   * Add another vector to this vector
   * @param v - vector to cache
   */
  add(v: NumericVector): VectorInterface;

  /**
   * Subtracts vector with another vector
   * @param v - vector to subtract
   */
  sub(v: NumericVector): VectorInterface;

  /**
   * Multiples vector by number
   * @param multiplier - multiplier
   */
  mul(multiplier: number): VectorInterface;

  /**
   * Divides vector by number
   * @param divider - divider
   */
  div(divider: number): VectorInterface;

  /**
   * Inverses vector
   */
  inverse(): VectorInterface;

  /**
   * Makes vector zero
   */
  zero(): VectorInterface;

  /**
   * Returns scalar product with another vector
   * @param v - another vector
   */
  mulScalar(v: NumericVector): number;

  /**
   * Multiplies this vector with another vector coordinate-by-coordinate
   * @param v - another vector
   */
  mulCoords(v: NumericVector): VectorInterface;

  /**
   * Divides this vector with another vector coordinate-by-coordinate
   * @param v - another vector
   */
  divCoords(v: NumericVector): VectorInterface;

  /**
   * Returns true if this vector is equal to another vector
   * @param v - another vector
   */
  isEqual(v: NumericVector): boolean;

  /**
   * Returns true if vector is normalized
   */
  isNormalized(): boolean;

  /**
   * Normalizes this vector
   */
  normalize(): VectorInterface;

  /**
   * Randomizes this vector
   */
  random(): VectorInterface;

  /**
   * Sets vector values
   */
  set(values: NumericVector): VectorInterface;

  /**
   * Clones vector
   */
  clone(): VectorInterface;

  /**
   * Concatenates with another vector
   */
  concat(v: NumericVector): VectorInterface;
}

/**
 * Interface for positional objects
 */
export interface PositionalInterface {
  /**
   * Position vector
   */
  position: NumericVector;
  /**
   * Position vector
   */
  size: NumericVector;
}

/**
 * Interface for positional vector
 */
export interface PositionalVectorInterface {
  /**
   * Position
   */
  position: VectorInterface;
  /**
   * Size
   */
  size: VectorInterface;
  /**
   * Target position (position + size)
   */
  target: VectorInterface;
  /**
   * Returns the length of vector
   */
  length: number;

  /**
   * Returns true if vector includes the point
   * @param coords - point coords
   */
  includes(coords: NumericVector): boolean;
}
