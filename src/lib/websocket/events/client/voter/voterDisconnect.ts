import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Server } from 'socket.io'

export const voterDisconnect = (client: VoterSocket, server: Server) => {
    SocketRoomService.getInstance().removeUserFromRoom(client, server)
}
