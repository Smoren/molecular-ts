import { describe, expect, it } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import type { CompoundsSummary } from "../../src/lib/types/analysis";
import { CompoundsAnalyzer, CompoundsCollector } from '../../src/lib/analysis/compounds';
import { createCompoundsSummary, expectSameArraysOfSets, prepareCompoundsData } from './helpers';
import { round } from "../../src/lib/math";

describe.each([
  ...dataProviderForCompounds(),
] as Array<[
  AtomInterface[],
  LinkInterface[],
  Set<AtomInterface>[],
  number,
  number[],
  CompoundsSummary,
  CompoundsSummary[],
]>)(
  'Compounds Collector Test',
  (
    atoms: AtomInterface[],
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

      const analyzer = new CompoundsAnalyzer(collector.getCompounds(), atoms);

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
  AtomInterface[],
  LinkInterface[],
  Set<AtomInterface>[],
  number,
  number[],
  CompoundsSummary,
  CompoundsSummary[],
]> {
  const s = createCompoundsSummary;
  const r = (value: number) => round(value, 4);
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
      s(2, r(2/7), 2, 4, 3, 4),
      [
        s(2, r(2/3), 2, 4, 3, 4),
        s(1, r(1/2), 4, 4, 4, 4),
        s(1, r(1/2), 2, 2, 2, 2),
      ],
    ],
  ];

  return linkData.map(([atomTypes, linksData, compoundsData, ...others]) => [
    ...prepareCompoundsData(atomTypes, linksData, compoundsData),
    ...others,
  ]);
}
