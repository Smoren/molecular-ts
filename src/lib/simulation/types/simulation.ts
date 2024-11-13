import type { InitialConfig, TypesConfig, WorldConfig, ViewMode } from '../../config/types';
import type { AtomInterface } from './atomic';
import type { DrawerInterface } from '../../drawer/types';
import type { PhysicModelInterface } from './interaction';
import type { WorldSummary, Compound } from '../../analysis/types';
import type { LinkManagerInterface } from './utils';

export type SimulationConfig = {
  viewMode: ViewMode;
  worldConfig: WorldConfig;
  typesConfig: TypesConfig;
  physicModel: PhysicModelInterface;
  atomsFactory: (
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
  ) => AtomInterface[];
  drawer: DrawerInterface;
};

export interface SimulationInterface {
  readonly config: SimulationConfig;
  readonly atoms: AtomInterface[];
  readonly links: LinkManagerInterface;
  readonly summary: WorldSummary<number[]>;
  readonly isPaused: boolean;
  start(): void;
  stop(onStop?: () => void): Promise<void>;
  step(): void;
  togglePause(): void;
  refill(): void;
  clear(): void;
  setPhysicModel(model: PhysicModelInterface): void;
  exportState(): Promise<Record<string, unknown>>;
  importState(state: Record<string, unknown>): Promise<void>;
  exportCompounds(): Compound[];
}
