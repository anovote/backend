import { Election } from '@/models/Election/ElectionEntity'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EligibleVoterService } from './EligibleVoterService'
import { EncryptionService } from './EncryptionService'
import { MailService } from './MailService'

export class VoterVerificationService {
    private _encryptionService: EncryptionService
    private _mailer: MailService
    private _eligibleVoterService: EligibleVoterService

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
     * Verifies the authenticity of an staged voter.
     * The verification provided are able to prove the voters unique identification
     * @param verification the encrypted string to verify the identity of the voter with
     * @returns returns the id of the election, socketID of original socket, and voter ID
     */
    async verify(verification: string) {
        const decrypted = this._encryptionService.decrypt(verification)

        const id = this.getIdFromVerificationCode(decrypted)
        const socketId = this.getSocketIdFromVerificationCode(decrypted)
        const electionId = this.getElectionIdFromVerificationCode(decrypted)

        const voter = await this._eligibleVoterService.getById(Number.parseInt(id))
        await this._eligibleVoterService.markAsVerified(voter!)

        return { electionId, socketId, voter }
    }

    // TODO verification code functions should be handled in own class. Works fine for now

    /**
     * Extracts the id from the unique verification code
     * @param decrypted the decrypted string to get the id from
     * @returns id, from the decrypted string
     */
    private getIdFromVerificationCode(decrypted: string) {
        const idIndex = 1

        return decrypted.split('_')[idIndex]
    }

    /**
     * Extracts the socket id from the unique verification code
     * @param decrypted the decrypted string to get the id from
     * @returns socket id, from the decrypted string
     */
    private getElectionIdFromVerificationCode(decrypted: string) {
        const socketIdIndex = 2
        return decrypted.split('_')[socketIdIndex]
    }

    /**
     * Extracts the socket id from the unique verification code
     * @param decrypted the decrypted string to get the id from
     * @returns socket id, from the decrypted string
     */
    private getSocketIdFromVerificationCode(decrypted: string) {
        const socketIdIndex = 3
        return decrypted.split('_')[socketIdIndex]
    }

    /**
     * Generates an unique string to be encrypted and sent over to the client to verify with.
     * @param voter the eligible voter
     * @param socketId the socket id of the voters original connection
     * @returns a unique identification string
     */
    private generateVerificationCode(voter: EligibleVoter, electionId: number, socketId: string) {
        const identificationForMail = voter.identification.split('@')[0]

        return `${identificationForMail}_${voter.id}_${electionId}_${socketId}`
    }
}
