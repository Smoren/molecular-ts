import { SimulationConfig, SimulationInterface } from './types/simulation';
import { RulesHelper } from './helpers';
import { InteractionManager } from './interaction';
import { InitialConfig, TypesConfig, WorldConfig } from './types/config';
import { AtomInterface } from './types/atomic';
import { DrawerInterface } from './types/drawer';
import { InteractionManagerInterface } from './types/interaction';
import { ClusterManagerInterface } from './types/cluster';
import { ClusterManager } from './cluster';

export class Simulation implements SimulationInterface {
  private readonly typesConfig: TypesConfig;
  private readonly worldConfig: WorldConfig;
  private readonly initialConfig: InitialConfig;
  private readonly atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly interactionManager: InteractionManagerInterface;
  private readonly clusterManager: ClusterManagerInterface;

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
    this.atoms = atomsFactory(this.worldConfig, this.typesConfig, this.initialConfig);
    this.drawer = drawer;
    this.interactionManager = new InteractionManager(
      this.worldConfig,
      this.typesConfig,
      new RulesHelper(this.typesConfig, this.worldConfig),
    );
    this.clusterManager = new ClusterManager(this.worldConfig.MAX_INTERACTION_RADIUS);
  }

  start() {
    this.tick();
  }

  private tick() {
    for (let i=0; i<this.worldConfig.PLAYBACK_SPEED; ++i) {
      for (const atom of this.atoms) {
        this.interactionManager.moveAtom(atom);
      }
      for (const atom of this.atoms) {
        // this.interactionManager.interactAtom(atom, this.atoms);
        this.interactionManager.interactAtom(atom, this.clusterManager.handleAtom(atom));
      }
    }
    this.interactionManager.handleTime();
    this.drawer.draw(this.atoms);
    setTimeout(() => this.tick(), 10);
  }
}
