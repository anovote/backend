import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { database } from '@/loaders'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { StatusCodes } from 'http-status-codes'
import { Events } from 'lib/websocket/events'
import { ITokenJoinPayload } from './tokenJoin'
// TODO CLEAN UP EVENTS
export const organizerJoin: EventHandlerAcknowledges<ITokenJoinPayload> = (event) => {
    const socketRoomService = SocketRoomService.getInstance()
    const organizerSocket = event.client as OrganizerSocket
    try {
        // Add protected events to socket
        organizerSocket.on(Events.client.election.administrate, ({ electionId }: { electionId: number }) => {
            SocketRoomService.getInstance().setElectionRoomOrganizer(electionId, organizerSocket)
        })
        organizerSocket.on(
            Events.client.ballot.push,
            async ({ ballotId, electionId }: { ballotId: number; electionId: number }, fn) => {
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
                // todo set right room id
                event.server.to(electionId.toString()).emit(Events.server.ballot.push, ballot)
                fn({ status: StatusCodes.OK, message: 'got it' })
            }
        )
        event.acknowledgement(EventMessage({}))
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
