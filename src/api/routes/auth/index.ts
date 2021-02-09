import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { EncryptionService } from '@/services/EncryptionService'

const authService = new AuthenticationService()
const electionOrganizerService = new ElectionOrganizerService()
const encryptionService = new EncryptionService()
const router = Router()

router.post('/register', async (request, response) => {
  const electionOrganizer = electionOrganizerService.create(request.body)

  if (await electionOrganizerService.isElectionOrganizerValid(electionOrganizer)) {
    electionOrganizer.password = await encryptionService.hash(electionOrganizer.password)
    const id = await electionOrganizerService.save(electionOrganizer)
    const token = await authService.generateTokenFromId(id)
    response.status(201)
    response.json({ token: token })
  } else {
    response.status(400)
    response.send('Something went very wrong...')
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
