import type { InitialConfig, TypesConfig, WorldConfig } from './config';
import type { AtomInterface } from './atomic';
import type { DrawerInterface } from './drawer';

export type SimulationConfig = {
  worldConfig: WorldConfig;
  typesConfig: TypesConfig;
  initialConfig: InitialConfig;
  atomsFactory: (
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    initialConfig: InitialConfig
  ) => AtomInterface[];
  drawer: DrawerInterface;
};

export interface SimulationInterface {
  start(): void;
  stop(): void;
  clear(): void;
}
