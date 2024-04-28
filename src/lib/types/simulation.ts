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
  readonly config: SimulationConfig;
  readonly summary: Summary<number[]>;
  readonly isPaused: boolean;
  start(): void;
  stop(onStop?: () => void): Promise<void>;
  togglePause(): void;
  refill(initialConfig?: InitialConfig): void;
  clear(): void;
  setPhysicModel(model: PhysicModelInterface): void;
  exportState(): Promise<Record<string, unknown>>;
  importState(state: Record<string, unknown>): Promise<void>;
}
