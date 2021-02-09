import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { EncryptionService } from '@/services/EncryptionService'

const authService = new AuthenticationService()
const electionOrganizerService = new ElectionOrganizerService()
const encryptionService = new EncryptionService()
const router = Router()

router.post('/register', async (request, response) => {
  try {
    const token = await electionOrganizerService.createAndSaveElectionOrganizer(request.body)
    response.status(201)
    response.json({ token: token })
  } catch (e) {
    if (e instanceof RangeError) {
      response.status(400)
      response.send('validation failed')
    } else {
      response.status(400)
      response.send('Something went very wrong...')
    }
  }
})

router.post('/login', async (request, response) => {
  console.log('Login')
  try {
    const token = await authService.login(request.body)
    response.json({ token: token })
  } catch (e) {
    console.log('ERROR: ', e)
    response.sendStatus(404)
  }
})

export default router
