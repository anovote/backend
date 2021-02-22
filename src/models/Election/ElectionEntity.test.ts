import { Connection, getConnection, Repository } from 'typeorm'
import { ElectionOrganizer } from '../ElectionOrganizer/ElectionOrganizerEntity'
import { Election } from './ElectionEntity'
import { ElectionStatus } from './ElectionStatus'
import setupConnection from '@/loaders/setupTestDB'
import { clearDatabaseEntityTable } from '@/../tests/Tests.utils'

let repo: Repository<Election>
let conn: Connection

beforeAll(async () => {
  try {
    conn = await setupConnection()
    return conn
  } catch (err) {
    console.log(err)
  }
})

beforeEach(async () => {
  repo = getConnection(process.env.DB_TEST_DATABASE).getRepository(Election)
  // await clearDatabase(repo)
  await clearDatabaseEntityTable(repo)
})

afterAll(async () => {
  try {
    return await conn.close()
  } catch (err) {
    console.log(err)
  }
})

test('Election without status set should return entity with status set to default', async () => {
  repo = conn.getRepository(Election)
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
  repo = conn.getRepository(Election)
  const election = repo.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  await repo.save(election)
  const el = await repo.find()
  let firstElection = el[0]
  expect(firstElection.status).toBe<ElectionStatus>(ElectionStatus.Started)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.NotStarted)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
})
// async function clearDatabase(repo: Repository<Election>) {
//   const entries = await repo.find()
//   repo.remove(entries)
// }
