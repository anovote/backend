import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { request } from '../api/API'
import { createEmail } from './emailGenerator'
import { PATHS } from './paths'

/**
 * Registers an organizer through the API and return the organizer details, and
 * authorization token.
 * @returns returns the organizer and token return on register
 */
export async function registerElectionOrganizer() {
    const organizer = createElectionOrganizer()
    const token = await (await request.post(PATHS.PUBLIC.REGISTER).send(organizer)).body.token
    return { token, organizer }
}

/**
 * Return the organizer with the given token
 * @param token token of an organizer
 * @returns return the organizer for the given token
 */
export async function getRegisteredOrganizer(token: string) {
    return await (await request.get(PATHS.ADMIN.ORGANIZER()).auth(token, { type: 'bearer' })).body
}

/**
 * Creates and returns an election organizer object with a random email
 * @returns return an election organizer with random email
 */
export const createElectionOrganizer = (): IElectionOrganizer => ({
    email: createEmail(),
    firstName: 'first name',
    lastName: 'last name',
    password: 'Abc!1234567890'
})
