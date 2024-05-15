import type { TotalSummary, TotalSummaryWeights } from '../types/analysis';
import { createFilledArray, repeatArrayValues, sortedNumbers, weighArray, weighMatrix } from '../math';

export function createTransparentWeights(): TotalSummaryWeights {
  return {
    ATOMS_MEAN_SPEED: 1,
    ATOMS_TYPE_MEAN_SPEED: 1,
    ATOMS_TYPE_LINKS_MEAN_COUNT: 1,
    LINKS_CREATED_MEAN: 1,
    LINKS_DELETED_MEAN: 1,
    LINKS_TYPE_CREATED_MEAN: 1,
    LINKS_TYPE_DELETED_MEAN: 1,
    COMPOUNDS_PER_ATOM: 1,
    COMPOUNDS_PER_ATOM_BY_TYPES: 1,
    COMPOUND_LENGTH_SUMMARY: {
      size: 1,
      frequency: 1,
      min: 1,
      max: 1,
      mean: 1,
      median: 1,
    },
    COMPOUND_LENGTH_BY_TYPES_SUMMARY: {
      size: 1,
      frequency: 1,
      min: 1,
      max: 1,
      mean: 1,
      median: 1,
    },
  };
}

export function convertWeightsToMatrixRow(weights: TotalSummaryWeights, typesCount: number): number[] {
  return [
    weights.ATOMS_MEAN_SPEED,
    ...createFilledArray(typesCount, weights.ATOMS_TYPE_MEAN_SPEED),
    ...createFilledArray(typesCount, weights.ATOMS_TYPE_LINKS_MEAN_COUNT),
    weights.LINKS_CREATED_MEAN,
    weights.LINKS_DELETED_MEAN,
    ...createFilledArray(typesCount, weights.LINKS_TYPE_CREATED_MEAN),
    ...createFilledArray(typesCount, weights.LINKS_TYPE_DELETED_MEAN),
    weights.COMPOUNDS_PER_ATOM,
    ...createFilledArray(typesCount, weights.COMPOUNDS_PER_ATOM_BY_TYPES),
    ...Object.values(weights.COMPOUND_LENGTH_SUMMARY),
    ...repeatArrayValues(Object.values(weights.COMPOUND_LENGTH_BY_TYPES_SUMMARY), typesCount),
  ]
}

export function weighTotalSummary(
  summary: TotalSummary,
  weights?: TotalSummaryWeights,
  rowModifier?: (row: number[]) => number[],
): number[] {
  weights = weights ?? createTransparentWeights();
  rowModifier = rowModifier ?? ((row) => row);

  const compoundsPerAtom = summary.COMPOUNDS.size / summary.WORLD.ATOMS_COUNT[0];
  const compoundsPerAtomByTypes = summary.COMPOUNDS.sizeByTypes.map((x) => x / summary.WORLD.ATOMS_COUNT[0]);
  const compoundLengthSummary = Object.values(summary.COMPOUNDS.itemLengthSummary);
  const compoundLengthByTypesSummary = summary.COMPOUNDS.itemLengthByTypesSummary.map(
    (item) => Object.values(item),
  );

  return [
    weighArray(rowModifier(summary.WORLD.ATOMS_MEAN_SPEED), weights.ATOMS_MEAN_SPEED),
    weighArray(rowModifier(summary.WORLD.ATOMS_TYPE_MEAN_SPEED), weights.ATOMS_TYPE_MEAN_SPEED),
    weighArray(rowModifier(summary.WORLD.ATOMS_TYPE_LINKS_MEAN_COUNT), weights.ATOMS_TYPE_LINKS_MEAN_COUNT),
    weighArray(rowModifier(summary.WORLD.LINKS_CREATED_MEAN), weights.LINKS_CREATED_MEAN),
    weighArray(rowModifier(summary.WORLD.LINKS_DELETED_MEAN), weights.LINKS_DELETED_MEAN),
    weighArray(rowModifier(summary.WORLD.LINKS_TYPE_CREATED_MEAN), weights.LINKS_TYPE_CREATED_MEAN),
    weighArray(rowModifier(summary.WORLD.LINKS_TYPE_DELETED_MEAN), weights.LINKS_TYPE_DELETED_MEAN),
    weighArray(rowModifier([compoundsPerAtom]), weights.COMPOUNDS_PER_ATOM),
    weighArray(rowModifier(compoundsPerAtomByTypes), weights.COMPOUNDS_PER_ATOM_BY_TYPES),
    weighArray(rowModifier(compoundLengthSummary), Object.values(weights.COMPOUND_LENGTH_SUMMARY)),
    weighMatrix(compoundLengthByTypesSummary, Object.values(weights.COMPOUND_LENGTH_BY_TYPES_SUMMARY), rowModifier),
  ].flat(Infinity) as number[];
}
