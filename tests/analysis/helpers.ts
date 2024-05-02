import { expect } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import { createAtom } from '../../src/lib/helpers';
import { Link } from '../../src/lib/atomic';

function createAtomsAndLinks(linksData: number[][]): [AtomInterface[], LinkInterface[]] {
  const atoms: AtomInterface[] = [];
  const atomsCount = Math.max(...linksData.reduce((a, b) => a.concat(b), [])) + 1;

  for (let i = 0; i < atomsCount; ++i) {
    atoms.push(createAtom(1, [0, 0], undefined, i));
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

export function prepareCompoundsData(linksData: number[][], compoundsData: number[][]): [LinkInterface[], Set<AtomInterface>[]] {
  const [atoms, links] = createAtomsAndLinks(linksData);
  return [links, createCompounds(atoms, compoundsData)];
}

export function expectSameArraysOfSets(actual: Set<AtomInterface>[], expected: Set<AtomInterface>[]) {
  expect(actual).toHaveLength(expected.length);
  for (let i = 0; i < actual.length; ++i) {
    expect(actual[i]).toEqual(expected[i]);
  }
}
