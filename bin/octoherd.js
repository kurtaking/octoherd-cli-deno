import yargs from "yargs";

import { octoherd } from "../index.js";
import { VERSION } from "../version.js";
import runCommand from "./commands/run.js";

const EPILOG = `Questions? Ideas? Feedback?
https://github.com/octoherd/octoherd/discussions

Copyright 2020-${new Date().getFullYear()} Octoherd Contributors`;

const args = await yargs(Deno.args).command(runCommand).demandCommand().parse();

try {
  octoherd(args);
} catch (error) {
  console.error({ error });
  Deno.exit(1);
}
