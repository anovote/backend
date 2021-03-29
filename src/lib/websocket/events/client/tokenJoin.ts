import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage } from '@/lib/websocket/EventResponse'
import { AuthenticationService } from '@/services/AuthenticationService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { organizerJoin } from './organizer/organizerJoin'

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
