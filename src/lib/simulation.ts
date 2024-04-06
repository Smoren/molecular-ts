import type { SimulationConfig, SimulationInterface } from './types/simulation';
import type { AtomInterface } from './types/atomic';
import type { DrawerInterface } from './types/drawer';
import type { LinkManagerInterface } from './types/helpers';
import type { InteractionManagerInterface, PhysicModelInterface } from './types/interaction';
import type { ClusterManagerInterface } from './types/cluster';
import type { StepSummaryManagerInterface } from './types/summary';
import type { InitialConfig } from './types/config';
import { ClusterManager } from './cluster';
import { createAtom, LinkManager, roundWithStep, RulesHelper } from './helpers';
import { InteractionManager } from './interaction';
import { StepSummaryManager } from './summary';

export class Simulation implements SimulationInterface {
  private readonly config: SimulationConfig;
  private atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly linkManager: LinkManagerInterface;
  private readonly interactionManager: InteractionManagerInterface;
  private readonly clusterManager: ClusterManagerInterface;
  private readonly stepSummaryManager: StepSummaryManagerInterface;
  private isRunning: boolean = false;
  private step: number;
  private stepStarted: number;

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
    this.stepSummaryManager = new StepSummaryManager();
    this.step = 0;
    this.stepStarted = Date.now();

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
    this.handleStepSummary();

    if (this.isRunning) {
      setTimeout(() => this.tick(), 1);
    }
  }

  private handleStepSummary(): void {
    this.stepSummaryManager.buffer.ATOMS_COUNT = this.atoms.length;
    this.stepSummaryManager.buffer.LINKS_COUNT = this.linkManager.length;
    this.stepSummaryManager.buffer.STEP_DURATION = Date.now() - this.stepStarted;
    this.stepSummaryManager.buffer.STEP_FREQUENCY = roundWithStep(1000 / this.stepSummaryManager.buffer.STEP_DURATION, 0.01);
    this.stepSummaryManager.save();
    this.stepStarted = Date.now();
    this.step++;

    if (this.step % 30 === 0) {
      console.log('SUMMARY', this.stepSummaryManager.summary);
    }
  }
}
