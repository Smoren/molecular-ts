import type { TotalSummary, TotalSummaryWeights, SummaryMatrixRowObject } from '../types/analysis';
import type { RandomTypesConfig, TypesConfig, WorldConfig } from '../types/config';
import { STAT_SUMMARY_ARRAY_SIZE } from '../types/analysis';
import { createFilledArray } from '../math';
import { groupArray } from '../math/helpers';
import { convertArrayToStatSummary, convertStatSummaryToArray } from '../analysis/helpers';
import { Simulation } from '../simulation';
import { createPhysicModel } from '../utils/functions';
import { create2dRandomDistribution } from '../config/atoms';
import { createDummyDrawer } from '../drawer/dummy';
import { Runner } from '../runner';

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
      min: 1,
      max: 1,
      mean: 1,
      p25: 1,
      median: 1,
      p75: 1,
    },
    COMPOUND_SPEED_SUMMARY: {
      min: 1,
      max: 1,
      mean: 1,
      p25: 1,
      median: 1,
      p75: 1,
    },
    COMPOUND_DENSITY_SUMMARY: {
      min: 1,
      max: 1,
      mean: 1,
      p25: 1,
      median: 1,
      p75: 1,
    },
    CLUSTERS_SCORE: 1000,
  };
}

export function createZeroWeights(): TotalSummaryWeights {
  return {
    ATOMS_MEAN_SPEED: 0,
    ATOMS_TYPE_MEAN_SPEED: 0,
    ATOMS_TYPE_LINKS_MEAN_COUNT: 0,
    LINKS_CREATED_MEAN: 0,
    LINKS_DELETED_MEAN: 0,
    LINKS_TYPE_CREATED_MEAN: 0,
    LINKS_TYPE_DELETED_MEAN: 0,
    COMPOUNDS_PER_ATOM: 0,
    COMPOUNDS_PER_ATOM_BY_TYPES: 0,
    COMPOUND_LENGTH_SUMMARY: {
      min: 0,
      max: 0,
      mean: 0,
      p25: 0,
      median: 0,
      p75: 0,
    },
    COMPOUND_SPEED_SUMMARY: {
      min: 0,
      max: 0,
      mean: 0,
      p25: 0,
      median: 0,
      p75: 0,
    },
    COMPOUND_DENSITY_SUMMARY: {
      min: 0,
      max: 0,
      mean: 0,
      p25: 0,
      median: 0,
      p75: 0,
    },
    CLUSTERS_SCORE: 0,
  };
}

export function convertWeightsToSummaryMatrixRow(weights: TotalSummaryWeights, typesCount: number): number[] {
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
    ...convertStatSummaryToArray(weights.COMPOUND_LENGTH_SUMMARY),
    ...convertStatSummaryToArray(weights.COMPOUND_SPEED_SUMMARY),
    ...convertStatSummaryToArray(weights.COMPOUND_DENSITY_SUMMARY),
    weights.CLUSTERS_SCORE,
  ];
}

export function convertSummaryMatrixRowToObject(matrixRow: number[], typesCount: number): SummaryMatrixRowObject {
  const buf = groupArray(
    matrixRow,
    [
      1,
      typesCount,
      typesCount,
      1,
      1,
      typesCount,
      typesCount,
      1,
      typesCount,
      STAT_SUMMARY_ARRAY_SIZE,
      STAT_SUMMARY_ARRAY_SIZE,
      STAT_SUMMARY_ARRAY_SIZE,
      1,
    ],
  );

  return {
    atomsMeanSpeed: buf[0][0],
    atomTypeMeanSpeed: buf[1],
    atomTypeLinksMeanCount: buf[2],
    linksCreatedMean: buf[3][0],
    linksDeletedMean: buf[4][0],
    linksTypeCreatedMean: buf[5],
    linksTypeDeletedMean: buf[6],
    compoundsPerAtom: buf[7][0],
    compoundsPerAtomByTypes: buf[8],
    compoundLengthSummary: convertArrayToStatSummary(buf[9]),
    compoundSpeedSummary: convertArrayToStatSummary(buf[10]),
    compoundDensitySummary: convertArrayToStatSummary(buf[11]),
    clustersScore: buf[12][0],
  };
}

export function convertSummaryMatrixRowObjectToArray(rowObject: SummaryMatrixRowObject): number[] {
  return [
    rowObject.atomsMeanSpeed,
    ...rowObject.atomTypeMeanSpeed,
    ...rowObject.atomTypeLinksMeanCount,
    rowObject.linksCreatedMean,
    rowObject.linksDeletedMean,
    ...rowObject.linksTypeCreatedMean,
    ...rowObject.linksTypeDeletedMean,
    rowObject.compoundsPerAtom,
    ...rowObject.compoundsPerAtomByTypes,
    ...convertStatSummaryToArray(rowObject.compoundLengthSummary),
    ...convertStatSummaryToArray(rowObject.compoundSpeedSummary),
    ...convertStatSummaryToArray(rowObject.compoundDensitySummary),
    rowObject.clustersScore,
  ];
}

export function convertTotalSummaryToSummaryMatrixRow(summary: TotalSummary): number[] {
  const compoundsPerAtom = summary.COMPOUNDS.length / summary.WORLD.ATOMS_COUNT[0];
  const compoundsPerAtomByTypes = summary.COMPOUNDS.lengthByTypes.map((x) => x / summary.WORLD.ATOMS_COUNT[0]);
  const compoundLengthSummary = convertStatSummaryToArray(summary.COMPOUNDS.itemLengthSummary);
  const compoundSpeedSummary = convertStatSummaryToArray(summary.COMPOUNDS.itemSpeedSummary);
  const compoundDensitySummary = convertStatSummaryToArray(summary.COMPOUNDS.itemDensitySummary);
  const clustersScore = summary.CLUSTERS;

  return [
    summary.WORLD.ATOMS_MEAN_SPEED[0],
    ...summary.WORLD.ATOMS_TYPE_MEAN_SPEED,
    ...summary.WORLD.ATOMS_TYPE_LINKS_MEAN_COUNT,
    summary.WORLD.LINKS_CREATED_MEAN[0],
    summary.WORLD.LINKS_DELETED_MEAN[0],
    ...summary.WORLD.LINKS_TYPE_CREATED_MEAN,
    ...summary.WORLD.LINKS_TYPE_DELETED_MEAN,
    compoundsPerAtom,
    ...compoundsPerAtomByTypes,
    ...compoundLengthSummary,
    ...compoundSpeedSummary,
    ...compoundDensitySummary,
    clustersScore,
  ];
}

export function setTypesCountToRandomizeConfigCollection(configs: RandomTypesConfig[], typesCount: number): RandomTypesConfig[] {
  return configs.map((config) => {
    config.TYPES_COUNT = typesCount;
    return config;
  });
}

export function createHeadless2dSimulationRunner(worldConfig: WorldConfig, typesConfig: TypesConfig): Runner {
  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  return new Runner(sim);
}
