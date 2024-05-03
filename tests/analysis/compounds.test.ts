import { describe, expect, it } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import type { CompoundsSummary } from "../../src/lib/types/analysis";
import { CompoundsAnalyzer, CompoundsCollector } from '../../src/lib/analysis/compounds';
import { createCompoundsSummary, expectSameArraysOfSets, prepareCompoundsData } from './helpers';

describe.each([
  ...dataProviderForCompounds(),
] as Array<[
  LinkInterface[],
  Set<AtomInterface>[],
  number,
  number[],
  CompoundsSummary,
  CompoundsSummary[],
]>)(
  'Compounds Collector Test',
  (
    links: LinkInterface[],
    compoundsExpected: Set<AtomInterface>[],
    lengthExpected: number,
    lengthByTypesExpected: number[],
    itemSizeSummaryExpected: CompoundsSummary,
    itemSizeSummaryByTypesExpected: CompoundsSummary[],
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
  CompoundsSummary,
  CompoundsSummary[],
]> {
  const linkData: Array<[
    number[],
    number[][],
    number[][],
    number,
    number[],
    CompoundsSummary,
    CompoundsSummary[]
  ]> = [
    [
      [0, 0, 1, 1, 2, 2, 0],
      [[0, 1], [0, 2], [2, 3], [5, 6]],
      [[0, 1, 2, 3], [5, 6]],
      2,
      [2, 1, 1],
      createCompoundsSummary([2, 2, 4, 3, 4]),
      [
        createCompoundsSummary([2, 2, 4, 3, 4]),
        createCompoundsSummary([1, 4, 4, 4, 4]),
        createCompoundsSummary([1, 2, 2, 2, 2]),
      ],
    ],
  ];

  return linkData.map(([atomTypes, linksData, compoundsData, ...others]) => [
    ...prepareCompoundsData(atomTypes, linksData, compoundsData),
    ...others,
  ]);
}
