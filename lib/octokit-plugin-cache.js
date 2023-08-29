import { URL } from "node:url";
import { dirname, join } from "node:path";
import { mkdirp } from "mkdirp";

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
      `${pathname}${page ? `-page-${page}` : ""}.json`
    );

    try {
      return JSON.parse(await Deno.readTextFileSync(cachePath));
    } catch (_error) {
      const response = await request(options);

      mkdirp.sync(dirname(cachePath));
      Deno.writeTextFileSync(cachePath, JSON.stringify(response));
      return response;
    }
  });
}
