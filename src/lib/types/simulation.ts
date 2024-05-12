import type { InitialConfig, TypesConfig, WorldConfig, ViewMode } from './config';
import type { AtomInterface } from './atomic';
import type { DrawerInterface } from './drawer';
import type { PhysicModelInterface } from './interaction';
import type { Summary, Compound } from './analysis';
import type { LinkManagerInterface } from '@/lib/types/helpers';

export type SimulationConfig = {
  viewMode: ViewMode;
  worldConfig: WorldConfig;
  typesConfig: TypesConfig;
  initialConfig: InitialConfig;
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
  readonly summary: Summary<number[]>;
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
