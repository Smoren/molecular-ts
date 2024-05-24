import { round } from "@/lib/math";

export function getNormalizedLossesSummary(losses: number[]): [number, number, number, number] {
  const minLoss = round(losses[0], 2);
  const meanLoss = round(losses.reduce((a, b) => a + b, 0) / losses.length, 2);
  const medianLoss = round(losses[round(losses.length/2, 0)], 2);
  const maxLoss = round(losses[losses.length-1], 2);

  return [minLoss, meanLoss, medianLoss, maxLoss];
}

export function getAbsoluteLossesSummary(losses: number[]): [number, number] {
  const minLoss = round(losses[0], 2);
  const meanLoss = round(losses.reduce((a, b) => a + b, 0) / losses.length, 2);

  return [minLoss, meanLoss];
}

export function formatJsonString(jsonStr: string) {
  const regex = /(\[)([\d\s.,-]+)(])/g;
  jsonStr = jsonStr.replace(regex, function(_, p1, p2, p3) {
    let numbersOnly = p2.replace(/\s+/g, ' ');
    return p1 + numbersOnly + p3;
  });
  jsonStr = jsonStr.replace(/\[ /g, '[');
  jsonStr = jsonStr.replace(/([0-9]) ]/g, '$1]');

  return jsonStr;
}
