import { createConnection, getConnection, Repository } from 'typeorm'
import { ElectionOrganizer } from '../ElectionOrganizer/ElectionOrganizerEntity'
import { Election } from './ElectionEntity'
import { ElectionStatus } from './ElectionStatus'
import config from '@/config'

let repo: Repository<Election>

beforeEach(async () => {
  await createConnection({
    name: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: config.database.user,
    password: config.database.password,
    database: 'TestDB',
    entities: [`${config.src}/models/**/*.{ts,js}`],
    synchronize: true,
    dropSchema: true,
    logging: false
  })
  repo = getConnection('test').getRepository(Election)
})

afterEach(() => {
  let conn = getConnection('test')
  return conn.close()
})

test('Election without status set should return entity with status set to default', async () => {
  const election = repo.create()
  //   const election = new Election()
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

  expect(el[0].status).toBe<ElectionStatus>(ElectionStatus.NotStarted)
  expect(el[0].status).not.toBe<ElectionStatus>(ElectionStatus.Started)
  expect(el[0].status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
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

  expect(el[0].status).toBe<ElectionStatus>(ElectionStatus.Started)
  expect(el[0].status).not.toBe<ElectionStatus>(ElectionStatus.NotStarted)
  expect(el[0].status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
})
