import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandler } from '@/lib/websocket/EventHandler'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Server } from 'socket.io'

export const voterDisconnect: EventHandler<{ client: VoterSocket; server: Server }> = (event) => {
    const voterSocket = event.client as VoterSocket
    SocketRoomService.getInstance().removeUserFromRoom(voterSocket, event.server)
}
