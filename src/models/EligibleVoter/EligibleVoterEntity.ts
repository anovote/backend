import { Exclude } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * An entity for representing eligible voters for an election. Voters should only have an identification.
 * This relation is defined in order for an election organizer to specify which voters
 * have the rights to join an election
 */

@Entity()
export class EligibleVoter implements IEligibleVoter {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 255 })
    @IsEmail()
    @Exclude()
    identification!: string

    @Column({ type: 'date', nullable: true })
    verified!: Date
}

export interface IEligibleVoter {
    identification: string
}
