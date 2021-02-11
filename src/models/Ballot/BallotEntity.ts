import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { IsString, Min } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { BallotResultDisplay } from './BallotResultDisplay'
import { BallotStatus } from './BallotStatus'
import { BallotType } from './BallotType'
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
  election!: Election | number

  @Column({ type: 'varchar' })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({ type: 'varchar', nullable: true })
  image!: string

  @Column({ type: 'enum', enum: BallotType })
  type!: BallotType

  @Column({
    type: 'enum',
    enum: BallotResultDisplay
  })
  resultDisplayType!: BallotResultDisplay

  // How many results for the given display type to display
  @Column({ type: 'int4', nullable: true })
  resultDisplayTypeCount!: number

  // Boolean for display count for ballot result
  @Column({ type: 'boolean', default: false })
  displayResultCount!: boolean

  @Column({ type: 'int' })
  @Min(0)
  order!: number

  @Column({ type: 'enum', enum: BallotStatus, default: BallotStatus.IN_QUEUE })
  status!: BallotStatus

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => Candidate, (candidate) => candidate.ballot)
  candidates!: Candidate[]
}
