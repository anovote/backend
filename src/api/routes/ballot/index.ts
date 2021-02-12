import { CreateError } from '@/lib/Errors/CreateError'
import { NotFoundError } from '@/lib/Errors/NotFoundError'
import { UpdateError } from '@/lib/Errors/UpdateError'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.post('/', async (request, response) => {
  try {
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const newBallot = request.body as IBallot
    const ballot = await ballotSerivce.create(newBallot)
    return ballot ? response.send(ballot) : response.status(StatusCodes.BAD_REQUEST).send('Unable to create ballot')
  } catch (error) {
    if (error instanceof NotFoundError) return response.status(StatusCodes.NOT_FOUND).send('Unable to find election')
    if (error instanceof CreateError) return response.status(StatusCodes.BAD_REQUEST).send('Unable to create ballot')
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong')
  }
})

router.get('/:id', async (request, response) => {
  try {
    // TODO Validate that the user owns/ is allowd to get this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const ballot = await ballotSerivce.get(id)
    return ballot instanceof Ballot ? response.send(ballot) : response.status(StatusCodes.NOT_FOUND).send()
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong')
  }
})

router.delete('/:id', async (request, response) => {
  try {
    // TODO Validate that the user owns/ is allowd to delete this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const deletedBallot = await ballotSerivce.delete(id)
    deletedBallot ? response.status(StatusCodes.OK) : response.status(StatusCodes.NOT_FOUND)
    response.send()
  } catch (error) {
    logger.error(error)
    if (error instanceof NotFoundError) return response.status(StatusCodes.NOT_FOUND).send('Unable to find ballot')
    response.status(StatusCodes.BAD_REQUEST).send('Something went wrong')
  }
})

router.put('/:id', async (request, response) => {
  try {
    // TODO Validate that the user owns/ is allowd to update this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const ballot = request.body as IBallot
    const updatedBallot = await ballotSerivce.update(id, ballot)
    updatedBallot ? response.send(updatedBallot) : response.status(StatusCodes.NOT_FOUND).send()
  } catch (error) {
    if (error instanceof NotFoundError) return response.status(StatusCodes.NOT_FOUND).send('Unable to find ballot')
    if (error instanceof UpdateError) return response.status(StatusCodes.BAD_REQUEST).send('Unable to update ballot')
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong')
  }
})

export default router
