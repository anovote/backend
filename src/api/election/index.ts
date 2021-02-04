import { Router } from 'express'

const router = Router()

router.post('/', (request, response) => {
  console.log('CREATE')
  response.send()
})

router.get('/:id', (request, response) => {
  console.log('GET')
  response.send()
})

export default router
