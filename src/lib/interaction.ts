import type { WorldConfig, TypesConfig, ViewMode } from './types/config';
import type { LinkManagerInterface, RulesHelperInterface } from './types/utils';
import type { AtomInterface, LinkInterface } from './types/atomic';
import type { NumericVector, VectorInterface } from './math/types';
import type { InteractionManagerInterface } from './types/interaction';
import type { PhysicModelInterface } from './types/interaction';
import { Vector } from './math';
import { getViewModeConfig } from './utils/functions';
import type { SummaryManagerInterface } from './types/analysis';

export class InteractionManager implements InteractionManagerInterface {
  private readonly VIEW_MODE: ViewMode;
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly linkManager: LinkManagerInterface;
  private readonly ruleHelper: RulesHelperInterface;
  private readonly summaryManager: SummaryManagerInterface;
  private physicModel: PhysicModelInterface;
  private time: number;
  private bufVector: VectorInterface = new Vector([0, 0]);

  constructor(
    viewMode: ViewMode,
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    linkManager: LinkManagerInterface,
    physicModel: PhysicModelInterface,
    ruleHelper: RulesHelperInterface,
    summaryManager: SummaryManagerInterface
  ) {
    this.VIEW_MODE = viewMode;
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.linkManager = linkManager;
    this.physicModel = physicModel;
    this.ruleHelper = ruleHelper;
    this.summaryManager = summaryManager;
    this.time = 0;
  }

  handleTime(): void {
    this.time++;
  }

  moveAtom(atom: AtomInterface): void {
    // Apply temperature
    this.handleTemperature(atom);

    // Apply speed
    atom.position.add(atom.speed);

    // Apply inertia
    atom.speed.mul(this.WORLD_CONFIG.INERTIAL_MULTIPLIER);

    // Apply bounce from boundaries
    this.handleBounds(atom);
  }

  interactLink(link: LinkInterface): void {
    const distVector = this.bufVector.set(this.getDistVector(link.lhs, link.rhs));
    const dist2 = this.getDist2(distVector);

    if (
      dist2 >= (this.WORLD_CONFIG.MAX_LINK_RADIUS * this.getDistanceFactor(link.lhs, link.rhs) * this.getDistanceFactor(link.rhs, link.lhs)) ** 2
      || this.ruleHelper.isLinkRedundant(link.lhs, link.rhs)
    ) {
      this.linkManager.delete(link);
      this.summaryManager.noticeLinkDeleted(link, this.WORLD_CONFIG);
    }

    if (dist2 > this.physicModel.geometry.getAtomsRadiusSum(link.lhs, link.rhs)) {
      this.handleLinkInfluence(link.lhs, link.rhs, dist2, distVector);
      this.handleLinkInfluence(link.rhs, link.lhs, dist2, distVector.inverse());
    }
  }

  interactAtomsStep1(lhs: AtomInterface, rhs: AtomInterface): void {
    if (lhs === rhs) {
      return;
    }

    const distVector = this.getDistVector(lhs, rhs);
    const dist2 = this.getDist2(distVector);

    if (dist2 <= this.WORLD_CONFIG.MAX_LINK_RADIUS ** 2) {
      this.updateDistanceFactor(lhs, rhs);
      this.updateElasticFactor(lhs, rhs);
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
    const force = this.normalizeForce(this.physicModel.getGravityForce(lhs, rhs, dist2));
    for (let i=0; i<distVector.length; ++i) {
      distVector[i] = distVector[i] / dist * force;
    }
    lhs.speed.add(distVector);

    if (
      !lhs.bonds.has(rhs) &&
      this.ruleHelper.canLink(lhs, rhs) &&
      dist2 <= (this.WORLD_CONFIG.MAX_LINK_RADIUS * this.getDistanceFactor(lhs, rhs) * this.getDistanceFactor(rhs, lhs)) ** 2
    ) {
      const link = this.linkManager.create(lhs, rhs);
      this.ruleHelper.handleTransform(lhs, rhs);
      this.summaryManager.noticeLinkCreated(link, this.WORLD_CONFIG);
    }
  }

  setPhysicModel(model: PhysicModelInterface): void {
    this.physicModel = model;
  }

  clearDistanceFactor(atom: AtomInterface): void {
    for (let i = 0; i < this.TYPES_CONFIG.FREQUENCIES.length; ++i) {
      atom.linkDistanceFactors[i] = 1;
    }
  }

  clearElasticFactor(atom: AtomInterface): void {
    for (let i = 0; i < this.TYPES_CONFIG.FREQUENCIES.length; ++i) {
      atom.linkElasticFactors[i] = 1;
    }
  }

  getDistanceFactor(lhs: AtomInterface, rhs: AtomInterface): number {
    return lhs.linkDistanceFactors[rhs.type];
  }

  getElasticFactor(lhs: AtomInterface, rhs: AtomInterface): number {
    return lhs.linkElasticFactors[rhs.type];
  }

  updateDistanceFactor(lhs: AtomInterface, rhs: AtomInterface): void {
    const mults = this.TYPES_CONFIG.LINK_FACTOR_DISTANCE[rhs.type][lhs.type];
    for (let i=0; i<mults.length; ++i) {
      lhs.linkDistanceFactors[i] *= mults[i];
    }
  }

  updateElasticFactor(lhs: AtomInterface, rhs: AtomInterface): void {
    const mults = this.TYPES_CONFIG.LINK_FACTOR_ELASTIC[rhs.type][lhs.type];
    for (let i=0; i<mults.length; ++i) {
      lhs.linkElasticFactors[i] *= mults[i];
    }
  }

  updateAtomType(atom: AtomInterface): void {
    if (!atom.isTypeChanged) {
      return;
    }

    const bondMap = atom.bonds.getStorage();
    for (const i in bondMap) {
      bondMap[i].bonds.update(atom);
    }

    atom.type = atom.newType as number;
    atom.newType = undefined;
  }

  private normalizeForce(value: number): number {
    if (Math.abs(value) > this.WORLD_CONFIG.MAX_FORCE) {
      return Math.sign(value) * this.WORLD_CONFIG.MAX_FORCE * this.WORLD_CONFIG.SPEED;
    }

    return value * this.WORLD_CONFIG.SPEED;
  }

  private handleBounds(atom: AtomInterface): void {
    const viewModeConfig = getViewModeConfig(this.WORLD_CONFIG, this.VIEW_MODE);
    for (let i = 0; i < atom.position.length; ++i) {
      if (atom.position[i] < viewModeConfig.BOUNDS.MIN_POSITION[i]) {
        atom.speed[i] += this.normalizeForce(
          this.physicModel.getBoundsForce(viewModeConfig.BOUNDS.MIN_POSITION[i] - atom.position[i])
        );
      } else if (atom.position[i] > viewModeConfig.BOUNDS.MAX_POSITION[i]) {
        atom.speed[i] -= this.normalizeForce(
          this.physicModel.getBoundsForce(atom.position[i] - viewModeConfig.BOUNDS.MAX_POSITION[i])
        );
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
    const elasticFactor = this.getElasticFactor(rhs, lhs); // TODO check!
    const force = this.physicModel.getLinkForce(lhs, rhs, dist2, elasticFactor);
    lhs.speed.add(distVector.normalize().mul(this.normalizeForce(force)));
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
