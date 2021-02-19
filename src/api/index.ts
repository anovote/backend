import { Router } from 'express'
import authRoutes from '@/api/routes/auth'

import electionRoutes from '@/api/routes/elections'
import electionOrganizerRoutes from '@/api/routes/electionOrganizer'
import ballotRoutes from '@/api/routes/ballot'
import { checkAuth } from './middleware/authentication'
import { enforceContentTypeJson } from './middleware/enforceContentTypeJson'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler'
import { rateLimits } from './middleware/rateLimits'


const publicRoutes = Router()
publicRoutes.use('/auth/login', rateLimits.loginLimiter)
publicRoutes.use('/auth', authRoutes)

const voterRoutes = Router()
// Add voter routes....

const organizerRoutes = Router()
organizerRoutes.use(rateLimits.apiLimiter)
organizerRoutes.use(enforceContentTypeJson)
organizerRoutes.use(checkAuth)
organizerRoutes.use('/elections', electionRoutes)
organizerRoutes.use('/electionOrganizer', electionOrganizerRoutes)
organizerRoutes.use('/ballots', ballotRoutes)

export default Router()
  .use(morgan('dev'))
  .use('/public', publicRoutes)
  .use('/voter', voterRoutes)
  .use('/admin', organizerRoutes)
  .use(errorHandler)
