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

  moveAtom(atom: AtomInterface): void {
    // применяем скорость
    atom.position.add(atom.speed);

    // применяем инертность среды
    atom.speed.mul(this.commonConfig.inertialMultiplier);

    // применяем отталкивание от границ
    this.handleBounds(atom);
  }

  interactLink([lhs, rhs]: Link): void {
    const distVector = this.getDistVector(lhs, rhs);
    const dist = this.getDist(distVector);

    if (dist >= this.commonConfig.maxUnlinkRadius) {
      this.linkManager.removeLink(lhs, rhs);
    }

    if (dist > this.commonConfig.atomRadius*2) {
      this.handleLinkInfluence(lhs, dist, distVector);
      this.handleLinkInfluence(rhs, dist, distVector.inverse());
    }
  }

  interactAtom(atom: AtomInterface, neighbours: AtomInterface[]): void {
    for (const neighbour of neighbours) {
      if (atom === neighbour) {
        continue;
      }

      const distVector = this.getDistVector(atom, neighbour);
      const dist = this.getDist(distVector);

      if (dist > this.commonConfig.maxInteractionRadius) {
        continue;
      }

      if (dist < this.commonConfig.atomRadius * 2) {
        // отталкиваются, когда расстояние меньше двух радиусов (соприкасаются)
        atom.speed.add(distVector.normalize().mul(-this.commonConfig.speed / dist ** 2));
      } else if (!this.linkManager.hasLink(atom, neighbour)) {
        // отталкиваются, когда между ними нет связи ???
        atom.speed.add(distVector.normalize().mul(-this.commonConfig.speed / dist ** 2));
      } else {
        atom.speed.add(distVector.normalize().mul(
          this.typesConfig[atom.type].interactions[neighbour.type].mode * this.commonConfig.speed / dist ** 2,
        ));
      }

      if (this.linkManager.hasLink(atom, neighbour)) {
        continue;
      }

      if (
        atom.links.size < this.typesConfig[atom.type].maxLinksCount &&
        neighbour.links.size < this.typesConfig[neighbour.type].maxLinksCount
      ) {
        if (
          atom.links.countType(neighbour.type) < this.typesConfig[atom.type].interactions[neighbour.type].linksCount &&
          neighbour.links.countType(atom.type) < this.typesConfig[neighbour.type].interactions[atom.type].linksCount
        ) {
          this.linkManager.addLink(atom, neighbour);
        }
      }
    }
  }

  protected handleBounds(atom: AtomInterface) {
    for (let i = 0; i < atom.position.length; ++i) {
      if (atom.position[i] < 0) {
        atom.speed[i] += 1;
      }
      if (atom.position[i] > this.commonConfig.maxPosition[i]) {
        atom.speed[i] -= 1;
      }
    }
  }

  protected handleLinkInfluence(atom: AtomInterface, dist: number, distVector: VectorInterface): void {
    atom.speed.add(
      distVector.normalize().mul(this.commonConfig.linkForce * this.commonConfig.speed),
    );
  }

  protected getDist(distVector: VectorInterface): number {
    const dist = distVector.abs;
    return dist < 1 ? 1 : dist;
  }

  protected getDistVector(lhs: AtomInterface, rhs: AtomInterface): VectorInterface {
    return rhs.position.clone().sub(lhs.position);
  }
}
