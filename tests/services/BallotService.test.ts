import { deepCopy } from '@/helpers/object'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ValidationError } from '@/lib/errors/validation/ValidationError'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { BallotType } from '@/models/Ballot/BallotType'
import { IBallot } from '@/models/Ballot/IBallot'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { BallotService } from '@/services/BallotService'
import { CrudOptions } from '@/services/BaseEntityService'
import { ElectionService } from '@/services/ElectionService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { createDummyElection } from '../helpers/seed/election'
import { createDummyOrganizer } from '../helpers/seed/organizer'
import { clearDatabaseEntityTable } from '../Tests.utils'

let db: Connection
let organizer: ElectionOrganizer
let election: Election
let ballotService: BallotService
let seedBallot: Ballot

beforeAll(async () => {
    try {
        db = await getTestDatabase()
        organizer = await createDummyOrganizer(db)

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
        console.error(err)
    }
})

beforeEach(async () => {
    try {
        const repo = db.getRepository(Ballot)
        await clearDatabaseEntityTable<Ballot>(repo)
    } catch (err) {
        console.error(err)
    }
})

afterAll(async () => {
    try {
        await db.close()
    } catch (err) {
        console.error(err)
    }
})

it('should create a ballot with all data filled out', async () => {
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
})

it('should create a ballot without image and description', async () => {
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
})

it('should not create a ballot if election does not exist with not found exception', async () => {
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
})

it('should throw create error on negative order', async () => {
    const ballot = deepCopy<IBallot>(seedBallot)
    ballot.order = -1
    await expect(ballotService.create(ballot, { parentId: election.id })).rejects.toThrowError(ValidationError)
})

it('should throw error on out of range ballot type', async () => {
    const ballot = deepCopy<IBallot>(seedBallot)
    ballot.type = 99 // Out of range of ENUM
    await expect(ballotService.create(ballot, { parentId: election.id })).rejects.toThrowError(ValidationError)
})

it('should throw error on out of range result display type', async () => {
    const ballot = deepCopy<IBallot>(seedBallot)
    ballot.resultDisplayType = 99 // Out of range of ENUM
    await expect(ballotService.create(ballot, { parentId: election.id })).rejects.toThrowError(ValidationError)
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
    await expect(ballotService.delete(99999999)).rejects.toThrowError(NotFoundError)
})

it('should update candidate list with new candidates and remove old when candidates are replaced', async () => {
    const initialCandidates = { candidate: 'test1' }
    const updateCandidates = [{ candidate: 'test2' }, { candidate: 'test3' }]
    const ballotDTO: IBallot = {
        candidates: [initialCandidates],
        order: 1,
        displayResultCount: true,
        resultDisplayType: BallotResultDisplay.ALL,
        resultDisplayTypeCount: 2,
        title: 'Test ballot',
        type: BallotType.MULTIPLE,
        description: 'Description',
        image: 'img.png'
    }

    const savedBallot = (await ballotService.create(ballotDTO, { parentId: election.id })) as Ballot
    expect(savedBallot.candidates.length).toBe(1)
    expect(savedBallot.candidates[0]).toMatchObject(initialCandidates)

    savedBallot.candidates = updateCandidates as Candidate[]
    const updatedBallot = (await ballotService.update(savedBallot.id, savedBallot)) as IBallot
    expect(updatedBallot.candidates.length).toBe(2)
    expect(updatedBallot.candidates).toMatchObject(updateCandidates)
})

it('should update old candidates when changed and already exists', async () => {
    const candidateName = 'test1'
    const updatedCandidateName = 'test2'
    const initialCandidates = { candidate: candidateName }
    const ballotDTO: IBallot = {
        candidates: [initialCandidates],
        order: 1,
        displayResultCount: true,
        resultDisplayType: BallotResultDisplay.ALL,
        resultDisplayTypeCount: 2,
        title: 'Test ballot',
        type: BallotType.MULTIPLE,
        description: 'Description',
        image: 'img.png'
    }

    const savedBallot = (await ballotService.create(ballotDTO, { parentId: election.id })) as Ballot
    expect(savedBallot.candidates.length).toBe(1)
    expect(savedBallot.candidates[0].candidate).toBe(candidateName)

    const initialId = savedBallot.candidates[0].id
    savedBallot.candidates[0].candidate = updatedCandidateName

    const updatedBallot = (await ballotService.update(savedBallot.id, savedBallot)) as Ballot
    expect(updatedBallot.candidates.length).toBe(1)
    expect(updatedBallot.candidates[0].candidate).toBe(updatedCandidateName)
    expect(updatedBallot.candidates[0].id).toBe(initialId)
})
