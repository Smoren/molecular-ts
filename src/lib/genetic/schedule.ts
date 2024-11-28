import type { BaseGenome, GeneticSearchInterface } from "genetic-search";
import type { ClusterizationWeightsConfig, SimulationGenome } from "@/lib/genetic/types";
import { single, summary } from "itertools-ts";

export type ScheduleRule<TGenome extends BaseGenome, TConfig> = {
  condition: (runner: GeneticSearchInterface<TGenome>, config: TConfig) => boolean;
  action: (runner: GeneticSearchInterface<TGenome>, config: TConfig) => void;
}

export class GeneticSearchScheduler<TGenome extends BaseGenome, TConfig> {
  protected config: TConfig;
  protected rules: ScheduleRule<TGenome, TConfig>[];

  constructor(config: TConfig, rules: ScheduleRule<TGenome, TConfig>[]) {
    this.config = config;
    this.rules = rules;
  }

  public handle(runner: GeneticSearchInterface<TGenome>): void {
    for (const rule of this.rules) {
      if (rule.condition(runner, this.config)) {
        rule.action(runner, this.config);
      }
    }
  }
}

export function createMinCompoundSizeIncreaseRule(
  stepsInterval: number,
  maxValue?: number,
  increaseValue?: number = 1,
): ScheduleRule<SimulationGenome, ClusterizationWeightsConfig> {
  return {
    condition: (runner, config) => {
      if (maxValue !== undefined && config.minCompoundSize >= maxValue) {
        return false;
      }

      return runner.generation % stepsInterval === 0;
    },
    action: (runner, config) => {
      config.minCompoundSize += increaseValue;
      console.log(`\n[SCHEDULER] minCompoundSize increased (${config.minCompoundSize})`);
    },
  };
}

export function createMinCompoundSizeDecreaseRule(
  scoresHistory: number[],
  historyTailLength: number,
  minValue?: number,
  decreaseValue?: number = 1,
): ScheduleRule<SimulationGenome, ClusterizationWeightsConfig> {
  return {
    condition: (runner, config) => {
      if (minValue !== undefined && config.minCompoundSize <= minValue) {
        return false;
      }

      if (scoresHistory.length < historyTailLength) {
        return false;
      }

      const historyTail = scoresHistory.slice(scoresHistory.length-historyTailLength);
      return summary.allMatch(single.pairwise(historyTail), ([prev, next]) => prev > next);
    },
    action: (runner, config) => {
      config.minCompoundSize -= decreaseValue;
      console.log(`\n[SCHEDULER] minCompoundSize decreased (${config.minCompoundSize})`);
    },
  };
}
