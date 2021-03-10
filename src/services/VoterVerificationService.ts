import { IElection } from '@/models/Election/IElection'
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

    async stage(voter: EligibleVoter, forElection: IElection, socket: string) {
        const encryptedVerification = this._encryptionService.encrypt(this.generateVerificationCode(voter, socket))
        await this._mailer.sendVerificationMail(voter, forElection)
    }

    async verify(verification: string) {
        const decrypted = this._encryptionService.decrypt(verification)

        const id = this.getIdFromVerificationCode(decrypted)

        const voter = await this._eligibleVoterService.getById(Number.parseInt(id))

        return await this._eligibleVoterService.markAsVerified(voter!)
    }

    // TODO can be moved to own class. Works fine for now

    getIdFromVerificationCode(decrypted: string) {
        const idIndex = 1

        return decrypted.split('_')[idIndex]
    }

    getSocketIdFromVerificationCode(decrypted: string) {
        const socketIdIndex = 2
        return decrypted.split('_')[socketIdIndex]
    }

    generateVerificationCode(voter: EligibleVoter, socketId: string) {
        const identificationForMail = voter.identification.split('@')[0]

        return `${identificationForMail}_${voter.id}_${socketId}`
    }
}
