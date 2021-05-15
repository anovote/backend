import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

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

router.put<{ id: string }, ElectionOrganizer | undefined, IElectionOrganizerUpdateDTO>(
    '/:id',
    async (request, response, next) => {
        const electionOrganizerService = new ElectionOrganizerService(database)
        try {
            const organizerID = request.electionOrganizer.id
            const organizerDTO = jsonToObject(ElectionOrganizerUpdateDTO, request.body)
            const updatedOrganizer = await electionOrganizerService.update(organizerID, organizerDTO)
            logger.info(`Election organizer ${organizerID} updated successfully`)
            return response.json(updatedOrganizer)
        } catch (error) {
            next(error)
        }
    }
)

export default router
