import { ManyToOne } from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/decorator/relations/ManyToOne.ts";
import { Column, Entity, PrimaryGeneratedColumn } from "../deps.ts";
import { ElectionOrganizer } from "./ElectionOrganizer.ts";

/**
 * An entity for storing an election. 
 * An election is instantiated by an election organizer. The election organizer can create many elections. 
 * An election hols information about the status, info and other information about the election. If the election requires to add eligble voters, 
 * an election can have many eligible voters. 
 * The purpose of an election entity is to hold ballots, which an election can have many of. 
 */

@Entity()
export class Election {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ElectionOrganizer, (organizer) => organizer.id)
  organizerID!: ElectionOrganizer;

  @Column({ type: String })
  title!: string;

  @Column({ type: "text" })
  description!: string;
}
