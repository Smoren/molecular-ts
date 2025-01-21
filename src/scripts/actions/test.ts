import { normalizeMatrixColumnsMinMax } from "@/lib/math";

export const actionTest = async () => {
  console.log('test action');
  const [normalized, mean, min, max] = normalizeMatrixColumnsMinMax([
    [1, 2, 3],
    [2, 2, 3],
    [3, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
    [2, 2, 3],
  ]);

  console.log(normalized, mean, min, max);
}
