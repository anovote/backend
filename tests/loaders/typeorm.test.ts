import dbLoader from '@/loaders/typeorm'
import { Connection } from 'typeorm'

let dbConnection: Connection

beforeAll(async () => {
  dbConnection = await dbLoader()
})

afterAll(async () => {
  await dbConnection.close()
})

it('should get a connecton to the database', () => {
  expect(dbConnection).toBeDefined()
})
