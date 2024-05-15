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
    createFilledArray(typesCount, weights.ATOMS_TYPE_MEAN_SPEED),
    createFilledArray(typesCount, weights.ATOMS_TYPE_LINKS_MEAN_COUNT),
    weights.LINKS_CREATED_MEAN,
    weights.LINKS_DELETED_MEAN,
    createFilledArray(typesCount, weights.LINKS_TYPE_CREATED_MEAN),
    createFilledArray(typesCount, weights.LINKS_TYPE_DELETED_MEAN),
    weights.COMPOUNDS_PER_ATOM,
    createFilledArray(typesCount, weights.COMPOUNDS_PER_ATOM_BY_TYPES),
    Object.values(weights.COMPOUND_LENGTH_SUMMARY),
    repeatArrayValues(Object.values(weights.COMPOUND_LENGTH_BY_TYPES_SUMMARY), typesCount),
  ].flat(Infinity) as number[];
}

export function convertSummaryToMatrix(summary: TotalSummary): number[] {
  const compoundsPerAtom = summary.COMPOUNDS.size / summary.WORLD.ATOMS_COUNT[0];
  const compoundsPerAtomByTypes = summary.COMPOUNDS.sizeByTypes.map((x) => x / summary.WORLD.ATOMS_COUNT[0]);
  const compoundLengthSummary = Object.values(summary.COMPOUNDS.itemLengthSummary);
  const compoundLengthByTypesSummary = summary.COMPOUNDS.itemLengthByTypesSummary.map(
    (item) => Object.values(item),
  );

  return [
    summary.WORLD.ATOMS_MEAN_SPEED,
    summary.WORLD.ATOMS_TYPE_MEAN_SPEED,
    summary.WORLD.ATOMS_TYPE_LINKS_MEAN_COUNT,
    summary.WORLD.LINKS_CREATED_MEAN,
    summary.WORLD.LINKS_DELETED_MEAN,
    summary.WORLD.LINKS_TYPE_CREATED_MEAN,
    summary.WORLD.LINKS_TYPE_DELETED_MEAN,
    compoundsPerAtom,
    compoundsPerAtomByTypes,
    compoundLengthSummary,
    compoundLengthByTypesSummary,
  ].flat(Infinity) as number[];
}
