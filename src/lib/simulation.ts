import type { SimulationConfig, SimulationInterface } from './types/simulation';
import type { AtomInterface } from './types/atomic';
import type { DrawerInterface } from './types/drawer';
import type { LinkManagerInterface } from './types/helpers';
import type { InteractionManagerInterface, PhysicModelInterface } from './types/interaction';
import type { ClusterManagerInterface } from './types/cluster';
import type { InitialConfig } from "./types/config";
import { ClusterManager } from './cluster';
import { createAtom, LinkManager, RulesHelper } from './helpers';
import { InteractionManager } from './interaction';

export class Simulation implements SimulationInterface {
  private readonly config: SimulationConfig;
  private atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly linkManager: LinkManagerInterface;
  private readonly interactionManager: InteractionManagerInterface;
  private readonly clusterManager: ClusterManagerInterface;
  private isRunning: boolean = false;

  constructor(config: SimulationConfig) {
    console.log(config);
    this.config = config;
    this.atoms = this.config.atomsFactory(this.config.worldConfig, this.config.typesConfig, this.config.initialConfig);
    this.drawer = this.config.drawer;
    this.linkManager = new LinkManager();
    this.interactionManager = new InteractionManager(
      this.config.worldConfig,
      this.config.typesConfig,
      this.linkManager,
      this.config.physicModel,
      new RulesHelper(this.config.typesConfig, this.config.worldConfig),
    );
    this.clusterManager = new ClusterManager(this.config.worldConfig.MAX_INTERACTION_RADIUS);

    this.drawer.addClickListener((coords, extraKey) => {
      if (extraKey === null || extraKey > this.config.typesConfig.FREQUENCIES.length) {
        return;
      }
      console.log('atom added');
      this.atoms.push(createAtom(extraKey-1, coords));
    });
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  refill(initialConfig?: InitialConfig) {
    this.clear();
    this.atoms = this.config.atomsFactory(
      this.config.worldConfig,
      this.config.typesConfig,
      initialConfig ?? this.config.initialConfig
    );
  }

  clear() {
    this.atoms.length = 0;
    this.clusterManager.clear();
    this.linkManager.clear();
    this.drawer.clear();
  }

  setPhysicModel(model: PhysicModelInterface): void {
    this.interactionManager.setPhysicModel(model);
  }

  private tick() {
    if (this.config.worldConfig.SPEED > 0) {
      for (let i=0; i<this.config.worldConfig.PLAYBACK_SPEED; ++i) {
        for (const atom of this.atoms) {
          this.interactionManager.clearDistanceFactor(atom);
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
    }

    this.drawer.draw(this.atoms, this.linkManager);

    if (this.isRunning) {
      setTimeout(() => this.tick(), 10);
    }
  }
}
