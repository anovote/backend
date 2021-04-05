import { EligibleVoter, IEligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'
import { clearDatabaseEntityTable } from '../Tests.utils'

describe('election organizer service', () => {
    let eligibleVoters: IEligibleVoter[]
    let eligibleVoterService: EligibleVoterService
    let db: Connection
    let seedEligibleVoter: EligibleVoter

    const camelCaseEmail = 'CamelCaseEmail@kamelen.NO'
    const cleanCamelCaseEmail = camelCaseEmail.toLowerCase()

    const whiteSpaceEmail = '        moffeloff@svg.no        '
    const cleanWhiteSpaceEmail = whiteSpaceEmail.trim()

    const duplicateEmail = 'test@test.com'

    const validVoters = [{ identification: 'hallai@nrk.no' }, { identification: 'hissig@sturla.net' }]

    const invalidVoters: IEligibleVoter[] = [
        {
            identification: '123.com'
        },
        {
            identification: 'hello'
        }
    ]
    const validMustCleanVoters: IEligibleVoter[] = [
        { identification: camelCaseEmail },
        { identification: whiteSpaceEmail }
    ]

    const duplicateVoters: IEligibleVoter[] = [{ identification: duplicateEmail }, { identification: duplicateEmail }]

    beforeAll(async () => {
        db = await getTestDatabase()
        const eligibleVoter = db.getRepository(EligibleVoter).create()
        eligibleVoter.identification = 'test@gmail.com'
        seedEligibleVoter = await db.getRepository(EligibleVoter).save(eligibleVoter)
        eligibleVoterService = new EligibleVoterService(db)
        eligibleVoters = [...invalidVoters, ...validVoters, ...validMustCleanVoters, ...duplicateVoters]
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

        // Should contain all valid voters, plus half of duplicates
        expect(copy.length).toBe(validVoters.length + validMustCleanVoters.length + duplicateVoters.length / 2)
        expect(copy).not.toIncludeAnyMembers([{ identification: camelCaseEmail }])
        expect(copy).toIncludeAnyMembers([{ identification: cleanCamelCaseEmail }])

        expect(copy).not.toIncludeAnyMembers([{ identification: whiteSpaceEmail }])
        expect(copy).toIncludeAnyMembers([{ identification: cleanWhiteSpaceEmail }])
    })
})
