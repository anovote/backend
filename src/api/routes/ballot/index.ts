import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { database } from '@/loaders'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router({ mergeParams: true })

router.post('/', async (request, response, next) => {
    try {
        const ballotService = new BallotService(
            database,
            new ElectionService(database, request.electionOrganizer),
            request.electionOrganizer
        )
        const newBallot = request.body as IBallot
        const electionId = Number.parseInt(request.params.electionId)

        const ballot = await ballotService.create(newBallot, { parentId: electionId })
        return response.send(ballot)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (request, response, next) => {
    try {
        // TODO Validate that the user owns/ is allowed to get this ballot
        const ballotService = new BallotService(
            database,
            new ElectionService(database, request.electionOrganizer),
            request.electionOrganizer
        )
        const id = Number.parseInt(request.params.id)
        const ballot = await ballotService.getById(id)

        if (!ballot) throw new NotFoundError({ message: ServerErrorMessage.notFound('Ballot') })
        return response.send(ballot)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        // TODO Validate that the user owns/ is allowed to delete this ballot
        const ballotService = new BallotService(
            database,
            new ElectionService(database, request.electionOrganizer),
            request.electionOrganizer
        )
        const id = Number.parseInt(request.params.id)
        await ballotService.delete(id)

        return response.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (request, response, next) => {
    try {
        // TODO Validate that the user owns/ is allowed to update this ballot
        const ballotService = new BallotService(
            database,
            new ElectionService(database, request.electionOrganizer),
            request.electionOrganizer
        )
        const id = Number.parseInt(request.params.id)
        const ballot = request.body as Ballot
        const updatedBallot = await ballotService.update(id, ballot)
        return response.status(StatusCodes.OK).send(updatedBallot)
    } catch (error) {
        next(error)
    }
})

export default router
