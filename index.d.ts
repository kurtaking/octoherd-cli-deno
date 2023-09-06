import { components } from "npm:@octokit/openapi@^12.0.0";

export { Octokit } from "npm:@octoherd/octokit@^4.0.0";

export type Repository = components["schemas"]["repository"];

export type OctoherdOptions = {
  /** The Octoherd Script function */
  octoherdScript: Function;
  /** Personal Access Token: Requires the "public_repo" scope for public repositories, "repo" scope for private repositories. */
  octoherdToken: string;
  /** Array of repository names in the form of "repo-owner/repo-name". To match all repositories for an owner, pass "repo-owner/*" */
  octoherdRepos: string[];
  /** Cache responses for debugging */
  octoherdCache: boolean;
  /** Bypass confirmation prompts for mutating requests */
  octoherdBypassConfirms: boolean;

  /** `octoherdScript` may accept its own options */
  [key: string]: unknown;
};

/**
 * Find all releases in a GitHub repository or organization after a specified date
 */
export async function octoherd(options: OctoherdOptions): void;
