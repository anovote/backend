import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
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
            response.send(socketRoom)
        }
    } catch (error) {
        next(error)
    }
})

export default router
