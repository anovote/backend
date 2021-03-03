import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { BallotStatus } from '@/models/Ballot/BallotStatus'
import { BallotType } from '@/models/Ballot/BallotType'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { Vote } from '@/models/Vote/VoteEntity'
import { Connection } from 'typeorm'
import setupConnection from '../helpers/setupTestDB'

let database: Connection
beforeAll(async () => {
    database = await setupConnection()

    const orgRes = database.getRepository(ElectionOrganizer)
    const organizer = new ElectionOrganizer()
    organizer.firstName = 'Sander'
    organizer.lastName = 'Træen'
    organizer.password = 'Password'

    const election = new Election()
    election.electionOrganizer = organizer
    election.title = 'Election title'
    election.description = 'Election description'
    election.password = 'password'
    election.status = ElectionStatus.NotStarted
    election.isLocked = true
    election.isAutomatic = false

    const ballot = new Ballot()
    ballot.election = election
    ballot.title = 'Ballot title'
    ballot.description = 'Ballot description'
    ballot.image = 'Ballot image'
    ballot.type = BallotType.SINGLE
    ballot.resultDisplayType = BallotResultDisplay.SINGLE
    ballot.resultDisplayTypeCount = 1
    ballot.displayResultCount = false
    ballot.order = 1
    ballot.status = BallotStatus.IN_QUEUE
    ballot.candidates = []

    const candidate = new Candidate()
    candidate.candidate = 'Hufsa Holanger'
    candidate.ballot = ballot

    const vote = new Vote()
    vote.candidate = candidate.id
    vote.submitted = new Date('2021-01.16')
    vote.ballotId = ballot.id
})

afterAll(async () => {
    await database.close()
})

test('Mytest', () => {
    expect(true).toBe(true)
})
