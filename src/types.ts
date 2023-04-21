import { Vector } from './vector';
import { reduce, single } from 'itertools-ts';

export type InteractionMode = 0 | -1 | 1;

export type InteractionRule = {
  readonly mode: InteractionMode;
  readonly type: number;
  readonly count: number;
};

export type AtomTypeRule = {
  readonly interactions: Record<number, InteractionRule>;
  readonly maxLinksCount: number;
};

export type RulesConfig = Record<number, AtomTypeRule>;

export class LinkMap extends Map<number, Atom> {
  countType(type: number): number {
    return reduce.toCount(single.filter(this.values(), (atom) => atom.type === type));
  }
}

export interface Atom {
  readonly id: number;
  readonly type: number;
  position: Vector;
  speed: Vector;
  readonly links: LinkMap;
}
