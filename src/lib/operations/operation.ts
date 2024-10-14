import type {
  UnaryFactoryName,
  BinaryFactoryName,
  ArgumentValue,
  FactoryArgument,
  OperationConfig,
  OperationInterface,
  OperationPipeConfig,
  OperationPipeInterface,
} from "./types";
import { OperationType } from "./types";
import { getFunctionArgNames, getTensorDimensions } from "../math/helpers";
import {
  UNARY_OPERATOR_FACTORY,
  BINARY_OPERATOR_FACTORY,
  tensorBinaryOperation,
  tensorUnaryOperation,
} from "../math/operations";
import type { TypesConfig } from "../types/config";
import type { Tensor } from "../math/types";

export class Operation implements OperationInterface {
  public readonly config: OperationConfig;
  public readonly factoryArgs: FactoryArgument[] = [];

  constructor(config: OperationConfig) {
    this.config = config;
    this.initFactoryArgs();
  }

  setFactoryArgValues(values: number[]): OperationInterface {
    this.factoryArgs.forEach((arg, index) => {
      arg.value = values[index];
    });
    return this;
  }

  run(typesConfig: TypesConfig, leftArgumentValue: ArgumentValue): Tensor<number> {
    const factoryArgValues = this.factoryArgs.map((arg) => arg.value);

    if (this.config.type === OperationType.UNARY) {
      const factory = UNARY_OPERATOR_FACTORY[this.config.factoryName as UnaryFactoryName] as (...args: number[]) => (x: number) => number;
      const operator = factory(...factoryArgValues);

      return tensorUnaryOperation<number>(leftArgumentValue, operator as (x: number) => number);
    }

    if (this.config.type === OperationType.BINARY) {
      const factory = BINARY_OPERATOR_FACTORY[this.config.factoryName as BinaryFactoryName] as (...args: number[]) => (x: number) => number;
      const operator = factory(...factoryArgValues);

      const rightArgumentValue = this.config.rightArgument !== undefined
        ? (typesConfig[this.config.rightArgument] as ArgumentValue)
        : undefined;

      if (rightArgumentValue === undefined) {
        throw new Error('Right argument is not defined for binary operation.');
      }

      return tensorBinaryOperation<number>(leftArgumentValue, rightArgumentValue, operator as (x: number, y: number) => number);
    }

    throw new Error('Unknown operation type.');
  }

  private initFactoryArgs(): void {
    getFunctionArgNames(this.getFactory()).forEach((name) => {
      this.factoryArgs.push({ name, value: 0 });
    });
  }

  private getFactory(): (...args: number[]) => unknown {
    if (this.config.type === OperationType.UNARY) {
      return UNARY_OPERATOR_FACTORY[this.config.factoryName as UnaryFactoryName] as (...args: number[]) => unknown;
    } else if (this.config.type === OperationType.BINARY) {
      return BINARY_OPERATOR_FACTORY[this.config.factoryName as BinaryFactoryName] as (...args: number[]) => unknown;
    }
    throw new Error('Unknown operation type.');
  }
}

export class OperationPipe implements OperationPipeInterface {
  readonly config: OperationPipeConfig;
  readonly operations: OperationInterface[] = [];
  private readonly typesConfig: TypesConfig;

  constructor(config: OperationPipeConfig, typesConfig: TypesConfig) {
    this.config = config;
    this.typesConfig = typesConfig;
  }

  get dimensions(): number {
    return getTensorDimensions(this.typesConfig[this.config.inputArgument] as Tensor<number>);
  }

  push(operation: OperationInterface): void {
    this.operations.push(operation);
  }

  pop(): void {
    this.operations.pop();
  }

  run(): Tensor<number> {
    let current = this.typesConfig[this.config.inputArgument] as Tensor<number>;

    this.operations.forEach((operation) => {
      current = operation.run(this.typesConfig, current);
    });

    return current;
  }
}
