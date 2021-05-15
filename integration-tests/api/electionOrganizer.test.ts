import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { StatusCodes } from 'http-status-codes'
import { getRegisteredOrganizer, loginOrganizer, registerElectionOrganizer } from '../helpers/electionOrganizer'
import { createEmail } from '../helpers/emailGenerator'
import { PATHS } from '../helpers/paths'
import { request } from './API'

const ORGANIZER_PATH = PATHS.ADMIN.ORGANIZER

let organizerData: IElectionOrganizer
let createdOrganizer: ElectionOrganizer
let token: string
beforeAll(async () => {
    const response = await registerElectionOrganizer()
    organizerData = response.organizer
    token = response.token
    createdOrganizer = await getRegisteredOrganizer(token)
})

it('should return unauthorized when when trying to get an election organizer without authorization', async () => {
    const response = await request.get(ORGANIZER_PATH())
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
})

it('should return unauthorized when trying to update a random organizer', async () => {
    const response = await request.put(ORGANIZER_PATH(2)).send({})
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
})

it('should return the logged in election organizer on get', async () => {
    const response = await request.get(ORGANIZER_PATH()).auth(token, { type: 'bearer' })
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body.firstName).toBe(organizerData.firstName)
    expect(response.body.lastName).toBe(organizerData.lastName)
    expect(response.body.email).toBe(organizerData.email)
    // password field should not be returned
    expect(response.body.password).toBeUndefined()
})

/**
 * Sends a PUT request to the organizer PUT endpoint for the organizer
 * @param organizer the update organizer
 * @returns return the response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendOrganizerPutRequest(organizer: ElectionOrganizer | any, id: number) {
    return await request.put(ORGANIZER_PATH(id)).auth(token, { type: 'bearer' }).send(organizer)
}

it('should update the election organizers email', async () => {
    const newEmail = createEmail()
    const response = await sendOrganizerPutRequest({ email: newEmail }, createdOrganizer.id)
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body.email).toBe(newEmail)
    expect(response.body.id).toBe(createdOrganizer.id)
})

it('should update the election organizers email and be able to login', async () => {
    const newEmail = createEmail()
    const updateResponse = await sendOrganizerPutRequest({ ...createdOrganizer, email: newEmail }, createdOrganizer.id)
    expect(updateResponse.statusCode).toBe(StatusCodes.OK)
    expect(updateResponse.body.email).toBe(newEmail)

    const loginResponse = await loginOrganizer({ email: newEmail, password: organizerData.password })
    expect(loginResponse.statusCode).toBe(StatusCodes.OK)
    expect(loginResponse.body).toContainKey('token')
})

it('should update the organizers password and be able to login with new password', async () => {
    const newPassword = 'AnovoteTest!123'
    const updateResponse = await sendOrganizerPutRequest(
        {
            ...createdOrganizer,
            password: newPassword
        },
        createdOrganizer.id
    )
    expect(updateResponse.statusCode).toBe(StatusCodes.OK)
    expect(updateResponse.body.id).toBe(createdOrganizer.id)
    expect(updateResponse.body.password).toBeUndefined()

    const loginResponse = await loginOrganizer({ email: createdOrganizer.email, password: newPassword })
    expect(loginResponse.statusCode).toBe(StatusCodes.OK)
    expect(loginResponse.body).toContainKey('token')

    const newPassword2 = 'AnotherPasswordHere1234!'
    const updateResponse2 = await sendOrganizerPutRequest(
        {
            password: newPassword2
        },
        // Set a random organizer id, as it should not effect the update
        createdOrganizer.id + 100
    )
    expect(updateResponse2.statusCode).toBe(StatusCodes.OK)
    expect(updateResponse2.body.id).toBe(createdOrganizer.id)
    expect(updateResponse2.body.password).toBeUndefined()

    const loginResponse2 = await loginOrganizer({ email: createdOrganizer.email, password: newPassword2 })
    expect(loginResponse2.statusCode).toBe(StatusCodes.OK)
    expect(loginResponse2.body).toContainKey('token')
})

it('should not update name or last name', async () => {
    const response = await sendOrganizerPutRequest(
        {
            firstName: 'new first name',
            lastName: 'new last name'
        },
        createdOrganizer.id
    )
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body.firstName).toBe(createdOrganizer.firstName)
    expect(response.body.lastName).toBe(createdOrganizer.lastName)
    expect(response.body.id).toBe(createdOrganizer.id)
})
