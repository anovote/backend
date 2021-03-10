import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { logger } from '@/loaders/logger'
import { SocketRoomEntity, SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
import chalk from 'chalk'
import { Server } from 'socket.io'
import { Connection, getConnection } from 'typeorm'
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
            // todo connection should be fetched based on environment. connection should be set to default if environnement is dev or production
            SocketRoomService.instance = new SocketRoomService(getConnection())
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
        return await this.repository
            .createQueryBuilder('socket_room_entity')
            .leftJoinAndSelect('socket_room_entity.election', 'election')
            .where('election."id" = :value', { value: electionId })
            .getOne()
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

    /**
     * Adds user to room if there is a socket room open for this client. Else does nothing
     * @param clientSocket The client socket connection
     * @param socketServer The socket server
     */
    async addUserToRoom(clientSocket: AnoSocket, socketServer: Server) {
        const { token } = clientSocket

        const socketId = chalk.blue(clientSocket.id)
        if (!token.electionID) {
            logger.info(`tried to connect to room ${token.electionID}. This room is either closed or does not exist`)
            return
        }
        const room = await this.getById(token.electionID!)
        const openRoom = room?.roomState === SocketRoomState.OPEN
        if (!openRoom) {
            logger.info(`tried to connect to room ${token.electionID}. This room is either closed or does not exist`)
            return
        }

        const electionIdString = token.electionID!.toString()
        logger.info(`${socketId} was added to election room ${electionIdString}`)
        await clientSocket.join(electionIdString)
        socketServer.to(electionIdString).send(`You have joined election room: ${electionIdString}`)
    }
}