import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'
import { AuthenticationService } from '@/services/AuthenticationService'

const router = Router()
const electionOrganizerService = new ElectionOrganizerService()

router.put('/', async (request, response) => {
  try {
    const updatedElectionOrganizer = electionOrganizerService.updatePassword(request.body)
    response.status(StatusCodes.OK)
    response.send(updatedElectionOrganizer)
  } catch (e) {
    response.status(StatusCodes.BAD_REQUEST)
    response.send('Election organizer not found')
    console.log(e)
  }
})

export default router
