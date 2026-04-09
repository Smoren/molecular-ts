import type { SimulationGenome } from "../types";
import type { TypesConfig } from "../../config/types";
import type { CompositeSimulationGenome } from "./types";

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
