import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { AuthenticationService } from '@/services/AuthenticationService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { StatusCodes } from 'http-status-codes'
import { ITokenJoinPayload } from './tokenJoin'

export const organizerJoin: EventHandlerAcknowledges<ITokenJoinPayload> = (event) => {
    const socketRoomService = SocketRoomService.getInstance()
    const organizerSocket = event.client as OrganizerSocket
    try {
        event.acknowledgement(EventMessage({}))

        // Add protected events to socket
        organizerSocket.on('pushBallot', (ballot: Ballot, fn) => {
            const { id } = ballot.election
            // Add ballot to vote stats for the election room
            socketRoomService.getRoom(id)?.ballotVoteStats.set(ballot.id, new BallotVoteStats(ballot))
            // todo set right room id
            event.server.to(`ElectionRoom: ${id} `).emit('ballot', ballot)
            console.log('send ack')

            fn({ status: StatusCodes.OK, message: 'got it' })
        })
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
