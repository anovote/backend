import config from '@/config'
import { BaseError } from '@/lib/errors/BaseError'
import { ErrorCode } from '@/lib/errors/ErrorCodes'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { ElectionService } from '@/services/ElectionService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { Events } from '@/lib/events'
import { EventHandlerAcknowledges } from '@/lib/events/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/events/EventResponse'

export const join: EventHandlerAcknowledges<{ email: string; electionCode: string }> = async (data, socket, cb) => {
    try {
        if (data.email && data.electionCode) {
            const { email, electionCode } = data
            const electionId = Number.parseInt(electionCode)
            const eligibleVoterService = new EligibleVoterService(database)
            const voter = await eligibleVoterService.getVoterByIdentificationForElection(email, electionId)
            const electionService = new ElectionService(database)
            const election = await electionService.getById(electionId)

            const verificationService = new VoterVerificationService(
                new MailService(config.frontend.url, await mailTransporter()),
                new EncryptionService(true),
                eligibleVoterService
            )
            // Handle missing voter/ election
            if (!voter || !election) {
                const entity = voter ? 'Election' : 'Voter'
                const code = voter ? ErrorCode.ELECTION_NOT_EXIST : ErrorCode.VOTER_NOT_EXIST
                return cb(EventErrorMessage(new NotFoundError({ message: ServerErrorMessage.notFound(entity), code })))
            }
            // Handle election state finished
            if (electionService.isFinished(election)) {
                return cb(
                    EventErrorMessage(
                        new BadRequestError({
                            message: ServerErrorMessage.electionFinished(),
                            code: ErrorCode.ELECTION_FINISHED
                        })
                    )
                )
            }
            // Handle already verified voter
            if (eligibleVoterService.isVerified(voter)) {
                return cb(
                    EventErrorMessage(
                        new ForbiddenError({
                            message: ServerErrorMessage.alreadyVerified(),
                            code: ErrorCode.ALREADY_VERIFIED
                        })
                    )
                )
            }

            // Stage the voter for verification
            await verificationService.stage(voter, election, socket.id)
            // Ok emit, that we have proceeded
            cb(EventMessage({}))
            /**
             * A single event listener that when triggered, notifies the VERIFICATION socket that
             * the join page has successfully joined.
             */
            socket.once(Events.client.auth.voterVerifiedReceived, (verificationSocketId: string) => {
                socket.to(verificationSocketId).emit(Events.server.auth.joinVerified)
            })
        } else {
            const entity = data.email ? 'Election code' : 'Email'
            const code = data.email ? ErrorCode.ELECTION_CODE_MISSING : ErrorCode.VOTER_IDENTIFICATION_MISSING
            cb(EventErrorMessage(new BadRequestError({ message: ServerErrorMessage.isMissing(entity), code })))
        }
    } catch (err) {
        cb(EventErrorMessage(new BaseError({ message: ServerErrorMessage.unableToVerify() })))
    }
}
