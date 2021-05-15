import { ElectionOrganizerUpdateDTO, IElectionOrganizerUpdateDTO } from '@/dto/ElectionOrganizerUpdateDTO'
import { jsonToObject } from '@/helpers/sanitize'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { AuthenticationService } from '@/services/AuthenticationService'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { Router } from 'express'

const router = Router()
const authenticationService = new AuthenticationService()

router.get('/', async (request, response, next) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const token = request.headers.authorization
        const id = authenticationService.verifyToken(token).id
        const organizer = await electionOrganizerService.getById(id)
        response.json(organizer)
    } catch (error) {
        next(error)
    }
})

router.put<{ id: string }, ElectionOrganizer | undefined, IElectionOrganizerUpdateDTO>(
    '/:id',
    async (request, response, next) => {
        const electionOrganizerService = new ElectionOrganizerService(database)
        try {
            const organizerID = request.electionOrganizer.id
            const updatedOrganizer = await electionOrganizerService.update(organizerID, request.body)
            logger.info(`Election organizer ${organizerID} updated successfully`)
            return response.json(updatedOrganizer)
        } catch (error) {
            next(error)
        }
    }
)

export default router
