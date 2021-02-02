import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "../deps.ts";
import { CreationUpdateDate, Name } from "./embeddedEntity.ts";

/**
 * A model which represents the organizer of an election. An election organizer can organize many elections. 
 * An election organizer has a name, email and password.
 */
@Entity()
export class ElectionOrganizer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column((type) => Name)
  name!: Name;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @OneToMany(() => Election, (election) => election.organizerID)
  elections!: Election[];

  @Column((type) => CreationUpdateDate)
  date!: CreationUpdateDate;
}
