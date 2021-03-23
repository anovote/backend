import { Ballot } from '@/models/Ballot/BallotEntity'
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
    }

    private incrementTotal() {
        this._total += 1
    }

    private incrementVotes() {
        this._votes += 1
        this.incrementTotal()
    }

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
        for (const vote of votes) {
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
