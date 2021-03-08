import { SocketRoomEntity, SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Socket } from 'socket.io'
import { ForbiddenError } from '../http/ForbiddenError'

/**
 * Web socket service is responsible for opening and closing rooms, keeping an array of opened rooms
 */
export class WebSocketService {
    // openRooms: SocketRoomEntity[]
    socketConnection: Socket
    socketRoomService: SocketRoomService

    private static instance: WebSocketService
    private constructor(socketRoomService: SocketRoomService) {
        // this.socketConnection = socketConnection
        this.socketRoomService = socketRoomService
    }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService(SocketRoomService.getInstance())
        }

        return this.instance
    }
        room.roomState = SocketRoomState.CLOSE
    }

    openRoom(room: SocketRoomEntity) {
        // todo open room
        room.roomState = SocketRoomState.OPEN
    }

    openRooms(rooms: SocketRoomEntity[]) {
        for (const room of rooms) {
            this.openRoom(room)
        }
    }

    /**
     * Adds user to room if there is a socket room open for this client. Else does nothing
     * @param clientSocket The client socket connection
     * @param socketServer The socket server
     */
    async addUserToRoom(clientSocket: AnoSocket, socketServer: Server) {
        const { token } = clientSocket

        const socketId = chalk.blue(clientSocket.id)
        if (token.electionID) {
            const room = await this.socketRoomService.getById(token.electionID!)
            const openRoom = room?.roomState === SocketRoomState.OPEN
            if (openRoom) {
                const electionIdString = token.electionID!.toString()
                logger.info(`${socketId} was added to election room ${electionIdString}`)
                await clientSocket.join(electionIdString)
                socketServer.to(electionIdString).send(`You have joined election room: ${electionIdString}`)
            } else {
                logger.info(
                    `tried to connect to room ${token.electionID}. This room is either closed or does not exist`
                )
        }
        }
    }
}

interface VoterToken {
    electionId: number
    voterId: number
}

class RoomNotOpenError extends Error {
    constructor(message?: string) {
        super(message)
    }
}

// todo add room to election on create. update room status. write tests
