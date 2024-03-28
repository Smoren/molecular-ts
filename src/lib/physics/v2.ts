import type { TypesConfig, WorldConfig } from "../types/config";
import type { AtomInterface } from "../types/atomic";
import type { PhysicModelInterface } from "../types/interaction";

export class PhysicModelV2 implements PhysicModelInterface {
  private WORLD_CONFIG: WorldConfig;
  private TYPES_CONFIG: TypesConfig;
  private BOUNCE_CORRECTION_FACTOR: number = 0.01;

  constructor(worldConfig: WorldConfig, typesConfig: TypesConfig) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
  }

  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number {
    let multiplier: number;

    const bounceDistance = this.WORLD_CONFIG.ATOM_RADIUS * 2;
    let bounceForce = 0;
    let gravityForce = 0;

    if (dist2 < bounceDistance ** 2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER * this.BOUNCE_CORRECTION_FACTOR;
      bounceForce = (bounceDistance - Math.sqrt(dist2)) * multiplier;
    }

    if (dist2 > (bounceDistance / 2) ** 2) {
      if (!lhs.bonds.has(rhs)) {
        multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.GRAVITY[lhs.type][rhs.type];
      } else {
        multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.LINK_GRAVITY[lhs.type][rhs.type];
      }

      gravityForce = multiplier / dist2 + bounceForce;
    }

    return gravityForce + bounceForce;
  }

  getLinkForce(): number {
    return this.WORLD_CONFIG.LINK_FORCE_MULTIPLIER;
  }

  getBoundsForce(): number {
    return 1;
  }
}
