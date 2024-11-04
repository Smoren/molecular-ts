export class StdoutInterceptor {
  private readonly originalWrite: Function;

  constructor() {
    this.originalWrite = process.stdout.write.bind(process.stdout);
  }

  startCountDots(formatString?: (count: number) => string) {
    let dotCount = 0

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
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    // @ts-ignore
    process.stdout.write = this.originalWrite;
  }
}
