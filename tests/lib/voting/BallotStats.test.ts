import { BallotVoteStats } from '@/lib/voting/BallotStats'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotType } from '@/models/Ballot/BallotType'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { ICandidate } from '@/models/Candidate/ICandidate'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IVote } from '@/models/Vote/IVote'
import { Vote } from '@/models/Vote/VoteEntity'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../../helpers/database'
import { createDummyBallot } from '../../helpers/seed/ballot'
import { createDummyCandidate } from '../../helpers/seed/candidate'
import { createDummyElection } from '../../helpers/seed/election'
import { createDummyOrganizer } from '../../helpers/seed/organizer'

let ballot: Ballot
let organizer: ElectionOrganizer
let election: Election
let candidate1: Candidate
let candidate2: Candidate
let database: Connection

beforeAll(async () => {
    database = await getTestDatabase()
})

beforeEach(async () => {
    organizer = await createDummyOrganizer(database)
    election = await createDummyElection(database, organizer)
    ballot = await createDummyBallot(database, election)
    candidate1 = await createDummyCandidate(database, ballot)
    candidate2 = await createDummyCandidate(database, ballot)
    ballot.candidates.push(candidate1, candidate2)
})

it('should only increment votes and total', () => {
    const ballotStats = new BallotVoteStats(ballot)
    const vote: IVote = { ballot: ballot.id, candidate: candidate1.id, submitted: new Date(), voter: 1 }
    ballotStats.addVotes([vote])
    expect(ballotStats.getStats().stats.blank).toBe(0)
    expect(ballotStats.getStats().stats.votes).toBe(1)
    expect(ballotStats.getStats().stats.total).toBe(1)
})

it('should only increment blank and total', () => {
    const ballotStats = new BallotVoteStats(ballot)
    const vote: IVote = { ballot: ballot.id, candidate: null, submitted: new Date(), voter: 1 }
    ballotStats.addVotes([vote])
    expect(ballotStats.getStats().stats.blank).toBe(1)
    expect(ballotStats.getStats().stats.votes).toBe(0)
    expect(ballotStats.getStats().stats.total).toBe(1)
})

it('should only handle the first vote when ballot type is single, if multiple votes is provided', () => {
    ballot.type = BallotType.SINGLE
    const ballotStats = new BallotVoteStats(ballot)
    const vote: IVote = { ballot: ballot.id, candidate: null, submitted: new Date(), voter: 1 }
    const vote2: IVote = { ballot: ballot.id, candidate: candidate1.id, submitted: new Date(), voter: 1 }
    ballotStats.addVotes([vote, vote2])
    expect(ballotStats.getStats().stats.blank).toBe(1)
    expect(ballotStats.getStats().stats.votes).toBe(0)
    expect(ballotStats.getStats().stats.total).toBe(1)
})
