import type { DrawerInterface, EventManagerInterface } from './types';

export class DrawerDummy implements DrawerInterface {
  public draw(): void {
    return;
  }

  public clear(): void {
    return;
  }

  public get eventManager(): EventManagerInterface | undefined {
    return undefined;
  }
}

export function createDummyDrawer() {
  return new DrawerDummy();
}
