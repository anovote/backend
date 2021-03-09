import { UnauthorizedError } from '@/lib/errors/http/UnauthorizedError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { IElection } from '@/models/Election/IElection'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EncryptionService } from './EncryptionService'
import { MailService } from './MailService'

export class VerificationService {
    private _encryptionService: EncryptionService
    private _mailer: MailService

    constructor(mailService: MailService, encryptionService: EncryptionService) {
        this._encryptionService = encryptionService
        this._mailer = mailService
    }

    async stage(voter: EligibleVoter, forElection: IElection) {
        if (!voter.verification) throw new UnauthorizedError({ message: ServerErrorMessage.unauthorized() })

        await this._mailer.sendVerificationMail(voter, forElection)
    }

    verify() {
        return
    }
}
