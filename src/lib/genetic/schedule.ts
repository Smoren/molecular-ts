import type { BaseGenome, GeneticSearchInterface } from "genetic-search";

type GeneticSearchSchedulerConfig<TGenome extends BaseGenome> = {
  schedule: [number, (algo: GeneticSearchInterface<TGenome>) => void][];
  stop: (algo: GeneticSearchInterface<TGenome>) => boolean;
};

export class StopSearchException extends Error {}

export class GeneticSearchScheduler<TGenome extends BaseGenome> {
  private readonly config: GeneticSearchSchedulerConfig<TGenome>;
  private stepIndex: number;

  constructor(config: GeneticSearchSchedulerConfig<TGenome>) {
    this.config = config;
    this.stepIndex = 1;
  }

  public step(algo: GeneticSearchInterface<TGenome>): void {
    const actions = this.config.schedule.filter(([steps]) => this.stepIndex % steps === 0);
    actions.map(([_, action]) => action(algo));

    if (this.config.stop(algo)) {
      throw new StopSearchException();
    }

    this.stepIndex++;
  }
}
