import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { IsEnum, IsInt, IsNotEmptyObject, IsString, Min, ValidateNested } from 'class-validator'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Vote } from '../Vote/VoteEntity'
import { BallotResultDisplay } from './BallotResultDisplay'
import { BallotStatus } from './BallotStatus'
import { BallotType } from './BallotType'
import { IBallot } from './IBallot'
/**
 * A ballot a voter can vote on.
 * The ballot can have many candidates which a eligible voter can submit a vote for.
 * The entity stores information about the ballot that is being held. As well as
 * special status and states.
 */

@Entity()
export class Ballot implements IBallot {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Election, (election) => election.id, { onDelete: 'CASCADE' })
    @IsNotEmptyObject()
    @ValidateNested()
    election!: Election

    @Column({ type: 'varchar' })
    @IsString()
    title!: string

    @Column({ type: 'text', nullable: true })
    description!: string

    @Column({ type: 'varchar', nullable: true })
    image!: string

    @IsEnum(BallotType)
    @Column({ type: 'enum', enum: BallotType, default: BallotType.SINGLE })
    type!: BallotType

    @Column({
        type: 'enum',
        enum: BallotResultDisplay,
        default: BallotResultDisplay.SINGLE
    })
    resultDisplayType!: BallotResultDisplay

    // How many results for the given display type to display
    @Column({ type: 'int4', nullable: true })
    resultDisplayTypeCount!: number

    // Boolean for display count for ballot result
    @Column({ type: 'boolean', default: false })
    displayResultCount!: boolean

    @Column({ type: 'int' })
    @IsInt()
    @Min(0)
    order!: number

    @IsEnum(BallotStatus)
    @Column({ type: 'enum', enum: BallotStatus, default: BallotStatus.IN_QUEUE })
    status!: BallotStatus

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    // Lazy votes relation. This is only loaded when accessed
    @OneToMany(() => Vote, (vote) => vote.ballot, { lazy: true })
    votes?: Promise<Vote[]>

    @OneToMany(() => Candidate, (candidate) => candidate.ballot, {
        cascade: true,
        eager: true,
        orphanedRowAction: 'delete'
    })
    candidates!: Candidate[]
}
