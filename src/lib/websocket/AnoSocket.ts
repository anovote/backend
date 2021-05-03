import { Socket } from 'socket.io'
import { ElectionCode } from 'lib/voting/ElectionCode'
import { VoterId } from 'lib/voting/VoterId'

/**
 * Base socket type for socket that are to join an election
 */
export type AnoSocket = Socket
/**
 * Sockets that belongs to a voter
 */
export interface VoterSocket extends AnoSocket {
    electionCode: ElectionCode
    voterId: VoterId
}

/**
 * Sockets that belong to an organizer
 */
export interface OrganizerSocket extends AnoSocket {
    organizerId: number
}
