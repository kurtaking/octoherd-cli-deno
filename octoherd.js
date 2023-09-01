import yargs from "yargs";

import { octoherd } from "./index.js";
import { VERSION } from "./version.js";
import runCommand from "./bin/commands/run.js";
import { gray } from "fmt/colors.ts";

const EPILOG = gray(`Questions? Ideas? Feedback?
https://github.com/octoherd/octoherd/discussions

Copyright 2020-${new Date().getFullYear()} Octoherd Contributors`);

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
