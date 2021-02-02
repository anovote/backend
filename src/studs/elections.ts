import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Election } from "../models/Election.ts";

const elections: Election[] = [
  {
    id: v4.generate(),
    isCompleted: false,
  },
  {
    id: v4.generate(),
    isCompleted: false,
  },
];

export default elections;
