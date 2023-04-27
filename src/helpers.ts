import { LinksPoolInterface, LinkManagerInterface, RulesHelperInterface } from './types/helpers';
import { AtomInterface, LinkInterface } from './types/atomic';
import { Atom, Link } from './atomic';
import { Swarm } from './structs/swarm';
import { NumericVector } from './vector/types';
import { TypesConfig, WorldConfig } from './types/config';

class LinkPool implements LinksPoolInterface {
  private storage: LinkInterface[] = [];

  allocate(id: number, lhs: AtomInterface, rhs: AtomInterface): LinkInterface {
    if (this.storage.length) {
      const result = this.storage.pop();
      result.id = id;
      result.lhs = lhs;
      result.rhs = rhs;
      return result;
    }
    return new Link(id, lhs, rhs);
  }

  free(link: LinkInterface): void {
    this.storage.push(link);
  }
}

export class LinkManager implements LinkManagerInterface {
  private storage: Swarm<LinkInterface> = new Swarm();
  private pool: LinksPoolInterface = new LinkPool();

  create(lhs: AtomInterface, rhs: AtomInterface): LinkInterface {
    const link = this.pool.allocate(this.storage.nextKey, lhs, rhs);
    lhs.bonds.add(rhs);
    rhs.bonds.add(lhs);
    this.storage.push(link);
    return link;
  }

  delete(link: LinkInterface): void {
    link.lhs.bonds.delete(link.rhs);
    link.rhs.bonds.delete(link.lhs);
    this.storage.pop(link.id);
    this.pool.free(link);
  }

  clear(): void {
    this.storage.clear();
  }

  has(link: LinkInterface): boolean {
    return this.storage.has(link.id);
  }

  * [Symbol.iterator](): Iterator<LinkInterface> {
    for (const item of this.storage) {
      yield item;
    }
  }
}

export class RulesHelper implements RulesHelperInterface {
  private TYPES_CONFIG: TypesConfig;
  private WORLD_CONFIG: WorldConfig;

  constructor(typesConfig: TypesConfig, worldConfig: WorldConfig) {
    this.TYPES_CONFIG = typesConfig;
    this.WORLD_CONFIG = worldConfig;
  }

  canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return this._canLink(lhs, rhs) && this._canLink(rhs, lhs);
  }

  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number {
    let multiplier: number;

    if (dist2 < this.getAtomsRadiusSum()**2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER;
    } else if (!lhs.bonds.has(rhs)) {
      multiplier = -this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER;
    } else {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.GRAVITY[lhs.type][rhs.type];
    }

    return multiplier * this.WORLD_CONFIG.SPEED / dist2;
  }

  getLinkForce(): number {
    return this.WORLD_CONFIG.LINK_FORCE_MULTIPLIER * this.WORLD_CONFIG.SPEED;
  }

  getAtomsRadiusSum(): number {
    return this.WORLD_CONFIG.ATOM_RADIUS*2;
  }

  private _canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    if (lhs.bonds.length >= this.TYPES_CONFIG.LINKS[lhs.type]) {
      return false;
    }
    return lhs.bonds.lengthOf(rhs.type) < this.TYPES_CONFIG.TYPE_LINKS[lhs.type][rhs.type];
  }
}

let LAST_ATOM_ID = 0;

export function createAtom(type: number, position: NumericVector) {
  return new Atom(LAST_ATOM_ID++, type, position);
}
