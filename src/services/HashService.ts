import bcrypt from 'bcrypt'

/**
 * A service wrapper for encryption
 */
export class HashService {
    private service

    constructor() {
        this.service = bcrypt
    }

    /**
     * Hashes the provided plaintext string and returns the hashed version.
     * @param plaintext the string to hash
     */
    async hash(plaintext: string): Promise<string> {
        return await this.service.hash(plaintext, await this.service.genSalt())
    }

    /**
     * Compares the provided plaintext string against a hashed value to check if
     * the plaintext is equal to the content of the hashed value.
     * Returns true if equal, else false.
     *
     * @param plaintext password in plain text
     * @param hashed password in hashed form to compare against
     */
    async compareAgainstHash(plaintext: string, hashed: string): Promise<boolean> {
        return await this.service.compare(plaintext, hashed)
    }
}
