import { OrganizerSocket, VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { Events } from '@/lib/websocket/events'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { BallotStatus } from '@/models/Ballot/BallotStatus'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Events } from '@/lib/websocket/events'

/**
 * Responsible for pushing a ballot to all voters in a election.
 * @param event event data (socket, server, data, ack callback)
 */
export const pushBallot: EventHandlerAcknowledges<{ ballotId: number; electionId: number }> = async (event) => {
    const socketRoomService = SocketRoomService.getInstance()
    const organizerSocket = event.client as OrganizerSocket
    try {
        const { electionId, ballotId } = event.data
        // Add ballot to vote stats for the election room
        const ballotService = new BallotService(database, new ElectionService(database), {
            id: organizerSocket.organizerId
        } as ElectionOrganizer)
        const room = socketRoomService.getRoom(electionId)
        const ballot = await ballotService.getById(ballotId)
        if (room && ballot) {
            // Update ballot to in progress
            ballot.status = BallotStatus.IN_PROGRESS
            await ballotService.update(ballot.id, ballot)

            // Get voters for the ballot
            const ballotVoters = room.getBallotVoters(ballotId)
            if (ballotVoters) {
                if (ballotVoters?.size == 0) {
                    // Send to all as no one has voted on the ballot
                    event.server.to(electionId.toString()).emit(Events.server.ballot.push, ballot)
                } else {
                    // Get all socket IDs for the socket room that the ballot belongs to
                    const roomSocketIds = event.server.of('/').adapter.rooms.get(electionId.toString())
                    roomSocketIds?.forEach((socketId) => {
                        const socket = event.server.sockets.sockets.get(socketId) as VoterSocket | undefined
                        // If the voter socket exist and the voter id for that socket has not voted on the ballot yet
                        if (socket && ballotVoters && !ballotVoters.has(socket.voterId)) {
                            // Emit the ballot only to those that has not voter on the ballot yet
                            socket.emit(Events.server.ballot.push, ballot)
                        }
                    })
                }
            } else {
                // Create ballot stats and voter set for the new ballot
                room.createBallotVoteInformation(ballot)
                // Broadcast to all since this ballot has not been created before now
                event.server.to(electionId.toString()).emit(Events.server.ballot.push, ballot)
            }

            // Return updated to organizer
            event.acknowledgement(EventMessage({ ballot }))
        }
        event.acknowledgement(EventMessage({}))
    } catch (err) {
        logger.error(err)
        event.acknowledgement(EventErrorMessage(err))
    }
}
