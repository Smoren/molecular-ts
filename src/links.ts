import { Atom, RulesConfig } from './types';

export class LinkManager {
  private config: RulesConfig;

  constructor(config: RulesConfig) {
    this.config = config;
  }

  public canLink(lhs: Atom, rhs: Atom): boolean {
    return this._canLink(lhs, rhs) && this._canLink(rhs, lhs);
  }

  protected _canLink(lhs: Atom, rhs: Atom): boolean {

  }
}
