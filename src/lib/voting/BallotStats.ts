import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotType } from '@/models/Ballot/BallotType'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { IVote } from '@/models/Vote/IVote'
import { IBallotStats } from '@/services/IBallotStats'
import { ICandidateStats } from '@/services/ICandidateStats'

/**
 * Vote statistics for a candidate
 */
export class CandidateVote implements ICandidateStats {
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
    private _total = 0 // combination of votes and blank
    private _votes = 0
    private _blank = 0

    // Contains the vote stats for each candidate, the KEY is the candidate ID
    private _candidateVotes: Map<number, CandidateVote> = new Map()

    constructor(ballot: Ballot, votes?: Array<IVote>) {
        this._ballot = ballot
        this.setCandidates()
        if (votes) this.initializeVotes(votes)
    }

    /**
     * Initialize this ballot vote stats with votes.
     * @param votes the votes to initialize the ballot stats with
     */
    private initializeVotes(votes: Array<IVote>) {
        for (const vote of votes) {
            this.setVoteStat(vote)
        }
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
        if (
            vote.candidate !== null &&
            !(vote.candidate instanceof Candidate) &&
            typeof vote.candidate !== 'number' &&
            vote.candidate !== 'blank'
        ) {
            throw new Error('The candidate is wrong type')
        }

        const candidate = this._candidateVotes.get(this.getVoteCandidateId(vote))
        if (candidate) {
            candidate.incrementVote()
            this.incrementVotes()
        } else if (null === vote.candidate || vote.candidate === 'blank') {
            this.incrementBlank()
        }
    }

    /**
     * Returns the id of the candidate in the vote, or -1 if there are candidate id present.
     * @param vote vote to get candidate id from
     * @returns return the id of the candidate, or -1 of not ids
     */
    private getVoteCandidateId(vote: IVote) {
        let candidateId = -1

        if (typeof vote.candidate === 'number') candidateId = vote.candidate
        else if (vote.candidate instanceof Candidate) candidateId = vote.candidate.id

        return candidateId
    }

    /**
     * Returns the stats for this ballot as a JS object
     * @returns returns stats as object
     */
    getStats(): IBallotStats {
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
