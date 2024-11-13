import { expect } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import type { ExtendedStatSummary, StatSummary } from "../../src/lib/analysis/types";
import { createAtom } from '../../src/lib/utils/functions';
import { Link } from '../../src/lib/atomic';

function createAtomsAndLinks(atomTypes: number[], linksData: number[][]): [AtomInterface[], LinkInterface[]] {
  const atoms: AtomInterface[] = [];
  let id = 0;

  for (const type of atomTypes) {
    atoms.push(createAtom(type, [0, 0], undefined, id++));
  }
  const links: LinkInterface[] = [];
  for (const [lhsId, rhsId] of linksData) {
    links.push(new Link(atoms[lhsId], atoms[rhsId]));
  }

  return [atoms, links];
}

function createCompounds(atoms: AtomInterface[], compoundsData: number[][]): Set<AtomInterface>[] {
  return compoundsData.map(compound => new Set(atoms.filter((atom) => compound.includes(atom.id))));
}

export function prepareCompoundsData(
  atomTypes: number[],
  linksData: number[][],
  compoundsData: number[][],
): [AtomInterface[], LinkInterface[], Set<AtomInterface>[]] {
  const [atoms, links] = createAtomsAndLinks(atomTypes, linksData);
  return [atoms, links, createCompounds(atoms, compoundsData)];
}

export function expectSameArraysOfSets(actual: Set<AtomInterface>[], expected: Set<AtomInterface>[]) {
  expect(actual).toHaveLength(expected.length);
  for (let i = 0; i < actual.length; ++i) {
    expect(actual[i]).toEqual(expected[i]);
  }
}

export function createCompoundsSummary(
  min: number,
  max: number,
  mean: number,
  p25: number,
  median: number,
  p75: number,
): StatSummary {
  return {
    min: min,
    max: max,
    mean: mean,
    p25: p25,
    median: median,
    p75: p75,
  }
}

export function extendStatSummary(summary: StatSummary, size: number, frequency: number): ExtendedStatSummary {
  return {
    size: size,
    frequency: frequency,
    ...summary,
  };
}
