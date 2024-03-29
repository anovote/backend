import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { Events } from '@/lib/websocket/events'
import { Server } from 'socket.io'
import { submitVote } from './submitVote'
import { voterDisconnect } from './voterDisconnect'

/**
 * Handles registration of all events for a voter after joining
 */
export const eventRegistration = ({ client, server }: { client: VoterSocket; server: Server }) => {
    client.on(Events.client.vote.submit, (data, acknowledgement) =>
        submitVote({ client, server, data, acknowledgement })
    )
    client.on(Events.standard.socket.disconnect, (data) => {
        voterDisconnect({ client, server, data })
    })
}
