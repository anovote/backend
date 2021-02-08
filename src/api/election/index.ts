import { database } from '@/loaders'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'

const router = Router()

router.post('/', (request, response) => {
  try {
    const electionService = new ElectionService(database)
    electionService.createElection(request.body)
    response.send('Created :D')
  } catch (error) {
    response.status(400).send()
  }
})

router.get('/:id', (request, response) => {
  console.log('GET')
  response.send()
})

export default router
