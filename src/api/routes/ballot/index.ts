import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { BallotService } from '@/services/BallotService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.post('/', async (request, response) => {
  try {
    const ballotSerivce = new BallotService(database)
    const newBallot = request.body as IBallot
    const ballot = await ballotSerivce.create(newBallot)
    return ballot ? response.send(ballot) : response.status(StatusCodes.BAD_REQUEST).send('Could not create the ballot')
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
  }
})

router.get('/:id', async (request, response) => {
  try {
    // TODO Validate that the user owns/ is allowd to get this ballot
    const ballotSerivce = new BallotService(database)
    const id = Number.parseInt(request.params.id)
    const ballot = await ballotSerivce.get(id)
    return ballot instanceof Ballot ? response.send(ballot) : response.status(StatusCodes.NOT_FOUND).send()
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
  }
})

router.delete('/:id', async (request, response) => {
  try {
    // TODO Validate that the user owns/ is allowd to delete this ballot
    const ballotSerivce = new BallotService(database)
    const id = Number.parseInt(request.params.id)
    const deletedBallot = await ballotSerivce.delete(id)
    deletedBallot ? response.status(StatusCodes.OK) : response.status(StatusCodes.NOT_FOUND)
    response.send()
  } catch (error) {
    logger.error(error)
    return response.status(StatusCodes.BAD_REQUEST).send('Something went wrong')
  }
})

router.put('/:id', async (request, response) => {
  try {
    // TODO Validate that the user owns/ is allowd to update this ballot
    const ballotSerivce = new BallotService(database)
    const id = Number.parseInt(request.params.id)
    const ballot = request.body as IBallot
    const updatedBallot = await ballotSerivce.update(id, ballot)
    updatedBallot ? response.send(updatedBallot) : response.status(StatusCodes.NOT_FOUND).send()
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
  }
})

export default router
