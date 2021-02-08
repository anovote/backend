import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsOptional, IsString } from 'class-validator'
import { Election } from '@/models/entity/Election'

/**
 * A model which represents the organizer of an election. An election organizer can organize many elections.
 * An election organizer has a name, email and password.
 */
@Entity()
export class ElectionOrganizer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar' })
  firstName!: string

  @Column({ type: 'varchar' })
  lastName!: string

  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  @Length(3, 20)
  password!: string

  @CreateDateColumn()
  @IsOptional()
  createdAt!: Date

  @UpdateDateColumn()
  @IsOptional()
  updatedAt!: Date

  @OneToMany(() => Election, (election) => election.electionOrganizer)
  elections!: Election[]
}
