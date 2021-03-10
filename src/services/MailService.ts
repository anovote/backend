import { logger } from '@/loaders/logger'
import { IElection } from '@/models/Election/IElection'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import Mail from 'nodemailer/lib/mailer'
/**
 * Service responsible for creation and sending of mails
 * This service implements the mail transports provided by nodemailer
 */
export class MailService {
    private _baseUrl: string
    private _transporter: Mail
    constructor(url = 'http://localhost:3000', transporter: Mail) {
        this._baseUrl = url
        this._transporter = transporter
    }

    async sendVerificationMail(to: string, verificationCode: string, election: IElection) {
        const mailOptions = {
            from: 'anovotetoday@gmail.com',
            to: to,
            subject: 'Verify your participation for election : ' + election.title,
            text: 'Verify your participation for election : ' + election.title
        }
        const html = `
            <h2>Verify your participation for election ${election.title}</h2><br>
            <a href="${this._baseUrl}/join/verify?code=${verificationCode}">Verify your participation</a>
            <hr>
            <p>You have been listed as a eligible voter for participating in the election '${election.title}', that is going to be held shortly. You have also asked for participating to this election by filling out your email at anovote.io.</p>
            <p>If this was not you, please ignore this email.</p>
            `
        const { response } = await this._transporter.sendMail({ ...mailOptions, html })
        logger.warn(response)
        return response
    }
}
