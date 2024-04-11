import type { InitialConfig, TypesConfig, WorldConfig } from './config';
import type { AtomInterface } from './atomic';
import type { DrawerInterface } from './drawer';
import type { PhysicModelInterface } from './interaction';
import type { Summary } from './summary';

export type SimulationConfig = {
  worldConfig: WorldConfig;
  typesConfig: TypesConfig;
  initialConfig: InitialConfig;
  physicModel: PhysicModelInterface;
  atomsFactory: (
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    initialConfig: InitialConfig
  ) => AtomInterface[];
  drawer: DrawerInterface;
};

export interface SimulationInterface {
  readonly summary: Summary<number[]>;
  start(): void;
  stop(): void;
  refill(initialConfig?: InitialConfig): void;
  clear(): void;
  setPhysicModel(model: PhysicModelInterface): void;
}
