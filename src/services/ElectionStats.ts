import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { Vote } from '@/models/Vote/VoteEntity'
import { Connection } from 'typeorm'
import { ElectionService } from './ElectionService'
import { IBallotStats } from './IBallotStats'
import { VoteService } from './VoteService'

export class ElectionStatsService {
    database: Connection
    owner: ElectionOrganizer

    constructor(database: Connection, owner: ElectionOrganizer) {
        this.database = database
        this.owner = owner
    }
    async getElectionStats(electionId: number): Promise<IBallotStats[]> {
        const election = await new ElectionService(this.database, this.owner).getById(electionId)
        if (!election) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })
        }
        const { ballots } = election

        const stats: IBallotStats[] = []

        const voteService = new VoteService(this.database)

        for await (const ballot of ballots) {
            const ballotVotes = await voteService.getByBallotId(ballot.id)
            stats.push(this.summarizeVotes(ballotVotes, ballot))
        }
        return stats
    }

    private summarizeVotes(votes: Vote[], ballot: Ballot) {
        const stats: BallotVoteStats = new BallotVoteStats(ballot)
        stats.addVotes(votes)
        return stats.getStats()
    }
}
