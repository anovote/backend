import { BallotVoteInformation, ElectionRoom } from '@/lib/election/ElectionRoom'
import { AlreadyVotedError } from '@/lib/errors/AlreadyVotedError'
import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { BallotType } from '@/models/Ballot/BallotType'

jest.mock('@/lib/voting/BallotStats')
const BallotVoteStatsMock = BallotVoteStats as jest.MockedClass<typeof BallotVoteStats>

let ballot: Ballot
beforeEach(() => {
    ballot = new Ballot()
    ballot.id = 1
    ballot.candidates = [{ ballot: ballot, candidate: 'test', id: 1 }]
    ballot.createdAt = new Date()
    ballot.updatedAt = new Date()
    ballot.title = 'Some title'
    ballot.description = 'Some description'
    ballot.displayResultCount = true
    ballot.type = BallotType.SINGLE
    ballot.resultDisplayType = BallotResultDisplay.ALL
})

afterEach(() => {
    BallotVoteStatsMock.mockClear()
})

it('should have same total eligible voters as provided in constructor', () => {
    const total = 20
    const electionRoom = new ElectionRoom({ totalEligibleVoters: total })
    expect(electionRoom.totalEligibleVoters).toBe(total)
})

it('should not have vote stats for a ballot that do not exist', () => {
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1, ballotVoteInformation: new Map() })
    const ballotId = 1
    electionRoom.addVote({
        ballotId,
        voterId: 0,
        votes: [{ ballot: 1, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    expect(electionRoom.getBallotStats(ballotId)).toBe(undefined)
})

it('should not have vote information for a ballot that do not exist', () => {
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1, ballotVoteInformation: new Map() })
    const ballotId = 1
    expect(electionRoom.ballotVoteInformationExists(ballotId)).toBe(false)
})

it('should have zero as default connected voters', () => {
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1, ballotVoteInformation: new Map() })
    expect(electionRoom.connectedVoters).toBe(0)
})

it('should create and return ballot vote information for provided ballot', () => {
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1, ballotVoteInformation: new Map() })
    BallotVoteStatsMock.prototype.getStats = jest.fn()

    electionRoom.createBallotVoteInformation(ballot)
    expect(electionRoom.ballotVoteInformationExists(ballot.id))

    electionRoom.getBallotStats(ballot.id)
    expect(BallotVoteStats.prototype.getStats).toHaveBeenCalled()
})

it('should have vote stats information for data added in constructor', () => {
    const ballotVoteInformation: BallotVoteInformation = new Map()
    BallotVoteStatsMock.prototype.getStats = jest.fn().mockImplementation(() => {
        return { ballotId: ballot.id, stats: { blank: 0, total: 1, votes: 1, candidates: [] } }
    })
    ballotVoteInformation.set(1, {
        stats: new BallotVoteStats(ballot, [{ ballot: 1, candidate: 1, voter: 1, submitted: new Date() }]),
        voters: new Set()
    })
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1, ballotVoteInformation })
    expect(electionRoom.getBallotStats(ballot.id)?.stats.total).toBe(1)
})

it('should return empty set if no ballot stats is found', () => {
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1, ballotVoteInformation })
    expect(electionRoom.getBallotVoters(ballot.id).size).toBe(0)
})

