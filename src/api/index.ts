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
import voterElectionRoutes from './routes/voter/election'
import electionStatsRouter from './routes/elections/ElectionStatsRoute'
const status = Router()

status.get('/', (request, response, next) => {
    return response.json()
})

const publicRoutes = Router()
publicRoutes.use('/auth/login', rateLimits.loginLimiter)
publicRoutes.use('/auth', authRoutes)

const voterRoutes = Router()
// voterRoutes.use(checkVoterAuth) Todo
voterRoutes.use('/elections', voterElectionRoutes)
// Add voter routes....

const organizerRoutes = Router()
organizerRoutes.use(rateLimits.apiLimiter)
organizerRoutes.use(enforceContentTypeJson)
organizerRoutes.use(checkAuth)
organizerRoutes.use('/elections', electionRoutes)
organizerRoutes.use('/electionOrganizer', electionOrganizerRoutes)
organizerRoutes.use('/elections/:electionId/ballots', ballotRoutes)
organizerRoutes.use('/elections/:electionId/stats', electionStatsRouter)

const routes = Router()
    .use(morgan('dev'))
    .use('/status', status)
    .use('/public', publicRoutes)
    .use('/voter', voterRoutes)
    .use('/admin', organizerRoutes)
    .use(errorHandler)

export default Router().use('/api', routes)
