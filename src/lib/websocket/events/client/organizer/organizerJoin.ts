import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { DecodedTokenValue } from '@/services/AuthenticationService'
import { eventRegistration } from './eventRegistration'

/**
 * Handles the join setup for an organizer.
 * @param event event data (client,server, token value, ack)
 */
export const organizerJoin: EventHandlerAcknowledges<DecodedTokenValue> = (event) => {
    try {
        const client = event.client as OrganizerSocket
        client.organizerId = event.data.id
        eventRegistration({ client, server: event.server })
        // Ok ack
        event.acknowledgement(EventMessage({}))
    } catch (err) {
        event.acknowledgement(EventErrorMessage(err))
    }
}
