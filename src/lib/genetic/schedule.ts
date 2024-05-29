import type { GeneticSearchInterface } from '../types/genetic';

type GeneticSearchSchedulerConfig = {
  schedule: [number, (algo: GeneticSearchInterface) => void][];
  stop: (algo: GeneticSearchInterface) => boolean;
};

export class StopSearchException extends Error {}

export class GeneticSearchScheduler {
  private readonly config: GeneticSearchSchedulerConfig;
  private stepIndex: number;

  constructor(config: GeneticSearchSchedulerConfig) {
    this.config = config;
    this.stepIndex = 1;
  }

  public step(algo: GeneticSearchInterface): void {
    const actions = this.config.schedule.filter(([steps]) => this.stepIndex % steps === 0);
    actions.map(([_, action]) => action(algo));

    if (this.config.stop(algo)) {
      throw new StopSearchException();
    }

    this.stepIndex++;
  }
}
