import { AtomInterface, LinkInterface } from './atomic';

export interface LinkAllocatorInterface {
  allocate(id: number, lhs: AtomInterface, rhs: AtomInterface): LinkInterface;
  free(link: LinkInterface): void;
}

export interface LinkManagerInterface extends Iterable<LinkInterface> {
  create(lhs: AtomInterface, rhs: AtomInterface): LinkInterface;
  delete(link: LinkInterface): void;
}

export interface RulesHelperInterface {
  canLink(lhs: AtomInterface, rhs: AtomInterface): boolean;
  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number;
  getLinkForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number;
  getAtomsRadiusSum(lhs: AtomInterface, rhs: AtomInterface): number;
}
