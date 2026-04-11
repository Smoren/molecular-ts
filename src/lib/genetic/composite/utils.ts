import type { SimulationGenome } from "../types";
import type { RandomTypesConfig, TypesConfig } from "../../config/types";
import type { CompositeSimulationGenome } from "./types";
import {
  createRandomIntTypesConfig,
  createRandomTypesConfig,
  createTransparentTypesConfig,
} from "../../config/atom-types";

type RecursiveArray<T> = Array<T | RecursiveArray<T>>;

export function extractExpressedGenome(compositeGenome: CompositeSimulationGenome): SimulationGenome {
  return {
    id: compositeGenome.id,
    typesConfig: extractExpressedTypesConfig(compositeGenome.chromosomes, compositeGenome.expressionIndices),
  }
}

export function extractExpressedTypesConfig(typesConfigs: TypesConfig[], expressionIndices: TypesConfig): TypesConfig {
  return {
    RADIUS: express(typesConfigs.map((x) => x.RADIUS), expressionIndices.RADIUS),
    GRAVITY: express(typesConfigs.map((x) => x.GRAVITY), expressionIndices.GRAVITY),
    LINK_GRAVITY: express(typesConfigs.map((x) => x.LINK_GRAVITY), expressionIndices.LINK_GRAVITY),
    LINKS: express(typesConfigs.map((x) => x.LINKS), expressionIndices.LINKS),
    TYPE_LINKS: express(typesConfigs.map((x) => x.TYPE_LINKS), expressionIndices.TYPE_LINKS),
    TYPE_LINK_WEIGHTS: express(typesConfigs.map((x) => x.TYPE_LINK_WEIGHTS), expressionIndices.TYPE_LINK_WEIGHTS),
    LINK_FACTOR_DISTANCE: express(typesConfigs.map((x) => x.LINK_FACTOR_DISTANCE), expressionIndices.LINK_FACTOR_DISTANCE),
    LINK_FACTOR_ELASTIC: express(typesConfigs.map((x) => x.LINK_FACTOR_ELASTIC), expressionIndices.LINK_FACTOR_ELASTIC),
    FREQUENCIES: express(typesConfigs.map((x) => x.FREQUENCIES), expressionIndices.FREQUENCIES),
    COLORS: express(typesConfigs.map((x) => x.COLORS), expressionIndices.COLORS),
    TRANSFORMATION: {}, // TODO implement
  };
}

export function express<T extends RecursiveArray<number>>(chromosomes: T[], indices: T | number): T {
  // Если индекс — это число, значит мы дошли до уровня выбора из хромосом
  if (typeof indices === 'number') {
    return chromosomes[indices as unknown as number];
  }

  // Если это массив (маска), идем глубже
  return indices.map((subIndices: any, i: number) => {
    // Пробрасываем массив хромосом, но выбираем из каждой i-й элемент
    const subChromosomes = chromosomes.map(c => (c as any)[i]);
    return express(subChromosomes, subIndices);
  }) as unknown as T;
}

export function createRandomCompositeGenome(id: number, chromosomesCount: number, chromosomeRandomizeConfig: RandomTypesConfig): CompositeSimulationGenome {
  return {
    id,
    expressionIndices: createRandomExpressedIndices(chromosomeRandomizeConfig.TYPES_COUNT, chromosomesCount),
    chromosomes: createRandomChromosomes(chromosomesCount, chromosomeRandomizeConfig),
  };
}

export function createTransparentCompositeGenome(id: number, typesCount: number, chromosomesCount: number): CompositeSimulationGenome {
  return {
    id,
    expressionIndices: createRandomExpressedIndices(typesCount, chromosomesCount),
    chromosomes: createTransparentChromosomes(typesCount, chromosomesCount),
  };
}

export function createRandomChromosomes(chromosomesCount: number, randomizeConfig: RandomTypesConfig): TypesConfig[] {
  const result: TypesConfig[] = [];
  for (let i=0; i<chromosomesCount; ++i) {
    result.push(createRandomTypesConfig(randomizeConfig));
  }
  return result;
}

export function createTransparentChromosomes(typesCount: number, chromosomesCount: number) {
  const result: TypesConfig[] = [];
  for (let i=0; i<chromosomesCount; ++i) {
    result.push(createTransparentTypesConfig(typesCount));
  }
  return result;
}

export function createRandomExpressedIndices(typesCount: number, chromosomesCount: number): TypesConfig {
  return createRandomIntTypesConfig(createRandomExpressedIndicesConfig(typesCount, chromosomesCount));
}

export function createRandomExpressedIndicesConfig(typesCount: number, chromosomesCount: number): RandomTypesConfig {
  return {
    TYPES_COUNT: typesCount,

    USE_RADIUS_BOUNDS: true,
    USE_FREQUENCY_BOUNDS: true,
    USE_GRAVITY_BOUNDS: true,
    USE_LINK_GRAVITY_BOUNDS: true,
    USE_LINK_BOUNDS: true,
    USE_LINK_TYPE_BOUNDS: true,
    USE_LINK_TYPE_WEIGHT_BOUNDS: true,
    USE_LINK_FACTOR_DISTANCE_BOUNDS: true,
    USE_LINK_FACTOR_ELASTIC_BOUNDS: true,

    RADIUS_BOUNDS: [0, chromosomesCount-1],
    FREQUENCY_BOUNDS: [0, chromosomesCount-1],
    GRAVITY_BOUNDS: [0, chromosomesCount-1],
    LINK_GRAVITY_BOUNDS: [0, chromosomesCount-1],
    LINK_BOUNDS: [0, chromosomesCount-1],
    LINK_TYPE_BOUNDS: [0, chromosomesCount-1],
    LINK_TYPE_WEIGHT_BOUNDS: [0, chromosomesCount-1],
    LINK_FACTOR_DISTANCE_BOUNDS: [0, chromosomesCount-1],
    LINK_FACTOR_ELASTIC_BOUNDS: [0, chromosomesCount-1],

    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
    LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE: false,
    LINK_FACTOR_ELASTIC_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_ELASTIC_IGNORE_SELF_TYPE: false,
  };
}
