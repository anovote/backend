import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'

const authService = new AuthenticationService()
const electionOrganizerService = new ElectionOrganizerService()
const router = Router()

router.post('/register', async (request, response) => {
  try {
    const token = await electionOrganizerService.createAndSaveElectionOrganizer(request.body)
    response.status(StatusCodes.CREATED) // TODO add StatusCode.CREATED
    response.json({ token })
  } catch (e) {
    if (e instanceof RangeError) {
      response.status(StatusCodes.BAD_REQUEST)
      response.send('validation failed')
    } else {
      response.status(StatusCodes.BAD_REQUEST)
      response.send('Something went very wrong...')
    }
  }
})

router.post('/login', async (request, response) => {
  console.log('Login')
  try {
    const token = await authService.login(request.body)
    response.json({ token })
  } catch (e) {
    console.log('ERROR: ', e)
    response.sendStatus(StatusCodes.NOT_FOUND)
  }
})

export default router
