import type { SimulationConfig, SimulationInterface } from './types/simulation';
import type { AtomInterface } from './types/atomic';
import type { DrawerInterface } from './types/drawer';
import type { LinkManagerInterface } from './types/helpers';
import type { InteractionManagerInterface, PhysicModelInterface } from './types/interaction';
import type { ClusterManagerInterface } from './types/cluster';
import type { Summary, SummaryManagerInterface } from './types/summary';
import type { InitialConfig } from './types/config';
import { ClusterManager } from './cluster';
import { createAtom, LinkManager, RulesHelper } from './helpers';
import { InteractionManager } from './interaction';
import { SummaryManager } from './summary';

export class Simulation implements SimulationInterface {
  readonly config: SimulationConfig;
  private atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly linkManager: LinkManagerInterface;
  private readonly interactionManager: InteractionManagerInterface;
  private readonly clusterManager: ClusterManagerInterface;
  private readonly summaryManager: SummaryManagerInterface;
  private isRunning: boolean = false;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.atoms = this.config.atomsFactory(this.config.worldConfig, this.config.typesConfig, this.config.initialConfig);
    this.drawer = this.config.drawer;
    this.linkManager = new LinkManager();
    this.interactionManager = new InteractionManager(
      this.config.worldConfig,
      this.config.typesConfig,
      this.linkManager,
      this.config.physicModel,
      new RulesHelper(this.config.worldConfig, this.config.typesConfig),
    );
    this.clusterManager = new ClusterManager(this.config.worldConfig.MAX_INTERACTION_RADIUS);
    this.summaryManager = new SummaryManager(this.config.typesConfig.FREQUENCIES.length);

    this.drawer.addClickListener((coords, extraKey) => {
      if (extraKey === null || extraKey > this.config.typesConfig.FREQUENCIES.length) {
        return;
      }
      console.log('atom added');
      this.atoms.push(createAtom(extraKey-1, coords));
    });
  }

  get summary(): Summary<number[]> {
    return this.summaryManager.summary;
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

  exportState(): Record<string, unknown> {
    return {
      atoms: this.atoms.map(atom => atom.exportState()),
      links: [...this.linkManager].map(link => link.exportState()),
    };
  }

  importState(state: Record<string, unknown>): void {
    console.log('import state', state);
  }

  private tick() {
    this.summaryManager.startStep(this.config.typesConfig);

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
          this.summaryManager.noticeAtom(atom, this.config.worldConfig);
        }
        for (const link of this.linkManager) {
          this.interactionManager.interactLink(link);
          this.summaryManager.noticeLink(link, this.config.worldConfig);
        }
      }
      this.interactionManager.handleTime();
    }

    this.drawer.draw(this.atoms, this.linkManager);

    this.summaryManager.finishStep();
    if (this.summaryManager.step % 30 === 0) {
      // console.log('SUMMARY', this.summary);
    }

    if (this.isRunning) {
      requestAnimationFrame(() => this.tick());
    }
  }
}
