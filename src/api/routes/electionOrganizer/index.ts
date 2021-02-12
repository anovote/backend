import { Router } from 'express'
import { IUpdatePassword } from '../../../models/ElectionOrganizer/IUpdatePassword'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { StatusCodes } from 'http-status-codes'

const router = Router()
const electionOrganizerService = new ElectionOrganizerService()

router.put('/', async (request, response) => {
  try {
    const updateObject: IUpdatePassword = request.body
    const updatedElectionOrganizer = await electionOrganizerService.updatePassword(
      updateObject.passwordToUpdate,
      updateObject.emailOfElectionOrganizer
    )
    response.status(StatusCodes.ACCEPTED)
    response.json({ updatedElectionOrganizer })
  } catch (e) {
    if (e instanceof RangeError) {
      console.log('ERROR: ', e)
    }
  }
})

export default router
