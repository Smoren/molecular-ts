import type { UNARY_OPERATOR_FACTORY, BINARY_OPERATOR_FACTORY } from "../math/operations";
import type { TypesConfig } from "../config/types";
import type { Tensor } from "../math/types";

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
  factoryName: FactoryName;
  rightArgument?: ArgumentName;
}

export type OperationPipeConfig = {
  inputArgument: ArgumentName;
}

export interface OperationInterface {
  readonly config: OperationConfig;
  readonly factoryArgs: FactoryArgument[];
  get type(): OperationType;
  set type(type: OperationType);
  get factoryName(): FactoryName;
  set factoryName(name: FactoryName);
  setFactoryArgValues(values: number[]): OperationInterface;
  run(typesConfig: TypesConfig, leftArgumentValue: ArgumentValue): Tensor<number>;
}

export interface OperationPipeInterface {
  readonly config: OperationPipeConfig;
  readonly dimensions: number;
  readonly operations: OperationInterface[];
  run(): Tensor<number>;
  push(operation: OperationInterface): void;
  pop(): void;
}
