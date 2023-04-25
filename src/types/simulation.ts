import { InitialConfig, TypesConfig, WorldConfig } from './config';
import { AtomInterface } from './atomic';
import { DrawerInterface } from './drawer';

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
}
