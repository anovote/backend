import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { OrganizerSocket, VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { database } from '@/loaders'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Events } from 'lib/websocket/events'

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
            if (!room.ballots.has(ballotId)) {
                // Create ballot stats and voter set for the new ballot
                room.ballots.set(ballotId, { stats: new BallotVoteStats(ballot), voters: new Set() })
                // Broadcast to all since this ballot has not been created before now
                event.server.to(electionId.toString()).emit(Events.server.ballot.push, ballot)
            } else {
                // All voters that has voted on this ballot
                const ballotVotes = room.ballots.get(ballotId)?.voters
                if (ballotVotes?.size == 0) {
                    // Send to all as no one has voted on the ballot
                    event.server.to(electionId.toString()).emit(Events.server.ballot.push, ballot)
                } else {
                    // Get all socket IDs for the socket room that the ballot belongs to
                    const roomSocketIds = event.server.of('/').adapter.rooms.get(electionId.toString())
                    roomSocketIds?.forEach((socketId) => {
                        const socket = event.server.sockets.sockets.get(socketId) as VoterSocket | undefined
                        // If the voter socket exist and the voter id for that socket has not voted on the ballot yet
                        if (socket && ballotVotes && !ballotVotes.has(socket.voterId)) {
                            // Emit the ballot only to those that has not voter on the ballot yet
                            socket.emit(Events.server.ballot.push, ballot)
                        }
                    })
                }
            }
        }
        event.acknowledgement(EventMessage({}))
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
