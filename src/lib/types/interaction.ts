import type { AtomInterface, LinkInterface } from './atomic';
import type { TypesConfig, WorldConfig } from './config';

export interface InteractionManagerInterface {
  handleTime(): void;
  moveAtom(atom: AtomInterface): void;
  interactLink(link: LinkInterface): void;
  interactAtomsStep1(atom: AtomInterface, neighbour: AtomInterface): void;
  interactAtomsStep2(atom: AtomInterface, neighbour: AtomInterface): void;
  setPhysicModel(model: PhysicModelInterface): void;
}

export interface PhysicModelInterface {
  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number;
  getLinkForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number;
  getBoundsForce(dist: number): number;
}

export type PhysicModelConstructor ={ new (worldConfig: WorldConfig, typesConfig: TypesConfig): PhysicModelInterface };
