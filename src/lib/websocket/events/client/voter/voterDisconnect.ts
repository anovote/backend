import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandler } from '@/lib/websocket/EventHandler'
import { SocketRoomService } from '@/services/SocketRoomService'

export const voterDisconnect: EventHandler<undefined> = (event) => {
    const voterSocket = event.client as VoterSocket
    SocketRoomService.getInstance().removeUserFromRoom(voterSocket, event.server)
}
