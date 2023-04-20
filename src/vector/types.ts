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

/**
 * Interface of vector
 */
export interface VectorInterface extends NumericVector {
  /**
   * Absolute length of the vector
   */
  abs: number;

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
   * Clones vector
   */
  clone(): VectorInterface;
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
