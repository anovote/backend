import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { database } from '@/loaders'
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
            if (!room.ballotVoteStats.has(ballotId)) {
                room.ballotVoteStats.set(ballotId, new BallotVoteStats(ballot))
            }
        }
        event.server.to(electionId.toString()).emit(Events.server.ballot.push, ballot)
        event.acknowledgement(EventMessage({}))
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
