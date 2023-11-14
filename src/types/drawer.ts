import { NumericVector, VectorInterface } from '../vector/types';
import { AtomInterface } from './atomic';
import { LinkManagerInterface } from './helpers';
import { TypesConfig, WorldConfig } from './config';

export interface ViewConfigInterface {
  offset: NumericVector;
  scale: NumericVector;
}

export type MouseClickListenerCallback = (coords: VectorInterface, extraKey: number | null) => void;

export interface DrawerInterface {
  draw(atoms: Iterable<AtomInterface>, links: LinkManagerInterface): void;
  addClickListener(callback: MouseClickListenerCallback): void;
}

export interface Drawer2dConfigInterface {
  readonly domElement: HTMLCanvasElement;
  readonly viewConfig: ViewConfigInterface;
  readonly worldConfig: WorldConfig;
  readonly typesConfig: TypesConfig;
}

export interface Drawer3dConfigInterface {
  readonly domElement: HTMLCanvasElement;
  readonly worldConfig: WorldConfig;
  readonly typesConfig: TypesConfig;
}
