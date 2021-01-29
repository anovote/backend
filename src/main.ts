/**
 * Just some example code to se if the docker application is running
 */
import { serve } from "https://deno.land/std@0.84.0/http/server.ts";
import { Logger } from "https://deno.land/x/optic/mod.ts";

const logger = new Logger();


const s = serve({ port: 8000 });
console.log("http://fihsk:w/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
