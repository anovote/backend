import config from '@/config'
import nodemailer from 'nodemailer'

/**
 * Initializes the nodemailer transporter
 * The transporter is the object that is able to send mail.
 */
const nodemailerLoader = async () => {
    // Transport configurations for nodemailer.
    const transport = {
        service: config.mail.service,
        auth: {
            user: config.mail.auth.user,
            pass: config.mail.auth.pass
        }
    }

    const mailTransporter = nodemailer.createTransport(transport)

    // verify connection and auth
    await mailTransporter.verify()

    return mailTransporter
}
export default nodemailerLoader
