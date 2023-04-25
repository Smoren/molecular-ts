import { SimulationConfig, SimulationInterface } from './types/simulation';
import { LinkManager, RulesHelper } from './helpers';
import { InteractionManager } from './interaction';
import { InitialConfig, TypesConfig, WorldConfig } from './types/config';
import { AtomInterface } from './types/atomic';
import { DrawerInterface } from './types/drawer';
import { LinkManagerInterface } from './types/helpers';
import { InteractionManagerInterface } from './types/interaction';

export class Simulation implements SimulationInterface {
  private readonly typesConfig: TypesConfig;
  private readonly worldConfig: WorldConfig;
  private readonly initialConfig: InitialConfig;
  private readonly atomsFactory: (
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    initialConfig: InitialConfig
  ) => AtomInterface[];
  private readonly atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly linkManager: LinkManagerInterface;
  private readonly interactionManager: InteractionManagerInterface;

  constructor({
    worldConfig,
    typesConfig,
    initialConfig,
    atomsFactory,
    drawer,
  }: SimulationConfig) {
    this.typesConfig = typesConfig;
    this.worldConfig = worldConfig;
    this.initialConfig = initialConfig;
    this.atomsFactory = atomsFactory;
    this.atoms = atomsFactory(this.worldConfig, this.typesConfig, this.initialConfig);
    this.drawer = drawer;
    this.linkManager = new LinkManager();
    this.interactionManager = new InteractionManager(
      this.worldConfig,
      this.typesConfig,
      this.linkManager,
      new RulesHelper(this.typesConfig, this.worldConfig),
    );
    this.drawer.initEventHandlers(() => this.atoms, () => this.linkManager);
  }

  start() {
    this.tick();
  }

  private tick() {
    for (let i=0; i<this.worldConfig.PLAYBACK_SPEED; ++i) {
      for (const atom of this.atoms) {
        // atom.speed[0] += 0.01;
        this.interactionManager.moveAtom(atom);
      }
      for (const link of this.linkManager) {
        this.interactionManager.interactLink(link);
      }
      for (const atom of this.atoms) {
        this.interactionManager.interactAtom(atom, this.atoms);
      }
    }
    this.drawer.clear();
    this.drawer.draw(this.atoms, this.linkManager);
    setTimeout(() => this.tick(), 10);
  }
}
