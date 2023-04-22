import { AtomInterface, LinkMap } from './types';
import { NumericVector } from './vector/types';
import { toVector, Vector } from './vector';

let lastId = 1;

export class Atom implements AtomInterface {
  readonly id: number;
  readonly type: number;
  position: Vector;
  speed: Vector;
  readonly links: LinkMap;

  constructor(
    type: number,
    position: NumericVector,
    speed: NumericVector,
  ) {
    this.id = lastId++;
    this.type = type;
    this.position = toVector(position);
    this.speed = toVector(speed);
    this.links = new LinkMap();
  }
}
