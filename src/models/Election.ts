import { Column, Entity } from "https://deno.land/x/typeorm@v0.2.23-rc10/";

const MIN_PASSWORD_LENGTH = 6;

/**
 * Election status represent the state of the election
 */
enum ElectionStatus {
  NotStarted,
  Started,
  Finished,
}

@Entity()
export class Election {
  @Column()
  id: number;

  @Column()
  electionOrganizer: number;
  title: string;
  description: string;
  image: string;
  openDate: DateType;
  closeDate: DateType;
  password: string;
  status: ElectionStatus;
  isLocked: boolean;
  isAutomatic: boolean;
} // export { ElectionSchema };
