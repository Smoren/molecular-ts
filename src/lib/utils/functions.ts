import type { AtomInterface } from '../types/atomic';
import type { NumericVector } from '../math/types';
import type {
  LinkFactorDistanceExtendedConfig,
  PhysicModelName,
  ViewModeConfig,
  WorldConfig,
  TypesConfig,
  ViewMode,
} from '../types/config';
import type { PhysicModelConstructor, PhysicModelInterface } from '../types/interaction';
import { Atom } from '../atomic';
import { PhysicModelV1 } from '../physics/v1';
import { PhysicModelV2 } from '../physics/v2';

export const fullCopyObject = <T extends Record<string, any>>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

let LAST_ATOM_ID = 0;

function nextId(id?: number): number {
  if (id !== undefined) {
    LAST_ATOM_ID = Math.max(id, LAST_ATOM_ID);
    return id;
  }

  return LAST_ATOM_ID++;
}

export function createAtom(type: number, position: NumericVector, speed?: NumericVector, id?: number): AtomInterface {
  return new Atom(nextId(id), type, position, speed);
}

function getRandomColorNumber(): number {
  return Math.round(Math.random()*255);
}

export function getRandomColor(): [number, number, number] {
  let r = getRandomColorNumber();
  let g = getRandomColorNumber();
  let b = getRandomColorNumber();
  const sum = r + g + b;
  if (sum < 256*3 / 2) {
    const delta = Math.round((256*3 / 2 - sum) / (Math.random() + 1));
    [r, g, b] = [r+delta, g+delta, b+delta];
  }
  return [r, g, b];
}

export function createPhysicModel(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
): PhysicModelInterface {
  if (worldConfig.PHYSIC_MODEL === undefined) {
    return new PhysicModelV1(worldConfig, typesConfig);
  }

  const map: Record<PhysicModelName, PhysicModelConstructor> = {
    v1: PhysicModelV1,
    v2: PhysicModelV2,
  };

  return new map[worldConfig.PHYSIC_MODEL](worldConfig, typesConfig);
}

export function getViewModeConfig(worldConfig: WorldConfig, viewMode?: ViewMode): ViewModeConfig {
  return (viewMode ?? worldConfig.VIEW_MODE) === '3d'
    ? worldConfig.CONFIG_3D
    : worldConfig.CONFIG_2D;
}
