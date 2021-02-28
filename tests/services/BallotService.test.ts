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
import { createDummyElection } from '../helpers/seed/election'
import { createDummyOrganizer } from '../helpers/seed/organizer'
import { ValidationError } from '@/lib/errors/validation/ValidationError'
import setupConnection from '../helpers/setupTestDB'
import { CrudOptions } from '@/services/BaseEntityService'
import { clearDatabaseEntityTable } from '../Tests.utils'

let db: Connection
let organizer: ElectionOrganizer
let election: Election
let ballotService: BallotService
const ballots: Ballot[] = []
let seedBallot: Ballot

beforeAll(async () => {
  try {
    db = await setupConnection()
    organizer = await createDummyOrganizer(db)
    // election = await createDummyElection(db, organizer)
    ballotService = new BallotService(db, new ElectionService(db, organizer), organizer)
    election = await createDummyElection(db, organizer)

    seedBallot = await (ballotService.create(
      {
        candidates: [],
        order: 1,
        displayResultCount: true,
        resultDisplayType: BallotResultDisplay.ALL,
        resultDisplayTypeCount: 2,
        title: 'Test ballot',
        type: BallotType.MULTIPLE,
        description: 'Description',
        image: 'img.png'
      },
      { parentId: election.id }
    ) as Promise<Ballot>)!
  } catch (err) {
    console.log(err)
  }
})

beforeEach(async () => {
  try {
    const repo = db.getRepository(Ballot)
    await clearDatabaseEntityTable<Ballot>(repo)
  } catch (err) {
    console.log(err)
  }
})

afterEach(async () => {
  try {
  } catch (err) {
    console.log(err)
  }
})

afterAll(async () => {
  try {
    //   for (const ballot of ballots) {
    //     await ballotService.delete(ballot.id)
    //   }
    // await ballotService.delete(seedBallot.id)
    // await deleteDummyElections(db, [election])
    // await deleteDummyOrganizer(db, organizer)
    await db.close()
  } catch (err) {
    console.log(err)
  }
})

it('should create a ballot with all data filled out', async () => {
  try {
    const ballotDTO = {
      candidates: [],
      order: 1,
      displayResultCount: true,
      resultDisplayType: BallotResultDisplay.ALL,
      resultDisplayTypeCount: 2,
      title: 'Test ballot',
      type: BallotType.MULTIPLE,
      description: 'Description',
      image: 'img.png'
    }
    const crudOptions = { parentId: election.id }

    const ballot = await ballotService.create(ballotDTO, crudOptions)
    expect(ballot).toBeInstanceOf(Ballot)
    // ballots.push(ballot!)
  } catch (err) {
    console.log(err)
  }
})

it('should create a ballot without image and description', async () => {
  try {
    const ballot = await ballotService.create(
      {
        candidates: [],
        order: 1,
        displayResultCount: true,
        resultDisplayType: BallotResultDisplay.ALL,
        resultDisplayTypeCount: 2,
        title: 'Test ballot',
        type: BallotType.MULTIPLE
      },
      { parentId: election.id }
    )
    expect(ballot).toBeInstanceOf(Ballot)
  } catch (err) {
    console.log(err)
  }
})

it('should not create a ballot if election does not exist with not found exception', async () => {
  try {
    const options: CrudOptions = { parentId: 999 } // election id
    const ballotDTO: IBallot = {
      candidates: [],
      order: 1,
      displayResultCount: true,
      resultDisplayType: BallotResultDisplay.ALL,
      resultDisplayTypeCount: 2,
      title: 'Test ballot',
      type: BallotType.MULTIPLE
    }

    await expect(ballotService.create(ballotDTO, options)).rejects.toThrowError(NotFoundError)
  } catch (err) {
    console.log(err)
  }
})

it('should throw create error on negative order', async () => {
  try {
    const ballot = deepCopy<IBallot>(seedBallot)
    ballot.order = -1
    await expect(ballotService.create(ballot, { parentId: election.id })).rejects.toThrowError(ValidationError)
  } catch (error) {
    console.log(error)
  }
})

it('should throw error on out of range ballot type', async () => {
  const ballot = deepCopy<IBallot>(seedBallot)
  ballot.type = 99 // Out of range of ENUM
  try {
    await ballotService.create(ballot, { parentId: election.id })
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }
})

it('should throw error on out of range result display type', async () => {
  const ballot = deepCopy<IBallot>(seedBallot)
  ballot.resultDisplayType = 99 // Out of range of ENUM
  await expect(ballotService.create(ballot, { parentId: election.id })).rejects.toThrowError()
})

it('should not update if no ballot exists', async () => {
  await expect(ballotService.update(100, deepCopy<Ballot>(seedBallot))).rejects.toThrowError(NotFoundError)
})

it('should not change id of updated ballot', async () => {
  const ballotDTO: IBallot = {
    candidates: [],
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE,
    description: 'Description',
    image: 'img.png'
  }

  const originalBallot = (await ballotService.create(ballotDTO, { parentId: election.id })) as Ballot

  const passedInId = originalBallot.id
  const ballotCopy = deepCopy<Ballot>(seedBallot)
  ballotCopy.id = 5
  const updatedBallot = await ballotService.update(passedInId, deepCopy<Ballot>(ballotCopy))
  expect(updatedBallot!.id).toBe(passedInId)
})

it('should return the ballot with given id', async () => {
  const ballotDTO: IBallot = {
    candidates: [],
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE,
    description: 'Description',
    image: 'img.png'
  }

  const originalBallot = (await ballotService.create(ballotDTO, { parentId: election.id })) as Ballot

  const ballot = await ballotService.getById(originalBallot.id)
  expect(ballot!.id).toBe(originalBallot.id)
})

it('should return undefined if ballot does not exist', async () => {
  const ballot = await ballotService.getById(999999)
  expect(ballot).toBeUndefined()
})

it('should fail if trying to delete ballot that does not exist', async () => {
  const missingId = 9999
  await expect(ballotService.delete(missingId)).rejects.toThrow(NotFoundError)
})

it('should delete a ballot which exists', async () => {
  const ballotDTO = {
    candidates: [],
    order: 1,
    displayResultCount: true,
    resultDisplayType: BallotResultDisplay.ALL,
    resultDisplayTypeCount: 2,
    title: 'Test ballot',
    type: BallotType.MULTIPLE,
    description: 'Description',
    image: 'img.png'
  }
  const ballot = await ballotService.create(ballotDTO, { parentId: election.id })
  const id = ballot!.id

  await expect(ballotService.delete(id)).resolves.toBeUndefined()
})

it('should throw not found error when deleting a ballot which do not exist', async () => {
  try {
    await expect(ballotService.delete(99999999)).rejects.toThrowError(NotFoundError)
  } catch (error) {
    expect(error).toBeInstanceOf(NotFoundError)
  }
})
