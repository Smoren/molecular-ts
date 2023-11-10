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
      [1, -1],
      [1, -1],
    ],
    COLORS: createColors(2),
  };
}

export function createRandomTypesConfig({
  TYPES_COUNT,
  GRAVITY_BOUNDS,
}: RandomTypesConfig): TypesConfig {
  const gravity: number[][] = [];
  for (let i=0; i<TYPES_COUNT; ++i) {
    gravity.push([]);
    for (let j=0; j<TYPES_COUNT; ++j) {
      gravity[i].push(createRandomInteger(GRAVITY_BOUNDS));
    }
  }

  return {
    GRAVITY: gravity,
    COLORS: createColors(TYPES_COUNT),
  };
}
