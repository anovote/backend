import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'

let dbConnection: Connection

beforeAll(async () => {
    dbConnection = await getTestDatabase()
})

afterAll(async () => {
    await dbConnection.close()
})

it('should get a connection to the database', () => {
    expect(dbConnection).toBeDefined()
})
