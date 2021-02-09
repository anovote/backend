import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Election } from '@/models/Election'
import { Candidate } from '@/models/Candidate'
import { BallotResultDisplay, BallotStatus, BallotType } from './enums'

/**
 * A ballot a voter can vote on.
 * The ballot can have many candidates which a eligible voter can submit a vote for.
 * The entity stores information about the ballot that is being held. As well as
 * special status and states.
 */

@Entity()
export class Ballot {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Election, (election) => election.id)
  election!: Election

  @Column({ type: String })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({ type: String, nullable: true })
  image!: string

  @Column({ type: 'enum', enum: BallotType })
  type!: BallotType

  @Column({
    type: 'enum',
    enum: BallotResultDisplay
  })
  resultDisplayType!: BallotResultDisplay

  // append an integer to result display count if display type is runner up for instance
  @Column({ type: 'int4', nullable: true })
  resultDisplayTypeCount!: number

  // Boolean for display count for ballot result
  @Column({ type: 'boolean', default: false })
  displayResultCount!: boolean

  @Column({ type: 'int' })
  order!: number

  @Column({ type: 'enum', enum: BallotStatus })
  status!: BallotStatus

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => Candidate, (candidate) => candidate.ballot)
  candidates!: Candidate[]
}
