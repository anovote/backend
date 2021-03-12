import config from '@/config'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { AuthenticationService } from '@/services/AuthenticationService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { StatusCodes } from 'http-status-codes'
import { Events } from '..'
import { EventHandlerAcknowledges } from '../EventHandler'

/**
 * Verifies a voter that have used their mail to verify their identity
 * @param data data from event
 * @param _socket the socket
 * @param cb the callback to send acknowledgements with
 */
export const verify: EventHandlerAcknowledges<{ code: string }> = async (data, _socket, cb) => {
    try {
        const verificationService = new VoterVerificationService(
            new MailService(config.frontend.url, await mailTransporter()),
            new EncryptionService(true),
            new EligibleVoterService(database)
        )
        const { code } = data

        if (code) {
            const verificationCode = code!.toString()
            const { electionId, socketId, voter } = await verificationService.verify(verificationCode)
            cb({
                statusCode: StatusCodes.OK,
                message: 'You are verified. We are currently upgrading your socket'
            })
            // Generate token for voter
            const authService = new AuthenticationService()
            const token = authService.generateToken({
                id: voter!.id,
                organizer: false,
                electionID: Number.parseInt(electionId)
            })
            // Emit event to original socket where join was initialized
            _socket.to(socketId).emit(Events.server.auth.verified, { token })
        } else {
            cb({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Verification code not provided'
            })
        }
    } catch (err) {
        cb({
            statusCode: StatusCodes.FORBIDDEN,
            message: 'We were not able to verify you...'
        })
    }
}
