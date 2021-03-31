import { ElectionCode } from '@/lib/voting/ElectionCode'
import { VoterId } from '@/lib/voting/VoterId'
import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandler } from '@/lib/websocket/EventHandler'
import { SocketRoomService } from '@/services/SocketRoomService'
import { eventRegistration } from './eventRegistration'

/**
 * Assigns electionCode, voter ID to the joined voter socket and adds the voter to the appropriate room
 * @param event event details
 */
export const enterElection: EventHandler<{ electionCode: ElectionCode; voterId: VoterId }> = async (event) => {
    const voterSocket = event.client as VoterSocket
    voterSocket.electionCode = event.data.electionCode
    voterSocket.voterId = event.data.voterId
    await SocketRoomService.getInstance().addUserToRoom(voterSocket, event.server)
    // TODO Send out election details
    eventRegistration({ client: event.client as VoterSocket, server: event.server })
}
