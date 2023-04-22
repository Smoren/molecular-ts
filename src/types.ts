import { Vector } from './vector';
import { reduce, single } from 'itertools-ts';
import { NumericVector } from './vector/types';

export type InteractionMode = 0 | -1 | 1;

export type InteractionRule = {
  readonly mode: InteractionMode;
  readonly linksCount: number;
};

export type AtomConfig = {
  readonly color: string;
  readonly interactions: Record<number, InteractionRule>;
  readonly maxLinksCount: number;
};

export type TypesConfig = Record<number, AtomConfig>;

export type CommonConfig = {
  readonly atomRadius: number;
  readonly interactionRadius: number;
  readonly linkRadius: number;
  readonly unlinkRadius: number;
  readonly gravConst: number;
  readonly gravLinkConst: number;
  readonly bounceAddConst: number;
  readonly bounceDivConst: number;
};

export class LinkMap extends Map<number, AtomInterface> {
  countType(type: number): number {
    return reduce.toCount(single.filter(this.values(), (atom) => atom.type === type));
  }
}

export interface AtomInterface {
  readonly id: number;
  readonly type: number;
  position: Vector;
  speed: Vector;
  readonly links: LinkMap;
}

export interface ViewConfigInterface {
  offset: NumericVector;
  scale: NumericVector;
}

export interface DrawerConfigInterface {
  readonly domElement: HTMLCanvasElement;
  readonly viewConfig: ViewConfigInterface;
  readonly commonConfig: CommonConfig;
  readonly typesConfig: TypesConfig;
}

export interface DrawableInterface {
  draw(context: CanvasRenderingContext2D): void;
}

export interface DrawerInterface {
  draw(atoms: Iterable<AtomInterface>, links: Map<string, [AtomInterface, AtomInterface]>): void;
  refresh(): void;
  clear(): void;
  // getBound(): BoundInterface;
  readonly viewConfig: ViewConfigInterface;
  readonly domElement: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
}
