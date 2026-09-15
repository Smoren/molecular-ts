import { describe, expect, it } from '@jest/globals';
import type { TypesConfig, WorldConfig } from '../../src/lib/config/types';
import { createBaseWorldConfig } from '../../src/lib/config/world';
import { createTransparentTypesConfig } from '../../src/lib/config/atom-types';
import { createAtom } from '../../src/lib/utils/functions';
import { LinkManager, RulesHelper } from '../../src/lib/utils/structs';

function createWorldConfig(): WorldConfig {
  return createBaseWorldConfig();
}

function createTypesConfig(): TypesConfig {
  const config = createTransparentTypesConfig(3);
  config.LINKS = [3, 3, 3];
  config.TYPE_LINKS = [
    [2, 2, 0],
    [2, 2, 2],
    [0, 2, 2],
  ];
  config.TYPE_LINK_WEIGHTS = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  return config;
}

function createRulesHelper(typesConfig: TypesConfig): RulesHelper {
  return new RulesHelper(createWorldConfig(), typesConfig);
}

describe('rules helper canLink', () => {
  it('allows link when both type limits are not exhausted', () => {
    const rulesHelper = createRulesHelper(createTypesConfig());
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);

    expect(rulesHelper.canLink(lhs, rhs)).toBe(true);
  });

  it('rejects link when type links limit exhausted', () => {
    const typesConfig = createTypesConfig();
    const rulesHelper = createRulesHelper(typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(2, [130, 100]);

    // TYPE_LINKS[0][2] = 0: тип 0 не связывается с типом 2
    expect(rulesHelper.canLink(lhs, rhs)).toBe(false);
  });

  it('rejects link when total weighted bonds limit exhausted', () => {
    const typesConfig = createTypesConfig();
    const rulesHelper = createRulesHelper(typesConfig);
    const links = new LinkManager();
    const lhs = createAtom(0, [100, 100]);
    const first = createAtom(1, [130, 100]);
    const second = createAtom(1, [100, 130]);
    const third = createAtom(1, [130, 130]);
    links.create(lhs, first);
    links.create(lhs, second);
    links.create(lhs, third);

    // LINKS[0] = 3 исчерпан
    expect(rulesHelper.canLink(lhs, createAtom(1, [110, 110]))).toBe(false);
  });

  it('counts bonds by weight of the linked type', () => {
    const typesConfig = createTypesConfig();
    typesConfig.TYPE_LINK_WEIGHTS[0][1] = 2;
    const rulesHelper = createRulesHelper(typesConfig);
    const links = new LinkManager();
    const lhs = createAtom(0, [100, 100]);
    const first = createAtom(1, [130, 100]);
    links.create(lhs, first);

    // Одна связь с типом 1 весит 2 из лимита 3 — остаётся 1, вес 2 не проходит
    expect(rulesHelper.canLink(lhs, createAtom(1, [110, 110]))).toBe(false);
    // Связь с типом 0 весит 1 — проходит
    expect(rulesHelper.canLink(lhs, createAtom(0, [110, 110]))).toBe(true);
  });

  it('requires free slots on both sides', () => {
    const typesConfig = createTypesConfig();
    const rulesHelper = createRulesHelper(typesConfig);
    const links = new LinkManager();
    const lhs = createAtom(1, [100, 100]);
    const rhs = createAtom(1, [130, 100]);
    const other = createAtom(1, [100, 130]);
    const third = createAtom(1, [130, 130]);
    links.create(rhs, other);
    links.create(rhs, third);

    // У rhs (тип 1) исчерпан лимит связей с типом 1: TYPE_LINKS[1][1] = 2
    expect(rulesHelper.canLink(lhs, rhs)).toBe(false);
  });
});

describe('rules helper isLinkRedundant', () => {
  it('keeps link within limits', () => {
    const rulesHelper = createRulesHelper(createTypesConfig());
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);

    expect(rulesHelper.isLinkRedundant(lhs, rhs)).toBe(false);
  });

  it('marks link redundant when total weighted limit exceeded', () => {
    const typesConfig = createTypesConfig();
    typesConfig.LINKS[0] = 1;
    const rulesHelper = createRulesHelper(typesConfig);
    const links = new LinkManager();
    const lhs = createAtom(0, [100, 100]);
    const first = createAtom(1, [130, 100]);
    const second = createAtom(1, [100, 130]);
    links.create(lhs, first);
    links.create(lhs, second);

    // Лимит 1 превышен двумя связями — любая избыточна
    expect(rulesHelper.isLinkRedundant(lhs, second)).toBe(true);
  });

  it('marks link redundant when type links limit exceeded', () => {
    const typesConfig = createTypesConfig();
    typesConfig.TYPE_LINKS[0][1] = 1;
    const rulesHelper = createRulesHelper(typesConfig);
    const links = new LinkManager();
    const lhs = createAtom(0, [100, 100]);
    const first = createAtom(1, [130, 100]);
    const second = createAtom(1, [100, 130]);
    links.create(lhs, first);
    links.create(lhs, second);

    expect(rulesHelper.isLinkRedundant(lhs, second)).toBe(true);
  });
});

describe('rules helper handleTransform', () => {
  it('transforms lhs type on link creation', () => {
    const typesConfig = createTypesConfig();
    typesConfig.TRANSFORMATION = { 1: { 0: 2 } };
    const rulesHelper = createRulesHelper(typesConfig);
    const lhs = createAtom(1, [100, 100]);
    const rhs = createAtom(0, [130, 100]);

    const transformations = rulesHelper.handleTransform(lhs, rhs);

    expect(transformations).toEqual([[1, 2]]);
    expect(lhs.newType).toBe(2);
  });

  it('returns empty list without transformation rule', () => {
    const rulesHelper = createRulesHelper(createTypesConfig());
    const lhs = createAtom(1, [100, 100]);
    const rhs = createAtom(0, [130, 100]);

    expect(rulesHelper.handleTransform(lhs, rhs)).toEqual([]);
    expect(lhs.newType).toBeUndefined();
  });
});
