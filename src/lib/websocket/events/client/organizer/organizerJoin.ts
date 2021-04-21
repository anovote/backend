import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { EventHandler } from '@/lib/websocket/EventHandler'
import { DecodedTokenValue } from '@/services/AuthenticationService'
import { eventRegistration } from './eventRegistration'

/**
 * Handles the join setup for an organizer.
 * @param event event data (client,server, token value, ack)
 */
export const organizerJoin: EventHandler<DecodedTokenValue> = (event) => {
    const client = event.client as OrganizerSocket
    client.organizerId = event.data.id
    eventRegistration({ client, server: event.server })
}
