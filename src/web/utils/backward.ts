import type { TypesConfig, TypesSymmetricConfig, WorldConfig } from '@/lib/types/config';
import { fullCopyObject } from '@/lib/utils/functions';

export function convertWorldConfigForBackwardCompatibility(inputConfig: WorldConfig): WorldConfig {
  return fullCopyObject(inputConfig);
}

export function convertTypesConfigForBackwardCompatibility(inputConfig: TypesConfig): TypesConfig {
  const config = fullCopyObject(inputConfig);

  renameKey(config, 'LINK_FACTOR_DISTANCE_EXTENDED', 'LINK_FACTOR_DISTANCE');

  return config;
}

export function convertTypesSymmetricConfigForBackwardCompatibility(inputConfig: TypesSymmetricConfig): TypesSymmetricConfig {
  return fullCopyObject(inputConfig);
}

function renameKey<T extends Record<string, unknown>>(input: T, oldKey: string, newKey: string): T {
  if (input[oldKey] !== undefined) {
    input[newKey as keyof T] = input[oldKey] as T[keyof T];
    delete input[oldKey];
  }
  return input;
}
