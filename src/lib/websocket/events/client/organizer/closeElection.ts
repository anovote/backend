import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { UnauthorizedError } from '@/lib/errors/http/UnauthorizedError'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { Events } from '@/lib/websocket/events'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { ElectionService } from '@/services/ElectionService'
import chalk from 'chalk'

/**
 * Closes an election if the client socket is the owner of the election
 * @param client the organizer socket
 * @param data the event data. Should contain the electionId
 * @param server the socket server
 */
export const closeElection: EventHandlerAcknowledges<ICloseElectionEventData> = async (event) => {
    try {
        const { electionId } = event.data

        checkElectionIdType(electionId)

        const client = event.client as OrganizerSocket
        logger.info(`election ${chalk.red(electionId)} is been closed by ${chalk.blue(client.id)}`)

        await validateOwnership(client.organizerId, electionId)

        logger.info(`emitting to room ${chalk.red(electionId)}`)
        const server = event.server
        server.to(electionId.toString()).emit(Events.server.election.close, 'election is closed')
    } catch (err) {
        logger.error(err)
        event.acknowledgement(err)
    }
}

interface ICloseElectionEventData {
    electionId: number
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
}

function checkElectionIdType(electionId: number) {
    if (!electionId || Number.isNaN(electionId) || !Number.isInteger(electionId)) {
        throw new BadRequestError({ message: 'data is missing' })
    }
}
