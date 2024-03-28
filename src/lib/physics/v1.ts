import type { TypesConfig, WorldConfig } from "../types/config";
import type { AtomInterface } from "../types/atomic";
import type { PhysicModelInterface } from "../types/interaction";

export class PhysicModelV1 implements PhysicModelInterface {
  private WORLD_CONFIG: WorldConfig;
  private TYPES_CONFIG: TypesConfig;

  constructor(worldConfig: WorldConfig, typesConfig: TypesConfig) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
  }

  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number {
    // console.log('v1');
    let multiplier: number;

    if (dist2 < (this.WORLD_CONFIG.ATOM_RADIUS * 2) ** 2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER;
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
