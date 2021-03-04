import { database } from '@/loaders'
import { SocketRoomService } from '@/services/SocketRoomService'
import { Router } from 'express'

const router = Router()

router.get('/:electionId', async (request, response, next) => {
    const electionId = Number.parseInt(request.params.electionId)
    const socketRoomService = new SocketRoomService(database)
    await socketRoomService.getById(electionId)
})

export default router
