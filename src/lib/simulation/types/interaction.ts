import type { AtomInterface, LinkInterface } from './atomic';
import type { TypesConfig, WorldConfig } from '../../config/types';
import type { GeometryHelperInterface } from './utils';

export interface InteractionManagerInterface {
  handleTime(): void;
  moveAtom(atom: AtomInterface): void;
  interactLink(link: LinkInterface): void;
  interactAtomsStep1(atom: AtomInterface, neighbour: AtomInterface): void;
  interactAtomsStep2(atom: AtomInterface, neighbour: AtomInterface): void;
  setPhysicModel(model: PhysicModelInterface): void;
  clearDistanceFactor(atom: AtomInterface): void;
  clearElasticFactor(atom: AtomInterface): void;
  getDistanceFactor(lhs: AtomInterface, rhs: AtomInterface): number;
  updateDistanceFactor(lhs: AtomInterface, rhs: AtomInterface): void;
  updateAtomType(atom: AtomInterface): void;
}

export interface PhysicModelInterface {
  readonly geometry: GeometryHelperInterface;
  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number;
  getLinkForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number, elasticFactor: number): number;
  getBoundsForce(dist: number): number;
}

export type PhysicModelConstructor ={ new (worldConfig: WorldConfig, typesConfig: TypesConfig): PhysicModelInterface };
