import { deepCopy } from '@/helpers/object'
import { validateEntity } from '@/helpers/validateEntity'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IElection } from '@/models/Election/IElection'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { SocketRoomEntity, SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
import { ElectionService } from '@/services/ElectionService'
import { isBefore, isSameHour } from 'date-fns'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { createDummyOrganizer, deleteDummyOrganizer } from '../helpers/seed/organizer'
import { clearDatabaseEntityTable } from '../Tests.utils'

let db: Connection
let organizer: ElectionOrganizer
let electionService: ElectionService
let seedElection: Election
let seedDTO: IElection

beforeAll(async () => {
    db = await getTestDatabase()
    organizer = await createDummyOrganizer(db)

    seedDTO = {
        electionOrganizer: organizer,
        title: 'Some title',
        description: 'Some long description',
        password: 'password',
        status: ElectionStatus.NotStarted,
        isLocked: true,
        isAutomatic: false,
        eligibleVoters: [],
        ballots: []
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
        const repo = db.getRepository(Election)
        await clearDatabaseEntityTable(repo)
        await deleteDummyOrganizer(db, organizer)
        await db.close()
    } catch (err) {
        console.error(err)
    }
})

it('should create a election with all data filled out', async () => {
    const election = await electionService.create({
        electionOrganizer: organizer,
        title: 'Test election',
        description: 'Description',
        image: 'image.png',
        openDate: new Date(),
        closeDate: new Date(),
        status: ElectionStatus.NotStarted,
        isLocked: false,
        isAutomatic: false,
        eligibleVoters: [],
        ballots: []
    })
    expect(election).toBeInstanceOf(Election)
})

it('should create a election without image, openDate and closeDate', async () => {
    const election = await electionService.create({
        electionOrganizer: organizer,
        title: 'Test election',
        description: 'Description',
        status: ElectionStatus.NotStarted,
        isLocked: false,
        isAutomatic: false,
        eligibleVoters: [],
        ballots: []
    })
    expect(election).toBeInstanceOf(Election)
})

it('should throw error when status is out of range', async () => {
    seedElection = (await electionService.create(seedDTO)) as Election
    const election = deepCopy<IElection>(seedElection)
    election.status = 99 // Out of range of ENUM
    await expect(electionService.create(election)).rejects.toThrowError()
})

it('should not update if no election exists', async () => {
    try {
        await expect(electionService.update(100, deepCopy<Election>(seedElection))).rejects.toThrowError(NotFoundError)
    } catch (error) {
        console.error(error)
    }
})

it('should not change id of updated election', async () => {
    const election = (await electionService.create(seedDTO)) as Election
    const passedInId = election.id
    const electionCopy = deepCopy<Election>(election)

    electionCopy.id = 5
    const updatedElection = await electionService.update(passedInId, deepCopy<Election>(electionCopy))
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
    const election = await electionService.create({
        electionOrganizer: organizer,
        title: 'Test election',
        description: 'Description',
        status: ElectionStatus.NotStarted,
        isLocked: false,
        isAutomatic: false,
        eligibleVoters: [],
        ballots: []
    })
    await expect(electionService.delete(election!.id)).resolves.toBeUndefined()
})

it('should throw not found error when deleting a election which do not exist', async () => {
    try {
        await expect(electionService.delete(99999999)).rejects.toThrowError(NotFoundError)
    } catch (error) {
        console.error(error)
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
    const open = new Date()
    open.setDate(open.getDate() + 3)
    const close = new Date()
    close.setDate(close.getDate() + 2)
    election.openDate = open
    election.closeDate = close

    await expect(validateEntity(election)).rejects.toThrowError()
})

it('should accept object if both dates are the same', async () => {
    const repo = db.getRepository(Election)
    const election = repo.create()
    election.id = 1
    election.title = 'My Test'
    election.description = 'This is a dummy'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    const open = new Date()
    open.setDate(open.getDate() + 1)
    election.closeDate = election.openDate

    expect(election.openDate === election.closeDate)
    await expect(validateEntity(election)).resolves.toBe(undefined)
})

it('should resolve when closing date is after opening date', async () => {
    const repo = db.getRepository(Election)
    const election = repo.create()
    election.id = 1
    election.title = 'My Test'
    election.description = 'This is a dummy'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    const open = new Date()
    open.setDate(open.getDate() + 1)
    const close = new Date()
    close.setDate(close.getDate() + 2)
    election.openDate = open
    election.closeDate = close

    expect(election.openDate < election.closeDate)
    await expect(validateEntity(election)).resolves.toBe(undefined)
})

it('should fail if opening date is earlier than today on create', async () => {
    const repo = db.getRepository(Election)
    const election = repo.create()
    election.id = 1
    election.title = 'My Test'
    election.description = 'This is a dummy'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    election.openDate = new Date(2020, 2, 23)

    await expect(electionService.create(election)).rejects.toThrowError()
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
    election.openDate = new Date()

    await expect(electionService.create(election)).resolves.toBeDefined()
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

    await expect(electionService.create(election)).resolves.toBeDefined()
})

it('should fail if opening date is earlier than today on entity update', async () => {
    const repo = db.getRepository(Election)
    const election = repo.create()
    election.title = 'My open date is not to be updated'
    election.description = 'This has a wrong date and needs to be updated'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = organizer
    election.eligibleVoters = []
    election.status = ElectionStatus.Started

    const oldElection = await electionService.create(election)
    const newElection = oldElection!
    newElection.openDate = new Date(2020, 2, 23) // earlier than today
    newElection.closeDate = undefined
    newElection.socketRoom = new SocketRoomEntity()

    expect(isBefore(newElection.openDate, new Date())).toBeTruthy()
    await expect(electionService.update(newElection.id, newElection)).rejects.toThrowError()
})

it('should initialize a default socket room on creation', async () => {
    const election = db.getRepository(Election).create()
    election.title = 'I should have a socket room'
    election.description = 'I need a socket room'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    election.id = 22

    const savedElection = await electionService.create(election)

    expect(savedElection).toBeDefined()
    expect(savedElection?.socketRoom).toBeDefined()
    expect(savedElection?.socketRoom.roomState).toBe(SocketRoomState.OPEN)
})

it('should be able to save an election with a socket room ', async () => {
    const election = db.getRepository(Election).create()
    election.title = 'I have a socket room'
    election.description = 'It is closed'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    election.id = 22
    election.socketRoom = new SocketRoomEntity()
    election.socketRoom.roomState = SocketRoomState.CLOSE

    const savedElection = await electionService.create(election)

    expect(savedElection).toBeDefined()
    expect(savedElection?.socketRoom).toBeDefined()
    expect(savedElection?.socketRoom.roomState).toBe(SocketRoomState.CLOSE)
})

it('should mark election as closed when the organizer tries to close it', async () => {
    const election = db.getRepository(Election).create()
    election.title = 'I want to be closed'
    election.description = 'by organizer'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    election.id = -1
    election.socketRoom = new SocketRoomEntity()

    const savedElection = await electionService.create(election)
    const closedElection = await electionService.markElectionClosed(savedElection!, true)

    expect(closedElection?.isLocked).toBeTruthy()
    expect(closedElection?.status).toBe(ElectionStatus.Finished)
    expect(isSameHour(new Date(closedElection!.closeDate!), new Date())).toBeTrue()
})

describe('Duplication', () => {
    it('should not allow duplicate entries from same owner', async () => {
        const election = db.getRepository(Election).create()
        election.title = 'dup'
        election.description = 'this is a duplicate'
        election.electionOrganizer = organizer

        await expect(electionService.create(election)).resolves.toBeDefined()
        await expect(electionService.create(election)).rejects.toThrow(BadRequestError)
    })

    it('should accept duplicate entries from different owners', async () => {
        const election = db.getRepository(Election).create()
        election.title = 'dup'
        election.description = 'this is a duplicate'

        await expect(electionService.create(election)).resolves.toBeDefined()

        const owner2 = new ElectionOrganizer()
        owner2.email = 'user2@gmail.com'
        owner2.firstName = 'user'
        owner2.lastName = '2'
        owner2.password = 'password'

        const savedOwner2 = await db.getRepository(ElectionOrganizer).save(owner2)
        expect(savedOwner2).toBeDefined()

        await expect(new ElectionService(db, savedOwner2!).create(election)).resolves.toBeDefined()
    })
})

describe('Owner', () => {
    it('should make sure that an election has an organizer', async () => {
        const election = db.getRepository(Election).create()
        election.title = 'dup'
        election.description = 'this is a duplicate'
        const createdElection = await electionService.create(election)
        expect(createdElection).toBeDefined()
        expect(createdElection?.electionOrganizer).toBeDefined()
    })
})
