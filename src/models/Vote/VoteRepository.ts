import { EntityRepository, Repository } from 'typeorm'
import { IVote } from './IVote'
import { Vote } from './VoteEntity'

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
    createVote(iVote: IVote): Vote {
        const vote = new Vote()

        vote.id = iVote.id
        vote.candidate = iVote.candidate
        vote.submitted = iVote.submitted
        vote.voterId = iVote.voterId
        vote.ballotId = iVote.ballotId

        return vote
    }
}
