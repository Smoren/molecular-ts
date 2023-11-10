import { AtomInterface, LinkInterface } from './atomic';

export interface InteractionManagerInterface {
  handleTime(): void;
  moveAtom(atom: AtomInterface): void;
  interactLink(link: LinkInterface): void;
  interactAtomStep1(atom: AtomInterface, neighbours: Iterable<AtomInterface>): void;
  interactAtomStep2(atom: AtomInterface, neighbours: Iterable<AtomInterface>): void;
}
