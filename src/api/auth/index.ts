import { Router } from 'express'
import { ElectionOrganizerModel } from '../../models/ElectionOrganizerModel'

const router = Router()

router.post('/register', (request, response) => {
  const electionOrganizer: ElectionOrganizerModel = request.body;
  console.log(electionOrganizer);
  response.send()
})

router.post('/login', (request, response) => {
  console.log('Login')
  response.send()
})

export default router
