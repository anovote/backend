import { assertEquals } from "https://deno.land/std@0.84.0/testing/asserts.ts";

/* Demo test */
Deno.test({
  name: "Test the test",
  fn: () => {
    const name = "anovote";
    assertEquals(name, "anovote");
  },
});
