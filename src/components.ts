import { TypesConfig, WorldConfig } from './types/config';
import { LinkManagerInterface, RulesHelperInterface } from './types/helpers';
import { AtomInterface, LinkInterface } from './types/atomic';
import { VectorInterface } from './vector/types';

export class InteractionManager {
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly linkManager: LinkManagerInterface;
  private readonly ruleHelper: RulesHelperInterface;

  constructor(
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    linkManager: LinkManagerInterface,
    ruleHelper: RulesHelperInterface,
  ) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.linkManager = linkManager;
    this.ruleHelper = ruleHelper;
  }

  moveAtom(atom: AtomInterface): void {
    // применяем скорость
    atom.position.add(atom.speed);

    // применяем инертность среды
    atom.speed.mul(this.WORLD_CONFIG.INERTIAL_MULTIPLIER);

    // применяем отталкивание от границ
    this.handleBounds(atom);
  }

  interactLink(link: LinkInterface): void {
    const distVector = this.getDistVector(link.lhs, link.rhs);
    const dist2 = this.getDist2(distVector);

    if (dist2 >= this.WORLD_CONFIG.MAX_INTERACTION_RADIUS**2) {
      this.linkManager.delete(link);
    }

    if (dist2 > this.ruleHelper.getAtomsRadiusSum(link.lhs, link.rhs)) {
      this.handleLinkInfluence(link.lhs, link.rhs, dist2, distVector);
      this.handleLinkInfluence(link.rhs, link.rhs, dist2, distVector.inverse());
    }
  }

  interactAtom(atom: AtomInterface, neighbours: AtomInterface[]): void {
    for (const neighbour of neighbours) {
      if (atom === neighbour) {
        continue;
      }

      const distVector = this.getDistVector(atom, neighbour);
      const dist2 = this.getDist2(distVector);

      if (dist2 > this.WORLD_CONFIG.MAX_INTERACTION_RADIUS) {
        continue;
      }

      atom.speed.add(distVector.normalize().mul(this.ruleHelper.getGravityForce(atom, neighbour, dist2)));

      if (!atom.bonds.has(neighbour) && this.ruleHelper.canLink(atom, neighbour)) {
        this.linkManager.create(atom, neighbour);
      }
    }
  }

  private handleBounds(atom: AtomInterface): void {
    for (let i = 0; i < atom.position.length; ++i) {
      if (atom.position[i] < 0) {
        atom.speed[i] += 1;
      } else if (atom.position[i] > this.WORLD_CONFIG.MAX_POSITION[i]) {
        atom.speed[i] -= 1;
      }
    }
  }

  private handleLinkInfluence(
    lhs: AtomInterface,
    rhs: AtomInterface,
    dist2: number,
    distVector: VectorInterface,
  ): void {
    lhs.speed.add(
      distVector.normalize().mul(this.ruleHelper.getLinkForce(lhs, rhs, dist2)),
    );
  }

  private getDist2(distVector: VectorInterface): number {
    const dist = distVector.abs2;
    return dist < 1 ? 1 : dist;
  }

  private getDistVector(lhs: AtomInterface, rhs: AtomInterface): VectorInterface {
    return rhs.position.clone().sub(lhs.position);
  }
}
