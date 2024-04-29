import type { SimulationConfig, SimulationInterface } from './types/simulation';
import type { AtomInterface } from './types/atomic';
import type { DrawerInterface } from './types/drawer';
import type { LinkManagerInterface, RunningStateInterface } from './types/helpers';
import type { InteractionManagerInterface, PhysicModelInterface } from './types/interaction';
import type { ClusterManagerInterface } from './types/cluster';
import type { Summary, SummaryManagerInterface } from './types/summary';
import type { InitialConfig } from './types/config';
import { ClusterManager } from './cluster';
import { createAtom, LinkManager, RulesHelper, RunningState } from './helpers';
import { InteractionManager } from './interaction';
import { SummaryManager } from './summary';
import type { NumericVector } from './vector/types';

export class Simulation implements SimulationInterface {
  readonly config: SimulationConfig;
  private atoms: AtomInterface[];
  private readonly drawer: DrawerInterface;
  private readonly linkManager: LinkManagerInterface;
  private readonly interactionManager: InteractionManagerInterface;
  private readonly clusterManager: ClusterManagerInterface;
  private readonly summaryManager: SummaryManagerInterface;
  private readonly runningState: RunningStateInterface;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.atoms = this.config.atomsFactory(this.config.worldConfig, this.config.typesConfig, this.config.initialConfig);
    this.drawer = this.config.drawer;
    this.linkManager = new LinkManager();
    this.interactionManager = new InteractionManager(
      this.config.viewMode,
      this.config.worldConfig,
      this.config.typesConfig,
      this.linkManager,
      this.config.physicModel,
      new RulesHelper(this.config.worldConfig, this.config.typesConfig),
    );
    this.clusterManager = new ClusterManager(this.config.worldConfig.MAX_INTERACTION_RADIUS);
    this.summaryManager = new SummaryManager(this.config.typesConfig.FREQUENCIES.length);
    this.runningState = new RunningState();

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

  get isPaused(): boolean {
    return this.runningState.isPaused;
  }

  start() {
    this.runningState.start();
    this.tick();
  }

  async stop() {
    await this.runningState.stop();
  }

  togglePause() {
    this.runningState.togglePause();
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

  async exportState(): Promise<Record<string, unknown>> {
    const needToStart = this.runningState.isRunning;
    await this.stop();

    const result = {
      atoms: this.atoms.map(atom => atom.exportState()),
      links: [...this.linkManager].map(link => link.exportState()),
    };

    if (needToStart) {
      this.start();
    }

    return result;
  }

  async importState(state: Record<string, unknown>): Promise<void> {
    const needToStart = this.runningState.isRunning;
    await this.stop();

    this.clear();

    const atoms = state.atoms as Array<Record<string, unknown>>;
    const links = state.links as Array<number[]>;

    this.atoms = atoms.map(atom => createAtom(
      atom.type as number,
      atom.position as NumericVector,
      atom.speed as NumericVector,
      atom.id as number,
    ));

    const atomsMap = new Map<number, AtomInterface>();
    for (const atom of this.atoms) {
      atomsMap.set(atom.id, atom);
    }

    for (const link of links) {
      if (!atomsMap.has(link[0]) || !atomsMap.has(link[1])) {
        console.warn(link, atomsMap, atoms);
      }

      this.linkManager.create(atomsMap.get(link[0])!, atomsMap.get(link[1])!);
    }

    if (needToStart) {
      this.start();
    }
  }

  private tick() {
    this.runningState.confirmStart();
    this.summaryManager.startStep(this.config.typesConfig);

    if (this.config.worldConfig.SPEED > 0 && !this.runningState.isPaused) {
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

    if (this.runningState.isRunning) {
      requestAnimationFrame(() => this.tick());
    } else {
      this.runningState.confirmStop();
    }
  }
}
