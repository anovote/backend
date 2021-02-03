import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "../deps.ts";
import { Election } from "./Election.ts";

/**
 * A model which represents the organizer of an election. An election organizer can organize many elections. 
 * An election organizer has a name, email and password.
 */
@Entity()
export class ElectionOrganizer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  firstName!: string;

  @Column({ type: "varchar" })
  lastName!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Election, (election: Election) => election.electionOrganizer)
  elections!: Election[];
}
