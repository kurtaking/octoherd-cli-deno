import * as clippy from "https://deno.land/x/clippy@v0.2.2/mod.ts";
import { Octokit } from "npm:@octoherd/octokit@^4.0.0";
import { createOAuthDeviceAuth } from "npm:@octokit/auth-oauth-device@^6.0.0";
import chalk from "npm:chalk@^5.0.0";
import enquirer from "npm:enquirer@^2.3.6";

export { default as yargs } from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts";

export { clippy, Octokit, createOAuthDeviceAuth, chalk, enquirer };
