import type { SimulationInterface } from './types/simulation';

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
}
