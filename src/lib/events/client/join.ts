import config from '@/config'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { ElectionService } from '@/services/ElectionService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { StatusCodes } from 'http-status-codes'
import { EventHandlerAcknowledges } from '../EventHandler'

export const join: EventHandlerAcknowledges<{ email: string; electionCode: string }> = async (data, socket, cb) => {
    const { email, electionCode } = data

    // TODO @freshfish70 validate and verify that the voter exist for election!!!
    if (!email || !electionCode) {
        cb({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Please provide the required data for joining a election'
        })
    }
    const electionId = Number.parseInt(electionCode!.toString())
    try {
        const verificationService = new VoterVerificationService(
            new MailService(config.frontend.url, await mailTransporter()),
            new EncryptionService(true),
            new EligibleVoterService(database)
        )
        const eligibleVoterService = new EligibleVoterService(database)
        const voter = await eligibleVoterService.getVoterByIdentification(email!.toString())
        const election = await new ElectionService(database).getById(electionId)

        await verificationService.stage(voter!, election!, socket.id)

        cb({
            statusCode: StatusCodes.OK,
            message: 'Check your email'
        })
    } catch (err) {
        cb({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Something went wrong.'
        })
    }
}
