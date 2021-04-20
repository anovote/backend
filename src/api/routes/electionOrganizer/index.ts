import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'
import { AuthenticationService } from '@/services/AuthenticationService'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'

const router = Router()
const authenticationService = new AuthenticationService()

router.get('/', async (request, response) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const token = request.headers.authorization
        const id = authenticationService.verifyToken(token).id
        const organizer = await electionOrganizerService.getById(id)

        response.status(StatusCodes.OK)
        response.send(organizer)
    } catch (error) {
        response.status(StatusCodes.BAD_REQUEST)
        response.send()
    }
})

router.put('/changePassword', async (request, response) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const token = request.headers.authorization
        const id = authenticationService.verifyToken(token).id
        const newPassword = request.body.newPassword
        await electionOrganizerService.updatePassword(newPassword, id)
        response.status(StatusCodes.OK)
        response.send('Password was updated')
    } catch (e) {
        response.status(StatusCodes.BAD_REQUEST)
        response.send('Election organizer not found')
        logger.error('update of password for election organizer failed')
    }
})

router.put('/changeEmail', async (request, response) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const token = request.headers.authorization
        const id = authenticationService.verifyToken(token).id
        const newEmail = request.body.newEmail
        await electionOrganizerService.updateEmail(newEmail, id)
        response.status(StatusCodes.OK)
        response.send('Email was updated')
        logger.info('Email changed for organizer : ' + id)
    } catch (e) {
        response.sendStatus(StatusCodes.BAD_REQUEST)
        logger.error('Bad request for updating email ' + e)
    }
})

export default router
