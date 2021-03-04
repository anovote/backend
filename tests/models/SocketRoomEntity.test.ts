import config from '@/config'
import { SocketRoomEntity, SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
import { getConnection, Repository } from 'typeorm'
import setupConnection from '../helpers/setupTestDB'
import { clearDatabaseEntityTable } from '../Tests.utils'

let repo: Repository<SocketRoomEntity>

beforeAll(async () => {
    await setupConnection()
    repo = getConnection(config.environment).getRepository(SocketRoomEntity)
})

beforeEach(async () => {
    repo = getConnection(config.environment).getRepository(SocketRoomEntity)
    await clearDatabaseEntityTable(repo)
})

afterAll(() => {
    const conn = getConnection(config.environment)
    return conn.close()
})

it('should be initialized with Room state as open by default', () => {
    const room = repo.create()
    expect(room.roomState).toBe(SocketRoomState.OPEN)
})
