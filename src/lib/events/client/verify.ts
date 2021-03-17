import config from '@/config'
import { BaseError } from '@/lib/errors/BaseError'
import { ErrorCode } from '@/lib/errors/ErrorCodes'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionService } from '@/services/ElectionService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { Events } from '..'
import { EventHandlerAcknowledges } from '../EventHandler'
import { EventErrorMessage, EventMessage } from '../EventResponse'

/**
 * Verifies a voter that have used their mail to verify their identity
 * @param data data from event
 * @param _socket the socket
 * @param cb the callback to send acknowledgements with
 */
export const verify: EventHandlerAcknowledges<{ code: string }> = async (data, _socket, cb) => {
    try {
        const voterService = new EligibleVoterService(database)
        const electionService = new ElectionService(database)
        const verificationService = new VoterVerificationService(
            new MailService(config.frontend.url, await mailTransporter()),
            new EncryptionService(true),
            voterService
        )

        const { code } = data
        const decodedCode = verificationService.decodeVerificationCode(code)
        // Early exit if we do not have a decoded token object
        if (!decodedCode) {
            const errorCode = code ? ErrorCode.verificationCodeInvalid : ErrorCode.verificationCodeMissing
            const message = code
                ? ServerErrorMessage.invalidVerificationCode()
                : ServerErrorMessage.isMissing('Verification code')
            return cb(
                EventErrorMessage(
                    new BadRequestError({
                        message,
                        code: errorCode
                    })
                )
            )
        }

        // Details contained in the verification code.
        const { voterId, electionId, joinSocketId } = decodedCode
        const voter = await voterService.getById(voterId)
        const election = await electionService.getById(electionId)

        // Handle missing voter/ election
        if (!voter || !election) {
            const entity = voter ? 'Election' : 'Voter'
            const code = voter ? ErrorCode.electionNotExist : ErrorCode.voterNotExist
            return cb(EventErrorMessage(new NotFoundError({ message: ServerErrorMessage.notFound(entity), code })))
        }

        // Handle election state finished
        if (electionService.isFinished(election)) {
            return cb(
                EventErrorMessage(
                    new BadRequestError({
                        message: ServerErrorMessage.electionFinished(),
                        code: ErrorCode.electionFinished
                    })
                )
            )
        }

        // Handle already verified voter
        if (voterService.isVerified(voter)) {
            return cb(
                EventErrorMessage(
                    new ForbiddenError({
                        message: ServerErrorMessage.alreadyVerified(),
                        code: ErrorCode.alreadyVerified
                    })
                )
            )
        }

        await verificationService.verify(voter)

        // Generate token for voter
        const authService = new AuthenticationService()
        const token = authService.generateToken({
            id: voterId,
            organizer: false,
            electionID: electionId
        })

        // Notify join page that it is verified. token and socketID for this socket is provided
        // so the join page can can return response event when it has received the token, and
        // notify the verification page that the join was successful, and stop the potential upgrade.
        _socket
            .to(joinSocketId)
            .emit(Events.server.auth.verified, EventMessage({ token, verificationSocketId: _socket.id }))

        /**
         * This event is triggered when the verification page has not received the join_verified event
         * from the join page after a timeout has ended. This event upgrades the verification page
         * to get the token and take over the join session.
         */
        _socket.once(Events.client.auth.upgradeVerificationToJoin, (_, cb) => {
            cb(EventMessage({ token }))
        })
    } catch (err) {
        cb(EventErrorMessage(new BaseError({ message: ServerErrorMessage.unableToVerify() })))
    }
}
