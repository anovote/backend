import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.85.0/fmt/colors.ts";
import electionRouter from "./routes/electionsRoutes.ts";

const PORT = 8000;

const router = new Router();

/**
 * These are all example routes and not meant to be
 * part of a solution. For a final solution the routes
 * needs to be changed to the desired needs.
 */
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/register", (context) => {
    context.response.body = "You were registered";
  })
  .get("/login", (context) => {
    context.response.body = "You logged in";
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(electionRouter.routes());
app.use(electionRouter.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(
    `${yellow("Listening on:")} ${green(url)}`,
  );
});

await app.listen({ port: PORT });
