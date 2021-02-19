import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { database } from '@/loaders'
import { IBallot } from '@/models/Ballot/IBallot'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.post('/', async (request, response, next) => {
  try {
    const ballotService = new BallotService(database, new ElectionService(database))
    const newBallot = request.body as IBallot
    const ballot = await ballotService.create(newBallot)
    return response.send(ballot)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (request, response, next) => {
  try {
    // TODO Validate that the user owns/ is allowed to get this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const ballot = await ballotSerivce.get(id)

    if (!ballot) throw new NotFoundError({ message: ServerErrorMessage.notFound('Ballot') })
    return response.send(ballot)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {
    // TODO Validate that the user owns/ is allowed to delete this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    await ballotSerivce.delete(id)

    return response.status(StatusCodes.OK).send()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    // TODO Validate that the user owns/ is allowed to update this ballot
    const ballotSerivce = new BallotService(database, new ElectionService(database))
    const id = Number.parseInt(request.params.id)
    const ballot = request.body as IBallot
    const updatedBallot = await ballotSerivce.update(id, ballot)
    return response.status(StatusCodes.OK).send(updatedBallot)
  } catch (error) {
    next(error)
  }
})

export default router
