import { parseArgsString } from "@/scripts/lib/args-parser";

export const actionTest = async () => {
  console.log('test action');

  // const argsString = '  -qwe  --my-first-argument   1 --my-second-argument --my-third-argument 33 44 55 -a 1 2 -b test -c -def -g 123';
  const argsString = '  --my-first-argument   1 --my-second-argument --my-third-argument 33 44 55 -a 1 2 -b test -c -def -g 123 --test 345 --test 789';
  const parsedArgs = parseArgsString(argsString)

  console.log(parsedArgs);
}
