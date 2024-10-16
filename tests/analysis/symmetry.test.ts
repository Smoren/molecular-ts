import { describe, expect, it } from '@jest/globals';
import { measureBilateralSymmetry } from "../../src/lib/analysis/symmetry";
import type { Graph } from "../../src/lib/types/graph";

describe.each([
  ...dataProviderForBilateralSymmetry(),
] as Array<[Graph[]]>)(
  'Bilateral Symmetry Test',
  (
    graphs: Graph[],
  ) => {
    it('', () => {
      for (const graph of graphs) {
        const symmetryScore = measureBilateralSymmetry(graph);
        expect(symmetryScore).toBeGreaterThan(0);
      }
    });
  },
);

function dataProviderForBilateralSymmetry(): Array<[Graph[]]> {
  return [
    [
      [
        {
          vertexes: [
            {
              id: 2352,
              type: 4
            },
            {
              id: 1835,
              type: 4
            },
            {
              id: 2200,
              type: 0
            },
            {
              id: 1280,
              type: 1
            },
            {
              id: 1816,
              type: 4
            },
            {
              id: 2655,
              type: 0
            },
            {
              id: 1630,
              type: 1
            },
            {
              id: 2812,
              type: 2
            },
            {
              id: 1802,
              type: 0
            },
            {
              id: 1143,
              type: 2
            }
          ],
          edges: [
            {
              lhsId: 1802,
              rhsId: 2352
            },
            {
              lhsId: 1816,
              rhsId: 2352
            },
            {
              lhsId: 1835,
              rhsId: 2352
            },
            {
              lhsId: 1816,
              rhsId: 1835
            },
            {
              lhsId: 1835,
              rhsId: 2200
            },
            {
              lhsId: 1280,
              rhsId: 2200
            },
            {
              lhsId: 1816,
              rhsId: 2655
            },
            {
              lhsId: 1630,
              rhsId: 2655
            },
            {
              lhsId: 1143,
              rhsId: 1630
            },
            {
              lhsId: 1630,
              rhsId: 1802
            },
            {
              lhsId: 1630,
              rhsId: 2812
            }
          ]
        },
        {
          vertexes: [
            {
              id: 2123,
              type: 4
            },
            {
              id: 2874,
              type: 4
            },
            {
              id: 1582,
              type: 4
            },
            {
              id: 2795,
              type: 0
            },
            {
              id: 1282,
              type: 1
            },
            {
              id: 1532,
              type: 0
            },
            {
              id: 2267,
              type: 4
            },
            {
              id: 1194,
              type: 0
            },
            {
              id: 1051,
              type: 1
            },
            {
              id: 2614,
              type: 0
            },
            {
              id: 2822,
              type: 1
            },
            {
              id: 2494,
              type: 2
            }
          ],
          edges: [
            {
              lhsId: 2123,
              rhsId: 2267
            },
            {
              lhsId: 2123,
              rhsId: 2614
            },
            {
              lhsId: 2123,
              rhsId: 2874
            },
            {
              lhsId: 1532,
              rhsId: 2874
            },
            {
              lhsId: 1582,
              rhsId: 2874
            },
            {
              lhsId: 1582,
              rhsId: 2267
            },
            {
              lhsId: 1582,
              rhsId: 2795
            },
            {
              lhsId: 1282,
              rhsId: 2795
            },
            {
              lhsId: 1282,
              rhsId: 1532
            },
            {
              lhsId: 1194,
              rhsId: 2267
            },
            {
              lhsId: 1051,
              rhsId: 1194
            },
            {
              lhsId: 2614,
              rhsId: 2822
            },
            {
              lhsId: 2494,
              rhsId: 2822
            }
          ]
        },
      ],
    ],
  ];
}
