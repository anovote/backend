import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { SocketRoomEntity, SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
import { Connection, Repository } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { clearDatabaseEntityTable } from '../Tests.utils'

let repo: Repository<SocketRoomEntity>
let db: Connection
beforeAll(async () => {
    db = await getTestDatabase()
    repo = db.getRepository(SocketRoomEntity)
})

beforeEach(async () => {
    repo = db.getRepository(SocketRoomEntity)
    await clearDatabaseEntityTable(repo)
})

afterAll(async () => {
    return await db.close()
})

it('should be initialized with Room state as open by default', async () => {
    const room = repo.create()
    const savedRoom = await repo.save(room)
    expect(savedRoom.roomState).toBe(SocketRoomState.OPEN)
    expect(room.roomState).toBe(SocketRoomState.OPEN)
})

test('that id is been set on save', async () => {
    const room = repo.create()
    await repo.save(room)
    expect(room.id).toBeDefined()
})

it('should contain an election and election should be in the database', async () => {
    const election = new Election()
    election.electionOrganizer = new ElectionOrganizer()
    election.title = 'I have a socket room'
    election.description = 'test election'
    election.status = ElectionStatus.NotStarted
    election.isAutomatic = true
    election.isLocked = false

    const socketRoom = repo.create()
    socketRoom.roomState = SocketRoomState.OPEN
    socketRoom.election = election

    const savedRoom = await repo.save(socketRoom)

    expect(savedRoom.election).toBeDefined()
    expect(savedRoom.election.title).toBe('I have a socket room')
    const electionRepo = db.getRepository(Election)
    // await electionRepo.save(election)
    expect((await electionRepo.find()).length).toBeGreaterThan(0)
})
