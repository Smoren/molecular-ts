import type { BaseGenome, GeneticSearchInterface, PopulationSummary } from "genetic-search";
import type { ClusterizationWeightsConfig, SimulationGenome } from "@/lib/genetic/types";
import { single, summary } from "itertools-ts";

export type ScheduleRuleInput<TGenome extends BaseGenome, TConfig> = {
  runner: GeneticSearchInterface<TGenome>;
  history: PopulationSummary[];
  config: TConfig;
}

export type ScheduleRule<TGenome extends BaseGenome, TConfig> = {
  condition: (input: ScheduleRuleInput<TGenome, TConfig>) => boolean;
  action: (input: ScheduleRuleInput<TGenome, TConfig>) => void;
}

export type GeneticSearchSchedulerConfig<TGenome extends BaseGenome, TConfig> = {
  runner: GeneticSearchInterface<TGenome>;
  config: TConfig;
  rules: ScheduleRule<TGenome, TConfig>[];
  maxHistoryLength: number;
}

export interface GeneticSearchSchedulerInterface<TGenome extends BaseGenome, TConfig> {
  handle(): void;
}

export class GeneticSearchScheduler<TGenome extends BaseGenome, TConfig> implements GeneticSearchSchedulerInterface<TGenome, TConfig> {
  protected readonly runner: GeneticSearchInterface<TGenome>;
  protected readonly config: TConfig;
  protected readonly maxHistoryLength: number;
  protected readonly rules: ScheduleRule<TGenome, TConfig>[];
  protected history: PopulationSummary[] = [];

  constructor(params: GeneticSearchSchedulerConfig<TGenome, TConfig>) {
    this.runner = params.runner;
    this.config = params.config;
    this.rules = params.rules;
    this.maxHistoryLength = params.maxHistoryLength;
  }

  public handle(): void {
    this.handleHistory();
    for (const rule of this.rules) {
      const ruleInput = this.getRuleInput();
      if (rule.condition(ruleInput)) {
        rule.action(ruleInput);
      }
    }
  }

  protected handleHistory(): void {
    this.history.push(this.runner.getPopulationSummary());
    if (this.history.length >= this.maxHistoryLength) {
      this.history = this.history.slice(this.history.length - this.maxHistoryLength);
    }
  }

  protected getRuleInput(): ScheduleRuleInput<TGenome, TConfig> {
    return {
      runner: this.runner,
      history: this.history,
      config: this.config,
    };
  }
}

export function createMinCompoundSizeIncreaseRule(
  stepsInterval: number,
  maxValue?: number,
  increaseValue: number = 1,
): ScheduleRule<SimulationGenome, ClusterizationWeightsConfig> {
  return {
    condition: (input) => {
      if (maxValue !== undefined && input.config.minCompoundSize >= maxValue) {
        return false;
      }

      return input.runner.generation % stepsInterval === 0;
    },
    action: (input) => {
      input.config.minCompoundSize += increaseValue;
      console.log(`\n[SCHEDULER] minCompoundSize increased (${input.config.minCompoundSize})`);
    },
  };
}

export function createMinCompoundSizeDecreaseRule(
  decreaseDuration: number,
  minValue?: number,
  decreaseValue: number = 1,
): ScheduleRule<SimulationGenome, ClusterizationWeightsConfig> {
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
      console.log(`\n[SCHEDULER] minCompoundSize decreased (${input.config.minCompoundSize})`);
    },
  };
}
