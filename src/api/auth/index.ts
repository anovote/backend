import { Router } from 'express'
import { ElectionOrganizerService } from "@/services/ElectionOrganizerService";
import { database } from '@/loaders'

const router = Router()

router.post('/register', (request, response) => {
  const electionOrganizerService = new ElectionOrganizerService(database);
  electionOrganizerService.create(request.body);
  response.send()
})

router.post('/login', (request, response) => {
  console.log('Login')
  response.send()
})

export default router
