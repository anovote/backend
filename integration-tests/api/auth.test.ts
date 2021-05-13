import { request } from './API'
import { StatusCodes } from 'http-status-codes'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'

const createEmail = () =>
    `email${(Date.now() + Math.random() * 10000).toFixed()}@mail${(Math.random() * 10000).toFixed()}.com`
const PATH = (extra: string | number) => `/api/public/auth/${extra}`

/**
 * REGISTER
 */
const REGISTER_PATH = PATH('register')
const USER = (): IElectionOrganizer => ({
    email: createEmail(),
    firstName: 'name',
    lastName: 'no name',
    password: 'Abc!1234567890'
})
it('should return 400 with no data on register', async () => {
    const response = await request.post(REGISTER_PATH)
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 400 with invalid email on register', async () => {
    const undefinedEmailUser = { ...USER(), email: undefined }
    const invalidEmailUser = { ...USER(), email: 'invalidEmail' }

    const undefinedEmailResponse = await request.post(REGISTER_PATH).send(undefinedEmailUser)
    const invalidEmailResponse = await request.post(REGISTER_PATH).send(invalidEmailUser)

    expect(undefinedEmailResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(invalidEmailResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 400 with no first name on register', async () => {
    const undefinedFirstNameUser = { ...USER(), firstName: undefined }
    const emptyStringFirstNameUser = { ...USER(), firstName: '' }

    const responseWithUndefinedFirstName = await request.post(REGISTER_PATH).send(undefinedFirstNameUser)
    const responseWithEmptyFirstName = await request.post(REGISTER_PATH).send(emptyStringFirstNameUser)

    expect(responseWithUndefinedFirstName.statusCode).toBe(StatusCodes.BAD_REQUEST)
    // expect(responseWithEmptyFirstName.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 400 with no last name on register', async () => {
    const undefinedLastNameUser = { ...USER(), lastName: undefined }
    const emptyStringLastNameUser = { ...USER(), lastName: '' }

    const responseWithUndefinedLastName = await request.post(REGISTER_PATH).send(undefinedLastNameUser)
    const responseWithEmptyLastName = await request.post(REGISTER_PATH).send(emptyStringLastNameUser)

    expect(responseWithUndefinedLastName.statusCode).toBe(StatusCodes.BAD_REQUEST)
    // expect(responseWithEmptyLastName.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 201 and token with valid data on register', async () => {
    const validUser = { ...USER() }
    const response = await request.post(REGISTER_PATH).send(validUser)

    expect(response.statusCode).toBe(StatusCodes.CREATED)
    expect(response.body).toContainKey('token')
})

/**
 * LOGIN
 */
const LOGIN_PATH = PATH('login')
it('should return 400 with no data on login', async () => {
    const response = await request.post(PATH('login'))
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 400 with invalid credentials on login', async () => {
    const response = await request.post(PATH('login')).send({ password: '...', email: 'email' })
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return token on valid credentials on login', async () => {
    const correctUser = USER()
    const responseRegister = await request.post(REGISTER_PATH).send(correctUser)
    const responseLogin = await request.post(LOGIN_PATH).send({ ...correctUser })
    expect(responseLogin.statusCode).toBe(StatusCodes.OK)
    expect(responseLogin.body).toContainKey('token')
})

/**
 * IS AUTHENTICATED
 */
