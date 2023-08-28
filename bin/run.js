import { octoherd } from "../index.js";
import runCommand from "./commands/run.js";
import yargs from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts";

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
