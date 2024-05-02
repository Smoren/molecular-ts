import { describe, expect, it } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import { CompoundsAnalyzer, CompoundsCollector } from '../../src/lib/analysis/compounds';
import { expectSameArraysOfSets, prepareCompoundsData } from './helpers';

describe.each([
  ...dataProviderForCompounds(),
] as Array<[
  LinkInterface[],
  Set<AtomInterface>[],
  [number, number, number],
]>)(
  'Compounds Collector Test',
  (
    links: LinkInterface[],
    compoundsExpected: Set<AtomInterface>[],
    itemSizeSummaryExpected: [number, number, number],
  ) => {
    it('', () => {
      const collector = new CompoundsCollector();
      const analyzer = new CompoundsAnalyzer(collector.getCompounds());

      for (const link of links) {
        collector.handleLink(link);
      }

      const compoundsActual = collector.getCompounds();
      expectSameArraysOfSets(compoundsActual, compoundsExpected);
      expect(analyzer.itemLengthSummary).toEqual(itemSizeSummaryExpected);
    });
  },
);

function dataProviderForCompounds(): Array<[
  LinkInterface[],
  Set<AtomInterface>[],
  [number, number, number],
]> {
  const linkData: Array<[number[][], number[][], [number, number, number]]> = [
    [
      [[0, 1], [0, 2], [2, 3], [5, 6]],
      [[0, 1, 2, 3], [5, 6]],
      [2, 4, 3],
    ],
  ];

  return linkData.map(([linksData, compoundsData, ...others]) => [
    ...prepareCompoundsData(linksData, compoundsData),
    ...others,
  ]);
}
