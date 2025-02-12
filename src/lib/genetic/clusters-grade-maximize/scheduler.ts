import type { BaseGenome, GeneticSearchInterface, Population, SchedulerAction } from "genetic-search";
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

export function createDefaultClustersGradeMaximizeActions({ weightsConfig, maxAge, useDropout }: {
  weightsConfig: ClusterizationConfig;
  maxAge?: number;
  useDropout?: boolean;
}): SchedulerAction<SimulationGenome, ClusterizationConfig>[] {
  const actions: SchedulerAction<SimulationGenome, ClusterizationConfig>[] = [];

  if (maxAge) {
    actions.push(createRemoveOldGenomesAction(maxAge));
  }

  if (useDropout) {
    actions.push(createDropoutAction(weightsConfig, 0, 2));
  }

  return actions;
}

export function createRemoveOldGenomesAction(maxAge?: number): SchedulerAction<SimulationGenome, ClusterizationConfig> {
  if (maxAge === undefined || maxAge === 0) {
    return () => {};
  }
  return (input) => {
    const removed = input.evaluatedPopulationManager.remove((x) => x.genome.stats!.age > maxAge);
    if (removed.length > 0) {
      const removedIds = removed.map((x) => x.genome.id);
      input.logger(`Removed ${removed.length} old genomes (ids: ${removedIds.join(', ')})`);
    }
  };
}

export function createSchedulerForClustersGradeMaximize({
  useScheduler,
  runner,
  config,
  maxHistoryLength = 10,
  maxAge = undefined,
  useDropout = true,
}: {
  useScheduler: boolean;
  runner: GeneticSearchInterface<SimulationGenome>;
  config: ClusterizationConfig;
  maxHistoryLength?: number;
  maxAge?: number;
  useDropout?: boolean;
}): Scheduler<SimulationGenome, ClusterizationConfig> {
  const actions = useScheduler
    ? createDefaultClustersGradeMaximizeActions({
      weightsConfig: config,
      maxAge,
      useDropout,
    })
    : [];
  return new Scheduler({
    runner,
    maxHistoryLength,
    config,
    actions,
  });
}
