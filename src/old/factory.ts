import { AtomConfig, InteractionMode, InteractionRule, TypesConfig } from './types';

const colors = ['ff0000', '00ff00', '0000ff', 'aaaa00', 'aa00aa', '00aaaa'].reverse();

export function createTypes(count: number) {
  const typeIds: number[] = [];
  for (let i=1; i<=count; ++i) {
    typeIds.push(i);
  }
  const types: TypesConfig = {};
  for (let i=1; i<=count; ++i) {
    types[i] = createType(typeIds);
  }
  return types;
}

function createType(typeIds: number[]): AtomConfig {
  const interations: Record<number, InteractionRule> = {};
  for (const type of typeIds) {
    interations[type] = createInteractionRule();
  }
  return {
    color: colors.pop(),
    interactions: interations,
    maxLinksCount: Math.round(Math.random()*2+1),
  };
}

function createInteractionRule(): InteractionRule {
  return {
    mode: Math.round((Math.random()-0.5)*2) as InteractionMode,
    linksCount: Math.round(Math.random()*3),
  };
}
