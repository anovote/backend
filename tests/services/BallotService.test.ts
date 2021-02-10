import { Election } from '@/models/Election'
import { ElectionOrganizer } from '@/models/ElectionOrganizer'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { createDummyElection, deleteDummyElections } from '../helpers/seed/election'
import { createDummyOganizer, deleteDummyOrganizer } from '../helpers/seed/organizer'

let db: Connection
let organizer: ElectionOrganizer
let election: Election

beforeAll(async () => {
  db = await getTestDatabase()
  organizer = await createDummyOganizer(db)
  election = await createDummyElection(db, organizer)
})

afterAll(async () => {
  await deleteDummyElections(db, [election])
  await deleteDummyOrganizer(db, organizer)
})

it('should create a ballot', () => {
  expect(false).toBe(true)
})

it('should not create a ballot if election does not exist', () => {
  expect(false).toBe(true)
})

it('should not create a ballot', () => {
  expect(false).toBe(true)
})

it('should return the ballot with given id', () => {
  expect(false).toBe(true)
})

it('should return undefined if ballot does not exist', () => {
  expect(false).toBe(true)
})
