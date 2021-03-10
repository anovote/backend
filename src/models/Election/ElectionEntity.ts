import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IElection } from '@/models/Election/IElection'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { Exclude } from 'class-transformer'
import { IsOptional, IsPositive, MinDate } from 'class-validator'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { IsEarlierThan } from '../constraints/isEarlierThan'
import { SocketRoomEntity } from '../SocketRoom/SocketRoomEntity'

/**
 * An entity for storing an election.
 * An election is instantiated by an election organizer. The election organizer can create many elections.
 * An election holds information about the status, info and other information about the election. If the election requires to add eligible voters,
 * an election can have many eligible voters.
 * The purpose of an election entity is to hold ballots, which an election can have many of.
 */
@Entity()
export class Election implements IElection {
    @PrimaryGeneratedColumn()
    @IsPositive()
    id!: number

    @ManyToOne(() => ElectionOrganizer, (electionOrganizer) => electionOrganizer.elections)
    electionOrganizer!: ElectionOrganizer

    @Column({ type: String })
    title!: string

    @Column({ type: 'text' })
    description!: string

    @Column({ type: String, nullable: true })
    image!: string

    @IsEarlierThan('closeDate', { message: 'Opening date must be before closing date' })
    @IsOptional({ always: true })
    @MinDate(new Date(), {
        groups: ['creation'],
        always: false
    })
    @Column({ type: Date, nullable: true })
    openDate?: Date

    @Column({ type: Date, nullable: true })
    closeDate?: Date

    @Exclude()
    @Column({ type: String, nullable: true })
    password!: string

    @Column({ type: 'enum', enum: ElectionStatus, default: ElectionStatus.NotStarted })
    status!: ElectionStatus

    @Column({ type: 'boolean', default: true })
    isLocked!: boolean

    @Column({ type: 'boolean', default: false })
    isAutomatic!: boolean

    @Exclude()
    @CreateDateColumn()
    createdAt!: Date

    @Exclude()
    @UpdateDateColumn()
    updatedAt!: Date

    @ManyToMany(() => EligibleVoter)
    @JoinTable()
    eligibleVoters!: EligibleVoter[]

    @Exclude()
    @OneToOne(() => SocketRoomEntity, (socketRoomEntity) => socketRoomEntity.election, { cascade: true, eager: true })
    @JoinColumn()
    socketRoom!: SocketRoomEntity
}
