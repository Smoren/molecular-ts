import fs from "node:fs";
import type { CalcMetricsTask, Population } from "genetic-search";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import type { SimulationConfig } from "@/lib/types/simulation";
import type { SummaryMatrixRowObject, TotalSummaryWeights } from "@/lib/analysis/types";
import type {
  ClusterizationWeightsConfig,
  SimulationGeneticMainConfig,
  SimulationMainConfig,
  SimulationGenome,
} from "@/lib/genetic/types";
import { createWorldConfig2d } from "@/lib/config/world";
import { formatJsonString } from "./helpers";
import { getCacheInputFilePath, getPopulationInputFilePath } from "@/scripts/lib/helpers";

export function getGeneticMainConfig<TTaskConfig>(
  fileName: string,
  poolSize: number,
  task: CalcMetricsTask<TTaskConfig>,
): SimulationGeneticMainConfig<TTaskConfig> {
  const result = readJsonFile(`data/input/${fileName}`) as SimulationGeneticMainConfig<TTaskConfig>;
  result.metrics.poolSize = poolSize;
  result.metrics.task = task;
  result.metrics.onTaskResult = () => process.stdout.write('.');

  return result;
}

export function getSimulationMainConfig<TTaskConfig>(fileName: string): SimulationMainConfig<TTaskConfig> {
  return readJsonFile(`data/input/${fileName}`) as SimulationMainConfig<TTaskConfig>;
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

export function getRandomizeConfigCollection(fileName: string): RandomTypesConfig[] {
  return readJsonFile(`data/input/${fileName}`) as RandomTypesConfig[];
}

export function getWorldConfig(fileName: string, initialConfig: InitialConfig): WorldConfig {
  const worldConfig = readJsonFile(`data/input/${fileName}`) as WorldConfig;
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return createWorldConfig2d(initialConfig, worldConfig);
}

export function getReferenceWeights(fileName: string): TotalSummaryWeights {
  return readJsonFile(`data/input/${fileName}`) as TotalSummaryWeights;
}

export function getClusterizationWeights(fileName: string): ClusterizationWeightsConfig {
  return readJsonFile(`data/input/${fileName}`) as ClusterizationWeightsConfig;
}

export function getPopulation(fileName?: string): Population<SimulationGenome> | undefined {
  if (fileName === undefined) {
    return undefined;
  }
  return readJsonFile(getPopulationInputFilePath(fileName)) as Population<SimulationGenome>;
}

export function getCache(fileName?: string): Record<number, unknown> | undefined {
  if (fileName === undefined) {
    return undefined;
  }
  return readJsonFile(getCacheInputFilePath(fileName)) as Record<number, unknown>;
}

export function readJsonFile(path: string) {
  path = path.match(/\.json$/) ? path : `${path}.json`;

  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export function writeJsonFile(path: string, data: Record<number | string, unknown> | unknown[]) {
  path = path.match(/\.json$/) ? path : `${path}.json`;
  fs.writeFileSync(path, formatJsonString(JSON.stringify(data, null, 4)));
}
