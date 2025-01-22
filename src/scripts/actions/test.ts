import { normalizeMatrixColumnsMinMax } from "@/lib/math";

export const actionTest = async () => {
  console.log('test action');
  const [normalized, min, max, mean] = normalizeMatrixColumnsMinMax([
    [1, 2, 3],
    [2, 2, 3],
    [3, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
    [2, 2, 3],
  ]);

  console.log(normalized, min, max, mean);
}
