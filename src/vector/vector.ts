import { ImmutableNumericVector, NumericVector, VectorInterface } from './types';
import { multi, reduce, single, transform } from 'itertools-ts';
import { isEqual } from './helpers';

/**
 * Vector class
 * @public
 */
export class Vector extends Array implements VectorInterface {
  constructor(coords: NumericVector | ImmutableNumericVector) {
    if (coords.length === 1) {
      super();
      this[0] = coords[0];
    } else {
      super(...coords);
    }
  }

  get abs(): number {
    return Math.sqrt(
      reduce.toSum(single.map(this, (coord) => coord ** 2)),
    );
  }

  add(v: NumericVector): VectorInterface {
    for (const [i, [lhs, rhs]] of single.enumerate(multi.zip(this as VectorInterface, v))) {
      this[i] = lhs + rhs;
    }
    return this;
  }

  sub(v: NumericVector): VectorInterface {
    for (const [i, [lhs, rhs]] of single.enumerate(multi.zip(this as VectorInterface, v))) {
      this[i] = lhs - rhs;
    }
    return this;
  }

  mul(multiplier: number): VectorInterface {
    for (const [i, value] of single.enumerate(this)) {
      this[i] = value * multiplier;
    }
    return this;
  }

  div(divider: number): VectorInterface {
    for (const [i, value] of single.enumerate(this)) {
      this[i] = value / divider;
    }
    return this;
  }

  inverse(): VectorInterface {
    for (const [i, value] of single.enumerate(this)) {
      this[i] = -value;
    }
    return this;
  }

  mulScalar(v: NumericVector): number {
    return reduce.toSum(
      single.map(
        multi.zip(this as NumericVector, v),
        ([lhs, rhs]) => lhs * rhs,
      ),
    );
  }

  mulCoords(v: NumericVector): VectorInterface {
    for (const [i, [lhs, rhs]] of single.enumerate(multi.zip(this as VectorInterface, v))) {
      this[i] = lhs * rhs;
    }
    return this;
  }

  divCoords(v: NumericVector): VectorInterface {
    for (const [i, [lhs, rhs]] of single.enumerate(multi.zip(this as VectorInterface, v))) {
      this[i] = lhs / rhs;
    }
    return this;
  }

  isEqual(v: NumericVector): boolean {
    for (const [lhs, rhs] of multi.zip(this as NumericVector, v)) {
      if (!isEqual(lhs, rhs)) {
        return false;
      }
    }
    return true;
  }

  isNormalized(): boolean {
    return isEqual(this.abs, 1);
  }

  normalize(): VectorInterface {
    this.div(this.abs);
    return this;
  }

  clone(): VectorInterface {
    return new Vector([...this]);
  }
}

/**
 * Immutable Vector class
 * @public
 */
export class ImmutableVector extends Vector {
  readonly _abs: number;

  constructor(coords: ImmutableNumericVector) {
    super(coords);
    this._abs = Math.sqrt(
      reduce.toSum(single.map(this, (coord) => coord ** 2)),
    );
  }

  get abs(): number {
    return this._abs;
  }

  add(v: NumericVector): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(multi.zip(this as VectorInterface, v), ([lhs, rhs]) => lhs + rhs),
      ),
    );
  }

  sub(v: NumericVector): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(multi.zip(this as VectorInterface, v), ([lhs, rhs]) => lhs - rhs),
      ),
    );
  }

  mul(multiplier: number): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(this, (value) => value * multiplier),
      ),
    );
  }

  div(divider: number): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(this, (value) => value / divider),
      ),
    );
  }

  inverse(): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(this, (value) => -value),
      ),
    );
  }

  mulCoords(v: NumericVector): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(multi.zip(this as VectorInterface, v), ([lhs, rhs]) => lhs * rhs),
      ),
    );
  }

  divCoords(v: NumericVector): ImmutableVector {
    return new ImmutableVector(
      transform.toArray(
        single.map(multi.zip(this as VectorInterface, v), ([lhs, rhs]) => lhs / rhs),
      ),
    );
  }

  normalize(): ImmutableVector {
    this.div(this.abs);
    return this;
  }

  clone(): VectorInterface {
    return new ImmutableVector([...this]);
  }
}

/**
 * Creates new vector
 * @public
 * @param coords - coordinates of new vector
 */
export function createVector(coords: NumericVector): VectorInterface {
  return new Vector(coords);
}

/**
 * Converts instance to vector if it's an array
 * @public
 * @param coords - coords as vector or an array
 */
export function toVector(coords: NumericVector): Vector {
  return (coords instanceof Vector) ? coords : createVector(coords);
}

/**
 * Creates new immutable vector
 * @public
 * @param coords - coordinates of new vector
 */
export function createImmutableVector(coords: ImmutableNumericVector): ImmutableVector {
  return new ImmutableVector(coords);
}

/**
 * Converts instance to immutable vector if it's an array
 * @public
 * @param coords - coords as vector or an array
 */
export function toImmutableVector(coords: ImmutableNumericVector): ImmutableVector {
  return (coords instanceof ImmutableVector) ? coords : createImmutableVector(coords);
}
