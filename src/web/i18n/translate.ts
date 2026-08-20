export function normalizeMessageKey(key: string): string {
  return key.replace(/\s+/g, ' ').trim();
}

export function formatMessage(template: string, args: Array<string | number>): string {
  let result = template;
  for (let i = 0; i < args.length; i++) {
    result = result.replaceAll(`{${i}}`, String(args[i]));
  }
  return result;
}
