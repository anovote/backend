import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'
import { ElectionOrganizerService } from "@/services/ElectionOrganizerService";
import { database } from '@/loaders'

const authService = new AuthenticationService()

const router = Router()

router.post('/register', async (request, response) => {
  const electionOrganizerService = new ElectionOrganizerService(database);
  try {
    await electionOrganizerService.create(request.body);
    response.status(200);
  } catch (e) {
    response.status(400);
    response.send("Error in validation!");
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
