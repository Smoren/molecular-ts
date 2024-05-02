import { describe, expect, it } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import { CompoundsCollector } from '../../src/lib/analysis/compounds';
import { expectSameArraysOfSets, prepareCompoundsData } from './helpers';

describe.each([
  ...dataProviderForCompounds(),
] as Array<[LinkInterface[], Set<AtomInterface>[]]>)(
  'Compounds Collector Test',
  (links: LinkInterface[], expected: Set<AtomInterface>[]) => {
    it('', () => {
      const collector = new CompoundsCollector();

      for (const link of links) {
        collector.handleLink(link);
      }

      const actual = collector.getCompounds();
      expectSameArraysOfSets(actual, expected);

      expect(true).toBe(true);
    });
  },
);

function dataProviderForCompounds(): Array<[LinkInterface[], Set<AtomInterface>[]]> {
  const linkData: Array<[number[][], number[][]]> = [
    [
      [[0, 1], [0, 2], [2, 3], [5, 6]],
      [[0, 1, 2, 3], [5, 6]],
    ],
  ];

  return linkData.map(([linksData, compoundsData]) => prepareCompoundsData(linksData, compoundsData));
}
