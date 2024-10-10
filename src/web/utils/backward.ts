import type { TypesConfig, TypesSymmetricConfig, WorldConfig } from '@/lib/types/config';
import { fullCopyObject } from '@/lib/utils/functions';

export function convertWorldConfigForBackwardCompatibility(inputConfig: WorldConfig): WorldConfig {
  return fullCopyObject(inputConfig);
}

export function convertTypesConfigForBackwardCompatibility(inputConfig: TypesConfig): TypesConfig {
  return fullCopyObject(inputConfig);
}

export function convertTypesSymmetricConfigForBackwardCompatibility(inputConfig: TypesSymmetricConfig): TypesSymmetricConfig {
  return fullCopyObject(inputConfig);
}
