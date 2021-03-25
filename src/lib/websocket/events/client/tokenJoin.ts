import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { AuthenticationService } from '@/services/AuthenticationService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { StatusCodes } from 'http-status-codes'
import { organizerJoin } from './organizerJoin'

export interface ITokenJoinPayload {
    token: string
}
// JOIN HANDLER FOR TOKEN AUTHENTICATION
export const tokenJoin: EventHandlerAcknowledges<ITokenJoinPayload> = (event) => {
    const socketRoomService = SocketRoomService.getInstance()
    const authService = new AuthenticationService()
    try {
        if (event.data && event.data.token) {
            const { token } = event.data
            const decoded = authService.verifyToken(token)
            if (decoded) {
                // Ok emit, that we have proceeded
                event.acknowledgement(EventMessage({}))
                if (decoded.organizer) {
                    ;(event.client as OrganizerSocket).organizerId = decoded.id
                    organizerJoin(event)
                }
            } else {
                // return error
            }
        }
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
