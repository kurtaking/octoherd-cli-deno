import yargs from "yargs";
import { octoherd } from "./index.js";
import runCommand from "./bin/commands/run.js";

const args = await yargs(Deno.args).command(runCommand).demandCommand().parse();

try {
  octoherd(args);
} catch (error) {
  console.error({ error });
  Deno.exit(1);
}
