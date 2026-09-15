import { describe, expect, it } from '@jest/globals';
import type { TypesConfig, WorldConfig } from '../../src/lib/config/types';
import { createBaseWorldConfig } from '../../src/lib/config/world';
import { createTransparentTypesConfig } from '../../src/lib/config/atom-types';
import { createAtom } from '../../src/lib/utils/functions';
import { LinkManager, RulesHelper } from '../../src/lib/utils/structs';
import { SummaryManager } from '../../src/lib/analysis/summary';
import { InteractionManager } from '../../src/lib/simulation/interaction';
import { PhysicModelV1 } from '../../src/lib/physics/v1';
import type { AtomInterface } from '../../src/lib/simulation/types/atomic';

const VIEW_MODE = '2d';

function createWorldConfig(): WorldConfig {
  return createBaseWorldConfig();
}

function createTypesConfig(): TypesConfig {
  const config = createTransparentTypesConfig(3);
  // Разрешаем связи типа 0 со всеми, включая кросс-типы
  config.LINKS = [4, 4, 4];
  config.TYPE_LINKS = [
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 2],
  ];
  config.TYPE_LINK_WEIGHTS = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  config.LINK_FACTOR_DISTANCE[1][0] = [1.5, 1, 1];
  config.LINK_FACTOR_ELASTIC[1][0] = [2, 1, 1];
  return config;
}

function createInteractionManager(worldConfig: WorldConfig, typesConfig: TypesConfig): {
  interactionManager: InteractionManager;
  links: LinkManager;
} {
  const links = new LinkManager();
  const interactionManager = new InteractionManager(
    VIEW_MODE,
    worldConfig,
    typesConfig,
    links,
    new PhysicModelV1(worldConfig, typesConfig),
    new RulesHelper(worldConfig, typesConfig),
    new SummaryManager(typesConfig.FREQUENCIES.length),
  );
  return { interactionManager, links };
}

describe('interaction manager factor lifecycle', () => {
  it('clear resets distance and elastic factors to neutral', () => {
    const { interactionManager } = createInteractionManager(createWorldConfig(), createTypesConfig());
    const atom = createAtom(0, [100, 100]);

    interactionManager.updateDistanceFactor(atom, createAtom(1, [110, 100]));
    interactionManager.updateElasticFactor(atom, createAtom(1, [110, 100]));
    interactionManager.clearDistanceFactor(atom);
    interactionManager.clearElasticFactor(atom);

    expect(atom.linkDistanceFactors).toEqual([1, 1, 1]);
    expect(atom.linkElasticFactors).toEqual([1, 1, 1]);
  });

  it('accumulates distance and elastic factors multiplicatively', () => {
    const { interactionManager } = createInteractionManager(createWorldConfig(), createTypesConfig());
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [110, 100]);

    interactionManager.clearDistanceFactor(lhs);
    interactionManager.clearElasticFactor(lhs);
    // Два соседа типа 1: каждый умножает [1.5, 1, 1] и [2, 1, 1]
    interactionManager.updateDistanceFactor(lhs, rhs);
    interactionManager.updateDistanceFactor(lhs, rhs);
    interactionManager.updateElasticFactor(lhs, rhs);
    interactionManager.updateElasticFactor(lhs, rhs);

    expect(lhs.linkDistanceFactors).toEqual([2.25, 1, 1]);
    expect(lhs.linkElasticFactors).toEqual([4, 1, 1]);
    // Фактор связи lhs с частицей типа 0 (цель влияния соседа типа 1)
    expect(interactionManager.getDistanceFactor(lhs, createAtom(0, [0, 0]))).toBe(2.25);
  });

  it('accumulates link gravity delta additively', () => {
    const typesConfig = createTypesConfig();
    typesConfig.LINK_FACTOR_GRAVITY[1][0] = [0.5, 0, 0];
    const { interactionManager } = createInteractionManager(createWorldConfig(), typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [110, 100]);

    interactionManager.clearLinkGravityDelta(lhs);
    interactionManager.updateLinkGravityDelta(lhs, rhs);
    interactionManager.updateLinkGravityDelta(lhs, rhs);

    expect(lhs.linkGravityDeltas).toEqual([1, 0, 0]);
    // Дельта связи lhs с частицей типа 0 (цель влияния соседа типа 1)
    expect(interactionManager.getLinkGravityDelta(lhs, createAtom(0, [0, 0]))).toBe(1);
  });
});

