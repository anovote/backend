import config from '@/config'
import { database } from '@/loaders'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { AnoSocket } from '../errors/websocket/AnoSocket'
import mailTransporter from '@/loaders/nodemailer'
import { StatusCodes } from 'http-status-codes'

export const verify = async (socket: AnoSocket, data: { code: string }) => {
    const verificationService = new VoterVerificationService(
        new MailService(config.frontend.url, await mailTransporter()),
        new EncryptionService(true),
        new EligibleVoterService(database)
    )
    const { code } = data

    if (!code) {
        socket.emit('voter_integrity_verified', {
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Verification code not provided'
        })
    }
    const verificationCode = code!.toString()

    try {
        await verificationService.verify(verificationCode)
        socket.emit('voter_integrity_verified', {
            statusCode: StatusCodes.OK,
            message: 'You are verified. We are currently upgrading your socket'
        })
    } catch (err) {
        socket.emit('voter_integrity_verified', {
            statusCode: StatusCodes.FORBIDDEN,
            message: 'We were not able to verify you...'
        })
    }
}
