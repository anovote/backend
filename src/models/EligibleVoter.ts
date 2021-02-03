import { Column, Entity, PrimaryGeneratedColumn } from "../deps.ts";

/**
 * An entity for representing eligible voters for an election. Voters should only have an identification.
 * This relation is defined in order for an election organizer to specify which voters
 * have the rights to join an election
 */

@Entity()
export class EligibleVoter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  identification!: string;
}
