import yargs from "yargs";

import { octoherd } from "../index.js";
import runCommand from "./commands/run.js";

/**
 * Function is used by Octoherd Script modules to provide a dedicated CLI binary
 *
 *     import { script } from "./script.js";
 *     import { run } from "@octoherd/cli/run";
 *     run(script);
 *
 * @param {function} script Octoherd Script function
 */
export async function run(script) {
  const argv = await yargs(["run", ...Deno.args])
    .command(runCommand)
    .default("octoherd-script", () => script).argv;

  try {
    octoherd(argv);
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}
