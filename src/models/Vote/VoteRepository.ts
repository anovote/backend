import { EntityRepository, Repository } from 'typeorm'
import { IVote } from './IVote'
import { Vote } from './VoteEntity'

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
    createVote(iVote: IVote): Vote {
        const vote = new Vote()

        if (iVote.candidate === 'blank') {
            vote.candidate = null
        } else {
            vote.candidate = iVote.candidate
        }

        vote.submitted = iVote.submitted
        vote.voterId = iVote.voterId
        vote.ballotId = iVote.ballotId

        return vote
    }
}
