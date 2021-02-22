import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { BallotType } from '@/models/Ballot/BallotType'
import { IBallot } from '@/models/Ballot/IBallot'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { Connection } from 'typeorm'
import { deepCopy } from '@/helpers/object'
import { createDummyElection, deleteDummyElections } from '../helpers/seed/election'
import { createDummyOrganizer, deleteDummyOrganizer } from '../helpers/seed/organizer'
import { ValidationError } from '@/lib/errors/validation/ValidationError'
import setupConnection from '@/loaders/setupTestDB'

let db: Connection
let organizer: ElectionOrganizer
let election: Election
let ballotService: BallotService
let ballots: Ballot[] = []
let seedBallot: Ballot

beforeAll(async () => {
  db = await setupConnection()
  organizer = await createDummyOrganizer(db)
  election = await createDummyElection(db, organizer)
  ballotService = new BallotService(db, new ElectionService(db))

  seedBallot = await (ballotService.create({
    candidates: [],
    election: election.id,
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE,
    description: 'Description',
    image: 'img.png'
  }) as Promise<Ballot>)!
})

afterAll(async () => {
  for (const ballot of ballots) {
    await ballotService.delete(ballot.id)
  }
  await ballotService.delete(seedBallot.id)
  await deleteDummyElections(db, [election])
  await deleteDummyOrganizer(db, organizer)
  await db.close()
})

it('should create a ballot with all data filled out', async () => {
  const ballot = await ballotService.create({
    candidates: [],
    election: election.id,
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE,
    description: 'Description',
    image: 'img.png'
  })
  expect(ballot).toBeInstanceOf(Ballot)
  ballots.push(ballot!)
})

it('should create a ballot without image and description', async () => {
  const ballot = await ballotService.create({
    candidates: [],
    election: election.id,
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE
  })
  expect(ballot).toBeInstanceOf(Ballot)
  ballots.push(ballot!)
})

it('should not create a ballot if election does not exist with not found exception', async () => {
  try {
    const ballot = await ballotService.create({
      candidates: [],
      election: 9999999,
      order: 1,
      displayResultCount: true,
      resultDisplayType: BallotResultDisplay.ALL,
      resultDisplayTypeCount: 2,
      title: 'Test ballot',
      type: BallotType.MULTIPLE
    })
  } catch (error) {
    expect(error).toBeInstanceOf(NotFoundError)
  }
})

it('should throw create error on negative order', async () => {
  const ballot = deepCopy<IBallot>(seedBallot)
  ballot.order = -1
  try {
    await ballotService.create(ballot)
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    const err = error as ValidationError
    expect(err.toResponse().validationMessages).toContain('order must be a positive number')
  }
})

it('should throw error on out of range ballot type', async () => {
  const ballot = deepCopy<IBallot>(seedBallot)
  ballot.type = 99 // Out of range of ENUM
  try {
    await ballotService.create(ballot)
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }
})

it('should throw error on out of range result display type', async () => {
  const ballot = deepCopy<IBallot>(seedBallot)
  ballot.resultDisplayType = 99 // Out of range of ENUM
  try {
    await ballotService.create(ballot)
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }
})

it('should not update if no ballot exists', async () => {
  try {
    const updated = await ballotService.update(100, deepCopy<IBallot>(seedBallot))
  } catch (e) {
    expect(e).toBeInstanceOf(NotFoundError)
  }
})

it('should not change id of updated ballot', async () => {
  const passedInId = seedBallot.id
  const data = deepCopy<Ballot>(seedBallot)
  data.id = 5
  const ballot = await ballotService.update(passedInId, deepCopy<IBallot>(data))
  expect(ballot.id).toBe(passedInId)
})

it('should return the ballot with given id', async () => {
  const ballot = await ballotService.get(seedBallot.id)
  expect(ballot!.id).toBe(seedBallot.id)
})

it('should return undefined if ballot does not exist', async () => {
  const ballot = await ballotService.get(999999)
  expect(ballot).toBeUndefined()
})

it('should delete a ballot which exists', async () => {
  const ballot = await ballotService.create({
    candidates: [],
    election: election.id,
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE,
    description: 'Description',
    image: 'img.png'
  })
  const deleted = await ballotService.delete(ballot!.id)
  expect(deleted!.title).toBe(ballot!.title)
})

it('should throw not found error when deleting a ballot which do not exist', async () => {
  try {
    const deleted = await ballotService.delete(99999999)
  } catch (error) {
    expect(error).toBeInstanceOf(NotFoundError)
  }
})
