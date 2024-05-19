import type { TotalSummary, TotalSummaryWeights } from '../types/analysis';
import { createFilledArray, normalizeMatrixColumnsUnion, repeatArrayValues } from '../math';
import { fullCopyObject } from "@/lib/utils/functions";

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
    COMPOUND_SPEED_SUMMARY: {
      size: 1,
      frequency: 1,
      min: 1,
      max: 1,
      mean: 1,
      median: 1,
    },
    COMPOUND_SPEED_BY_TYPES_SUMMARY: {
      size: 1,
      frequency: 1,
      min: 1,
      max: 1,
      mean: 1,
      median: 1,
    },
  };
}

export function getSummaryMatrixGroupIndexes(typesCount: number): number[][] {
  const groups = [
    0,
    createFilledArray(typesCount, 1),
    createFilledArray(typesCount, 2),
    3,
    4,
    createFilledArray(typesCount, 5),
    createFilledArray(typesCount, 6),
    7,
    createFilledArray(typesCount, 8),
    [9, 10, 11, 12, 13],
    repeatArrayValues([14, 15, 16, 17, 18], typesCount),
    [19, 20, 21, 22],
    repeatArrayValues([23, 24, 25, 26], typesCount),
  ].flat(Infinity) as number[];

  const groupIndexes: number[][] = Array.from({ length: Math.max(...groups) + 1 }, () => []);
  for (let i = 0; i < groups.length; i++) {
    groupIndexes[groups[i]].push(i);
  }
  return groupIndexes;
}

export function convertWeightsToSummaryMatrixRow(weights: TotalSummaryWeights, typesCount: number): number[] {
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
    Object.values(weights.COMPOUND_LENGTH_SUMMARY).slice(1),
    repeatArrayValues(Object.values(weights.COMPOUND_LENGTH_BY_TYPES_SUMMARY).slice(1), typesCount),
    Object.values(weights.COMPOUND_SPEED_SUMMARY).slice(2),
    repeatArrayValues(Object.values(weights.COMPOUND_SPEED_BY_TYPES_SUMMARY).slice(2), typesCount),
  ].flat(Infinity) as number[];
}

export function convertSummaryToSummaryMatrixRow(summary: TotalSummary): number[] {
  const compoundsPerAtom = summary.COMPOUNDS.size / summary.WORLD.ATOMS_COUNT[0];
  const compoundsPerAtomByTypes = summary.COMPOUNDS.sizeByTypes.map((x) => x / summary.WORLD.ATOMS_COUNT[0]);
  const compoundLengthSummary = Object.values(summary.COMPOUNDS.itemLengthSummary).slice(1);
  const compoundLengthByTypesSummary = summary.COMPOUNDS.itemLengthByTypesSummary.map(
    (item) => Object.values(item).slice(1),
  );
  const compoundSpeedSummary = Object.values(summary.COMPOUNDS.itemSpeedSummary).slice(2);
  const compoundSpeedByTypesSummary = summary.COMPOUNDS.itemSpeedByTypesSummary.map(
    (item) => Object.values(item).slice(2),
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
    compoundSpeedSummary,
    compoundSpeedByTypesSummary,
  ].flat(Infinity) as number[];
}

export function normalizeSummaryMatrix(matrix: number[][], typesCount: number): number[][] {
  const result = fullCopyObject(matrix);
  const groupIndexes = getSummaryMatrixGroupIndexes(typesCount);

  for (const group of groupIndexes) {
    normalizeMatrixColumnsUnion(result, group, true);
  }

  return result;
}
