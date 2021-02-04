import { Router } from 'express'

const router = Router()

router.post('/register', (request, response) => {
  console.log('Register')
  response.send()
})

router.post('/login', (request, response) => {
  console.log('Login')
  response.send()
})

export default router
