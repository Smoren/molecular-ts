import type { TypesConfig, WorldConfig } from '../config/types';
import type { AtomInterface } from '../simulation/types/atomic';
import type { PhysicModelInterface } from '../simulation/types/interaction';
import { GeometryHelper } from '../utils/structs';

export class PhysicModelV2 implements PhysicModelInterface {
  public readonly geometry: GeometryHelper;
  private WORLD_CONFIG: WorldConfig;
  private TYPES_CONFIG: TypesConfig;
  private BOUNCE_CORRECTION_FACTOR: number = 0.01;

  constructor(worldConfig: WorldConfig, typesConfig: TypesConfig) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.geometry = new GeometryHelper(this.WORLD_CONFIG, this.TYPES_CONFIG);
  }

  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number {
    let multiplier: number;

    const bounceDistance = this.geometry.getAtomsRadiusSum(lhs, rhs);
    let bounceForce = 0;

    if (dist2 < bounceDistance ** 2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER * this.BOUNCE_CORRECTION_FACTOR;
      bounceForce = (bounceDistance - Math.sqrt(dist2)) * multiplier;
    }

    if (!lhs.bonds.has(rhs)) {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.GRAVITY[lhs.type][rhs.type];
    } else {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.LINK_GRAVITY[lhs.type][rhs.type];
    }

    const gravityForce = multiplier / dist2;

    return (gravityForce + bounceForce) * this.geometry.getMassMultiplier(lhs, rhs);
  }

  getLinkForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number, elasticFactor: number): number {
    const bounceDistance = this.geometry.getAtomsRadiusSum(lhs, rhs);
    const factor = (dist2 < bounceDistance ** 2)
      ? 1 - (bounceDistance - Math.sqrt(dist2)) / bounceDistance
      : elasticFactor;

    return factor * this.WORLD_CONFIG.LINK_FORCE_MULTIPLIER * this.geometry.getMassMultiplier(lhs, rhs);
  }

  getBoundsForce(dist: number): number {
    return this.WORLD_CONFIG.BOUNDS_FORCE_MULTIPLIER * dist;
  }
}
