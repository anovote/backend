import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotType } from '@/models/Ballot/BallotType'
import { IVote } from '@/models/Vote/IVote'

/**
 * Vote statistics for a candidate
 */
export class CandidateVote {
    // The candidate ID from relation
    private _id: number
    /**
     * Number of votes for the candidate. This number can be higher then actual
     * votes if the ballot type is ranked, then this number represents the total rating for the candidate
     */
    private _votes = 0

    constructor(candidateId: number) {
        this._id = candidateId
    }

    get votes() {
        return this._votes
    }

    get id() {
        return this._id
    }

    /**
     * Increments vote by one
     */
    incrementVote() {
        this._votes++
    }
    /**
     * Increment the vote count by given amount
     * @param count how much to increment
     */
    incrementVoteBy(count: number) {
        this._votes += count
    }
}
export class BallotVoteStats {
    // The ballot we are providing stats for
    private _ballot: Ballot
    private _total = 0
    private _votes = 0
    private _blank = 0

    // Contains the vote stats for each candidate, the KEY is the candidate ID
    private _candidateVotes: Map<number, CandidateVote> = new Map()

    constructor(ballot: Ballot) {
        this._ballot = ballot
        this.setCandidates()
    }

    /**
     * Sets the candidates from the ballot to to vote stat map
     */
    private setCandidates() {
        for (const candidate of this._ballot.candidates) {
            this._candidateVotes.set(candidate.id, new CandidateVote(candidate.id))
        }
    }

    /**
     * Increments total votes by one
     */
    private incrementTotal() {
        this._total += 1
    }

    /**
     * Increments votes by one, and
     * increment total votes
     */
    private incrementVotes() {
        this._votes += 1
        this.incrementTotal()
    }

    /**
     * Increments the total blank votes by one, and
     * increment total votes
     */
    private incrementBlank() {
        this._blank += 1
        this.incrementTotal()
    }

    /**
     * Adds given votes to the ballot statistics, and increment the counts for the ballot
     * and for the candidate(s)
     * @param votes votes to add to the ballot stats
     */
    addVotes(votes: Array<IVote>) {
        if (this._ballot.type === BallotType.SINGLE && votes?.length > 0) {
            this.setVoteStat(votes[0])
        } else if (votes?.length > 0) {
            for (const vote of votes) {
                this.setVoteStat(vote)
            }
        }
    }

    /**
     * Increment vote stats from the provided vote.
     * Increment candidate vote, or increment blank votes based on the vote
     * @param vote the vote to do vote stat work of
     */
    private setVoteStat(vote: IVote) {
        if (vote.candidate && typeof vote.candidate === 'number') {
            const candidate = this._candidateVotes.get(vote.candidate)
            if (candidate) {
                candidate.incrementVote()
                this.incrementVotes()
            }
        } else {
            this.incrementBlank()
        }
    }

    /**
     * Returns the stats for this ballot as a JS object
     * @returns returns stats as object
     */
    getStats() {
        const candidates = []
        for (const [_, candidate] of this._candidateVotes.entries()) {
            candidates.push({
                id: candidate.id,
                votes: candidate.votes
            })
        }

        return {
            ballotId: this._ballot.id,
            stats: {
                total: this._total,
                votes: this._votes,
                blank: this._blank,
                candidates
            }
        }
    }
}
