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
    try {
        if (email && electionCode) {
            const electionId = Number.parseInt(electionCode!.toString())
            const verificationService = new VoterVerificationService(
                new MailService(config.frontend.url, await mailTransporter()),
                new EncryptionService(true),
                new EligibleVoterService(database)
            )
            const eligibleVoterService = new EligibleVoterService(database)
            const voter = await eligibleVoterService.getVoterByIdentification(email.toString())
            const election = await new ElectionService(database).getById(electionId)
            if (voter && election) {
                await verificationService.stage(voter, election, socket.id)

                cb({
                    statusCode: StatusCodes.OK,
                    message: 'Check your email'
                })
            } else {
                cb({
                    statusCode: StatusCodes.NOT_FOUND,
                    message: voter ? 'Election not found' : 'Voter do not exists'
                })
            }
        } else {
            cb({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Please provide the required data for joining a election'
            })
        }
    } catch (err) {
        cb({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Something went wrong.'
        })
    }
}
