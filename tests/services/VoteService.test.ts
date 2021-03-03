import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { BallotStatus } from '@/models/Ballot/BallotStatus'
import { BallotType } from '@/models/Ballot/BallotType'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
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
    try {
        const repo = database.getRepository(Vote)
        await clearDatabaseEntityTable(repo)

        await database.close()
    } catch (error) {
        console.error(error)
    }
})

test('Mytest', () => {
    expect(true).toBe(true)
})
