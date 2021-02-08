import { AuthenticationService } from '@/services/AuthenticationService'
import { Router } from 'express'

const authService = new AuthenticationService()

const router = Router()

router.post('/register', (request, response) => {
  console.log('Register')
  response.send()
})

router.post('/login', async (request, response) => {
  console.log('Login')
  try {
    const token = await authService.login(request.body)
    response.json({ token: token })
  } catch (e) {
    console.log('ERROR: ', e)
    response.sendStatus(404)
  }
})

export default router
