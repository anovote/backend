import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'

export const endElection: EventHandlerAcknowledges<{ id: number; forceEnd?: boolean }> = async (event) => {
    const socketRoomService = SocketRoomService.getInstance()
    const organizerSocket = event.client as OrganizerSocket
    const electionId = event.data.id
    const forceEnd = event.data.forceEnd

    const organizerService = new ElectionOrganizerService(database)
    const organizer = await organizerService.getElectionOrganizerById(organizerSocket.organizerId)
    const electionService = new ElectionService(database, organizer)

    try {
        const election = await electionService.getById(electionId)

        if (!election) throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })

        if (!forceEnd && election.closeDate) {
            event.acknowledgement(EventMessage({ needForceEnd: true, finished: false, closeDate: election.closeDate }))
        } else {
            // mark election as complete
            const closedElection = await electionService.markElectionClosed(election)
            // close the socket room
            await socketRoomService.closeRoom(electionId)

            if (closedElection) {
                event.acknowledgement(EventMessage({ finished: true, needForceEnd: false, election: closedElection }))
            }
        }
        // When all ballots are done/voted on : not implemented in this file
    } catch (err) {
        logger.alert(err)
        event.acknowledgement(EventErrorMessage(err))
    }
}
