import { ElectionOrganizerEntityDTO, ElectionOrganizerUpdateDTO } from '@/dto/ElectionOrganizerDTO'
import { objectToObject } from '@/helpers/sanitize'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { Router } from 'express'

const router = Router()
/**
 * Returns only the authenticated organizer.
 */
router.get('/', async (request, response, next) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const organizerID = request.electionOrganizer.id
        const organizer = await electionOrganizerService.getById(organizerID)
        response.json(objectToObject(new ElectionOrganizerEntityDTO(), organizer))
    } catch (error) {
        next(error)
    }
})

/**
 * Updates the authenticated organizer
 * TODO: Fix id parameter - has no effect #211
 */
router.put<{ id: string }, ElectionOrganizerEntityDTO | undefined, ElectionOrganizerUpdateDTO>(
    '/:id',
    async (request, response, next) => {
        const electionOrganizerService = new ElectionOrganizerService(database)
        try {
            const organizerID = request.electionOrganizer.id
            const updatedOrganizer = await electionOrganizerService.update(organizerID, request.body)
            logger.info(`Election organizer ${organizerID} updated successfully`)
            return response.json(objectToObject(new ElectionOrganizerEntityDTO(), updatedOrganizer))
        } catch (error) {
            next(error)
        }
    }
)

export default router
