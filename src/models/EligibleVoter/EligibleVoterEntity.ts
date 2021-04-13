import { Exclude } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Election } from '../Election/ElectionEntity'

/**
 * An entity for representing eligible voters for an election. Voters should only have an identification.
 * This relation is defined in order for an election organizer to specify which voters
 * have the rights to join an election
 */

@Entity()
export class EligibleVoter implements IEligibleVoter {
    @BeforeInsert()
    @BeforeUpdate()
    emailToLowercase() {
        this.identification = this.identification.toLowerCase()
    }

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 255 })
    @IsEmail()
    identification!: string

    @Column({ type: 'date', nullable: true })
    verified!: Date

    @ManyToMany(() => Election, (election) => election.eligibleVoters)
    elections!: Election[]
}

export interface IEligibleVoter {
    identification: string
}
