import { Router } from '@/scripts/lib/router';
import { objectUnaryOperation, round } from "@/lib/math";

export const createRouter = () => {
  const router = new Router();

  router.onBeforeRun(() => {
    console.log('***********************');
    console.log('** COMMAND LINE TOOL **');
    console.log('***********************');
    console.log('');
  });

  return router;
}

export function addLeadingZeros(num: number, totalLength: number): string {
  return `${'0'.repeat(Math.max(0, totalLength - String(num).length))}${num}`;
}

export function getCurrentDateTime(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
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

export function convertToTable(data: string[][], padding: number = 0): string {
  if (!data || data.length === 0) {
    return '';
  }

  const maxCols = Math.max(...data.map(row => row.length));

  const normalizedData = data.map(row =>
    row.concat(Array(maxCols - row.length).fill('')) // Добавляем пустые строки где нужно
  );

  const columnWidths: number[] = Array(maxCols).fill(0);
  for (let col = 0; col < maxCols; col++) {
    columnWidths[col] = Math.max(...normalizedData.map(row => (row[col]?.length || 0)));
  }

  const result: string[] = [];
  for (const row of normalizedData) {
    const rowString = row
      .map((cell, i) => cell.padEnd(columnWidths[i]+padding, ' ')) // Добавляем пробелы до максимальной длины
      .join(' '); // Разделитель
    result.push(rowString);
  }

  return result.join('\n');
}

export function formatRounded(num: number, precision: number): number {
  if (num === 0) {
    return 0;
  }

  let roundedNum = round(num, precision);

  if (roundedNum !== 0) {
    return roundedNum;
  }

  const significantDigits = Math.abs(Math.ceil(Math.log10(num))) + 1;
  return round(num, significantDigits);
}

export function formatRoundedRecursive<T extends Record<string, unknown>>(object: T, precision: number): T {
  return objectUnaryOperation(object, (x) => {
    if (typeof x === 'number') {
      return formatRounded(Number(x), precision);
    }
    if (typeof x === 'object') {
      return formatRoundedRecursive(x as Record<string, unknown>, precision);
    }
    return x;
  });
}
