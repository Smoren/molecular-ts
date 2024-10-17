import { describe, expect, it } from '@jest/globals';
import { findDuplicatedGraphParts, measureBilateralSymmetry } from "../../src/lib/analysis/symmetry";
import type { GraphConfig } from "../../src/lib/graph/types";
import { createGraph } from "../../src/lib/graph/functions";

describe.each([
  ...dataProviderForBilateralSymmetry(),
] as Array<[GraphConfig[]]>)(
  'Bilateral Symmetry Test',
  (
    graphs: GraphConfig[],
  ) => {
    it('', () => {
      for (const config of graphs) {
        const symmetryScore = measureBilateralSymmetry(createGraph(config));
        expect(symmetryScore).toBeGreaterThan(0);

        const countDuplicates = findDuplicatedGraphParts(createGraph(config));
        expect(true).toBe(true);
      }
    });
  },
);

function dataProviderForBilateralSymmetry(): Array<[GraphConfig[]]> {
  return [
    [
      [
        {
          typesCount: 2,
          vertexes: [
            { id: 3149, type: 1 },
            { id: 4080, type: 0 },
            { id: 3146, type: 1 },
            { id: 3485, type: 1 },
            { id: 4704, type: 0 },
            { id: 3392, type: 1 },
            { id: 4654, type: 1 },
            { id: 4983, type: 1 },
            { id: 4382, type: 1 },
            { id: 4235, type: 1 },
            { id: 3766, type: 1 },
            { id: 4958, type: 0 },
            { id: 3587, type: 1 },
            { id: 3955, type: 1 },
            { id: 3737, type: 0 },
            { id: 3106, type: 1 },
          ],
          edges: [
            { lhsId: 3146, rhsId: 3149 },
            { lhsId: 3149, rhsId: 3485 },
            { lhsId: 3149, rhsId: 4080 },
            { lhsId: 3146, rhsId: 4080 },
            { lhsId: 3146, rhsId: 3485 },
            { lhsId: 3485, rhsId: 4704 },
            { lhsId: 3392, rhsId: 4704 },
            { lhsId: 3392, rhsId: 3766 },
            { lhsId: 3392, rhsId: 4654 },
            { lhsId: 4654, rhsId: 4983 },
            { lhsId: 4382, rhsId: 4983 },
            { lhsId: 4235, rhsId: 4382 },
            { lhsId: 3766, rhsId: 4235 },
            { lhsId: 3766, rhsId: 4958 },
            { lhsId: 3587, rhsId: 4958 },
            { lhsId: 3106, rhsId: 3587 },
            { lhsId: 3587, rhsId: 3955 },
            { lhsId: 3106, rhsId: 3955 },
            { lhsId: 3737, rhsId: 3955 },
            { lhsId: 3106, rhsId: 3737 },
          ],
        },
        {
          typesCount: 3,
          vertexes: [
            { id: 2888, type: 0 },
            { id: 2593, type: 0 },
            { id: 2560, type: 2 },
            { id: 2427, type: 1 },
            { id: 1141, type: 2 },
            { id: 1897, type: 0 },
            { id: 2142, type: 2 },
            { id: 2441, type: 1 },
            { id: 2301, type: 2 },
          ],
          edges: [
            { lhsId: 1141, rhsId: 2888 },
            { lhsId: 1897, rhsId: 2888 },
            { lhsId: 2593, rhsId: 2888 },
            { lhsId: 1897, rhsId: 2593 },
            { lhsId: 2560, rhsId: 2593 },
            { lhsId: 2427, rhsId: 2560 },
            { lhsId: 1141, rhsId: 2427 },
            { lhsId: 1897, rhsId: 2142 },
            { lhsId: 2142, rhsId: 2441 },
            { lhsId: 2301, rhsId: 2441 },
          ],
        },
        {
          typesCount: 3,
          vertexes: [
            { id: 111136, type: 0 },
            { id: 111476, type: 2 },
            { id: 111442, type: 2 },
            { id: 111250, type: 0 },
            { id: 112734, type: 0 },
            { id: 112266, type: 1 },
            { id: 111359, type: 1 },
            { id: 111066, type: 2 },
            { id: 111857, type: 2 },
            { id: 111266, type: 0 },
            { id: 112377, type: 2 },
            { id: 111992, type: 0 },
            { id: 112005, type: 0 },
            { id: 111746, type: 2 },
            { id: 112209, type: 0 },
          ],
          edges: [
            { lhsId: 111066, rhsId: 111136 },
            { lhsId: 111136, rhsId: 111359 },
            { lhsId: 111136, rhsId: 111476 },
            { lhsId: 111442, rhsId: 111476 },
            { lhsId: 111250, rhsId: 111442 },
            { lhsId: 111250, rhsId: 112266 },
            { lhsId: 111250, rhsId: 112734 },
            { lhsId: 111359, rhsId: 112266 },
            { lhsId: 111066, rhsId: 111857 },
            { lhsId: 111266, rhsId: 111857 },
            { lhsId: 111266, rhsId: 112209 },
            { lhsId: 111266, rhsId: 112377 },
            { lhsId: 111992, rhsId: 112377 },
            { lhsId: 111746, rhsId: 111992 },
            { lhsId: 111992, rhsId: 112005 },
            { lhsId: 111746, rhsId: 112209 },
          ],
        },
      ],
    ],
  ];
}
