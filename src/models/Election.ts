export interface Election {
  id: number;
  electionOrganizer: string;
  title: string;
  description: string;
  image?: string;
  openDate?: Date;
  closeDate?: Date;
  password: string;
  status: ElectionStatus;
  isLocked: boolean;
  isAutomatic: boolean;
  created?: Date;
  updated?: Date;
}

/**
 * Election status represent the state of the election
 */
export enum ElectionStatus {
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
