import yargs from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts";
import { octoherd } from "./index.js";
import runCommand from "./bin/commands/run.js";

const args = await yargs(Deno.args).command(runCommand).demandCommand().parse();
console.log({ args });

try {
  octoherd(args);
} catch (error) {
  console.error({ error });
  Deno.exit(1);
}
