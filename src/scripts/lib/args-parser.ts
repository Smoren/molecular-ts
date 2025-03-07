type ArgType = 'string' | 'number' | 'boolean';

export type ArgConfig = {
  type: ArgType;
  name: string;
  alias?: string;
  description?: string;
  required?: boolean;
  notEmpty?: boolean;
  multiple?: boolean;
  default?: unknown;
  allowedValues?: unknown[];
  validator?: (value: unknown) => boolean;
}

export type FormattedArgConfig = ArgConfig & {
  required: boolean;
  notEmpty: boolean;
  multiple: boolean;
}

export class ArgsParserError extends Error {}

export class AddArgumentError extends ArgsParserError {}

export class ArgumentNameError extends ArgsParserError {}

export class ArgumentValueError extends ArgsParserError {}

export class ParsedArgumentsCollection {
  private readonly args: Record<string, unknown> = {};

  public add(name: string, value: unknown) {
    this.args[this.formatName(name)] = value;
  }

  public get<T = unknown>(name: string): T {
    return (this.args[this.formatName(name)] ?? undefined) as T;
  }

  public has(name: string): boolean {
    return this.args[this.formatName(name)] !== undefined;
  }

  public get all(): Record<string, unknown> {
    return { ...this.args };
  }

  private formatName(name: string): string {
    return name.replace(/^--/, '');
  }
}

export class ArgsParser {
  private readonly argsMap: Map<string, FormattedArgConfig> = new Map();
  private readonly aliasMap: Map<string, string> = new Map();
  private readonly usedArgs: Set<string> = new Set();

  constructor(args: ArgConfig[] = []) {
    for (const arg of args) {
      this.addArgument(arg);
    }
  }

  public addArgument(config: ArgConfig): ArgsParser {
    this.checkArgumentConfig(config);

    this.argsMap.set(config.name, this.formatArgConfig(config));
    this.usedArgs.add(config.name);

    if (config.alias !== undefined) {
      this.aliasMap.set(config.alias, config.name);
      this.usedArgs.add(config.alias);
    }

    return this;
  }

  public parse(argsString: string) {
    const required = new Set([...this.argsMap.values()].filter((x) => x.required));
    const notEmpty = new Set([...this.argsMap.values()].filter((x) => x.notEmpty));
    const hasDefault = new Set([...this.argsMap.values()].filter((x) => x.default !== undefined));

    const parsedArgs = parseArgsString(argsString);
    const result = new ParsedArgumentsCollection();

    for (const [key, value] of Object.entries(parsedArgs)) {
      const argConfig = this.getArgConfig(key);

      if (notEmpty.has(argConfig) && value === '') {
        throw new ArgumentValueError(`Argument ${this.formatNameWithAlias(argConfig)} value cannot be empty.`);
      }

      if (argConfig.allowedValues !== undefined && !argConfig.allowedValues.includes(value)) {
        throw new ArgumentValueError(`Argument ${this.formatNameWithAlias(argConfig)} value must be one of ${argConfig.allowedValues.join(', ')}.`);
      }

      if (argConfig.validator !== undefined && !argConfig.validator(value)) {
        throw new ArgumentValueError(`Argument ${this.formatNameWithAlias(argConfig)} value is invalid.`);
      }

      required.delete(argConfig);
      hasDefault.delete(argConfig);

      result.add(argConfig.name, castArgValue(value, argConfig.type, argConfig.multiple, argConfig.default));
    }

    for (const argConfig of hasDefault) {
      result.add(argConfig.name, argConfig.default);
      required.delete(argConfig);
    }

    if (required.size > 0) {
      throw new ArgumentValueError(`Required arguments not provided: ${[...required].map((x) => x.name).join(', ')}`);
    }

    return result;
  }

  private formatArgConfig(config: ArgConfig): FormattedArgConfig {
    return {
      ...config,
      required: config.required ?? false,
      notEmpty: config.notEmpty ?? false,
      multiple: config.multiple ?? false,
    };
  }

  private formatNameWithAlias(argConfig: ArgConfig): string {
    return `${argConfig.name} ${argConfig.alias ? `(${argConfig.alias})` : ''}`;
  }

  private checkArgumentConfig(config: ArgConfig) {
    if (!config.name.startsWith('--')) {
      throw new AddArgumentError(`Argument name must start with '--' ("${config.name}" given).`);
    }

    if (config.alias !== undefined && !config.alias.startsWith('-')) {
      throw new AddArgumentError(`Argument alias must start with '-' ("${config.alias}" given).`);
    }

    if (this.usedArgs.has(config.name)) {
      throw new AddArgumentError(`Argument ${config.name} already exists.`);
    }

    if (config.alias !== undefined && this.usedArgs.has(config.alias)) {
      throw new AddArgumentError(`Argument ${config.alias} already exists.`);
    }
  }

  private getArgConfig(key: string): FormattedArgConfig {
    const config = this.argsMap.get(this.aliasMap.get(key) ?? key);
    if (config === undefined) {
      throw new ArgumentNameError(`Unknown argument ${key}.`);
    }
    return config;
  }
}

function castArgValue(value: string, type: ArgType, multiple: boolean, defaultValue?: unknown): unknown {
  if (multiple) {
    const result = value.split(' ').filter((x) => x !== '').map((x) => castArgValue(x, type, false));
    return result.length > 0 ? result : defaultValue;
  }

  const _value = value !== '' ? value : (defaultValue ?? value);

  switch (type) {
    case 'string': return _value;
    case 'number': return Number(_value);
    case 'boolean': return _value !== 'false' && _value !== '0';
  }
}

function parseArgsString(argsString: string): Record<string, string> {
  return Object.fromEntries(parseArgsArray(splitArgsString(formatArgsString(argsString))));
}

function parseArgsArray(args: string[]): [string, string][] {
  return args
    .map((x) => x.split(/ (.+)/).slice(0, 2))
    .map((x) => x.length === 1 ? [x[0], ''] : x) as [string, string][];
}

function splitArgsString(argsString: string): string[] {
  return argsString.split(' -').map((x, i) => i === 0 ? x : `-${x}`);
}

function formatArgsString(argsString: string): string {
  return argsString
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^(-[A-Za-z0-9]{2,})/, (_, p) => ' '+formatGluedArgsString(p))
    .replace(/ (-[A-Za-z0-9]{2,})/, (_, p) => ' '+formatGluedArgsString(p))
    .replace(/\s+/g, ' ')
    .trim();
}

function formatGluedArgsString(gluedArgsString: string): string {
  return gluedArgsString.slice(1).split('').map((x) => `-${x}`).join(' ');
}
