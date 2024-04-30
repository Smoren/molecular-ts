import type { ImmutableNumericVector, NumericVector, VectorInterface } from './types';
import { isEqual } from './helpers';

/**
 * Vector class
 * @public
 */
export class Vector extends Array implements VectorInterface {
  constructor(coords: NumericVector | ImmutableNumericVector) {
    super(coords.length);
    for (let i=0; i<coords.length; ++i) {
      this[i] = coords[i];
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

  zero(): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] = 0;
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
    if (this.abs === 0) {
      return this;
    }
    this.div(this.abs);
    return this;
  }

  random(): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] = 1-Math.random()*2;
    }
    return this;
  }

  set(values: NumericVector): VectorInterface {
    for (let i=0; i<values.length; ++i) {
      this[i] = values[i];
    }
    return this;
  }

  clone(): VectorInterface {
    return new Vector(this);
  }
}
