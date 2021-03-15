import { logger } from '@/loaders/logger'
import { Election } from '@/models/Election/ElectionEntity'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EligibleVoterService } from './EligibleVoterService'
import { EncryptionService } from './EncryptionService'
import { MailService } from './MailService'

export class VoterVerificationService {
    private _encryptionService: EncryptionService
    private _mailer: MailService
    private _eligibleVoterService: EligibleVoterService
    private _codeDelimiter = '_'
    constructor(
        mailService: MailService,
        encryptionService: EncryptionService,
        eligibleVoterService: EligibleVoterService
    ) {
        this._encryptionService = encryptionService
        this._mailer = mailService
        this._eligibleVoterService = eligibleVoterService
    }

    /**
     * Stages a voter for verification to an election by sending out a mail for the voter to verify with
     * The mail consists of a encrypted code with unique identifiers for the voter to be able to
     * prove its identity.
     * @param voter the eligible voter to stage for an election
     * @param forElection the election the voter attempts to join
     * @param socket the socket identification the encrypted code should contain
     */
    async stage(voter: EligibleVoter, forElection: Election, socket: string) {
        const encryptedCode = this._encryptionService.encrypt(
            this.generateVerificationCode(voter, forElection.id, socket)
        )

        await this._mailer.sendVerificationMail(voter.identification, encryptedCode, forElection)
    }

    /**
     * Tries to decode the provided encrypted verification code into an object of fields representing
     * the code fields. If it fails to decode, undefined is returned.
     * @param verificationCode encrypted verification code to decode
     * @returns decoded code or undefined
     */
    decodeVerificationCode(verificationCode: string) {
        const decrypted = this._encryptionService.decrypt(verificationCode)
        return this.decodeVerification(decrypted)
    }

    /**
     * Verifies the authenticity of an staged voter.
     * The verification provided are able to prove the voters unique identification
     * @param verification the encrypted string to verify the identity of the voter with
     * @returns returns the id of the election, socketID of original socket, and voter ID
     */
    async verify(voter: EligibleVoter) {
        await this._eligibleVoterService.markAsVerified(voter)
    }

    /**
     * Generates an unique string to be encrypted and sent over to the client to verify with.
     * @param voter the eligible voter
     * @param socketId the socket id of the voters original connection
     * @returns a unique identification string
     */
    private generateVerificationCode(voter: EligibleVoter, electionId: number, socketId: string) {
        const identificationForMail = voter.identification.split('@')[0]

        return `${identificationForMail}${this._codeDelimiter}${voter.id}${this._codeDelimiter}${electionId}${this._codeDelimiter}${socketId}`
    }

    /**
     * Decodes the verification code into an object representing each field in the code.
     * If the decoding fails, undefined is returned.
     * @param decryptedCode the decrypted verification code to extract fields from
     * @returns decoded data as object, or undefined
     */
    private decodeVerification(decryptedCode: string) {
        try {
            if (decryptedCode) {
                const codeParts = decryptedCode.split(this._codeDelimiter)
                return {
                    voterId: Number.parseInt(codeParts[1]),
                    electionId: Number.parseInt(codeParts[2]),
                    joinSocketId: codeParts[3]
                }
            }
        } catch (error) {
            logger.warn(error)
        }
    }
}
