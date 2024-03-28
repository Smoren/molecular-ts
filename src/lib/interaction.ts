import type { WorldConfig, TypesConfig } from './types/config';
import type { LinkManagerInterface, RulesHelperInterface } from './types/helpers';
import type { AtomInterface, LinkInterface } from './types/atomic';
import type { NumericVector, VectorInterface } from './vector/types';
import type { InteractionManagerInterface } from './types/interaction';
import type { PhysicModelInterface } from "./types/interaction";
import { toVector } from './vector';

export class InteractionManager implements InteractionManagerInterface {
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly linkManager: LinkManagerInterface;
  private readonly ruleHelper: RulesHelperInterface;
  private physicModel: PhysicModelInterface;
  private time: number;

  constructor(
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    linkManager: LinkManagerInterface,
    physicModel: PhysicModelInterface,
    ruleHelper: RulesHelperInterface,
  ) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.linkManager = linkManager;
    this.physicModel = physicModel;
    this.ruleHelper = ruleHelper;
    this.time = 0;
  }

  handleTime(): void {
    this.time++;

    if (this.time % 100 === 0) {
      console.log('time', this.time, 0.5 - Math.cos(this.time / 100) / 2);
    }
  }

  moveAtom(atom: AtomInterface): void {
    // применяем температуру
    this.handleTemperature(atom);

    // применяем скорость
    atom.position.add(atom.speed);

    // применяем инертность среды
    atom.speed.mul(this.WORLD_CONFIG.INERTIAL_MULTIPLIER);

    // применяем отталкивание от границ
    this.handleBounds(atom);
  }

  interactLink(link: LinkInterface): void {
    const distVector = toVector(this.getDistVector(link.lhs, link.rhs));
    const dist2 = this.getDist2(distVector);

    if (
      dist2 >= (this.WORLD_CONFIG.MAX_LINK_RADIUS * link.lhs.linkDistanceFactor * link.rhs.linkDistanceFactor) ** 2
      || this.ruleHelper.isLinkRedundant(link.lhs, link.rhs)
    ) {
      this.linkManager.delete(link);
    }

    if (dist2 > this.ruleHelper.getAtomsRadiusSum(link.lhs, link.rhs)) {
      this.handleLinkInfluence(link.lhs, link.rhs, dist2, distVector);
      this.handleLinkInfluence(link.rhs, link.rhs, dist2, distVector.inverse());
    }
  }

  interactAtomsStep1(lhs: AtomInterface, rhs: AtomInterface): void {
    if (lhs === rhs) {
      return;
    }

    const distVector = this.getDistVector(lhs, rhs);
    const dist2 = this.getDist2(distVector);

    if (dist2 <= this.WORLD_CONFIG.MAX_LINK_RADIUS ** 2) {
      lhs.linkDistanceFactor *= this.TYPES_CONFIG.LINK_FACTOR_DISTANCE[rhs.type][lhs.type];
    }
  }

  interactAtomsStep2(lhs: AtomInterface, rhs: AtomInterface): void {
    if (lhs === rhs) {
      return;
    }

    const distVector = this.getDistVector(lhs, rhs);
    const dist2 = this.getDist2(distVector);

    if (dist2 > this.WORLD_CONFIG.MAX_INTERACTION_RADIUS ** 2) {
      return;
    }

    const dist = Math.sqrt(dist2);
    const gravityForce = this.physicModel.getGravityForce(lhs, rhs, dist2);
    for (let i=0; i<distVector.length; ++i) {
      distVector[i] = distVector[i] / dist * gravityForce;
    }
    lhs.speed.add(distVector);

    if (
      !lhs.bonds.has(rhs) &&
      this.ruleHelper.canLink(lhs, rhs) &&
      dist2 <= (this.WORLD_CONFIG.MAX_LINK_RADIUS * lhs.linkDistanceFactor) ** 2
    ) {
      this.linkManager.create(lhs, rhs);
    }
  }

  setPhysicModel(model: PhysicModelInterface): void {
    this.physicModel = model;
  }

  private handleBounds(atom: AtomInterface): void {
    for (let i = 0; i < atom.position.length; ++i) {
      if (atom.position[i] < this.WORLD_CONFIG.MIN_POSITION[i]) {
        atom.speed[i] += 1;
      } else if (atom.position[i] > this.WORLD_CONFIG.MAX_POSITION[i]) {
        atom.speed[i] -= 1;
      }
    }
  }

  private handleTemperature(atom: AtomInterface): void {
    const func = this.WORLD_CONFIG.TEMPERATURE_FUNCTION;
    const mult = this.WORLD_CONFIG.TEMPERATURE_MULTIPLIER;
    const v = atom.speed
      .clone()
      .random()
      .normalize()
      .mul(mult * func(atom.position, this.time));
    atom.speed.add(v);
  }

  private handleLinkInfluence(
    lhs: AtomInterface,
    rhs: AtomInterface,
    dist2: number,
    distVector: VectorInterface,
  ): void {
    lhs.speed.add(
      distVector.normalize().mul(this.physicModel.getLinkForce(lhs, rhs, dist2)),
    );
  }

  private getDist2(distVector: NumericVector): number {
    let dist = 0;
    for (let i = 0; i < distVector.length; ++i) {
      dist += distVector[i] ** 2;
    }
    return dist < 1 ? 1 : dist;
  }

  private getDistVector(lhs: AtomInterface, rhs: AtomInterface): NumericVector {
    const distVector: number[] = new Array(lhs.position.length) as number[];
    for (let i = 0; i < lhs.position.length; ++i) {
      distVector[i] = rhs.position[i] - lhs.position[i];
    }
    return distVector;
  }
}
