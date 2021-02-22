import { deepCopy } from '@/helpers/object'
import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import setupConnection from '@/loaders/setupTestDB'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IElection } from '@/models/Election/IElection'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionService } from '@/services/ElectionService'
import { Connection } from 'typeorm'
import { createDummyOrganizer, deleteDummyOrganizer } from '../helpers/seed/organizer'

let db: Connection
let organizer: ElectionOrganizer
let electionService: ElectionService
let elections: Election[] = []
let seedElection: Election

beforeAll(async () => {
  db = await setupConnection()
  organizer = await createDummyOrganizer(db)
  electionService = new ElectionService(db)

  seedElection = await (electionService.createElection({
    electionOrganizer: organizer,
    title: 'Some title',
    description: 'Some long description',
    password: 'password',
    status: ElectionStatus.NotStarted,
    isLocked: true,
    isAutomatic: false
  }) as Promise<Election>)!
})

afterAll(async () => {
  try {
    for (const election of elections) {
      await electionService.deleteElectionById(election.id)
    }
    await electionService.deleteElectionById(seedElection.id)
    await deleteDummyOrganizer(db, organizer)
    await db.close()
  } catch (err) {
    console.log(err)
  }
})

it('should create a election with all data filled out', async () => {
  const election = await electionService.createElection({
    electionOrganizer: organizer,
    title: 'Test election',
    description: 'Description',
    image: 'image.png',
    openDate: new Date(),
    closeDate: new Date(),
    status: ElectionStatus.NotStarted,
    isLocked: false,
    isAutomatic: false
  })
  expect(election).toBeInstanceOf(Election)
  elections.push(election!)
})

it('should create a election without image, openDate and closeDate', async () => {
  const election = await electionService.createElection({
    electionOrganizer: organizer,
    title: 'Test election',
    description: 'Description',
    status: ElectionStatus.NotStarted,
    isLocked: false,
    isAutomatic: false
  })
  expect(election).toBeInstanceOf(Election)
  elections.push(election!)
})

it('should throw error when status is out of range', async () => {
  const election = deepCopy<IElection>(seedElection)
  election.status = 99 // Out of range of ENUM
  try {
    await electionService.createElection(election)
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }
})

it('should not update if no election exists', async () => {
  try {
    const updated = await electionService.updateElectionById(100, deepCopy<IElection>(seedElection))
  } catch (e) {
    expect(e).toBeInstanceOf(NotFoundError)
  }
})

it('should not change id of updated election', async () => {
  const passedInId = seedElection.id
  const data = deepCopy<Election>(seedElection)
  data.id = 5
  const election = await electionService.updateElectionById(passedInId, deepCopy<IElection>(data))
  expect(election!.id).toBe(passedInId)
})

it('should return the election with given id', async () => {
  const election = await electionService.getElectionById(seedElection.id)
  expect(election!.id).toBe(seedElection.id)
})

it('should return undefined if election does not exist', async () => {
  const election = await electionService.getElectionById(999999)
  expect(election).toBeUndefined()
})

it('should delete a election which exists', async () => {
  const election = await electionService.createElection({
    electionOrganizer: organizer,
    title: 'Test election',
    description: 'Description',
    status: ElectionStatus.NotStarted,
    isLocked: false,
    isAutomatic: false
  })
  const deleted = await electionService.deleteElectionById(election!.id)
  expect(deleted!.title).toBe(election!.title)
})

it('should throw not found error when deleting a election which do not exist', async () => {
  try {
    const deleted = await electionService.deleteElectionById(99999999)
  } catch (error) {
    expect(error).toBeInstanceOf(NotFoundError)
  }
})

it('should throw error if close date is earlier than open date', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  election.openDate = new Date(2021, 2, 23)
  election.closeDate = new Date(2020, 1, 21)

  await expect(validateEntity(election)).rejects.toThrowError()
})

it('should accept object if both dates are the same', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  election.openDate = new Date(2021, 2, 23)
  election.closeDate = election.openDate

  expect(election.openDate === election.closeDate)
  await expect(validateEntity(election)).resolves.toBe(undefined)
})

it('it should resolve when closing date is after opening date', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  election.openDate = new Date(2021, 2, 23)
  election.closeDate = new Date(2022, 1, 21)

  expect(election.openDate < election.closeDate)
  await expect(validateEntity(election)).resolves.toBe(undefined)
})
