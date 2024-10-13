import type { UNARY_OPERATOR_FACTORY, BINARY_OPERATOR_FACTORY } from "@/lib/math/operations";
import type { TypesConfig } from "@/lib/types/config";
import type { Tensor } from "@/lib/math/types";

export enum OperationType {
  UNARY = 1,
  BINARY = 2,
}

export type FactoryArgument = {
  name: string;
  value: number;
}

export type UnaryFactoryName = keyof typeof UNARY_OPERATOR_FACTORY;
export type BinaryFactoryName = keyof typeof BINARY_OPERATOR_FACTORY;
export type FactoryName = UnaryFactoryName | BinaryFactoryName;

export type ArgumentName = keyof TypesConfig;
export type ArgumentValue = Tensor<number>;

export type OperationConfig = {
  type: OperationType;
  dimensions: number;
  factoryName: FactoryName;
  rightArgument?: ArgumentName;
}

export type OperationPipeConfig = {
  inputArgument: ArgumentName;
}

export interface OperationInterface {
  readonly config: OperationConfig;
  readonly factoryArgs: FactoryArgument[];
  setFactoryArgValues(values: number[]): OperationInterface;
  run(typesConfig: TypesConfig, leftArgumentValue: ArgumentValue): Tensor<number>;
}

export interface OperationPipeInterface {
  readonly config: OperationPipeConfig;
  readonly operations: OperationInterface[];
  run(typesConfig: TypesConfig): Tensor<number>;
  push(operation: OperationInterface): void;
  pop(): void;
}