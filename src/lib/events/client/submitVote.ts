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

    if (!submittedVote.candidate || !submittedVote.ballotId || !submittedVote.voterId) {
        acknowledgement({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Please provide the required data'
        })
    } else {
        try {
            await voteService.create(submittedVote)
            acknowledgement({
                statusCode: StatusCodes.OK,
                message: 'Vote was submitted!'
            })
        } catch (err) {
            acknowledgement({
                statusCode: StatusCodes.FORBIDDEN,
                message: 'We were not able to submit your vote'
            })
        }
    }
}
