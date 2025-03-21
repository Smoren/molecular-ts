import { ArgsParser } from "@/scripts/lib/args-parser";

export const actionTest = async () => {
  try {
    const parser = new ArgsParser([
      {
        name: '--my-first-argument',
        alias: '-1',
        type: 'string',
        required: true,
        notEmpty: true,
        allowedValues: ['test', 'dev', 'prod'],
        validator: (x: unknown) => String(x).length > 2,
      },
      {
        name: '--my-second-argument',
        alias: '-2',
        type: 'boolean',
        required: true,
        default: false,
      },
      {
        name: '--my-third-argument',
        alias: '-3',
        type: 'number',
        multiple: true,
        default: [0, 1],
      },
    ]);

    const argsString = '--my-first-argument test -2 --my-third-argument 1 2 3';
    const parsedArgs = parser.parse(argsString);
    console.log(parsedArgs.all);

    const s = parsedArgs.get<string | undefined>('--my-first-argument');
    console.log(s);
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }


  // const argsString = '  -qwe  --my-first-argument   1 --my-second-argument --my-third-argument 33 44 55 -a 1 2 -b test -c -def -g 123';
  // const argsString = '  --my-first-argument   1 --my-second-argument --my-third-argument 33 44 55 -a 1 2 -b test -c -def -g 123 --test 345 --test 789';


  // console.log(parsedArgs);
}
