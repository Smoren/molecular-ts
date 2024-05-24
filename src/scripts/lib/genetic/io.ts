import fs from "node:fs";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import type { SimulationConfig } from "@/lib/types/simulation";
import type { TotalSummaryWeights } from "@/lib/types/analysis";
import { createWorldConfig2d } from "@/lib/config/world";
import { formatJsonString } from "./helpers";

export function getReferenceTypesConfig(fileName: string): TypesConfig {
  const simulationConfig = readJsonFile(`data/input/${fileName}`) as SimulationConfig;
  return simulationConfig.typesConfig;
}

export function getRandomizeConfig(fileName: string, typesCount: number): RandomTypesConfig {
  const worldConfig = readJsonFile(`data/input/${fileName}`) as RandomTypesConfig;
  worldConfig.TYPES_COUNT = typesCount;
  return worldConfig;
}

export function getWorldConfig(initialFileName: string): WorldConfig {
  const initialConfig = readJsonFile(`data/input/${initialFileName}`) as InitialConfig;
  return createWorldConfig2d(initialConfig);
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
