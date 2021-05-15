import { Expose } from 'class-transformer'

/**
 * Represents the DTO for an election organizer to be updated
 */
export interface IElectionOrganizerUpdateDTO {
    email?: string
    password?: string
}

/**
 * Represents the instance object for a Organizer update DTO
 * Exposes all fields that should be available on class transform.
 */
export class ElectionOrganizerUpdateDTO {
    @Expose()
    email?: string
    @Expose()
    password?: string
}
