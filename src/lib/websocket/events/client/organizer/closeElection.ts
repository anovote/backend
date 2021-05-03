import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { UnauthorizedError } from '@/lib/errors/http/UnauthorizedError'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'
import chalk from 'chalk'
import { Events } from '../..'

/**
 * Closes an election if the client socket is the owner of the election
 * @param client the organizer socket
 * @param data the event data. Should contain the electionId
 * @param server the socket server
 */
export const closeElection: EventHandlerAcknowledges<ICloseElectionEventData> = async (event) => {
    const socketRoomService = SocketRoomService.getInstance()
    const organizerSocket = event.client as OrganizerSocket
    const { electionId, forceEnd } = event.data

    try {
        logger.info(`election ${chalk.red(electionId)} is been closed by ${chalk.blue(event.client.id)}`)

        checkElectionIdType(electionId)

        const { election, organizer } = await validateOwnership(organizerSocket.organizerId, electionId)

        if (!forceEnd && election.closeDate) {
            event.acknowledgement(EventMessage({ needForceEnd: true, finished: false, closeDate: election.closeDate }))
        } else {
            // mark election as complete
            const electionService = new ElectionService(database, organizer)
            const closedElection = await electionService.markElectionClosed(election, true)
            // close and delete the socket room
            await socketRoomService.closeRoom(electionId)
            socketRoomService.deleteRoom(electionId)

            if (closedElection) {
                event.acknowledgement(EventMessage({ finished: true, needForceEnd: false, election: closedElection }))
            }
            logger.info(`emitting to room ${chalk.red(electionId)}`)
            const server = event.server
            server.to(electionId.toString()).emit(Events.server.election.close, 'election is closed')
        }

        // When all ballots are done/voted on : not implemented in this file
    } catch (err) {
        logger.error(err)
        event.acknowledgement(EventErrorMessage(err))
    }
}

interface ICloseElectionEventData {
    electionId: number
    forceEnd?: boolean
}

/**
 * Validates that the exists and that it is the owner of the election
 * @param organizer the organizer that owns the election
 * @param electionId the ID of the election
 */
async function validateOwnership(organizerId: number, electionId: number) {
    const organizer = await new ElectionOrganizerService(database).getById(organizerId)

    if (!organizer) {
        throw new NotFoundError({ message: 'no organizer' })
    }

    const election = await new ElectionService(database, organizer).getById(electionId)
    if (!election) {
        throw new UnauthorizedError({ message: 'organizer is not owner' })
    }

    return { election, organizer }
}

/**
 * Throws error if electionId is wrong type
 * @param electionId sent with the socket event
 */
function checkElectionIdType(electionId: number) {
    if (!electionId || Number.isNaN(electionId) || !Number.isInteger(electionId)) {
        throw new BadRequestError({ message: 'data is missing' })
    }
}
