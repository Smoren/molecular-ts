export function parseArgsString(argsString: string): Record<string, string> {
  return Object.fromEntries(parseArgsArray(splitArgsString(formatArgsString(argsString))));
}

function parseArgsArray(args: string[]): [string, string][] {
  return args
    .map((x) => x.split(/ (.+)/).slice(0, 2))
    .map((x) => x.length === 1 ? [x[0], ''] : x) as [string, string][];
}

function splitArgsString(argsString: string): string[] {
  return argsString.split(' -').map((x, i) => i === 0 ? x : `-${x}`);
}

function formatArgsString(argsString: string): string {
  return argsString
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^(-[A-Za-z0-9]{2,})/, (_, p) => ' '+formatGluedArgsString(p))
    .replace(/ (-[A-Za-z0-9]{2,})/, (_, p) => ' '+formatGluedArgsString(p))
    .replace(/\s+/g, ' ')
    .trim();
}

function formatGluedArgsString(gluedArgsString: string): string {
  return gluedArgsString.slice(1).split('').map((x) => `-${x}`).join(' ');
}
