import yargs from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts";
import chalk from "chalk";
import { octoherd } from "./index.js";
import { VERSION } from "./version.js";
import runCommand from "./bin/commands/run.js";

const EPILOG = chalk.gray(`Questions? Ideas? Feedback?

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
