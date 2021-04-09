import { Ballot } from '@/models/Ballot/BallotEntity'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IVote } from '@/models/Vote/IVote'
import { Vote } from '@/models/Vote/VoteEntity'
import { Connection } from 'typeorm'
import { NotFoundError } from '../errors/http/NotFoundError'
import { ServerErrorMessage } from '../errors/messages/ServerErrorMessages'

export class VoteValidator {
    private database: Connection

    constructor(db: Connection) {
        this.database = db
    }

    public async doVoteValidation(vote: IVote) {
        const { ballot, voter, candidate } = vote

        await this.checkIfBallotExists(ballot)

        this.doElectionChecks((await this.getBallotWithElection(ballot))?.election)

        await this.checkIfCandidateExists(candidate)

        await this.checkIfVoteExists(voter, ballot)
    }

    private async checkIfBallotExists(ballotId: number) {
        const ballotRepository = this.database.getRepository(Ballot)

        const ballotExists: Ballot | undefined = await ballotRepository.findOne(ballotId)

        if (!ballotExists) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Ballot') })
        }
    }

    private doElectionChecks(election: Election | undefined) {
        this.checkIfElectionExists(election)
        this.checkIfElectionIsStarted(election)
    }

    private checkIfElectionExists(election: Election | undefined) {
        if (!election) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })
        }
    }

    private checkIfElectionIsStarted(election: Election | undefined) {
        if (election?.status.valueOf() !== ElectionStatus.Started) {
            throw new Error('Cannot vote on a not stated election')
        }
    }

    private async checkIfCandidateExists(candidate: number | 'blank' | null) {
        const candidateRepository = this.database.getRepository(Candidate)

        if (!(candidate === 'blank' || candidate === null)) {
            const candidateExists: Candidate | undefined = await candidateRepository.findOne(candidate)
            if (!candidateExists) {
                throw new NotFoundError({ message: ServerErrorMessage.notFound('Candidate') })
            }
        }
    }

    private async checkIfVoteExists(voter: number, ballot: number) {
        const voteRepository = this.database.getRepository(Vote)

        const voteExists = await voteRepository.findOne({ voter, ballot })

        if (voteExists) {
            throw new Error('I already exist')
        }
    }

    private async getBallotWithElection(ballotId: number): Promise<Ballot | undefined> {
        const ballotRepository = this.database.getRepository(Ballot)

        return await ballotRepository.findOne({
            where: {
                id: ballotId
            },
            relations: ['election']
        })
    }
}
