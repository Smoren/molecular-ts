type Route = ((...args: string[]) => void) | ((...args: string[]) => Promise<void>);

export class Router {
  private DEFAULT_ACTION = 'default';
  private readonly actions: Map<string, Route> = new Map();
  private beforeRun: (action: string, args: string[]) => void = () => {};

  constructor() {
    this.add(this.DEFAULT_ACTION, () => {
      console.log('Actions available:', [...this.actions.keys()]);
    });
  }

  onBeforeRun(callback: (action: string, args: string[]) => void): this {
    this.beforeRun = callback;
    return this;
  }

  add(action: string, callback: Route) {
    this.actions.set(action, callback);
  }

  run(args: string[]) {
    args = args.slice(2);
    const action = args[0] ?? this.DEFAULT_ACTION;
    const optionalArgs = args.slice(1);

    this.beforeRun(action, optionalArgs);

    if (this.actions.has(action)) {
      this.actions.get(action)!(...optionalArgs);
    } else {
      console.error(`Unknown action: ${action}`);
      this.actions.get(this.DEFAULT_ACTION)!();
    }
  }
}

export class ArgsParser {
  argsMap: Map<string, string> = new Map();

  constructor(args: string[]) {
    this.parse(args);
  }

  has(key: string): boolean {
    return this.argsMap.has(key);
  }

  get(key: string, defaultValue?: string): string | undefined {
    return this.argsMap.get(key) ?? defaultValue;
  }

  getString(key: string, defaultValue: string): string {
    return this.get(key, defaultValue) as string;
  }

  getInt(key: string, defaultValue: number): number {
    const value = this.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    return parseInt(value);
  }

  getNullableInt(key: string): number | undefined {
    const value = this.get(key);
    if (value === undefined) {
      return undefined;
    }
    return parseInt(value);
  }

  summary(): Record<string, string | string[]> {
    return Object.fromEntries(this.argsMap);
  }

  private parse(args: string[]) {
    for (const arg of args) {
      const exploded = arg.split('=');
      const [key, value] = exploded;
      this.argsMap.set(key, value);
    }
  }
}
