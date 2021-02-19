import { Connection, Repository } from 'typeorm'
import { ElectionOrganizer } from '../ElectionOrganizer/ElectionOrganizerEntity'
import { Election } from './ElectionEntity'
import { ElectionStatus } from './ElectionStatus'
import setupConnection from '@/loaders/setupTestDB'

let repo: Repository<Election>
let conn: Connection

beforeEach(async () => {
  conn = await setupConnection()
  repo = conn.getRepository(Election)
})

afterEach(() => {
  return conn.close()
})

test('Election without status set should return entity with status set to default', async () => {
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []

  await repo.save(election)
  const el = await repo.find({
    where: {
      id: 1
    }
  })

  let firstElection = el[0]
  expect(firstElection.status).toBe<ElectionStatus>(ElectionStatus.NotStarted)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.Started)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
})

test('Election with status set to Started should return with status started', async () => {
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []

  election.status = ElectionStatus.Started
  await repo.save(election)
  const el = await repo.find({
    where: {
      id: 1
    }
  })

  let firstElection = el[0]
  expect(firstElection.status).toBe<ElectionStatus>(ElectionStatus.Started)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.NotStarted)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
})
