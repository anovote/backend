import { IOptionalCredentials } from '@/interfaces/ICredentials'
import { IEntity } from '@/interfaces/IEntity'
import { IHasName } from '@/interfaces/IHasName'
import { IUpdatable } from '@/interfaces/IUpdatable'
import { Exclude, Expose } from 'class-transformer'

/**
 * Represents the organizer that is to be created
 */
@Exclude()
export class ElectionOrganizerBaseDTO implements IHasName, IOptionalCredentials {
    @Expose()
    email = ''

    @Expose()
    password = ''

    @Expose()
    firstName = ''

    @Expose()
    lastName = ''
}
/**
 * Election organizer entity representation that is safe to return to a client
 */
@Exclude()
export class ElectionOrganizerEntityDTO implements IEntity, IUpdatable, IOptionalCredentials {
    @Expose()
    id!: number

    @Expose()
    email!: string

    @Expose()
    firstName!: string

    @Expose()
    lastName!: string

    @Expose()
    createdAt!: Date

    @Expose()
    updatedAt!: Date
}

/**
 * Represents the fields which are updatable for an election organizer
 */
@Exclude()
export class ElectionOrganizerUpdateDTO implements IOptionalCredentials {
    @Expose()
    email?: string

    @Expose()
    password?: string
}
