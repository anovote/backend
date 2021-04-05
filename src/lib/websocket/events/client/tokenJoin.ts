import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { AuthenticationService } from '@/services/AuthenticationService'
import { VoterSocket } from '../../AnoSocket'
import { organizerJoin } from './organizer/organizerJoin'
import { enterElection } from './voter/enterElection'

export interface ITokenJoinPayload {
    token: string
}
// JOIN HANDLER FOR TOKEN AUTHENTICATION
export const tokenJoin: EventHandlerAcknowledges<ITokenJoinPayload> = (event) => {
    const authService = new AuthenticationService()
    try {
        if (event.data && event.data.token) {
            const { token } = event.data
            const decoded = authService.verifyToken(token)
            if (decoded) {
                if (decoded.organizer) {
                    organizerJoin({ ...event, data: decoded })
                } else {
                    const voterSocket = event.client as VoterSocket
                    if (!voterSocket.electionCode && decoded.electionId) {
                        enterElection({ ...event, data: { electionCode: decoded.electionId, voterId: decoded.id } })
                        event.acknowledgement(EventMessage({}))
                    }
                }
            } else {
                // return error
            }
        }
    } catch (err) {
        //TODO handle other errors and convert to response error format
        event.acknowledgement(EventErrorMessage(err))
    }
}
