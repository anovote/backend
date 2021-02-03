import { Schema } from "../deps.ts";
import {
  array,
  number,
  string,
  Type,
} from "https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts";

const ElectionOrganizerSchema = Schema({
  firstName: string.between(3, 60),
  lastName: string,
  email: string,
  password: string.min(6),
});

export type ElectionOrganizer = Type<typeof ElectionOrganizerSchema>;
export const electionOrganizerValidator = ElectionOrganizerSchema.destruct();
