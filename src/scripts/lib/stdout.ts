export class StdoutInterceptor {
  private readonly originalWrite: Function;
  private readonly useAnsiCursor: boolean;

  constructor(useAnsiCursor: boolean = true) {
    this.useAnsiCursor = useAnsiCursor;
    this.originalWrite = process.stdout.write.bind(process.stdout);
  }

  startCountDots(formatString?: (count: number) => string) {
    if (!this.useAnsiCursor) {
      return;
    }

    let dotCount = 0;

    if (formatString === undefined) {
      formatString = (count: number) => String(count);
    }

    // @ts-ignore
    process.stdout.write = (chunk: any, encoding?: string, callback?: Function) => {
      if (typeof chunk === 'string') {
        const matches = chunk.match(/\./g);
        if (matches) {
          dotCount += matches.length;
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(formatString(dotCount));
          chunk = '';
        }
      }

      return this.originalWrite(chunk, encoding as BufferEncoding, callback);
    };
  }

  finish() {
    if (!this.useAnsiCursor) {
      return;
    }

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    // @ts-ignore
    process.stdout.write = this.originalWrite;
  }
}
