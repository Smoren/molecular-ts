import type { NumericVector } from "../../src/lib/math/types";
import { createVector, toVector } from "../../src/lib/math";

import { describe, expect, it } from '@jest/globals'
import { AtomInterface, LinkInterface } from "../../src/lib/types/atomic";
import { createAtom } from "../../src/lib/helpers";
import { Link } from "../../src/lib/atomic";

describe.each([
  ...dataProviderForAbs(),
] as Array<[NumericVector, number]>)(
  'Vector abs test',
  (input: NumericVector, expected: number) => {
    it('', () => {
      expect(toVector(input).abs).toEqual(expected);
    });
  },
);

function dataProviderForAbs(): Array<LinkInterface[]> {
  const linkData = [
    [3, [[0, 1], [0, 2]]],
  ];

  return linkData.map(([count, linkIdPairs]) => {
    const atoms: AtomInterface[] = [];
    for (let i = 0; i < count; ++i) {
      atoms.push(createAtom(1, [0, 0], undefined, i));
    }
    const links: LinkInterface[] = [];
    for (const [lhsId, rhsId] of linkIdPairs as number[][]) {
      links.push(new Link(atoms[lhsId], atoms[rhsId]));
    }

    return links;
  });
}
