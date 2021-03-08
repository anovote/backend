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

    async addUserToRoom(token: VoterToken, clientSocket: Socket) {
        const room = await this.socketRoomService.getById(token.electionId)

        if (!room) {
            throw new ForbiddenError()
        }

        if (room.roomState === SocketRoomState.CLOSE) {
            throw new RoomNotOpenError(`The room with id ${token.electionId} is not open`)
        }

        const electionIdStr = token.electionId.toString()
        await clientSocket.join(electionIdStr)
        return clientSocket
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
