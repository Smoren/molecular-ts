import { round } from "@/lib/math";

export function getScoresSummary(losses: number[], precision: number = 8): [number, number, number, number] {
  const bestLoss = round(losses[0], precision);
  const meanLoss = round(losses.reduce((a, b) => a + b, 0) / losses.length, precision);
  const medianLoss = round(losses[round(losses.length/2, 0)], precision);
  const worstLoss = round(losses[losses.length-1], precision);

  return [bestLoss, meanLoss, medianLoss, worstLoss];
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
