import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'
import { AuthenticationService } from '@/services/AuthenticationService'
import { database } from '@/loaders'

const router = Router()
const authenticationService = new AuthenticationService()

router.put('/changePassword', async (request, response) => {
    const electionOrganizerService = new ElectionOrganizerService(database)
    try {
        const token = request.headers.authorization
        const id = authenticationService.verifyToken(token).id
        const newPassword = request.body.newPassword
        await electionOrganizerService.updatePassword(newPassword, id)
        response.status(StatusCodes.OK)
        response.send('Password was updated')
    } catch (e) {
        response.status(StatusCodes.BAD_REQUEST)
        response.send('Election organizer not found')
        console.log(e)
    }
})

export default router
