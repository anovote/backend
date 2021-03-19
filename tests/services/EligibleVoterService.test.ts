import { EligibleVoter, IEligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { HashService } from '@/services/HashService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { clearDatabaseEntityTable } from '../Tests.utils'

describe('election organizer service', () => {
    let eligibleVoters: IEligibleVoter[]
    let eligibleVoterService: EligibleVoterService
    let db: Connection
    let service: EligibleVoterService
    let seedEligibleVoter: EligibleVoter
    let hashService: HashService

    beforeAll(async () => {
        db = await getTestDatabase()
        hashService = new HashService()
        service = new EligibleVoterService(db)
        seedEligibleVoter = db.getRepository(EligibleVoter).create()
        seedEligibleVoter.identification = 'test@gmail.com'
        await db.getRepository(EligibleVoter).save(seedEligibleVoter)
        eligibleVoterService = new EligibleVoterService(db)
        eligibleVoters = [
            {
                identification: 'hallai@nrk.no'
            },
            {
                identification: 'hissig@sturla.net'
            },
            {
                identification: 'hissig@sturla.net'
            },
            {
                identification: 'hissig@sturla.net'
            },
            {
                identification: '        moffeloff@svg.no        '
            },
            {
                identification: 'hello'
            }
        ]
    })

    afterAll(async () => {
        await clearDatabaseEntityTable(db.getRepository(EligibleVoter))
        await db.close()
    })

    it('should create a eligible voter', () => {
        expect(seedEligibleVoter).toBeInstanceOf(EligibleVoter)
    })

    it('should save the identification', () => {
        expect(seedEligibleVoter.identification).toBe('test@gmail.com')
    })

    it('should correct the list of eligible voters', () => {
        let copy: IEligibleVoter[] = []
        copy = eligibleVoterService.correctListOfEligibleVoters(eligibleVoters)
        expect(copy.length).toBe(3)
        expect(copy[2].identification).toContain('moffeloff@svg.no')
    })

    it('should not change already correct identifications', () => {
        let copy: IEligibleVoter[] = []
        copy = eligibleVoterService.correctListOfEligibleVoters(eligibleVoters)
        expect(copy[0].identification).toContain('hallai@nrk.no')
        expect(copy[1].identification).toContain('hissig@sturla.net')
    })
})
