import { AtomInterface, LinkInterface } from './atomic';

export interface InteractionManagerInterface {
  handleTime(): void;
  moveAtom(atom: AtomInterface): void;
  interactAtom(atom: AtomInterface, neighbours: Iterable<AtomInterface>): void;
}
