import type { ClusterizationTaskConfig, ReferenceTaskConfig } from "../types/genetic";
import { repeatRunSimulationForReferenceGrade } from "./grade";

export const referenceGradeMultiprocessingTask = async ([
  _,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: ReferenceTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatRunSimulationForReferenceGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatRunSimulationForReferenceGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const referenceGradeTask = async ([
  _,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: ReferenceTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return repeatRunSimulationForReferenceGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const clusterizationGradeMultiprocessingTask = async ([
  _,
  worldConfig,
  typesConfig,
  weights,
  checkpoints,
  repeats,
]: ClusterizationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatRunSimulationForClusterGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatRunSimulationForClusterGrade(worldConfig, typesConfig, weights, checkpoints, repeats);
}
