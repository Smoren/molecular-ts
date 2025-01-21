import type { GeneticSearchInterface, SchedulerAction } from "genetic-search";
import type { ClusterizationConfig, ClusterizationWeights, SimulationGenome } from "../types";
import { Scheduler, checkSchedulerCondition } from "genetic-search";
import { single, summary } from "itertools-ts";
import { WeightsDropout } from "../scheduler";

export function createDropoutAction(
  config: ClusterizationConfig,
  minDropoutCount: number,
  maxDropoutCount: number,
): SchedulerAction<SimulationGenome, ClusterizationConfig> {
  const dropout = new WeightsDropout<ClusterizationWeights>(config.weights, minDropoutCount, maxDropoutCount);
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
): SchedulerAction<SimulationGenome, ClusterizationConfig> {
  return (input) => {
    checkSchedulerCondition(maxValue === undefined || input.config.params.minCompoundSize < maxValue);
    checkSchedulerCondition(input.runner.generation % stepsInterval === 0);
    input.config.params.minCompoundSize += increaseValue;
    input.logger(`minCompoundSize increased (${input.config.params.minCompoundSize})`);
  };
}

export function createMinCompoundSizeDecreaseAction(
  decreaseDuration: number,
  minValue?: number,
  decreaseValue: number = 1,
): SchedulerAction<SimulationGenome, ClusterizationConfig> {
  return (input) => {
    checkSchedulerCondition(minValue === undefined || input.config.params.minCompoundSize > minValue);

    const historyTailLength = decreaseDuration + 1;
    checkSchedulerCondition(input.history.length >= historyTailLength);

    const meanScoresHistory = input.history.map((item) => item.fitnessSummary.mean);
    const historyTail = meanScoresHistory.slice(meanScoresHistory.length-historyTailLength);
    checkSchedulerCondition(summary.allMatch(single.pairwise(historyTail), ([prev, next]) => prev > next));

    input.config.params.minCompoundSize -= decreaseValue;
    input.logger(`minCompoundSize decreased (${input.config.params.minCompoundSize})`);
  };
}

export function createDefaultClustersGradeMaximizeActions(weightsConfig: ClusterizationConfig): SchedulerAction<SimulationGenome, ClusterizationConfig>[] {
  return [
    createDropoutAction(weightsConfig, 0, 2),
    // createMinCompoundSizeIncreaseAction(15, 25),
    // createMinCompoundSizeDecreaseAction(10, 5),
  ];
}

export function createSchedulerForClustersGradeMaximize(
  useScheduler: boolean,
  runner: GeneticSearchInterface<SimulationGenome>,
  config: ClusterizationConfig,
  maxHistoryLength: number = 10,
): Scheduler<SimulationGenome, ClusterizationConfig> {
  const actions = useScheduler ? createDefaultClustersGradeMaximizeActions(config) : [];
  return new Scheduler({
    runner,
    maxHistoryLength,
    config,
    actions,
  });
}