describe('interaction manager link lifecycle', () => {
  it('interactAtomsStep1 updates factors only within max link radius', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const { interactionManager } = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const near = createAtom(1, [150, 100]);
    const far = createAtom(1, [100, 100 + worldConfig.MAX_LINK_RADIUS + 10]);

    interactionManager.clearDistanceFactor(lhs);
    interactionManager.interactAtomsStep1(lhs, near);
    interactionManager.interactAtomsStep1(lhs, far);

    // Влияние только от ближнего соседа
    expect(lhs.linkDistanceFactors).toEqual([1.5, 1, 1]);
  });

  it('interactAtomsStep2 creates link between linkable atoms in range', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const { interactionManager, links } = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);

    // В реальном цикле факторы инициализируются clear* перед каждым шагом
    interactionManager.clearDistanceFactor(lhs);
    interactionManager.clearDistanceFactor(rhs);
    interactionManager.interactAtomsStep2(lhs, rhs);

    expect(links.length).toBe(1);
    expect(lhs.bonds.has(rhs)).toBe(true);
  });

  it('interactAtomsStep2 does not create link beyond max link radius', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const { interactionManager, links } = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [100, 100 + worldConfig.MAX_LINK_RADIUS + 10]);

    interactionManager.interactAtomsStep2(lhs, rhs);

    expect(links.length).toBe(0);
  });

  it('interactAtomsStep2 does not create link when type links exhausted', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    typesConfig.TYPE_LINKS[0][1] = 0;
    const { interactionManager, links } = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);

    interactionManager.interactAtomsStep2(lhs, rhs);

    expect(links.length).toBe(0);
  });

  it('interactLink breaks link beyond effective max link radius', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const { interactionManager, links } = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);
    links.create(lhs, rhs);

    interactionManager.clearDistanceFactor(lhs);
    interactionManager.clearDistanceFactor(rhs);
    // Растягиваем связь за пределы максимальной длины
    rhs.position.set([100, 100 + worldConfig.MAX_LINK_RADIUS + 20]);
    interactionManager.interactLink([...links][0]);

    expect(links.length).toBe(0);
    expect(lhs.bonds.has(rhs)).toBe(false);
  });

  it('interactLink keeps link within effective max link radius', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const { interactionManager, links } = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);
    links.create(lhs, rhs);

    interactionManager.interactLink([...links][0]);

    expect(links.length).toBe(1);
  });

  it('interactLink breaks redundant link when limit exceeded', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    // Лимит связей типа 0 — 1 связь с весом 1
    typesConfig.LINKS[0] = 1;
    const { interactionManager, links } = createInteractionManager(worldConfig, typesConfig);
    const center = createAtom(0, [100, 100]);
    const first = createAtom(1, [130, 100]);
    const second = createAtom(1, [100, 130]);
    links.create(center, first);
    links.create(center, second);

    // Вторая связь превышает лимит — должна быть разорвана
    interactionManager.interactLink([...links][1]);

    expect(links.length).toBe(1);
    expect(center.bonds.has(first)).toBe(true);
    expect(center.bonds.has(second)).toBe(false);
  });

  it('updateAtomType applies pending type change to bonds counters', () => {
    const typesConfig = createTypesConfig();
    const { interactionManager, links } = createInteractionManager(createWorldConfig(), typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);
    links.create(lhs, rhs);

    lhs.newType = 2;
    interactionManager.updateAtomType(lhs);

    expect(lhs.type).toBe(2);
    expect(lhs.newType).toBeUndefined();
    // Счётчики связей у соседа обновлены на новый тип
    expect(rhs.bonds.lengthOf(2)).toBe(1);
    expect(rhs.bonds.lengthOf(0)).toBe(0);
  });
});

describe('interaction manager atom movement', () => {
  it('moveAtom applies speed, inertia and bounds force', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const { interactionManager } = createInteractionManager(worldConfig, typesConfig);
    const atom: AtomInterface = createAtom(0, [10, 500], [5, 0]);

    interactionManager.moveAtom(atom);

    // Скорость по x: приталкивание к границе + инерция
    expect(atom.position[0]).toBeGreaterThan(10);
    expect(atom.speed[0]).toBeGreaterThan(0);
    expect(atom.speed[0]).toBeLessThan(5);
    expect(atom.position[1]).toBe(500);
  });
});
