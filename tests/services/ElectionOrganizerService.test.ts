import { PasswordValidationError } from '@/lib/errors/validation/PasswordValidationError'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'

describe('election organizer service', () => {
    let db: Connection
    let service: ElectionOrganizerService
    let seedOrganizer: ElectionOrganizer
    const organizers: ElectionOrganizer[] = []

    const passwordPassedIn = '@passwordIsSecret1099'
    const rand = () => (Math.random() * 100000).toFixed()
    const createEmail = () => rand() + 'VerYniCeEmail@DoMAin.cOm'
    beforeAll(async () => {
        db = await getTestDatabase()
        service = new ElectionOrganizerService(db)

        organizers.push(seedOrganizer)
    })

    afterAll(async () => {
        await db.close()
    })

    it('should create a election organizer', async () => {
        const organizer = await service.createAndSaveElectionOrganizer({
            firstName: 'first',
            lastName: 'last',
            email: createEmail(),
            password: passwordPassedIn
        })
        expect(organizer).toBeInstanceOf(ElectionOrganizer)
        expect(organizer.firstName).toBe('first')
    })

    it('should create organizer with lowercase email address', async () => {
        const email = createEmail()
        const organizer = await service.createAndSaveElectionOrganizer({
            firstName: 'first',
            lastName: 'last',
            email,
            password: passwordPassedIn
        })
        expect(organizer.email).toBe(email.toLowerCase())
    })

    it('should generate a hash for the password', async () => {
        const organizer = await service.createAndSaveElectionOrganizer({
            firstName: 'first',
            lastName: 'last',
            email: createEmail(),
            password: passwordPassedIn
        })
        expect(organizer.password).not.toBe(passwordPassedIn)
    })

    describe('Password validation', () => {
        it('should throw if password does not match criteria', async () => {
            await expect(
                service.createAndSaveElectionOrganizer({
                    firstName: 'first',
                    lastName: 'last',
                    email: createEmail(),
                    password: 'tooWeak'
                })
            ).rejects.toThrow(PasswordValidationError)
            await expect(
                service.createAndSaveElectionOrganizer({
                    firstName: 'first',
                    lastName: 'last',
                    email: createEmail(),
                    password: ''
                })
            ).rejects.toThrow(PasswordValidationError)
            await expect(
                service.createAndSaveElectionOrganizer({
                    firstName: 'first',
                    lastName: 'last',
                    email: createEmail(),
                    password: 'blb l bla dfa keg'
                })
            ).rejects.toThrow(PasswordValidationError)
        })

        it('should pass if password does match criteria', async () => {
            await expect(
                service.createAndSaveElectionOrganizer({
                    firstName: 'first',
                    lastName: 'last',
                    email: createEmail(),
                    password: 'Very$tr0ng'
                })
            ).resolves.toBeTruthy()
            await expect(
                service.createAndSaveElectionOrganizer({
                    firstName: 'first',
                    lastName: 'last',
                    email: createEmail(),
                    password: 'The Ra88it and the T0rt0!s'
                })
            ).resolves.toBeTruthy()
        })
    })
})
