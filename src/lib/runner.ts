import type { SimulationInterface } from "@/lib/types/simulation";

export class Runner {
  private readonly _simulation: SimulationInterface;

  constructor(simulation: SimulationInterface) {
    this._simulation = simulation;
  }

  runSteps(steps: number): void {
    for (let i=0; i<steps; ++i) {
      this._simulation.step();
    }
  }
}
