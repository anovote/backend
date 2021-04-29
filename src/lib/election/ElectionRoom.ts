//  Describes an election room for a given election. A room contains stats for all ballots for the
// Election. The organizer socket id the ID of the organizer socket when the organizer has

import { Ballot } from '@/models/Ballot/BallotEntity'
import { IVote } from '@/models/Vote/IVote'
import { BallotVoteStats } from '../voting/BallotStats'

export interface IElectionRoom {
    // the socket id of the organizer that organizes the election.
    organizerSocketId: string | undefined
    // How many voters that is connected
    connectedVoters: number
}

export type BallotVoteInformation = Map<number, { stats: BallotVoteStats; voters: Set<number> }>

/**
 * A election room contains information and methods to get/modify data for the election it serves.
 */
export class ElectionRoom implements IElectionRoom {
    private _organizerSocketId: string | undefined

    private _ballotVoteInformation: BallotVoteInformation = new Map()

    private _totalEligibleVoters = 0

    private _connectedVoters = 0

    constructor({
        totalEligibleVoters,
        ballotVoteInformation
    }: {
        totalEligibleVoters: number
        ballotVoteInformation?: BallotVoteInformation
    }) {
        this._totalEligibleVoters = totalEligibleVoters
        if (ballotVoteInformation) this._ballotVoteInformation = ballotVoteInformation
    }

    /**
     * Returns the ballot vote information object or undefined if it does not exist
     * @param id the od of the ballot to get information of
     * @returns returns ballot vote information or undefined
     */
    private getBallotVoteInformation(id: number) {
        return this._ballotVoteInformation.get(id)
    }

    /**
     * Creates and insert a ballot vote information object for the provided ballot into this election
     * room.
     * @param ballot the ballot to create vote information object of
     */
    createBallotVoteInformation(ballot: Ballot) {
        this._ballotVoteInformation.set(ballot.id, { stats: new BallotVoteStats(ballot), voters: new Set() })
    }

    /**
     * Adds the vote(s) to the ballot with the provided id.
     * The voterId is added to the ballot voters, to track which voter that has voted on the ballot.
     */
    addVote({ ballotId, voterId, votes }: { ballotId: number; voterId: number; votes: Array<IVote> }) {
        const ballotVoteInformation = this.getBallotVoteInformation(ballotId)
        if (ballotVoteInformation) {
            ballotVoteInformation.stats.addVotes(votes)
            ballotVoteInformation.voters.add(voterId)
        }
    }

    /**
     *  Returns true if all eligible voters for the given ballot id has
     * voted on the ballot
     * @param ballotId the ballot id to check for
     * @returns returns true of all eligible voters have voter
     */
    haveAllVotedOnBallot(ballotId: number) {
        let allVoted = false
        const ballotVoteInformation = this.getBallotVoteInformation(ballotId)
        if (ballotVoteInformation) {
            allVoted = ballotVoteInformation.voters.size === this._totalEligibleVoters
        }
        return allVoted
    }

    /**
     * Returns the vote stats for the provided ballotId or undefined if the ballot information
     * does not exists.
     * @param ballotId the ballot id to get stats of
     * @returns returns stats for the ballot or undefined
     */
    getBallotStats(ballotId: number) {
        const ballotVoteInformation = this.getBallotVoteInformation(ballotId)
        if (ballotVoteInformation) return ballotVoteInformation.stats.getStats()
    }

    /**
     * Returns a copy of voters for a given ballot id.
     * @param ballotId ballot id to get voters of
     * @returns returns an copy of voters for a given ballot id
     */
    getBallotVoters(ballotId: number) {
        const ballotVoteInformation = this.getBallotVoteInformation(ballotId)
        // Returns a copy to prevent mutation of original
        if (ballotVoteInformation) return new Set(ballotVoteInformation.voters)
    }

    get organizerSocketId() {
        return this._organizerSocketId
    }

    set organizerSocketId(socketId: string | undefined) {
        this._organizerSocketId = socketId
    }

    get totalEligibleVoters() {
        return this._totalEligibleVoters
    }

    get connectedVoters() {
        return this._connectedVoters
    }

    set connectedVoters(connected: number) {
        this._connectedVoters = connected
    }
}
