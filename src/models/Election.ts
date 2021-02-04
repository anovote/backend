// import { IsNotEmpty } from "https://github.com/Tnifey/class-validator/raw/master/mod.ts";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "../deps.ts";
import { ElectionOrganizer } from "./ElectionOrganizer.ts";

import { EligibleVoter } from "./EligibleVoter.ts";

/**
 * Election status represent the state of the election
 */
export enum ElectionStatus {
  NotStarted,
  InProgress,
  Finished,
}

/**
 * An entity for storing an election. 
 * An election is instantiated by an election organizer. The election organizer can create many elections. 
 * An election hols information about the status, info and other information about the election. If the election requires to add eligible voters, 
 * an election can have many eligible voters. 
 * The purpose of an election entity is to hold ballots, which an election can have many of. 
 */

@Entity()
export class Election {
  @PrimaryGeneratedColumn()
  id!: number;

  // @ManyToOne(
  //   () => ElectionOrganizer,
  //   (electionOrganizer) => electionOrganizer.elections,
  // )
  // electionOrganizer!: ElectionOrganizer;

  @Column({ type: String })
  // @IsNotEmpty()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  // @Column({ type: String, nullable: true })
  // image!: string;

  // @Column({ type: Date, nullable: true })
  // openDate!: Date;

  // @Column({ type: Date, nullable: true })
  // closeDate!: Date;

  @Column({ type: String, nullable: true })
  password!: string;

  @Column(
    { type: "enum", enum: ElectionStatus },
  )
  status!: ElectionStatus;

  // @Column({ type: "boolean", default: true })
  // isLocked!: boolean;

  // @Column({ type: "boolean", default: false })
  // isAutomatic!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // @ManyToMany(() => EligibleVoter)
  // @JoinTable()
  // eligibleVoters!: EligibleVoter[];
}
