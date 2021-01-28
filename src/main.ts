import { serve } from "https://deno.land/std@0.84.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://fiwerewrsk:w/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
