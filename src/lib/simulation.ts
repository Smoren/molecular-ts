import type { SimulationConfig, SimulationInterface } from './types/simulation';
import type { AtomInterface } from './types/atomic';
import type { DrawerInterface } from './types/drawer';
import type { LinkManagerInterface, RunningStateInterface } from './types/helpers';
import type { InteractionManagerInterface, PhysicModelInterface } from './types/interaction';
import type { ClusterManagerInterface } from './types/cluster';
import type { Summary, SummaryManagerInterface } from './types/analysis';
import { ClusterManager } from './cluster';
import { createAtom } from './utils/functions';
import { LinkManager, RulesHelper, RunningState } from './utils/structs';
import { InteractionManager } from './interaction';
import { SummaryManager } from './analysis/summary';
import type { NumericVector } from './math/types';
import type { Compound } from './types/analysis';
import { CompoundsCollector } from './analysis/compounds';

export class Simulation implements SimulationInterface {
  readonly config: SimulationConfig;
  private _atoms: AtomInterface[];
  private readonly _links: LinkManagerInterface;
  private readonly drawer: DrawerInterface;
  private readonly interactionManager: InteractionManagerInterface;
  private readonly clusterManager: ClusterManagerInterface;
  private readonly summaryManager: SummaryManagerInterface;
  private readonly runningState: RunningStateInterface;

  constructor(config: SimulationConfig) {
    this.config = config;
    this._atoms = this.config.atomsFactory(this.config.worldConfig, this.config.typesConfig);
    this._links = new LinkManager();
    this.drawer = this.config.drawer;
    this.summaryManager = new SummaryManager(this.config.typesConfig.FREQUENCIES.length);
    this.interactionManager = new InteractionManager(
      this.config.viewMode,
      this.config.worldConfig,
      this.config.typesConfig,
      this._links,
      this.config.physicModel,
      new RulesHelper(this.config.worldConfig, this.config.typesConfig),
      this.summaryManager,
    );
    this.clusterManager = new ClusterManager(this.config.worldConfig.MAX_INTERACTION_RADIUS);
    this.runningState = new RunningState();

    this.drawer.addClickListener((coords, extraKey) => {
      if (extraKey === null || extraKey > this.config.typesConfig.FREQUENCIES.length) {
        return;
      }
      console.log('atom added');
      this._atoms.push(createAtom(extraKey-1, coords));
    });
  }

  get atoms(): AtomInterface[] {
    return this._atoms;
  }

  get links(): LinkManagerInterface {
    return this._links;
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

  step() {
    this.summaryManager.startStep(this.config.typesConfig);

    if (this.config.worldConfig.SPEED > 0 && !this.runningState.isPaused) {
      for (let i=0; i<this.config.worldConfig.PLAYBACK_SPEED; ++i) {
        this.interact();
      }
    }

    this.drawer.draw(this._atoms, this._links);

    this.summaryManager.finishStep();
  }

  togglePause() {
    this.runningState.togglePause();
  }

  refill() {
    this.clear();
    this._atoms = this.config.atomsFactory(
      this.config.worldConfig,
      this.config.typesConfig,
    );
  }

  clear() {
    this._atoms.length = 0;
    this.clusterManager.clear();
    this._links.clear();
    this.drawer.clear();
  }

  setPhysicModel(model: PhysicModelInterface): void {
    this.interactionManager.setPhysicModel(model);
  }

  async exportState(): Promise<Record<string, unknown>> {
    const needToStart = this.runningState.isRunning;
    await this.stop();

    const result = {
      atoms: this._atoms.map(atom => atom.exportState()),
      links: [...this._links].map(link => link.exportState()),
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

    this._atoms = atoms.map(atom => createAtom(
      atom.type as number,
      atom.position as NumericVector,
      atom.speed as NumericVector,
      atom.id as number,
    ));

    const atomsMap = new Map<number, AtomInterface>();
    for (const atom of this._atoms) {
      atomsMap.set(atom.id, atom);
    }

    for (const link of links) {
      if (!atomsMap.has(link[0]) || !atomsMap.has(link[1])) {
        console.warn(link, atomsMap, atoms);
      }

      this._links.create(atomsMap.get(link[0])!, atomsMap.get(link[1])!);
    }

    if (needToStart) {
      this.start();
    }
  }

  exportCompounds(): Compound[] {
    const collector = new CompoundsCollector()
    collector.handleLinks(this._links);
    return collector.getCompounds();
  }

  private interact(): void {
    for (const atom of this._atoms) {
      this.interactionManager.clearDistanceFactor(atom);
      this.interactionManager.moveAtom(atom);
      this.summaryManager.noticeAtom(atom, this.config.worldConfig);
    }
    for (const atom of this._atoms) {
      this.clusterManager.handleAtom(atom, (lhs, rhs) => {
        this.interactionManager.interactAtomsStep1(lhs, rhs);
      });
    }
    for (const atom of this._atoms) {
      this.clusterManager.handleAtom(atom, (lhs, rhs) => {
        this.interactionManager.interactAtomsStep2(lhs, rhs);
      });
    }
    for (const link of this._links) {
      this.interactionManager.interactLink(link);
      this.summaryManager.noticeLink(link, this.config.worldConfig);
    }
    this.interactionManager.handleTime();
  }

  private tick() {
    this.runningState.confirmStart();

    this.step();

    if (this.summaryManager.step % 30 === 0) {
      console.log('time', this.summaryManager.step)
      console.log('SUMMARY', this.summary);
    }

    if (this.runningState.isRunning) {
      requestAnimationFrame(() => this.tick());
    } else {
      this.runningState.confirmStop();
    }
  }
}
