import { database } from '@/loaders'
import { Election } from '@/models/Election/ElectionEntity'
import { IElection } from '@/models/Election/IElection'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { isObjectEmpty } from '@/helpers/isObjectEmpty'

const router = Router()

router.post('/', async (request, response, next) => {
  try {
    const electionService = new ElectionService(database)
    const electionDTO: IElection = request.body

    if (!electionDTO || isObjectEmpty(electionDTO)) {
      throw new Error('No data')
    }

    const election: Election | undefined = await electionService.createElection(electionDTO)
    response.status(StatusCodes.CREATED).json(election)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (request, response, next) => {
  try {
    const electionService = new ElectionService(database)
    const elections: Election[] | undefined = await electionService.getAllElections()
    response.json(elections)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (request, response, next) => {
  try {
    const electionService = new ElectionService(database)
    const id: number = Number.parseInt(request.params.id)
    const election = await electionService.getElectionById(id)
    if (!election) throw new Error(`Could not find election with id ${id}`)
    response.status(StatusCodes.OK).json(election)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const electionService = new ElectionService(database)
    const id: number = Number.parseInt(request.params.id)
    const { election } = request.body
    if (!election) {
      throw new Error('No data')
    }
    const result = await electionService.updateElectionById(id, election)
    response.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {
    const electionService = new ElectionService(database)
    const id: number = Number.parseInt(request.params.id)
    const result = await electionService.deleteElectionById(id)
    response.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
