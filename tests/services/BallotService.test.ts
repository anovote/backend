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
import { getTestDatabase } from '../helpers/database'
import { deepCopy } from '@/helpers/object'
import { createDummyElection, deleteDummyElections } from '../helpers/seed/election'
import { createDummyOganizer, deleteDummyOrganizer } from '../helpers/seed/organizer'
import { ValidationError } from '@/lib/errors/validation/ValidationError'
import { BaseError } from '@/lib/errors/BaseError'

let db: Connection
let organizer: ElectionOrganizer
let election: Election
let ballotSerivce: BallotService
let ballots: Ballot[] = []
let seedBallot: Ballot

beforeAll(async () => {
  db = await getTestDatabase()
  organizer = await createDummyOganizer(db)
  election = await createDummyElection(db, organizer)
  ballotSerivce = new BallotService(db, new ElectionService(db))

  seedBallot = await (ballotSerivce.create({
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
    await ballotSerivce.delete(ballot.id)
  }
  await ballotSerivce.delete(seedBallot.id)
  await deleteDummyElections(db, [election])
  await deleteDummyOrganizer(db, organizer)
})

it('should create a ballot with all data filled out', async () => {
  const ballot = await ballotSerivce.create({
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
  const ballot = await ballotSerivce.create({
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

it('should not create a ballot if election does not exist with not found excpetion', async () => {
  try {
    const ballot = await ballotSerivce.create({
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
    await ballotSerivce.create(ballot)
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
    await ballotSerivce.create(ballot)
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }
})

it('should throw error on out of range result display type', async () => {
  const ballot = deepCopy<IBallot>(seedBallot)
  ballot.resultDisplayType = 99 // Out of range of ENUM
  try {
    await ballotSerivce.create(ballot)
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }
})

it('should return the ballot with given id', async () => {
  const ballot = await ballotSerivce.get(seedBallot.id)
  expect(ballot!.id).toBe(seedBallot.id)
})

it('should return undefined if ballot does not exist', async () => {
  const ballot = await ballotSerivce.get(999999)
  expect(ballot).toBeUndefined()
})

it('should delete a ballot which exists', async () => {
  const ballot = await ballotSerivce.create({
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
  const deleted = await ballotSerivce.delete(ballot!.id)
  expect(deleted!.title).toBe(ballot!.title)
})

it('should throw not found eror when deleting a ballot which do not exist', async () => {
  try {
    const deleted = await ballotSerivce.delete(99999999)
  } catch (error) {
    expect(error).toBeInstanceOf(NotFoundError)
  }
})
