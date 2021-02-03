import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.85.0/fmt/colors.ts";

import electionRouter from "./routes/electionsRoutes.ts";
import electionOrganizerRouter from "./routes/electionOrganizerRoutes.ts";

export class HTTPServer {
  readonly PORT: number = 8000;

  constructor() {}

  async runHTTPServer() {
    const HTTP_ROUTER: Router = new Router();

    /**
     * These are all example routes and not meant to be
     * part of a solution. For a final solution the routes
     * needs to be changed to the desired needs.
     */
    HTTP_ROUTER
      .get("/", (context) => {
        context.response.body = "Hello world!";
      });
    // .post("/register", async (context) => {
    //   context.response.body = "You were registered";
    // });

    const app = new Application();
    app.use(HTTP_ROUTER.routes());
    app.use(HTTP_ROUTER.allowedMethods());
    app.use(electionOrganizerRouter.routes());
    app.use(electionOrganizerRouter.allowedMethods());
    app.use(electionRouter.routes());
    app.use(electionRouter.allowedMethods());

    app.addEventListener("listen", ({ secure, hostname, port }) => {
      const protocol = secure ? "https://" : "http://";
      const url = `${protocol}${hostname ?? "localhost"}:${port}`;
      console.log(
        `${yellow("Listening on:")} ${green(url)}`,
      );
    });

    await app.listen({ port: this.PORT });
  }
}
