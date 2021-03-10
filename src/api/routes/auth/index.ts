import config from '@/config'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const authService = new AuthenticationService()
const router = Router()

router.post('/register', async (request, response, next) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const organizer = await electionOrganizerService.createAndSaveElectionOrganizer(request.body)
        const token = await authService.generateTokenFromId(organizer.id)
        response.status(StatusCodes.CREATED).json({ token })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (request, response, next) => {
    try {
        const token = await authService.login(request.body)
        if (!token) throw new BadRequestError({ message: 'Invalid email/password' })
        response.json({ token })
    } catch (error) {
        next(error)
    }
})

export default router
