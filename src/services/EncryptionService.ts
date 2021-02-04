import { bcrypt } from "../deps.ts";

/**
 * The required methods for the encryption service to have
 */
interface EncryptionMethods {
  compare: (plaintext: string, hashed: string) => Promise<boolean>;
  hash: (plaintext: string, salt?: string | undefined) => Promise<string>;
  genSalt: (logRounds?: number | undefined) => Promise<string>;
}

/**
 * A service wrapper for an encrypting and decrypting passwords
 */
export class EncryptionService {
  private service: EncryptionMethods;

  constructor() {
    this.service = bcrypt;
  }

  /**
 * Encrypts the password with a service. Passes in generated salt from encryption service
 * @param plaintext the password in plain text
 */
  async hashPassword(plaintext: string): Promise<string> {
    return await this.service.hash(
      plaintext,
      await this.service.genSalt(),
    );
  }

  /**
   * Compares a hashed and a unhashed password against eachother.
   * @param plaintext password in plain text
   * @param hashed password in hashed form to compare against
   */
  async comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
    return await this.service.compare(plaintext, hashed);
  }
}
