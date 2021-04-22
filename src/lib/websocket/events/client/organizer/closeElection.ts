import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { UnauthorizedError } from '@/lib/errors/http/UnauthorizedError'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandler } from '@/lib/websocket/EventHandler'
import { Events } from '@/lib/websocket/events'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { ElectionService } from '@/services/ElectionService'
import chalk from 'chalk'

export const closeElection: EventHandler<CloseElectionEventData> = async (event) => {
    const { electionId } = event.data

    if (!electionId || Number.isNaN(electionId) || !Number.isInteger(electionId)) {
        throw new BadRequestError({ message: 'data is missing' })
    }

    const client = event.client as OrganizerSocket
    logger.info(`election ${chalk.red(electionId)} is been closed by ${chalk.blue(client.id)}`)
    logger.info(`emitting to room ${chalk.red(electionId)}`)

    const organizer = await new ElectionOrganizerService(database).getById(client.organizerId)
    if (!organizer) {
        throw new NotFoundError({ message: 'no organizer' })
    }

    const election = await new ElectionService(database, organizer).getById(electionId)
    if (!election) {
        throw new UnauthorizedError({ message: 'organizer is not owner' })
    }

    const server = event.server
    server.to(electionId.toString()).emit(Events.server.election.close, 'election is closed')
    // todo log ack?
}

interface CloseElectionEventData {
    electionId: number
}
