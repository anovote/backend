import { EncryptionService } from '../../src/services/EncryptionService'

describe('Encryption service', () => {
  let encryptionService: EncryptionService, password: string, hashedPassword: string

  beforeAll(async () => {
    encryptionService = new EncryptionService()
    password = 'Test123'
    hashedPassword = await encryptionService.hashPassword(password)
  })

  it('should hash a string and return it as a string', () => {
    expect(hashedPassword).toBeDefined()
    expect(hashedPassword).not.toBe(password)
  })

  it('should be equal when compared to its original form', async () => {
    expect(await encryptionService.comparePasswords(password, hashedPassword)).toBeTruthy()
  })

  it('should falsy when compared to a different password', async () => {
    expect(await encryptionService.comparePasswords('differentPassword', hashedPassword)).toBeFalsy()
  })
})
