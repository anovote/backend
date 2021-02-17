import { Router } from 'express'
import authRoutes from '@/api/routes/auth'
import electionRoutes from '@/api/routes/elections'
import { checkAuth } from './middleware/authentication'
import { enforceContentTypeJson } from './middleware/enforceContentTypeJson'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100,
  message: 'Request limit reached',
  headers: true
})

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10,
  message: 'Too many login attempts. Try again later',
  headers: true
})

const publicRoutes = Router()
publicRoutes.use('/auth/login', loginLimiter)
publicRoutes.use('/auth', authRoutes)

const voterRoutes = Router()
// Add voter routes....

const organizerRoutes = Router()
organizerRoutes.use(apiLimiter)
organizerRoutes.use(enforceContentTypeJson)
organizerRoutes.use(checkAuth)
organizerRoutes.use('/elections', electionRoutes)

export default Router()
  .use(morgan('dev'))
  .use('/public', publicRoutes)
  .use('/voter', voterRoutes)
  .use('/admin', organizerRoutes)
