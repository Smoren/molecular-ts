import { expect } from '@jest/globals'
import type { AtomInterface, LinkInterface } from '../../src/lib/types/atomic';
import type { CompoundsSummary } from "../../src/lib/types/analysis";
import { createAtom } from '../../src/lib/helpers';
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

export function prepareCompoundsData(atomTypes: number[], linksData: number[][], compoundsData: number[][]): [LinkInterface[], Set<AtomInterface>[]] {
  const [atoms, links] = createAtomsAndLinks(atomTypes, linksData);
  return [links, createCompounds(atoms, compoundsData)];
}

export function expectSameArraysOfSets(actual: Set<AtomInterface>[], expected: Set<AtomInterface>[]) {
  expect(actual).toHaveLength(expected.length);
  for (let i = 0; i < actual.length; ++i) {
    expect(actual[i]).toEqual(expected[i]);
  }
}

export function createCompoundsSummary(data: [number, number, number, number, number]): CompoundsSummary {
  return {
    size: data[0],
    frequency: data[0],
    min: data[1],
    max: data[2],
    mean: data[3],
    median: data[4],
  }
}
