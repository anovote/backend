import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { IsPositive, MaxDate, MaxLength, MinLength } from 'class-validator'
import { Ballot } from '../Ballot/BallotEntity'

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

    @Column({ type: 'int' })
    @IsPositive()
    @MinLength(4)
    @MaxLength(10)
    voterId!: number

    @ManyToOne(() => Ballot, (ballot) => ballot.id)
    ballotId!: number
}
