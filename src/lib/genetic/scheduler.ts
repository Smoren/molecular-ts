import type { GeneticSearchInterface, SchedulerAction } from "genetic-search";
import type { ClusterizationWeightsConfig, SimulationGenome } from "./types";
import { Scheduler, checkSchedulerCondition } from "genetic-search";
import { single, summary } from "itertools-ts";
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

export function createDropoutAction(
  weightsConfig: ClusterizationWeightsConfig,
  minDropoutCount: number,
  maxDropoutCount: number,
): SchedulerAction<SimulationGenome, ClusterizationWeightsConfig> {
  const dropout = new WeightsDropout<ClusterizationWeightsConfig>(weightsConfig, minDropoutCount, maxDropoutCount);
  return (input) => {
    const dropped = dropout.dropout();
    if (dropped.length) {
      input.logger(`Weights dropout: ${dropped.join(', ')}`);
    }
  };
}

export function createMinCompoundSizeIncreaseAction(
  stepsInterval: number,
  maxValue?: number,
  increaseValue: number = 1,
): SchedulerAction<SimulationGenome, ClusterizationWeightsConfig> {
  return (input) => {
    checkSchedulerCondition(maxValue === undefined || input.config.minCompoundSize < maxValue);
    checkSchedulerCondition(input.runner.generation % stepsInterval === 0);
    input.config.minCompoundSize += increaseValue;
    input.logger(`minCompoundSize increased (${input.config.minCompoundSize})`);
  };
}

export function createMinCompoundSizeDecreaseAction(
  decreaseDuration: number,
  minValue?: number,
  decreaseValue: number = 1,
): SchedulerAction<SimulationGenome, ClusterizationWeightsConfig> {
  return (input) => {
    checkSchedulerCondition(minValue === undefined || input.config.minCompoundSize > minValue);

    const historyTailLength = decreaseDuration + 1;
    checkSchedulerCondition(input.history.length >= historyTailLength);

    const meanScoresHistory = input.history.map((item) => item.fitnessSummary.mean);
    const historyTail = meanScoresHistory.slice(meanScoresHistory.length-historyTailLength);
    checkSchedulerCondition(summary.allMatch(single.pairwise(historyTail), ([prev, next]) => prev > next));

    input.config.minCompoundSize -= decreaseValue;
    input.logger(`minCompoundSize decreased (${input.config.minCompoundSize})`);
  };
}

export function createDefaultClustersGradeMaximizeActions(weightsConfig: ClusterizationWeightsConfig): SchedulerAction<SimulationGenome, ClusterizationWeightsConfig>[] {
  return [
    createDropoutAction(weightsConfig, 0, 2),
    // createMinCompoundSizeIncreaseAction(15, 25),
    // createMinCompoundSizeDecreaseAction(10, 5),
  ];
}

export function createSchedulerForClustersGradeMaximize(
  useScheduler: boolean,
  runner: GeneticSearchInterface<SimulationGenome>,
  config: ClusterizationWeightsConfig,
  maxHistoryLength: number = 10,
): Scheduler<SimulationGenome, ClusterizationWeightsConfig> {
  const actions = useScheduler ? createDefaultClustersGradeMaximizeActions(config) : [];
  return new Scheduler({
    runner,
    maxHistoryLength,
    config,
    actions,
  });
}
