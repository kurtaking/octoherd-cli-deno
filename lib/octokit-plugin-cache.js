import { URL } from "node:url";
import { dirname, join } from "node:path";

import { mkdirp } from "npm:mkdirp@^3.0.0";
import jsonfile from "npm:jsonfile@^6.0.1";

export function cache(octokit, { octoherd: { cache } }) {
  octokit.hook.wrap("request", async (request, options) => {
    if (options.method !== "GET") {
      return request(options);
    }

    const { url } = octokit.request.endpoint.parse(options);

    const { pathname, searchParams } = new URL(url);
    const page = searchParams.get("page");
    const basePath = cache || "./cache";
    const cachePath = join(
      basePath,
      `${pathname}${page ? `-page-${page}` : ""}.json`,
    );

    try {
      return jsonfile.readFileSync(cachePath);
    } catch (error) {
      const response = await request(options);

      mkdirp.sync(dirname(cachePath));
      jsonfile.writeFileSync(cachePath, response);
      return response;
    }
  });
}
