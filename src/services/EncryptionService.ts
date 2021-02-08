import bcrypt from 'bcrypt'

/**
 * A service wrapper for encrypting and decrypting passwords
 */
export class EncryptionService {
  private service

  constructor() {
    this.service = bcrypt
  }

  /**
   * Encrypts the password with a service. Passes in generated salt from encryption service
   * @param plaintext the password in plain text
   */
  async hashPassword(plaintext: string): Promise<string> {
    return await this.service.hash(plaintext, await this.service.genSalt())
  }

  /**
   * Compares a hashed and a unhashed password against eachother.
   * @param plaintext password in plain text
   * @param hashed password in hashed form to compare against
   */
  async comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
    return await this.service.compare(plaintext, hashed)
  }
}
