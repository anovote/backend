import { Router } from 'express'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'
import { AuthenticationService } from '@/services/AuthenticationService'

const router = Router()
const electionOrganizerService = new ElectionOrganizerService()
const authenticationService = new AuthenticationService()

router.put('/changePassword', async (request, response) => {
  try {
    const token = request.headers.authorization
    const id = (await authenticationService.verifyToken(token)).id
    const newPassword = request.body.newPassword
    electionOrganizerService.updatePassword(newPassword, id)
    response.status(StatusCodes.OK)
    response.send('Password was updated')
  } catch (e) {
    response.status(StatusCodes.BAD_REQUEST)
    response.send('Election organizer not found')
    console.log(e)
  }
})

export default router