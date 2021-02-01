import { Application, Router } from "https://deno.land/x/oak/mod.ts";

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

await app.listen({ port: 8000 });
