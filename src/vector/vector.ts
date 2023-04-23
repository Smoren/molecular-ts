import { ImmutableNumericVector, NumericVector, VectorInterface } from './types';
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
    let result = 0;
    for (const coord of this) {
      result += coord**2;
    }
    return Math.sqrt(result);
  }

  get abs2(): number {
    let result = 0;
    for (const coord of this) {
      result += coord**2;
    }
    return result;
  }

  add(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] += v[i];
    }
    return this;
  }

  sub(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] -= v[i];
    }
    return this;
  }

  mul(multiplier: number): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] *= multiplier;
    }
    return this;
  }

  div(divider: number): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] /= divider;
    }
    return this;
  }

  inverse(): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] = -this[i];
    }
    return this;
  }

  mulScalar(v: NumericVector): number {
    let result = 0;
    for (let i=0; i<this.length; ++i) {
      result += this[i] * v[i];
    }
    return result;
  }

  mulCoords(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] *= v[i];
    }
    return this;
  }

  divCoords(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] /= v[i];
    }
    return this;
  }

  isEqual(v: NumericVector): boolean {
    for (let i=0; i<this.length; ++i) {
      if (!isEqual(this[i] as number, v[i])) {
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
