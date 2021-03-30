import { OrganizerSocket } from '@/lib/websocket/AnoSocket'
import { Server } from 'socket.io'
import { Events } from '../..'
import { administrateElection } from './administrateElection'
import { pushBallot } from './pushBallot'

/**
 * Handles registration of all events for an election organizer
 */
export const eventRegistration = ({ client, server }: { client: OrganizerSocket; server: Server }) => {
    client.on(Events.client.ballot.push, (data, acknowledgement) => {
        pushBallot({ client, server, data, acknowledgement })
    })

    client.on(Events.client.election.administrate, (data, acknowledgement) => {
        administrateElection({ client, server, data, acknowledgement })
    })
}
