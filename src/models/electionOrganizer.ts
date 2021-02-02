import { DateType, number, Schema, string, Type } from "../deps.ts";

const MIN_PASSWORD_LENGTH: number = 6;

export type ElectionOrganizer = Type<typeof ElectionOrganizerSchema>;

export const ElectionOrganizerSchema = Schema({
  id: number,
  name: string,
  email: string,
  password: string.min(MIN_PASSWORD_LENGTH).optional(),
  created: DateType,
  updated: DateType,
});
