import yargs from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts";
import { octoherd } from "./index.ts";
import runCommand from "./bin/commands/run.ts";

const args = await yargs(Deno.args).command(runCommand).demandCommand().parse();

try {
  await octoherd(args);
} catch (error) {
  console.error({ error });
  Deno.exit(1);
}
