import { getConnection, Repository } from 'typeorm'
import setupConnection from '@/loaders/setupTestDB'
import { clearDatabaseEntityTable } from '@/../tests/Tests.utils'
import config from '@/config'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { Election } from '@/models/Election/ElectionEntity'

let repo: Repository<Ballot>

beforeAll(async () => {
  await setupConnection()
  repo = getConnection(config.environment).getRepository(Ballot)
})

beforeEach(async () => {
  repo = getConnection(config.environment).getRepository(Ballot)
  await clearDatabaseEntityTable(repo)
})

afterAll(() => {
  let conn = getConnection(config.environment)
  return conn.close()
})

test('Ballot without result display type set should return entity with display type set to default', async () => {
  repo = getConnection(config.environment).getRepository(Ballot)
  const ballot = repo.create()
  ballot.title = 'My Test'
  ballot.description = 'This is a dummy'
  ballot.election = new Election()
  ballot.order = 1
  await repo.save(ballot)
  const ballots = await repo.find()
  const firstBallot = ballots[0]
  expect(firstBallot.resultDisplayType).toBe<BallotResultDisplay>(BallotResultDisplay.SINGLE)
  expect(firstBallot.resultDisplayType).not.toBe<BallotResultDisplay>(BallotResultDisplay.NONE)
  expect(firstBallot.resultDisplayType).not.toBe<BallotResultDisplay>(BallotResultDisplay.ALL)
  expect(firstBallot.resultDisplayType).not.toBe<BallotResultDisplay>(BallotResultDisplay.RUNNER_UP)
})

test('Ballot with display type set to Runner up should return with status runner up', async () => {
  const ballot = repo.create()
  ballot.title = 'My Test'
  ballot.description = 'This is a dummy'
  ballot.resultDisplayType = BallotResultDisplay.RUNNER_UP
  ballot.order = 1
  await repo.save(ballot)
  const ballots = await repo.find()
  const firstBallot = ballots[0]
  expect(firstBallot.resultDisplayType).toBe<BallotResultDisplay>(BallotResultDisplay.RUNNER_UP)
  expect(firstBallot.resultDisplayType).not.toBe<BallotResultDisplay>(BallotResultDisplay.NONE)
  expect(firstBallot.resultDisplayType).not.toBe<BallotResultDisplay>(BallotResultDisplay.ALL)
  expect(firstBallot.resultDisplayType).not.toBe<BallotResultDisplay>(BallotResultDisplay.SINGLE)
})
