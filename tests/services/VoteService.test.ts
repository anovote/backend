import { deepCopy } from '@/helpers/object'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
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
        voterId: 69995,
        submitted: new Date('2021-01-16'),
        ballotId: ballot.id
    }
})

beforeEach(async () => {
    voteService = new VoteService(database)
    const repo = database.getRepository(Vote)
    await clearDatabaseEntityTable(repo)
})

afterEach(() => {
    const repo = database.getRepository(Vote)
})

afterAll(async () => {
    const repo = database.getRepository(Vote)
    await database.close()
})

it('Should create a vote with all data filled out', async () => {
    const vote = await voteService.create({
        candidate: candidate.id,
        voterId: 69,
        submitted: new Date('2021-01-16'),
        ballotId: ballot.id
    })
    expect(vote).toBeInstanceOf(Vote)
})

it('Should throw error when candidate id do not exist', async () => {
    seedVote = (await voteService.create(seedDTO)) as Vote
    const vote = deepCopy<IVote>(seedVote)
    vote.candidate = 96
    expect.assertions(1)
    await expect(voteService.create(vote)).rejects.toThrowError()
})

it('Should throw error when ballot id do not exist', async () => {
    seedVote = (await voteService.create(seedDTO)) as Vote
    const vote = deepCopy<IVote>(seedVote)
    vote.ballotId = 1034
    await expect(voteService.create(vote)).rejects.toThrowError()
})

it('Should not be able to vote on a candidate that has already been voted on', async () => {
    await voteService.create(seedDTO)
    await expect(voteService.create(seedDTO)).rejects.toThrowError()
})

it('Should not be able to update a vote', async () => {
    seedVote = (await voteService.create(seedDTO)) as Vote
    const id = seedVote!.id
    expect.assertions(1)
    await expect(voteService.update(id, seedVote)).rejects.toThrow()
})

it('Should not be able to delete a vote', async () => {
    seedVote = (await voteService.create(seedDTO)) as Vote
    const id = seedVote!.id
    expect.assertions(1)
    await expect(voteService.delete(id)).rejects.toThrow(NotFoundError)
})

test('that a candidate cast as blank is registered as null in database', async () => {
    const voterId = 1
    const blankVote: IVote = { ballotId: ballot.id, candidate: 'blank', submitted: new Date(), voterId }
    const saveVote = await voteService.create(blankVote)

    expect.assertions(2)
    expect(saveVote?.voterId === voterId).toBeTruthy()
    expect(saveVote?.candidate === null).toBeTruthy()
})

test('that a candidate cast as null is registered as null in database', async () => {
    const voterId = 1
    const blankVote: IVote = { ballotId: ballot.id, candidate: null, submitted: new Date(), voterId }
    const saveVote = await voteService.create(blankVote)

    expect.assertions(2)
    expect(saveVote!.voterId === voterId).toBeTruthy()
    expect(saveVote!.candidate === null).toBeTruthy()
})
