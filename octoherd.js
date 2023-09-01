import chalk from "chalk";
import yargs from "yargs";
import { gray } from "fmt/colors.ts";

import { octoherd } from "./index.js";
import { VERSION } from "./version.js";
import runCommand from "./bin/commands/run.js";

const argv = await yargs(Deno.args)
  .command(runCommand)
  .demandCommand()
  .version(VERSION)
  .epilog(EPILOG)
  .parse();

try {
  octoherd(argv);
} catch (error) {
  console.error({ error });
  Deno.exit(1);
}
