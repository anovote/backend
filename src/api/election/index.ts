import { database } from '@/loaders'
import { Election } from '@/models/election/Election'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.post('/', async (request, response) => {
  try {
    const electionService = new ElectionService(database)
    const election: Election | undefined = await electionService.createElection(request.body)
    response.status(StatusCodes.CREATED).json(election)
  } catch (error) {
    response.status(400).send()
  }
})

router.get('/', async (request, response) => {
  const electionService = new ElectionService(database)
  const elections: Election[] | undefined = await electionService.getAllElections()
  response.status(200)
  response.json(elections)
})

router.get('/:id', (request, response) => {
  console.log('GET')
  response.send()
})

export default router
