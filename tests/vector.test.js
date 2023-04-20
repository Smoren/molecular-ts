import {createVector, PositionalVector} from '../src/canvas/structs/vector';
import {toArray} from "typedoc/dist/lib/utils/array";

test('vector', () => {
  {
    const v = createVector([2, 5]);

    v.add([-3, 1]).sub([1, 2]).mul(4).div(2).inverse();
    expect(v.toArray()).toEqual([4, -8]);

    expect(v.isEqual([4, -8])).toEqual(true);
    expect(v.isEqual([4, 8])).toEqual(false);

    expect(v.length).toEqual(Math.sqrt(80));

    v.reverse();
    expect(v.toArray()).toEqual([1/4, -1/8]);
  }
  {
    const v = createVector([2, 0]);

    expect(v.isNormalized()).toEqual(false);

    v.normalize();

    expect(v.isNormalized()).toEqual(true);
    expect(v.toArray()).toEqual([1, 0]);
  }
  {
    const v1 = createVector([2, 3]);
    const v2 = createVector([5, -9]);

    v1.mulCoords(v2);

    expect(v1.toArray()).toEqual([10, -27]);
  }

  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([0, 1]);

    expect(v1.hasOnRight(v2)).toEqual(false);
    expect(v2.hasOnLeft(v1)).toEqual(false);

    expect(v1.hasOnLeft(v2)).toEqual(false);
    expect(v2.hasOnRight(v1)).toEqual(false);

    expect(v1.hasSharpCornerWith(v2)).toEqual(true);
    expect(v2.hasSharpCornerWith(v1)).toEqual(true);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(false);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(false);

    expect(v1.isOrthogonal(v2)).toEqual(false);
    expect(v2.isOrthogonal(v1)).toEqual(false);

    expect(v1.isCollinear(v2)).toEqual(true);
    expect(v2.isCollinear(v1)).toEqual(true);

    expect(v2.isNormalized()).toEqual(true);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([1, 1]);

    expect(v1.hasOnRight(v2)).toEqual(true);
    expect(v2.hasOnLeft(v1)).toEqual(true);

    expect(v1.hasOnLeft(v2)).toEqual(false);
    expect(v2.hasOnRight(v1)).toEqual(false);

    expect(v1.hasSharpCornerWith(v2)).toEqual(true);
    expect(v2.hasSharpCornerWith(v1)).toEqual(true);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(false);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(false);

    expect(v1.isOrthogonal(v2)).toEqual(false);
    expect(v2.isOrthogonal(v1)).toEqual(false);

    expect(v1.isCollinear(v2)).toEqual(false);
    expect(v2.isCollinear(v1)).toEqual(false);

    expect(v2.isNormalized()).toEqual(false);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([1, 0]);

    expect(v1.hasOnRight(v2)).toEqual(true);
    expect(v2.hasOnLeft(v1)).toEqual(true);

    expect(v1.hasOnLeft(v2)).toEqual(false);
    expect(v2.hasOnRight(v1)).toEqual(false);

    expect(v1.hasSharpCornerWith(v2)).toEqual(false);
    expect(v2.hasSharpCornerWith(v1)).toEqual(false);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(false);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(false);

    expect(v1.isOrthogonal(v2)).toEqual(true);
    expect(v2.isOrthogonal(v1)).toEqual(true);

    expect(v1.isCollinear(v2)).toEqual(false);
    expect(v2.isCollinear(v1)).toEqual(false);

    expect(v2.isNormalized()).toEqual(true);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([1, -1]);

    expect(v1.hasOnRight(v2)).toEqual(true);
    expect(v2.hasOnLeft(v1)).toEqual(true);

    expect(v1.hasOnLeft(v2)).toEqual(false);
    expect(v2.hasOnRight(v1)).toEqual(false);

    expect(v1.hasSharpCornerWith(v2)).toEqual(false);
    expect(v2.hasSharpCornerWith(v1)).toEqual(false);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(true);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(true);

    expect(v1.isOrthogonal(v2)).toEqual(false);
    expect(v2.isOrthogonal(v1)).toEqual(false);

    expect(v1.isCollinear(v2)).toEqual(false);
    expect(v2.isCollinear(v1)).toEqual(false);

    expect(v2.isNormalized()).toEqual(false);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([0, -1]);

    expect(v1.hasOnRight(v2)).toEqual(false);
    expect(v2.hasOnLeft(v1)).toEqual(false);

    expect(v1.hasOnLeft(v2)).toEqual(false);
    expect(v2.hasOnRight(v1)).toEqual(false);

    expect(v1.hasSharpCornerWith(v2)).toEqual(false);
    expect(v2.hasSharpCornerWith(v1)).toEqual(false);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(true);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(true);

    expect(v1.isOrthogonal(v2)).toEqual(false);
    expect(v2.isOrthogonal(v1)).toEqual(false);

    expect(v1.isCollinear(v2)).toEqual(true);
    expect(v2.isCollinear(v1)).toEqual(true);

    expect(v2.isNormalized()).toEqual(true);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([-1, -1]);

    expect(v1.hasOnRight(v2)).toEqual(false);
    expect(v2.hasOnLeft(v1)).toEqual(false);

    expect(v1.hasOnLeft(v2)).toEqual(true);
    expect(v2.hasOnRight(v1)).toEqual(true);

    expect(v1.hasSharpCornerWith(v2)).toEqual(false);
    expect(v2.hasSharpCornerWith(v1)).toEqual(false);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(true);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(true);

    expect(v1.isOrthogonal(v2)).toEqual(false);
    expect(v2.isOrthogonal(v1)).toEqual(false);

    expect(v1.isCollinear(v2)).toEqual(false);
    expect(v2.isCollinear(v1)).toEqual(false);

    expect(v2.isNormalized()).toEqual(false);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([-1, 0]);

    expect(v1.hasOnRight(v2)).toEqual(false);
    expect(v2.hasOnLeft(v1)).toEqual(false);

    expect(v1.hasOnLeft(v2)).toEqual(true);
    expect(v2.hasOnRight(v1)).toEqual(true);

    expect(v1.hasSharpCornerWith(v2)).toEqual(false);
    expect(v2.hasSharpCornerWith(v1)).toEqual(false);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(false);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(false);

    expect(v1.isOrthogonal(v2)).toEqual(true);
    expect(v2.isOrthogonal(v1)).toEqual(true);

    expect(v1.isCollinear(v2)).toEqual(false);
    expect(v2.isCollinear(v1)).toEqual(false);

    expect(v2.isNormalized()).toEqual(true);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }
  {
    const v1 = createVector([0, 1]);
    const v2 = createVector([-1, 1]);

    expect(v1.hasOnRight(v2)).toEqual(false);
    expect(v2.hasOnLeft(v1)).toEqual(false);

    expect(v1.hasOnLeft(v2)).toEqual(true);
    expect(v2.hasOnRight(v1)).toEqual(true);

    expect(v1.hasSharpCornerWith(v2)).toEqual(true);
    expect(v2.hasSharpCornerWith(v1)).toEqual(true);

    expect(v1.hasObtuseCornerWith(v2)).toEqual(false);
    expect(v2.hasObtuseCornerWith(v1)).toEqual(false);

    expect(v1.isOrthogonal(v2)).toEqual(false);
    expect(v2.isOrthogonal(v1)).toEqual(false);

    expect(v1.isCollinear(v2)).toEqual(false);
    expect(v2.isCollinear(v1)).toEqual(false);

    expect(v2.isNormalized()).toEqual(false);
    v2.normalize();
    expect(v2.isNormalized()).toEqual(true);
  }

  {
    const v = createVector([0, 1]);
    const precision = 4;

    v.rotate(Math.PI/2);
    expect(v.x).toBeCloseTo(1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotate(Math.PI/4);
    v.rotate(Math.PI/4);
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(-1, precision);

    v.rotate(Math.PI/2);
    expect(v.x).toBeCloseTo(-1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotate(Math.PI/2);
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(1, precision);
  }
  {
    const v = createVector([0, 1]);
    const precision = 4;

    v.rotate(-Math.PI/2);
    expect(v.x).toBeCloseTo(-1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotate(-Math.PI/4);
    v.rotate(-Math.PI/4);
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(-1, precision);

    v.rotate(-Math.PI/2);
    expect(v.x).toBeCloseTo(1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotate(-Math.PI/2);
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(1, precision);
  }
  {
    const v = createVector([0, 1]);
    const precision = 4;

    v.rotateRight();
    expect(v.x).toBeCloseTo(1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotateRight();
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(-1, precision);

    v.rotateRight();
    expect(v.x).toBeCloseTo(-1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotateRight();
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(1, precision);
  }
  {
    const v = createVector([0, 1]);
    const precision = 4;

    v.rotateLeft();
    expect(v.x).toBeCloseTo(-1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotateLeft();
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(-1, precision);

    v.rotateLeft();
    expect(v.x).toBeCloseTo(1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotateLeft();
    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(1, precision);
  }
  {
    const v = createVector([0, 1]);
    const precision = 4;

    v.rotate(Math.PI/4);
    v.rotateRight();
    v.rotate(-Math.PI/4);

    expect(v.x).toBeCloseTo(1, precision);
    expect(v.y).toBeCloseTo(0, precision);

    v.rotate(Math.PI);
    v.rotate(Math.PI/4);
    v.rotateLeft();
    v.rotate(-Math.PI/4);

    expect(v.x).toBeCloseTo(0, precision);
    expect(v.y).toBeCloseTo(-1, precision);
  }

  {
    const v = createVector([2, 5]);
    const scale = [2, 3];
    const offset = [200, 100];

    v.transposeForward(offset, scale);
    expect(v.toArray()).toEqual([204, 115]);

    v.transposeBackward(offset, scale);
    expect(v.toArray()).toEqual([2, 5]);
  }
});

test('positional-vector', () => {
  const v = new PositionalVector([0, 0], [5, 5]);
  expect(v.includes([0, 0])).toEqual(true);
  expect(v.includes([1, 1])).toEqual(true);
  expect(v.includes([2, 2])).toEqual(true);
  expect(v.includes([3, 3])).toEqual(true);
  expect(v.includes([4, 4])).toEqual(true);
  expect(v.includes([5, 5])).toEqual(true);

  expect(v.includes([1.5, 1.5])).toEqual(true);
  expect(v.includes([1.5, 3/2])).toEqual(true);

  expect(v.includes([-1, -1])).toEqual(false);
  expect(v.includes([6, 6])).toEqual(false);
  expect(v.includes([1, 2])).toEqual(false);
});
