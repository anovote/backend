import { database } from '@/loaders'
import { Election } from '@/models/Election/ElectionEntity'
import { IElection } from '@/models/Election/IElection'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { isObjectEmpty } from '@/helpers/isObjectEmpty'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { SocketRoomService } from '@/services/SocketRoomService'

const router = Router()

router.post('/', async (request, response, next) => {
    try {
        const electionService = new ElectionService(database, request.electionOrganizer)
        const socketRoomService = SocketRoomService.getInstance()
        const electionDTO: IElection = request.body

        if (!electionDTO || isObjectEmpty(electionDTO)) {
            throw new BadRequestError({ message: 'Empty request' })
        }

        electionDTO.electionOrganizer = request.electionOrganizer

        const election: Election | undefined = await electionService.create(electionDTO)
        if (election) {
            socketRoomService.createRoom(election)
        }
        response.status(StatusCodes.CREATED).json(election)
    } catch (error) {
        next(error)
    }
})

router.get('/', async (request, response, next) => {
    try {
        const electionService = new ElectionService(database, request.electionOrganizer)
        const elections: Election[] | undefined = await electionService.get()
        response.json(elections)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (request, response, next) => {
    try {
        const electionService = new ElectionService(database, request.electionOrganizer)
        const id: number = Number.parseInt(request.params.id)
        const election = await electionService.getById(id)
        if (!election) throw new NotFoundError({ message: ServerErrorMessage.notFound(`Election`) })
        response.status(StatusCodes.OK).json(election)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (request, response, next) => {
    try {
        const electionService = new ElectionService(database, request.electionOrganizer)
        const id: number = Number.parseInt(request.params.id)
        const { election } = request.body
        if (!election) {
            throw new BadRequestError({ message: 'Empty request' })
        }
        const result = await electionService.update(id, election)
        response.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        const electionService = new ElectionService(database, request.electionOrganizer)
        const id: number = Number.parseInt(request.params.id)
        const result = await electionService.delete(id)
        response.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
})

export default router
