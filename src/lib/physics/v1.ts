import type { TypesConfig, WorldConfig } from '../types/config';
import type { AtomInterface } from '../types/atomic';
import type { PhysicModelInterface } from '../types/interaction';
import { GeometryHelper } from '../utils/structs';

export class PhysicModelV1 implements PhysicModelInterface {
  public readonly geometry: GeometryHelper;
  private WORLD_CONFIG: WorldConfig;
  private TYPES_CONFIG: TypesConfig;

  constructor(worldConfig: WorldConfig, typesConfig: TypesConfig) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.geometry = new GeometryHelper(this.WORLD_CONFIG, this.TYPES_CONFIG);
  }

  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number {
    let multiplier: number;

    if (dist2 < this.geometry.getAtomsRadiusSum(lhs, rhs) ** 2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER;
    } else if (!lhs.bonds.has(rhs)) {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.GRAVITY[lhs.type][rhs.type];
    } else {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.LINK_GRAVITY[lhs.type][rhs.type];
    }

    return multiplier * this.geometry.getMassMultiplier(lhs, rhs) / dist2;
  }

  getLinkForce(lhs: AtomInterface, rhs: AtomInterface): number {
    return this.WORLD_CONFIG.LINK_FORCE_MULTIPLIER * this.geometry.getMassMultiplier(lhs, rhs);
  }

  getBoundsForce(dist: number): number {
    return this.WORLD_CONFIG.BOUNDS_FORCE_MULTIPLIER * dist;
  }
}
