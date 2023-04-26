import { ColorVector, TypesConfig } from '../types/config';


function getRandomNumber(): number {
  return Math.round(Math.random()*255);
}

function getRandomColor(): [number, number, number] {
  return [getRandomNumber(), getRandomNumber(), getRandomNumber()];
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

export function createRandomTypesConfig(count: number): TypesConfig {
  const gravity: number[][] = [];
  for (let i=0; i<count; ++i) {
    gravity.push([]);
    for (let j=0; j<count; ++j) {
      gravity[i].push(Math.round(Math.random()*2 - 1));
    }
  }

  const typeLinks: number[][] = [];
  for (let i=0; i<count; ++i) {
    typeLinks.push([]);
    for (let j=0; j<count; ++j) {
      typeLinks[i].push(Math.round(Math.random()*3 + 1));
    }
  }

  const links: number[] = [];
  for (let i=0; i<count; ++i) {
    links.push(Math.round(Math.random()*4 + 1));
  }

  return {
    GRAVITY: gravity,
    LINKS: links,
    TYPE_LINKS: typeLinks,
    COLORS: createColors(count),
  };
}
