export const AVAILABLE_MODES = [
  'RANDOMIZE',
  'SUMMARY',
  'EDIT_TYPES',
  'GENETIC',
] as const;

export type BarModeAlias = (typeof AVAILABLE_MODES)[number];

export type BarMode = {
  alias: BarModeAlias;
  title: string;
};

export type BarModesMap = Record<BarModeAlias, BarMode>;

function createModesMap(input: Array<[BarModeAlias, string]>): BarModesMap {
  const result = {} as BarModesMap;
  for (const [alias, title] of input) {
    result[alias] = { alias, title };
  }
  return result;
}

export const modesMap = createModesMap([
  ['RANDOMIZE', 'Randomize types config'],
  ['SUMMARY', 'Summary'],
  ['EDIT_TYPES', 'Edit types config'],
  ['GENETIC', 'Genetic search'],
]);
