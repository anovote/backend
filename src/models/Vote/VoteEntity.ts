import { Candidate } from '@/models/Candidate/CandidateEntity'
import { IsPositive, MaxLength, MinLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Ballot } from '../Ballot/BallotEntity'
import { IVote } from './IVote'

/**
 * Represents the vote on a candidate for a given ballot.
 * A voter can vote on many candidates
 */
@Entity()
export class Vote implements IVote {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Candidate, (candidate) => candidate.id, { nullable: true, eager: true })
    candidate!: number | null | Candidate | 'blank'

    @CreateDateColumn()
    submitted!: Date

    @Column({ type: 'int' })
    @IsPositive()
    @MinLength(4)
    @MaxLength(10)
    voter!: number

    @ManyToOne(() => Ballot, (ballot) => ballot.id, { onDelete: 'CASCADE' })
    ballot!: number
}
