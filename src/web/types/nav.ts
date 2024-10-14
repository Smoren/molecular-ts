export const AVAILABLE_MODES = [
  'RANDOMIZE',
  'SUMMARY',
  'EDIT_TYPES',
] as const;

export type BarModeAlias = (typeof AVAILABLE_MODES)[number];

export type BarMode = {
  alias: BarModeAlias;
  title: string;
};

export type BarModesMap = Record<BarModeAlias, BarMode>;
