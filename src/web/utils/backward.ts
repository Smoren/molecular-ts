import type { TypesConfig, TypesSymmetricConfig, WorldConfig } from '@/lib/config/types';
import { fullCopyObject } from '@/lib/utils/functions';

export function convertWorldConfigForBackwardCompatibility(inputConfig: WorldConfig): WorldConfig {
  return fullCopyObject(inputConfig);
}

export function convertTypesConfigForBackwardCompatibility(inputConfig: TypesConfig): TypesConfig {
  const config = fullCopyObject(inputConfig);

  renameKey(config, 'LINK_FACTOR_DISTANCE_EXTENDED', 'LINK_FACTOR_DISTANCE');
  deleteKey(config, 'LINK_FACTOR_DISTANCE_USE_EXTENDED');

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

function deleteKey<T extends Record<string, unknown>>(input: T, key: string): T {
  if (input[key] !== undefined) {
    delete input[key];
  }
  return input;
}
