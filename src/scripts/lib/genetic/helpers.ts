import { round } from "@/lib/math";

export function getScoresSummary(losses: number[], precision: number = 4): [number, number, number, number, number] {
  const best = round(losses[0], precision);
  const second = round(losses[1], precision);
  const mean = round(losses.reduce((a, b) => a + b, 0) / losses.length, precision);
  const median = round(losses[round(losses.length/2, 0)], precision);
  const worst = round(losses[losses.length-1], precision);

  return [best, second, mean, median, worst];
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
