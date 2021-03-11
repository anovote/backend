import { EncryptionService } from '@/services/EncryptionService'

describe('Encryption service', () => {
    const encryptionService = new EncryptionService()
    const encodedEncryptionService = new EncryptionService(true)
    const unique = 'test_1_1238717294'
    let encrypted: string

    beforeAll(() => {
        encrypted = encryptionService.encrypt(unique)
    })

    it('should encrypt a string', () => {
        expect(encrypted).not.toEqual(unique)
    })

    it('should decrypt a encrypted string to original value', () => {
        expect(encryptionService.decrypt(encrypted)).toEqual(unique)
    })

    it('should encrypt and encode a plaintext string directly when uri encoding is set', () => {
        expect(encodedEncryptionService.encrypt(unique)).not.toEqual(new EncryptionService().encrypt(unique))
    })

    it('should decrypt an encoded encryption to its original value', () => {
        const encodedEncrypted = encodedEncryptionService.encrypt(unique)
        const decrypted = encodedEncryptionService.decrypt(encodedEncrypted)

        expect(decrypted).toEqual(unique)
    })

    it('should differ between encrypted string and uri encoded string', () => {
        expect(encrypted).not.toEqual(encodedEncryptionService.encrypt(unique))
    })

    it('should not decrypt to different value when with different encoding', () => {
        expect(encryptionService.decrypt(encrypted)).toEqual(
            encodedEncryptionService.decrypt(encodedEncryptionService.encrypt(unique))
        )
    })
})
