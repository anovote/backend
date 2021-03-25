import { database } from '@/loaders'
import { IVote } from '@/models/Vote/IVote'
import { SocketRoomService } from '@/services/SocketRoomService'
import { VoteService } from '@/services/VoteService'
import { StatusCodes } from 'http-status-codes'
import { Events } from '..'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { VoterSocket } from '../../AnoSocket'

/**
 * Submits a vote with the given vote details
 * @param data data from event
 * @param socket the socket
 * @param cb the callback to send acknowledgements with
 */
export const submitVote: EventHandlerAcknowledges<IVote> = async (event) => {
    const voterSocket = event.client as VoterSocket
    const submittedVote: IVote = event.data
    const voteService = new VoteService(database)
    const socketRoomService = SocketRoomService.getInstance()

    // Todo: send vote to organizer of the room
    // Todo: verify if vote is valid
    // Todo: verify that a voter has not voted already for the ballot
    // Todo: verify that the ballot is the current
    // Todo: send error if ballot does not exist
    // Todo: send error if ballot is not current (not sent, or ended)
    // Todo: send error if candidate is not existing on ballot
    // Todo: verify that a vote has not more candidates than allowed
    // Todo: assign points to RANKED votes according to order of candidates

    if (!submittedVote.candidate || !submittedVote.ballot || !submittedVote.voter) {
        event.acknowledgement({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Please provide the required data'
            // Temp fix
        } as any)
    } else {
        try {
            // Create vote first so we know it at least inserts into the database
            await voteService.create(submittedVote)
            const room = socketRoomService.getRoom(voterSocket.electionId)
            if (room) {
                const ballotStats = room.ballotVoteStats.get(submittedVote.ballot)
                ballotStats?.addVotes([submittedVote])
                // If organizer is connected, we can get the socket id here to broadcast
                if (room?.organizerSocketId) {
                    // Volatile so events do not stack, we only want to send the last one
                    voterSocket.volatile
                        .to(room.organizerSocketId)
                        .emit(Events.server.vote.newVote, ballotStats!.getStats())
                }
                event.acknowledgement({
                    statusCode: StatusCodes.OK,
                    message: 'Vote was submitted!'
                    // Temp fix
                } as any)
            } else {
                event.acknowledgement({
                    statusCode: StatusCodes.NOT_FOUND,
                    message: 'Room not found'
                    // Temp fix
                } as any)
            }
        } catch (err) {
            event.acknowledgement({
                statusCode: StatusCodes.FORBIDDEN,
                message: 'We were not able to submit your vote'
                // Temp fix
            } as any)
        }
    }
}
