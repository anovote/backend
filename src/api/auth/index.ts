import { Router } from 'express'
import { ElectionOrganizerService } from "@/services/ElectionOrganizerService";
import { database } from '@/loaders'

const router = Router()

router.post('/register', async (request, response) => {
  const electionOrganizerService = new ElectionOrganizerService(database);
  try {
    await electionOrganizerService.create(request.body);
  } catch (e) {
    response.status(400);
    response.send("Error in validation!");
  }
})

router.post('/login', (request, response) => {
  console.log('Login')
  response.send()
})

export default router
