import { AtomInterface, CommonConfig, Link, TypesConfig } from './types';
import { VectorInterface } from './vector/types';

export class LinkManager {
  readonly map: Map<string, Link>;
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

  interactLink([lhs, rhs]: Link): void {
    const distVector = this.getDistVector(rhs, lhs);
    const dist = this.getDist(distVector);

    if (this.linkManager.hasLink(lhs, rhs) && dist >= this.commonConfig.unlinkRadius) {
      this.linkManager.removeLink(lhs, rhs);
    }

    this.handleLinkInfluence(lhs, dist, distVector);
    this.handleLinkInfluence(rhs, dist, distVector.inverse());
  }

  interactAtom(atom: AtomInterface, neighbours: AtomInterface[]): void {
    this.handleBounds(atom);
    atom.speed.mul(0.9);

    for (const neighbour of neighbours) {
      // исключим взаимодействие атома с самим собой
      if (atom === neighbour) {
        continue;
      }

      // расстояние между атомами
      const distVector = this.getDistVector(neighbour, atom);
      const dist = this.getDist(distVector);

      // если расстояние между атомами слишком большое для взаимодействия
      if (dist > this.commonConfig.interactionRadius) {
        continue;
      }

      const hasLink = this.handleLinking(atom, neighbour, dist);

      // если атомы соприкасаются
      if (dist < this.commonConfig.atomRadius*2) {
        this.handleGravity(atom, dist, distVector, -1);
        continue;
      }

      if (hasLink) {
        const interactionMode = this.typesConfig[atom.type].interactions[neighbour.type].mode;
        if (interactionMode !== 0) {
          this.handleGravity(atom, dist, distVector, interactionMode);
        }
      } else {
        this.handleGravity(atom, dist, distVector, -1);
      }
    }
  }

  protected handleBounds(atom: AtomInterface) {
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
  }

  protected handleGravity(atom: AtomInterface, dist: number, distVector: VectorInterface, multiplier: number): void {
    atom.speed.add(distVector.normalize().mul(multiplier * this.commonConfig.gravConst / dist**2));
  }

  protected handleLinkInfluence(atom: AtomInterface, dist: number, distVector: VectorInterface): void {
    atom.speed.add(distVector.normalize().mul(this.commonConfig.gravLinkConst));
  }

  protected handleLinking(lhs: AtomInterface, rhs: AtomInterface, dist: number): boolean {
    const hasLink = this.linkManager.hasLink(lhs, rhs);

    if (!hasLink && dist <= this.commonConfig.linkRadius && this.linkManager.canLink(lhs, rhs)) {
      this.linkManager.addLink(lhs, rhs);
      return true;
    }

    return hasLink;
  }

  protected getDist(distVector: VectorInterface): number {
    const dist = distVector.abs;
    return dist < 1 ? 1 : dist;
  }

  protected getDistVector(lhs: AtomInterface, rhs: AtomInterface): VectorInterface {
    return lhs.position.clone().sub(rhs.position);
  }
}
