import { describe, expect, it } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import { CompoundsAnalyzer, CompoundsCollector } from '../../src/lib/analysis/compounds';
import { expectSameArraysOfSets, prepareCompoundsData } from './helpers';

describe.each([
  ...dataProviderForCompounds(),
] as Array<[
  LinkInterface[],
  Set<AtomInterface>[],
  number,
  number[],
  [number, number, number, number, number],
  [number, number, number, number, number][],
]>)(
  'Compounds Collector Test',
  (
    links: LinkInterface[],
    compoundsExpected: Set<AtomInterface>[],
    lengthExpected: number,
    lengthByTypesExpected: number[],
    itemSizeSummaryExpected: [number, number, number, number, number],
    itemSizeSummaryByTypesExpected: [number, number, number, number, number][],
  ) => {
    it('', () => {
      const collector = new CompoundsCollector();
      collector.handleLinks(links);

      const analyzer = new CompoundsAnalyzer(collector.getCompounds());

      const compoundsActual = collector.getCompounds();
      expectSameArraysOfSets(compoundsActual, compoundsExpected);

      expect(analyzer.length).toEqual(lengthExpected);
      expect(analyzer.lengthByTypes).toEqual(lengthByTypesExpected);

      const itemLengthSummary = analyzer.itemLengthSummary;
      expect(itemLengthSummary).toEqual(itemSizeSummaryExpected);

      const itemLengthByTypesSummary = analyzer.itemLengthByTypesSummary;
      expect(itemLengthByTypesSummary).toEqual(itemSizeSummaryByTypesExpected);
    });
  },
);

function dataProviderForCompounds(): Array<[
  LinkInterface[],
  Set<AtomInterface>[],
  number,
  number[],
  [number, number, number, number, number],
  [number, number, number, number, number][],
]> {
  const linkData: Array<[
    number[],
    number[][],
    number[][],
    number,
    number[],
    [number, number, number, number, number],
    [number, number, number, number, number][]
  ]> = [
    [
      [0, 0, 1, 1, 2, 2, 0],
      [[0, 1], [0, 2], [2, 3], [5, 6]],
      [[0, 1, 2, 3], [5, 6]],
      2,
      [2, 1, 1],
      [2, 2, 4, 3, 4],
      [[2, 2, 4, 3, 4], [1, 4, 4, 4, 4], [1, 2, 2, 2, 2]],
    ],
  ];

  return linkData.map(([atomTypes, linksData, compoundsData, ...others]) => [
    ...prepareCompoundsData(atomTypes, linksData, compoundsData),
    ...others,
  ]);
}
