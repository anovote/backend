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
const createElectionOrganizer = (): IElectionOrganizer => ({
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
    const undefinedEmailUser = { ...createElectionOrganizer(), email: undefined }
    const invalidEmailUser = { ...createElectionOrganizer(), email: 'invalidEmail' }

    const undefinedEmailResponse = await request.post(REGISTER_PATH).send(undefinedEmailUser)
    const invalidEmailResponse = await request.post(REGISTER_PATH).send(invalidEmailUser)

    expect(undefinedEmailResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(invalidEmailResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 400 with no first name on register', async () => {
    const undefinedFirstNameUser = { ...createElectionOrganizer(), firstName: undefined }
    const emptyStringFirstNameUser = { ...createElectionOrganizer(), firstName: '' }

    const responseWithUndefinedFirstName = await request.post(REGISTER_PATH).send(undefinedFirstNameUser)
    const responseWithEmptyFirstName = await request.post(REGISTER_PATH).send(emptyStringFirstNameUser)

    expect(responseWithUndefinedFirstName.statusCode).toBe(StatusCodes.BAD_REQUEST)
    // expect(responseWithEmptyFirstName.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 400 with no last name on register', async () => {
    const undefinedLastNameUser = { ...createElectionOrganizer(), lastName: undefined }
    const emptyStringLastNameUser = { ...createElectionOrganizer(), lastName: '' }

    const responseWithUndefinedLastName = await request.post(REGISTER_PATH).send(undefinedLastNameUser)
    const responseWithEmptyLastName = await request.post(REGISTER_PATH).send(emptyStringLastNameUser)

    expect(responseWithUndefinedLastName.statusCode).toBe(StatusCodes.BAD_REQUEST)
    // expect(responseWithEmptyLastName.statusCode).toBe(StatusCodes.BAD_REQUEST)
})

it('should return 201 and token with valid data on register', async () => {
    const validUser = { ...createElectionOrganizer() }
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
    const correctOrganizer = createElectionOrganizer()
    await request.post(REGISTER_PATH).send(correctOrganizer)
    const responseLogin = await request.post(LOGIN_PATH).send({ ...correctOrganizer })
    expect(responseLogin.statusCode).toBe(StatusCodes.OK)
    expect(responseLogin.body).toContainKey('token')
})

/**
 * IS AUTHENTICATED
 */
const AUTHENTICATED_PATH = PATH('authenticated')
const RANDOM_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6ZXIiOmZhbHNlLCJpZCI6Mn0.Pk3s5v-OBY1a-rWgHk9IKTtkgdZq7-SDJ0QY3dKiXiw'

it('should return 200 with valid organizer bearer token', async () => {
    const correctOrganizer = createElectionOrganizer()
    await request.post(REGISTER_PATH).send(correctOrganizer)
    const responseLogin = await request.post(LOGIN_PATH).send({ ...correctOrganizer })
    const responseAuthenticated = await request
        .get(AUTHENTICATED_PATH)
        .auth(responseLogin.body.token, { type: 'bearer' })
    expect(responseAuthenticated.statusCode).toBe(200)
})

it('should return unauthorized with invalid bearer token', async () => {
    const responseAuthenticated = request.get(AUTHENTICATED_PATH).auth('RandomStringHere', { type: 'bearer' })
    const responseAuthenticated2 = request.get(AUTHENTICATED_PATH).auth(RANDOM_TOKEN, { type: 'bearer' })
    const results = await Promise.all([responseAuthenticated, responseAuthenticated2])
    for (const result of results) {
        expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    }
})
