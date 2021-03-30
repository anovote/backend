import config from '@/config'
import { BaseError } from '@/lib/errors/BaseError'
import { ErrorCode } from '@/lib/errors/ErrorCodes'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { Events } from '@/lib/websocket/events'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionService } from '@/services/ElectionService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { joined } from './joined'

/**
 * Verifies a voter that have used their mail to verify their identity
 * @param data data from event
 * @param _socket the socket
 * @param cb the callback to send acknowledgements with
 */
export const verify: EventHandlerAcknowledges<{ code: string }> = async (event) => {
    const voterSocket = event.client as VoterSocket
    try {
        const voterService = new EligibleVoterService(database)
        const electionService = new ElectionService(database)
        const verificationService = new VoterVerificationService(
            new MailService(config.frontend.url, await mailTransporter()),
            new EncryptionService(true),
            voterService
        )

        const { code } = event.data
        const decodedCode = verificationService.decodeVerificationCode(code)
        // Early exit if we do not have a decoded token object
        if (!decodedCode) {
            const errorCode = code ? ErrorCode.VERIFICATION_CODE_INVALID : ErrorCode.VERIFICATION_CODE_MISSING
            const message = code
                ? ServerErrorMessage.invalidVerificationCode()
                : ServerErrorMessage.isMissing('Verification code')
            return event.acknowledgement(
                EventErrorMessage(
                    new BadRequestError({
                        message,
                        code: errorCode
                    })
                )
            )
        }

        // Details contained in the verification code.
        const { voterId, electionCode, joinSocketId } = decodedCode
        const voter = await voterService.getById(voterId)
        const election = await electionService.getById(electionCode)

        // Handle missing voter/ election
        if (!voter || !election) {
            const entity = voter ? 'Election' : 'Voter'
            const code = voter ? ErrorCode.ELECTION_NOT_EXIST : ErrorCode.VOTER_NOT_EXIST
            return event.acknowledgement(
                EventErrorMessage(new NotFoundError({ message: ServerErrorMessage.notFound(entity), code }))
            )
        }

        // Handle election state finished
        if (electionService.isFinished(election)) {
            return event.acknowledgement(
                EventErrorMessage(
                    new BadRequestError({
                        message: ServerErrorMessage.electionFinished(),
                        code: ErrorCode.ELECTION_FINISHED
                    })
                )
            )
        }

        // Handle already verified voter
        if (voterService.isVerified(voter)) {
            return event.acknowledgement(
                EventErrorMessage(
                    new ForbiddenError({
                        message: ServerErrorMessage.alreadyVerified(),
                        code: ErrorCode.ALREADY_VERIFIED
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
            electionID: electionCode
        })

        // Notify join page that it is verified. token and socketID for this socket is provided
        // so the join page can can return response event when it has received the token, and
        // notify the verification page that the join was successful, and stop the potential upgrade.
        voterSocket
            .to(joinSocketId)
            .emit(Events.server.auth.voterVerified, EventMessage({ token, verificationSocketId: voterSocket.id }))

        /**
         * This event is triggered when the verification page has not received the join_verified event
         * from the join page after a timeout has ended. This event upgrades the verification page
         * to get the token and take over the join session.
         */
        voterSocket.once(Events.client.auth.upgradeVerificationToJoin, (_, cb) => {
            joined({ ...event, data: { electionCode, voterId: voter.id } })
            cb(EventMessage({ token }))
        })
    } catch (err) {
        event.acknowledgement(EventErrorMessage(new BaseError({ message: ServerErrorMessage.unableToVerify() })))
    }
}
