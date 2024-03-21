import { SimulationConfig, SimulationInterface } from './types/simulation';
import { createAtom, LinkManager, RulesHelper } from './helpers';
import { InteractionManager } from './interaction';
import { InitialConfig, TypesConfig, WorldConfig } from './types/config';
import { AtomInterface } from './types/atomic';
import { DrawerInterface } from './types/drawer';
import { LinkManagerInterface } from './types/helpers';
import { InteractionManagerInterface } from './types/interaction';
import { ClusterManagerInterface } from './types/cluster';
import { ClusterManager } from './cluster';

export class Simulation implements SimulationInterface {
  private readonly typesConfig: TypesConfig;
  private readonly worldConfig: WorldConfig;
  private readonly initialConfig: InitialConfig;
  private readonly atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly linkManager: LinkManagerInterface;
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
    this.linkManager = new LinkManager();
    this.interactionManager = new InteractionManager(
      this.worldConfig,
      this.typesConfig,
      this.linkManager,
      new RulesHelper(this.typesConfig, this.worldConfig),
    );
    this.clusterManager = new ClusterManager(this.worldConfig.MAX_INTERACTION_RADIUS);

    this.drawer.addClickListener((coords, extraKey) => {
      if (extraKey === null || extraKey > this.typesConfig.FREQUENCIES.length) {
        return;
      }
      console.log('atom added');
      this.atoms.push(createAtom(extraKey-1, coords));
    });
  }

  start() {
    this.tick();
  }

  private tick() {
    // const ts = Date.now();
    for (let i=0; i<this.worldConfig.PLAYBACK_SPEED; ++i) {
      for (const atom of this.atoms) {
        // очищаем фактор соединений
        atom.linkDistanceFactor = 1;
        this.interactionManager.moveAtom(atom);
      }
      for (const atom of this.atoms) {
        this.clusterManager.handleAtom(atom, (lhs, rhs) => {
          this.interactionManager.interactAtomsStep1(lhs, rhs);
        });
      }
      for (const atom of this.atoms) {
        this.clusterManager.handleAtom(atom, (lhs, rhs) => {
          this.interactionManager.interactAtomsStep2(lhs, rhs);
        });
      }
      for (const link of this.linkManager) {
        this.interactionManager.interactLink(link);
      }
    }
    this.interactionManager.handleTime();

    // console.log('tick spent', Date.now()-ts);

    this.drawer.draw(this.atoms, this.linkManager);
    setTimeout(() => this.tick(), 10);
  }
}
