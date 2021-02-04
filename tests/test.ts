import { assertEquals } from "../src/deps.ts";

/* Demo test */
Deno.test({
  name: "Test the test",
  fn: () => {
    const name = "anovote";
    assertEquals(name, "anovote");
  },
});
