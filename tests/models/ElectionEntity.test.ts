import { validateEntity } from '@/helpers/validateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { IElection } from '@/models/Election/IElection'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { validate, ValidatorOptions } from 'class-validator'
import { Connection, Repository } from 'typeorm'
import setupConnection from '../helpers/setupTestDB'
import { clearDatabaseEntityTable } from '../Tests.utils'

let electionRepository: Repository<Election>
let connection: Connection

beforeAll(async () => {
    try {
        connection = await setupConnection()
    } catch (err) {
        console.error(err)
    }
})

beforeEach(async () => {
    electionRepository = connection.getRepository(Election)
    await clearDatabaseEntityTable(electionRepository)
})

afterAll(async () => {
    try {
        return await connection.close()
    } catch (err) {
        console.error(err)
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
    const el = await electionRepository.find()

    const firstElection = el[0]
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
    const firstElection = el[0]
    expect(firstElection.status).toBe<ElectionStatus>(ElectionStatus.Started)
    expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.NotStarted)
    expect(firstElection.status).not.toBe<ElectionStatus>(ElectionStatus.Finished)
})

it('should pass if openDate is not given', async () => {
    const entity = new Election()
    entity.id = 1
    entity.description = 'no open date'
    entity.title = 'No open date'
    entity.status = ElectionStatus.NotStarted

    await expect(validate(entity)).resolves.toStrictEqual([])
    await expect(validateEntity(entity)).resolves.toBe(undefined)
})

it('should fail if openDate is earlier than today', async () => {
    const entity = new Election()
    entity.openDate = new Date(1999, 12, 30)

    expect((await validate(entity)).length).toBeGreaterThan(0)
    await expect(validateEntity(entity)).rejects.toThrowError()
})

it('should fail if other openDate is before closeDate', async () => {
    const entity = new Election()
    entity.openDate = new Date()
    entity.closeDate = new Date(1999, 1, 1)

    expect((await validate(entity)).length).toBeGreaterThan(0)
    await expect(validateEntity(entity)).rejects.toThrowError()
})

it('should fail if openDate is before closeDate but also before now', async () => {
    const entity = new Election()
    entity.closeDate = new Date(2022, 1, 1)
    entity.openDate = new Date(1999, 1, 1)

    expect((await validate(entity)).length).toBeGreaterThan(0)
    await expect(validateEntity(entity)).rejects.toThrowError()
})

it('should pass if groups is set to creation and date is later than today', async () => {
    const entity = new Election()
    entity.openDate = new Date(2022, 1, 1)

    await expect(validateEntity(entity, { groups: ['creation'] })).resolves.toBe(undefined)
})

it('should fail if groups is set to creation and date is earlier than today', async () => {
    const entity = new Election()
    entity.openDate = new Date(1999, 1, 1)

    await expect(validateEntity(entity, { groups: ['creation'] })).rejects.toThrowError()
})

it('should pass if openDate is set to undefined and group is creation', async () => {
    const entity = new Election()
    entity.openDate = undefined
    const options: ValidatorOptions = { groups: ['creation'] }
    // console.log(await validate(entity, options))

    expect((await validate(entity, options)).length).toBe(0)
    await expect(validateEntity(entity, options)).resolves.toBe(undefined)
})

it('should pass if openDate is set to undefined and group is not set', async () => {
    const entity = new Election()
    entity.id = 1
    entity.openDate = undefined
    const options: ValidatorOptions = { groups: [] }

    expect((await validate(entity, options)).length).toBe(0)
    await expect(validateEntity(entity, options)).resolves.toBe(undefined)
})

it('should fail if openDate is before today and group is creation', async () => {
    const entity = new Election()
    entity.openDate = new Date(1999, 1, 1)
    const options: ValidatorOptions = { groups: ['creation'] }
    // console.log(await validate(entity, options))

    expect((await validate(entity, options)).length).toBeGreaterThan(0)
    await expect(validateEntity(entity, options)).rejects.toThrowError()
})

it('should pass if openDate is later than today and group is creation', async () => {
    const entity = new Election()
    entity.openDate = new Date(2050, 1, 1)
    const options: ValidatorOptions = { groups: ['creation'] }
    // console.log(await validate(entity, options))

    expect((await validate(entity, options)).length).toBe(0)
    await expect(validateEntity(entity, options)).resolves.toBe(undefined)
})

it('should validate if id is a negative number with validation group `creation`', async () => {
    const election = electionRepository.create()
    election.title = 'I am being crated'
    election.description = 'I have a negative ID'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    election.id = -1

    await expect(validateEntity(election, { groups: ['creation'] })).resolves.toBeUndefined()
})

it('should validate if id is positive and validation group is not set', async () => {
    const election = electionRepository.create()
    election.title = 'I am being validated with positive ID'
    election.description = 'I have a positive ID'
    election.isAutomatic = false
    election.isLocked = false
    election.electionOrganizer = new ElectionOrganizer()
    election.eligibleVoters = []
    election.status = ElectionStatus.Started
    election.id = 22

    await expect(validateEntity(election, { groups: [] })).resolves.toBeUndefined()
})

it('should validate to true for this data', async () => {
    // this will fail when open date is exceeded by now
    const election: IElection = {
        electionOrganizer: new ElectionOrganizer(),
        title: 'adf',
        description: 'adf',
        openDate: new Date('2050-03-17T23:00:00.990Z'),
        closeDate: new Date('2056-03-24T23:00:00.052Z'),
        password: 'adf',
        status: 0,
        isLocked: false,
        isAutomatic: false,
        ballots: [],
        eligibleVoters: [
            {
                identification: 'opsaj@gmail.com'
            },
            {
                identification: 'asdasdasd@live.no'
            },
            {
                identification: 'aspodkasdpok@hihi.ru'
            }
        ]
    }

    await expect(validateEntity(election, { groups: ['creation'] })).resolves.toBeUndefined()
})
