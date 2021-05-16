import { IEntity } from '@/interfaces/IEntity'
import { IHasName } from '@/interfaces/IHasName'
import { IUpdatable } from '@/interfaces/IUpdatable'
import { Election } from '@/models/Election/ElectionEntity'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { IsElectionOrganizerUnique } from './constraints/IsElectionOrganizerUniqueConstraint'

/**
 * A model which represents the organizer of an election. An election organizer can organize many elections.
 * An election organizer has a name, email and password.
 */
@Entity()
export class ElectionOrganizer implements IEntity, IHasName, IUpdatable {
    @BeforeInsert()
    @BeforeUpdate()
    emailToLowercase() {
        this.email = this.email.toLowerCase()
    }

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar' })
    @IsString()
    @IsNotEmpty()
    firstName!: string

    @Column({ type: 'varchar' })
    @IsString()
    @IsNotEmpty()
    lastName!: string

    @Column({ type: 'varchar', length: 255 })
    @IsEmail()
    @IsElectionOrganizerUnique('id')
    email!: string

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @MinLength(6)
    @MaxLength(225)
    password!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @OneToMany(() => Election, (election) => election.electionOrganizer)
    elections!: Election[]
}
