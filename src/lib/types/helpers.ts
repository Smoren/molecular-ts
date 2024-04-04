import type { AtomInterface, LinkInterface } from './atomic';

export interface LinksPoolInterface {
  allocate(lhs: AtomInterface, rhs: AtomInterface): LinkInterface;
  free(link: LinkInterface): void;
}

export interface LinkManagerInterface extends Iterable<LinkInterface> {
  create(lhs: AtomInterface, rhs: AtomInterface): LinkInterface;
  delete(link: LinkInterface): void;
  clear(): void;
  has(link: LinkInterface): boolean;
}

export interface RulesHelperInterface {
  canLink(lhs: AtomInterface, rhs: AtomInterface): boolean;
  isLinkRedundant(lhs: AtomInterface, rhs: AtomInterface): boolean;
}

export interface GeometryHelperInterface {
  getAtomRadius(atom: AtomInterface): number;
  getAtomsRadiusSum(lhs: AtomInterface, rhs: AtomInterface): number;
  getMassMultiplier(lhs: AtomInterface, rhs: AtomInterface): number;
}
