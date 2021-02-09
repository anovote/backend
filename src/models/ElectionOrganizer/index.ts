import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Election } from '@/models/Election'
import { IsElectionOrganizerAlreadyExists } from './IsElectionOganizerAlreadyExistsConstraint'
import { Contains, IsDateString, IsEmail, IsString, Max, MaxLength, MinLength } from 'class-validator'

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
  @IsElectionOrganizerAlreadyExists()
  @IsEmail()
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
