import { fullCopyObject } from "../utils/functions";
import { shuffleArray } from "../math/helpers";
import { createRandomInteger } from "../math";

export class WeightsDropout<T extends Record<string, number>> {
  private readonly weights: T;
  private readonly weightsBuffer: T;
  private readonly minDropoutCount: number;
  private readonly maxDropoutCount: number;
  private weightsAffected: (keyof T)[] = [];

  constructor(weights: T, minDropoutCount: number = 0, maxDropoutCount: number = 1) {
    this.weights = weights;
    this.weightsBuffer = fullCopyObject(weights);
    this.minDropoutCount = minDropoutCount;
    this.maxDropoutCount = maxDropoutCount;
  }

  public dropout(): (keyof T)[] {
    this.reset();
    const keys = shuffleArray(Object.keys(this.weights));
    const result: (keyof T)[] = [];

    const currentDropoutCount = createRandomInteger([this.minDropoutCount, this.maxDropoutCount]);

    if (currentDropoutCount === 0) {
      return result;
    }

    for (const key of keys.slice(0, currentDropoutCount)) {
      result.push(key);
      [(this.weightsBuffer as any)[key], (this.weights as any)[key]] = [(this.weights as any)[key], 0];
    }

    this.weightsAffected = result;

    return result;
  }

  public reset() {
    for (const key of this.weightsAffected) {
      (this.weights as any)[key] = (this.weightsBuffer as any)[key];
    }
    this.weightsAffected = [];
  }
}
