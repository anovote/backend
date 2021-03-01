import { deepCopy } from '@/helpers/object'
import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import setupConnection from '../helpers/setupTestDB'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IElection } from '@/models/Election/IElection'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionService } from '@/services/ElectionService'
import { Connection } from 'typeorm'
import { createDummyOrganizer, deleteDummyOrganizer } from '../helpers/seed/organizer'
import { clearDatabaseEntityTable } from '../Tests.utils'

let db: Connection
let organizer: ElectionOrganizer
let electionService: ElectionService
let seedElection: Election
let seedDTO: IElection

beforeAll(async () => {
  db = await setupConnection()
  organizer = await createDummyOrganizer(db)

  seedDTO = {
    electionOrganizer: organizer,
    title: 'Some title',
    description: 'Some long description',
    password: 'password',
    status: ElectionStatus.NotStarted,
    isLocked: true,
    isAutomatic: false
  }
  electionService = new ElectionService(db, organizer)
})

beforeEach(async () => {
  electionService = new ElectionService(db, organizer)
  const repo = db.getRepository(Election)
  await clearDatabaseEntityTable(repo)
})

afterAll(async () => {
  try {
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
})

it('should throw error when status is out of range', async () => {
  seedElection = (await electionService.create(seedDTO)) as Election
  const election = deepCopy<IElection>(seedElection)
  election.status = 99 // Out of range of ENUM
  try {
    await expect(electionService.createElection(election)).rejects.toThrowError()
  } catch (error) {
    console.log(error)
  }
})

it('should not update if no election exists', async () => {
  try {
    await expect(electionService.updateElectionById(100, deepCopy<IElection>(seedElection))).rejects.toThrowError(
      NotFoundError
    )
  } catch (error) {
    console.log(error)
  }
})

it('should not change id of updated election', async () => {
  const election = (await electionService.create(seedDTO)) as Election
  const passedInId = election.id
  const electionCopy = deepCopy<Election>(election)

  electionCopy.id = 5
  const updatedElection = await electionService.updateElectionById(passedInId, deepCopy<IElection>(electionCopy))
  expect(updatedElection!.id).toBe(passedInId)
})

it('should return the election with given id', async () => {
  seedElection = (await electionService.create(seedDTO)) as Election
  const election = await electionService.getById(seedElection.id)
  expect(election!.id).toBe(seedElection.id)
})

it('should return undefined if election does not exist', async () => {
  const election = await electionService.getById(999999)
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
  await expect(electionService.deleteElectionById(election!.id)).resolves.toBeUndefined()
})

it('should throw not found error when deleting a election which do not exist', async () => {
  try {
    await expect(electionService.deleteElectionById(99999999)).rejects.toThrowError(NotFoundError)
  } catch (error) {
    console.log(error)
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

it('should fail if opening date is earlier than today on create', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  election.openDate = new Date(2020, 2, 23)

  await expect(electionService.createElection(election)).rejects.toThrowError()
})

it('should pass if opening date is later than today on create', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  election.openDate = new Date(2040, 2, 23)

  await expect(electionService.createElection(election)).resolves.toBeDefined()
})

it('should pass if opening date is same as today on create', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  election.openDate = new Date()

  await expect(electionService.createElection(election)).resolves.toBeDefined()
})

it('should pass if opening date is earlier than today on entity update', async () => {
  const repo = db.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This has a wrong date and needs to be updated'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started

  const oldElection = await electionService.createElection(election)
  const newElection = oldElection!
  newElection.openDate = new Date(2020, 2, 23) // earlier than today
  newElection.closeDate = undefined

  expect(newElection !== oldElection)
  expect(newElection.openDate !== oldElection!.openDate)
  expect(newElection.openDate < new Date())
  await expect(electionService.updateElectionById(newElection.id, newElection)).resolves.toBeDefined()
})
