import type { NumericVector, VectorInterface } from '../math/types';
import type { AtomInterface } from './atomic';
import type { LinkManagerInterface } from './utils';
import type { TypesConfig, WorldConfig } from './config';

export interface ViewConfigInterface {
  offset: NumericVector;
  scale: NumericVector;
}

export type MouseClickListenerCallback = (coords: VectorInterface, extraKey: number | null) => void;

export interface DrawerInterface {
  draw(atoms: Array<AtomInterface>, links: LinkManagerInterface): void;
  clear(): void;
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
