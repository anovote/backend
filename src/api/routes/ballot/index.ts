import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot'
import { ElectionService } from '@/services/ElectionService'
import { Router } from 'express'

const router = Router()

router.post('/', async (request, response) => {
  try {
    const db = database.getRepository(Ballot)
    await db.save(db.create(request.body))
    return response.send('Created :D')
  } catch (error) {
    console.log(error)

    response.status(400).send()
  }
})

router.get('/:id', (request, response) => {
  console.log('GET')
  response.send()
})

export default router
