import type { DrawerInterface } from '../types/drawer';

export class DrawerDummy implements DrawerInterface {
  public draw(): void {
    return;
  }

  public clear(): void {
    return;
  }

  public addClickListener(): void {
    return;
  }
}

export function createDummyDrawer() {
  return new DrawerDummy();
}
