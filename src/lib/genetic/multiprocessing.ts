import type { SimulationClusterizationTaskConfig, SimulationReferenceTaskConfig } from "../types/genetic";
import { repeatRunSimulationForComplexGrade } from "./grade";

export const simulationComplexGradeTaskMultiprocessing = async ([
  id,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: SimulationReferenceTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatRunSimulationForComplexGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatRunSimulationForComplexGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const simulationComplexGradeTaskSingle = async ([
  id,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: SimulationReferenceTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return repeatRunSimulationForComplexGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const simulationClusterGradeTaskMultiprocessing = async ([
  id,
  worldConfig,
  typesConfig,
  weights,
  checkpoints,
  repeats,
]: SimulationClusterizationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatRunSimulationForClusterGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatRunSimulationForClusterGrade(worldConfig, typesConfig, weights, checkpoints, repeats);
}
