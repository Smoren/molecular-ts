import { ColorVector, RandomTypesConfig, TypesConfig } from '../types/config';


function getRandomColorNumber(): number {
  return Math.round(Math.random()*255);
}

function createRandomInteger([from, until]: [number, number]): number {
  return Math.round(Math.random() * (until - from)) + from;
}

function getRandomColor(): [number, number, number] {
  return [getRandomColorNumber(), getRandomColorNumber(), getRandomColorNumber()];
}

function createColors(count: number): Array<ColorVector> {
  const predefined: Array<ColorVector> = [
    [80, 170, 140],
    [200, 140, 100],
    [250, 20, 20],
  ];
  const result = [];
  for (let i=0; i<count; ++i) {
    if (predefined.length) {
      result.push(predefined.pop());
    } else {
      result.push(getRandomColor());
    }
  }
  return result;
}

export function createBaseTypesConfig(): TypesConfig {
  return {
    GRAVITY: [
      [-1, -1, 1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    LINKS: [1, 3, 2],
    TYPE_LINKS: [
      [0, 1, 1],
      [1, 2, 1],
      [1, 1, 2],
    ],
    COLORS: createColors(3),
  };
}

export function createRandomTypesConfig({
  TYPES_COUNT,
  GRAVITY_BOUNDS,
  LINK_TYPE_BOUNDS,
  LINK_BOUNDS,
}: RandomTypesConfig): TypesConfig {
  const gravity: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    gravity.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      gravity[i].push(createRandomInteger(GRAVITY_BOUNDS));
    }
  }

  const links: number[] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    links.push(createRandomInteger(LINK_BOUNDS));
  }

  const typeLinks: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    typeLinks.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      typeLinks[i].push(createRandomInteger(LINK_TYPE_BOUNDS));
    }
  }

  return {
    GRAVITY: gravity,
    LINKS: links,
    TYPE_LINKS: typeLinks,
    COLORS: createColors(TYPES_COUNT),
  };
}
