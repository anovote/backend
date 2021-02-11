import { Election } from '@/models/Election/ElectionEntity'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { IsElectionOrganizerUnique } from './constraints/IsElectionOrganizerUniqueConstraint'

/**
 * A model which represents the organizer of an election. An election organizer can organize many elections.
 * An election organizer has a name, email and password.
 */
@Entity()
export class ElectionOrganizer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar' })
  @IsString()
  firstName!: string

  @Column({ type: 'varchar' })
  @IsString()
  lastName!: string

  @Column({ type: 'varchar', length: 255 })
  @IsEmail()
  @IsElectionOrganizerUnique()
  email!: string

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => Election, (election) => election.electionOrganizer)
  elections!: Election[]
}
