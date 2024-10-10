import type { NumericVector } from '../math/types';
import type { AtomInterface } from './atomic';
import type { LinkManagerInterface } from './utils';
import type { TypesConfig, WorldConfig } from './config';

export interface ViewConfigInterface {
  offset: NumericVector;
  scale: NumericVector;
}

export type MouseEventData = {
  coords: NumericVector;
  extraKey: number | undefined;
  ctrlKey: boolean;
}

export type MouseEventListenerCallback = (event: MouseEventData) => void;

export interface DrawerInterface {
  readonly eventManager?: EventManagerInterface;
  draw(atoms: Array<AtomInterface>, links: LinkManagerInterface): void;
  clear(): void;
}

export interface EventManagerInterface {
  onClick(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseDown(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseMove(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseGrab(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseUp(callback: MouseEventListenerCallback): EventManagerInterface;

  triggerClick(event: MouseEventData): void;
  triggerMouseDown(event: MouseEventData): void;
  triggerMouseMove(event: MouseEventData): void;
  triggerMouseGrab(event: MouseEventData): void;
  triggerMouseUp(event: MouseEventData): void;
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
