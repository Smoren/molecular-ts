import type { GeneticSearchInterface, SchedulerRule } from "genetic-search";
import type { ClusterizationWeightsConfig, SimulationGenome } from "./types";
import { Scheduler } from "genetic-search";
import { single, summary } from "itertools-ts";

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

export function createDefaultClustersGradeMaximizeRules(): SchedulerRule<SimulationGenome, ClusterizationWeightsConfig>[] {
  return [
    createMinCompoundSizeIncreaseRule(15, 25),
    createMinCompoundSizeDecreaseRule(10, 5),
  ];
}

export function createSchedulerForClustersGradeMaximize(
  useScheduler: boolean,
  runner: GeneticSearchInterface<SimulationGenome>,
  config: ClusterizationWeightsConfig,
  maxHistoryLength: number = 10,
): Scheduler<SimulationGenome, ClusterizationWeightsConfig> {
  const rules = useScheduler ? createDefaultClustersGradeMaximizeRules() : [];
  return new Scheduler({
    runner,
    maxHistoryLength,
    config,
    rules,
  });
}
