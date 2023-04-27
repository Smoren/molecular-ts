import { AtomInterface, LinkInterface } from './atomic';

export interface InteractionManagerInterface {
  handleTime(): void;
  moveAtom(atom: AtomInterface): void;
  interactLink(link: LinkInterface): void;
  interactAtom(atom: AtomInterface, neighbours: Iterable<AtomInterface>): void;
}
