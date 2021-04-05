import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandler } from '@/lib/websocket/EventHandler'
import { logger } from '@/loaders/logger'
import { SocketRoomService } from '@/services/SocketRoomService'

/**
 * Event when an organizer joins an election and want to administrate it
 * @param event event data (socket, server, data, ack callback)
 */
export const administrateElection: EventHandler<{ electionId: number }> = (event) => {
    try {
        const { electionId } = event.data
        SocketRoomService.getInstance().setElectionRoomOrganizer(electionId, event.client as OrganizerSocket)
    } catch (err) {
        logger.error(err)
    }
}
