import { Router } from 'express'
import authRoutes from '@/api/routes/auth'

import electionRoutes from '@/api/routes/elections'
import ballotRoutes from '@/api/routes/ballot'
import { checkAuth } from './middleware/authentication'
import { enforceContentTypeJson } from './middleware/enforceContentTypeJson'

const publicRoutes = Router()
publicRoutes.use('/auth', authRoutes)

const voterRoutes = Router()
// Add voter routes....

const organizerRoutes = Router()
organizerRoutes.use(enforceContentTypeJson)
organizerRoutes.use(checkAuth)
organizerRoutes.use('/elections', electionRoutes)
organizerRoutes.use('/ballots', ballotRoutes)

export default Router().use('/public', publicRoutes).use('/voter', voterRoutes).use('/admin', organizerRoutes)
