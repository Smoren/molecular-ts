import type { BaseGenome, GeneticSearchInterface } from "genetic-search";

export type ScheduleRule<TGenome extends BaseGenome, TConfig> = {
  condition: (runner: GeneticSearchInterface<TGenome>, config: TConfig) => boolean;
  action: (runner: GeneticSearchInterface<TGenome>, config: TConfig) => void;
}

export class GeneticSearchScheduler<TGenome extends BaseGenome, TConfig> {
  protected rules: ScheduleRule<TGenome, TConfig>[];

  constructor(rules: ScheduleRule<TGenome, TConfig>[]) {
    this.rules = rules;
  }

  public handle(runner: GeneticSearchInterface<TGenome>, config: TConfig): void {
    for (const rule of this.rules) {
      if (rule.condition(runner, config)) {
        rule.action(runner, config);
      }
    }
  }
}
