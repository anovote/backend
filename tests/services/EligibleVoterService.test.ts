import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { HashService } from '@/services/HashService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { clearDatabaseEntityTable } from '../Tests.utils'

describe('election organizer service', () => {
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
})
