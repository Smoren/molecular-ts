import type { SimulationInterface } from './types/simulation';
import { sleep } from "../genetic/utils";

export class Runner {
  public readonly simulation: SimulationInterface;

  constructor(simulation: SimulationInterface) {
    this.simulation = simulation;
  }

  runSteps(steps: number): void {
    for (let i=0; i<steps; ++i) {
      this.simulation.step();
    }
  }

  async runStepsWithTimeout(steps: number, timeout: number, every: number = 1): Promise<void> {
    for (let i=0; i<steps; ++i) {
      this.simulation.step();

      if (i % every === 0) {
        await sleep(timeout);
      }
    }
  }
}
