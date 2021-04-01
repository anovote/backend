import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { IElectionBase } from '@/models/Election/IElectionBase'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Router } from 'express'

const router = Router()

router.get('/:electionId', async (request, response, next) => {
    try {
        const electionId = Number.parseInt(request.params.electionId)
        const socketRoomService = SocketRoomService.getInstance()
        const socketRoom = await socketRoomService.getById(electionId)
        if (!socketRoom) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Room') })
        } else {
            const election: IElectionBase = {
                title: socketRoom.election.title,
                description: socketRoom.election.description,
                image: socketRoom.election.image,
                openDate: socketRoom.election.openDate,
                closeDate: socketRoom.election.closeDate,
                isLocked: socketRoom.election.isLocked,
                status: socketRoom.election.status,
                isAutomatic: socketRoom.election.isAutomatic
            }
            response.send(election)
        }
    } catch (error) {
        next(error)
    }
})
export default router
