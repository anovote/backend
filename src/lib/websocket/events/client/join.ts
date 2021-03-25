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
import { Events } from '@/lib/websocket/events'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { VoterSocket } from '@/lib/websocket/AnoSocket'

export const join: EventHandlerAcknowledges<{ email: string; electionCode: string }> = async (event) => {
    const voterSocket = event.client as VoterSocket
    try {
        if (event.data.email && event.data.electionCode) {
            const { email, electionCode } = event.data
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
            if (eligibleVoterService.isVerified(voter)) {
                return event.acknowledgement(
                    EventErrorMessage(
                        new ForbiddenError({
                            message: ServerErrorMessage.alreadyVerified(),
                            code: ErrorCode.ALREADY_VERIFIED
                        })
                    )
                )
            }

            // Stage the voter for verification
            await verificationService.stage(voter, election, voterSocket.id)
            // Ok emit, that we have proceeded
            event.acknowledgement(EventMessage({}))
            /**
             * A single event listener that when triggered, notifies the VERIFICATION socket that
             * the join page has successfully joined.
             */
            voterSocket.once(Events.client.auth.voterVerifiedReceived, (verificationSocketId: string) => {
                voterSocket.electionId = election.id
                voterSocket.voterId = voter.id
                voterSocket.to(verificationSocketId).emit(Events.server.auth.joinVerified)
            })
        } else {
            const entity = event.data.email ? 'Election code' : 'Email'
            const code = event.data.email ? ErrorCode.ELECTION_CODE_MISSING : ErrorCode.VOTER_IDENTIFICATION_MISSING
            event.acknowledgement(
                EventErrorMessage(new BadRequestError({ message: ServerErrorMessage.isMissing(entity), code }))
            )
        }
    } catch (err) {
        event.acknowledgement(EventErrorMessage(new BaseError({ message: ServerErrorMessage.unableToVerify() })))
    }
}
