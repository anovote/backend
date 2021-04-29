import { BaseError } from '@/lib/errors/BaseError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { OrganizerSocket, VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { Events } from '@/lib/websocket/events'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotStatus } from '@/models/Ballot/BallotStatus'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Server } from 'socket.io'

/**
 * Emits the provided ballot to all voter sockets that has not
 * voted yet.
 * @param server the socket io server
 * @param roomId the room to emit to
 * @param ballotVoters all voters for the ballot
 * @param ballot the ballot to emit
 */
function emitBallotToNotVotedSockets(server: Server, roomId: string, ballotVoters: Set<number>, ballot: Ballot) {
    // Get all socket IDs for the socket room that the ballot belongs to
    const roomSocketIds = server.of('/').adapter.rooms.get(roomId)
    roomSocketIds?.forEach((socketId) => {
        const socket = server.sockets.sockets.get(socketId) as VoterSocket | undefined
        // If the voter socket exist and the voter id for that socket has not voted on the ballot yet
        if (socket && !ballotVoters.has(socket.voterId)) {
            // Emit the ballot only to those that has not voter on the ballot yet
            socket.emit(Events.server.ballot.push, ballot)
        }
    })
}
/**
 * Responsible for pushing a ballot to all voters in a election.
 * @param event event data (socket, server, data, ack callback)
 */
export const pushBallot: EventHandlerAcknowledges<{ ballotId: number; electionId: number }> = async (event) => {
    try {
        const { electionId, ballotId } = event.data
        const socketRoomService = SocketRoomService.getInstance()
        const organizerSocket = event.client as OrganizerSocket
        const ballotService = new BallotService(database, new ElectionService(database), {
            id: organizerSocket.organizerId
        } as ElectionOrganizer)
        const roomId = electionId.toString()
        const roomSocket = event.server.to(roomId)
        const room = socketRoomService.getRoom(roomId)
        const ballot = await ballotService.getById(ballotId)

        if (!room || !ballot) {
            if (!room) {
                throw new NotFoundError({
                    message: ServerErrorMessage.notFound('Election room'),
                    code: 'ELECTION_ROOM_NOT_EXIST'
                })
            } else {
                throw new NotFoundError({
                    message: ServerErrorMessage.notFound('Ballot'),
                    code: 'BALLOT_NOT_EXIST'
                })
            }
        }

        // If the ballot is archived, we do not want to proceed and just
        // take an early exit
        if (ballot.status === BallotStatus.IN_ARCHIVE) return

        // Update ballot to in progress
        ballot.status = BallotStatus.IN_PROGRESS
        await ballotService.update(ballot.id, ballot)

        // Create ballot vote information as we did not get any ballot voters
        if (!room.ballotVoteInformationExists(ballot.id)) room.createBallotVoteInformation(ballot)

        // Get voters for the ballot
        const ballotVoters = room.getBallotVoters(ballotId)
        if (ballotVoters.size == 0) {
            // Send to all as no one has voted on the ballot
            roomSocket.emit(Events.server.ballot.push, ballot)
        } else {
            emitBallotToNotVotedSockets(event.server, roomId, ballotVoters, ballot)
        }

        logger.info(`Ballot ${ballot.id} was pushed`)
        // Return updated ballot to organizer
        return event.acknowledgement(EventMessage({ ballot }))
    } catch (err) {
        logger.error(err)
        // Only emit errors that is safe to emit
        if (err instanceof BaseError) event.acknowledgement(EventErrorMessage(err))
    }
}
