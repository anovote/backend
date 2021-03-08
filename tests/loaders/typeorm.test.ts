import { Connection } from 'typeorm'
import setupConnection from '../helpers/setupTestDB'

let dbConnection: Connection

beforeAll(async () => {
    dbConnection = await setupConnection()
})

afterAll(async () => {
    await dbConnection.close()
})

it('should get a connection to the database', () => {
    expect(dbConnection).toBeDefined()
})
