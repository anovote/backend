import { HashService } from '../../src/services/HashService'

describe('Encryption service', () => {
    let hashService: HashService, password: string, hashedPassword: string

    beforeAll(async () => {
        hashService = new HashService()
        password = 'Test123'
        hashedPassword = await hashService.hash(password)
    })

    it('should hash a string and return it as a string', () => {
        expect(hashedPassword).toBeDefined()
        expect(hashedPassword).not.toBe(password)
    })

    it('should be equal when compared to its original form', async () => {
        expect(await hashService.compareAgainstHash(password, hashedPassword)).toBeTruthy()
    })

    it('should falsy when compared to a different password', async () => {
        expect(await hashService.compareAgainstHash('differentPassword', hashedPassword)).toBeFalsy()
    })
})
