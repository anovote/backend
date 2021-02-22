import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Candidate } from '@/models/Candidate/CandidateEntity'

/**
 * Represents the vote on a candidate for a given ballot.
 * A voter can vote on many candidates
 */
@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Candidate, (candidate) => candidate.id)
  candidate!: number

  @CreateDateColumn()
  submitted!: Date

  @Column({ type: String })
  voterId!: string

  @Column({ type: String })
  ballotId!: string
}
