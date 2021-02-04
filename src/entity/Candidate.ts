import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "../deps.ts";
import { Ballot } from "./barrel.ts";

/**
 * Represents a candidate for a ballot.
 * The candidate is the possible voting options for a ballot. 
 * Each candidate belongs to a ballot. A ballot can have many candidates
 */
@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: String })
  candidate!: string;

  @ManyToOne(() => Ballot, (ballot) => ballot.candidates)
  ballot!: Ballot;
}
