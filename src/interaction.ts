import { AtomInterface, CommonConfig, TypesConfig } from './types';
import { VectorInterface } from './vector/types';

export class LinkManager {
  readonly map: Map<string, [AtomInterface, AtomInterface]>;
  private readonly config: TypesConfig;

  constructor(config: TypesConfig) {
    this.config = config;
    this.map = new Map();
  }

  public addLink(lhs: AtomInterface, rhs: AtomInterface): void {
    lhs.links.set(rhs.id, rhs);
    rhs.links.set(lhs.id, lhs);
    this.map.set(this.getId(lhs, rhs), [lhs, rhs]);
  }

  public removeLink(lhs: AtomInterface, rhs: AtomInterface): void {
    lhs.links.delete(rhs.id);
    rhs.links.delete(lhs.id);
    this.map.delete(this.getId(lhs, rhs));
  }

  public hasLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return !!lhs.links.get(rhs.id);
  }

  public canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return this._canLink(lhs, rhs) && this._canLink(rhs, lhs);
  }

  protected _canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    const rule = this.config[lhs.type];
    const maxLinksCount = rule.maxLinksCount;
    const maxTypeLinksCount = rule.interactions[rhs.type].linksCount;
    const linksCount = lhs.links.countType(rhs.type);

    return linksCount < Math.min(maxLinksCount, maxTypeLinksCount);
  }

  protected getId(lhs: AtomInterface, rhs: AtomInterface): string {
    return `${Math.min(lhs.id, rhs.id)}-${Math.max(lhs.id, rhs.id)}`;
  }
}

export class InteractionManager {
  private readonly commonConfig: CommonConfig;
  private readonly typesConfig: TypesConfig;
  private readonly linkManager: LinkManager;

  constructor(
    commonConfig: CommonConfig,
    typesConfig: TypesConfig,
    linkManager: LinkManager,
  ) {
    this.commonConfig = commonConfig;
    this.typesConfig = typesConfig;
    this.linkManager = linkManager;
  }

  interact(atom: AtomInterface, neighbours: AtomInterface[]): void {
    if (atom.position[0] < this.commonConfig.bounds[0]) {
      atom.speed.add([1, 0]);
    } else if (atom.position[0] > this.commonConfig.bounds[2]) {
      atom.speed.add([-1, 0]);
    }
    if (atom.position[1] < this.commonConfig.bounds[1]) {
      atom.speed.add([0, 1]);
    } else if (atom.position[1] > this.commonConfig.bounds[3]) {
      atom.speed.add([0, -1]);
    }

    for (const neighbour of neighbours) {
      if (atom === neighbour) {
        continue;
      }

      // расстояние между атомами
      const distVector = neighbour.position.clone().sub(atom.position);
      const dist = distVector.abs;
      const hasLink = this.handleLink(atom, neighbour, dist);

      // если атомы соприкасаются
      if (dist < this.commonConfig.atomRadius*2) {
        this.handleBounce(atom, dist, distVector);
        continue;
      }

      // когда есть связь
      if (hasLink) {
        this.handleLinkGravity(atom, dist, distVector);
        continue;
      }

      // если расстояние между атомами слишком большое для взаимодействия
      if (dist > this.commonConfig.interactionRadius) {
        continue;
      }

      const interactionMode = this.typesConfig[atom.type].interactions[neighbour.type].mode;
      if (interactionMode === 1) {
        this.handleGravity(atom, dist, distVector);
      } else if (interactionMode === -1) {
        this.handleAntiGravity(atom, dist, distVector);
      }
    }
  }

  protected handleGravity(atom: AtomInterface, dist: number, distVector: VectorInterface): void {
    atom.speed.add(distVector.normalize().mul(this.commonConfig.gravConst / dist**2));
  }

  protected handleLinkGravity(atom: AtomInterface, dist: number, distVector: VectorInterface): void {
    atom.speed.div(this.commonConfig.bounceDivConst).add(distVector.normalize().mul(this.commonConfig.gravLinkConst));
    // atom.speed.add(distVector.normalize().mul(this.commonConfig.gravLinkConst));
  }

  protected handleAntiGravity(atom: AtomInterface, dist: number, distVector: VectorInterface): void {
    atom.speed.add(distVector.normalize().inverse().mul(this.commonConfig.gravConst / dist**2));
  }

  protected handleBounce(atom: AtomInterface, dist: number, distVector: VectorInterface): void {
    // atom.speed.div(this.commonConfig.bounceDivConst).add(
    //   distVector.normalize()
    //     .inverse()
    //     .mul(this.commonConfig.bounceAddConst * (this.commonConfig.atomRadius * 2 - dist)),
    // );
    atom.speed.add(
      distVector.normalize()
        .inverse()
        .mul(this.commonConfig.bounceAddConst * (this.commonConfig.atomRadius * 2 - dist)),
    );
  }

  protected handleLink(lhs: AtomInterface, rhs: AtomInterface, dist: number): boolean {
    const hasLink = this.linkManager.hasLink(lhs, rhs);

    if (hasLink && dist >= this.commonConfig.unlinkRadius) {
      this.linkManager.removeLink(lhs, rhs);
      return false;
    }

    if (!hasLink && dist <= this.commonConfig.linkRadius && this.linkManager.canLink(lhs, rhs)) {
      this.linkManager.addLink(lhs, rhs);
      return true;
    }

    return hasLink;
  }
}
