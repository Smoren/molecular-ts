import type { DrawerInterface, EventManagerInterface } from '../types/drawer';

export class DrawerDummy implements DrawerInterface {
  public draw(): void {
    return;
  }

  public clear(): void {
    return;
  }

  public get eventManager(): EventManagerInterface {
    throw new Error('Not implemented');
  }
}

export function createDummyDrawer() {
  return new DrawerDummy();
}
