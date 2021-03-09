import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { database } from '@/loaders'
import mailTransporter from '@/loaders/nodemailer'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { ElectionService } from '@/services/ElectionService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { VerificationService } from '@/services/VerificationService'
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

router.get('/join', async (request, response, next) => {
    try {
        const verificationService = new VerificationService(
            new MailService(await mailTransporter()),
            new EncryptionService()
        )
        const eligibleVoterService = new EligibleVoterService(database)
        const voter = await eligibleVoterService.getVoterByIdentification('sanderhur1@gmail.com') // TODO replace with actual

        const hashed = await new EncryptionService().hash(eligibleVoterService.generateVerificationString(voter))
        const readyVoter = await eligibleVoterService.storeVerificationHash(voter.identification, hashed)

        const owner = await new ElectionOrganizerService(database).getById(1)
        const election = await new ElectionService(database, owner!).getById(1) // TODO replace with actual

        await verificationService.stage(readyVoter!, election!)
        response.json('Check your mail')
    } catch (err) {
        next(err)
    }
})

router.get('/verify', async (request, response, next) => {
    const { v } = request.query
    if (v) {
        const verification = v?.toString()
        try {
            const eligibleVoterService = new EligibleVoterService(database)
            const voter = await eligibleVoterService.getVerificationHash(verification!)
            await eligibleVoterService.markAsVerified(voter)
            response.json('Successfully verified')
        } catch (err) {
            next(err)
        }
    } else {
        response.json('Please try again later')
    }
})

export default router
