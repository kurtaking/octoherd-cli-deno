import { Octokit } from "npm:@octoherd/octokit@^4.0.0";
import { createOAuthDeviceAuth } from "npm:@octokit/auth-oauth-device@^6.0.0";
import chalk from "npm:chalk@^5.0.0";
import * as clippy from "https://deno.land/x/clippy@v0.2.2/mod.ts";
import enquirer from "npm:enquirer@^2.3.6";

import { cache as octokitCachePlugin } from "./lib/octokit-plugin-cache.js";
import { requestLog } from "./lib/octokit-plugin-request-log.js";
import { requestConfirm } from "./lib/octokit-plugin-request-confirm.js";
import { runScriptAgainstRepositories } from "./lib/run-script-against-repositories.js";
import { VERSION } from "./version.js";

export { Octokit } from "npm:@octoherd/octokit@^4.0.0";

const levelColor = {
  debug: chalk.bgGray.black,
  info: chalk.bgGreen.black,
  warn: chalk.bgYellow.black,
  error: chalk.bgRed.white.bold,
};

/**
 * @param {import(".").OctoherdOptions} options
 */
export async function octoherd(options) {
  const {
    octoherdToken,
    octoherdCache = false,
    octoherdScript,
    octoherdRepos,
    octoherdBypassConfirms,
    octoherdBaseUrl,
    ...userOptions
  } = options;

  const tmpLogFile = await Deno.makeTempFile({
    suffix: "ndjson.log",
  });

  const plugins = [requestLog, requestConfirm];
  if (typeof octoherdCache === "string") plugins.push(octokitCachePlugin);
  const CliOctokit = Octokit.plugin(...plugins);

  const authOptions = octoherdToken
    ? { auth: octoherdToken }
    : {
        authStrategy: createOAuthDeviceAuth,
        auth: {
          // Octoherd's OAuth App
          clientId: "e93735961b3b72ca5c02",
          clientType: "oauth-app",
          scopes: ["repo"],
          async onVerification({ verification_uri, user_code }) {
            console.log("Open %s", verification_uri);

            await clippy.write_text(user_code);
            console.log("Paste code: %s (copied to your clipboard)", user_code);

            console.log(
              `\n${chalk.gray(
                "To avoid this prompt, pass a token with --octoherd-token or -T"
              )}\n`
            );

            const prompt = new enquirer.Input({
              message: "Press <enter> when ready",
            });

            await prompt.run();
          },
        },
      };

  const octokit = new CliOctokit({
    ...authOptions,
    userAgent: ["octoherd-cli", VERSION].join("/"),
    baseUrl: octoherdBaseUrl,
    octoherd: {
      cache: octoherdCache,
      bypassConfirms: octoherdBypassConfirms,
      onLogMessage(level, message, additionalData) {
        // ignore the `octoherd` property in meta data
        const { _octoherd, ...meta } = additionalData;
        let additionalDataString = JSON.stringify(meta);

        if (additionalDataString.length > 300) {
          additionalDataString = additionalDataString.slice(0, 295) + " … }";
        }

        console.log(
          levelColor[level](" " + level.toUpperCase() + " "),
          Object.keys(meta).length
            ? `${message} ${chalk.gray(additionalDataString)}`
            : message
        );
      },
      onLogData(data) {
        Deno.writeTextFile(tmpLogFile, JSON.stringify(data) + "\n", {
          append: true,
        });
      },
    },
  });

  // trigger OAuth Device Flow before loading repositories
  // It's not necessary, but a better UX
  await octokit.auth({ type: "oauth-user" });

  const state = {
    log: console,
    octokit,
    script: octoherdScript,
    userOptions,
    octoherdReposPassedAsFlag: !!octoherdRepos,
  };

  await runScriptAgainstRepositories(state, octoherdRepos);

  console.log("");
  console.log(chalk.gray("-".repeat(80)));
  console.log("");
  console.log(`Log file written to ${tmpLogFile}`);

  if ("octoherdCache" in options) {
    console.log(
      "Request cache written to %s",
      options.octoherdCache || "./cache"
    );
  }
}