it('should return total voters voted on ballot', () => {
    const total = 2
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: total, ballotVoteInformation })

    ballotVoteInformation.set(ballot.id, {
        stats: new BallotVoteStats(ballot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 1,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 2,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    expect(electionRoom.getBallotVoters(ballot.id).size).toBe(total)
})

it('should throw already voted error if duplicate vote', () => {
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 2, ballotVoteInformation })

    ballotVoteInformation.set(ballot.id, {
        stats: new BallotVoteStats(ballot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 1,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    expect(() =>
        electionRoom.addVote({
            ballotId: ballot.id,
            voterId: 1,
            votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
        })
    ).toThrow(AlreadyVotedError)
})

it('should return true if all voters have voted on ballot', () => {
    const total = 2
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: total, ballotVoteInformation })

    ballotVoteInformation.set(ballot.id, {
        stats: new BallotVoteStats(ballot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 1,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 2,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    expect(electionRoom.haveAllVotedOnBallot(ballot.id)).toBe(true)
})

it('should return true if all ballots have been voted on', () => {
    const total = 2
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: total, ballotVoteInformation })

    ballotVoteInformation.set(ballot.id, {
        stats: new BallotVoteStats(ballot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 1,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 2,
        votes: [{ ballot: 3, candidate: 1, submitted: new Date(), voter: 1 }]
    })

    expect(electionRoom.haveAllVotedOnBallot(ballot.id)).toBeTruthy()

    expect(electionRoom.haveAllBallotsBeenVotedOn()).toBeTruthy()
})

it('should return true if all ballots have been voted on even when checked twice', () => {
    const secondBallot = new Ballot()
    secondBallot.id = 2
    secondBallot.candidates = [{ ballot: secondBallot, candidate: 'test', id: 1 }]
    secondBallot.createdAt = new Date()
    secondBallot.updatedAt = new Date()
    secondBallot.title = 'Some title'
    secondBallot.description = 'Some description'
    secondBallot.displayResultCount = true
    secondBallot.type = BallotType.SINGLE
    secondBallot.resultDisplayType = BallotResultDisplay.ALL

    const total = 2
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: total, ballotVoteInformation })

    ballotVoteInformation.set(ballot.id, {
        stats: new BallotVoteStats(ballot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 1,
        votes: [{ ballot: 1, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 2,
        votes: [{ ballot: 1, candidate: 1, submitted: new Date(), voter: 1 }]
    })

    ballotVoteInformation.set(secondBallot.id, {
        stats: new BallotVoteStats(secondBallot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: secondBallot.id,
        voterId: 1,
        votes: [{ ballot: 2, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    electionRoom.addVote({
        ballotId: secondBallot.id,
        voterId: 2,
        votes: [{ ballot: 2, candidate: 1, submitted: new Date(), voter: 1 }]
    })

    electionRoom.haveAllVotedOnBallot(ballot.id)
    electionRoom.haveAllVotedOnBallot(secondBallot.id)
    electionRoom.haveAllVotedOnBallot(secondBallot.id)

    expect(electionRoom.haveAllBallotsBeenVotedOn()).toBeTruthy()
})

it('should return false if less ballots have been voted on', () => {
    const secondBallot = new Ballot()
    secondBallot.id = 2
    secondBallot.candidates = [{ ballot: secondBallot, candidate: 'test', id: 1 }]
    secondBallot.createdAt = new Date()
    secondBallot.updatedAt = new Date()
    secondBallot.title = 'Some title'
    secondBallot.description = 'Some description'
    secondBallot.displayResultCount = true
    secondBallot.type = BallotType.SINGLE
    secondBallot.resultDisplayType = BallotResultDisplay.ALL

    const total = 2
    const ballotVoteInformation: BallotVoteInformation = new Map()
    const electionRoom = new ElectionRoom({ totalEligibleVoters: total, ballotVoteInformation })

    ballotVoteInformation.set(ballot.id, {
        stats: new BallotVoteStats(ballot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 1,
        votes: [{ ballot: 1, candidate: 1, submitted: new Date(), voter: 1 }]
    })
    electionRoom.addVote({
        ballotId: ballot.id,
        voterId: 2,
        votes: [{ ballot: 1, candidate: 1, submitted: new Date(), voter: 1 }]
    })

    ballotVoteInformation.set(secondBallot.id, {
        stats: new BallotVoteStats(secondBallot),
        voters: new Set()
    })

    electionRoom.addVote({
        ballotId: secondBallot.id,
        voterId: 1,
        votes: [{ ballot: 2, candidate: 1, submitted: new Date(), voter: 1 }]
    })

    // missing one vote for secondBallot

    electionRoom.haveAllVotedOnBallot(ballot.id)
    electionRoom.haveAllVotedOnBallot(secondBallot.id)

    expect(electionRoom.haveAllBallotsBeenVotedOn()).toBeFalsy()
})

it('should set connected voters to provided amount', () => {
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1 })
    electionRoom.connectedVoters = 3
    expect(electionRoom.connectedVoters).toBe(3)
    electionRoom.connectedVoters = 10
    expect(electionRoom.connectedVoters).toBe(10)
})

it('should set organizer socket id', () => {
    const electionRoom = new ElectionRoom({ totalEligibleVoters: 1 })
    electionRoom.organizerSocketId = 'socketid'
    expect(electionRoom.organizerSocketId).toBe('socketid')
})
