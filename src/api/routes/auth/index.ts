import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'
import { getCustomRepository, getConnection } from 'typeorm'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'

const authService = new AuthenticationService()

const router = Router()

router.post('/register', async (request, response) => {
  const electionOrganizerRepository = getCustomRepository(ElectionOrganizerRepository)
  try {
    const id = await electionOrganizerRepository.createAndSave(request.body)
    const token = await authService.register(id)
    response.status(200)
    response.json({ token: token })
  } catch (e) {
    response.status(400)
    response.send('Error in validation!')
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
