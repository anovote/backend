import { deepCopy } from '@/helpers/object'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IVote } from '@/models/Vote/IVote'
import { Vote } from '@/models/Vote/VoteEntity'
import { VoteService } from '@/services/VoteService'
import { Connection } from 'typeorm'
import { createDummyBallot } from '../helpers/seed/ballot'
import { createDummyCandidate } from '../helpers/seed/candidate'
import { createDummyElection } from '../helpers/seed/election'
import { createDummyOrganizer } from '../helpers/seed/organizer'
import setupConnection from '../helpers/setupTestDB'
import { clearDatabaseEntityTable } from '../Tests.utils'

let database: Connection
let organizer: ElectionOrganizer
let election: Election
let ballot: Ballot
let candidate: Candidate
let voteService: VoteService
let seedVote: Vote
let seedDTO: IVote

beforeAll(async () => {
    database = await setupConnection()
    organizer = await createDummyOrganizer(database)
    election = await createDummyElection(database, organizer)
    ballot = await createDummyBallot(database, election)
    candidate = await createDummyCandidate(database, ballot)

    seedDTO = {
        candidate: candidate.id,
        voterId: 69,
        submitted: new Date('2021-01-16'),
        ballotId: ballot.id
    }
})

beforeEach(async () => {
    voteService = new VoteService(database)
    const repo = database.getRepository(Vote)
    await clearDatabaseEntityTable(repo)
})

afterAll(async () => {
    const repo = database.getRepository(Vote)
    await clearDatabaseEntityTable(repo)
    await database.close()
})

test('Should create a vote with all data filled out', async () => {
    const vote = await voteService.create({
        candidate: candidate.id,
        voterId: 69,
        submitted: new Date('2021-01-16'),
        ballotId: ballot.id
    })
    expect(vote).toBeInstanceOf(Vote)
})

test('Should throw error when candidate id do not exist', async () => {
    seedVote = (await voteService.create(seedDTO)) as Vote
    const vote = deepCopy<IVote>(seedVote)
    vote.candidate = 96
    try {
        await expect(voteService.create(vote)).rejects.toThrowError()
    } catch (error) {
        console.error(error)
    }
})

test('Should throw error when ballot id do not exist', async () => {
    seedVote = (await voteService.create(seedDTO)) as Vote
    const vote = deepCopy<IVote>(seedVote)
    vote.ballotId = 69
    try {
        await expect(voteService.create(vote)).rejects.toThrowError()
    } catch (error) {
        console.error(error)
    }
})
