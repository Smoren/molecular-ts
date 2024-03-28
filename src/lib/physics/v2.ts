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

    if (dist2 < bounceDistance ** 2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER * this.BOUNCE_CORRECTION_FACTOR;
      return (bounceDistance - Math.sqrt(dist2)) * multiplier * this.WORLD_CONFIG.SPEED;
    } else if (!lhs.bonds.has(rhs)) {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.GRAVITY[lhs.type][rhs.type];
    } else {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.LINK_GRAVITY[lhs.type][rhs.type];
    }

    const result = multiplier * this.WORLD_CONFIG.SPEED / dist2;

    if (Math.abs(result) > this.WORLD_CONFIG.MAX_FORCE) {
      return Math.sign(result) * this.WORLD_CONFIG.MAX_FORCE;
    }

    return result;
  }

  getLinkForce(): number {
    const result = Math.min(this.WORLD_CONFIG.LINK_FORCE_MULTIPLIER * this.WORLD_CONFIG.SPEED);

    if (Math.abs(result) > this.WORLD_CONFIG.MAX_FORCE) {
      return Math.sign(result) * this.WORLD_CONFIG.MAX_FORCE;
    }

    return result;
  }
}
