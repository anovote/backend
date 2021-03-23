import { Socket } from 'socket.io'

/**
 * Base socket type for socket that are to join an election
 */
export type AnoSocket = Socket
/**
 * Sockets that belongs to a voter
 */
export interface VoterSocket extends AnoSocket {
    electionId: number
    voterId: number
}

/**
 * Sockets that belong to an organizer
 */
export interface OrganizerSocket extends AnoSocket {
    organizerId: number
}
