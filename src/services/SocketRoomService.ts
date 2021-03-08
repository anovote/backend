import config from '@/config'
import { database } from '@/loaders'
import { SocketRoomEntity } from '@/models/SocketRoom/SocketRoomEntity'
import { Connection, getConnectionManager } from 'typeorm'
import BaseEntityService, { CrudOptions } from './BaseEntityService'

export class SocketRoomService extends BaseEntityService<SocketRoomEntity> {
    // electionId: number
    private static instance: SocketRoomService

    private constructor(databaseConnection: Connection) {
        super(databaseConnection, SocketRoomEntity)
        // this.electionId = electionId
    }

    static getInstance(): SocketRoomService {
        if (!SocketRoomService.instance) {
            SocketRoomService.instance = new SocketRoomService(getConnectionManager().get(config.environment))
        }

        return this.instance
    }

    get(): Promise<SocketRoomEntity[] | undefined> {
        throw new Error('Method not implemented.')
    }

    /**
     * Gets the socket room by the election id
     * @param electionId the ID of the election which the room belongs to
     * @returns a socket room entity or undefined
     */
    async getById(electionId: number): Promise<SocketRoomEntity | undefined> {
        return await database.getRepository(SocketRoomEntity).findOne({ where: { election: electionId } })
    }
    create(dto: SocketRoomEntity, options?: CrudOptions): Promise<SocketRoomEntity | undefined> {
        throw new Error('Method not implemented.')
    }
    update(id: number, dto: SocketRoomEntity): Promise<SocketRoomEntity | undefined> {
        throw new Error('Method not implemented.')
    }
    delete(id: number): Promise<void> {
        throw new Error('Method not implemented.')
    }
}