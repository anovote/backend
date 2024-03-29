import { deepCopy } from '@/helpers/object'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IVote } from '@/models/Vote/IVote'
import { Vote } from '@/models/Vote/VoteEntity'
import { HashService } from '@/services/HashService'
import { VoteService } from '@/services/VoteService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { createDummyBallot } from '../helpers/seed/ballot'
import { createDummyCandidate } from '../helpers/seed/candidate'
import { createStartedDummyElection } from '../helpers/seed/election'
import { createDummyOrganizer } from '../helpers/seed/organizer'
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
    database = await getTestDatabase()
    organizer = await createDummyOrganizer(database)
    election = await createStartedDummyElection(database, organizer)
    ballot = await createDummyBallot(database, election)
    candidate = await createDummyCandidate(database, ballot)

    seedDTO = {
        candidate: candidate.id,
        voter: 69995,
        submitted: new Date('2021-01-16'),
        ballot: ballot.id
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
        voter: 69,
        submitted: new Date('2021-01-16'),
        ballot: ballot.id
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
    vote.ballot = 1034
    await expect(voteService.create(vote)).rejects.toThrowError(NotFoundError)
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
    const voter = 1
    const blankVote: IVote = { ballot: ballot.id, candidate: 'blank', submitted: new Date(), voter }
    const saveVote = await voteService.create(blankVote)

    expect.assertions(2)
    expect(saveVote?.voter === voter).toBeTruthy()
    expect(saveVote?.candidate === null).toBeTruthy()
})

test('that a candidate cast as null is registered as null in database', async () => {
    const voter = 1
    const blankVote: IVote = { ballot: ballot.id, candidate: null, submitted: new Date(), voter }
    const saveVote = await voteService.create(blankVote)

    expect.assertions(2)
    expect(saveVote!.voter === voter).toBeTruthy()
    expect(saveVote!.candidate === null).toBeTruthy()
})

it('Should not be able to vote on a candidate that does not exists', async () => {
    const voter = 1
    const candidateNotExistVote: IVote = { ballot: ballot.id, candidate: 32902, submitted: new Date(), voter }
    await expect(voteService.create(candidateNotExistVote)).rejects.toThrowError(NotFoundError)
})

it('Should not be able to vote when election is not started', async () => {
    const electionRepository = database.getRepository(Election)
    const hashService = new HashService()

    const notStartedElection = electionRepository.create({
        title: 'Election yes',
        password: await hashService.hash('password'),
        status: ElectionStatus.NotStarted,
        electionOrganizer: organizer,
        description: 'Long description',
        image: 'img.png',
        openDate: new Date(),
        closeDate: new Date(),
        isLocked: true,
        isAutomatic: false,
        eligibleVoters: []
    })

    const createdElection = await electionRepository.save(notStartedElection)
    const testBallot = await createDummyBallot(database, createdElection)

    const voter = 1
    const electionStatusNotValidVote: IVote = {
        ballot: testBallot.id,
        candidate: null,
        submitted: new Date(),
        voter
    }

    await expect(voteService.create(electionStatusNotValidVote)).rejects.toThrowError()
})
