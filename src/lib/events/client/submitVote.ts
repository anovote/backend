import { database } from '@/loaders'
import { IVote } from '@/models/Vote/IVote'
import { VoteService } from '@/services/VoteService'
import { StatusCodes } from 'http-status-codes'
import { EventHandlerAcknowledges } from '../EventHandler'

/**
 * Submits a vote with the given vote details
 * @param data data from event
 * @param socket the socket
 * @param cb the callback to send acknowledgements with
 */
export const submitVote: EventHandlerAcknowledges<IVote> = async (vote, socket, acknowledgement) => {
    const submittedVote: IVote = vote
    const voteService = new VoteService(database)

    // Todo: send vote to organizer of the room
    // Todo: verify if vote is valid
    // Todo: verify that a voter has not voted already for the ballot
    // Todo: verify that the ballot is the current
    // Todo: send error if ballot does not exist
    // Todo: send error if ballot is not current (not sent, or ended)
    // Todo: send error if candidate is not existing on ballot
    // Todo: verify that a vote has not more candidates than allowed

    if (!submittedVote.candidate || !submittedVote.ballot || !submittedVote.voter) {
        acknowledgement({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Please provide the required data'
            // Temp fix
        } as any)
    } else {
        try {
            await voteService.create(submittedVote)
            acknowledgement({
                statusCode: StatusCodes.OK,
                message: 'Vote was submitted!'
                // Temp fix
            } as any)
        } catch (err) {
            acknowledgement({
                statusCode: StatusCodes.FORBIDDEN,
                message: 'We were not able to submit your vote'
                // Temp fix
            } as any)
        }
    }
}
