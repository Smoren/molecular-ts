import type { GeneticSearchInterface, SchedulerRule } from "genetic-search";
import type { ClusterizationWeightsConfig, SimulationGenome } from "./types";
import { Scheduler } from "genetic-search";
import { single, summary } from "itertools-ts";
import { fullCopyObject } from "@/lib/utils/functions";
import { shuffleArray } from "@/lib/math/helpers";
import { createRandomInteger } from "@/lib/math";

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

export function createDropoutRule(
  weightsConfig: ClusterizationWeightsConfig,
  minDropoutCount: number,
  maxDropoutCount: number,
): SchedulerRule<SimulationGenome, ClusterizationWeightsConfig> {
  const dropout = new WeightsDropout<ClusterizationWeightsConfig>(weightsConfig, minDropoutCount, maxDropoutCount);
  return {
    condition: () => true,
    action: (input) => {
      const dropped = dropout.dropout();
      if (dropped.length) {
        input.logger(`Weights dropout: ${dropped.join(', ')}`);
      }
    },
  };
}

export function createMinCompoundSizeIncreaseRule(
  stepsInterval: number,
  maxValue?: number,
  increaseValue: number = 1,
): SchedulerRule<SimulationGenome, ClusterizationWeightsConfig> {
  return {
    condition: (input) => {
      if (maxValue !== undefined && input.config.minCompoundSize >= maxValue) {
        return false;
      }

      return input.runner.generation % stepsInterval === 0;
    },
    action: (input) => {
      input.config.minCompoundSize += increaseValue;
      input.logger(`minCompoundSize increased (${input.config.minCompoundSize})`);
    },
  };
}

export function createMinCompoundSizeDecreaseRule(
  decreaseDuration: number,
  minValue?: number,
  decreaseValue: number = 1,
): SchedulerRule<SimulationGenome, ClusterizationWeightsConfig> {
  return {
    condition: (input) => {
      if (minValue !== undefined && input.config.minCompoundSize <= minValue) {
        return false;
      }

      const historyTailLength = decreaseDuration + 1;

      if (input.history.length < historyTailLength) {
        return false;
      }

      const meanScoresHistory = input.history.map((item) => item.fitnessSummary.mean);

      const historyTail = meanScoresHistory.slice(meanScoresHistory.length-historyTailLength);
      return summary.allMatch(single.pairwise(historyTail), ([prev, next]) => prev > next);
    },
    action: (input) => {
      input.config.minCompoundSize -= decreaseValue;
      input.logger(`minCompoundSize decreased (${input.config.minCompoundSize})`);
    },
  };
}

export function createDefaultClustersGradeMaximizeRules(weightsConfig: ClusterizationWeightsConfig): SchedulerRule<SimulationGenome, ClusterizationWeightsConfig>[] {
  return [
    createDropoutRule(weightsConfig, 0, 2),
    // createMinCompoundSizeIncreaseRule(15, 25),
    // createMinCompoundSizeDecreaseRule(10, 5),
  ];
}

export function createSchedulerForClustersGradeMaximize(
  useScheduler: boolean,
  runner: GeneticSearchInterface<SimulationGenome>,
  config: ClusterizationWeightsConfig,
  maxHistoryLength: number = 10,
): Scheduler<SimulationGenome, ClusterizationWeightsConfig> {
  const rules = useScheduler ? createDefaultClustersGradeMaximizeRules(config) : [];
  return new Scheduler({
    runner,
    maxHistoryLength,
    config,
    rules,
  });
}
