import {
  array,
  boolean,
  DateType,
  number,
  Schema,
  string,
  Type,
} from "../deps.ts";

const MIN_PASSWORD_LENGTH = 6;

export type Election = Type<typeof ElectionSchema>;
// {
// id: number;
// electionOrganizer: string;
// title: string;
// description: string;
// image: string;
// openDate: Date;
// closeDate: Date;
// password: string;
// status: ElectionStatus;
// isLocked: boolean;
// isAutomatic: boolean;
// created: Date;
// updated: Date;
// };

/**
 * Election status represent the state of the election
 */
enum ElectionStatus {
  NotStarted,
  Started,
  Finished,
}

export const ElectionSchema = Schema({
  id: number,
  electionOrganizer: number,
  title: string,
  description: string,
  image: string.optional(),
  openDate: DateType,
  closeDate: DateType,
  password: string.min(MIN_PASSWORD_LENGTH).optional(),
  status: ElectionStatus,
  isLocked: boolean,
  isAutomatic: boolean,
});

// export { ElectionSchema };
