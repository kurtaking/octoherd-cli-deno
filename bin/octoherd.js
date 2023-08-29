import yargs from "yargs";
import chalk from "chalk";

import { octoherd } from "../index.js";
import runCommand from "./commands/run.js";

const EPILOG = chalk.gray(`
  Questions? Ideas? Feedback?
  https://github.com/kurtaking/octoherd-cli-deno/issues
`);

const VERSION = "0.0.0-development";
const { argv } = yargs(Deno.args)
  .command(runCommand)
  .demandCommand()
  .version(VERSION)
  .epilog(EPILOG);

try {
  await octoherd(argv);
} catch (error) {
  console.error({ error });
  Deno.exit(1);
}
