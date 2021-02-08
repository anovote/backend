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
    response.status(StatusCodes.BAD_REQUEST).send(error.message)
  }
})

router.get('/', async (request, response) => {
  try {
    const electionService = new ElectionService(database)
    const elections: Election[] | undefined = await electionService.getAllElections()
    response.status(200)
    elections ? response.json(elections) : response.send('No elections')
  } catch (err) {
    response.status(StatusCodes.BAD_REQUEST).send(err.message)
  }
})

router.get('/:id', async (request, response) => {
  try {
    const electionService = new ElectionService(database)
    const id: number = Number.parseInt(request.params.id)
    const election = await electionService.getElectionById(id)
    response.status(StatusCodes.OK).json(election)
  } catch (err) {
    response.status(StatusCodes.BAD_REQUEST).send(err.message)
  }
})

router.put('/:id', async (request, response) => {
  try {
    const electionService = new ElectionService(database)
    const id: number = Number.parseInt(request.params.id)
    const { election } = request.body
    if (!election) {
      throw new Error('No data')
    }
    const result = await electionService.updateElectionById(id, election)
    response.status(StatusCodes.ACCEPTED).json(result)
  } catch (err) {
    response.status(StatusCodes.BAD_REQUEST).send(err.message)
  }
})

router.delete('/:id', async (request, response) => {
  try {
    const electionService = new ElectionService(database)
    const id: number = Number.parseInt(request.params.id)
    const result = await electionService.deleteElectionById(id)
    response.status(StatusCodes.ACCEPTED).json(result)
  } catch (err) {
    response.status(StatusCodes.BAD_REQUEST).send(err.message)
  }
})

export default router
