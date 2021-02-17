import { CreateError } from '@/lib/Errors/CreateError'
import { NotFoundError } from '@/lib/Errors/NotFoundError'
import { UpdateError } from '@/lib/Errors/UpdateError'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { IBallot } from '@/models/Ballot/IBallot'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.post('/', async (request, response, next) => {
  try {
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const newBallot = request.body as IBallot
    const ballot = await ballotSerivce.create(newBallot)
    if (ballot) {
      return response.send(ballot)
    } else {
      return response.status(StatusCodes.BAD_REQUEST).send('Unable to create ballot')
    }
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (request, response, next) => {
  try {
    // TODO Validate that the user owns/ is allowd to get this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const ballot = await ballotSerivce.get(id)

    // TODO let error handle this not found situation
    if (ballot) {
      return response.send(ballot)
    } else {
      return response.status(StatusCodes.NOT_FOUND).send('Could not find ballot')
    }
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {
    // TODO Validate that the user owns/ is allowd to delete this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const deletedBallot = await ballotSerivce.delete(id)

    const statusCode = deletedBallot ? StatusCodes.OK : StatusCodes.NOT_FOUND
    return response.status(statusCode).send()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    // TODO Validate that the user owns/ is allowd to update this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const ballot = request.body as IBallot
    const updatedBallot = await ballotSerivce.update(id, ballot)
    if (updatedBallot) {
      return response.send(updatedBallot)
    } else {
      return response.status(StatusCodes.NOT_FOUND).send()
    }
  } catch (error) {
    next(error)
  }
})

export default router
