import { Connection, getConnection, Repository } from 'typeorm'
import setupConnection from '../helpers/setupTestDB'
import { clearDatabaseEntityTable } from '@/../tests/Tests.utils'
import config from '@/config'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'

let electionRepository: Repository<Election>
let connection: Connection

beforeAll(async () => {
  try {
    connection = await setupConnection()
    return connection
  } catch (err) {
    console.log(err)
  }
})

beforeEach(async () => {
  electionRepository = getConnection(config.environment).getRepository(Election)
  await clearDatabaseEntityTable(electionRepository)
})

afterAll(async () => {
  try {
    return await connection.close()
  } catch (err) {
    console.log(err)
  }
})

test('Election without status set should return entity with status set to default', async () => {
  electionRepository = connection.getRepository(Election)
  const election = electionRepository.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  await electionRepository.save(election)
  const el = await electionRepository.find({
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
  electionRepository = connection.getRepository(Election)
  const election = electionRepository.create()
  election.title = 'My Test'
  election.description = 'This is a dummy'
  election.isAutomatic = false
  election.isLocked = false
  election.electionOrganizer = new ElectionOrganizer()
  election.eligibleVoters = []
  election.status = ElectionStatus.Started
  await electionRepository.save(election)
  const el = await electionRepository.find()
  let firstElection = el[0]
  expect(firstElection.status).toBe<ElectionStatus>(ElectionStatus.Started)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.NotStarted)
  expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
})
