import { Schema } from "../deps.ts";
import {
  string,
  Type,
} from "https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts";

/**
 * Schema for an election organizer, here will all of our
 * constraints for a election organizer be set.
 */
const ElectionOrganizerSchema = Schema({
  firstName: string.between(3, 60),
  lastName: string,
  email: string,
  password: string.min(6),
});

export type ElectionOrganizerModel = Type<typeof ElectionOrganizerSchema>;
export const electionOrganizerValidator = ElectionOrganizerSchema.destruct();
