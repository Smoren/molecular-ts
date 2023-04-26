import { NumericVector } from '../vector/types';
import { AtomInterface } from './atomic';
import { LinkManagerInterface } from './helpers';
import { TypesConfig, WorldConfig } from './config';

export interface ViewConfigInterface {
  offset: NumericVector;
  scale: NumericVector;
}

export interface DrawerInterface {
  draw(atoms: Iterable<AtomInterface>, links: LinkManagerInterface): void;
  refresh(): void;
  clear(): void;
  initEventHandlers(
    getAtoms: () => Iterable<AtomInterface>,
    getLinks: () => LinkManagerInterface,
  ): void;
}

export interface DrawerConfigInterface {
  readonly domElement: HTMLCanvasElement;
  readonly viewConfig: ViewConfigInterface;
  readonly worldConfig: WorldConfig;
  readonly typesConfig: TypesConfig;
}
