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

router.put('/:id', async (request, response) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const organizerDTO = request.body

        let password
        if (!organizerDTO.password) {
            password = (await electionOrganizerService.getElectionOrganizerById(organizerDTO.id)).password
        }

        const dto = password ? { ...organizerDTO, password } : organizerDTO

        const updatedOrganizer = await electionOrganizerService.update(request.electionOrganizer.id, dto)

        response.status(StatusCodes.OK).json(updatedOrganizer)
        logger.info('Organizer updated')
    } catch (e) {
        response.sendStatus(StatusCodes.BAD_REQUEST)
        logger.error('Bad request for updating organizer ' + e)
    }
})

export default router
