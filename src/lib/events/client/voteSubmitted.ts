import { IVote } from '@/models/Vote/IVote'
import { StatusCodes } from 'http-status-codes'
import { EventHandlerAcknowledges } from '../EventHandler'

export const voteSubmitted: EventHandlerAcknowledges<IVote> = async (data, socket, cb) => {
    const vote: IVote = data

    if (!vote.candidate) {
        cb({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Please provide the required data'
        })
    } else {
        cb({
            statusCode: StatusCodes.OK,
            message: 'Vote was submitted'
        })
    }
}
