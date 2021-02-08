import { Schema } from "../deps.ts";
import {
  string,
  Type,
} from "https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts";

/**
 * Schema for an election organizer, here will all of our
 * constraints for a election organizer be set.
 */
export const ElectionOrganizerSchema = Schema({
  firstName: string,
  lastName: string,
  email: string,
  password: string.min(6),
});

export type ElectionOrganizerModel = Type<typeof ElectionOrganizerSchema>;
export const electionOrganizerValidator = ElectionOrganizerSchema.destruct();
