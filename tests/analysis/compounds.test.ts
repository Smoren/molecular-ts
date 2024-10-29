import { describe, expect, it } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import type { StatSummary } from "../../src/lib/types/analysis";
import { CompoundsAnalyzer, CompoundsCollector } from '../../src/lib/analysis/compounds';
import { createCompoundsSummary, expectSameArraysOfSets, extendStatSummary, prepareCompoundsData } from './helpers';
import { round } from "../../src/lib/math";

describe.each([
  ...dataProviderForCompounds(),
] as Array<[
  AtomInterface[],
  LinkInterface[],
  Set<AtomInterface>[],
  number,
  number[],
  StatSummary,
  StatSummary[],
]>)(
  'Compounds Collector Test',
  (
    atoms: AtomInterface[],
    links: LinkInterface[],
    compoundsExpected: Set<AtomInterface>[],
    lengthExpected: number,
    lengthByTypesExpected: number[],
    itemSizeSummaryExpected: StatSummary,
    itemSizeSummaryByTypesExpected: StatSummary[],
  ) => {
    it('', () => {
      const collector = new CompoundsCollector();
      collector.handleAtoms(atoms);

      const atomTypesCount = (new Set(atoms.map(atom => atom.type))).size;

      const analyzer = new CompoundsAnalyzer(collector.getCompounds(), atoms, atomTypesCount);

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
  StatSummary,
  StatSummary[],
]> {
  const s = createCompoundsSummary;
  const e = extendStatSummary;
  const r = (value: number) => round(value, 4);
  const linkData: Array<[
    number[],
    number[][],
    number[][],
    number,
    number[],
    StatSummary,
    StatSummary[]
  ]> = [
    [
      [0, 0, 1, 1, 2, 2, 0],
      [[0, 1], [0, 2], [2, 3], [5, 6]],
      [[0, 1, 2, 3], [5, 6]],
      2,
      [2, 1, 1],
      s(2, 4, 3, 2, 4, 4),
      [
        e(s(2, 4, 3, 2, 4, 4), 2, r(2/3)),
        e(s(4, 4, 4, 4, 4, 4), 1, r(1/2)),
        e(s(2, 2, 2, 2, 2, 2), 1, r(1/2)),
      ],
    ],
  ];

  return linkData.map(([atomTypes, linksData, compoundsData, ...others]) => [
    ...prepareCompoundsData(atomTypes, linksData, compoundsData),
    ...others,
  ]);
}
