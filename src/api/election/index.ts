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

router.get('/:id', async (request, response) => {
  const electionService = new ElectionService(database)
  const id: number = Number.parseInt(request.params.id)
  const election = await electionService.getElectionById(id)
  response.status(StatusCodes.OK).json(election)
})

router.put('/:id', async (request, response) => {
  const electionService = new ElectionService(database)
  const id: number = Number.parseInt(request.params.id)
  const { election } = request.body
  const result = await electionService.updateElectionById(id, election)
  response.status(StatusCodes.ACCEPTED).json(result)
})

export default router
