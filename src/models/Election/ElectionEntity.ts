import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'

import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { IElection } from '@/models/Election/IElection'
import { ElectionStatus } from '@/models/Election/ElectionStatus'

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
  id!: number

  @ManyToOne(() => ElectionOrganizer, (electionOrganizer: ElectionOrganizer) => electionOrganizer.elections)
  electionOrganizer!: ElectionOrganizer

  @Column({ type: String })
  title!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ type: String, nullable: true })
  image!: string

  @Column({ type: Date, nullable: true })
  openDate!: Date

  @Column({ type: Date, nullable: true })
  closeDate!: Date

  @Column({ type: String, nullable: true })
  password!: string

  @Column({ type: 'enum', enum: ElectionStatus, default: ElectionStatus.NotStarted })
  status!: ElectionStatus

  @Column({ type: 'boolean', default: true })
  isLocked!: boolean

  @Column({ type: 'boolean', default: false })
  isAutomatic!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToMany(() => EligibleVoter)
  @JoinTable()
  eligibleVoters!: EligibleVoter[]
}
