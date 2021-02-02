import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { ElectionOrganizer } from "./electionOrganizer.ts";

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
  .post("/register", async (context) => {
    const electionOrganizer: ElectionOrganizer = JSON.parse(
      await context.request.body().value,
    );
    electionOrganizer.created = new Date();
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
