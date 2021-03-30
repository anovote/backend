import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { SocketRoomService } from '@/services/SocketRoomService'

/**
 * Event when an organizer joins an election and want to administrate it
 * @param event event data (socket, server, data, ack callback)
 */
export const administrateElection: EventHandlerAcknowledges<{ electionId: number }> = (event) => {
    try {
        const { electionId } = event.data
        SocketRoomService.getInstance().setElectionRoomOrganizer(electionId, event.client as OrganizerSocket)
        event.acknowledgement(EventMessage({}))
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
