import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'

const authService = new AuthenticationService()
const electionOrganizerService = new ElectionOrganizerService()
const router = Router()

router.post('/register', async (request, response, next) => {
  try {
    const token = await electionOrganizerService.createAndSaveElectionOrganizer(request.body)
    response.status(StatusCodes.CREATED)
    response.json({ token })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (request, response, next) => {
  try {
    const token = await authService.login(request.body)
    response.json({ token })
  } catch (error) {
    next(error)
  }
})

export default router
