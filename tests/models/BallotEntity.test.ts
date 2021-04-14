import { clearDatabaseEntityTable } from '@/../tests/Tests.utils'
import { validateEntity } from '@/helpers/validateEntity'
import { ValidationError } from '@/lib/errors/validation/ValidationError'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { Election } from '@/models/Election/ElectionEntity'
import { Connection, Repository } from 'typeorm'
import { getTestDatabase } from '../helpers/database'

let repo: Repository<Ballot>
let db: Connection
beforeAll(async () => {
    db = await getTestDatabase()
    repo = db.getRepository(Ballot)
})

beforeEach(async () => {
    repo = db.getRepository(Ballot)
    await clearDatabaseEntityTable(repo)
})

afterAll(() => {
    return db.close()
})

test('Ballot without result display type set should return entity with display type set to default', async () => {
    repo = db.getRepository(Ballot)
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

it('should not validate if election is missing', async () => {
    const ballot = repo.create()
    ballot.title = 'Election is missing'
    ballot.description = 'Election should never be missing'
    ballot.order = 1

    await expect(validateEntity(ballot)).rejects.toThrowError(ValidationError)
})

it('should not validate if election is empty', async () => {
    const ballot = repo.create()
    ballot.title = 'Election is missing'
    ballot.description = 'Election should never be missing'
    ballot.order = 1
    ballot.election = new Election()

    await expect(validateEntity(ballot)).rejects.toThrowError(ValidationError)
})

it('should not validate if election is missing id', async () => {
    const ballot = repo.create()
    ballot.title = 'Election is missing'
    ballot.description = 'Election should never be missing'
    ballot.order = 1
    const election = new Election()
    election.title = 'I am missing an id'
    ballot.election = election

    await expect(validateEntity(ballot)).rejects.toThrowError(ValidationError)
})
