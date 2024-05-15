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