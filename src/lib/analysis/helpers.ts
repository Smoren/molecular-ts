import type { TotalSummary } from '../types/analysis';
import { arrayUnaryOperation } from '../math';

function prepareArray<T extends number>(input: T[], sort: boolean): T[] {
  if (!sort) {
    return [...input];
  }
  return [...input].sort((lhs, rhs) => lhs - rhs);
}

export function prepareTotalSummary(summary: TotalSummary, sort: boolean = true): number[] {
  const compoundsPerAtom = summary.COMPOUNDS.size / summary.WORLD.ATOMS_COUNT[0];
  const compoundsPerAtomByTypes = arrayUnaryOperation(
    summary.COMPOUNDS.sizeByTypes,
    (x) => x / summary.WORLD.ATOMS_COUNT[0],
  );
  const compoundLengthSummary = Object.values(summary.COMPOUNDS.itemLengthSummary);
  const compoundLengthByTypesSummary = summary.COMPOUNDS.itemLengthByTypesSummary.map(
    (item) => Object.values(item),
  );

  return [
    prepareArray(summary.WORLD.ATOMS_MEAN_SPEED, sort),
    prepareArray(summary.WORLD.ATOMS_TYPE_MEAN_SPEED, sort),
    prepareArray(summary.WORLD.ATOMS_TYPE_LINKS_MEAN_COUNT, sort),
    prepareArray(summary.WORLD.LINKS_CREATED_MEAN, sort),
    prepareArray(summary.WORLD.LINKS_DELETED_MEAN, sort),
    prepareArray(summary.WORLD.LINKS_TYPE_CREATED_MEAN, sort),
    prepareArray(summary.WORLD.LINKS_TYPE_DELETED_MEAN, sort),
    compoundsPerAtom,
    compoundsPerAtomByTypes,
    compoundLengthSummary,
    compoundLengthByTypesSummary,
  ].flat(Infinity) as number[];
}

export function prepareTotalSummaryList(summaryList: TotalSummary[]): number[] {
  return summaryList.map((summary) => prepareTotalSummary(summary)).flat(1);
}
