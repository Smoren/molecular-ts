import fs from "node:fs";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import type { SimulationConfig } from "@/lib/types/simulation";
import type { SummaryMatrixRowObject, TotalSummaryWeights } from "@/lib/types/analysis";
import type { GeneticMainConfig, SimulationMainConfig } from "@/lib/types/genetic";
import { createWorldConfig2d } from "@/lib/config/world";
import { formatJsonString } from "./helpers";

export function getGeneticMainConfig(fileName: string, poolSize: number): GeneticMainConfig {
  const result = readJsonFile(`data/input/${fileName}`) as GeneticMainConfig;
  result.runner.poolSize = poolSize;
  return result;
}

export function getSimulationMainConfig(fileName: string): SimulationMainConfig {
  return readJsonFile(`data/input/${fileName}`) as SimulationMainConfig;
}

export function getTypesConfig(fileName: string): TypesConfig {
  const simulationConfig = readJsonFile(`data/input/${fileName}`) as SimulationConfig;
  return simulationConfig.typesConfig;
}

export function getSummaryRowObject(fileName?: string): SummaryMatrixRowObject | undefined {
  if (fileName === undefined) {
    return undefined;
  }
  return readJsonFile(`data/input/${fileName}`) as SummaryMatrixRowObject;
}

export function getRandomizeConfig(fileName: string): RandomTypesConfig {
  return readJsonFile(`data/input/${fileName}`) as RandomTypesConfig;
}

export function getWorldConfig(fileName: string, initialConfig: InitialConfig): WorldConfig {
  const worldConfig = readJsonFile(`data/input/${fileName}`) as WorldConfig;
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return createWorldConfig2d(initialConfig, worldConfig);
}

export function getWeights(fileName: string): TotalSummaryWeights {
  return readJsonFile(`data/input/${fileName}`) as TotalSummaryWeights;
}

export function readJsonFile(path: string) {
  path = path.match(/\.json$/) ? path : `${path}.json`;

  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export function writeJsonFile(path: string, data: Record<number | string, unknown>) {
  path = path.match(/\.json$/) ? path : `${path}.json`;
  fs.writeFileSync(path, formatJsonString(JSON.stringify(data, null, 4)));
}
